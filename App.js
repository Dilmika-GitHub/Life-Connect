import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, Keyboard, ActivityIndicator } from 'react-native';
import * as Font from 'expo-font';
import LoginScreen from './components/Login/LoginScreen';

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const loadFonts = async () => {
    await Font.loadAsync({
      'Poppins-Regular': require('./assets/font/Poppins-Regular.ttf'),
      'Poppins-Bold': require('./assets/font/Poppins-Bold.ttf'),
    });
  };

  useEffect(() => {
    const loadAllFonts = async () => {
      await loadFonts();
      setFontsLoaded(true);
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
