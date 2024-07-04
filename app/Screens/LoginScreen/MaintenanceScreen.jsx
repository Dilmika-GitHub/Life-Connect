import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';

const MaintenanceScreen = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/maintenance.png')}
        style={styles.image}
      />
      <Text style={styles.title}>Hang on!</Text>
      <Text style={styles.subtitle}>We are under maintenance</Text>
      <Text style={styles.message}>
        We apologize for any inconvenience caused. We've almost done.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4A6CF7',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default MaintenanceScreen;
