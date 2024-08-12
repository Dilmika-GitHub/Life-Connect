import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Alert, Linking, Platform, Dimensions } from 'react-native';
import Modal from 'react-native-modal';
import { lockToPortrait, lockToAllOrientations } from "../OrientationLock";
import { useIsFocused } from '@react-navigation/native'; 
import Icon from 'react-native-vector-icons/FontAwesome';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Ionicons } from "@expo/vector-icons";

const data = [
    { title:'YASTIYA', key: 'GP10224XXXX', name: 'T. Dilshan', amount: 'Rs. 5,000,000.00', contact: '94 76 123 4567', email: 'dilshan@gmail.com', maturetext: '2024/05/05'},
    { title:'YASTIYA', key: 'GP15585XXXX', name: 'V. Sudarshan', amount: 'Rs. 4,600,000.00', contact: '94 76 123 4589', email: 'sudarshan@gmail.com', maturetext: '2024/05/04'},
    { title:'YASTIYA', key: 'GP10225XXXX', name: 'N. Silva', amount: 'Rs. 4,100,000.00', contact: '94 76 345 4567', email: 'silva@gmail.com', maturetext: '2024/05/03'},
    { title:'YASTIYA', key: 'GP15586XXXX', name: 'U. Tharanga', amount: 'Rs. 4,000,000.00' , contact: '94 76 768 4897', email: 'tharanga@gmail.com', maturetext: '2024/04/05'},
    { title:'YASTIYA', key: 'GP10226XXXX', name: 'N. Kulasekara', amount: 'Rs. 1,500,000.00' , contact: '94 76 123 4653', email: 'kulasekara@gmail.com', maturetext: '2024/04/20'},
    { title:'YASTIYA', key: 'GP15587XXXX', name: 'D. Gunathilake', amount: 'Rs. 700,000.00' , contact: '94 76 836 0388', email: 'gunathilake@gmail.com', maturetext: '2024/03/08'},
    { title:'YASTIYA', key: 'GP10227XXXX', name: 'T. Dilshan', amount: 'Rs. 5,000,000.00' , contact: '94 76 171 5346', email: 'dilshan@gmail.com', maturetext: '2024/03/25'},
    { title:'YASTIYA', key: 'GP15588XXXX', name: 'V. Sudarshan', amount: 'Rs. 4,600,000.00' , contact: '94 78 325 6972', email: 'sudarshan@gmail.com', maturetext: '2024/02/05'},
    { title:'YASTIYA', key: 'GP10228XXXX', name: 'N. Silva', amount: 'Rs. 4,100,000.00' , contact: '94 71 123 4567', email: 'silva@gmail.com', maturetext: '2024/02/15'},
    { title:'YASTIYA', key: 'GP15589XXXX', name: 'U. Tharanga', amount: 'Rs. 4,000,000.00' , contact: '94 77 177 5767', email: 'dTharanga@gmail.com', maturetext: '2024/01/09'},
    { title:'YASTIYA', key: 'GP10229XXXX', name: 'N. Kulasekara', amount: 'Rs. 1,500,000.00' , contact: '94 76 567 4567', email: 'kulasekara@gmail.com', maturetext: '2024/01/20'},
    { title:'YASTIYA', key: 'GP15590XXXX', name: 'D. Gunathilake', amount: 'Rs. 700,000.00' , contact: '94 75 768 4235', email: 'gunathilake@gmail.com', maturetext: '2024/01/01'},
  ];

  const Item = ({ title, name, amount, contact, email, maturetext, keyText, index, onPress }) => (
    <TouchableOpacity
      style={[styles.item, index < 3 ? styles.majorBackground : null]}
      onPress={() => onPress(title, keyText, name, amount, contact, email, maturetext)}
    >
      <Text style={styles.keyText}>{keyText}</Text>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.amount}>{amount}</Text>
      {/* <Text style={styles.contact}>{contact}</Text> */}
    </TouchableOpacity>
  );
  
  export default function Maturity({navigation}) {
    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
            lockToAllOrientations();
        }
    }, [isFocused]);

    const [isModalVisible, setModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState({title: '', key: '', name: '', amount: '', contact: '', email:'', maturetext:'' });
  
    const showDetails = (title, key, name, amount, contact, email, maturetext) => {
      setModalContent({ title, key, name, amount, contact, email, maturetext });
      setModalVisible(true);
    };
  
    const hideModal = () => setModalVisible(false);

    const handleContactPress = (contact) => {
      // let phoneNumber = Platform.OS === 'ios' ? 'telprompt:${contact}' : 'tel:${contact}';
      Linking.openURL(`tel:${contact}`);
    };

    const handleEmailPress = (email) => {
      Linking.openURL(`mailto:${email}`);
    };

    const handleWhatsAppPress = (contact) => {
      let url = `whatsapp://send?phone=${contact}`;
      Linking.openURL(url).catch(() => {
        Alert.alert('Error', 'WhatsApp not installed or invalid contact number.');
      });
    };
  
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
            <Ionicons name="menu" size={26} color="white" />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerText}>Upcoming 30 Days</Text>
        <FlatList
          data={data}
          renderItem={({ item, index }) => (
            <Item
              title={item.title}
              name={item.name}
              amount={item.amount}
              contact={item.contact}
              email={item.email}
              maturetext={item.maturetext}
              keyText={item.key}
              index={index}
              onPress={showDetails}
            />
          )}
          keyExtractor={item => item.key}
        />
        <Modal isVisible={isModalVisible} onBackdropPress={hideModal}>
  <View style={styles.modalContent}>
    <Text style={styles.modalHeader}>{modalContent.title}</Text>
    <View style={styles.modalTextContainer}>
      <Text style={styles.modalLabel}>Policy No.</Text>
      <Text style={styles.modalValue}>{modalContent.key}</Text>
    </View>
    <View style={styles.modalTextContainer}>
      <Text style={styles.modalLabel}>Insured Name</Text>
      <Text style={styles.modalValue}>{modalContent.name}</Text>
    </View>
    <View style={styles.modalTextContainer}>
      <Text style={styles.modalLabel}>Sum Assured</Text>
      <Text style={styles.modalValue}>{modalContent.amount}</Text>
    </View>
    
    <View style={styles.modalRow}>
      <Text style={styles.modalLabel}>Contact No. </Text>
      <Text style={styles.modalText}>{modalContent.contact}</Text>
    </View>
    
    <View style={styles.modalRow}>
      <Icon
      name="phone"
      size={20}
      color="blue"
      onPress={() => handleContactPress(modalContent.contact)}
      style={styles.contactIcon}
      />
      <Icon
      name="whatsapp"
      size={20}
      color="green"
      onPress={() => handleWhatsAppPress(modalContent.contact)}
      style={styles.whatsappIcon}
      />
    </View>

    <TouchableOpacity onPress={() => handleEmailPress(modalContent.email)}>
    <View style={styles.modalTextContainer}>
      <Text style={styles.modalLabel}>Email</Text>
      <Text style={styles.modalTextLink}>{modalContent.email}</Text>
    </View>
    </TouchableOpacity>
    <Text style={styles.modalText2}>This policy is to be matured on {modalContent.maturetext}</Text>
  </View>
</Modal>

      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    headerText: {
      fontSize: 14,
      paddingTop: 10,
      paddingLeft: 10,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      backgroundColor: '#08818a',
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
      color:'black',
    },
    modalHeader: {
      color: 'black',
      paddingBottom: 12,
      fontWeight: 'bold',
      fontSize: 18,
    },
    modalContent: {
      backgroundColor: 'white',
      padding: 22,
      borderRadius: 10,
      justifyContent: 'flex-start',
    },
    modalTextContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    modalTextLink: {
      fontSize: 16,
      textAlign: 'left',
      flex: 1,
      color: '#0400D3',
    },
    modalLabel: {
      fontSize: 16,
      flex: 1,
      fontWeight: 'bold',
      textAlign: 'left', 
    },
    modalValue: {
      fontSize: 16,
      flex: 1,
      textAlign: 'left',
    },
    modalText2: {
      color: 'red',
      paddingTop: 10,
      textAlign: 'left', 
    },
    modalText: {
      fontSize: 16,
      textAlign: 'left',
      flex: 1,
    },
    modalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingBottom: 10,
    },
    closeButton: {
      marginTop: 10,
      backgroundColor: '#FFCECE',
      padding: 10,
      borderRadius: 5,
      alignSelf: 'center',
    },
    whatsappIcon: {
      marginRight: wp('15'),
      // marginLeft: wp('50'),
    },
    contactIcon: {
      marginLeft: wp('45') ,
    },
  });
  