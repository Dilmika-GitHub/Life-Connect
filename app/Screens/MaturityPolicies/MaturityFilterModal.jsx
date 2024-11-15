import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, TouchableWithoutFeedback, Keyboard } from 'react-native';
import Modal from 'react-native-modal';
import { SearchBar, Button } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getFilteredMaturePolicyDetails } from '../../services/getDetailsAPIs';
import { getAgencyCode } from '../../services/getDetailsAPIs';
import AwesomeAlert from 'react-native-awesome-alerts';
import { ScrollView } from 'react-native-gesture-handler';

const FilterModal = ({ isVisible, onClose, onFilter }) => {
  const [filterSearchValue, setFilterSearchValue] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [fromDateForAPI, setFromDateForAPI] = useState('');
  const [toDateForAPI, setToDateForAPI] = useState('');
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);
  const [agencyCode1, setAgencyCode1] = useState('');
  const [agencyCode2, setAgencyCode2] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleShowAlert = (message) => {
    console.log('Setting alert message:', message);
    setAlertMessage(message);
    setShowAlert(true);
    console.log('Alert State after setting:', showAlert);
    console.log('Alert Message after setting:', alertMessage);
  };


  useEffect(() => {
    const fetchAgencyCode = async () => {
      try {
        const data = await getAgencyCode();
        setAgencyCode1(data?.personal_agency_code);
        setAgencyCode2(data?.newagt);
        setSelectedOption(data?.personal_agency_code); // Set default option
      } catch (error) {
        console.error("Error getting agency code:", error);
      }
    };
    fetchAgencyCode();
  }, []);

  const handleSearch = async () => {
    if (!validateDates()) return;

    setIsLoading(true);

    try {
      const filteredPolicies = await getFilteredMaturePolicyDetails(
        selectedOption,
        filterSearchValue,
        fromDateForAPI, // Use API format here
        toDateForAPI // Use API format here
      );
      onFilter(filteredPolicies, fromDate, toDate);
      onClose();
    } catch (error) {
      console.error('Failed to fetch filtered policies:', error);
      handleShowAlert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const resetFilter = () => {
    setFilterSearchValue('');
    setFromDate('');
    setToDate('');
  };

  const handleClose = () => {
    resetFilter();
    onClose();
  };

  const validateDates = () => {
    if ((fromDate && !toDate) || (!fromDate && toDate)) {
      Alert.alert('Validation Error', 'Both "From Date" and "To Date" must be selected.');
      return false;
    }

    if (fromDate && toDate && new Date(parseDate(fromDate)) >= new Date(parseDate(toDate))) {
      Alert.alert('Validation Error', '"To Date" must be later than "From Date".');
      return false;
    }

    return true;
  };

  const handleRadioButtonPress = (value) => {
    setSelectedOption(value);
  };

  const formatDateForDisplay = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatDateForAPI = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}${month}${day}`;
  };

  const handleFromDateChange = (event, selectedDate) => {
    setShowFromDatePicker(false);
    if (selectedDate) {
      setFromDate(formatDateForDisplay(selectedDate)); // Display format
      setFromDateForAPI(formatDateForAPI(selectedDate)); // API format
    }
  };

  const handleToDateChange = (event, selectedDate) => {
    setShowToDatePicker(false);
    if (selectedDate) {
      setToDate(formatDateForDisplay(selectedDate)); // Display format
      setToDateForAPI(formatDateForAPI(selectedDate)); // API format
    }
  };

  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split('/');
    return new Date(`${year}-${month}-${day}`);
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <Modal isVisible={isVisible} onBackdropPress={onClose} backdropOpacity={0.2}>
        <View style={styles.filterModal}>
          <AwesomeAlert
            show={showAlert}
            showProgress={false}
            title="Alert"
            message={alertMessage}
            closeOnTouchOutside={false}
            closeOnHardwareBackPress={false}
            showConfirmButton={true}
            confirmText="OK"
            confirmButtonColor="#08818a"
            onConfirmPressed={() => {
              setShowAlert(false);

              if (alertMessage.includes('Session expired')) {
                navigation.replace('Login');
              } if (alertMessage.includes('The request took too long')) {
                navigation.navigate('PolicyDetails', { errorMessage: alertMessage });
              }
            }}
          />

          <Text style={styles.modalTitle}>Maturity Filter Options</Text>
          <ScrollView style={[styles.section, styles.bottomSection]}>
            <View style={styles.searchContainer}>
              <SearchBar
                placeholder="Search Policy No"
                value={filterSearchValue}
                onChangeText={setFilterSearchValue}
                containerStyle={styles.searchBarContainer}
                inputContainerStyle={styles.inputContainer}
                inputStyle={styles.input}
                lightTheme
                keyboardType="numeric"
              />
            </View>
            <Text style={styles.filterText}>Agent Code:</Text>
            <View style={styles.radioButtonGroup}>
              {[agencyCode1, agencyCode2].filter(Boolean).map((code, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.radioButtonContainer}
                  onPress={() => handleRadioButtonPress(code)}
                >
                  <View style={styles.radioButton}>
                    {selectedOption === code && <View style={styles.radioButtonSelected} />}
                  </View>
                  <Text style={styles.radioLabel}>{code}</Text>
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
                onChange={handleFromDateChange}
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
              title={isLoading ? <ActivityIndicator color="#fff" /> : "Search"}
              onPress={handleSearch}
              buttonStyle={styles.searchButton}
              disabled={isLoading} // Disable button while loading
            />

            <Button title="Cancel" onPress={handleClose} buttonStyle={styles.cancelButton} />
          </ScrollView>
        </View>
      </Modal>
    </TouchableWithoutFeedback>
  );
};

export default FilterModal;

const styles = StyleSheet.create({
  filterModal: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
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
  searchContainer: {
    marginBottom: 10, // Add some space between the SearchBar and the next elements
  },
  filterText: {
    fontSize: 16,
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
  radioLabel: {
    fontSize: 16,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    justifyContent: 'center',
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
});