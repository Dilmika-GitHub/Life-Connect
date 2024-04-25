import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const Profile = () => {
  return (
    <View style={styles.container}>
    {/* Left half */}
    <View style={[styles.half, styles.leftHalf]}></View>

    {/* Right half */}
    <View style={[styles.half, styles.rightHalf]}></View>
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column', // To arrange the two halves horizontally
  },
  half: {
    flex: 1, // Take up half of the screen
  },
  leftHalf: {
    backgroundColor: 'blue', // Set left half color
  },
  rightHalf: {
    backgroundColor: 'green', // Set right half color
  },
});

export default Profile