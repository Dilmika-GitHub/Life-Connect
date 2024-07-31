import axios from 'axios';
import { BASE_URL,ENDPOINTS } from './apiConfig';

export async function checkAppVersion(appVersion) {
  try {
    const response = await axios.get(`${BASE_URL}${ENDPOINTS.GET_APP_VERSION}`, {
      params: { v_no:  appVersion}
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching app version:", error);
    throw error;
  }
}

export async function checkMaintenance() {
    try {
      const response = await axios.get(`${BASE_URL}${ENDPOINTS.CHECK_MAINTENANCE}`);
      return response.data;
    } catch (error) {
      console.error("Error checking maintenance status:", error);
      throw error;
    }
  }