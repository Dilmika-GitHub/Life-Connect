import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import { BASE_URL, ENDPOINTS } from "../../../services/apiConfig";
import AwesomeAlert from 'react-native-awesome-alerts';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Ionicons } from "@expo/vector-icons";
import { lockToPortrait, lockToAllOrientations } from "../../OrientationLock";
import { useIsFocused } from '@react-navigation/native';

const MDRTProfile = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categoryType, setCategoryType] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [agencyCode, setAgencyCode] = useState(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const isFocused = useIsFocused();
  const [timeRemaining, setTimeRemaining] = useState({
    days: '',
    hours: '',
    minutes: '',
    seconds: '',
  });


  const handleErrorResponse = (error) => {
    if (error.response.status === 401) {
      console.log(error.response.status);
      setShowAlert(true);
    }
  };

  const handleConfirm = () => {
    setShowAlert(false);
    navigation.navigate('Login');
  };

  const formatConsiderAgencyCode = (code) => {
    const paddedCode = code.padStart(6, '0');
    return `L24${paddedCode}`;
  };

  const getAgencyCode = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken'); 
      const email = await AsyncStorage.getItem('email'); 
      const categoryType = await AsyncStorage.getItem('categoryType');
      setCategoryType(categoryType);

      const response = await axios.get(BASE_URL + ENDPOINTS.PROFILE_DETAILS, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          email: email,
          catType: categoryType
        }
      });

      setAgencyCode(response.data?.personal_agency_code);

      await AsyncStorage.setItem("agencyCode1", response.data?.personal_agency_code);

      let agencyCode2 = response.data?.newagt;
      agencyCode2 = agencyCode2 === null ? 0 : agencyCode2;
      
      // Convert agencyCode2 to a string before storing it
      await AsyncStorage.setItem("agencyCode2", JSON.stringify(agencyCode2));
     
    } catch (error) {
      console.log(error.message);
      handleErrorResponse(error);
      console.error('Error Getting Agency Code:', error.response?.status);
      throw error;
    }
  };



  const fetchMdrtPersonalData = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const agencyCode1 = await AsyncStorage.getItem('agencyCode1');
      console.log("ag1:", agencyCode1);
      let agencyCode2 = await AsyncStorage.getItem("agencyCode2");
      agencyCode2 = agencyCode2 !== null ? JSON.parse(agencyCode2) : null;
      agencyCode2 = agencyCode2 === null ? 0 : agencyCode2;
      console.log("ag2:",agencyCode2);
      const categoryType = await AsyncStorage.getItem('categoryType');
      const year = new Date().getFullYear();

      const response = await axios.get(BASE_URL + ENDPOINTS.MDRT_PROFILE, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          p_agency_1: agencyCode1,
          p_agency_2: agencyCode2,
          p_cat: categoryType,
          p_year: year
        }
      });

      setData(response.data);
    } catch (error) {
      console.log(error.message);
      handleErrorResponse(error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const fetchProfileImage = async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      console.log(agencyCode);

      const response = await axios.get(
        `${BASE_URL}/Image/GetProfileImage?fileName=${agencyCode}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'image/png; x-api-version=1',
          },
          responseType: 'blob',
        }
      );

      const blob = response.data;
      const imageUrl = await blobToBase64(blob);
      // const imageUrl = URL.createObjectURL(blob);

      setData((prevData) => ({
        ...prevData,
        profileImage: imageUrl,
      }));
    } catch (error) {
      console.error('Error fetching profile image:', error);
    }
  };

  const calculateTimeRemaining = () => {
    const currentDate = new Date();
    const endOfYear = new Date(currentDate.getFullYear(), 11, 31, 23, 59, 59);
    const timeDiff = endOfYear - currentDate;
    
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    setTimeRemaining({
      days,
      hours,
      minutes,
      seconds,
    });
  };

  useEffect(() => {

    if (isFocused) {
      lockToPortrait();
  }
    const interval = setInterval(calculateTimeRemaining, 1000);
    return () => clearInterval(interval);
  }, [isFocused]);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          await getAgencyCode();
          await fetchMdrtPersonalData();
          // Assuming that fetchProfileImage relies on data obtained from the above functions
          if (agencyCode) {
            await fetchProfileImage();
          } // Add fetchProfileImage to be called after the other data fetching functions
        } catch (error) {
          setError(true);
          setLoading(false);
        }
      };
  
      fetchData();
    }, [agencyCode])
  );
  

  // if (loading) {
  //   return (
  //     <View style={styles.loader}>
  //       <ActivityIndicator size="large" color="#08818a" />
  //     </View>
  //   );
  // }

  if (error) {
    return (
      <View style={styles.container}>
      <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
            <Ionicons name="menu" size={26} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
                onPress={() => navigation.navigate("MDRT Ranking")}
                style={styles.rankingImageContainer}
              >
                <Image
                  source={require("../../../../components/pngtree.png")}
                  style={styles.rankingimage}
                />
              </TouchableOpacity>
        </View>
      <View style={styles.loader}>
        <Text style={styles.errorText}>Not Applicable{error.message}</Text>
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
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
            <Ionicons name="menu" size={26} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
                onPress={() => navigation.navigate("MDRT Ranking")}
                style={styles.rankingImageContainer}
              >
                <Image
                  source={require("../../../../components/pngtree.png")}
                  style={styles.rankingimage}
                />
              </TouchableOpacity>
        </View>
      {/* Top section border */}
      <View style={[styles.section, styles.topSection]}></View>
      <View style={[styles.section, styles.topSection2]}></View>
      {/* Bottom section border */}
      <ScrollView style={[styles.section, styles.bottomSection]}>
        {/* New text container */}
        <View style={styles.fypContainer}>
          <Text style={styles.yearText}>{new Date().getFullYear()} FYP</Text>
          <Text style={styles.fypText}>
  {data?.fyp ? "Rs. " + new Intl.NumberFormat().format(data.fyp) : "N/A"}
</Text>

          <View style={styles.specialRow}>
            <Text style={styles.fypContainerRowsTitleText}>Target</Text>
            <Text style={styles.fypContainerRowsNormalText}>{data?.mdrt_target ? "Rs. " + new Intl.NumberFormat().format(data.mdrt_target) : "N/A"}</Text>
          </View>
          <View style={styles.specialRow}>
            <Text style={styles.fypContainerRowsTitleText}>NOP</Text>
            <Text style={styles.fypContainerRowsNormalText}>{data?.nop || "N/A"}</Text>
          </View>
          <View style={styles.countdownContainer}>
            <View style={styles.countdownBox}>
              <Text style={styles.countdownValue}>{timeRemaining.days}</Text>
              <Text style={styles.countdownLabel}>Days</Text>
            </View>
            <View style={styles.countdownBox}>
              <Text style={styles.countdownValue}>{timeRemaining.hours}</Text>
              <Text style={styles.countdownLabel}>Hours</Text>
            </View>
            <View style={styles.countdownBox}>
              <Text style={styles.countdownValue}>{timeRemaining.minutes}</Text>
              <Text style={styles.countdownLabel}>Mins</Text>
            </View>
            <View style={styles.countdownBox}>
              <Text style={styles.countdownValue}>{timeRemaining.seconds}</Text>
              <Text style={styles.countdownLabel}>Secs</Text>
            </View>
          </View>
        </View>

        {/* Grey color square text */}
        <View style={styles.greySquare}>
          <View style={styles.row}>
            <Text style={styles.titleText}>Agency Code</Text>
            <Text style={styles.normalText}>{formatConsiderAgencyCode(data?.consider_agency|| '0')}</Text>
          </View>
          <View style={styles.specialRow}>
            <Text style={styles.titleText}>Status</Text>
            {data?.mdrt_achievment === 'Achieved' ? (
              <Text style={styles.greenText}>{"Achieved"}</Text>
            ) : data?.mdrt_achievment === 'Not_achieved' ? (
              <Text style={styles.redText}>{"Not Achieved"}</Text>
            ) : null}
          </View>
          <View style={styles.specialRow}>
            <Text style={styles.titleText}>Island Rank</Text>
            <Text style={styles.normalText}>{data?.mdrt_rank || "N/A"}</Text>
          </View>
          <View style={styles.specialRow}>
            <Text style={styles.titleText}>Regional Rank</Text>
            <Text style={styles.normalText}>{data?.region_rank || "N/A"}</Text>
          </View>
          <View style={styles.specialRow}>
            <Text style={styles.titleText}>Branch Rank</Text>
            <Text style={styles.normalText}>{data?.branch_rank || "N/A"}</Text>
          </View>
          {data?.mdrt_achievment === 'Not_achieved' ? (
            <>
              <View style={styles.specialRow}>
                <Text style={styles.titleText}>Need more</Text>
                <Text style={styles.normalText}>{data?.mdrt_balance_due ? "Rs. " + new Intl.NumberFormat().format(data.mdrt_balance_due) : "N/A"}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.titleText}>Need more as Percentage</Text>
                <Text style={styles.normalText}>{data?.mdrt_bal_due_prec + '%' || "N/A"}</Text>
              </View>
            </>
          ) : null}
        </View>
      </ScrollView>

      {/* Profile Image */}
      <View style={styles.imageContainer}>
  {data?.profileImage ? (
    <Image
      source={{ uri: data.profileImage }}
      style={styles.roundImage}
      resizeMode="cover"
    />
  ) : (
    <Text style={styles.noImageText}>No profile image available</Text>
  )}
  <Text style={styles.imageText}>
    {userData?.intial?.trim()} {userData?.name?.trim()}
  </Text>

        <Text style={styles.imageText}>{data?.agent_name?.replace(/\s+/g, '')}</Text>
        <View style={styles.batchContainer}>
      {data?.mdrt_achievment === "Achieved" && (
        <Image
          source={require('../../../../assets/MDRT_Logo.png')}
          style={styles.batch}
        />
      )}

      {data?.cot_rank != null && (
        <Image
          source={require('../../../../assets/COT_Logo.png')}
          style={styles.batch}
        />
      )}

      {data?.tot_rank != null && (
        <Image
          source={require('../../../../assets/TOT_Logo.png')}
          style={styles.batch}
        />
      )}
    </View>
    {loading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#08818a" />
        </View>
      )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#08818a',
    justifyContent: 'space-between',
  },
  section: {
    width: '100%',
  },
  topSection: {
    flex: 0.25,
    backgroundColor: '#08818a',
  },
  topSection2: {
    flex: 0.4,
    backgroundColor: 'white',
    shadowColor:'black',
  },
  bottomSection: {
    flex: 5,
    backgroundColor: 'white',
  },
  imageContainer: {
    position: 'absolute',
    left: '50%',
    top: '21%',
    transform: [{ translateX: -100 }, { translateY: -100 }],
  },
  roundImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 3, // Border width for the gold color
    borderColor: 'gold', // Gold color for the border
  },
  imageText: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black'
  },
  greySquareScroll: {
    width: 320,
    backgroundColor: 'lightgrey',
    marginTop: 150,
    alignSelf: "center",
    borderRadius: 10,
    padding: 10,
  },
  fypContainer: {
    marginTop: 10,
    marginBottom: 1,
    alignItems: 'center',
    backgroundColor: '#08818a',
    alignSelf: 'center',
    borderRadius: 10,
    padding: 20,
    width:'90%',
  },
  yearText: {
    fontSize: 18,
    color: 'white',
  },
  fypText:{
    fontSize: 25,
    fontWeight: 'bold',
    color: '#ffdb16',
    marginBottom: 10,
    marginTop:10,
  },
  fypContainerRows:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  fypContainerRowsTitleText:{
    fontSize: 18,
    color: 'white',
    minWidth: 100,
    textAlign:'left',
  },
  fypContainerRowsNormalText:{
    fontSize: 18,
    color: 'white',
    minWidth: 100,
    textAlign:'right',
  },
  countdownContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  },
  countdownBox: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '20%',
  },
  countdownValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#08818a',
  },
  countdownLabel: {
    fontSize: 14,
    color: '#08818a',
  },
  greySquare: {
    width: '90%',
    backgroundColor: '#c4f1f5',
    marginTop: 10,
    alignSelf: 'center',
    borderRadius: 10,
    padding: 10,
    justifyContent: 'space-evenly',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  specialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  titleText: {
    fontSize: 16,
    color: 'black',
    minWidth: 100,
  },
  noImageText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    color: "grey",
    marginTop: 10,
  },
  normalText: {
    fontSize: 16,
    color: 'grey',
  },
  greenText: {
    fontSize: 16,
    color: 'green',
  },
  redText: {
    fontSize: 16,
    color: 'red',
  },
  loader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Semi-transparent background
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
  rankingimage: {
    width: 30,
    height: 30,
    // margin: 10,
  },
  batchContainer: {
    flexDirection: 'row',
    alignItems: 'center', 
    justifyContent: 'center',

  },
  batch: {
    width: 50,
    height: 50,
    marginRight: 10, 
    alignItems:'center',
  },
});

export default MDRTProfile;