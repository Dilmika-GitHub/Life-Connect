import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, Alert, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import { BASE_URL, ENDPOINTS } from "../../services/apiConfig";
import { CommonActions } from '@react-navigation/native';
import AwesomeAlert from 'react-native-awesome-alerts';
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import { lockToPortrait, lockToAllOrientations } from "../OrientationLock";
import { useIsFocused } from '@react-navigation/native';

const Profile = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [agentCode, setAgentCode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categoryType, setCategoryType] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const isFocused = useIsFocused();

  const handleErrorResponse = (error) => {
    if (error.response?.status === 401) {
      console.log(error.response.status);
      setShowAlert(true);
      setUserData(null);
    }
  };

  const handleConfirm = () => {
    setShowAlert(false);
    navigation.navigate('Login');
  };

  const formatAgencyCode = (code) => {
    if (!code) return "N/A";
    const paddedCode = code.padStart(6, '0');
    return `L24${paddedCode}`;
  };

  const pickImage = async () => {
    // Request permissions for media library access if not already granted
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need access to your media library to upload images.');
      return;
    }
  
    // Launch image library to pick an image
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,  // Corrected to mediaTypes
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,  // Max quality for the image
    });
  
    // If user didn't cancel the picker and assets exist, upload the first selected image
    if (!result.canceled && result.assets?.length > 0) {
      uploadProfileImage(result.assets[0]);  // Use first image from assets array
    }
  };

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      const email = await AsyncStorage.getItem("email");
      const categoryType = await AsyncStorage.getItem("categoryType");
      setCategoryType(categoryType);

      const response = await axios.get(BASE_URL + ENDPOINTS.PROFILE_DETAILS, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          email: email,
          catType: categoryType
        }
      });
      setUserData(response.data);
      setAgentCode(response.data.personal_agency_code);
      console.log('agent code: ',response.data.personal_agency_code);
    } catch (error) {
      handleErrorResponse(error);
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const uploadProfileImage = async (image) => {
    setLoading(true);
    const token = await AsyncStorage.getItem("accessToken");
  
    // Extract file extension from URI
    const fileExtension = image.uri.split('.').pop().toLowerCase();
    const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'heic', 'heif'];
    
    // Determine MIME type based on the extension
    const mimeTypeMap = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      heic: 'image/heic',
      heif: 'image/heif'
    };
  
    const mimeType = mimeTypeMap[fileExtension];
  
    if (!validExtensions.includes(fileExtension)) {
      Alert.alert('Error', 'Invalid file type. Please select a valid image.');
      return;
    }
  
    // Log file details for debugging
    console.log('Uploading file:', {
      uri: image.uri,
      type: mimeType,
      name: image.fileName || `profile.${fileExtension}`
    });
  
    const formData = new FormData();
    formData.append('file', {
      uri: image.uri,
      type: mimeType, // Correct MIME type based on the file extension
      name: image.fileName || `profile.${fileExtension}`, // Ensure the correct extension
    });
  
    try {
      const response = await axios.post(
        `${BASE_URL}/Image/UploadProfileImage?agentcode=${agentCode}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      if (response.status === 200) {
        Alert.alert("Success", "Profile image uploaded successfully");
        console.log(response._response);
        fetchProfileImage();
      }
    } catch (error) {
      console.error('Error uploading profile image:', error);
      Alert.alert("Error", "Failed to upload profile image");
    }
    finally {
      setLoading(false);
    }
  };
  

  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const fetchProfileImage = async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      console.log(agentCode);

      const response = await axios.get(
        `${BASE_URL}/Image/GetProfileImage?fileName=${agentCode}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'image/png; x-api-version=1',
          },
          responseType: 'blob',
        }
      );

      const blob = response.data;
      const imageUrl = await blobToBase64(blob);
      // const imageUrl = URL.createObjectURL(blob);

      setUserData((prevData) => ({
        ...prevData,
        profileImage: imageUrl,
      }));
    } catch (error) {
      console.error('Error fetching profile image:', error);
    }
  };

  useEffect(() => {
    if (isFocused) {
        lockToPortrait();
    }
}, [isFocused]);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        // First, fetch user data and wait for it to complete
        await fetchUserData();
  
        // After fetchUserData completes, check if agentCode is set
        if (agentCode) {
          await fetchProfileImage();
        }
      };
  
      fetchData();
    }, [agentCode]) // Now the dependency is on agentCode
  );
  
  

  const navigateToPasswordChange = () => {
    navigation.navigate("Change Password");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      </View>
<ScrollView>
<View style={styles.profileContainer}>
        {userData?.profileImage ? (
          <Image
            source={{ uri: userData.profileImage }}
            style={styles.profileImage}
            resizeMode="cover"
          />
        ) : (
          <Text style={styles.noImageText}>No profile image available</Text>
        )}
        <Text style={styles.nameText}>
          {userData?.intial?.trim()} {userData?.name?.trim()}
        </Text>
        <Text style={styles.emailText}>{userData?.email?.trim()}</Text>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={pickImage}>
            <Text style={styles.actionButtonText}>Change Profile Picture</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={navigateToPasswordChange}
          >
            <Text style={styles.actionButtonText}>Change Password</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.detailsContainer}>
      <View style={styles.detailBox1}>
          <Text style={styles.detailLabel}>Agency Code</Text>
          <Text style={styles.detailValue}>
            {formatAgencyCode(userData?.personal_agency_code) || "N/A"}
          </Text>
          <Text style={styles.detailLabel}>NIC</Text>
          <Text style={styles.detailValue}>{userData?.idnum || "N/A"}</Text>
          <Text style={styles.detailLabel}>Team Leader Code</Text>
          <Text style={styles.detailValue}>
            {userData?.or_team_code || "N/A"}
          </Text>
        </View>
        <View style={styles.detailBox2}>
          <Text style={styles.detailLabel}>Mobile</Text>
          <Text style={styles.detailValue}>
            {userData?.phmob?.trim() || "N/A"}
          </Text>
        </View>
        <View style={styles.detailBox3}>
          <Text style={styles.detailLabel}>Phone</Text>
          <Text style={styles.detailValue}>
            {userData?.phres?.trim() || "N/A"}
          </Text>
        </View>
      </View>
</ScrollView>
      

      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#08818a" />
        </View>
      )}

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
        onConfirmPressed={() => {
          setShowAlert(false);
          navigation.navigate("Login");
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
container: {
  flex: 1,
  backgroundColor: '#f9f9f9',
},
header: {
  flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#08818a',
},
profileContainer: {
  alignItems: 'center',
  marginVertical: 20,
  marginHorizontal:20,
  borderWidth:1,
  borderRadius:40,
  borderColor:'#fff',
  padding:25,
  backgroundColor:'#fff',
},
profileImage: {
  width: 100,
  height: 100,
  borderRadius: 50,
  backgroundColor: '#ccc',
},
nameText: {
  fontSize: 18,
  fontWeight: 'bold',
  marginVertical: 5,
},
emailText: {
  fontSize: 14,
  color: 'gray',
},
actionButtons: {
  flexDirection: 'row',
  marginTop: 20,
},
actionButton: {
  backgroundColor: '#f0f0f0',
  padding: 10,
  borderRadius: 5,
  marginHorizontal: 5,
},
actionButtonText: {
  color: '#08818a',
  fontWeight: 'bold',
},
detailsContainer: {
  padding: 20,
},
detailBox1: {
  backgroundColor: '#e9f1f7',
  padding: 10,
  borderRadius: 5,
  marginVertical: 5,
},
detailBox2: {
  backgroundColor: '#e8f5e9',
  padding: 10,
  borderRadius: 5,
  marginVertical: 5,
},
detailBox3: {
  backgroundColor: '#fcdede',
  padding: 10,
  borderRadius: 5,
  marginVertical: 5,
},
detailLabel: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#212121',
  marginTop:10,
},
detailValue: {
  fontSize: 16,
  color: '#7a7c7d',
},
loader: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.7)',
},
});

export default Profile;
