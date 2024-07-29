import React, { useEffect, useState, useRef } from 'react';
import { Text, View, Modal, TouchableOpacity, StyleSheet, TextInput, Animated } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Svg, { G, Circle } from "react-native-svg";
import { useIsFocused } from '@react-navigation/native';
import { lockToPortrait } from "../../OrientationLock";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function Income ({
  percentage = 65,
  color = "grey",
  animatedCircleColor = "#05beda",
  strokeWidth = wp('6%'),
  radius = wp('22%'),
  textColor = "black",
  max = 100,
  totalvalue = "6,60,00,000",
  currencyType = "Rs",
}) {
  const isFocused = useIsFocused();
  const [modalVisible, setModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (isFocused) {
      lockToPortrait();
    }
  }, [isFocused]);

  const CircleRef = useRef();
  const halfCircle = radius + strokeWidth;
  const viewBoxValue = `0 0 ${halfCircle * 2} ${halfCircle * 2}`;
  const circleCircumference = 2 * Math.PI * radius;
  const maxPerc = (100 * percentage) / max;
  const strokeDashoffset =
    circleCircumference - (circleCircumference * maxPerc) / 100;
  const totalvalueText = `${currencyType} ${totalvalue}`;

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleSubmit = () => {
    console.log("Submitted value:", inputValue);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
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
                style={[styles.blueButton, { height: hp("5.5%"), width: wp("30%") }]}
              >
                <Text style={styles.buttonText}>Set Target</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={closeModal} style={[styles.redButton, { height: hp("5.5%"), width: wp("30%") }]} >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Main meter */}
      <TouchableOpacity onPress={openModal} style={styles.tile}>
        <View style={styles.mainMeterContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.infoText}>Total Income</Text>
            <Text style={styles.valueText}>{totalvalueText}</Text>
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
                  strokeOpacity={0.5}
                  fill="transparent"
                />
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
    backgroundColor: "#8cd9da",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
  blueButton: {
    backgroundColor: 'blue',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    height: hp("5.5%"),
    width: wp("30%"),
  },
  redButton: {
    backgroundColor: 'red',
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
    color: 'black',
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
  }),
});

