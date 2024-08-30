import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, Button } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAgencyCode } from '../services/getDetailsAPIs';
import { BASE_URL, ENDPOINTS } from '../services/apiConfig';
import AwesomeAlert from 'react-native-awesome-alerts';

export default function Persistency() {
    const [selectedDate, setSelectedDate] = useState(() => {
        const date = new Date();
        date.setMonth(date.getMonth() - 1);
        return date;
      });
  const [showPicker, setShowPicker] = useState(false);
  const [percentage, setPercentage] = useState("");
  const [agencyCode1, setAgencyCode1] = useState("");
  const [agencyCode2, setAgencyCode2] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [inforced, setInforced] = useState("");
  const [lapsed, setLapsed] = useState("");
  const navigation = useNavigation();
  const [showAlert, setShowAlert] = useState(false);

  const handleErrorResponse = (error) => {
    if (error.response.status === 401) {
      console.log(error.response.status);
      setShowAlert(true);
    }
  };

  const handleConfirm = () => {
    setShowAlert(false);
    navigation.navigate('Login');
  };

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
      // Initial fetch for the default persistency
      getPersistency(new Date().getFullYear().toString(), new Date().getMonth().toString().padStart(2, "0"));
    }
  }, [agencyCode1, agencyCode2]);

  const getPersistency = async (selectedYear, selectedMonth) => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      const response = await axios.post(
        BASE_URL + ENDPOINTS.GET_MONTHLY_PERSISTENCY,
        {
          p_agency_1: agencyCode1,
          p_agency_2: !agencyCode2 || agencyCode2 === 0 ? agencyCode1 : agencyCode2,
          p_year: selectedYear,
          p_month: selectedMonth,
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
        handleErrorResponse(error);
      console.error("Error Fetching Persistency:", error);
    }
  };

  const getLast12Months = () => {
    const months = [];
    const now = new Date();
    now.setMonth(now.getMonth() - 1);
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const yearMonth = `${date.getFullYear()} - ${month}`;
      months.push({ date, yearMonth });
    }
    return months;
  };

  const last12Months = getLast12Months();

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setShowPicker(false);
    // Extract year and month from the selected date
    const selectedYear = date.getFullYear().toString();
    const selectedMonth = String(date.getMonth() + 1).padStart(2, "0");
    // Call the API with the selected month and year
    getPersistency(selectedYear, selectedMonth);
  };
  // Function to navigate to the Inforced Policies screen
const navigateToInforcedPolicies = () => {
    navigation.navigate('Persistency Inforced Policy List', {
        agencyCode1: agencyCode1,
        agencyCode2: agencyCode2,
        year: year,
        month: month,
      });
  };
  
  // Function to navigate to the Lapsed Policies screen
  const navigateToLapsedPolicies = () => {
    navigation.navigate('Persistency Lapsed Policy List', { selectedYear: year, selectedMonth: month });
  };
  

  return (
    <View style={styles.container}>
        <AwesomeAlert
        show={showAlert}
        showProgress={false}
        title="Session Expired"
        message="Please Log Again!"
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        showConfirmButton={true}
        confirmText="OK"
        confirmButtonColor="#08818a"
        onConfirmPressed={handleConfirm}
      />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
          <Ionicons name="menu" size={26} color="white" />
        </TouchableOpacity>
      </View>

      <Text style={styles.titleText}>Persistency</Text>

      <View style={styles.percentageContainer}>
        <Text style={styles.percentageText}>{percentage}%</Text>
        <Text style={styles.percentageDescription}>
          Policy Persistency of the month of {month} {year}
        </Text>
      </View>

      <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.pickerContainer}>
        <Text style={styles.pickerText}>
          {selectedDate.getFullYear()} - {String(selectedDate.getMonth() + 1).padStart(2, '0')}
        </Text>
        <Ionicons name="chevron-down-outline" size={20} color="#000" />
      </TouchableOpacity>

      <Modal visible={showPicker} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.pickerWrapper}>
            <Text style={styles.modalTitle}>Select Year and Month</Text>
            <ScrollView style={styles.scrollView}>
              {last12Months.map(({ date, yearMonth }, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.optionContainer}
                  onPress={() => handleDateChange(date)}
                >
                  <Text style={styles.optionText}>{yearMonth}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Button title="Close" onPress={() => setShowPicker(false)} />
          </View>
        </View>
      </Modal>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={navigateToInforcedPolicies}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Inforced Policies</Text>
            <Text style={styles.buttonValue}>{inforced}</Text>
            <Ionicons name="arrow-forward-outline" size={24} color="#fff" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={navigateToLapsedPolicies}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Lapsed Policies</Text>
            <Text style={styles.buttonValue}>{lapsed}</Text>
            <Ionicons name="arrow-forward-outline" size={24} color="#fff" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#08818a',
    width: '100%',
    position: 'absolute',
    top: 0,
  },
  titleText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 26,
    marginVertical: '12%',
  },
  percentageContainer: {
    height: "35%",
    width: "90%",
    borderRadius: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: '#01204E',
  },
  percentageText: {
    fontSize: "80%", 
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFF3DD',
    marginBottom: 10,
  },
  percentageDescription: {
    marginTop:'10%',
    fontSize: 14,
    textAlign: 'center',
    color: '#fff',
  },
  pickerContainer: {
    flexDirection: 'row',
    backgroundColor:'#FFF3DD',
    padding: 10,
    borderRadius: 20,
    marginBottom: 20,
  },
  pickerText: {
    fontSize: 18,
  },
  buttonContainer: {
    width: '80%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#12A4B0',
    padding: 15,
    borderRadius: 35,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
  },
  buttonValue: {
    color: 'white',
    fontSize: 24,
    fontWeight: '600',
    paddingHorizontal: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  pickerWrapper: {
    width: 300,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 10,
  },
  scrollView: {
    width: '100%',
    marginVertical: 10,
  },
  optionContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  optionText: {
    fontSize: 18,
    textAlign: 'center',
  },
});
