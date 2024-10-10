import React, { useEffect, useState } from "react";
import { NavigationContainer, CommonActions } from "@react-navigation/native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from "@react-navigation/drawer";
import { Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Button,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
  Alert 
} from "react-native";
import DashboardScreen from "../DashboardScreen/DashboardScreen";
import SettingsScreen from "../SettingsScreen";
import Competitions from "../MDRTRanking";
import Profile from "../UserProfile/Profile";
import PolicyDetails from "../PolicyDetails";
import Maturity from "../MaturityPolicies/Maturity";
import Lapsed from "../LapsedPolicies/Lapsed"
import MDRTProfile from "../UserProfile/MDRTProfile/MDRTProfile";
import Persistency from "../Persistency";
import CommissionStatement from "../CommissionStatement";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoginScreen from "../LoginScreen/LoginScreen";
import ChangePassword from "../ChangePassword";
import PersistencyInforcedPolicyList from "../PersistencyInforcedPolicyList";
import PersistencyLapsedPolicyList from "../PersistencyLapsedPolicyList";
import AnnualAwardsProfile from "../AnnualAwards/AnnualAwardsProfile";
import AnnualAwardsRanking from "../AnnualAwards/AnnualAwardsRanking";
import axios from 'axios';
import { BASE_URL, ENDPOINTS } from "../../services/apiConfig";
import { color } from "react-native-elements/dist/helpers";

const Drawer = createDrawerNavigator();

const CustomDrawerContent = ({ navigation }) => {
  const [logoutConfirmationVisible, setLogoutConfirmationVisible] = useState(false);
  const [userData, setUserData] = useState(null);
  const [agentCode, setAgentCode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [competitionsExpanded, setCompetitionsExpanded] = useState(false);
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        const email = await AsyncStorage.getItem('email');
        const categoryType = await AsyncStorage.getItem('categoryType');

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
      } catch (error) {
        if (error.response?.status === 401) {
          Alert.alert(
            'Session Expired',
            'Your session has expired. Please log in again.',
            [
              {
                text: 'OK',
                onPress: () => {
                  navigation.dispatch(
                    CommonActions.reset({
                      index: 0,
                      routes: [{ name: 'Login' }],
                    })
                  );
                },
              },
            ],
          );
        }
        console.error('Error fetching user data:', error);
      } finally {
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
        // const imageUrl = URL.createObjectURL(blob);
        const imageUrl = await blobToBase64(blob);
        
        setUserData((prevData) => ({
          ...prevData,
          profileImage: imageUrl,
        }));
      } catch (error) {
        console.error('Error fetching profile image:', error);
      }
    };

    const fetchData = async () => {
      await fetchUserData();
      if (agentCode) {
        await fetchProfileImage();
      }
    };

    fetchData();
  }, [agentCode]);

  const handleLogout = () => {
    setLogoutConfirmationVisible(true);
  };

  const handleConfirmLogout = async () => {
    setLogoutConfirmationVisible(false);

    // await AsyncStorage.clear(); //uncomment if you want to clear credentials when login out

    // Reset the navigation stack and navigate to the Login screen
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      })
    );
    
    // await AsyncStorage.removeItem("username");
    // await AsyncStorage.removeItem("password");
  };

  const handleCancelLogout = () => {
    setLogoutConfirmationVisible(false);
  };
  const toggleCompetitions = () => {
    setCompetitionsExpanded(!competitionsExpanded);
  };
  
  if (loading) {
    return <ActivityIndicator size="large" color="#08818a" />;
  }
  
  return (
    <DrawerContentScrollView style={{ flex: 1 , backgroundColor:'#d1f7fa',}}>
      {/* Wrap drawer content in SafeAreaView to handle notch */}
      <SafeAreaView style={{ flex: 1 ,}}>
        {/* User Profile Section */}
        <TouchableOpacity
          onPress={() => navigation.navigate("My Profile")}
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 10,
            marginLeft: 10,
          }}
        >
          <Image
            source={{ uri: userData.profileImage }}
            style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }}
          />
          <View style={{ flexDirection: "column" }}>
          <Text style={{ fontSize: 16 }}>{userData?.intial?.trim()} {userData?.name}</Text>
          <Text style={{ fontSize: 12 }}>{userData?.email}</Text>
          </View>
        </TouchableOpacity>

        {/* Drawer Navigation Items */}
        <DrawerItem
          label="Home"
          onPress={() => navigation.navigate("Home")}
          icon={({ focused, color, size }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={size}
              color={color}
            />
          )}
        />
          {/* Competition Group */}
        <TouchableOpacity
          onPress={toggleCompetitions}
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 10,
            paddingHorizontal: 20,
          }}
        >
          <Ionicons
            name={competitionsExpanded ? "chevron-down" : "chevron-forward"}
            size={20}
            color="#000"
            style={{ marginRight: 30 }}
          />
          <Text style={{ fontSize: 15 }}>Competitions</Text>
        </TouchableOpacity>

        {/* Conditionally render the nested items */}
        {competitionsExpanded && (
          <View style={{ marginLeft: 20 }}>
            <DrawerItem
              label="MDRT"
              onPress={() => navigation.navigate("MDRT")}
              icon={({ focused, color, size }) => (
                <Ionicons
                  name={focused ? "trophy" : "trophy-outline"}
                  size={size}
                  color={color}
                />
              )}
            />
            <DrawerItem
              label="Annual Awards"
              onPress={() => navigation.navigate("Annual Awards Profile")}
              icon={({ focused, color, size }) => (
                <Ionicons
                  name={focused ? "medal" : "medal-outline"}
                  size={size}
                  color={color}
                />
              )}
            />
          </View>
        )}
        <DrawerItem
          label="Policy Details"
          onPress={() => navigation.navigate("Policy Details")}
          icon={({ focused, color, size }) => (
            <Ionicons
              name={focused ? "document-text" : "document-text-outline"}
              size={size}
              color={color}
            />
          )}
        />
        {/* Custom DrawerItem for "Maturity" */}
        <DrawerItem
          label="Maturity"
          onPress={() => navigation.navigate("Maturity")}
          icon={({ focused, color, size }) => (
            <Ionicons
              name={focused ? "refresh" : "checkbox-outline"}
              size={size}
              color={color}
            />
          )}
        />
        <DrawerItem
          label="Persistency"
          onPress={() => navigation.navigate("Persistency")}
          icon={({ focused, color, size }) => (
            <Ionicons
              name={focused ? "trending-up" : "trending-up-outline"}
              size={size}
              color={color}
            />
          )}
        />
        <DrawerItem
          label="Commission Statement"
          onPress={() => navigation.navigate("Commission Statement")}
          icon={({ focused, color, size }) => (
            <Ionicons
              name={focused ? "receipt-outline" : "receipt-outline"}
              size={size}
              color={color}
            />
          )}
        />
        {/* Logout Drawer Item */}
        <View style={{ flex: 1, justifyContent: "flex-end", bottom:0, }}>
          <DrawerItem
            label="Logout"
            onPress={handleLogout}
            icon={({ focused, color, size }) => (
              <Ionicons
                name={focused ? "log-out" : "log-out-outline"}
                size={size}
                color={'red'}
              />
            )} 
          />
        </View>
      </SafeAreaView>

      {/* Logout Confirmation Modal */}
      <Modal
        visible={logoutConfirmationVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLogoutConfirmationVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              padding: 20,
              borderRadius: 10,
              elevation: 5,
              alignItems: "center",
            }}
          >
            <SimpleLineIcons
              name="logout"
              size={40}
              color="black"
              style={{ marginBottom: 10}}
            />
            <Text style={{ fontSize: 18, marginBottom: 5 }}>
              Do you really want to exit the app?
            </Text>
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                onPress={handleConfirmLogout}
                style={{
                  backgroundColor: "blue",
                  padding: 10,
                  borderRadius: 5,
                  marginRight: 10,
                }}
              >
                <Text style={{ color: "white" }}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCancelLogout}
                style={{ backgroundColor: "red", padding: 10, borderRadius: 5 }}
              >
                <Text style={{ color: "white" }}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </DrawerContentScrollView>
  );
};
const { width, height } = Dimensions.get("window"); // Get screen dimensions

export default function Home() {
  return (
    <NavigationContainer independent={true}>
      <Drawer.Navigator
        initialRouteName="Home"
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerStyle: {
            backgroundColor: "#FEA58F",
          },
          headerTintColor: "#fff",
          headerShown: false
        }}
      >
        <Drawer.Screen name="Home" component={DashboardScreen} />
        <Drawer.Screen name="MDRT Ranking" component={Competitions} />
        <Drawer.Screen name="My Profile" component={Profile} />
        <Drawer.Screen
          name="MDRT"
          component={MDRTProfile}
        />
        <Drawer.Screen name="Policy Details" component={PolicyDetails} />
        <Drawer.Screen name="Maturity" component={Maturity} />
        <Drawer.Screen name="Lapsed" component={Lapsed} />
        <Drawer.Screen name="Logout" component={SettingsScreen} />
        <Drawer.Screen name="Change Password" component={ChangePassword} />
        <Drawer.Screen name="Persistency" component={Persistency}/>
        <Drawer.Screen name="Login" component={LoginScreen} />
        <Drawer.Screen name="Persistency Inforced Policy List" component={PersistencyInforcedPolicyList} />
        <Drawer.Screen name="Persistency Lapsed Policy List" component={PersistencyLapsedPolicyList} />
        <Drawer.Screen name="Commission Statement" component={CommissionStatement} />
        <Drawer.Screen name="Annual Awards Profile" component={AnnualAwardsProfile} />
        <Drawer.Screen name="Annual Awards Ranking" component={AnnualAwardsRanking} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}