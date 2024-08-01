import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Text, View, Modal, TouchableOpacity, StyleSheet, TextInput, Animated, ActivityIndicator } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Svg, { G, Circle } from "react-native-svg";
import { useIsFocused } from '@react-navigation/native';
import { lockToPortrait } from "../../OrientationLock";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useFocusEffect } from '@react-navigation/native';
import { BASE_URL, ENDPOINTS } from "../../../services/apiConfig";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function Income ({
  color = "white",
  animatedCircleColor = "#ffdc1e",
  strokeWidth = wp('6%'),
  radius = wp('22%'),
  textColor = "white",
  max = 100,
  currencyType = "Rs",
}) {
  const isFocused = useIsFocused();
  const [actualValue, setActualValue] = useState(0);
  const [targetValue, setTargetValue] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [agencyCode1, setAgencyCode1] = useState("");
  const [agencyCode2, setAgencyCode2] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const getAgencyCode = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const email = await AsyncStorage.getItem('email');
      const categoryType = await AsyncStorage.getItem('categoryType');

      const response = await axios.get(BASE_URL + ENDPOINTS.PROFILE_DETAILS, {
        headers: { Authorization: `Bearer ${token}` },
        params: { email: email, catType: categoryType },
      });

      const fetchedAgencyCode1 = response.data?.personal_agency_code;
      const fetchedAgencyCode2 = response.data?.newagt;

      setAgencyCode1(fetchedAgencyCode1);
      setAgencyCode2(fetchedAgencyCode2);
    } catch (error) {
      console.error('Error Getting Agency Code:', error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      getAgencyCode();
    }, [getAgencyCode])
  );

  useEffect(() => {
    if (isFocused) {
      lockToPortrait();
    }
  }, [isFocused]);

  useEffect(() => {
    if (agencyCode1) {
      fetchActualIncmComValue();
      fetchTargetIncmComValue();
    }
  }, [agencyCode1, agencyCode2]);

  useEffect(() => {
    if (actualValue && targetValue) {
      setPercentage((actualValue / targetValue) * 100);
    }
  }, [actualValue, targetValue]);

  const fetchActualIncmComValue = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const response = await axios.get(
        BASE_URL + ENDPOINTS.ACTUAL_INCOME_COMMISION_VALUE,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            p_agency1: agencyCode1,
            p_agency2: !agencyCode2 || agencyCode2 === 0 ? agencyCode1 : agencyCode2,
          },
        }
      );
      setActualValue(response.data[0].commissionValue);
    } catch (error) {
      if (error.response) {
        console.error('Error Fetching Actual Income Commission Value:', error.response.data, error.response.status);
      } else {
        console.error('Error Fetching Actual Income Commission Value:', error.message);
      }
    }
  };

  const fetchTargetIncmComValue = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const response = await axios.get(
        `${BASE_URL + ENDPOINTS.GET_TARGET}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            p_catId: '1',
            p_agency: agencyCode1,
          },
        }
      );

      setTargetValue(response.data);
    } catch (error) {
      console.error('Error Fetching Target Value:', error);
    }
  };

  const handlePress = () => {
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const handleSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      await axios.post(
        BASE_URL + ENDPOINTS.SET_TARGET,
        {
          p_cat_id: '1',
          p_agency_code: agencyCode1,
          p_target: inputValue,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTargetValue(Number(inputValue));
      setModalVisible(false);
    } catch (error) {
      console.error('Error Setting Target:', error);
    }
  };

  const CircleRef = useRef();
  const halfCircle = radius + strokeWidth;
  const viewBoxValue = `0 0 ${halfCircle * 2} ${halfCircle * 2}`;
  const circleCircumference = 2 * Math.PI * radius;
  const maxPerc = (100 * percentage) / max;
  const strokeDashoffset =
    circleCircumference - (circleCircumference * maxPerc) / 100;
  const actualValueText = `${currencyType} ${actualValue}`;


  return (
    <View style={styles.container}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCancel}
      >
        <View style={[styles.centeredView, { padding: hp("5%") }]}>
          <View style={[styles.modalView, { height: hp("22%"), width: wp("70%") }]}>
            <Text style={styles.modalText}>Set your target for Income</Text>
            <TextInput
              style={styles.input}
              onChangeText={text => {
                const numericValue = text.replace(/[^0-9]/g, '');
                setInputValue(numericValue);
              }}
              value={inputValue}
              keyboardType='numeric'
            />
            <View style={styles.buttonRow}>
              <TouchableOpacity
                onPress={handleSubmit}
                style={[styles.targetSetButton, { height: hp("5.5%"), width: wp("30%") }]}
              >
                <Text style={styles.buttonText}>Set Target</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCancel} style={[styles.cancelButton, { height: hp("5.5%"), width: wp("30%") }]} >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Main meter */}
      <TouchableOpacity onPress={handlePress} style={styles.tile}>
        <View style={styles.mainMeterContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.infoText}>Total Income</Text>
            <Text style={[styles.valueText, {fontWeight:'bold'}]}>{ "Rs. " + new Intl.NumberFormat().format(actualValue)}</Text>
            <Text style={[styles.targetText, { color: (targetValue && targetValue !== 0) ? 'white' : 'red' }]}>
    {targetValue && targetValue !== 0 ? `Target : ${"Rs. " + new Intl.NumberFormat().format(targetValue)}` : "Click here to set a target"}
  </Text>
          </View>
          <View style={styles.circleView}>
            <Svg width={radius * 2} height={radius * 2} viewBox={viewBoxValue}>
              <G rotation="-90" origin={`${halfCircle}, ${halfCircle}`}>
                <Circle
                  cx="50%"
                  cy="50%"
                  r={radius}
                  stroke={color}
                  strokeWidth={strokeWidth}
                  strokeOpacity={1}
                  fill="transparent"
                />
                {percentage < 100 ? (
                  <AnimatedCircle
                    ref={CircleRef}
                    cx="50%"
                    cy="50%"
                    r={radius}
                    stroke={animatedCircleColor}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circleCircumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeOpacity={1.0}
                    fill="transparent"
                    strokeLinecap="round"
                  />
                ) : (
                  <Circle
                    cx="50%"
                    cy="50%"
                    r={radius}
                    stroke={animatedCircleColor}
                    strokeWidth={strokeWidth}
                    strokeOpacity={1.0}
                    fill="transparent"
                  />
                )}
              </G>
            </Svg>
            <View style={styles.absoluteCenter}>
              <Text style={styles.percentageText(textColor || color)}>
                {percentage.toFixed(0)}%
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      {/* Main meter */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: wp("95%"),
  },
  tile:{
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
    paddingHorizontal: wp("2.5%"),
    borderRadius: 10,
    backgroundColor: "#12a4b1",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  valueText:{
    backgroundColor:'black',
    fontWeight:"bold",
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: wp('2%'),
      height: hp('1%'),
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    padding: wp("2%"),
  },
  modalText: {
    textAlign: 'center',
    fontSize: wp('4.5%'),
    marginBottom: hp('2%'),
  },
  input: {
    height: hp('5%'),
    width: wp('50%'),
    marginVertical: hp('2%'),
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    padding: hp('1%'),
    fontSize: wp('4.5%'),
    marginTop: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: wp('60%'),
  },
  targetSetButton: {
    backgroundColor: "#085258",
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    height: hp("5.5%"),
    width: wp("30%"),
  },
  cancelButton: {
    backgroundColor: "#12a4b1",
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    height: hp("5.5%"),
    width: wp("30%"),
  },
  buttonText: {
    color: 'white',
    fontSize: wp('4%'),
    textAlign: 'center',
  },
  mainMeterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    marginRight: wp('5%'),
    marginLeft:5,

  },
  infoText: {
    fontSize: wp('5%'),
    color: 'white',
  },
  valueText: {
    fontSize: wp('6%'),
    color: 'white',
  },
  circleView: {
    alignItems: 'center',
    justifyContent: 'center',
    width: wp('40%'),
    height: wp('50%'),
  },
  absoluteCenter: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentageText: (color) => ({
    color: color,
    fontSize: wp('5%'),
    textAlign: 'center',
    fontWeight:'bold'
  }),
});

