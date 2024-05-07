import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions, TouchableOpacity, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { SelectList } from 'react-native-dropdown-select-list';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Bar1, Bar2 } from "../../components/Chart";

const Competitions = () => {
  const winnersData = [
    { name: 'Clifford', achievedTarget: '5,652,125.00'},
    { name: 'Tara', achievedTarget: '4,252,241.00'},
    { name: 'Pascal', achievedTarget: '3,562,324.00'},
    { name: 'Pascal', achievedTarget: '3,412,324.00'},
    { name: 'Michel', achievedTarget: '1,000,000.00'},
    { name: 'Devin', achievedTarget: '200,000.00'},
    { name: 'Edward', achievedTarget: '1,200,000.00'},
    { name: 'Shen', achievedTarget: '100,000.00'},
    { name: 'Wilson', achievedTarget: '800,000.00'},
  ];

  winnersData.sort((a, b) => parseInt(b.achievedTarget.replace(/,/g, ''))- parseInt(a.achievedTarget.replace(/,/g, '')));

  const limitedWinnersData = winnersData.slice(0, 500);
  
  const firstPlace = limitedWinnersData[0];
  const secondPlace = limitedWinnersData[1];
  const thirdPlace = limitedWinnersData[2];

  const user = { name: 'Michel', achievedTarget: '1,000,000' };
  const userPlace = limitedWinnersData.findIndex(item => item.name === user.name) + 1;
  const userItem = { ...user, place: userPlace };
  limitedWinnersData.push(userItem);


  const handleSelectionChange = (val) => {
    setSelectedValue(val);
    // Update the selected data based on the selected option
    switch (val) {
      case 'Island Ranking':
        setSelectedData(limitedWinnersData);
        break;
      case 'Regional Ranking':
        // Replace with your hard-coded regional ranking data
        setSelectedData([
          { name: 'Regional Winner 1', achievedTarget: '1,000,000' },
          { name: 'Regional Winner 6', achievedTarget: '5,000,000' },
          { name: 'Regional Winner 3', achievedTarget: '700,000' },
          { name: 'Regional Winner 2', achievedTarget: '800,000' },
          { name: 'Regional Winner 4', achievedTarget: '700,000' },
          { name: 'Regional Winner 5', achievedTarget: '700,000' },
        ]);
        break;
      case 'Branch Ranking':
        // Replace with your hard-coded branch ranking data
        setSelectedData([
          { name: 'Branch Winner 3', achievedTarget: '1,000,000' },
          { name: 'Branch Winner 1', achievedTarget: '5,000,000' },
          { name: 'Branch Winner 2', achievedTarget: '800,000' },
          { name: 'Branch Winner 3', achievedTarget: '300,000' },
        ]);
        break;
      case 'Team Ranking':
        // Replace with your hard-coded team ranking data
        setSelectedData([
          { name: 'Team Winner 2', achievedTarget: '1,500,000' },
          { name: 'Team Winner 1', achievedTarget: '200,000' },
          { name: 'Team Winner 3', achievedTarget: '100,000' },
          { name: 'Team Winner 2', achievedTarget: '800,000' },
        ]);
        break;
      default:
        setSelectedData(limitedWinnersData);
        break;
    }
  };


  const renderProfilePic = (winner) => {
    if (winner.profilePic) {
      // Return the profile picture fetched from the URL
      return <Image source={{ uri: winner.profilePic }} style={styles.profilePic} />;
    } else {
      // Return the default profile picture icon
      return <Icon name="user-circle" size={26} color="#FF5733" style={{ marginRight: 10 }} />;
    }
  };


  const renderItem = ({ item }) => (
    <View style={[styles.itemContainer, { width: itemWidth }, parseInt(item.achievedTarget.replace(/,/g, '')) >= 1000000 && styles.achievedItem]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image 
          source={require('../../components/user.jpg')} 
          style={[styles.roundImageforList, { width: 58, height: 58, marginRight:10 }]} 
          resizeMode="cover" 
        />
          <Text style={[styles.itemName, { color: '#333' }]}>{item.name}</Text>
        </View>
        <Text style={[styles.itemTarget, { color: 'black', fontWeight: 'bold', marginTop: -15 }]}>{item.achievedTarget}</Text>
      </View>
      {parseInt(item.achievedTarget.replace(/,/g, '')) >= 1000000 ? (
          <Text style={[styles.achievedText, styles.achievedTextGreen, {fontSize: 14}]}>Achieved</Text>
        ) : null}
    </View>
  );
  
  

  const renderUser = () => (
    <View style={[styles.itemContainer, styles.userContainer, { width: itemWidth }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View style={[styles.imageContainer, { left: '30%', marginTop: 93 }]}> 
        <Image 
          source={require('../../components/user.jpg')} 
          style={[styles.roundImage, { width: 58, height: 58 }]} 
          resizeMode="cover" 
        />
      </View>
      </View>
      <Text style={[styles.itemTarget, styles.userAchievedTarget, { color: 'black' }]}>Sales amount</Text>
      <Text style={[styles.itemTarget, styles.userAchievedTarget, { color: 'black' }]}>
      {userItem.achievedTarget}
      </Text>
      <View style={{ alignItems: 'center', marginTop: -38 }}>
  <Text style={[styles.userPlace, { fontSize: 16 }]}>Your Place</Text>
  <Text style={[styles.userPlace, { fontSize: 16, marginTop: 5 }]}>{userItem.place}</Text>
</View>

    </View>
  );


  const screenWidth = Dimensions.get('window').width;
  const itemWidth = screenWidth * 0.9; 
  const [selectedValue, setSelectedValue] = useState('Island Ranking');
  const [showPicker, setShowPicker] = useState(false);
  const [selectedData, setSelectedData] = useState(limitedWinnersData); 

  const data = [
    { key: '1', value: 'Island Ranking' },
    { key: '2', value: 'Regional Ranking' },
    { key: '3', value: 'Branch Ranking' },
    { key: '4', value: 'Team Ranking' },
  ];
  
  const Bardata = {
    labels: [
      `${firstPlace.name}`,
      `${secondPlace.name}`,
      `${thirdPlace.name}`
    ],
    datasets: [
      {
        data: [30, 40, 20]
      }
    ]
  };

  const graphStyle = StyleSheet.create({
    container: {
      marginVertical: 8,
      borderRadius: 16,
    },
    barStyle: {
      marginVertical: 8,
      borderRadius: 16,
    },
  });

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0, 
    color: (opacity = 1) => `rgba(247, 70, 57, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    barPercentage: 1.5, 
    yAxisMinimumValue: 0, 
    groupWidth: 0,
    verticalLabelRotation: 0,
    formatYLabel: (label) => {
      if (label) {
        const parts = label.split('\n');
        return parts[0]; 
      }
      return '';
    },
    
  };
  
  
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>MDRT Competition Winners</Text>
      <View style={styles.dropdownContainer}>
        <SelectList
          data={[
            { key: '1', value: 'Island Ranking' },
            { key: '2', value: 'Regional Ranking' },
            { key: '3', value: 'Branch Ranking' },
            { key: '4', value: 'Team Ranking' },
          ]}
          save="value"
          setSelected={handleSelectionChange}
          visible={true} 
          style={styles.dropdown}
        >
          <TouchableOpacity onPress={() => setShowPicker(!showPicker)} style={styles.dropdown}>
            <Text style={styles.selectedValue}>{selectedValue}</Text>
          </TouchableOpacity>
        </SelectList>
      </View>
    <View style={[styles.barContainer, { marginTop: 60 }, ]}>
    <Bar1
          renderProfilePic={renderProfilePic(firstPlace)}
          name={firstPlace.name}
          achievedTarget={firstPlace.achievedTarget}
        />
    <View style={{ marginTop: -150, alignItems: 'center' }}>
    <Bar2
            profilePic={renderProfilePic(secondPlace)}
            name={secondPlace.name}
            achievedTarget={secondPlace.achievedTarget}
          />
      <Text style={styles.nameText}>{firstPlace.name}</Text>
      <Text style={styles.valueText}>{firstPlace.achievedTarget}</Text>
      <Text style={styles.secWinnerNameText}>{secondPlace.name}</Text>
      <Text style={styles.secWinnerValueText}>{secondPlace.achievedTarget}</Text>
      <Text style={styles.thirdWinnerNameText}>{thirdPlace.name}</Text>
      <Text style={styles.WinnerValueText}>{thirdPlace.achievedTarget}</Text>
    </View>
  </View>
      <FlatList
        data={selectedData}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.flatListContainer}
      />
      <View style={{ alignItems: 'center' }}>
        {renderUser()}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5', 
  },
  achievedItem: {
    backgroundColor: '#DCD7D6', 
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
    fontSize: 16,
    textAlign: 'right',
  },
  achievedText: {
    fontSize: 14,
    color: 'green',
    fontWeight: 'bold',
    position: 'absolute',
    bottom: 0,
    right: 0,
    padding: 10,
    marginRight: 15,
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
    width: '42%', 
    alignSelf: 'left', 
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
  nameText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: -100, 
    textAlign: 'center', 
  },
  valueText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#75500b',
    marginTop: 10, 
    textAlign: 'center', 
    marginBottom: 50,
  },
  secWinnerNameText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: -65, 
    marginLeft: -230,
  },
  secWinnerValueText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#75500b',
    marginTop: 0, 
    marginBottom: 20, 
    marginLeft: -230,
  },
  thirdWinnerNameText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: -65, 
    marginLeft: 230, 
  },
  WinnerValueText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#75500b',
    marginTop: 0, 
    marginLeft: 230, 
    marginBottom: 20, 
  },
  profilePic: {
    width: 26,
    height: 26,
    marginRight: 10,
  },
  userContainer: {
    backgroundColor: '#bbbfc9', 
    borderColor: '#a8adba', 
    borderWidth: 2,
  },
  userName: {
    fontWeight: 'bold',
    color: '#333', 
  },
  userAchievedTarget: {
    color: 'black',
  },
  userPlace: {
    color: 'black', 
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
    borderRadius: 100,
    borderWidth: 3, 
    borderColor: '#7facf5'
  },
  roundImageforList: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
});



export default Competitions