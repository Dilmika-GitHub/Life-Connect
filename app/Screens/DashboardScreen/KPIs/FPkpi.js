import React, { useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity,
  Modal,
  TextInput,
  Dimensions,
} from "react-native";
import Svg, { G, Circle } from "react-native-svg";
import { AntDesign } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const { height, width } = Dimensions.get("window");
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function FPkpi({
  percentage = 68,
  color = "grey",
  animatedCircleColor = "#ffdb16",
  strokeWidth = wp("1%"),
  smallRadius = wp("9%"),
  textColor = "black",
  max = 100,
}) {
  const CircleRef = useRef();
  const halfCircle = smallRadius + strokeWidth;
  const viewBoxValue = `0 0 ${halfCircle * 2} ${halfCircle * 2}`;
  const circleCircumference = 2 * Math.PI * smallRadius;

  const maxPerc = (100 * percentage) / max;
  const strokeDashoffset =
    circleCircumference - (circleCircumference * maxPerc) / 100;
  const percentageText = `${percentage}%`;

  const [modalVisible, setModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handlePress = () => {
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const handleSubmit = () => {
    console.log("Submitted value:", inputValue);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePress} style={styles.touchableArea}>
        <View style={styles.chartContainer}>
          <Svg
            width={smallRadius * 2}
            height={smallRadius * 2}
            viewBox={viewBoxValue}
          >
            <G rotation="-90" origin={`${halfCircle}, ${halfCircle}`}>
              <Circle
                cx="50%"
                cy="50%"
                r={smallRadius}
                stroke={color}
                strokeWidth={strokeWidth}
                strokeOpacity={0.2}
                fill="transparent"
              />
              <AnimatedCircle
                ref={CircleRef}
                cx="50%"
                cy="50%"
                r={smallRadius}
                stroke={animatedCircleColor}
                strokeWidth={strokeWidth}
                strokeDasharray={circleCircumference}
                strokeDashoffset={strokeDashoffset}
                strokeOpacity={1.0}
                strokeLinecap="round"
                fill="transparent"
              />
            </G>
          </Svg>
          <View style={styles.percentageTextContainer}>
            <Text style={styles.percentageText}>{percentageText}</Text>
          </View>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.titleText}>FP KPI</Text>
          <Text style={styles.detailsText}>Details of KPI.</Text>
        </View>
        <TouchableOpacity onPress={handlePress}>
          <AntDesign name="right" size={wp("4.5%")} color="grey" />
        </TouchableOpacity>
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCancel}
      >
        <View style={[styles.centeredView, { padding: hp("5%") }]}>
          <View
            style={[styles.modalView, { height: hp("22%"), width: wp("70%") }]}
          >
            <Text style={styles.modalText}>Set your target for FP</Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) => {
                const numericValue = text.replace(/[^0-9]/g, "");
                setInputValue(numericValue);
              }}
              value={inputValue}
              keyboardType="numeric"
            />
            <View style={styles.buttonRow}>
              <TouchableOpacity
                onPress={handleSubmit}
                style={[
                  styles.blueButton,
                  { height: hp("5.5%"), width: wp("30%") },
                ]}
              >
                <Text style={styles.buttonText}>Set Target</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCancel}
                style={[
                  styles.redButton,
                  { height: hp("5.5%"), width: wp("30%") },
                ]}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: wp("20%"),
  },
  touchableArea: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: hp("15%"),
    paddingHorizontal: wp("2.5%"),
    marginTop: hp("3%"),
    borderRadius: 10,
    borderColor: "lightgrey",
  },
  chartContainer: {},
  percentageTextContainer: {
    position: "absolute",
    top: wp("5.5%"),
    left: wp("5.5%"),
  },
  percentageText: {
    color: "black",
    fontSize: wp("4.5%"),
  },
  textContainer: {
    flex: 0.8,
  },
  titleText: {
    textAlign: "left",
    fontWeight: "bold",
    marginLeft: hp("5%"),
    color: "black",
    fontSize: wp("4.5%"),
  },
  detailsText: {
    textAlign: "left",
    marginLeft: hp("5%"),
    color: "black",
    fontSize: wp("4.5%"),
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: wp("2%"),
      height: hp("1%"),
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    padding: wp("2%"),
  },
  modalText: {
    textAlign: "center",
    fontSize: wp("4.5%"),
    marginBottom: hp("2%"),
  },
  input: {
    height: hp("5%"),
    width: wp("50%"),
    marginVertical: hp("2%"),
    borderBottomWidth: 1,
    borderBottomColor: "black",
    padding: hp("1%"),
    fontSize: wp("4.5%"),
    marginTop: 1,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: wp("60%"),
  },
  blueButton: {
    backgroundColor: "blue",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  redButton: {
    backgroundColor: "red",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: wp("4%"),
    textAlign: "center",
    paddingVertical: hp("1%"),
    paddingHorizontal: wp("3%"),
  },
});
