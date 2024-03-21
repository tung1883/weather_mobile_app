import React, { useState, useEffect } from 'react';
import MainPage from "./components/MainPage";
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { LoadingPage } from './components/LoadingPage';
import { LocationPermissionPage } from './components/LocationPermissionPage';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Stack = createStackNavigator();

const App = () => {
  const [locationStatus, setLocationStatus] = useState()
  const [location, setLocation] = useState(null);
  const [firstTimeUser, setFirstTimeUser] = useState(null)

  useEffect(() => {
    const checkUser = async () => {
      const isFirstTime = await checkFirstTimeUser();
      if (isFirstTime) {
        setFirstTimeUser(true)
        AsyncStorage.setItem('isFirstTime', 'false');
      } else {
        setFirstTimeUser(false)
      }
    };

    checkUser();
  }, []);

  useEffect(() => {
    const getLocation = async () => {
      try {
        const { status } = await Location.getForegroundPermissionsAsync();
        setLocationStatus(status)
        console.log(status)

        if (status !== 'granted') {
          console.log('Permission to access location was denied');
          return;
        }

        setLocation(await Location.getCurrentPositionAsync({}));
      } catch (error) {
        console.error('Error getting location:', error);
      }
    }
    
    getLocation()
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Loading">
        <Stack.Screen name="Loading" component={LoadingPage} initialParams={{firstTimeUser}} options={{ headerShown: false }} />
        <Stack.Screen name="LocationPermission" component={LocationPermissionPage} options={{ headerShown: false }} />
        <Stack.Screen name="Main" component={MainPage} initialParams={{location}} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const checkFirstTimeUser = async () => {
  try {
    const isFirstTime = await AsyncStorage.getItem('isFirstTime');
    return isFirstTime === null; // Returns true if it's the first time, false otherwise
  } catch (error) {
    console.error('Error checking first time user:', error);
    return false; // Assume it's not the first time if there's an error
  }
};

export default App;
