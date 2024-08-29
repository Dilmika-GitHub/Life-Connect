import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';
import { BASE_URL, ENDPOINTS } from '../services/apiConfig';

export default function PersistencyLapsedPolicyList({ route }) {
  const { year, month } = route.params;
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const response = await axios.get(`${BASE_URL}${ENDPOINTS.GET_LAPSED_POLICIES}`, {
          params: { year, month },
        });
        setPolicies(response.data.policies);
      } catch (error) {
        console.error('Error fetching lapsed policies:', error);
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
      <Text style={styles.title}>Lapsed Policies for {month} {year}</Text>
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
    backgroundColor: '#ffebee',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  policyText: {
    fontSize: 16,
  },
});
