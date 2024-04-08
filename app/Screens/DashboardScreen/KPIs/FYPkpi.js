import {
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity,
} from "react-native";
import * as React from "react";
import Svg, { G, Circle } from "react-native-svg";
import { AntDesign } from "@expo/vector-icons";
import { Link } from "expo-router";
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function FYPkpi({
  percentage = 92,
  color = "grey",
  animatedCircleColor = "#04bfda",
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

  React.useEffect(() => {});

  return (
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
        borderTopWidth: 1,
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
              strokeOpacity={0.5}
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
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <Text style={{ textAlign: "left", fontWeight: "bold", marginLeft: 10}}>
            FYP KPI
          </Text>
        </View>
        <View style={{ flex: 1, justifyContent: "flex-start" }}>
          <Text style={{ textAlign: "left", marginLeft: 10 }}>Fyp KPI is a Kpi.</Text>
        </View>
      </View>
      <TouchableOpacity>
        <Link
          href={"../../Screens/DashboardScreen/KPIComponents/FYPkpi"}
          asChild
        >
          <AntDesign name="right" size={24} color="grey" />
        </Link>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({});
