import { View, Text, StyleSheet, Image } from 'react-native';
import React from 'react';
import { Link } from "expo-router";

const Profile = () => {
  return (
    <View style={styles.container}>
      {/* Top section border */}
      <View style={[styles.section, styles.topSection]}></View>

      {/* Bottom section border */}
      <View style={[styles.section, styles.bottomSection]}>
        {/* Grey color square text */}
        <View style={styles.greySquare}>
          <View style={styles.row}>
            <Text style={styles.titleText}>Agent Code:</Text>
            <Text style={styles.normalText}>123456</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.titleText}>NIC No:</Text>
            <Text style={styles.normalText}>987654321V</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.titleText}>E-mail:</Text>
            <Text style={styles.normalText}>michalsmitch12@gmail.com</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.titleText}>Mobile No:</Text>
            <Text style={styles.normalText}>077 123 4567</Text>
          </View>
          <View style={styles.row}>
          <Link style={styles.loginText} href={'../LoginScreen/ChangePassword'} asChild>
            <Text style={styles.changePasswordText}>Change Password</Text>
            </Link>
          </View>
        </View> 
      </View>

      {/* Profile Image */}
      <View style={styles.imageContainer}>
        <Image 
          source={require('../../../components/user.jpg')} 
          style={styles.roundImage}
          resizeMode="cover" 
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
    height: 155,
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
  changePasswordText:{
    fontSize: 16,
    color: 'blue',
  }
});



export default Profile;
