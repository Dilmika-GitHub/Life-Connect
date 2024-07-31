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
import CheckConnection from "../../../components/checkConnection";
import { Ionicons } from "@expo/vector-icons";


//const { height, width } = Dimensions.get('window');

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

  
  React.useEffect(() => {});

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
            <Ionicons name="menu" size={26} color="white" />
          </TouchableOpacity>
        </View>
      <CheckConnection />
      <View style={styles.centeredView}>
        <Text style={styles.titleText(textColor || color)}>
          Have a Nice Day!
        </Text>
      </View>
      <View style={styles.kpiContainer}>
      <View style={styles.kpiWrapper}>
        <Income/>
      </View>
      
        <View style={styles.kpiWrapper}>
          <FPkpi />
        </View>
        <View style={styles.kpiWrapper}>
          <FYPkpi />
        </View>
        <View style={styles.kpiWrapper}>
          <GWPkpi />
        </View>
        <View style={styles.kpiWrapper}>
          <MCFPkpi />
        </View>
        <View style={styles.kpiWrapper}>
          <NOPkpi />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    // padding: 5,
    backgroundColor: '#d1f7fa',
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
  iconView: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginHorizontal: wp('5%'), // Add horizontal margin
    marginVertical: hp('2%'), // Add vertical margin
  },
  circleView: (radius, halfCircle, strokeWidth) => ({
    alignItems: "center",
    marginTop: -15,
    justifyContent: 'center',
  }),
  absoluteCenter: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    Top: hp("22%"),
    center: wp("50%"),
  },
  valueText: (color) => ({
    color: color,
    fontSize: wp('5%'),
  }),
  kpiContainer: {
    paddingLeft: wp('0.5%'),
    paddingBottom: hp('2%'),
    flexDirection: 'column', // Assuming you want them stacked vertically
    padding: 10,
    alignItems:'center',
  },
  kpiWrapper: {
    marginBottom: 10, // Adjust the space as necessary
    width: wp('93%'),
  },
});

