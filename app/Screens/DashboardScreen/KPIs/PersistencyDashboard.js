import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { getAgencyCode } from "../../../services/getDetailsAPIs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import { BASE_URL, ENDPOINTS } from "../../../services/apiConfig";
import AwesomeAlert from "react-native-awesome-alerts";

const PersistencyDashboard = () => {
  const [percentage, setPercentage] = useState("");
  const [agencyCode1, setAgencyCode1] = useState("");
  const [agencyCode2, setAgencyCode2] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [inforced, setInforced] = useState("");
  const [lapsed, setLapsed] = useState("");

  useEffect(() => {
    const fetchAgencyCode = async () => {
      try {
        const data = await getAgencyCode();
        setAgencyCode1(data.personal_agency_code);
        setAgencyCode2(data.newagt);
      } catch (error) {
        console.error("Error getting agency code:", error);
      }
    };

    fetchAgencyCode();
  }, []);

  useEffect(() => {
    if (agencyCode1) {
      getDefaultPersistancy();
    }
  }, [agencyCode1, agencyCode2]);

  const getDefaultPersistancy = async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      const response = await axios.post(
        BASE_URL + ENDPOINTS.GET_MONTHLY_PERSISTENCY,
        {
          p_agency_1: agencyCode1,
          p_agency_2: !agencyCode2 || agencyCode2 === 0 ? agencyCode1 : agencyCode2,
          p_year: new Date().getFullYear().toString(),
          p_month: new Date().getMonth().toString().padStart(2, "0"),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      setYear(response.data.yearmn.substring(0, 4));
      const yearMonth = response.data.yearmn;
      const lastTwoDigits = yearMonth.toString().slice(-2);
  
      const monthName = new Intl.DateTimeFormat("en-US", { month: "long" }).format(
        new Date(2000, parseInt(lastTwoDigits) - 1)
      );
  
      setMonth(monthName);
      setInforced(response.data.inforce_count1);
      setLapsed(response.data.lapse_count1);
      setPercentage(response.data.persistency_year1);
    } catch (error) {
      console.error("Error Fetching Persistency:", error);
    }
  };
  

  return (
    <View style={styles.container}>
      {/* Title at the Top Center */}
      <Text style={styles.title}>Persistency</Text>

      <View style={styles.circleContainer}>
        {/* Solid Circle with Percentage */}
        <View style={styles.circle}>
          <Text style={styles.percentageText}>{`${percentage}%`}</Text>
        </View>

        {/* Text Information */}
        <View style={styles.textContainer}>
          <View style={styles.descriptionRow}>
            <Text style={styles.description}>
              <Text style={styles.bullet}>■</Text> Year
            </Text>
            <Text style={styles.descriptionValue}>{year}</Text>
          </View>
          <View style={styles.descriptionRow}>
            <Text style={styles.description}>
              <Text style={styles.bullet}>■</Text> Month
            </Text>
            <Text style={styles.descriptionValue}>{month}</Text>
          </View>
          <View style={styles.descriptionRow}>
            <Text style={styles.description}>
              <Text style={styles.bullet}>■</Text> Inforced
            </Text>
            <Text style={styles.descriptionValue}>{inforced}</Text>
          </View>
          <View style={styles.descriptionRow}>
            <Text style={styles.description}>
              <Text style={styles.bullet}>■</Text> Lapsed
            </Text>
            <Text style={styles.descriptionValue}>{lapsed}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: wp("5%"),
  },
  title: {
    fontSize: wp("5%"),
    fontWeight: "bold",
    marginBottom: wp("3%"),
  },
  circleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  circle: {
    width: wp("40%"),
    height: wp("40%"),
    borderRadius: wp("20%"),
    backgroundColor: "#03665c",
    justifyContent: "center",
    alignItems: "center",
  },
  percentageText: {
    fontSize: wp("8%"),
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  textContainer: {
    marginLeft: wp("5%"),
  },
  descriptionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: wp("2%"),
  },
  description: {
    fontSize: wp("4%"),
    color: "#000",
    marginRight: wp("7%"),
  },
  descriptionValue: {
    fontSize: wp("4%"),
    textAlign: "right",
    color: "#6d6d6d",
  },
  bullet: {
    marginRight: 5,
    fontSize: 16,
    color: "black",
  },
});

export default PersistencyDashboard;
