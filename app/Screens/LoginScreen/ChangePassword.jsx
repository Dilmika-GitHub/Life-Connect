import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Make sure to install this or use any icon library you prefer
import { Link } from "expo-router";

const ChangePassword = ({ navigation }) => {
    const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const handleUpdatePassword = () => {
    // Add your password update logic here
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton}>
      <Link style={styles.loginText} href={'../UserProfile/Profile'} asChild> 
        <Icon name="arrow-back" size={24} color="#000" />
        </Link>
      </TouchableOpacity>
      <Text style={styles.title}>Set a new password</Text>
      <Text style={styles.subtitle}>Please Enter Current Password</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Current Password"
          secureTextEntry={!passwordVisible}
          onChangeText={setCurrentPassword}
          value={currentPassword}
        />
        <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
          <Icon name={passwordVisible ? "eye" : "eye-off"} size={20} color="#000" />
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  backButton: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    marginBottom: 20,
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
    backgroundColor: '#FF7758',
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

export default ChangePassword;
