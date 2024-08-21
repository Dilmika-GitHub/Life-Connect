import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions, Image, ActivityIndicator, BackHandler } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AwesomeAlert from 'react-native-awesome-alerts';
import { BASE_URL, ENDPOINTS } from "../services/apiConfig";
import { FirstPlaceSvg, SecondPlaceSvg, ThirdPlaceSvg } from "../../components/Top3";
import { Ionicons } from "@expo/vector-icons";
import { encode } from 'base64-arraybuffer';

const screenWidth = Dimensions.get('window').width;

const WinnersScreen = () => {
  const [winnersData, setWinnersData] = useState([]);
  const [branchRegionalData, setBranchRegionalData] = useState([]);
  const [lifeMembersData, setLifeMembersData] = useState([]);
  const [isLifeMember, setIsLifeMember] = useState(false);
  const [agentProfile, setAgentProfile] = useState(null);
  const [personalMdrt, setPersonalMdrt] = useState(null);
  const [selectedValue, setSelectedValue] = useState('Island Ranking');
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [branchName, setBranchName] = useState('');
  const [regionName, setRegionName] = useState('');
  const navigation = useNavigation();
  const [userProfileImage, setUserProfileImage] = useState(null);


  const currentYear = new Date().getFullYear();

  // Cache for profile images
  const profileImageCache = {};

  const handleErrorResponse = (error) => {
    if (error.response?.status === 401) {
      console.log(error.response.status);
      setShowAlert(true);
    } else {
      setError(true);
    }
  };

  const handleConfirm = () => {
    setShowAlert(false);
    navigation.navigate('Login');
  };

  const fetchAgentProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const email = await AsyncStorage.getItem('email');
      const catType = await AsyncStorage.getItem('categoryType');
      if (!token || !email || !catType) {
        throw new Error('No token, email, or category type found');
      }

      const response = await axios.get(`${BASE_URL}${ENDPOINTS.PROFILE_DETAILS}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { email, catType }
      });

      setAgentProfile(response.data);
      const agency_code1 = response.data.personal_agency_code;
      const agency_code2 = response.data.newagt || 0;
      fetchPersonalMdrt(agency_code1, agency_code2, catType);
    } catch (error) {
      handleErrorResponse(error);
      console.error('Error fetching agent profile:', error.message);
    }
  };

  const fetchPersonalMdrt = async (agency_code1, agency_code2, catType) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const response = await axios.get(`${BASE_URL}${ENDPOINTS.PERSONAL_MDRT}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { p_agency_1: agency_code1, p_agency_2: agency_code2, p_cat: catType, p_year: currentYear }
      });

      setPersonalMdrt(response.data);
      setBranchName(response.data.branch_name);
      setRegionName(response.data.region);
    } catch (error) {
      handleErrorResponse(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBranchRegionalRankMdrt = async (rankingType, agency_code1, agency_code2, catType) => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('accessToken');
      const endpoint = rankingType === 'Branch Ranking' ? 'GetBranchRankMDRT' : 'GetRegionalRankMDRT';
      const response = await axios.get(`${BASE_URL}/Mdrt/${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { p_agency_1: agency_code1, p_agency_2: agency_code2, p_cat: catType, p_year: currentYear }
      });
  
      // Fetch profile images for each agent before rendering
      const formattedData = await Promise.all(
        response.data.map(async (item) => {
          const profileImageUrl = await fetchProfileImage(item.agency_code_1); // Fetch profile image using agency_code_1
  
          return {
            name: item.agent_name.trim(),
            achievedTarget: item.fyp.toLocaleString('en-US', { maximumFractionDigits: 2 }),
            NOP: item.nop.toString(),
            rank: rankingType === 'Branch Ranking' ? item.branch_rank : item.region_rank,
            achievement: item.achievment,
            balanceDue: item.balanceDue,
            profileImageUrl, // Attach the fetched profile image URL
          };
        })
      );
  
      // Sort the data by achieved target
      formattedData.sort((a, b) => parseInt(b.achievedTarget.replace(/,/g, '')) - parseInt(a.achievedTarget.replace(/,/g, '')));
      setBranchRegionalData(formattedData);
    } catch (error) {
      handleErrorResponse(error);
      console.error(`Error fetching ${rankingType} data:`, error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfileImage = async () => {
    try {
      if (agentProfile?.personal_agency_code) {
        const profileImageUrl = await fetchProfileImage(agentProfile.personal_agency_code);
        setUserProfileImage(profileImageUrl);
      }
    } catch (error) {
      console.error('Error fetching user profile image:', error.message);
    }
  };
  
  const fetchProfileImage = async (agencyCode) => {
    try {
      // Check if the image is in the cache
      if (profileImageCache[agencyCode]) {
        return profileImageCache[agencyCode];
      }

      const token = await AsyncStorage.getItem('accessToken');
      const response = await axios.get(`${BASE_URL}/${ENDPOINTS.GET_IMAGE}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { fileName: agencyCode },
        responseType: 'arraybuffer', // Return binary data
      });

      // Convert arraybuffer to base64
      const base64Image = `data:image/png;base64,${encode(response.data)}`;

      // Store the image in the cache
      profileImageCache[agencyCode] = base64Image;

      return base64Image;
    } catch (error) {
      console.error(`Error fetching profile image for agencyCode ${agencyCode}:`, error.message);
      return null;
    }
  };

  const fetchWinnersData = async (rankingType) => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('accessToken');
      const endpoint = getEndpoint(rankingType);

      const response = await axios.get(`${BASE_URL}${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { p_year: currentYear }
      });

      const formattedData = await Promise.all(
        response.data.map(async (item) => {
          const profileImageUrl = await fetchProfileImage(item.agency_code_1.trim());

          return {
            name: item.agent_name.trim(),
            achievedTarget: item.fyp.toLocaleString('en-US', { maximumFractionDigits: 2 }),
            NOP: item.nop.toString(),
            rank: item.national_rank,
            achievement: item.achievment,
            balanceDue: item.balanceDue,
            profileImageUrl,
          };
        })
      );

      formattedData.sort((a, b) => parseInt(b.achievedTarget.replace(/,/g, '')) - parseInt(a.achievedTarget.replace(/,/g, '')));

      if (rankingType === 'Life Members') {
        setLifeMembersData(formattedData);
      } else {
        setWinnersData(formattedData);
      }
    } catch (error) {
      handleErrorResponse(error);
      console.error('Error fetching data:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const getEndpoint = (rankingType) => {
    switch (rankingType) {
      case 'Island Ranking':
        return ENDPOINTS.ISLANDRANK;
      case 'Branch Ranking':
        return ENDPOINTS.BRANCHRANK;
      case 'Regional Ranking':
        return ENDPOINTS.TEAMRANK;
      case 'TOT Ranking':
        return ENDPOINTS.TOTRANK;
      case 'COT Ranking':
        return ENDPOINTS.COTRANK;
      case 'Life Members':
        return ENDPOINTS.LIFE_MEMBER_MDRT;
      default:
        return ENDPOINTS.ISLANDRANK;
    }
  };

  const handleSelectionChange = (val) => {
    setSelectedValue(val);
    setShowDropdown(false);
    setError(false);
    if (val === 'Branch Ranking' || val === 'Regional Ranking') {
      const agency_code1 = agentProfile?.personal_agency_code;
      const agency_code2 = agentProfile?.newagt || 0;
      const catType = agentProfile?.stid;
      fetchBranchRegionalRankMdrt(val, agency_code1, agency_code2, catType);
    } else if (val === 'Life Members') {
      checkIfUserIsLifeMember();
    } else {
      fetchWinnersData(val);
    }
  };

  const checkIfUserIsLifeMember = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const response = await axios.get(`${BASE_URL}${ENDPOINTS.LIFE_MEMBER_MDRT}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { p_year: currentYear }
      });

      const userOrganizerCode = agentProfile?.personal_agency_code;
      const isLifeMember = response.data.some(member =>
        member.agency_code_1 === userOrganizerCode || member.agency_code_2 === userOrganizerCode
      );

      setIsLifeMember(isLifeMember);

      const formattedData = response.data.map(item => ({
        name: item.agent_name.trim(),
        achievedTarget: item.fyp.toLocaleString('en-US', { maximumFractionDigits: 2 }),
        NOP: item.nop.toString(),
        rank: item.national_rank,
        achievement: item.achievment,
        balanceDue: item.balanceDue
      }));

      formattedData.sort((a, b) => parseInt(b.achievedTarget.replace(/,/g, '')) - parseInt(a.achievedTarget.replace(/,/g, '')));
      setWinnersData(formattedData);
    } catch (error) {
      handleErrorResponse(error);
      console.error('Error fetching life member details:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          await fetchAgentProfile();
          await fetchWinnersData('Island Ranking');
        } catch (error) {
          setError(true);
          setLoading(false);
        }
      };
      fetchData();

      const onBackPress = () => {
        navigation.navigate('MDRT');
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation])
  );

  useEffect(() => {
    // Fetch user profile image when the component mounts or agentProfile changes
    if (agentProfile) {
      fetchUserProfileImage();
    }
  }, [agentProfile]);

  const renderDropdown = () => {
    return (
      <View style={styles.headercontainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Ionicons name="menu" size={26} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.dcontainer}>
          <View style={styles.dropdownContainer}>
            <TouchableOpacity onPress={() => setShowDropdown(!showDropdown)} style={styles.dropdownTouchable}>
              <Text style={styles.dropdownText}>{selectedValue}</Text>
              <Icon name={showDropdown ? 'angle-up' : 'angle-down'} size={20} color="#000" style={styles.dropdownIcon} />
            </TouchableOpacity>
            {showDropdown && (
              <View style={styles.dropdownOptions}>
                {['Island Ranking', 'Branch Ranking', 'Regional Ranking', 'COT Ranking', 'TOT Ranking', 'Life Members'].map(rank => (
                  <TouchableOpacity key={rank} onPress={() => handleSelectionChange(rank)}>
                    <Text style={styles.optionText}>{rank}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            <AwesomeAlert
              show={showAlert}
              showProgress={false}
              title="Session Expired"
              message="Please Log Again!"
              closeOnTouchOutside={false}
              closeOnHardwareBackPress={false}
              showConfirmButton={true}
              confirmText="OK"
              confirmButtonColor="#08818a"
              onConfirmPressed={handleConfirm}
            />
          </View>
        </View>
      </View>
    );
  };

  const renderItem = ({ item, index }) => {
    return (
      <View style={[
        styles.itemContainer,
        selectedValue !== 'Life Members' && index < 3 && styles.highlightedItem,
        selectedValue !== 'Life Members' && item.achievement === 'Achieved' && index >= 3 && styles.achievedBeyondTopThree
      ]}>
        <View style={styles.iconContainer}>
          {item.profileImageUrl ? (
            <Image source={{ uri: item.profileImageUrl }} style={styles.profilePic} />
          ) : (
            <Icon name="user-circle" size={50} color="#C0C0C0" />
          )}
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.name}>{item.name}</Text>
          {selectedValue !== 'Life Members' && (
            <>
              <Text style={styles.achievedTarget}>Achieved Target: {item.achievedTarget}</Text>
              <Text style={styles.nop}>NOP: {item.NOP}</Text>
              <Text style={styles.place}>
                {selectedValue === 'Branch Ranking' ? `Branch Rank: ${item.rank}` : selectedValue === 'Regional Ranking' ? `Regional Rank: ${item.rank}` : `National Rank: ${item.rank}`}
              </Text>
              {item.achievement === 'Achieved' ? (
                <Text style={[styles.achievedText, styles.achievedTextGreen]}>ACHIEVED</Text>
              ) : (
                <Text style={[styles.achievedText, styles.achievedTextGray]}>
                  Needs: {item.balanceDue.toLocaleString('en-US')}
                </Text>
              )}
            </>
          )}
        </View>
        {selectedValue !== 'Life Members' && index === 0 && (
          <View style={styles.svgContainer}>
            <FirstPlaceSvg />
          </View>
        )}
        {selectedValue !== 'Life Members' && index === 1 && (
          <View style={styles.svgContainer}>
            <SecondPlaceSvg />
          </View>
        )}
        {selectedValue !== 'Life Members' && index === 2 && (
          <View style={styles.svgContainer}>
            <ThirdPlaceSvg />
          </View>
        )}
      </View>
    );
  };

  const renderUser = () => {
    if (!personalMdrt) {
      return null;
    }

    let userRank = '';
    let showUserRank = true;
    switch (selectedValue) {
      case 'Island Ranking':
        userRank = `${personalMdrt.mdrt_rank}`;
        break;
      case 'Branch Ranking':
        userRank = personalMdrt.branch_rank ? `${personalMdrt.branch_rank}` : 'No Branch Rank';
        break;
      case 'Regional Ranking':
        userRank = personalMdrt.region_rank ? `${personalMdrt.region_rank}` : 'No Regional Rank';
        break;
      case 'COT Ranking':
        userRank = personalMdrt.cot_rank ? `${personalMdrt.cot_rank}` : 'No COT Rank';
        break;
      case 'TOT Ranking':
        userRank = personalMdrt.tot_rank ? `${personalMdrt.tot_rank}` : 'No TOT Rank';
        break;
      case 'Life Members':
        showUserRank = false;
        userRank = isLifeMember ? 'You are a Life Member' : 'You are not a Life Member';
        break;
      default:
        userRank = `National Rank: ${personalMdrt.mdrt_rank}`;
        break;
    }

    return (
      <View style={[styles.itemContainer, styles.highlightedItem, { width: screenWidth * 0.97 }]}>
        <View style={styles.iconContainer}>
        <Image
              source={{ uri: userProfileImage }}
              style={styles.profilePicLarge}
              resizeMode="cover"
            />
        </View>
        <View style={styles.textContainer}>
          {showUserRank ? (
            <>
              <Text style={styles.uname}>Your place: {userRank}</Text>
              <Text style={styles.salesAmount}>
                Sales amount: {personalMdrt.fyp ? Number(personalMdrt.fyp).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.uname}>{userRank}</Text>
              <Text style={styles.salesAmount}>
                Sales amount: {personalMdrt.fyp ? Number(personalMdrt.fyp).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
              </Text>
            </>
          )}
        </View>
        <AwesomeAlert
          show={showAlert}
          showProgress={false}
          title="Session Expired"
          message="Please Log Again!"
          closeOnTouchOutside={false}
          closeOnHardwareBackPress={false}
          showConfirmButton={true}
          confirmText="OK"
          confirmButtonColor="#08818a"
          onConfirmPressed={handleConfirm}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderDropdown()}
      <Text style={styles.rightAlignedText}>
        {selectedValue === 'Branch Ranking' && branchName}
        {selectedValue === 'Regional Ranking' && regionName}
      </Text>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No data available</Text>
        </View>
      ) : 
      loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#08818a" />
        </View>        
      ) : (
        <>
          <FlatList
            data={selectedValue === 'Branch Ranking' || selectedValue === 'Regional Ranking' ||selectedValue === 'Life Members' ? branchRegionalData : winnersData}
            renderItem={renderItem}
            keyExtractor={item => item.name}
            contentContainerStyle={styles.flatListContainer}
          />
        </>
      )}
      <View style={{ alignItems: 'center' }}>
        {renderUser()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  body: {
    flex: 1,
    flexDirection: 'column',
  },
  dcontainer: {
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#08818a',
  },
  flatListContainer: {
    paddingBottom: 100,
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 10,
  },
  highlightedItem: {
    backgroundColor: '#FFD70020',
  },
  svgContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    position: 'absolute',
    top: '50%', 
    right: -2, 
    transform: [{ translateY: -20.5 }],
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  textContainer: {
    justifyContent: 'center',
  },
  centeredTextContainer: {
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  uname: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'left',
    marginLeft: 30,
  },
  achievedTarget: {
    fontSize: 14,
    color: 'gray',
  },
  salesAmount: {
    fontSize: 14,
    color: 'gray',
    marginLeft: 30,
    marginTop: 10,
  },
  nop: {
    fontSize: 14,
    color: 'gray',
  },
  achievedText: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: 'bold',
  },
  achievedTextGreen: {
    color: 'green',
  },
  achievedTextGray: {
    color: 'gray',
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  profilePicLarge: {
    width: 68,
    height: 68,
    borderRadius: 34,
  },
  dropdownContainer: {
    width: 170,
    backgroundColor: '#e8e6e3',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 10,
    alignSelf: 'flex-start',
  },
  dropdownTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownIcon: {
    marginLeft: 10,
  },
  dropdownOptions: {
    marginTop: 10,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    paddingVertical: 5,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 50,
    marginBottom: 360,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
  achievedBeyondTopThree: {
    backgroundColor: '#d4edda', // A greenish background color, change as per your UI theme
  },
  rightAlignedText: {
    position: 'absolute',
    right: 10,
    top: '8%',
    fontSize: 16,
    color: '#333',
  },
});

export default WinnersScreen;
