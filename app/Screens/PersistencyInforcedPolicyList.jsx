import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL, ENDPOINTS } from '../services/apiConfig';
import Icon from 'react-native-vector-icons/Ionicons'; 

const monthToNumber = (month) => {
  const months = {
    January: '01',
    February: '02',
    March: '03',
    April: '04',
    May: '05',
    June: '06',
    July: '07',
    August: '08',
    September: '09',
    October: '10',
    November: '11',
    December: '12',
  };
  return months[month] || '00'; // Default to '00' if month is not found
};



export default function PersistencyInforcedPolicyList({ route, navigation }) {
    const { agencyCode1, agencyCode2, year, month } = route.params;
    const [policies, setPolicies] = useState([]); // Always initialize as an empty array
    const [loading, setLoading] = useState(true);

    const navigateToPersistencyPage = () => {
        navigation.navigate('Persistency');
      };
  
    useEffect(() => {
      const fetchPolicies = async () => {
        try {
          const token = await AsyncStorage.getItem("accessToken");
          const numericMonth = monthToNumber(month); // Convert month name to number
          const response = await axios.post(
            BASE_URL + ENDPOINTS.GET_PERSISTENCY_INFORCED,
            {
              p_agency_1: agencyCode1,
              p_agency_2: !agencyCode2 || agencyCode2 === 0 ? agencyCode1 : agencyCode2,
              p_year: year,
              p_month: numericMonth,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
  
          console.log('API Response:', response.data); // Debugging line to check response
          setPolicies(response.data || []); // Safeguard: Ensure policies is an array
        } catch (error) {
          console.error('Error fetching inforced policies:', error);
          setPolicies([]); // Set policies to an empty array if there's an error
        } finally {
          setLoading(false);
        }
      };
  
      fetchPolicies();
    }, [year, month]);
  
    const renderItem = ({ item }) => (
      <View style={styles.itemContainer}>
        <Text style={styles.policyNo}>{item.policy_no}</Text>
        <Text style={styles.amount}>{item.premium ? `Rs. ${new Intl.NumberFormat().format(item.premium)}` : 'N/A'}</Text>
      </View>
    );
  
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={navigateToPersistencyPage}>
        <Icon name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>
        <Text style={styles.title}>Inforced Policies for {month} {year}</Text>
        {loading ? (
          <Text>Loading...</Text>
        ) : policies.length > 0 ? (
          <FlatList
            data={policies} // Use the fetched policies here
            renderItem={renderItem}
            keyExtractor={(item) => item.policy_no.toString()}
          />
        ) : (
          <Text>No Policies Found</Text>
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
    backgroundColor: '#F8F8F8',
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 8,
    borderRadius: 10,
    elevation: 3,
  },
  policyNo: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  amount: {
    fontSize: 16,
    position: 'absolute',
    right: 20,
    top: 10,
  },
});