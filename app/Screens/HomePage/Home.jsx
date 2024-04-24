import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { Image, View, Text, TouchableOpacity } from 'react-native';
import DashboardScreen from '../DashboardScreen/DashboardScreen';
import SettingsScreen from '../SettingsScreen';
import Competitions from '../Competitions';
import Profile from '../UserProfile/Profile';
import PolicyDetails from '../PolicyDetails';
import OnlinePolicy from '../OnlinePolicy';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = ({ navigation }) => {
  return (
    <DrawerContentScrollView>
      <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10, marginLeft: 10 }}>
        <Image
          source={require('../../../components/user.jpg')}
          style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }}
        />
        <View style={{ flexDirection: 'column' }}>
          <Text style={{ fontSize: 16 }}>Michael Smith</Text>
          <Text style={{ fontSize: 12 }}>michalsmitch12@gmail.com</Text>
        </View>
      </TouchableOpacity>
      <DrawerItem
        label="Home"
        onPress={() => navigation.navigate('Home')}
        icon={({ focused, color, size }) => <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />}
        style={{marginTop:20}}
      />
      <DrawerItem
        label="MDRT"
        onPress={() => navigation.navigate('MDRT')}
        icon={({ focused, color, size }) => <Ionicons name={focused ? 'trophy' : 'trophy-outline'} size={size} color={color} />}
      />
      <DrawerItem
        label="Policy Details"
        onPress={() => navigation.navigate('PolicyDetails')}
        icon={({ focused, color, size }) => <Ionicons name={focused ? 'document-text' : 'document-text-outline'} size={size} color={color} />}
      />
      <DrawerItem
        label="Renew"
        onPress={() => navigation.navigate('Renew')}
        icon={({ focused, color, size }) => <Ionicons name={focused ? 'refresh' : 'refresh-outline'} size={size} color={color} />}
      />
      <DrawerItem
        label="Logout"
        onPress={() => navigation.navigate('Logout')}
        icon={({ focused, color, size }) => <Ionicons name={focused ? 'log-out' : 'log-out-outline'} size={size} color={color} />}
        style={{marginTop:380}}
      />
    </DrawerContentScrollView>
  );
};

export default function Home() {
  return (
    <NavigationContainer independent={true}>
      <Drawer.Navigator
        initialRouteName='Home'
        drawerContent={props => <CustomDrawerContent {...props} />}
      >
        <Drawer.Screen name="Home" component={DashboardScreen} />
        <Drawer.Screen name="MDRT" component={Competitions} />
        <Drawer.Screen name="Profile" component={Profile} />
        <Drawer.Screen name="PolicyDetails" component={PolicyDetails} />
        <Drawer.Screen name="Renew" component={OnlinePolicy} />
        <Drawer.Screen name="Logout" component={SettingsScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}