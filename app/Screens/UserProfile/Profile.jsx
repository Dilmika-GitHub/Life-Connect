import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const { width, height } = Dimensions.get("window"); // Get screen dimensions

const Profile = () => {
  return (
    <View style={styles.container}>
      {/* Top section with a simple color background */}
      <View style={[styles.section, styles.topSection]}></View>

      {/* Bottom section containing user information */}
      <View style={[styles.section, styles.bottomSection]}>
        {/* Information box with user details */}
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
        </View>
      </View>

      {/* Circular profile image */}
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
    left: wp('50%'),  // Center horizontally
    top: hp('16%'),   // Position vertically
    transform: [{ translateX: -wp('25%') }, { translateY: -hp('12%') }]  // Adjust to center the image
  },
  roundImage: {
    width: wp('50%'),
    height: wp('50%'),
    borderRadius: wp('25%'),  // Circular image
  },
  imageText: {
    marginTop: hp('1.5%'),
    textAlign: 'center',
    fontSize: wp('4%'),
    fontWeight: 'bold',
    color: 'black'
  },
  greySquare: {
    width: wp('80%'),
    height: hp('25%'),
    backgroundColor: 'lightgrey',
    marginTop: hp('34%'),
    alignSelf: 'center',
    borderRadius: 10,
    padding: wp('2.5%'),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp('2%'),
  },
  titleText: {
    fontSize: wp('4%'),
    color: 'black',
    minWidth: wp('25%'),
  },
  normalText: {
    fontSize: wp('4%'),
    color: 'grey'
  },
});

export default Profile;
