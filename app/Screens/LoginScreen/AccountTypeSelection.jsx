import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from "@react-native-async-storage/async-storage";

const AccountTypeSelectionScreen = () => {
  const router = useRouter();

  const handleSelection = async (type) => {
    // Save selected category type to AsyncStorage or handle accordingly
    await AsyncStorage.setItem("selectedCategoryType", type);

    // Navigate to the respective screen based on the selection
    if (type === "Organizer") {
      await AsyncStorage.setItem("categoryType", "Or");
      router.push("/Screens/HomePage/Home");
    } else if (type === "Agent") {
      await AsyncStorage.setItem("categoryType", "Ag");
      router.push("/Screens/HomePage/Home");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Account Type</Text>
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => handleSelection('Organizer')}
      >
        <Image 
          source={require('../../../assets/organizer.png')} 
          style={styles.image}
        />
        <Text style={styles.buttonText}>Organizer</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => handleSelection('Agent')}
      >
        <Image 
          source={require('../../../assets/agent.png')} 
          style={styles.image}
        />
        <Text style={styles.buttonText}>Agent</Text>
      </TouchableOpacity>
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
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "bold",
  },
  button: {
    width: "80%",
    padding: 15,
    backgroundColor: "#08818a",
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
    flexDirection: 'row',  // Added to align image and text in a row
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    marginLeft: 10,  // Added to create space between image and text
  },
  image: {
    width: 30,  // Adjust the size as needed
    height: 30, // Adjust the size as needed
  },
});

export default AccountTypeSelectionScreen;
