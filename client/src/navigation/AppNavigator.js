import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import LoginScreen from '../screens/Auth/LoginScreen';
import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import SellScreen from '../screens/Sales/SellScreen';
import SalesHistoryScreen from '../screens/Sales/SalesHistoryScreen';
import BarcodeScannerScreen from '../screens/Scanner/BarcodeScannerScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return <Loader />;
  }

  return (
    <NavigationContainer>
      {!isAuthenticated ? (
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator
          initialRouteName="Dashboard"
          screenOptions={{
            headerTitleStyle: {
              fontSize: 18
            }
          }}
        >
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="Sell" component={SellScreen} options={{ title: 'Sell Product' }} />
          <Stack.Screen
            name="SalesHistory"
            component={SalesHistoryScreen}
            options={{ title: 'Sales History' }}
          />
          <Stack.Screen
            name="Scanner"
            component={BarcodeScannerScreen}
            options={{ title: 'Scan Barcode' }}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;
