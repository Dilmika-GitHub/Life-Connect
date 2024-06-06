import React, { useState } from "react";
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
} from "react-native";
import DashboardScreen from "../DashboardScreen/DashboardScreen";
import SettingsScreen from "../SettingsScreen";
import Competitions from "../Competitions";
import Profile from "../UserProfile/Profile";
import PolicyDetails from "../PolicyDetails";
import Maturity from "../Maturity";
import Lapsed from "../Lapsed"
import MDRTProfile from "../UserProfile/MDRTProfile/MDRTProfile";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoginScreen from "../LoginScreen/LoginScreen";
import ChangePassword from "../LoginScreen/ChangePassword";

const Drawer = createDrawerNavigator();

const CustomDrawerContent = ({ navigation }) => {
  const [logoutConfirmationVisible, setLogoutConfirmationVisible] =
    useState(false);

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

  return (
    <DrawerContentScrollView>
      {/* Wrap drawer content in SafeAreaView to handle notch */}
      <SafeAreaView style={{ flex: 1 }}>
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
            source={require("../../../components/user.jpg")}
            style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }}
          />
          <View style={{ flexDirection: "column" }}>
            <Text style={{ fontSize: 16 }}>Michael Smith</Text>
            <Text style={{ fontSize: 12 }}>michalsmitch12@gmail.com</Text>
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
          onPress={() => navigation.navigate("PolicyDetails")}
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
              <Text style={{color:'#595959'}}>Maturity          </Text>
              <View style={{ backgroundColor: "#FF5733", borderRadius: 20, marginLeft: 5, paddingHorizontal: 10, paddingVertical: 5 }}>
                <Text style={{ color: "#fff" }}>3</Text>
              </View>
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
        }}
      >
        <Drawer.Screen name="Home" component={DashboardScreen} />
        <Drawer.Screen name="MDRT Ranking" component={Competitions} />
        <Drawer.Screen name="My Profile" component={Profile} />
        <Drawer.Screen
          name="MDRT"
          component={MDRTProfile}
          options={({ navigation }) => ({
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate("MDRT Ranking")}
              >
                <Image
                  source={require("../../../components/pngtree.png")}
                  style={{ width: 30, height: 30, margin: 10 }}
                />
              </TouchableOpacity>
            ),
          })}
        />
        <Drawer.Screen name="PolicyDetails" component={PolicyDetails} />
        <Drawer.Screen name="Maturity" component={Maturity} />
        <Drawer.Screen name="Lapsed" component={Lapsed} />
        <Drawer.Screen name="Logout" component={SettingsScreen} />
        <Drawer.Screen name="ChangePassword" component={ChangePassword} options={{ headerShown: false }} />
        <Drawer.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}