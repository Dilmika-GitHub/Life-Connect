import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  TextInput,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useFocusEffect } from '@react-navigation/native';
import { BASE_URL, ENDPOINTS } from "../../../services/apiConfig";

const { height } = Dimensions.get("window");

export default function FYPkpi({
  textColor = "black",
}) {
  const [actualValue, setActualValue] = useState(0);
  const [targetValue, setTargetValue] = useState(0); // Set initial state to 0 for numerical calculations
  const [percentage, setPercentage] = useState(0);
  const [agencyCode1, setAgencyCode1] = useState("");
  const [agencyCode2, setAgencyCode2] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        await getAgencyCode();
      };
      fetchData();
    }, [])
  );

  useEffect(() => {
    if (agencyCode1) {
      const fetchAdditionalData = async () => {
        await fetchActualFYPValue();
        await fetchTargetFYPValue();
      };
      fetchAdditionalData();
    }
  }, [agencyCode1, agencyCode2]);

  useEffect(() => {
    if (actualValue && targetValue) {
      setPercentage((actualValue / targetValue) * 100);
    }
  }, [actualValue, targetValue]);


  const getAgencyCode = async () => {
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
      console.log("called agency");
    } catch (error) {
      console.error('Error Getting Agency Code:', error);
    }
  };


  const fetchActualFYPValue = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const response = await axios.post(
        BASE_URL + ENDPOINTS.ACTUAL_KPI_VALUES,
        {
          p_agency_1: agencyCode1,
          p_agency_2: agencyCode2,
          p_year: new Date().getFullYear().toString(),
          p_month: '3',
          //p_month: (new Date().getMonth() + 1).toString().padStart(2, "0"),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setActualValue(response.data[0].fyp);
    } catch (error) {
      console.error('Error Fetching Actual FYP Value:', error);
    }
  };

  const fetchTargetFYPValue = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      console.log(agencyCode1);
      const response = await axios.get(
        `${BASE_URL + ENDPOINTS.GET_TARGET}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            p_catId: '4', 
            p_agency: agencyCode1, 
          },
        }
      );
  
      setTargetValue(response.data);
      console.log(response.data);
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
      setLoading(true);
      const token = await AsyncStorage.getItem('accessToken');
      await axios.post(
        BASE_URL + ENDPOINTS.SET_TARGET,
        {
          p_cat_id: '4',
          p_agency_code: agencyCode1,
          p_target: inputValue,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTargetValue(Number(inputValue));
      setLoading(false);
      setModalVisible(false);
    } catch (error) {
      console.error('Error Setting Target:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#08818a" />
      </View>
    );
  }

  const percentageText = `${percentage.toFixed(0)}%`;


  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePress} style={styles.tile}>
        <View style={styles.textContainer}>
          <Text style={styles.titleText}>FYP KPI</Text>
          <View style={styles.valuesContainer}>
            <View style={styles.leftValues}>
              <Text style={styles.actualValue}>{ "Rs. " + new Intl.NumberFormat().format(actualValue)}</Text>
              <Text style={[styles.targetValue, { color: (targetValue && targetValue !== 0) ? '#085258' : 'red' }]}>
    {targetValue && targetValue !== 0 ? `Target : ${"Rs. " + new Intl.NumberFormat().format(targetValue)}` : "Click here to set a target"}
  </Text>
            </View>
            <Text style={styles.percentageText}>{percentageText}</Text>
          </View>
        </View>
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
            <Text style={styles.modalText}>Set target - FYP</Text>
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
                  styles.targetSetButton,
                  { height: hp("5.5%"), width: wp("30%") },
                ]}
              >
                <Text style={styles.buttonText}>Set Target</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCancel}
                style={[
                  styles.cancelButton,
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
    height: hp("15%"),
    width: wp("95%"),
  },
  tile: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
    paddingHorizontal: wp("2.5%"),
    borderRadius: 10,
    backgroundColor: "#93e3ea",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textContainer: {
    alignItems: "center",
  },
  titleText: {
    fontWeight: "bold",
    color: "#085258",
    fontSize: wp("4.5%"),
    textAlign: "center",
    marginBottom:20,
  },
  valuesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: wp("2.5%"),
  },
  leftValues: {
    alignItems: "flex-start",
  },
  actualValue: {
    color: "#085258",
    fontSize: wp("6%"),
    textAlign: "left",
    fontWeight:"bold",
  },
  targetValue: {
    color: "#085258",
    fontSize: wp("3.5%"),
    textAlign: "left",
  },
  percentageText: {
    color: "#085258",
    fontSize: wp("6%"),
    textAlign: "right",
    fontWeight: "bold",
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
  targetSetButton: {
    backgroundColor: "#085258",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  cancelButton: {
    backgroundColor: "#12a4b1",
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
