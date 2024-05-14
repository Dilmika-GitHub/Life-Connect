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

export default function NOPkpi({
  percentage = 68,
  color = "grey",
  animatedCircleColor = "#000000",
  strokeWidth = hp("2.5%"),
  smallRadius = wp("14%"),
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
          <Text style={styles.titleText}>NOP KPI</Text>
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
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Set your target for NOP</Text>
            <TextInput
              style={styles.input}
              onChangeText={setInputValue}
              value={inputValue}
            />
            <View style={styles.buttonRow}>
              <TouchableOpacity
                onPress={handleSubmit}
                style={styles.blueButton}
              >
                <Text style={styles.buttonText}>Set Target</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCancel} style={styles.redButton}>
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
    top: "50%",
    left: "50%",
    transform: [
      { translateX: -(wp("8.5%") / 2) },
      { translateY: -(hp("4.50%") / 2) },
    ],
    justifyContent: "center",
    alignItems: "center",
  },
  percentageText: {
    color: "black",
    fontSize: wp("4.5%"),
    textAlign: "center",
  },
  textContainer: {
    flex: 0.8,
  },
  titleText: {
    textAlign: "left",
    fontWeight: "bold",
    marginLeft: hp("1.2%"),
    color: "black",
    fontSize: wp("4.5%"),
  },
  detailsText: {
    textAlign: "left",
    marginLeft: hp("1.2%"),
    color: "black",
    fontSize: wp("4.5%"),
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    height: hp("10%"),
    alignItems: "center",
    marginTop: hp("10%"),
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: hp("10%"),
    backgroundColor: "white",
    borderRadius: 20,
    padding: wp("10%"),
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: wp("2%"),
      height: hp("1%"),
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: wp("4.5%"),
  },
  input: {
    height: hp("5%"),
    width: wp("50%"),
    margin: 12,
    borderWidth: 1,
    padding: 10,
    fontSize: wp("4.5%"),
  },
  buttonRow: {
    flexDirection: "row",
  },
  blueButton: {
    backgroundColor: "blue",
    padding: wp("4%"),
    borderRadius: 5,
    marginRight: 10,
  },
  redButton: {
    backgroundColor: "red",
    padding: wp("4%"),
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: wp("4.5%"),
  },
});
