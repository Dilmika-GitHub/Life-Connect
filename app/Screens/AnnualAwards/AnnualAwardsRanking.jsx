import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions, Image, ActivityIndicator, BackHandler } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { BASE_URL, BASE_URL_V2, ENDPOINTS } from '../../services/apiConfig';
import AwesomeAlert from 'react-native-awesome-alerts';
import { encode } from 'base64-arraybuffer';

const screenWidth = Dimensions.get('window').width;

const AnnualAwardsRanking = () => {
  const [branchRanking, setBranchRanking] = useState([]);
  const [islandRanking, setIslandRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedValue, setSelectedValue] = useState('Branch Ranking');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [error, setError] = useState(false);
  const [agentProfile, setAgentProfile] = useState(null);
  const [branchName, setBranchName] = useState('');
  const [myRank, setMyRank] = useState({ branchRank: null, islandRank: null });
  const [userProfileImage, setUserProfileImage] = useState(null);
  const navigation = useNavigation();

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

  const fetchUserProfileImage = async (agencyCode, token) => {
    try {
      const url = `${BASE_URL}/${ENDPOINTS.GET_IMAGE}`;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
        params: { fileName: agencyCode },
        responseType: 'arraybuffer',
      });
  
      const base64Image = `data:image/png;base64,${encode(response.data)}`;
      setUserProfileImage(base64Image);
    } catch (error) {
      console.error(`Error fetching user profile image for agencyCode ${agencyCode}:`, error.message);
    }
  };
  

  const fetchRankings = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const agencyCode1 = await AsyncStorage.getItem('agencyCode1');
      let agencyCode2 = await AsyncStorage.getItem('agencyCode2');
      agencyCode2 = agencyCode2 !== null ? JSON.parse(agencyCode2) : null;
      agencyCode2 = agencyCode2 === null ? 0 : agencyCode2;
      const storedBranchName = await AsyncStorage.getItem('branchName');
      setBranchName(storedBranchName || '');
  
      if (!token || !agencyCode1 || !agencyCode2) {
        throw new Error('Missing token or agency codes');
      }
  
      await fetchUserProfileImage(agencyCode1, token);
  
      // Construct the URLs using BASE_URL_V2 and ENDPOINTS
      const branchRankUrl = `${BASE_URL_V2}${ENDPOINTS.ANNUAL_AWARDS_BRANCH_RANK}`;
      const islandRankUrl = `${BASE_URL_V2}${ENDPOINTS.ANNUAL_AWARDS_ISLAND_RANK}`;
  
      // Fetch branch ranking data
      const branchResponse = await axios.get(branchRankUrl, {
        headers: { Authorization: `Bearer ${token}` },
        params: { p_agency_1: agencyCode1, p_agency_2: agencyCode2 },
      });
      const branchData = await fetchProfileImages(branchResponse.data, token);
      setBranchRanking(branchData);
  
      // Fetch island ranking data
      const islandResponse = await axios.get(islandRankUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const islandData = await fetchProfileImages(islandResponse.data, token);
      setIslandRanking(islandData);
  
      const userBranch = branchResponse.data.find((item) => item.agency_code_1 === agencyCode1);
      const userIsland = islandResponse.data.find((item) => item.agency_code_1 === agencyCode1);
  
      // Set user's rank and achieved target
      setMyRank({
        branchRank: userBranch?.branch_rank || 'N/A',
        islandRank: userIsland?.slic_rank || 'N/A',
        fyp_c: userBranch?.fyp_c || userIsland?.fyp_c || 0, // Use branch or island fyp_c if available
      });
  
      setLoading(false);
    } catch (error) {
      handleErrorResponse(error);
      setLoading(false);
    }
  };
  
  

  const renderTopRightText = () => {
    if (selectedValue === 'Branch Ranking' && branchName) {
      return <Text style={styles.rightAlignedText}>Branch: {branchName}</Text>;
    }
    return null;
  };

  const fetchProfileImages = async (data, token) => {
    return await Promise.all(
      data.map(async (item) => {
        if (profileImageCache[item.agency_code_1]) {
          return {
            ...item,
            profileImageUrl: profileImageCache[item.agency_code_1],
          };
        }

        try {
            const url = `${BASE_URL}/${ENDPOINTS.GET_IMAGE}`;
          const response = await axios.get(
            url,
            {
              headers: { Authorization: `Bearer ${token}` },
              params: { fileName: item.agency_code_1 },
              responseType: 'arraybuffer',
            }
          );

          const base64Image = `data:image/png;base64,${encode(response.data)}`;
          profileImageCache[item.agency_code_1] = base64Image;

          return {
            ...item,
            profileImageUrl: base64Image,
          };
        } catch (error) {
          console.error(`Error fetching profile image for agencyCode ${item.agency_code_1}:`, error.message);
          return { ...item, profileImageUrl: null };
        }
      })
    );
  };

  useFocusEffect(
    useCallback(() => {
      fetchRankings();
      const onBackPress = () => {
        navigation.goBack();
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation])
  );

  const handleSelectionChange = (value) => {
    setSelectedValue(value);
    setShowDropdown(false);
  };

  const renderDropdown = () => (
    <View style={styles.headercontainer}>
    <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Ionicons name="menu" size={35} color="white" />
          </TouchableOpacity>
          <Text style={styles.menuText}>Annual Awards Ranking</Text>
        </View>
    <View style={styles.dropdownContainer}>
      <TouchableOpacity onPress={() => setShowDropdown(!showDropdown)} style={styles.dropdownTouchable}>
        <Text style={styles.dropdownText}>{selectedValue}</Text>
        <Icon name={showDropdown ? 'angle-up' : 'angle-down'} size={20} color="#000" />
      </TouchableOpacity>
      {showDropdown && (
        <View style={styles.dropdownOptions}>
          {['Branch Ranking', 'Island Ranking'].map((rank) => (
            <TouchableOpacity key={rank} onPress={() => handleSelectionChange(rank)}>
              <Text style={styles.optionText}>{rank}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
    </View>
  );

  const renderItem = ({ item, index }) => {
    // Determine the style based on the index
    const itemStyle =
      index === 0
        ? styles.firstPlace
        : index === 1
        ? styles.secondPlace
        : index === 2
        ? styles.thirdPlace
        : styles.defaultItem;
  
    return (
      <View style={[styles.itemContainer, itemStyle]}>
        <Image
          source={{ uri: item.profileImageUrl || null }}
          style={styles.profilePic}
        />
        <View style={styles.textContainer}>
          <Text style={styles.name}>{item.agent_name}</Text>
          <Text style={styles.achievedTarget}>{item.category}</Text>
          <Text style={styles.achievedTarget}>
            FYP: {item.fyp_c.toLocaleString('en-US')}
          </Text>
          <Text style={styles.achievedTarget}>NOP: {item.nop_count}</Text>
          <Text style={styles.rank}>
            {selectedValue === 'Branch Ranking'
              ? `Branch Rank: ${item.branch_rank}`
              : `Island Rank: ${item.slic_rank}`}
          </Text>
        </View>
      </View>
    );
  };
  

  const renderUser = () => (
    <View style={[styles.itemContainer, styles.highlightedItem]}>
    <Image
      source={{ uri: userProfileImage || null }}
      style={styles.profilePicLarge}
      resizeMode="cover"
    />
    <View style={styles.textContainer}>
      <Text style={styles.uname}>Your Place: {selectedValue === 'Branch Ranking' ? `${myRank.branchRank}` : `${myRank.islandRank}`}</Text>
      <Text style={styles.achievedTarget}>
        FYP: {myRank.fyp_c ? myRank.fyp_c.toLocaleString('en-US', { minimumFractionDigits: 2 }) : '0.00'}
      </Text>
    </View>
  </View>
  );

  return (
    <View style={styles.container}>
      {renderDropdown()}
      {renderTopRightText()}
      {loading ? (
        <ActivityIndicator size="large" color="#08818a" style={styles.loader} />
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No data available</Text>
        </View>
      ) : (
        <FlatList
          data={selectedValue === 'Branch Ranking' ? branchRanking : islandRanking}
          renderItem={renderItem}
          keyExtractor={(item) => item.agency_code_1}
          contentContainerStyle={styles.flatListContainer}
        />
      )}
      <View style={{ alignItems: 'center' }}>
        {renderUser()}
      </View>
      <AwesomeAlert
        show={showAlert}
        title="Session Expired"
        message="Please log in again."
        closeOnTouchOutside={false}
        showConfirmButton={true}
        confirmText="OK"
        confirmButtonColor="#08818a"
        onConfirmPressed={handleConfirm}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#08818a',
  },
  menuText: {
    color: 'white',
    paddingLeft: '8%',
    fontSize: 18,
  },
  dropdownContainer: {
    backgroundColor: '#e8e6e3',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    width: 150, // Decrease width for a more compact dropdown
    margin: 10,
    alignSelf: 'flex-start', // Align the dropdown to the left
  },
  dropdownTouchable: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 14, // Adjust font size to match the smaller dropdown
    color: '#333',
  },
  dropdownOptions: {
    backgroundColor: '#fff',
    borderRadius: 5,
    marginTop: 5,
  },
  optionText: {
    padding: 8, // Adjust padding to fit the smaller size
    fontSize: 14,
    color: '#333',
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    marginVertical: 5,
    borderRadius: 8,
    marginHorizontal: 10,
  },
  highlightedItem: {
    backgroundColor: '#FFD70020',
    width: '90%',
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  textContainer: {
    marginLeft: 10,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  achievedTarget: {
    fontSize: 14,
    color: 'gray',
  },
  rank: {
    fontSize: 14,
    color: '#08818a',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
  rightAlignedText: {
    position: 'absolute',
    right: 10,
    top: 75,
    fontSize: 16,
    color: '#333',
  },
  firstPlace: {
    backgroundColor: '#FFD70020', // Light gold background for first place
    borderColor: '#FFD700', // Gold border
    borderWidth: 2,
  },
  secondPlace: {
    backgroundColor: '#C0C0C020', // Light silver background for second place
    borderColor: '#C0C0C0', // Silver border
    borderWidth: 2,
  },
  thirdPlace: {
    backgroundColor: '#cd7f3220', // Light bronze background for third place
    borderColor: '#cd7f32', // Bronze border
    borderWidth: 2,
  },
  defaultItem: {
    backgroundColor: '#fff',
  },
  profilePicLarge: {
    width: 60,
    height: 60,
    borderRadius: 34,
  },
});

export default AnnualAwardsRanking;
