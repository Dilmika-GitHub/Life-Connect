//import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';    
import DashboardScreen from './DashboardScreen';
import SettingsScreen from './SettingsScreen';

const Drawer = createDrawerNavigator();

export default function Home() {
  return (
    <NavigationContainer independent={true}>
      <Drawer.Navigator>
          <Drawer.Screen name="Dashboard" component={DashboardScreen} />
          <Drawer.Screen name="Settings" component={SettingsScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}


        
      