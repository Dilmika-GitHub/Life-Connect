import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert,Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from "@expo/vector-icons";
import { RadioButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'; // Import axios
import * as Linking from 'expo-linking';
import * as IntentLauncher from 'expo-intent-launcher';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { BASE_URL, ENDPOINTS } from '../services/apiConfig';
import AwesomeAlert from 'react-native-awesome-alerts';

export default function CommissionStatement() {
  // Calculate last month (month before current month)
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // JavaScript months are zero-indexed

  const lastMonth = currentMonth === 1 ? '12' : String(currentMonth - 1).padStart(2, '0');
  const [selectedMonth, setSelectedMonth] = useState(lastMonth);
  const [selectedYear, setSelectedYear] = useState(currentMonth === 1 ? String(currentYear - 1) : String(currentYear));
  const [radioValue, setRadioValue] = useState('life'); // default radio button selection
  const [agencyCode, setAgencyCode] = useState(''); // State to store agencyCode1
  const navigation = useNavigation();
  const [showAlert, setShowAlert] = useState(false);

  // Fetch agencyCode1 and accessToken from AsyncStorage when the component mounts
  useEffect(() => {
    const fetchAgencyCode = async () => {
      try {
        const value = await AsyncStorage.getItem('agencyCode1');
        if (value !== null) {
          setAgencyCode(value); // Set the value to the state
        }
      } catch (error) {
        console.error("Error fetching agencyCode1 from AsyncStorage:", error);
      }
    };
    fetchAgencyCode();
  }, []); // Empty dependency array to run the effect only once

  const handleConfirm = () => {
    setShowAlert(false);
    navigation.navigate('Login');
  };

  const handleGenerate = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      if (!accessToken) {
        Alert.alert('Error', 'Access token is missing.');
        return;
      }
  
      const yearMonth = `${selectedYear}${selectedMonth}`;
      const sType = radioValue;
      const agentCode = agencyCode;
  
      const response = await axios.get(BASE_URL + ENDPOINTS.COMMISSION_STATEMEMNT, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/pdf',
        },
        params: {
          yearMonth: yearMonth,
          sType: sType,
          agentCode: agentCode,
        },
        responseType: 'blob', // Getting the data as a blob (binary)
      });
  
      const blob = response.data;
  
      // Convert Blob to Base64
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64data = reader.result.split(',')[1]; // Extract base64 string
  
        // Save the PDF to the file system
        const pdfUri = `${FileSystem.documentDirectory}${yearMonth}_${agentCode}.pdf`;
        await FileSystem.writeAsStringAsync(pdfUri, base64data, {
          encoding: FileSystem.EncodingType.Base64, // Save the file as Base64
        });
  
        // Open the PDF using the device's PDF viewer for both iOS and Android
        if (Platform.OS === 'ios') {
          if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(pdfUri);
          } else {
            Alert.alert('Error', 'Sharing is not available on this device.');
          }
        } else if (Platform.OS === 'android') {
          // Use IntentLauncher for Android to open the PDF in a native viewer
          const cUri = await FileSystem.getContentUriAsync(pdfUri);
          IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
            data: cUri,
            flags: 1,
            type: 'application/pdf',
          });
        }
      };
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setShowAlert(true);
      } else {
        console.error('Error fetching the PDF:', error);
        Alert.alert('Error', 'Not Available.');
      }
    }
  };

  const months = [
    { label: 'January', value: '01' },
    { label: 'February', value: '02' },
    { label: 'March', value: '03' },
    { label: 'April', value: '04' },
    { label: 'May', value: '05' },
    { label: 'June', value: '06' },
    { label: 'July', value: '07' },
    { label: 'August', value: '08' },
    { label: 'September', value: '09' },
    { label: 'October', value: '10' },
    { label: 'November', value: '11' },
    { label: 'December', value: '12' },
  ];

  const years = [];
  // Only push current year, and the last two years
  for (let i = currentYear; i >= currentYear - 2; i--) {
    years.push({ label: i.toString(), value: i.toString() });
  }

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
      {/* Display agencyCode1 at the top */}
      <View style={styles.agencyCodeContainer}>
        <Text style={styles.agencyCodeText}>{agencyCode}</Text>
      </View>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
          <Ionicons name="menu" size={35} color="white" />
        </TouchableOpacity>
        <Text style={styles.menuText}>Commission Statement</Text>
      </View>

      {/* Picker Row for Month and Year */}
      <View style={styles.pickerRow}>
        <Picker
          selectedValue={selectedMonth}
          onValueChange={(itemValue) => setSelectedMonth(itemValue)}
          style={styles.picker}
        >
          {months.map((month) => (
            <Picker.Item key={month.value} label={month.label} value={month.value} />
          ))}
        </Picker>

        <Picker
          selectedValue={selectedYear}
          onValueChange={(itemValue) => setSelectedYear(itemValue)}
          style={styles.picker}
        >
          {years.map((year) => (
            <Picker.Item key={year.value} label={year.label} value={year.value} />
          ))}
        </Picker>
      </View>

      {/* Radio Buttons with stroke */}
      <View style={styles.radioContainer}>
        <View style={styles.radioGroup}>
          <View style={styles.radioButtonWrapper}>
            <RadioButton
              value="life"
              status={radioValue === 'life' ? 'checked' : 'unchecked'}
              onPress={() => setRadioValue('life')}
              color="black" // customize the color
            />
          </View>
          <Text style={styles.radioText}>Life</Text>

          <View style={styles.radioButtonWrapper}>
            <RadioButton
              value="life_orc"
              status={radioValue === 'life_orc' ? 'checked' : 'unchecked'}
              onPress={() => setRadioValue('life_orc')}
              color="black"
            />
          </View>
          <Text style={styles.radioText}>Life ORC</Text>
        </View>
      </View>

      <Text style={styles.selectedText}>
        {selectedMonth} | {selectedYear} | {radioValue}
      </Text>
      <TouchableOpacity onPress={handleGenerate} style={styles.generateButton}>
        <Text style={styles.generateButtonText}>   Generate   </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center', // Center items horizontally
    justifyContent: 'flex-start', // Align items to the top initially
  },
  agencyCodeContainer: {
    marginTop: 10,
    alignItems: 'flex-end',
  },
  agencyCodeText: {
    marginTop: '15%',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
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
  menuText: {
    color: 'white',
    paddingLeft: '8%',
    fontSize: 18,
  },
  pickerRow: {
    flexDirection: 'row', // Places pickers in a row
    justifyContent: 'space-between', // Space between pickers
    width: '80%', // Adjust width for both pickers
  },
  picker: {
    width: '50%', // Width for individual picker
  },
  selectedText: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center', // Center the selectedText
  },
  radioContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  radioGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioText: {
    marginLeft: 5,
    marginRight: 15,
    fontSize: 16,
  },
  radioButtonWrapper: {
    borderWidth: 1, // Add stroke
    borderColor: '#000', // Stroke color
    borderRadius: 20, // Make it round
    padding: 5, // Add padding around the radio button
    marginRight: 10, // Space between radio buttons
  },
  generateButton: {
    backgroundColor: '#08818a',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 15,
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
