import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions, Image, BackHandler, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AwesomeAlert from 'react-native-awesome-alerts';
import { BASE_URL, ENDPOINTS } from "../services/apiConfig";
import { Bar1, Bar2 } from "../../components/Chart";
import Top3 from "../../components/Top3";

const screenWidth = Dimensions.get('window').width;

const WinnersScreen = () => {
  const [winnersData, setWinnersData] = useState([]);
  const [branchRegionalData, setBranchRegionalData] = useState([]);
  const [isLifeMember, setIsLifeMember] = useState(false);
  const [agentProfile, setAgentProfile] = useState(null);
  const [personalMdrt, setPersonalMdrt] = useState(null);
  const [selectedValue, setSelectedValue] = useState('Island Ranking');
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const navigation = useNavigation();

  const currentYear = new Date().getFullYear();

  const handleErrorResponse = (error) => {
    if (error.response && error.response.status === 401) {
      console.log(error.response.status);
      setShowAlert(true);
    } else {
      setErrorMessage('No data available');
    }
  };

  const handleConfirm = () => {
    setShowAlert(false);
    navigation.navigate('Login');
  };

  useEffect(() => {
    fetchAgentProfile();
    fetchWinnersData('Island Ranking');
    const timer = setTimeout(() => {
      if (winnersData.length === 0 && !errorMessage) {
        setErrorMessage('No data available for the selected ranking.');
      }
      setShowAlert(true);
    }, 300000); // Show alert after 5 minutes (300000 milliseconds)

    return () => clearTimeout(timer); // Clear timeout if the component is unmounted
  }, []);

  useEffect(() => {
    if (selectedValue === 'Life Members') {
      checkIfUserIsLifeMember();
    } else if (selectedValue === 'Branch Ranking' || selectedValue === 'Regional Ranking') {
      const code = agentProfile?.agent_code || agentProfile?.orgnizer_code;
      const catType = agentProfile?.stid;
      fetchBranchRegionalRankMdrt(selectedValue, code, catType);
    } else {
      fetchWinnersData(selectedValue);
    }
  }, [selectedValue, agentProfile]);
  

  const fetchAgentProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const email = await AsyncStorage.getItem('email');
      const catType = await AsyncStorage.getItem('categoryType');
      if (!token || !email || !catType) {
        throw new Error('No token, email, or category type found');
      }

      const url = `${BASE_URL}${ENDPOINTS.AGENT_PROFILE}?email=${email}&catType=${catType}`;
      console.log(`Fetching agent profile data from: ${url}`);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log('Full agent profile data response:', data);

      if (!data || (!data.agent_code && !data.orgnizer_code)) {
        throw new Error("Agent code or Organizer code not found in profile data.");
      }

      setAgentProfile(data);
      const code = data.agent_code || data.orgnizer_code;
      fetchPersonalMdrt(code, catType);
    } catch (error) {
      handleErrorResponse(error);
      console.error('Error fetching agent profile:', error.message);
    }
  };

  const fetchPersonalMdrt = async (code, catType) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token || !code || !catType) {
        throw new Error('No token, code, or category type found');
      }

      const url = `${BASE_URL}${ENDPOINTS.PERSONAL_MDRT}?p_agency_1=${code}&p_agency_2=0&p_cat=${catType}&p_year=${currentYear}`;
      console.log(`Fetching personal MDRT data from: ${url}`);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log('Personal MDRT data:', data);
      if (data.length === 0) {
        setErrorMessage('No personal MDRT data available.');
        return;
      }
      setPersonalMdrt(data);
    } catch (error) {
      handleErrorResponse(error);
      console.error('Error fetching personal MDRT data:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchBranchRegionalRankMdrt = async (rankingType, code, catType) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token || !code || !catType) {
        throw new Error('No token, code, or category type found');
      }

      const endpoint = getEndpoint(rankingType);
      const url = `${BASE_URL}${endpoint}?p_agency_1=${code}&p_agency_2=0&p_cat=${catType}&p_year=${currentYear}`;
      console.log(`Fetching ${rankingType} data from: ${url}`);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      if (data.length === 0) {
        setErrorMessage(`No data available for ${rankingType}.`);
        return;
      }
      const formattedData = data.map(item => ({
        name: item.agent_name.trim(),
        achievedTarget: item.fyp.toLocaleString('en-US', { maximumFractionDigits: 2 }),
        NOP: item.nop.toString(),
        rank: rankingType === 'Branch Ranking' ? item.branch_rank : item.region_rank
      }));
      console.log(`${rankingType} data:`, data);
      formattedData.sort((a, b) => parseInt(b.achievedTarget.replace(/,/g, '')) - parseInt(a.achievedTarget.replace(/,/g, '')));
      setBranchRegionalData(formattedData);
    } catch (error) {
      handleErrorResponse(error);
      console.error(`Error fetching ${rankingType} data:`, error.message);
    }
  };

  const fetchLifeMemberDetails = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No token found');
      }

      const url = `${BASE_URL}${ENDPOINTS.LIFE_MEMBER_MDRT}?p_year=${currentYear}`;
      console.log(`Fetching life member details from: ${url}`);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log('Life member data:', data)
      return data;
    } catch (error) {
      handleErrorResponse(error);
      console.error('Error fetching life member details:', error.message);
    }
  };

  const checkIfUserIsLifeMember = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No token found');
      }
  
      const url = `${BASE_URL}${ENDPOINTS.LIFE_MEMBER_MDRT}?p_year=${currentYear}`;
      console.log(`Fetching life member details from: ${url}`);
  
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
  
      const data = await response.json();
      console.log('Life member data:', data);
  
      const userOrganizerCode = agentProfile?.orgnizer_code;
      console.log('User organizer code:', userOrganizerCode);
  
      const isLifeMember = data.some(member => 
        member.agency_code_1 === userOrganizerCode || member.agency_code_2 === userOrganizerCode
      );
  
      console.log('Is life member:', isLifeMember);
      setIsLifeMember(isLifeMember);
  
      if (data.length === 0) {
        setErrorMessage('No life member data available.');
        return;
      }
  
      const formattedData = data.map(item => ({
        name: item.agent_name.trim(),
        achievedTarget: item.fyp.toLocaleString('en-US', { maximumFractionDigits: 2 }),
        NOP: item.nop.toString(),
        rank: item.national_rank
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
  

  const fetchWinnersData = async (rankingType) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No token found');
      }

      const endpoint = getEndpoint(rankingType);
      const url = `${BASE_URL}${endpoint}?p_year=${currentYear}`;

      console.log(`Fetching data from: ${url}`);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      if (data.length === 0) {
        setErrorMessage(`No winners data available for ${rankingType}.`);
        return;
      }
      const formattedData = data.map(item => ({
        name: item.agent_name.trim(),
        achievedTarget: item.fyp.toLocaleString('en-US', { maximumFractionDigits: 2 }),
        NOP: item.nop.toString(),
        rank: item.national_rank
      }));
      formattedData.sort((a, b) => parseInt(b.achievedTarget.replace(/,/g, '')) - parseInt(a.achievedTarget.replace(/,/g, '')));
      setWinnersData(formattedData);
    } catch (error) {
      handleErrorResponse(error);
      console.error('Error fetching data:', error.message);
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
    setErrorMessage('');  
  };

  const renderDropdown = () => {
    return (
      <View style={styles.dropdownContainer}>
        <TouchableOpacity onPress={() => setShowDropdown(!showDropdown)} style={styles.dropdownTouchable}>
          <Text style={styles.dropdownText}>{selectedValue}</Text>
          <Icon name={showDropdown ? 'angle-up' : 'angle-down'} size={20} color="#000" style={styles.dropdownIcon} />
        </TouchableOpacity>
        {showDropdown && (
          <View style={styles.dropdownOptions}>
            {['Island Ranking', 'Regional Ranking', 'Branch Ranking', 'COT Ranking', 'TOT Ranking', 'Life Members'].map(rank => (
              <TouchableOpacity key={rank} onPress={() => handleSelectionChange(rank)}>
                <Text style={styles.optionText}>{rank}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderItem = ({ item, index }) => {
    const target = parseInt(item.achievedTarget.replace(/,/g, '')) || 0;
    const achieved = target >= 6000000;

    return (
      <View style={[styles.itemContainer, index < 3 && styles.highlightedItem, achieved && index >= 3 && styles.achievedBeyondTopThree]}>
        <View style={styles.iconContainer}>
          <Icon name="user-circle" size={50} color={index < 3 ? '#A29D9C' : '#C0C0C0'} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.achievedTarget}>Achieved Target: {item.achievedTarget}</Text>
          <Text style={styles.nop}>NOP: {item.NOP}</Text>
          <Text style={styles.place}>
            {selectedValue === 'Branch Ranking' ? `Branch Rank: ${item.rank}` : selectedValue === 'Regional Ranking' ? `Regional Rank: ${item.rank}` : `National Rank: ${item.rank}`}
          </Text>
          {achieved ? (
            <Text style={[styles.achievedText, styles.achievedTextGreen]}>ACHIEVED</Text>
          ) : (
            <Text style={[styles.achievedText, styles.achievedTextGray]}>
              Needs: {(6000000 - target).toLocaleString('en-US')}
            </Text>
          )}
        </View>
        {index < 3 && (
          <View style={styles.svgContainer}>
            <Top3 />
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
            source={require('../../components/user.jpg')} 
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
      </View>
    );
  };

  const renderProfilePic = (winner) => {
    if (winner.profilePic) {
      return <Image source={winner.profilePic} style={styles.profilePic} />;
    } else {
      return <Icon name="user-circle" size={26} color="#FF5733" style={{ marginRight: 10 }} />;
    }
  };

  const topThreeWinners = winnersData.slice(0, 3);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.navigate('MDRT');
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation])
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderDropdown()}
      {errorMessage ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={selectedValue === 'Branch Ranking' || selectedValue === 'Regional Ranking' ? branchRegionalData : winnersData}
            renderItem={renderItem}
            keyExtractor={item => item.name}
            contentContainerStyle={styles.flatListContainer}
          />
        </>
      )}
      <View style={{ alignItems: 'center' }}>
        {renderUser()}
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
        confirmButtonColor="#FF7758"
        onConfirmPressed={handleConfirm}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
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
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 3,
  },
  highlightedItem: {
    backgroundColor: '#FFD70020',
  },
  svgContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    position: 'absolute',
    top: '50%', // Adjust this to align SVG vertically centered
    right: -2, // Adjust this to set the distance from the right edge
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
    marginBottom: 20,
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
});

export default WinnersScreen;