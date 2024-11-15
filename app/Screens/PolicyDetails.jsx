import React, { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, ActivityIndicator, } from 'react-native';
import { lockToPortrait, lockToAllOrientations } from './OrientationLock';
import { useIsFocused } from '@react-navigation/native';
import { BASE_URL, ENDPOINTS } from "../services/apiConfig";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import AwesomeAlert from 'react-native-awesome-alerts';
import { Ionicons } from "@expo/vector-icons";
import Icon from 'react-native-vector-icons/Ionicons';

const PolicyDetails = ({ navigation }) => {
  const isFocused = useIsFocused();
  const [agencyCode, setAgencyCode] = useState(null);
  const [policyCount, setPolicyCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);

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

      const response = await axios.get(BASE_URL + ENDPOINTS.PROFILE_DETAILS, {
        headers: { Authorization: `Bearer ${token}` },
        params: { email: email, catType: categoryType },
      });

      setAgencyCode(response.data);
      await AsyncStorage.setItem("agencyCode1", response.data?.personal_agency_code);
    } catch (error) {
      console.error('Error Getting Agency Code:', error);
      handleErrorResponse(error);
    }
  };

  const fetchPolicyCount = async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      const agencyCode1 = await AsyncStorage.getItem('agencyCode1');

      const response = await axios.get(BASE_URL + ENDPOINTS.POLICY_COUNT, {
        headers: { Authorization: `Bearer ${token}` },
        params: { p_agency: agencyCode1 }
      });

      setPolicyCount(response.data);
    } catch (error) {
      console.error('Error fetching policy count:', error);
      handleErrorResponse(error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          await getAgencyCode();
          await fetchPolicyCount();
        } catch {
          setLoading(false);
        }
      };

      fetchData();
    }, [])
  );

  useEffect(() => {
    if (isFocused) {
      lockToAllOrientations();
    }
  }, [isFocused]);

  const navigateToLapsedScreen = () => {
    navigation.navigate('Lapsed');
  };

 

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
            <Ionicons name="menu" size={35} color="white" />
          </TouchableOpacity>
          <Text style={styles.menuText}>Policy Details</Text>
        </View>
      <View style={[styles.section, styles.coloredSection]}>
        <Text style={styles.sectionHeading}>Policy Overview</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>
              View comprehensive information about your insurance policies, including details about inforced policies and those that have been lapsed.
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.sectionHeading2}>Inforced Policies</Text>
            <Text style={styles.tableCell2}>{policyCount?.infocount}</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity onPress={navigateToLapsedScreen}>
        <View style={[styles.section, styles.coloredSection2]}>
          <View style={styles.tableRow}>
            <Text style={styles.sectionHeading3}>Lapsed Policies</Text>
            <Text style={styles.tableCell3}>{policyCount?.lapscount}</Text>
            <Icon name="arrow-forward-outline" size={24} color="#fff" />
          </View>
        </View>
      </TouchableOpacity>
      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#08818a" />
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: 'white',
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
  section: {
    marginBottom: 20,
    borderRadius: 12,
    padding: 20,
    marginTop: 15,
    marginHorizontal: 10,
  },
  coloredSection: {
    backgroundColor: '#EBEBEB',
  },
  coloredSection2: {
    backgroundColor: '#08818a',
  },
  sectionHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionHeading2: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    color: 'black',
    paddingTop: 10,
  },
  sectionHeading3: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
  },
  table: {
    width: '100%',
    flexDirection: 'column',
    borderRadius: 5,
  },
  tableRow: {
    flexDirection: 'row',
    borderColor: '#EBEBEB',
  },
  tableCell: {
    flex: 1,
    padding: 10,
  },
  tableCell2: {
    flex: 1,
    color: 'black',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  tableCell3: {
    flex: 1,
    color: 'white',
    fontSize: 24,
    fontWeight: '600',
    paddingHorizontal: 10,
    textAlign: 'right',
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
});

export default PolicyDetails;
