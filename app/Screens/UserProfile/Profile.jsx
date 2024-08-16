import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import { BASE_URL, ENDPOINTS } from "../../services/apiConfig";
import { CommonActions } from '@react-navigation/native';
import AwesomeAlert from 'react-native-awesome-alerts';
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';

const Profile = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [agentCode, setAgentCode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categoryType, setCategoryType] = useState(null);
  const [showAlert, setShowAlert] = useState(false);

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

  if (loading) {
    return <ActivityIndicator size="large" color="#08818a" />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
          <Ionicons name="menu" size={26} color="white" />
        </TouchableOpacity>
      </View>

      <View style={[styles.section, styles.topSection]}></View>

      <View style={[styles.section, styles.bottomSection]}>
        <View style={styles.greySquare}>
          <View style={styles.row}>
            <Text style={styles.titleText}>Personal Agency Code:</Text>
            <Text style={styles.normalText}>
              {formatAgencyCode(userData?.personal_agency_code) || "N/A"}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.titleText}>NIC No:</Text>
            <Text style={styles.normalText}>{userData?.idnum || "N/A"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.titleText}>E-mail:</Text>
            <Text style={styles.normalText}>{userData?.email?.trim() || "N/A"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.titleText}>Mobile No:</Text>
            <Text style={styles.normalText}>
              {userData?.phmob?.trim() || "N/A"}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.titleText}>Home Phone No:</Text>
            <Text style={styles.normalText}>
              {userData?.phres?.trim() || "N/A"}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.titleText}>Date of Birth:</Text>
            <Text style={styles.normalText}>{userData?.dob || "N/A"}</Text>
          </View>

          {categoryType === "Or" ? (
            <View style={styles.row}>
              <Text style={styles.titleText}>Organizer Team Leader Code:</Text>
              <Text style={styles.normalText}>
                {userData?.or_team_code || "N/A"}
              </Text>
            </View>
          ) : null}

          <View style={styles.row}>
            <Text
              style={styles.changePasswordText}
              onPress={navigateToPasswordChange}
            >
              Change Password
            </Text>
          </View>
          <TouchableOpacity onPress={pickImage}>
            <Text style={styles.changePasswordText}>Change Profile Picture</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.imageContainer}>
  {userData?.profileImage ? (
    <Image
      source={{ uri: userData.profileImage }}
      style={styles.roundImage}
      resizeMode="cover"
    />
  ) : (
    <Text style={styles.noImageText}>No Image Available</Text>
  )}
  <Text style={styles.imageText}>
    {userData?.intial?.trim()} {userData?.name?.trim()}
  </Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#08818a',
  },
  section: {
    width: "100%",
  },
  topSection: {
    flex: 1,
    backgroundColor: "#08818a",
  },
  bottomSection: {
    flex: 5,
    backgroundColor: "white",
  },
  imageContainer: {
    position: "absolute",
    left: "50%",
    top: "22%",
    transform: [{ translateX: -100 }, { translateY: -100 }],
  },
  roundImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  imageText: {
    marginTop: 10,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
  greySquare: {
    width: '95%',
    backgroundColor: '#c4f1f5',
    marginTop: 150,
    alignSelf: "center",
    borderRadius: 10,
    padding: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  titleText: {
    fontSize: 16,
    color: 'black',
    minWidth: 100,
  },
  normalText: {
    fontSize: 16,
    color: "grey",
  },
  changePasswordText: {
    fontSize: 16,
    color: "blue",
  },
  noImageText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    color: "grey",
    marginTop: 10,
  },
});

export default Profile;
