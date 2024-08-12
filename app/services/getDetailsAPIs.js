import axios from 'axios';
import { BASE_URL, ENDPOINTS } from './apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getCommonHeaders = async () => {
  const token = await AsyncStorage.getItem("accessToken");
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export const getAgencyCode = async () => {
  try {
    const headers = await getCommonHeaders();
    const email = await AsyncStorage.getItem("email");
    const categoryType = await AsyncStorage.getItem("categoryType");

    const response = await axios.get(`${BASE_URL}${ENDPOINTS.PROFILE_DETAILS}`, {
      headers,
      params: {
        email: email,
        catType: categoryType,
      },
    });

    return response.data;
  } catch (error) {
    console.log('Error in getAgencyCode:', error); // Debugging statement
    if (error.response) {
      const { status, data } = error.response;
      if (status === 401) {
        throw new Error("Session expired, please log in again.");
      } else if (status === 400) {
        throw new Error("No policies found for the given search criteria.");
      } else {
        throw new Error(data.message || "An unexpected error occurred while fetching agency code.");
      }
    } else {
      throw new Error(error.message || "An unexpected error occurred.");
    }
  }
};

export const getPolicyDetails = async () => {
  try {
    const headers = await getCommonHeaders();
    const agencyCode = await AsyncStorage.getItem('agencyCode1');
    
    const currentDate = new Date();
    const toDate = formatDate(currentDate);
    const fromDate = formatDate(new Date(currentDate.setFullYear(currentDate.getFullYear() - 1)));

    const response = await axios.post(
      `${BASE_URL}${ENDPOINTS.POLICY_DETAILS}`,
      {
        p_agency: agencyCode,
        p_polno: '',
        p_fromdate: fromDate,
        p_todate: toDate,
      },
      { headers, timeout: 10000 }
    );

    return response.data;
  } catch (error) {
    console.log('Error in getPolicyDetails:', error); // Debugging statement
    if (error.response) {
      const { status, data } = error.response;
      if (status === 401) {
        throw new Error("Session expired, please log in again.");
      } else if (status === 400) {
        throw new Error("No policies found for the given search criteria.");
      } else {
        throw new Error(data.message || "An unexpected error occurred while fetching policy details.");
      }
    } else {
      throw new Error(error.message || "An unexpected error occurred.");
    }
  }
};

export const getFilteredPolicyDetails = async (agencyCode, policyNo, fromDate, toDate) => {
    try {
      const headers = await getCommonHeaders();
  
      const response = await axios.post(
        `${BASE_URL}${ENDPOINTS.POLICY_DETAILS}`,
        {
          p_agency: agencyCode,
          p_polno: policyNo || '',
          p_fromdate: fromDate || '',
          p_todate: toDate || '',
        },
        { headers, timeout: 10000 } // 10-second timeout
      );
  
      return response.data;
    } catch (error) {
      console.log('Error in getFilteredPolicyDetails:', error); // Debugging statement
  
      // Check for specific error types
      if (error.code === 'ECONNABORTED') {
        // Handle timeout error
        throw new Error("The request took too long to complete. Please try again later.");
      } else if (error.response) {
        // Handle errors with response status codes
        const { status, data } = error.response;
        if (status === 401) {
          throw new Error("Session expired, please log in again.");
        } else if (status === 400) {
          throw new Error("No policies found for the given search criteria.");
        } else {
          throw new Error(data.message || "An unexpected error occurred while fetching filtered policy details.");
        }
      } else {
        // Handle other errors (e.g., network errors)
        throw new Error(error.message || "An unexpected error occurred.");
      }
    }
  };
  
