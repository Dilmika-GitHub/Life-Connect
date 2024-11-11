import React, { useState } from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import Icon from 'react-native-vector-icons/Ionicons';

const DigitalProposalMenu = ({ navigation }) => {

  const navigateToLapsedScreen = () => {
    navigation.navigate("LapsedPolicies"); 
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
          <Ionicons name="menu" size={35} color="white" />
        </TouchableOpacity>
        <Text style={styles.menuText}>Digital Proposals</Text>
      </View>

      <TouchableOpacity onPress={navigateToLapsedScreen}>
        <View style={[styles.section, styles.coloredSection]}>
          <View style={styles.tableRow}>
            <Text style={styles.sectionHeading}>Create New Proposal</Text>
            <Icon name="arrow-forward-outline" size={24} color="#fff" />
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={navigateToLapsedScreen}>
        <View style={[styles.section, styles.coloredSection]}>
          <View style={styles.tableRow}>
            <Text style={styles.sectionHeading}>##</Text>
            <Icon name="arrow-forward-outline" size={24} color="#fff" />
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={navigateToLapsedScreen}>
        <View style={[styles.section, styles.coloredSection]}>
          <View style={styles.tableRow}>
            <Text style={styles.sectionHeading}>##</Text>
            <Icon name="arrow-forward-outline" size={24} color="#fff" />
          </View>
        </View>
      </TouchableOpacity>

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
    backgroundColor: '#08818a',
  },
  sectionHeading: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

});

export default DigitalProposalMenu;
