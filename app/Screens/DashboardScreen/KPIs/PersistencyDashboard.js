import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

const PersistencyDashboard = ({ percentage = 75 }) => {
  return (
    <View style={styles.container}>
      {/* Title at the Top Center */}
      <Text style={styles.title}>Persistency</Text>

      <View style={styles.circleContainer}>
        {/* Solid Circle with Percentage */}
        <View style={styles.circle}>
          <Text style={styles.percentageText}>{`${percentage}%`}</Text>
        </View>

        {/* Text Information */}
        <View style={styles.textContainer}>
          <Text style={styles.description}>2024</Text>
          <Text style={styles.description}>June</Text>
          <Text style={styles.description}>Inforced : 75</Text>
          <Text style={styles.description}>Lapsed : 25</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center', // Centers content horizontally
    marginBottom: wp('5%'), // Adds margin to the bottom of the component
  },
  title: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    marginBottom: wp('3%'), // Adds some space between the title and the circle
  },
  circleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circle: {
    width: wp('30%'),
    height: wp('30%'),
    borderRadius: wp('15%'), 
    backgroundColor: '#F04B5C', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentageText: {
    fontSize: wp('8%'), // Increased font size slightly for better visibility
    fontWeight: 'bold',
    color: '#FFFFFF', // White text color
  },
  textContainer: {
    marginLeft: wp('8%'), // Increased space between the circle and the text
  },
  description: {
    fontSize: wp('4%'),
    color: '#000',
    marginBottom: wp('1%'), // Adds space between each line of text
  },
});

export default PersistencyDashboard;
