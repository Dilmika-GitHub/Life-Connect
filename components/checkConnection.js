import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet} from "react-native";
import NetInfo from '@react-native-community/netinfo';
import Modal from "react-native-modal";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { MaterialCommunityIcons } from "@expo/vector-icons";


const checkConnection = () => {
    
const [isModalVisible, setModalVisible] = useState(false);
    
const handleConnectivityChange = (state) => {
    setModalVisible(!state.isConnected);
  };

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(handleConnectivityChange);
    return () => unsubscribe();
  }, []);

  const handleModalRetry = () => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        setModalVisible(false);
      }
    });
  };

  return (
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={handleModalRetry}
        style={styles.modal}
      >
      <View style={styles.Connection}>
        <MaterialCommunityIcons 
          name="wifi-off" 
          size={hp('10%')} 
          color="black" 
          style={styles.icon} 
        />
        <Text style={styles.boldText}>You're Offline!</Text>
        <Text style={styles.ConnectionText}>
          Turn on mobile data or connect to a Wi-Fi.
        </Text>
        <TouchableOpacity onPress={handleModalRetry}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
        </View>
      </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  Connection: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
  },
  icon: {
    marginBottom: hp('2%'),
  },
  boldText: {
    fontSize: hp('2.5%'),
    fontWeight: 'bold',
    marginBottom: hp('1%'),
  },
  ConnectionText: {
    fontSize: hp('2.5%'),
    marginBottom: hp('2%'),
    textAlign: 'center',
  },
  retryText: {
    color: '#007BFF',
    fontSize: hp('2.2%'),
  },
});

export default checkConnection;
