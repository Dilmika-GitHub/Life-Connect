import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import { BASE_URL, ENDPOINTS } from "../../../services/apiConfig";
import AwesomeAlert from 'react-native-awesome-alerts';

const MDRTProfile = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categoryType, setCategoryType] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [agencyCode, setAgencyCode] = useState(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

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

      setAgencyCode(response.data);

      if (categoryType === "Ag") {
        await AsyncStorage.setItem("agencyCode1", response.data?.agent_code);
        await AsyncStorage.setItem("agencyCode2", response.data?.newagt);
      }
      if (categoryType === "Or") {
        await AsyncStorage.setItem("agencyCode1", response.data?.orgnizer_code);
        await AsyncStorage.setItem("agencyCode2", response.data?.newagt);
        
      } else {
        
      }

      console.log("called", await AsyncStorage.getItem('agencyCode'));
    } catch (error) {
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
      handleErrorResponse(error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          await getAgencyCode();
          await fetchMdrtPersonalData();
        } catch (error) {
          setError(true);
          setLoading(false);
        }
      };

      fetchData();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#FEA58F" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loader}>
        <Text style={styles.errorText}>Failed to load data.</Text>
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
  }

  return (
    <View style={styles.container}>
      {/* Top section border */}
      <View style={[styles.section, styles.topSection]}></View>

      {/* Bottom section border */}
      <View style={[styles.section, styles.bottomSection]}>
        {/* Grey color square text */}
        <View style={styles.greySquare}>
          <View style={styles.row}>
            <Text style={styles.titleText}>Agent Code</Text>
            <Text style={styles.normalText}>{data.consider_agency}</Text>
          </View>
          <View style={styles.specialRow}>
            <Text style={styles.titleText}>MDRT Target</Text>
            <Text style={styles.normalText}>{data.mdrt_target ? "Rs. " + new Intl.NumberFormat().format(data.mdrt_target) : "N/A"}</Text>
          </View>
          <View style={styles.specialRow}>
            <Text style={styles.titleText}>MDRT Target Status</Text>
            {data.mdrt_achievment === 'Achieved' ? (
              <Text style={styles.greenText}>{"Achieved"}</Text>
            ) : data.mdrt_achievment === 'Not_achieved' ? (
              <Text style={styles.redText}>{"Not Achieved"}</Text>
            ) : null}
          </View>
          <View style={styles.specialRow}>
            <Text style={styles.titleText}>MDRT Ranking</Text>
            <Text style={styles.normalText}>{data.mdrt_rank || "N/A"}</Text>
          </View>
          {data.mdrt_achievment === 'Not_achieved' ? (
            <>
              <View style={styles.specialRow}>
                <Text style={styles.titleText}>Need more</Text>
                <Text style={styles.normalText}>{data.mdrt_balance_due ? "Rs. " + new Intl.NumberFormat().format(data.mdrt_balance_due) : "N/A"}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.titleText}>Need more as Percentage</Text>
                <Text style={styles.normalText}>{data.mdrt_bal_due_prec + '%' || "N/A"}</Text>
              </View>
            </>
          ) : null}
          <View style={styles.row}>
            <Text style={styles.titleText}>First Year Premium</Text>
            <Text style={styles.normalText}>{data.fyp ? "Rs. " + new Intl.NumberFormat().format(data.fyp) : "N/A"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.titleText}>No of Policies</Text>
            <Text style={styles.normalText}>{data.nop || "N/A"}</Text>
          </View>
          <View style={styles.specialRow}>
            <Text style={styles.titleText}>TOT Ranking</Text>
            <Text style={styles.normalText}>{data.tot_rank || "N/A"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.titleText}>Need more</Text>
            <Text style={styles.normalText}>{data.tot_balance_due ? "Rs. " + new Intl.NumberFormat().format(data.tot_balance_due) : "N/A"}</Text>
          </View>
          <View style={styles.specialRow}>
            <Text style={styles.titleText}>COT Ranking</Text>
            <Text style={styles.normalText}>{data.cot_rank || "N/A"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.titleText}>Need more</Text>
            <Text style={styles.normalText}>{data.cot_balance_due ? "Rs. " + new Intl.NumberFormat().format(data.cot_balance_due) : "N/A" || "N/A"}</Text>
          </View>
          <View style={styles.specialRow}>
            <Text style={styles.titleText}>Is Life Member</Text>
            <Text style={styles.greenText}>{data.life_member || "N/A"}</Text>
          </View>
        </View>
      </View>

      {/* Profile Image */}
      <View style={styles.imageContainer}>
        <Image
          source={require("../../../../components/user.jpg")}
          style={styles.roundImage}
          resizeMode="cover"
        />
        <Text style={styles.imageText}>{data.agent_name?.replace(/\s+/g, '')}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  section: {
    width: '100%',
  },
  topSection: {
    flex: 1,
    backgroundColor: '#FEA58F',
  },
  bottomSection: {
    flex: 5,
    backgroundColor: 'white',
  },
  imageContainer: {
    position: 'absolute',
    left: '50%',
    top: '16%',
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
    color: 'black',
  },
  greySquare: {
    width: 350,
    backgroundColor: 'lightgrey',
    marginTop: 150,
    alignSelf: 'center',
    borderRadius: 10,
    padding: 10,
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
});

export default MDRTProfile;
