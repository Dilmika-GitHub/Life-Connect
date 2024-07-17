import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Touchable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL, ENDPOINTS } from '../services/apiConfig';
import { TouchableOpacity } from 'react-native-gesture-handler';

const getAgencyCode = async () => {
  try {
    const token = await AsyncStorage.getItem('accessToken');
    const email = await AsyncStorage.getItem('email');
    const categoryType = await AsyncStorage.getItem('categoryType');

    const response = await axios.get(BASE_URL + ENDPOINTS.PROFILE_DETAILS, {
      headers: { Authorization: `Bearer ${token}` },
      params: { email: email, catType: categoryType },
    });

    await AsyncStorage.setItem('agencyCode1', response.data?.personal_agency_code);
  } catch (error) {
    console.error('Error Getting Agency Code:', error);
  }
};

const getPolicyDetails = async () => {
  try {
    const token = await AsyncStorage.getItem('accessToken');
    const agencyCode = await AsyncStorage.getItem('agencyCode1');
    const currentDate = new Date();
    const toDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
    const fromDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear() - 1}`;

    const response = await axios.post(BASE_URL+ENDPOINTS.POLICY_DETAILS, {
      p_agency: agencyCode,
      p_polno: '',
      p_fromdate: '',
      p_todate: ''
    }, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error Getting Policy Details:', error.response ? error.response.data : error.message);
    return [];
  }
};





const Lapsed = () => {
  const [policies, setPolicies] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      await getAgencyCode();
      const policyDetails = await getPolicyDetails();
      setPolicies(policyDetails);
    };

    fetchData();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer}>
      <Text style={styles.policyText}>Policy No: {item.policy_no}</Text>
      <Text style={styles.policyText}>Sum A: {item.sa}</Text>
      <Text style={styles.policyText}>Customer Name: {item.customer_name}</Text>
    </TouchableOpacity>
    
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={policies}
        renderItem={renderItem}
        keyExtractor={(item) => item.policy_no}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  itemContainer: {
    backgroundColor: '#F8F8F8',
      padding: 10,
      marginVertical: 8,
      marginHorizontal: 8,
      borderRadius: 10,
      elevation: 3
  },
  policyText: {
    fontSize: 16,
  },
});

export default Lapsed;