import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const { width, height } = Dimensions.get("window"); // Get screen dimensions

const Profile = () => {
  return (
    <View style={styles.container}>
      {/* Top section border */}
      <View style={[styles.section, styles.topSection]}></View>

      {/* Bottom section border */}
      <View style={[styles.section, styles.bottomSection]}>
        {/* Grey color square with text */}
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
    left: wp('50%'),  // Use widthPercentageToDP for consistent positioning
    top: hp('16%'),   // Use heightPercentageToDP for consistent positioning
    transform: [{ translateX: -wp('25%') }, { translateY: -hp('12%') }]  // Ensure the translation is proportionate
  },
  roundImage: {
    width: wp('50%'),  // Adjust width and height to be responsive
    height: wp('50%'), // Make it square based on width
    borderRadius: wp('25%'), // Half of the width/height to ensure a perfect circle
  },
  imageText: {
    marginTop: hp('1.5%'),
    textAlign: 'center',
    fontSize: wp('4%'), // Responsive font size
    fontWeight: 'bold',
    color: 'black'
  },
  greySquare: {
    width: wp('80%'),
    height: hp('20%'),  // Adjust height based on design needs
    backgroundColor: 'lightgrey',
    marginTop: hp('20%'),  // Increase margin top to be proportionate
    alignSelf: 'center',
    borderRadius: 10,
    padding: wp('2.5%'),  // Responsive padding
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp('2%'),  // Responsive margin bottom
  },
  titleText: {
    fontSize: wp('4%'),  // Responsive font size
    color: 'black',
    minWidth: wp('25%'),  // Ensure alignment with responsive minimum width
  },
  normalText: {
    fontSize: wp('4%'),  // Responsive font size
    color: 'grey'
  },
});

export default Profile;