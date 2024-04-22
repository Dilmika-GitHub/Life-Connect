//import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';    
import DashboardScreen from '../DashboardScreen/DashboardScreen';
import SettingsScreen from '../SettingsScreen';
import Competitions from '../Competitions';
import Profile from '../UserProfile/Profile';
import PolicyDetails from '../PolicyDetails';
import OnlinePolicy from '../OnlinePolicy';

const Drawer = createDrawerNavigator();

export default function Home() {
  return (
    <NavigationContainer independent={true}>
      <Drawer.Navigator initialRouteName='Dashboard'>
          <Drawer.Screen name="Profile" component={Profile} />
          <Drawer.Screen name="Dashboard" component={DashboardScreen} />
          <Drawer.Screen name="MDRT" component={Competitions} />
          <Drawer.Screen name="PolicyDetails" component={PolicyDetails} />
          <Drawer.Screen name="Renew" component={OnlinePolicy} />
          <Drawer.Screen name="Logout" component={SettingsScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}


        
      