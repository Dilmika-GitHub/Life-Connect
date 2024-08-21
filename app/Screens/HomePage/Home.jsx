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
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoginScreen from "../LoginScreen/LoginScreen";
import ChangePassword from "../ChangePassword";
import axios from 'axios';
import { BASE_URL, ENDPOINTS } from "../../services/apiConfig";

const Drawer = createDrawerNavigator();

const CustomDrawerContent = ({ navigation }) => {
  const [logoutConfirmationVisible, setLogoutConfirmationVisible] = useState(false);
  const [userData, setUserData] = useState(null);
  const [agentCode, setAgentCode] = useState(null);
  const [loading, setLoading] = useState(true);
  
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
            marginVertical: 10,
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
          label={() => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{color:'#595959'}}>Maturity</Text>
            </View>
          )}
          onPress={() => navigation.navigate("Maturity")}
          icon={({ focused, color, size }) => (
            <Ionicons
              name={focused ? "refresh" : "refresh-outline"}
              size={size}
              color={color}
            />
          )}
        />
        {/* Logout Drawer Item */}
        <View style={{ flex: 1, justifyContent: "flex-end", bottom:0 }}>
          <DrawerItem
            label="Logout"
            onPress={handleLogout}
            icon={({ focused, color, size }) => (
              <Ionicons
                name={focused ? "log-out" : "log-out-outline"}
                size={size}
                color={color}
              />
            )}
            style={{marginTop:hp('50%')}}
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
          // options={({ navigation }) => ({
          //   headerRight: () => (
          //     <TouchableOpacity
          //       onPress={() => navigation.navigate("MDRT Ranking")}
          //     >
          //       <Image
          //         source={require("../../../components/pngtree.png")}
          //         style={{ width: 30, height: 30, margin: 10 }}
          //       />
          //     </TouchableOpacity>
          //   ),
          // })}
        />
        <Drawer.Screen name="Policy Details" component={PolicyDetails} />
        <Drawer.Screen name="Maturity" component={Maturity} />
        <Drawer.Screen name="Lapsed" component={Lapsed} />
        <Drawer.Screen name="Logout" component={SettingsScreen} />
        <Drawer.Screen name="Change Password" component={ChangePassword} />
        <Drawer.Screen name="Login" component={LoginScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}