import React from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';

const PolicyDetails = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={[styles.section, styles.coloredSection]}>
        <Text style={styles.sectionHeading}>DIVI THILINA</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Policy No</Text>
            <Text style={styles.tableCell2}>904126</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Insured Name</Text>
            <Text style={styles.tableCell2}>T. Thissa</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Premium</Text>
            <Text style={styles.tableCell2}>4000.00</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Last paid due date</Text>
            <Text style={styles.tableCell2}>2024/04/19</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Policy status</Text>
            <Text style={styles.tableCell2}>Active</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Table/Term</Text>
            <Text style={styles.tableCell2}>50/10</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Payment mode</Text>
            <Text style={styles.tableCell2}>Monthly</Text>
          </View>
        </View>
      </View>
      <View style={[styles.section, styles.coloredSection]}>
        <Text style={styles.sectionHeading}>JANA DIRI</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Policy No</Text>
            <Text style={styles.tableCell2}>904126</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Insured Name</Text>
            <Text style={styles.tableCell2}>T. Thissa</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Premium</Text>
            <Text style={styles.tableCell2}>4000.00</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Last paid due date</Text>
            <Text style={styles.tableCell2}>2024/04/19</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Policy status</Text>
            <Text style={styles.tableCell2}>Active</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Table/Term</Text>
            <Text style={styles.tableCell2}>50/10</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Payment mode</Text>
            <Text style={styles.tableCell2}>Monthly</Text>
          </View>
        </View>
      </View>
      <View style={[styles.section, styles.coloredSection]}>
        <Text style={styles.sectionHeading}>YASAS</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Policy No</Text>
            <Text style={styles.tableCell2}>904126</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Insured Name</Text>
            <Text style={styles.tableCell2}>T. Thissa</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Premium</Text>
            <Text style={styles.tableCell2}>4000.00</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Last paid due date</Text>
            <Text style={styles.tableCell2}>2024/04/19</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Policy status</Text>
            <Text style={styles.tableCell2}>Active</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Table/Term</Text>
            <Text style={styles.tableCell2}>50/10</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Payment mode</Text>
            <Text style={styles.tableCell2}>Monthly</Text>
          </View>
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
  },
  coloredSection: {
    backgroundColor: '#EBEBEB',
  },
  sectionHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    paddingHorizontal: 10,
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
    borderColor: '#EBEBEB', // Change to match section background color
  },
  tableCell: {
    flex: 1,
    padding: 10,
  },
  tableCell2: {
    flex: 1,
    padding: 10,
    color: '#5E5959'
  },
});


export default PolicyDetails