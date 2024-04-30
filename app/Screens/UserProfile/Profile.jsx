import { View, Text, StyleSheet,Image } from 'react-native'
import React from 'react'

const Profile = () => {
  return (
    <View style={styles.container}>
      {/* Top section */}
      <View style={[styles.section, styles.topSection]}></View>

      {/* Bottom section */}
      <View style={[styles.section, styles.bottomSection]}>

        {/* Grey color square */}
      <View style={styles.greySquare}>
      <Text style={styles.greyText}>Your Gray Box Text Here</Text>
        </View> 
      </View>

      {/* Round Image at the border */}
      <View style={styles.imageContainer}>
        <Image 
          source={require('../../../components/user.jpg')} // Example image URL
          style={styles.roundImage}
          resizeMode="cover" // This helps maintain aspect ratio
        />
        <Text style={styles.imageText}>Michel Smith</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    
  },
  section: {
    width: '100%' // Use the full width of the screen
  },
  topSection: {
    flex: 1, // 1/5 of the screen
    backgroundColor: '#FEA58F'
  },
  bottomSection: {
    flex: 5, // 4/5 of the screen
    backgroundColor: 'white'
  },
  imageContainer: {
    position: 'absolute',
    left: '50%',
    top: '16%', // Since the top section is 20% of the screen
    transform: [{ translateX: -100 }, { translateY: -100 }] // Centers the image both horizontally and vertically
  },
  roundImage: {
    width: 200, // Set the size of the image
    height: 200, // Set the size of the image
    borderRadius: 100 // Makes the image round
  },
  imageText: {
    marginTop: 10, // Adjust the spacing between the image and text
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black'
  },
  greySquare: {
    width: 250,
    height: 400,
    backgroundColor: 'lightgrey',
    marginTop: 150, // Adjust the spacing between the image and the grey square
    alignSelf: 'center',
    borderRadius: 10
  },
});

export default Profile