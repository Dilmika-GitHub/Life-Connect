import { StyleSheet, Text, View, Animated, ScrollView, Dimensions, BackHandler, Alert, TouchableOpacity } from "react-native";
import React, { useState, useEffect, useRef } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { lockToPortrait, lockToAllOrientations } from "../OrientationLock";
import { useIsFocused } from '@react-navigation/native';
import Income from "./KPIs/Income";
import FPkpi from "./KPIs/FPkpi";
import NOPkpi from "./KPIs/NOPkpi";
import FYPkpi from "./KPIs/FYPkpi";
import GWPkpi from "./KPIs/GWPkpi";
import MCFPkpi from "./KPIs/MCFPkpi";
import PersistencyDashboard from "./KPIs/PersistencyDashboard";
import CheckConnection from "../../../components/checkConnection";
import { Ionicons } from "@expo/vector-icons";

export default function DashboardScreen({
  textColor = "black",
  navigation
}) {
  const isFocused = useIsFocused();

  useEffect(() => {
      if (isFocused) {
          lockToPortrait();
      }
  }, [isFocused]);

  useEffect(() => {
    const backAction = () => {
      Alert.alert("Hold on!", "Are you sure you want to exit?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel",
        },
        { text: "YES", onPress: () => BackHandler.exitApp() },
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
            <Ionicons name="menu" size={26} color="white" />
          </TouchableOpacity>
        </View>
    <ScrollView style={styles.scrollView}>
      <CheckConnection />
      <View style={styles.centeredView}>
        <Text style={styles.titleText(textColor || color)}>
          Have a Nice Day!
        </Text>
      </View>
      <View style={styles.kpiContainer}>
        <View style={styles.kpiWrapper}>
          <Income />
        </View>

        {/* New Business Container */}
        <View style={styles.newBusinessContainer}>
          <Text style={styles.newBusinessTitle}>New Business</Text>
          <View style={styles.kpiWrapper}>
            <FPkpi />
          </View>
          <View style={styles.kpiWrapper}>
            <MCFPkpi />
          </View>
          <View style={styles.kpiWrapper}>
            <NOPkpi />
          </View>
        </View>
        <PersistencyDashboard percentage={75} />
        <View style={styles.kpiWrapper}>
          <FYPkpi />
        </View>

        <View style={styles.kpiWrapper}>
          <GWPkpi />
        </View>
      </View>
    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#08818a',
  },
  centeredView: {
    alignItems: "center",
  },
  titleText: (color) => ({
    color: color,
    fontSize: wp('5%'),
  }),
  kpiContainer: {
    flexDirection: 'column',
    padding: 10,
    alignItems: 'center',
  },
  kpiWrapper: {
    marginBottom: 10,
    width: wp('93%'),
    alignItems: 'center',
  },
  // New Business Container Styles
  newBusinessContainer: {
    backgroundColor: '#FFF3DD',
    padding: 15,
    borderRadius: 8,
    width: wp('95%'),
    marginBottom: 10,
    alignItems:'center',
  },
  newBusinessTitle: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

