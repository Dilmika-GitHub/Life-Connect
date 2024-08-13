import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const PolicyListItem = ({ item, onPress }) => {
  const formatDate = (dateStr) => {
    try {
      const [month, day, year] = dateStr.split('/');
      if (!month || !day || !year) throw new Error('Invalid date format');
      return `${day}/${month}/${year}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateStr; // fallback to original format
    }
  };

  return (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => onPress(item)}
      accessible
      accessibilityLabel={`Policy ${item.policy_no}, customer name ${item.customer_name}, amount ${item.sa ? `Rs. ${new Intl.NumberFormat().format(item.sa)}` : 'N/A'}`}
    >
      <Text style={styles.policyNo}>{item.policy_no}</Text>
      <Text style={styles.amount}>{item.sa ? `Rs. ${new Intl.NumberFormat().format(item.sa)}` : 'N/A'}</Text>
      <Text style={styles.name}>{item.customer_name}</Text>
    </TouchableOpacity>
  );
};

export default PolicyListItem;

const styles = StyleSheet.create({
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
  name: {
    fontSize: 14,
    marginLeft: 10,
  },
  amount: {
    fontSize: 16,
    position: 'absolute',
    right: 20,
    top: 15,
  },
});
