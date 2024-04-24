import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Waves, Waves2, Waves3 } from "../../../components/Waves";
import { Link } from "expo-router";
import { useFonts } from "expo-font";

const LoginScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fontsLoaded] = useFonts({
    "Poppins-Bold": require("../../../assets/font/Poppins-Bold.ttf"),
    // Add other font weights and styles if necessary
  });

  const handleLogin = () => {
    console.log("Username:", username);
    console.log("Password:", password);
    //want to add navigation
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
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={(text) => setPassword(text)}
        value={password}
        secureTextEntry
      />
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
      <Link style={styles.loginText} href={'../Screens/HomePage/Home'} asChild>
        <Text style={styles.loginButtonText}>Login</Text>
        </Link>
      </TouchableOpacity>
      <Text style={styles.welcomeText}>WELCOME</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  welcomeText:{
    top:-402,
    left:-90,
    color:'white',
    fontSize:36,
    fontFamily:'Poppins'
  },
  title: {
    fontSize: 30,
    width: 338,
    height: 67,
    left: 40,
    top: 260,
    position: "absolute",
    color: "black",
    fontFamily: "poppins",
    fontWeight:'400'
  },
  input: {
    width: "80%",
    height: 40,
    borderColor: "#8b8b8b99",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  wavesTop: {
    position: "absolute",
    top: -330,
    left: 0,
    right: 0,
  },
  wavesTopSub: {
    position: "absolute",
    top: -233,
    left: 0,
    right: 0,
  },
  wavesBottom: {
    position: "absolute",
    bottom: -300,
    left: 0,
    right: 0,
  },
  loginButton: {
    width: 140,
    height: 50,
    left: 250,
    top: 700,
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 20,
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
    width: 55,
    height: 33,
    left: 42,
    top: 9,
    position: 'absolute',
    color: 'black',
    fontSize: 20,
    fontFamily: 'Poppins', // Make sure 'Poppins' is correctly loaded in your project
    fontWeight: '400',
    zIndex: 2, // Ensure the button text appears above the background
  },
});

export default LoginScreen;
