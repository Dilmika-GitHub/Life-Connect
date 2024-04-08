import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { Link } from "expo-router";

const FPkpi = () => {
  return (
    <View>
      <Text>FPkpi</Text>
      <Text>GoBack</Text>
      <TouchableOpacity>
        <Link href={"../../Screens/DashboardScreen/DashboardScreen"} asChild>
          <AntDesign name="right" size={24} color="black" />
        </Link>
      </TouchableOpacity>
    </View>
  );
};

export default FPkpi;
