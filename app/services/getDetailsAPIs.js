import axios from 'axios';
import { BASE_URL,ENDPOINTS } from './apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getAgencyCode() {
    try {
        const token = await AsyncStorage.getItem("accessToken");
      const email = await AsyncStorage.getItem("email");
      const categoryType = await AsyncStorage.getItem("categoryType");

      const response = await axios.get(`${BASE_URL}${ENDPOINTS.PROFILE_DETAILS}`, {
        headers:{
            Authorization: `Bearer ${token}`
          },
          params: {
            email: email,
            catType: categoryType
          }
      });
      return response.data.personal_agency_code;
    } catch (error) {
      console.error("Error getting agency code:", error);
      throw error;
    }
  }