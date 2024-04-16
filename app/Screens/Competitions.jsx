import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { SelectList } from 'react-native-dropdown-select-list';

const Competitions = () => {
  const winnersData = [
    { name: 'Winner 2', achievedTarget: '8,00,000' },
    { name: 'Winner 3', achievedTarget: '7,00,000' },
    { name: 'Winner 4', achievedTarget: '6,00,000' },
    { name: 'Winner 5', achievedTarget: '5,00,000' },
    { name: 'Winner 1', achievedTarget: '10,00,000' },
    { name: 'Winner 6', achievedTarget: '220,00,000' },
    { name: 'Winner 1', achievedTarget: '12,00,000' },
    { name: 'Winner 1', achievedTarget: '157,00,000' },
    { name: 'Winner 2', achievedTarget: '8,00,000' },
  ];

  winnersData.sort((a, b) => parseInt(b.achievedTarget.replace(/,/g, ''))- parseInt(a.achievedTarget.replace(/,/g, '')));

  const limitedWinnersData = winnersData.slice(0, 500);
  
  const firstPlace = limitedWinnersData[0];
  const secondPlace = limitedWinnersData[1];
  const thirdPlace = limitedWinnersData[2];

  const renderItem = ({ item }) => (
    <View style={[styles.itemContainer, { width: itemWidth }]}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
        <Text style={[styles.itemName, { color: '#333' }]}>Name: {item.name}</Text>
        {parseInt(item.achievedTarget.replace(/,/g, '')) >= 1000000 ? (
          <Text style={styles.achievedText}>Achieved</Text>
        ) : null}
      </View>
      <Text style={[styles.itemTarget, { color: '#666' }]}>Achieved Target: {item.achievedTarget}</Text>
    </View>
  );

  const screenWidth = Dimensions.get('window').width;
  const itemWidth = screenWidth * 0.9; 
  const [selectedValue, setSelectedValue] = useState('Island Ranking');
  const [showPicker, setShowPicker] = useState(false);

  const data = [
    { key: '1', value: 'Island Ranking' },
    { key: '2', value: 'Country Ranking' },
  ];
  
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>MDRT Competition Winners</Text>
      <View style={styles.dropdownContainer}>
      <SelectList
        data={data}
        save="value"
        setSelected={(val) => {
          setSelectedValue(val);
          setShowPicker(false);
        }}
        visible={showPicker}
        style={styles.dropdown}
      >
        <TouchableOpacity onPress={() => setShowPicker(!showPicker)} style={styles.dropdown}>
          <Text style={styles.selectedValue}>{selectedValue}</Text>
        </TouchableOpacity>
      </SelectList>
    </View>
      {/* <Text style={styles.heading}>MDRT Competition Winners</Text> */}
      <View style={styles.chartContainer}>
        <BarChart place="First" winner={firstPlace} screenWidth={screenWidth} />
        <BarChart place="Second" winner={secondPlace} screenWidth={screenWidth} />
        <BarChart place="Third" winner={thirdPlace} screenWidth={screenWidth} />
      </View>
      <FlatList
        data={limitedWinnersData} // Render only the first 5 items
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.flatListContainer}
      />
    </View>
  )
}

const BarChart = ({ place, winner, screenWidth }) => {
  const barHeight = (parseInt(winner.achievedTarget.replace(/,/g, '')) / 220000000) * screenWidth * 0.9;

  return (
    <View style={styles.barContainer}>
      <Text style={styles.placeText}>{place}</Text>
      <View style={[styles.bar, { height: barHeight }]} />
      <Text style={styles.targetText}>{winner.achievedTarget}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5', 
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  flatListContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer: {
    padding: 15,
    backgroundColor: '#fff', 
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginVertical: 5,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemTarget: {
    fontSize: 14,
    textAlign: 'right',
  },
  achievedText: {
    fontSize: 14,
    color: 'green',
    fontWeight: 'bold',
    position: 'absolute',
    bottom: 0,
    right: 0,
    padding: 5,
  },
  barContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 5,
  },
  bar: {
    height: 20, 
    backgroundColor: 'blue', 
    borderRadius: 5, 
  },
  placeText: {
    marginBottom: 5,
  },
  targetText: {
    marginTop: 5,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 1,
    marginBottom: 10,
  },
  dropdownContainer: {
    width: '40%', // Set the width of the dropdown container
    alignSelf: 'left', // Align the dropdown container to the center
  },
  selectedValue: {
    fontSize: 16,
    color: '#333',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 10,
  },
});



export default Competitions