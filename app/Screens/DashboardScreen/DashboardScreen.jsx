import { StyleSheet, Text, View, Animated, ScrollView, Dimensions } from "react-native";
import * as React from "react";
import Svg, { G, Circle } from "react-native-svg";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import FPkpi from "./KPIs/FPkpi";
import NOPkpi from "./KPIs/NOPkpi";
import FYPkpi from "./KPIs/FYPkpi";
import GWPkpi from "./KPIs/GWPkpi";
import MCFPkpi from "./KPIs/MCFPkpi";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const { height, width } = Dimensions.get('window');

export default function DashboardScreen({
  percentage = 65,
  color = "grey",
  animatedCircleColor = "#05beda",
  strokeWidth = hp('5%'),
  radius = wp('30%'),
  textColor = "black",
  max = 100,
  totalvalue = "6,60,00,000",
  currencyType = "Rs",
}) {
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
    <ScrollView style={styles.scrollView}>
      <View style={styles.centeredView}>
        <Text style={styles.titleText(textColor || color)}>
          Sales Performance
        </Text>
      </View>
      <View style={styles.iconView}>
        <MaterialCommunityIcons name="target" size={hp('5%')} color="black" />
      </View>
      <View style={styles.circleView(radius, halfCircle, strokeWidth)}>
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
        <View style={styles.absoluteCenter}>
          <Text style={styles.valueText(textColor || color)}>
            Accumulated
          </Text>
          <Text style={styles.valueText(textColor || color)}>
            {totalvalueText}
          </Text>
        </View>
      </View>
      <View style={styles.kpiContainer}>
        <FPkpi />
        <NOPkpi />
        <FYPkpi />
        <GWPkpi />
        <MCFPkpi />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    padding: 5,
    backgroundColor: 'white',
  },
  centeredView: {
    alignItems: "center",
  },
  titleText: (color) => ({
    color: color,
    fontSize: wp('5%'),
    textTransform: "uppercase",
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
  },
  valueText: (color) => ({
    color: color,
    fontSize: wp('5%'),
  }),
  kpiContainer: {
    paddingLeft: wp('0.5%'),
    paddingBottom: hp('1%'),
  },
});
