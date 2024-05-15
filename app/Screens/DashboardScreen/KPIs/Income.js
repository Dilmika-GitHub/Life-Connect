import React, { useState } from 'react';
import { View, Modal, TouchableOpacity, Text, StyleSheet, TextInput, } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const Income = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handlePress = () => {
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const handleSubmit = () => {
    console.log("Submitted value:", inputValue);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={openModal}>
        <View style={styles.iconView}>
          <MaterialCommunityIcons name="target" size={hp('5%')} color="black" />
        </View>
      </TouchableOpacity>
      
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCancel}
      >
        <View style={[styles.centeredView, {padding: hp("5%")}]} >
          <View style={[styles.modalView, {height: hp("22%"), width: wp("70%")}]}>
            <Text style={styles.modalText}>Set your target for Income</Text>
            <TextInput
              style={styles.input}
              onChangeText={text => {
                const numericValue = text.replace(/[^0-9]/g, '');
                setInputValue(numericValue);
              }}
              value={inputValue}
              keyboardType='numeric'
            />
            <View style={styles.buttonRow}>
              <TouchableOpacity
                onPress={handleSubmit}
                style={[styles.blueButton, {height: hp("5.5%"), width: wp("30%")}]}
              >
                <Text style={styles.buttonText}>Set Target</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCancel} style={[styles.redButton, {height: hp("5.5%"), width: wp("30%")}]} >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: wp('2%'),
      height: hp('1%'),
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    padding: wp("2%"),
  },
  modalText: {
    textAlign: 'center',
    fontSize: wp('4.5%'),
    marginBottom: hp('2%'),
  },
  input: {
    height: hp('5%'),
    width: wp('50%'),
    marginVertical: hp('2%'),
    borderBottomWidth: 1,
    borderBottomColor: 'black', 
    padding: hp('1%'),
    fontSize: wp('4.5%'),
    marginTop:1,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: wp('60%'),
  },
  blueButton: {
    backgroundColor: 'blue',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight:10,
  },
  redButton: {
    backgroundColor: 'red',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: wp('4%'),
    textAlign: 'center',
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('3%'),
  },
});

export default Income;
