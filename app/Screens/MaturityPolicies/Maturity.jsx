import React, { useEffect, useReducer, useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, BackHandler, Dimensions } from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { getMaturePolicyDetails } from '../../services/getDetailsAPIs';
import FilterModal from './MaturityFilterModal';
import PolicyDetailsModal from './MaturityPolicyDetailsModal';
import PolicyListItem from './MaturityPolicyListItem';
import { lockToPortrait, lockToAllOrientations } from "../OrientationLock";
import { useIsFocused } from '@react-navigation/native';

const initialState = {
  policies: [],
  searchValue: '',
  isModalVisible: false,
  modalContent: {},
  loading: false,
  isFilterModalVisible: false,
  fromDate: '',
  toDate: '',
  selectedOption: null,
  dateRangeText: '',
  isClearButtonVisible: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_POLICIES':
      return { ...state, policies: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'TOGGLE_MODAL':
      return { ...state, isModalVisible: action.payload };
    case 'SET_MODAL_CONTENT':
      return { ...state, modalContent: action.payload };
    case 'SET_FILTER_MODAL_VISIBLE':
      return { ...state, isFilterModalVisible: action.payload };
    case 'SET_DATE_RANGE_TEXT':
      return { ...state, dateRangeText: action.payload };
    case 'SET_CLEAR_BUTTON_VISIBLE':
      return { ...state, isClearButtonVisible: action.payload };
    default:
      return state;
  }
};

const Maturity = ({ navigation }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { width, height } = Dimensions.get('window');
  
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const isFocused = useIsFocused();

  const handleShowAlert = (message) => {
    console.log('Setting alert message:', message);
    setAlertMessage(message);
    setShowAlert(true);
    console.log('Alert State after setting:', showAlert);
    console.log('Alert Message after setting:', alertMessage);
  };
  
  const fetchData = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
  try {
    const policyDetails = await getMaturePolicyDetails();
    dispatch({ type: "SET_POLICIES", payload: policyDetails });
    const currentDate = new Date();
    const defaultToDate = `${currentDate.getDate()}/${
      currentDate.getMonth() + 1
    }/${currentDate.getFullYear()}`;
    const defaultFromDate = `${currentDate.getDate()}/${
      currentDate.getMonth() + 1
    }/${currentDate.getFullYear() - 1}`;
    dispatch({
      type: "SET_DATE_RANGE_TEXT",
      payload: `${defaultFromDate} - ${defaultToDate}`,
    });
  } catch (error) {
    console.log("Error in getFilteredPolicyDetails:", error);
    handleShowAlert(error.message); // Make sure this is executed
    console.log("Alert should be triggered with message:", error.message); // Ensure this function is called with the error message
  } finally {
    dispatch({ type: "SET_LOADING", payload: false });
  }
  };

  useEffect(() => {
    if (isFocused) {
        lockToAllOrientations();
    }
}, [isFocused]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
      const onBackPress = () => {
        navigation.goBack();
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation])
  );

  const showDetails = (policy) => {
    const formattedPolicy = {
      ...policy,
      contact: policy.contact ? formatPhoneNumber(policy.contact) : 'N/A',
      amount: policy.sa ? `Rs. ${new Intl.NumberFormat().format(policy.sa)}` : 'N/A',
    };
    dispatch({ type: 'SET_MODAL_CONTENT', payload: formattedPolicy });
    dispatch({ type: 'TOGGLE_MODAL', payload: true });
  };

  const formatPhoneNumber = (phoneNumber) => {
    if (phoneNumber.startsWith('0') && phoneNumber.length === 10) {
      return `94${phoneNumber.slice(1)}`;
    }
    return phoneNumber;
  };

  const renderItem = ({ item }) => <PolicyListItem item={item} onPress={showDetails} />;

  if (state.loading) {
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
        <Text style={styles.menuText}>Maturity</Text>
      </View>

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
          console.log('Alert dismissed');
        }}
      />

      <View style={styles.headerContainer}>
        <Text style={styles.dateText}>{state.dateRangeText}</Text>
        {state.isClearButtonVisible && (
          <TouchableOpacity
            onPress={() => {
              dispatch({ type: 'SET_CLEAR_BUTTON_VISIBLE', payload: false });
              fetchData();
            }}
            style={styles.clearButton}
          >
            <Text style={styles.clearButtonText}>Clear Filter</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={state.policies}
        renderItem={renderItem}
        keyExtractor={(item) => item.policy_no}
        contentContainerStyle={styles.flatListContent}
      />

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => dispatch({ type: 'SET_FILTER_MODAL_VISIBLE', payload: true })}
      >
        <MaterialIcons name="filter-list" size={24} color="white" />
      </TouchableOpacity>

      <FilterModal
        isVisible={state.isFilterModalVisible}
        onClose={() => dispatch({ type: 'SET_FILTER_MODAL_VISIBLE', payload: false })}
        onFilter={(filteredPolicies, fromDate, toDate) => {
          dispatch({ type: 'SET_POLICIES', payload: filteredPolicies });
          dispatch({ type: 'SET_CLEAR_BUTTON_VISIBLE', payload: true });

          if (fromDate && toDate) {
            dispatch({
              type: 'SET_DATE_RANGE_TEXT',
              payload: `${fromDate} - ${toDate}`
            });
          }
        }}
      />

      <PolicyDetailsModal
        isVisible={state.isModalVisible}
        onClose={() => dispatch({ type: 'TOGGLE_MODAL', payload: false })}
        policy={state.modalContent}
      />
    </View>
  );
};

export default Maturity;

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
  menuText: {
    color: 'white',
    paddingLeft: '8%',
    fontSize: 18,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateText: {
    marginTop: 5,
    marginLeft: 10,
    textAlign: 'left',
    color: '#08818a',
  },
  clearButton: {
    backgroundColor: '#08818a',
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 5,
    width: '30%',
    marginRight: 10,
    marginLeft: 10,
  },
  clearButtonText: {
    color: 'white',
    fontSize: 13,
    fontWeight: 'bold',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#08818a',
    padding: 15,
    borderRadius: 30,
    elevation: 5,
    zIndex: 1,
  },
});
