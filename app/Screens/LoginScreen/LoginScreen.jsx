import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import {Waves,Waves2} from '../../../components/Waves';
import { Link } from 'expo-router';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log('Username:', username);
    console.log('Password:', password);
  };

  return (
    <View style={styles.container}>
      <Waves2 style={styles.wavesTopSub} />
      <Waves style={styles.wavesTop} />
      
      <Waves style={styles.wavesBottom}></Waves>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        onChangeText={text => setUsername(text)}
        value={username}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={text => setPassword(text)}
        value={password}
        secureTextEntry
      />
      <Link style={styles.loginText} href={'../Screens/HomePage/Home'} asChild>
      <Button title="Login" onPress={handleLogin} />
      </Link>
      
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  wavesTop: {
    position: 'absolute',
    top: -323,
    left: 0,
    right: 0,
  },
  wavesTopSub: {
    position: 'absolute',
    top: -300,
    left: 0,
    right: 0,
  },
  wavesBottom: {
    position: 'absolute',
    bottom: -350,
    left: 0,
    right: 0,
    transform: [{ rotateX: '180deg' }],
    transform: [{rotateZ: '180deg'}],
  },
});

export default LoginScreen;
