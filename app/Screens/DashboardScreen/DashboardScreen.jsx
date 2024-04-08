import { StyleSheet, Text, View, Animated, ScrollView } from "react-native";
import * as React from "react";
import Svg, { G, Circle } from "react-native-svg";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import FPkpi from "./KPIs/FPkpi";
import NOPkpi from "./KPIs/NOPkpi";
import FYPkpi from "./KPIs/FYPkpi";
import GWPkpi from "./KPIs/GWPkpi";
import MCFPkpi from "./KPIs/MCFPkpi";
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function DashboardScreen(
  {
    percentage = 65,
    color = "grey",
    animatedCircleColor = "#05beda",
    strokeWidth = 35,
    radius = 120,
    textColor = "black",
    max = 100,
    totalvalue = "6,60,00,000",
    currencyType = "Rs",
  }
) {
  const CircleRef = React.useRef();
  const halfCircle = radius + strokeWidth;
  const viewBoxValue = `0 0 ${halfCircle * 2} ${halfCircle * 2}`;
  const circleCircumference = 2 * Math.PI * radius;
  const maxPerc = (100 * percentage) / max;
  const strokeDashoffset =
  circleCircumference - (circleCircumference * maxPerc) / 100;
  const totalvalueText = `${currencyType} ${totalvalue}`;
  React.useEffect(() => {});
  return (
    <ScrollView style={{ flex: 1, padding: 5 }}>
      <View style={{ alignItems: "center" }}>
        <Text
          style={{
            color: textColor || color,
            fontSize: 20,
            textTransform: "uppercase",
            
          }}
        >
          Sales Performance
        </Text>
      </View>
      <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start', paddingLeft: 330 }}>
      <MaterialCommunityIcons name="target" size={40} color="black" />
    </View>
      
      <View style={{ alignItems: "center",marginTop: -15 }}>
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
            />
          </G>
        </Svg>
        <View
          style={[
            StyleSheet.absoluteFill,
            { justifyContent: "center", alignItems: "center" },
          ]}
        >
          <Text style={{ color: textColor || color, fontSize: 20 }}>
            Accumulated
          </Text>
          <Text style={{ color: textColor || color, fontSize: 20 }}>
            {totalvalueText}
          </Text>
        </View>
      </View>

      <View style={{ paddingLeft: 2 }}>
        <FPkpi />
        <NOPkpi />
        <FYPkpi />
        <GWPkpi />
        <MCFPkpi />
        
      </View>
    </ScrollView>
  )
}