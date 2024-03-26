import React from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, Keyboard } from 'react-native';
import LoginScreen from './components/Login/LoginScreen';


export default function App() {
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };
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
