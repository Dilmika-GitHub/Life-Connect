import {Image , StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function MDRTProfile() {
  return (
    <View style={styles.container}>
      {/* Top section border */}
      <View style={[styles.section, styles.topSection]}></View>

      {/* Bottom section border */}
      <View style={[styles.section, styles.bottomSection]}>
        {/* Grey color square text */}
        <View style={styles.greySquare}>
          <View style={styles.row}>
            <Text style={styles.titleText}>Agent Code</Text>
            <Text style={styles.normalText}>904126</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.titleText}>Target </Text>
            <Text style={styles.normalText}>1,456,856.00</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.titleText}>No OF Policies:</Text>
            <Text style={styles.normalText}>26</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.titleText}>MDRT Ranking</Text>
            <Text style={styles.normalText}>23</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.titleText}>Mobile No:</Text>
            <Text style={styles.normalText}>077 123 4567</Text>
          </View>
        </View> 
      </View>

      {/* Profile Image */}
      <View style={styles.imageContainer}>
        <Image 
          source={require('../../../../components/user.jpg')} 
          style={styles.roundImage}
          resizeMode="cover" 
        />
        <Text style={styles.imageText}>Michel Smith</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  section: {
    width: '100%',
  },
  topSection: {
    flex: 1, 
    backgroundColor: '#FEA58F'
  },
  bottomSection: {
    flex: 5, 
    backgroundColor: 'white'
  },
  imageContainer: {
    position: 'absolute',
    left: '50%',
    top: '16%', 
    transform: [{ translateX: -100 }, { translateY: -100 }]
  },
  roundImage: {
    width: 200, 
    height: 200, 
    borderRadius: 100
  },
  imageText: {
    marginTop: 10, 
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black'
  },
  greySquare: {
    width: 320,
    height: 150,
    backgroundColor: 'lightgrey',
    marginTop: 150, 
    alignSelf: 'center',
    borderRadius: 10,
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  titleText: {
    fontSize: 16,
    color: 'black',
    minWidth: 100, // Ensure alignment
  },
  normalText: {
    fontSize: 16,
    color: 'grey'
  },
});
