import React, { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL, ENDPOINTS } from '../services/apiConfig';

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

    const response = await axios.post(BASE_URL + ENDPOINTS.POLICY_DETAILS, {
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
  const [loading, setLoading] = useState(false); 

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        setLoading(true); // Start loading
        await getAgencyCode();
        const policyDetails = await getPolicyDetails();
        setPolicies(policyDetails);
        setLoading(false); // End loading
      };

      fetchData();
    }, [])
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer}>
      <Text style={styles.policyNo}>{item.policy_no}</Text>
      <Text style={styles.amount}>{item.sa ? "Rs. " + new Intl.NumberFormat().format(item.sa) : "N/A"}</Text>
      <Text style={styles.name}>{item.customer_name}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#FEA58F" />
      </View>
    );
  }

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
  policyNo: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  name: {
    fontSize: 14,
    marginLeft: 10,
  },
  amount: {
    fontSize: 16,
    position: 'absolute',
    right: 20,
    top: 15,
    color: 'black',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Lapsed;
