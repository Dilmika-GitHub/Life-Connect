import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function MDRTProfile() {
  return (
    <View style={styles.container}>
      {/* Top section border */}
      <View style={[styles.section, styles.topSection]}></View>

      {/* Bottom section border */}
      <View style={[styles.section, styles.bottomSection]}>
        {/* Scrollable Grey color square text */}
        <ScrollView style={styles.greySquareScroll}>
          <View style={styles.greySquare}>
            <View style={styles.row}>
              <Text style={styles.titleText}>Agent Code</Text>
              <Text style={styles.normalText}>904126</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.titleText}>Target</Text>
              <Text style={styles.normalText}>1,456,856.00</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.titleText}>No OF Policies:</Text>
              <Text style={styles.normalText}>26</Text>
            </View>
            <View style={styles.specialRow}>
              <Text style={styles.titleText}>MDRT Ranking</Text>
              <Text style={styles.normalText}>23</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.titleText}>Need more</Text>
              <Text style={styles.normalText}>achieved</Text>
            </View>
            <View style={styles.specialRow}>
              <Text style={styles.titleText}>TOT Ranking</Text>
              <Text style={styles.normalText}>--</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.titleText}>Need more</Text>
              <Text style={styles.normalText}>1,214,456.00</Text>
            </View>
            <View style={styles.specialRow}>
              <Text style={styles.titleText}>COT Ranking</Text>
              <Text style={styles.normalText}>--</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.titleText}>Need more</Text>
              <Text style={styles.normalText}>3,456,568.00</Text>
            </View>
            <View style={styles.specialRow}>
              <Text style={styles.titleText}>HOF Ranking</Text>
              <Text style={styles.normalText}>--</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.titleText}>Need more</Text>
              <Text style={styles.normalText}>9,156,788.00</Text>
            </View>
          </View>
        </ScrollView>
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
    left: wp('50%'),
    top: hp('10%'), // Adjusted top to make more space
    transform: [{ translateX: -wp('25%') }, { translateY: -hp('10%') }]
  },
  roundImage: {
    width: wp('50%'),
    height: wp('50%'),
    borderRadius: wp('25%'),
    borderWidth: 3,
    borderColor: 'gold'
  },
  imageText: {
    marginTop: hp('1%'),
    textAlign: 'center',
    fontSize: wp('4%'),
    fontWeight: 'bold',
    color: 'black'
  },
  greySquareScroll: {
    width: wp('80%'),
    height: hp('55%'), // This sets the scrollable area's height
    marginTop: hp('20%'),
    alignSelf: 'center',
  },
  greySquare: {
    width: '100%',
    backgroundColor: 'lightgrey',
    borderRadius: 10,
    padding: wp('2.5%'),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp('2%'),
  },
  specialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp('1%'),
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
