import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Waves, Waves2, Waves3 } from "../../../components/Waves";
import { Link } from "expo-router";
import { useFonts } from "expo-font";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';



const LoginScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fontsLoaded] = useFonts({
    "Poppins-Regular": require("../../../assets/font/Poppins-Regular.ttf"),
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
const { width, height } = Dimensions.get("window"); // Get screen dimensions

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  welcomeText:{
    //bottom:wp('70%'),
    //right:wp('25%'),
    width: hp('50%'),
    height: wp('50%'),
    left: wp('10%'),
    top: hp('5%'),
    position: "absolute",
    color:'white',
    fontSize:hp('4%'),
    fontFamily:'Poppins',
  },
  title: {
    fontSize: wp('8%'),
    width: wp('25%'),
    height: hp('25%'),
    left: wp('8%'),
    top: hp('29%'),
    position: "absolute",
    color: "black",
    fontFamily: "poppins",
    fontWeight:'400',
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
  wavesTop: {
    position: "absolute",
    top: -wp('58%'),
    height: hp('71%'),
    left: 0,
    right: 0,
  },
  wavesTopSub: {
    position: "absolute",
    top: -wp('37%'),
    height: hp('73%'),
    left: 0,
    right: 0,
  },
  wavesBottom: {
    position: "absolute",
    bottom: -hp('24%'),
    height: hp('72%'),
    left: 0,
    right: 0,
  },
  loginButton: {
    width: wp('33%'),
    height: hp('6%'),
    left: wp('60%'),
    top: hp('77%'),
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

  // loginButton: {
  //   width: width * 0.4, // Set width based on screen width
  //   height: height * 0.07, // Set height based on screen height
  //   backgroundColor: "white",
  //   borderRadius: 20,
  //   justifyContent: "center",
  //   alignItems: "center",
  //   marginTop: height * 0.03, // Set margin top based on screen height
  //   shadowColor: "rgba(0, 0, 0, 0.25)",
  //   shadowOffset: {
  //     width: 0,
  //     height: 2,
  //   },
  //   shadowOpacity: 1,
  //   shadowRadius: 2,
  //   elevation: 2,
  // },

  loginButtonText: {
    width: wp('30%'),
    height: hp('30%'),
    left: wp('9.5%'),
    top: hp('0.8%'),
    position: 'absolute',
    color: 'black',
    fontSize: wp('6%'),
    fontSize: hp('3%'),
    fontFamily: 'Poppins', // Make sure 'Poppins' is correctly loaded in your project
    fontWeight: 400,
    zIndex: 2, // Ensure the button text appears above the background
  },
});

export default LoginScreen;
