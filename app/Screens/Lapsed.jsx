import React, { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Linking, Alert, Dimensions, ActivityIndicator, BackHandler } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL, ENDPOINTS } from '../services/apiConfig';
import { SearchBar, Button, Input } from 'react-native-elements';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/FontAwesome';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import AwesomeAlert from 'react-native-awesome-alerts';

//////////////////////////////////


const Lapsed = ({navigation}) => {
  const [policies, setPolicies] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', key: '', name: '', amount: '', date: '', contact: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);
  const [filterSearchValue, setFilterSearchValue] = useState('');
  const [agencyCode1, setAgencyCode1] = useState('');
  const [agencyCode2, setAgencyCode2] = useState(null);
  const [dateRangeText, setDateRangeText] = useState('');
  const [isClearButtonVisible, setClearButtonVisible] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const { width, height } = Dimensions.get("window"); 

  const handleErrorResponse = (error) => {
    if (error.response.status === 401) {
      console.log(error.response.status);
      setShowAlert(true);
    }
  };

  const handleConfirm = () => {
    setShowAlert(false);
    navigation.navigate('Login');
  };

  const getAgencyCode = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const email = await AsyncStorage.getItem('email');
      const categoryType = await AsyncStorage.getItem('categoryType');

      const response = await axios.get(BASE_URL + ENDPOINTS.PROFILE_DETAILS, {
        headers: { Authorization: `Bearer ${token}` },
        params: { email: email, catType: categoryType },
      });

      const fetchedAgencyCode1 = response.data?.personal_agency_code;
      const fetchedAgencyCode2 = response.data?.newagt;

      setAgencyCode1(fetchedAgencyCode1);
      setAgencyCode2(fetchedAgencyCode2);


    } catch (error) {
      console.error('Error Getting Agency Code:', error);
      handleErrorResponse(error);
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
        p_fromdate: fromDate,
        p_todate: toDate
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error Getting Policy Details:', error.response ? error.response.data : error.message);
      handleErrorResponse(error);
      return [];
    }
  };

  const getFilteredPolicyDetails = async (agencyCode, policyNo, fromDate, toDate) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const response = await axios.post(BASE_URL + ENDPOINTS.POLICY_DETAILS, {
        p_agency: agencyCode,
        p_polno: policyNo || '',
        p_fromdate: fromDate || '',
        p_todate: toDate || ''
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error Getting Filtered Policy Details:', error.response ? error.response.data : error.message);
      handleErrorResponse(error);
      return [];
    }
  };

  const fetchData = async () => {
    setLoading(true);
    await getAgencyCode();
    const policyDetails = await getPolicyDetails();
    setPolicies(policyDetails);
    const currentDate = new Date();
    const defaultToDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
    const defaultFromDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear() - 1}`;
    setDateRangeText(`${defaultFromDate} - ${defaultToDate}`);

    setLoading(false);
  };


  useFocusEffect(
    useCallback(() => {
      fetchData();
      const onBackPress = () => {
        navigation.navigate('Policy Details');
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation])
  );

  useEffect(() => {
    if (agencyCode1) {
      setSelectedOption(agencyCode1); // Set default option if agencyCode1 is available
    }
  }, [agencyCode1]);

  const formatPhoneNumber = (phoneNumber) => {
    if (phoneNumber.startsWith('0') && phoneNumber.length === 10) {
      return `94${phoneNumber.slice(1)}`;
    }
    return phoneNumber;
  };

  const showDetails = (title, key, name, amount, date, contact, email) => {
    console.log('showDetails called with:', { title, key, name, amount, date, contact, email });
    setModalContent({
      title,
      key,
      name,
      amount,
      date,
      contact: contact ? formatPhoneNumber(contact) : 'N/A',
      email: email || 'N/A'
    });
    setModalVisible(true);
  };

  const hideModal = () => setModalVisible(false);



  const handleContactPress = (contact) => {
    // let phoneNumber = Platform.OS === 'ios' ? `telprompt:${contact}` : `tel:${contact}`;
    if (contact !== 'N/A') {
      Linking.openURL(`tel:${contact}`);
    }
  };

  const handleEmailPress = (email) => {
    if (email !== 'N/A') {
      Linking.openURL(`mailto:${email}`);
    }
  };

  const handleWhatsAppPress = (contact) => {
    let url = `whatsapp://send?phone=${contact}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'WhatsApp not installed or invalid contact number.');
    });
  };

  const handleRadioButtonPress = (value) => {
    setSelectedOption(value);
  };

  const validateDates = () => {
    if ((fromDate && !toDate) || (!fromDate && toDate)) {
      Alert.alert('Validation Error', 'Both From Date and To Date must be selected.');
      return false;
    }
    if (fromDate && toDate && new Date(fromDate) >= new Date(toDate)) {
      Alert.alert('Validation Error', 'From Date should be before To Date.');
      return false;
    }
    return true;
  };

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleDateChange = (event, selectedDate) => {
    if (event.type === 'set') {
      const currentDate = selectedDate || fromDate;
      setShowFromDatePicker(false);
      setFromDate(formatDate(currentDate));
    } else {
      setShowFromDatePicker(false);
    }
  };
  
  const handleToDateChange = (event, selectedDate) => {
    if (event.type === 'set') {
      const currentDate = selectedDate || toDate;
      setShowToDatePicker(false);
      setToDate(formatDate(currentDate));
    } else {
      setShowToDatePicker(false);
    }
  };

  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split('/');
    return new Date(`${year}-${month}-${day}`);
  };

  const handleSearch = async () => {
    if (validateDates()) {
      setLoading(true);
      const filteredPolicies = await getFilteredPolicyDetails(selectedOption, filterSearchValue, fromDate, toDate);
      console.log(selectedOption);
      console.log(filterSearchValue);
      console.log(fromDate);
      console.log(toDate);

      setPolicies(filteredPolicies);
      toggleFilterModal();
      setLoading(false);
      applyDateFilter();
      setClearButtonVisible(true);
    }
  };

  const toggleFilterModal = () => {
    if (!isFilterModalVisible && agencyCode1) {
      setSelectedOption(agencyCode1); // Ensure default selection
    }
    setFilterModalVisible(!isFilterModalVisible);
  };

  const toggleCancelModal = () => {
    setFilterSearchValue('');
    setSelectedOption('null');
    setFromDate('');
    setToDate('');
    const fetchData = async () => {
      setLoading(true);
      await getAgencyCode();
      const policyDetails = await getPolicyDetails();
      setPolicies(policyDetails);
      setLoading(false);
    };

    fetchData();
    setFilterModalVisible(!isFilterModalVisible);
    fetchData();
    setClearButtonVisible(false);
  };

  const toggleClearModal = () => {
    setFilterSearchValue('');
    setSelectedOption('null');
    setFromDate('');
    setToDate('');
    fetchData();
    setClearButtonVisible(false);

  };
  const applyDateFilter = () => {
    if (fromDate && toDate) {
      setDateRangeText(`${fromDate} - ${toDate}`);
    } else {
      setDateRangeText('');
    }
    setFilterModalVisible(false); // Close the filter modal
  };


  const radioButtonsData = [
    {
      id: '1',
      label: agencyCode1,
      value: agencyCode1,
      selected: selectedOption === agencyCode1,
    },
    ...(agencyCode2 ? [{
      id: '2',
      label: agencyCode2,
      value: agencyCode2,
      selected: selectedOption === agencyCode2,
    }] : []),
  ];

  const renderFilterModal = () => (
    <Modal isVisible={isFilterModalVisible} animationIn="slideInUp" animationOut="slideOutDown" onBackdropPress={null}>
      <View style={styles.filterModal}>
        <Text style={styles.modalTitle}>Filter Options</Text>
        <View style={styles.searchbar}>
          <SearchBar
            placeholder="Search Policy No"
            value={filterSearchValue} // Use filterSearchValue state
            onChangeText={setFilterSearchValue} // Add this line to update state
            containerStyle={styles.searchBarContainer}
            inputContainerStyle={styles.inputContainer}
            inputStyle={styles.input}
            lightTheme
          />
        </View>
        <Text style={styles.filterText}>Agent Code:</Text>
        <View style={styles.radioButtonGroup}>
          {radioButtonsData.map((button) => (
            <TouchableOpacity key={button.id} style={styles.radioButtonContainer} onPress={() => handleRadioButtonPress(button.value)}>
              <View style={[styles.radioButton]} >
                {button.selected && <View style={styles.radioButtonSelected} />}
              </View>
              <Text style={styles.radioLabel}>{button.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.filterText}>From Date:</Text>
        <TouchableOpacity onPress={() => setShowFromDatePicker(true)} style={styles.dateInput}>
          <Text>{fromDate || 'Select Date'}</Text>
        </TouchableOpacity>
        {showFromDatePicker && (
          <DateTimePicker
            value={fromDate ? parseDate(fromDate) : new Date()}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
        <Text style={styles.filterText}>To Date:</Text>
        <TouchableOpacity onPress={() => setShowToDatePicker(true)} style={styles.dateInput}>
          <Text>{toDate || 'Select Date'}</Text>
        </TouchableOpacity>
        {showToDatePicker && (
          <DateTimePicker
            value={toDate ? parseDate(toDate) : new Date()}
            mode="date"
            display="default"
            onChange={handleToDateChange}
          />
        )}
        <Button

          title="Search"
          onPress={handleSearch}
          buttonStyle={styles.searchButton}
        />

        <Button title="Cancel" onPress={toggleCancelModal} buttonStyle={styles.cancelButton} />
      </View>
    </Modal>
  );



  const renderItem = ({ item }) => {
    const formatDate = (dateStr) => {
      const [month, day, year] = dateStr.split('/');
      return `${day}/${month}/${year}`;
    };

    const formattedMaturityDate = formatDate(item.next_due_date.split(' ')[0]);

    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => showDetails(item.product_name, item.policy_no, item.customer_name, item.sa ? "Rs. " + new Intl.NumberFormat().format(item.sa) : "N/A", formattedMaturityDate, item.mobile_phone, item.email)}
      >
        <Text style={styles.policyNo}>{item.policy_no}</Text>
        <Text style={styles.amount}>{item.sa ? "Rs. " + new Intl.NumberFormat().format(item.sa) : "N/A"}</Text>
        <Text style={styles.name}>{item.customer_name}</Text>
      </TouchableOpacity>

    );
  };

  ///////////////////////////

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#08818a" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
            <Ionicons name="menu" size={26} color="white" />
          </TouchableOpacity>
        </View>
      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        title="Session Expired"
        message="Please Log Again!"
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        showConfirmButton={true}
        confirmText="OK"
        confirmButtonColor="#08818a"
        onConfirmPressed={handleConfirm}
      />
      <View style={styles.headercontainer}>
        <Text style={styles.dateText}>{dateRangeText}</Text>

        {isClearButtonVisible && <TouchableOpacity onPress={toggleClearModal} style={styles.clearButton}>
          <Text style={styles.clearButtonText}>Clear Filter</Text>
        </TouchableOpacity>}

      </View>
      <FlatList
        data={policies}
        renderItem={renderItem}
        keyExtractor={(item) => item.policy_no}
        // onPress={showDetails}
        contentContainerStyle={styles.flatListContent}

      />
      <TouchableOpacity style={styles.floatingButton} onPress={toggleFilterModal} >
        <MaterialIcons name="filter-list" size={24} color="white" />
      </TouchableOpacity>
      {renderFilterModal()}

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
          <View style={styles.modalRow}>
            <Text style={styles.modalLabel}>Contact No. </Text>
            <Text style={styles.modalText}>{modalContent.contact}</Text>
          </View>
          {modalContent.contact !== 'N/A' && (
            <View style={styles.iconRow}>
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
          )}

          <View style={styles.modalRow}>
            <Text style={styles.modalLabel}>Email </Text>
            <Text style={styles.modalText}>{modalContent.email}</Text>
          </View>
          {modalContent.email !== 'N/A' && (

            <View style={styles.iconRow}>
              <Ionicons
                name="mail-outline"
                size={24}
                color="blue"
                onPress={() => handleEmailPress(modalContent.email)}
                style={styles.modalEmailLink}
              />

            </View>
          )}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#08818a',
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
    marginLeft: wp('5%'),
  },
  contactIcon: {
    marginLeft: wp('5%'),
  },
  modalEmailLink: {
    marginLeft: wp('5%'),
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingBottom: 10,
    marginRight: wp('20%'),
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    justifyContent: 'center',
  },
  floatingButton: {
    position: 'absolute',
    bottom: hp('5%'),
    right: wp('5%'),
    backgroundColor: '#08818a',
    padding: 15,
    borderRadius: 30,
    elevation: 5,
    zIndex: 1,
  },
  filterModal: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  filterText: {
    fontSize: 15,
    marginBottom: 10,
  },
  radioButtonGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'space-around',
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  radioButton: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#08818a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  radioButtonSelected: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: '#08818a',
  },
  radioButtonLabel: {
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: '#007bff',
    marginTop: 20,
    width: '100%',
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: '#dc3545',
    marginTop: 10,
    width: '100%',
    borderRadius: 5,
  },
  headercontainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateText: {
    marginTop: 5,
    marginLeft: 10,
    textAlign: 'left',
    color: '#08818a'
  },
  clearButton: {
    backgroundColor: '#08818a',
    height: 28, 
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 5,
    width: '30%',
    textAlign: 'right',
    marginRight: 10,
    marginLeft: 10,
  },
  clearButtonText: {
    color: 'white',
    fontSize: 13,
    fontWeight: 'bold',
  },
});

export default Lapsed;