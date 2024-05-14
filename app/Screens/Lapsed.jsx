import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Alert, Linking, Platform } from 'react-native';
import Modal from 'react-native-modal';
import { SearchBar } from 'react-native-elements';

const data = [
    { title: 'DIVI THILINA', key: 'GP10224XXXX', name: 'T. Dilshan', amount: 'Rs. 5,000,000.00', contact: '076 123 4567', email: 'dilshan@gmail.com'},
    { title: 'DIVI THILINA', key: 'GP15585XXXX', name: 'V. Sudarshan', amount: 'Rs. 4,600,000.00', contact: '076 123 4589', email: 'sudarshan@gmail.com'},
    { title: 'DIVI THILINA', key: 'GP10225XXXX', name: 'N. Silva', amount: 'Rs. 4,100,000.00', contact: '076 345 4567', email: 'silva@gmail.com'},
    { title: 'DIVI THILINA', key: 'GP15586XXXX', name: 'U. Tharanga', amount: 'Rs. 4,000,000.00' , contact: '076 768 4897', email: 'tharanga@gmail.com'},
    { title: 'DIVI THILINA', key: 'GP10226XXXX', name: 'N. Kulasekara', amount: 'Rs. 1,500,000.00' , contact: '076 123 4653', email: 'kulasekara@gmail.com'},
    { title: 'DIVI THILINA', key: 'GP15587XXXX', name: 'D. Gunathilake', amount: 'Rs. 700,000.00' , contact: '076 836 0388', email: 'gunathilake@gmail.com'},
    { title: 'DIVI THILINA', key: 'GP10227XXXX', name: 'T. Dilshan', amount: 'Rs. 5,000,000.00' , contact: '076 171 5346', email: 'dilshan@gmail.com'},
    { title: 'DIVI THILINA', key: 'GP15588XXXX', name: 'V. Sudarshan', amount: 'Rs. 4,600,000.00' , contact: '078 325 6972', email: 'sudarshan@gmail.com'},
    { title: 'DIVI THILINA', key: 'GP10228XXXX', name: 'N. Silva', amount: 'Rs. 4,100,000.00' , contact: '071 123 4567', email: 'silva@gmail.com'},
    { title: 'DIVI THILINA', key: 'GP15589XXXX', name: 'U. Tharanga', amount: 'Rs. 4,000,000.00' , contact: '077 177 5767', email: 'dTharanga@gmail.com'},
    { title: 'DIVI THILINA', key: 'GP10229XXXX', name: 'N. Kulasekara', amount: 'Rs. 1,500,000.00' , contact: '076 567 4567', email: 'kulasekara@gmail.com'},
    { title: 'DIVI THILINA', key: 'GP15581XXXX', name: 'D. Gunathilake', amount: 'Rs. 700,000.00' , contact: '075 768 4235', email: 'gunathilake@gmail.com'},
  ];

  const Item = ({title,  name, amount, contact, email, keyText, index, onPress }) => (
    <TouchableOpacity
      style={[styles.item]}
      onPress={() => onPress(title, keyText, name, amount, contact, email)}
    >
      <Text style={styles.keyText}>{keyText}</Text>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.amount}>{amount}</Text>
      {/* <Text style={styles.contact}>{contact}</Text> */}
    </TouchableOpacity>
  );
  
  export default function Lapsed() {
    const [isModalVisible, setModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState({ title: '', key: '', name: '', amount: '', contact: '', email:''});
    const [searchValue, setSearchValue] = useState('');

    const showDetails = (title, key, name, amount, contact, email) => {
      setModalContent({ title, key, name, amount, contact, email });
      setModalVisible(true);
    };
  
    const hideModal = () => setModalVisible(false);

    const handleContactPress = (contact) => {
      // let phoneNumber = Platform.OS === 'ios' ? `telprompt:${contact}` : `tel:${contact}`;
      Linking.openURL(`tel:${contact}`);
    };

    const handleEmailPress = (email) => {
      Linking.openURL(`mailto:${email}`);
    };
    
    return (
      <View style={styles.searchbar}>
      <SearchBar
        placeholder="Search Policy"
        containerStyle={styles.searchBarContainer}
        inputContainerStyle={styles.inputContainer}
        inputStyle={styles.input}
        searchIcon={{ size: 24 }}
        onChangeText={setSearchValue}
        value={searchValue}
      />
      <View style={styles.container}>
        <FlatList
          data={data}
          renderItem={({ item, index }) => (
            <Item
              title={item.title}
              name={item.name}
              amount={item.amount}
              contact={item.contact}
              email={item.email}
              keyText={item.key}
              index={index}
              onPress={showDetails}
            />
          )}
          keyExtractor={item => item.key}
        />
        <Modal isVisible={isModalVisible} onBackdropPress={hideModal}>
          <View style={styles.modalContent}>
            <Text style={styles.modalheader}>{modalContent.title}</Text>
            <View style={styles.modalRow}>
              <Text style={styles.modalLabel}>Policy No. </Text>
              <Text style={styles.modalText}>{modalContent.key}</Text>
            </View>
            <View style={styles.modalRow}>
              <Text style={styles.modalLabel}>Insured Name </Text>
              <Text style={styles.modalText}>{modalContent.name}</Text>
            </View>
            <View style={styles.modalRow}>
              <Text style={styles.modalLabel}>Sum Assured </Text>
              <Text style={styles.modalText}>{modalContent.amount}</Text>
            </View>
            <TouchableOpacity onPress={() => handleContactPress(modalContent.contact)}>
            <View style={styles.modalRow}>
              <Text style={styles.modalLabel}>Contact No. </Text>
              <Text style={styles.modalTextLink}>{modalContent.contact}</Text>
            </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleEmailPress(modalContent.email)}>
            <View style={styles.modalRow}>
              <Text style={styles.modalLabel}>Email </Text>
              <Text style={styles.modalTextLink}>{modalContent.email}</Text>
            </View>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    header: {
      fontSize: 14,
      paddingTop: 20,
      paddingLeft: 10, 
      paddingBottom: 10,
    },
    item: {
      backgroundColor: '#F8F8F8',
      padding: 10,
      marginVertical: 8,
      marginHorizontal: 8,
      borderRadius: 10,
      elevation: 3
    },
    majorBackground: {
      backgroundColor: '#FFCECE',
    },
    keyText: {
      fontSize: 16,
      fontWeight: 'bold',
      marginLeft: 10,
    },
    name: {
      fontSize: 14,
      marginLeft: 10,
    },
    amount: {
      fontSize: 16,
      position: 'absolute',
      right: 20,
      top: 15,
    },
    modalContent: {
      backgroundColor: 'white',
      padding: 22,
      borderRadius: 10,
      justifyContent: 'flex-start',
    },
    modalText: {
      fontSize: 16,
      textAlign: 'left',
      flex: 1,
    },
    modalTextLink: {
      fontSize: 16,
      textAlign: 'left',
      flex: 1,
      color: '#0400D3',
    },
    modalheader: {
      color: 'black',
      paddingBottom: 10,
      fontWeight: 'bold',
      fontSize: 18,
    },
    modalLabel: {
      fontSize: 16,
      fontWeight: '500',
      flex: 1,
      textAlign: 'left',
    },
    modalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingBottom: 10,
    },    
    searchbar: {
      flex: 1,
      backgroundColor: '#fff',
    },
    searchBarContainer: {
      backgroundColor: '#fff',
      borderBottomColor: 'transparent',
      borderTopColor: 'transparent',
    },
    inputContainer: {
      backgroundColor: '#ECECEC',
      borderRadius: 10,
      height: 40,
    },
    input: {
      fontSize: 16,
    },  
  });