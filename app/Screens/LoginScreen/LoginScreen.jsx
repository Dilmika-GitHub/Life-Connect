import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Waves } from "../../../components/Waves";
import { useRouter } from "expo-router";
import { useFonts } from "expo-font";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import CheckConnection from "../../../components/checkConnection";
import axios from 'axios';
import { BASE_URL, ENDPOINTS } from "../../services/apiConfig";
import AwesomeAlert from 'react-native-awesome-alerts';
import Constants from 'expo-constants';
import Icon from 'react-native-vector-icons/Ionicons';
import { MaterialIcons, SimpleLineIcons } from "@expo/vector-icons";
import { checkAppVersion, checkMaintenance } from "../../services/adminAPIs";
import { lockToPortrait, lockToAllOrientations } from "../OrientationLock";
import { useIsFocused } from '@react-navigation/native';
import { Ionicons } from "@expo/vector-icons";

const LoginScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showSavePasswordPopup, setShowSavePasswordPopup] = useState(false);
  const [hasSavedCredentials, setHasSavedCredentials] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 
  const [newCredentials, setNewCredentials] = useState(null);
  const router = useRouter();
  const isFocused = useIsFocused();
  const [showHelpPopup, setShowHelpPopup] = useState(false);
  const appVersion = Constants.expoConfig?.version || Constants.manifest2?.version || 'Version not found';

  const [fontsLoaded] = useFonts({
    "Poppins-Regular": require("../../../assets/font/Poppins-Regular.ttf"),
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


  // Check if credentials are saved
  useEffect(() => {

    checkAppVersion(appVersion).then(data => {
      if (data.isinforce === 'Y') {
        router.push("/Screens/LoginScreen/UpdateApp");
      }
    }).catch(error => {
      console.error("Error:", error);
    });

    if (isFocused) {
      lockToPortrait();
  }

    checkMaintenance().then(data => {
      if (data.isinforce === 'N') {
        router.push("/Screens/LoginScreen/MaintenanceScreen");
        //alert('The system is currently under maintenance. Please try again later.');
      }
    }).catch(error => {
      console.error("Error:", error);
    });

    const checkStoredCredentials = async () => {
      const storedUsername = await AsyncStorage.getItem("username");
      const storedPassword = await AsyncStorage.getItem("password");
      const loggedBefore = await AsyncStorage.getItem('loggedBefore');
      if (storedUsername && storedPassword) {
        setUsername(storedUsername);
        setPassword(storedPassword);
        setHasSavedCredentials(true);
      } else {
        setHasSavedCredentials(false);
      }
      if (!loggedBefore) {
        await AsyncStorage.setItem('loggedBefore', 'true');
      }
    };

    checkStoredCredentials();
  }, [isFocused]);

  // Handle login
  const handleLogin = async () => {
    setLoading(true);
    console.log(username)
    console.log(password)
    console.log(appVersion)

    try {
      const response = await axios.post(
        `${BASE_URL}${ENDPOINTS.AUTHENTICATE}`,
        {
          userName: username,
          password: password,
          isActive: 'Y',
          appversionNo: appVersion
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
  
      const jsonResponse = response.data;
      
      console.log('Response:', jsonResponse);
  
      if (response.status === 200 && jsonResponse.status === "Y") {
        await AsyncStorage.setItem("accessToken", jsonResponse.accsesstoken);
        await AsyncStorage.setItem("categoryType", jsonResponse.cattype);
        await AsyncStorage.setItem("email", jsonResponse.email);
  
        if (jsonResponse.firstAttempt === "Y") {
          router.push("/Screens/LoginScreen/ChangeDefaultPassword");
        } else {
          if (hasSavedCredentials) {
            const storedUsername = await AsyncStorage.getItem("username");
            const storedPassword = await AsyncStorage.getItem("password");
  
            if (username === storedUsername && password === storedPassword) {
              router.push("/Screens/HomePage/Home");
            } else {
              setShowSavePasswordPopup(true);
              setNewCredentials({ username, password });
            }
          } else {
            setShowSavePasswordPopup(true);
            setNewCredentials({ username, password });
          }
        }
      } else {
        setAlertMessage(`${jsonResponse.error || 'Unknown error'}`);
        setShowAlert(true);
        setLoading(false);
      }
    } catch (error) {
      setAlertMessage(`${error.response?.data?.error || error.message || 'Unknown error occurred'}`);
      setShowAlert(true);
      setLoading(false);
    }
  };
  

  // Save password
  const handleSavePassword = async (save) => {
    const loggedBefore = await AsyncStorage.getItem('loggedBefore');

    if (save && newCredentials) {
      await clearStoredCredentials();
      await AsyncStorage.setItem("username", newCredentials.username);
      await AsyncStorage.setItem("password", newCredentials.password);
    }
    
    setShowSavePasswordPopup(false);
    setNewCredentials(null);

    if (loggedBefore) {
      router.push("/Screens/HomePage/Home");
    } else {
      await AsyncStorage.setItem('loggedBefore', 'true');
      router.push("/Screens/HomePage/Home"); // For the first login
    }
  };

  // Clear stored credentials
  const clearStoredCredentials = async () => {
    await AsyncStorage.removeItem("username");
    await AsyncStorage.removeItem("password");
  };

  return (
    <View style={styles.container}>
      
      <Waves style={styles.wavesTop} />
      
      <TextInput
        style={styles.input}
        placeholder="Username"
        onChangeText={(text) => setUsername(text)}
        value={username}
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={!showPassword} // Use showPassword state
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Icon name={showPassword ? "eye" : "eye-off"} size={24} color="black" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#08818a" /> 
        ) : (
          <Text style={styles.loginButtonText}>Login</Text>
        )}
      </TouchableOpacity>
      <Text style={styles.logoText}>Life - Connect</Text>
      <Image
        source={require('../../../assets/Logo.png')} // Replace with your image path
        style={styles.imageStyle}
      />
      {/* Need Help Text */}
      <TouchableOpacity onPress={() => setShowHelpPopup(true)}>
        <Text style={styles.helpText}>Need help logging in? <Text style={styles.helpLink}>Help</Text></Text>
      </TouchableOpacity>

      {/* Version and Powered By Text */}
      <Text style={styles.versionText}>V: {appVersion}</Text>
      <Text style={styles.poweredByText}>Powered by SLIC LIFE IT</Text>
      <CheckConnection />
      <Modal
  visible={showHelpPopup}
  transparent
  animationType="fade"
  onRequestClose={() => setShowHelpPopup(false)} // Optional for Android back button handling
>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
    <TouchableOpacity style={styles.closeButton} onPress={() => setShowHelpPopup(false)}>
              <Ionicons name="close-circle" size={30} color="red" />
            </TouchableOpacity>
    <MaterialIcons name="support-agent" size={80} color="#08818B" />

{/* Modal Text */}
<Text style={styles.modalTitle}>Get access to Life-Connect</Text>
<Text style={styles.modalSubtitle}>Please contact:</Text>

{/* Contact Information */}
<Text style={styles.contactName}>Mr. Buddika Weerakoon</Text>
<Text style={styles.contactPhone}>0112357814</Text>
<Text style={styles.contactEmail}>budikawe@srilankainsurance.com</Text>

{/* Additional Instructions */}
<Text style={styles.additionalText}>
  Send the request with your agency code
</Text>
    </View>
  </View>
</Modal>

      <Modal
        visible={showSavePasswordPopup}
        transparent
        animationType="fade"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
          <MaterialIcons
              name="save-alt"
              size={45}//24
              color="black"
              style={{ marginBottom: 10}}
            />
            <Text style={{ fontSize: 18, marginBottom: 15 }}>Do you want to save your password?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => handleSavePassword(true)}
              >
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton2}
                onPress={() => handleSavePassword(false)}
              >
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        title="Login Error"
        message={alertMessage}
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        showConfirmButton={true}
        confirmText="OK"
        confirmButtonColor="#08818B"
        onConfirmPressed={() => setShowAlert(false)}
        messageStyle={styles.messageStyle}
        confirmButtonStyle={styles.confirmButtonStyle}
        confirmButtonTextStyle={styles.confirmButtonTextStyle}
      />
    </View>
  );
};

const { width, height } = Dimensions.get("window"); // Get screen dimensions

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    position: 'static',
    right: 0,
    top: -10,
    color: "black",
    fontFamily: "poppins",
  },
  logoText:{
    top: 50,
    position: "absolute",
    color: '#F2B510',
    fontSize: 35,
    fontFamily: 'Poppins',
  },
  imageStyle: {
    width: 125, // Set the desired width
    height: 125, // Set the desired height
    marginTop: 20, // Adjust the space between text and image
    position: "absolute",
    top: 90,
  },
  versionText:{
    position: 'absolute',
    bottom: 40,
    left: 20,
    color: 'black',
  },
  input: {
    height: hp('5%'),
    borderColor: "#000",
    marginBottom: 10,
    paddingHorizontal: 10,
    width: wp("80%"),
    borderBottomWidth: 1,   
    borderBottomColor: 'black',
    fontSize: wp("4.5%"),
  },
  inputContainer: {
    width: wp("80%"),
    height: hp('5%'),
    borderColor: "#ccc",
    borderRadius: 60,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    fontSize: wp("4.5%"),
    height: hp('5%'),
    width: wp("80%"),
    borderColor: "#8b8b8b99",
    borderRadius: 60,
    paddingHorizontal: 10,
    paddingLeft: 0,
  },
  wavesTop: {
    position: "absolute",
    left: 0,
    right: 0,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: "#000",
    paddingHorizontal: 10,
    width: wp("80%"),
    borderBottomWidth: 1,   
    borderBottomColor: 'black',
    marginBottom: 10,
  },
  loginButton: {
    width: wp('80%'),
    height: hp('6%'),
    top: hp('29%'),
    backgroundColor: '#08818B',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 2, // For Android shadow
    zIndex: 1, // Ensure the button text appears above the background
  },
  loginButtonText: {
    color: 'white',
    fontSize: hp('2%'),
    fontFamily: 'Poppins-Regular', // Make sure 'Poppins' is correctly loaded in your project
    fontWeight: '400',
    fontWeight:'bold',
  },
  helpText: {
    marginTop: 20,
    color: 'black',
    fontSize: 14,
  },
  helpLink: {
    color: '#08818B',
    textDecorationLine: 'underline',
  },
  closeButton: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Transparent background
  },
  modalContent: {
    width: width * 0.8,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5, // Shadow for Android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2, // Shadow for iOS
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 10,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  contactName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  contactPhone: {
    fontSize: 16,
    color: '#08818B',
    marginBottom: 5,
  },
  contactEmail: {
    fontSize: 16,
    color: '#08818B',
    marginBottom: 20,
  },
  additionalText: {
    fontSize: 14,
    color: 'red',
    textAlign: 'center',
  },
  poweredByText: {
    position: 'absolute',
    bottom: 20,
    color: '#08818B',
    fontSize: 14,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    elevation: 5,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    borderRadius: 5,
    backgroundColor: "blue",
    padding: 10,
    marginRight: 10,
  },
  modalButton2: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
  },
  modalButtonText: {
    color: "white",
  },
  eyeIcon: {
    padding: 10,
    position: 'absolute',
    right: 0,
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

export default LoginScreen;
