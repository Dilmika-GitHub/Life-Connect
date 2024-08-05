import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, BackHandler, Image, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Make sure to install this or use any icon library you prefer
import { Link } from "expo-router";
import AwesomeAlert from 'react-native-awesome-alerts';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from "expo-router";
import { getAgencyCode } from '../../services/getDetailsAPIs';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';
import { BASE_URL, ENDPOINTS } from '../../services/apiConfig';

const ChangeDefaultPassword = ({ navigation }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const router = useRouter();
  const [agencyCode, setAgencyCode] = useState(null);
  const [responseCode, setResponseCode] = useState(null);

  useEffect(() => {
    const fetchAgencyCode = async () => {
      try {
        const data = await getAgencyCode();
        setAgencyCode(data);
      } catch (error) {
        console.error("Error getting agency code:", error);
      }
    };

    fetchAgencyCode();
  }, []);

  const toggleCurrentPasswordVisibility = () => {
    setCurrentPasswordVisible(!currentPasswordVisible);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const handleUpdatePassword = async () => {
    if (currentPassword === '' || password === '' || confirmPassword === '') {
      setAlertMessage('Please fill all the fields!');
      setShowAlert(true);
      return;
    }

    if (password !== confirmPassword) {
      setAlertMessage('New password and confirm password do not match.');
      setShowAlert(true);
      return;
    }

    try {
      const token = await AsyncStorage.getItem('accessToken');
      const email = await AsyncStorage.getItem('email');
      const response = await axios.post(
        BASE_URL + ENDPOINTS.CHANGE_PASSWORD,
        {
          p_pre_pw: currentPassword,
          p_new_pw: password,
          p_agency_code: agencyCode,
          p_agent_email: email,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(response.data);
      if (response.data === 1) {
        setResponseCode(response.data)
        setAlertMessage('Password updated successfully!');
      } else if (response.data === 0) {
        setAlertMessage('Your current password is incorrect, Please Check!');
      } else {
        setAlertMessage('Something went wrong please try again!')
      }
      setShowAlert(true);
    } catch (error) {
      console.error('Failed to update password:', error);
      setAlertMessage('Failed to update password.');
      setShowAlert(true);
    }
  };

  const handleAlert = () => {
    if (responseCode === 1) {
      router.push("/Screens/LoginScreen/LoginScreen")
    }
    setShowAlert(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.navigate('Login');
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation])
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.welcomeNote}>Welcome to Life Track App</Text>
        <Image
          source={require('../../../assets/changePassword.png')}
          style={styles.image}
        />
        <Text style={styles.discription}>Since this is your first login, kindly set a new password.</Text>

        <Text style={styles.subtitle}>Please Enter Current Password</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Current Password"
            secureTextEntry={!currentPasswordVisible}
            onChangeText={setCurrentPassword}
            value={currentPassword}
          />
          <TouchableOpacity onPress={toggleCurrentPasswordVisibility} style={styles.eyeIcon}>
            <Icon name={currentPasswordVisible ? "eye" : "eye-off"} size={20} color="#000" />
          </TouchableOpacity>
        </View>
        <Text style={styles.subtitle}>Create a new password.</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="New Password"
            secureTextEntry={!passwordVisible}
            onChangeText={setPassword}
            value={password}
          />
          <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
            <Icon name={passwordVisible ? "eye" : "eye-off"} size={20} color="#000" />
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            secureTextEntry={!confirmPasswordVisible}
            onChangeText={setConfirmPassword}
            value={confirmPassword}
          />
          <TouchableOpacity onPress={toggleConfirmPasswordVisibility} style={styles.eyeIcon}>
            <Icon name={confirmPasswordVisible ? "eye" : "eye-off"} size={20} color="#000" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleUpdatePassword} style={styles.updateButton}>
          <Text style={styles.updateButtonText}>Update Password</Text>
        </TouchableOpacity>
        <AwesomeAlert
          show={showAlert}
          showProgress={false}
          title="Alert!"
          message={alertMessage}
          closeOnTouchOutside={false}
          closeOnHardwareBackPress={false}
          showConfirmButton={true}
          confirmText="OK"
          confirmButtonColor="#08818a"
          onConfirmPressed={handleAlert}
          messageStyle={styles.messageStyle}
          confirmButtonStyle={styles.confirmButtonStyle}
          confirmButtonTextStyle={styles.confirmButtonTextStyle}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d1f7fa',
  },
  scrollViewContent: {
    padding: 20,
  },
  welcomeNote: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#08818a',
    textAlign: 'center',
  },
  image: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginVertical: 20,
  },
  discription: {
    fontSize: 25,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    marginBottom: 20,
    marginTop: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 10,
  },
  updateButton: {
    backgroundColor: '#08818a',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  messageStyle: {
    textAlign: 'center',
    fontSize: 16,
  },
  confirmButtonStyle: {
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  confirmButtonTextStyle: {
    fontSize: 16,
  },
});

export default ChangeDefaultPassword;
