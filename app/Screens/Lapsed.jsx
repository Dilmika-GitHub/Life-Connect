import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Linking, Alert, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL, ENDPOINTS } from '../services/apiConfig';
import { SearchBar, Button, Input } from 'react-native-elements';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/FontAwesome';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const getAgencyCode = async () => {
  try {
    const token = await AsyncStorage.getItem('accessToken');
    const email = await AsyncStorage.getItem('email');
    const categoryType = await AsyncStorage.getItem('categoryType');

    const response = await axios.get(BASE_URL + ENDPOINTS.PROFILE_DETAILS, {
      headers: { Authorization: `Bearer ${token}` },
      params: { email: email, catType: categoryType },
    });

    await AsyncStorage.setItem('agencyCode1', response.data?.personal_agency_code);
  } catch (error) {
    console.error('Error Getting Agency Code:', error);
  }
};

const getPolicyDetails = async () => {
  try {
    const token = await AsyncStorage.getItem('accessToken');
    const agencyCode = await AsyncStorage.getItem('agencyCode1');
    const currentDate = new Date();
    const toDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
    const fromDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear() - 1}`;
    console.log(toDate);
    console.log(fromDate);

    const response = await axios.post(BASE_URL + ENDPOINTS.POLICY_DETAILS, {
      p_agency: agencyCode,
      p_polno: '',
      p_fromdate: '',
      p_todate: ''
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error Getting Policy Details:', error.response ? error.response.data : error.message);
    return [];
  }
};

//////////////////////////////////


const Lapsed = () => {
  const [policies, setPolicies] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', key: '', name: '', amount: '', date: '', contact: '', email: '' });

  const { width, height } = Dimensions.get("window"); // Get screen dimensions

  useEffect(() => {
    const fetchData = async () => {
      await getAgencyCode();
      const policyDetails = await getPolicyDetails();
      setPolicies(policyDetails);
    };

    fetchData();
  }, []);


  const showDetails = (title, key, name, amount, date, contact, email) => {
    console.log('showDetails called with:', { title, key, name, amount, date, contact, email });
    setModalContent({ title, key, name, amount, date, contact, email });
    setModalVisible(true);
  };

  const hideModal = () => setModalVisible(false);

  const handleSearch = (text) => {
    setSearchValue(text);
    // Add your search logic here
  };

  const handleContactPress = (contact) => {
    // let phoneNumber = Platform.OS === 'ios' ? `telprompt:${contact}` : `tel:${contact}`;
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


  const renderItem = ({ item }) => (
<TouchableOpacity
      style={styles.itemContainer}
      onPress={() => showDetails(item.product_name, item.policy_no, item.customer_name, item.sa ? "Rs. " + new Intl.NumberFormat().format(item.sa) : "N/A", item.maturity_date, item.mobile_phone, item.email)}
    >
      <Text style={styles.policyNo}>{item.policy_no}</Text>
      <Text style={styles.amount}>{item.sa ? "Rs. " + new Intl.NumberFormat().format(item.sa) : "N/A"}</Text>
      <Text style={styles.name}>{item.customer_name}</Text>
    </TouchableOpacity>

  );

  ///////////////////////////

  return (
    <View style={styles.container}>
      <View style={styles.searchbar}>
        <SearchBar
          placeholder="Search Policy No"
          onChangeText={handleSearch}
          value={searchValue}
          containerStyle={styles.searchBarContainer}
          inputContainerStyle={styles.inputContainer}
          inputStyle={styles.input}
          lightTheme
        />
      </View>
      <FlatList
        data={policies}
        renderItem={renderItem}
        keyExtractor={(item) => item.policy_no}
        // onPress={showDetails}
      />

      <Modal isVisible={isModalVisible} onBackdropPress={hideModal} backdropOpacity={0.2}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{modalContent.title}</Text>
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
          <View style={styles.modalRow}>
            <Text style={styles.modalLabel}>Lapsed Date </Text>
            <Text style={styles.modalText}>{modalContent.date}</Text>
          </View>
          {/* <TouchableOpacity onPress={() => handleContactPress(modalContent.contact)}> */}
          <View style={styles.modalRow}>
            <Text style={styles.modalLabel}>Contact No. </Text>
            <Text style={styles.modalText}>{modalContent.contact}</Text>
          </View>
          {/* </TouchableOpacity> */}
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
            <View style={styles.modalRow}>
              <Text style={styles.modalLabel}>Email </Text>
              <Text style={styles.modalTextLink}>{modalContent.email}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  itemContainer: {
    backgroundColor: '#F8F8F8',
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 8,
    borderRadius: 10,
    elevation: 3
  },
  policyNo: {
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
    // color:'black',
  },
  searchbar: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#fff',
    paddingLeft: '1%',
    paddingRight: '1%',
  },
  searchBarContainer: {
    flex: 1,
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
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
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
  whatsappIcon: {
    marginRight: wp('15'),
  },
  contactIcon: {
    marginLeft: wp('45'),
  },
});

export default Lapsed;