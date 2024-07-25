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
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Waves, Waves2, Waves3 } from "../../../components/Waves";
import { useRouter } from "expo-router";
import { useFonts } from "expo-font";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import CheckConnection from "../../../components/checkConnection";
import { BASE_URL, ENDPOINTS } from "../../services/apiConfig";
import AwesomeAlert from 'react-native-awesome-alerts';
import Constants from 'expo-constants';
import Icon from 'react-native-vector-icons/Ionicons';
import { MaterialIcons, SimpleLineIcons } from "@expo/vector-icons";

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
  const appVersion = Constants.expoConfig?.version || Constants.manifest2?.version || 'Version not found';

  const [fontsLoaded] = useFonts({
    "Poppins-Regular": require("../../../assets/font/Poppins-Regular.ttf"),
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Check if credentials are saved
  useEffect(() => {
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
  }, []);

  // Handle login
  const handleLogin = async () => {
    setLoading(true);
    console.log(username)
    console.log(password)

    try {
      const response = await fetch(BASE_URL+ENDPOINTS.AUTHENTICATE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName: username,
          password: password,
          isActive: 'Y', 
        }),
      });
  
      const jsonResponse = await response.json();
      
      console.log('Response:', jsonResponse); 
  
      if (response.ok && jsonResponse.status === "Y") { 
        await AsyncStorage.setItem("accessToken", jsonResponse.accsesstoken);
        await AsyncStorage.setItem("categoryType", jsonResponse.cattype);
        await AsyncStorage.setItem("email", jsonResponse.email);


        if(jsonResponse.firstAttempt === "Y"){
          router.push("/Screens/LoginScreen/ChangeDefaultPassword")
        }
        else{
          if(hasSavedCredentials) {
            const storedUsername = await AsyncStorage.getItem("username");
            const storedPassword = await AsyncStorage.getItem("password");

            if(username === storedUsername && password === storedPassword) {
                router.push("/Screens/HomePage/Home");
            }
            else {
              setShowSavePasswordPopup(true);
              setNewCredentials ({username, password});
            }
          }
          else {
            setShowSavePasswordPopup(true);
              setNewCredentials ({username, password});
          }
        }
      } else {
        setAlertMessage(`${jsonResponse.error || 'Unknown error'}`);
        setShowAlert(true);
        setLoading(false);
      }
    } catch (error) {
      setAlertMessage(`Error: ${error.message}`);
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
      <Waves2 style={styles.wavesTopSub} />
      <Waves style={styles.wavesTop} />
      <Waves3 style={styles.wavesBottom}></Waves3>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
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
          <ActivityIndicator size="small" color="#FEA58F" /> // Loading spinner
        ) : (
          <Text style={styles.loginButtonText}>Login</Text>
        )}
      </TouchableOpacity>
      <Text style={styles.welcomeText}>WELCOME</Text>
      <Text style={styles.versionText}>V: {appVersion}</Text>
      <CheckConnection />

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
        confirmButtonColor="#FF7758"
        onConfirmPressed={() => setShowAlert(false)}
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
    backgroundColor: "#fff",
  },
  welcomeText: {
    left: 50,
    top: 50,
    position: "absolute",
    color: 'white',
    fontSize: 35,
    fontFamily: 'Poppins',
  },
  title: {
    fontSize: 30,
    position: 'static',
    right: 0,
    top: -10,
    color: "black",
    fontFamily: "poppins",
  },
  versionText:{
    bottom: -280,
    right:160,
  },
  input: {
    height: hp('5%'),
    borderColor: "#8b8b8b99",
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: wp("80%"),
    borderWidth: 2,
    fontSize: wp("4.5%"),
  },
  inputContainer: {
    width: wp("80%"),
    height: hp('5%'),
    borderColor: "#ccc",
    borderRadius: 10,
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
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingLeft: 0,
  },
  wavesTop: {
    position: "absolute",
    left: 0,
    right: 0,
  },
  wavesTopSub: {
    position: "absolute",
    left: 0,
    right: 0,
  },
  wavesBottom: {
    position: "absolute",
    left: 0,
    right: 0,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: "#8b8b8b99",
    borderRadius: 10,
    paddingHorizontal: 10,
    width: wp("80%"),
    borderWidth: 2,
    marginBottom: 10,
  },
  passwordInput: {
    flex: 1,
    height: hp('5%'),
    fontSize: wp("4.5%"),
  },
  loginButton: {
    width: wp('33%'),
    height: hp('6%'),
    top: hp('29%'),
    left: wp('30%'),
    backgroundColor: 'white',
    borderRadius: 20,
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
    color: 'black',
    fontSize: hp('3%'),
    fontFamily: 'Poppins-Regular', // Make sure 'Poppins' is correctly loaded in your project
    fontWeight: '400',
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
});

export default LoginScreen;
