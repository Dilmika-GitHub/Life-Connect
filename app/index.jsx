import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, Keyboard, ActivityIndicator } from 'react-native';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import LoginScreen from './Screens/LoginScreen/LoginScreen';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const loadFonts = async () => {
    await Font.loadAsync({
      'Poppins-Regular': require('../assets/font/Poppins-Regular.ttf'),
      'Poppins-Bold': require('../assets/font/Poppins-Bold.ttf'),
    });
  };

  useEffect(() => {
    const loadAllFonts = async () => {
      await loadFonts();
      await new Promise(resolve => setTimeout(resolve, 3000)); // Wait for 3 seconds
      setFontsLoaded(true);
      SplashScreen.hideAsync(); // Hide the splash screen after the delay
    };
    loadAllFonts();
  }, []);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <LoginScreen />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
