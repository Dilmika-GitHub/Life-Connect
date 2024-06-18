import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL, ENDPOINTS } from "../../services/apiConfig";

const Profile = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categoryType, setCategoryType] = useState(null);

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken'); 
      const email = await AsyncStorage.getItem('email'); 
      const categoryType = await AsyncStorage.getItem('categoryType');
      setCategoryType(categoryType);

      console.log(token);

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
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const navigateToPasswordChange = () => {
    navigation.navigate('ChangePassword');
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      {/* Top section border */}
      <View style={[styles.section, styles.topSection]}></View>

      {/* Bottom section border */}
      <View style={[styles.section, styles.bottomSection]}>
        {/* Grey color square text */}
        <View style={styles.greySquare}>
          <View style={styles.row}>
            {categoryType === "Ag" ? (
              <>
                <Text style={styles.titleText}>Agent Code:</Text>
                <Text style={styles.normalText}>
                  {userData?.agent_code || "N/A"}
                </Text>
              </>
            ) : categoryType === "Or" ? (
              <>
                <Text style={styles.titleText}>Organizer Code:</Text>
                <Text style={styles.normalText}>
                  {userData?.orgnizer_code || "N/A"}
                </Text>
              </>
            ) : null}
          </View>
          <View style={styles.row}>
            <Text style={styles.titleText}>NIC No:</Text>
            <Text style={styles.normalText}>{userData?.idnum || "N/A"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.titleText}>E-mail:</Text>
            <Text style={styles.normalText}>{userData?.email || "N/A"}</Text>
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
                <Text style={styles.titleText}>Organizer Team Code:</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  section: {
    width: '100%',
  },
  topSection: {
    flex: 1,
    backgroundColor: '#FEA58F',
  },
  bottomSection: {
    flex: 5,
    backgroundColor: 'white',
  },
  imageContainer: {
    position: 'absolute',
    left: '50%',
    top: '16%',
    transform: [{ translateX: -100 }, { translateY: -100 }],
  },
  roundImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  imageText: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  greySquare: {
    width: 320,
    height: 155,
    backgroundColor: 'lightgrey',
    marginTop: 150,
    alignSelf: 'center',
    borderRadius: 10,
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  titleText: {
    fontSize: 16,
    color: 'black',
    minWidth: 100, // Ensure alignment
  },
  normalText: {
    fontSize: 16,
    color: 'grey',
  },
  changePasswordText: {
    fontSize: 16,
    color: 'blue',
  },
});

export default Profile;
