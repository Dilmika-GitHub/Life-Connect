import {
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
} from "react-native";
import * as React from "react";
import Svg, { G, Circle } from "react-native-svg";
import { AntDesign } from "@expo/vector-icons";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function FPkpi({
  percentage = 68,
  color = "grey",
  animatedCircleColor = "#000000",
  strokeWidth = 15,
  smallRadius = 50,
  textColor = "black",
  max = 100,
}) {
  const CircleRef = React.useRef();
  const halfCircle = smallRadius + strokeWidth;
  const viewBoxValue = `0 0 ${halfCircle * 2} ${halfCircle * 2}`;
  const circleCircumference = 2 * Math.PI * smallRadius;

  const maxPerc = (100 * percentage) / max;
  const strokeDashoffset =
    circleCircumference - (circleCircumference * maxPerc) / 100;

  const percentageText = `${percentage}%`;

  const [modalVisible, setModalVisible] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const handlePress = () => {
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const handleSubmit = () => {
    // Perform submit action with inputValue
    console.log("Submitted value:", inputValue);
    setModalVisible(false);
  };

  return (
    <View>
      <TouchableOpacity onPress={handlePress}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            height: 100,
            padding: 0,
            paddingHorizontal: 10,
            marginTop: 10,
            borderRadius: 10,
            borderColor: "lightgrey",
          }}
        >
          {
            <View
              style={{
                flexDirection: "row", // Set flexDirection to row to align items horizontally
                justifyContent: "space-between", // Align items evenly on the main axis
                alignItems: "center", // Align items in the center vertically
                height: 100,
                //backgroundColor: "white",
                padding: 0,
                paddingHorizontal: 10,
                marginTop: 10,
                borderRadius: 10,
                borderColor: "lightgrey",
              }}
            >
              <View style={{ alignItems: "flex-start" }}>
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

                <View
                  style={{
                    position: "absolute", // Position absolutely for overlap
                    justifyContent: "center",
                    alignItems: "center",
                    left: 20, // Align to the left side
                    top: 0, // Align to the top
                    bottom: 0, // Align to the bottom
                    paddingHorizontal: 10, // Add some padding for space
                  }}
                >
                  <Text style={{ color: textColor || color, fontSize: 20 }}>
                    {percentageText}
                  </Text>
                </View>
              </View>
            </View>
          }
          <View style={{ flex: 1 }}>
            <View style={{ flex: 1, justifyContent: "flex-end" }}>
              <Text
                style={{
                  textAlign: "left",
                  fontWeight: "bold",
                  marginLeft: 10,
                }}
              >
                NOP KPI
              </Text>
            </View>
            <View style={{ flex: 1, justifyContent: "flex-start" }}>
              <Text style={{ textAlign: "left", marginLeft: 10 }}>
              Details of KPI.
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={handlePress}>
            <AntDesign name="right" size={24} color="grey" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Set your target for NOP</Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) => setInputValue(text)}
              value={inputValue}
            />
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                onPress={handleSubmit}
                style={{
                  backgroundColor: "blue",
                  padding: 10,
                  borderRadius: 5,
                  marginRight: 10,
                }}
              >
                <Text style={{ color: "white" }}>Set Target</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCancel}
                style={{ backgroundColor: "red", padding: 10, borderRadius: 5 }}
              >
                <Text style={{ color: "white" }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    height: 40,
    width: 200,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
