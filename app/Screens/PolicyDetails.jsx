import React from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';

const PolicyDetails = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={[styles.section, styles.coloredSection]}>
        <Text style={styles.sectionHeading}>Policy Overview</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>View comprehensive information about your insurance policies, including details about inforced polices and those that have been lapsed.</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.sectionHeading2}>Inforced Policies</Text>
            <Text style={styles.tableCell2}>38</Text>
          </View>
        </View>
      </View>
      <View style={[styles.section, styles.coloredSection2]}>
        <View style={styles.tableRow2}>
          <Text style={styles.sectionHeading3}>Lapsed Policies</Text>
          <Text style={styles.tableCell3}>14</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'absolute',
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor:'white'
  },
  section: {
    marginBottom: 20,
    borderRadius: 5,
    overflow: 'hidden',
    padding: 20,
  },
  coloredSection: {
    backgroundColor: '#EBEBEB',
  },
  coloredSection2: {
    backgroundColor: '#FF7758',
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
  },
  sectionHeading3: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    color: 'white',
  },
  table: {
    width: '100%',
    flexDirection: 'column',
    borderRadius: 5,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#EBEBEB',
  },
  tableRow2: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#FF7758',
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
  },
  tableCell3: {
    flex: 1,
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});


export default PolicyDetails