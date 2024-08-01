import React, { useEffect, useState, useCallback  } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import { BASE_URL, ENDPOINTS } from "../../services/apiConfig";
import { CommonActions } from '@react-navigation/native';
import route from 'color-convert/route';
import AwesomeAlert from 'react-native-awesome-alerts';
import { Ionicons } from "@expo/vector-icons";

const Profile = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categoryType, setCategoryType] = useState(null);
  const [showAlert, setShowAlert] = useState(false);

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

  const formatAgencyCode = (code) => {
    const paddedCode = code.padStart(6, '0');
    return `L24${paddedCode}`;
  };

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      const email = await AsyncStorage.getItem("email");
      const categoryType = await AsyncStorage.getItem("categoryType");
      setCategoryType(categoryType);

      const response = await axios.get(BASE_URL+ENDPOINTS.PROFILE_DETAILS,{
          headers:{
            Authorization: `Bearer ${token}`
          },
          params: {
            email: email,
            catType: categoryType
          }
        });
      setUserData(response.data);
      console.log("called");
    } catch (error) {
      handleErrorResponse(error);
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [])
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
      {/* Top section border */}
      <View style={[styles.section, styles.topSection]}></View>

      {/* Bottom section border */}
      <View style={[styles.section, styles.bottomSection]}>
        {/* Grey color square text */}
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
            <>
              <View style={styles.row}>
                <Text style={styles.titleText}>Organizer Team Leader Code:</Text>
                <Text style={styles.normalText}>
                  {userData?.or_team_code || "N/A"}
                </Text>
              </View>
            </>
          ) : null}

          <View style={styles.row}>
            <Text
              style={styles.changePasswordText}
              onPress={navigateToPasswordChange}
            >
              Change Password
            </Text>
          </View>
        </View>
      </View>

      {/* Profile Image */}
      <View style={styles.imageContainer}>
        <Image
          source={require("../../../components/user.jpg")}
          style={styles.roundImage}
          resizeMode="cover"
        />
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
        confirmButtonColor="#FF7758"
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
});

export default Profile;