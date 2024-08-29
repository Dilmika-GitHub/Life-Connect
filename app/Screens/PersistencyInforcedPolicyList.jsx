import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL,ENDPOINTS } from '../services/apiConfig';

export default function PersistencyInforcedPolicyList({ route }) {
    const { agencyCode1, agencyCode2, year, month } = route.params;
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Received year:', year);
    console.log('Received month:', month);
    console.log('Received agencyCode1:', agencyCode1);
    console.log('Received agencyCode2:', agencyCode2);
  }, []);

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const token = await AsyncStorage.getItem("accessToken");
        const response = await axios.post(
            BASE_URL + ENDPOINTS.GET_PERSISTENCY_INFORCED,
            {
              p_agency_1: agencyCode1,
              p_agency_2: !agencyCode2 || agencyCode2 === 0 ? agencyCode1 : agencyCode2,
              p_year: year,
              p_month: month,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
    
        setPolicies(response.data.policies);
      } catch (error) {
        console.error('Error fetching inforced policies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPolicies();
  }, [year, month]);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.policyText}>Policy ID: {item.policyId}</Text>
      <Text style={styles.policyText}>Customer: {item.customerName}</Text>
      <Text style={styles.policyText}>Amount: {item.amount}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inforced Policies for {month} {year}</Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={policies}
          renderItem={renderItem}
          keyExtractor={(item) => item.policyId.toString()}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  itemContainer: {
    backgroundColor: '#e0f7fa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  policyText: {
    fontSize: 16,
  },
});
