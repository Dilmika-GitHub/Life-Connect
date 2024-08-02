import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, BackHandler,Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Make sure to install this or use any icon library you prefer
import { Link } from "expo-router";
import AwesomeAlert from 'react-native-awesome-alerts';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from "expo-router";

const ChangeDefaultPassword = ({navigation}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const router = useRouter();

  const toggleCurrentPasswordVisibility = () => {
    setCurrentPasswordVisible(!currentPasswordVisible);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const handleUpdatePassword = () => {
    // Add your password update logic here

    // Show success alert
    setShowAlert(true);
  };

  const handleAlert = () => {
    router.push("/Screens/LoginScreen/LoginScreen")
    setShowAlert(false);
  };

  const navigateToProfilePage = () => {
    navigation.navigate('My Profile');
  };

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.navigate('My Profile');
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation])
  );

  return (
    <View style={styles.container}>
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
        title="Success"
        message="Password updated successfully!"
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        showConfirmButton={true}
        confirmText="OK"
        confirmButtonColor="#08818a"
        onConfirmPressed={handleAlert}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  welcomeNote: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#08818a',
    textAlign: 'center',
  },
  image:{
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginVertical: 20,
  },
  discription:{
    fontSize: 25,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 16,
    color: '#888',
    marginBottom: 20,
    marginTop:20,
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
});

export default ChangeDefaultPassword;
