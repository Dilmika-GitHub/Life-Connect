import React, { useState } from 'react';
import { View, Modal, TouchableOpacity, Text, StyleSheet, TextInput, } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const Income = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };
  const [inputValue, setInputValue] = useState("");
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
        nimationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCancel}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Set your target for Income</Text>
            <TextInput
              style={styles.input}
              onChangeText={setInputValue}
              value={inputValue}
            />
            <View style={styles.buttonRow}>
              <TouchableOpacity
                onPress={handleSubmit}
                style={styles.blueButton}
              >
                <Text style={styles.buttonText}>Set Target</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCancel} style={styles.redButton}>
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
    },

    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: hp("10%"),
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      modalView: {
        margin: hp("10%"),
        backgroundColor: "white",
        borderRadius: 20,
        padding: wp("10%"),
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: wp("2%"),
          height: hp("1%"),
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      },
      modalText: {
        marginBottom: 15,
        textAlign: "center",
        fontSize: wp("4.5%"),
      },
      input: {
        height: hp("5%"),
        width: wp("50%"),
        margin: 12,
        borderWidth: 1,
        padding: 10,
        fontSize: wp("4.5%"),
      },
      buttonRow: {
        flexDirection: "row",
      },
      blueButton: {
        backgroundColor: "blue",
        padding: wp("4%"),
        borderRadius: 5,
        marginRight: 10,
      },
      redButton: {
        backgroundColor: "red",
        padding: wp("4%"),
        borderRadius: 5,
      },
      buttonText: {
        color: "white",
        fontSize: wp("4.5%"),
      },
})

export default Income;
