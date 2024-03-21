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

  useEffect(() => {
    const checkUser = async () => {
      const notFirstTime = await AsyncStorage.getItem('notFirstTime'); // null if the first time, "true" otherwise
      if (notFirstTime === null) {
        AsyncStorage.setItem('notFirstTime', "true");
      }
    };

    checkUser();
  }, []);

  useEffect(() => {
    const getLocation = async () => {
      try {
        const { status } = await Location.getForegroundPermissionsAsync();
        setLocationStatus(status)

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
        <Stack.Screen name="Loading" component={LoadingPage} options={{ headerShown: false }} />
        <Stack.Screen name="LocationPermission" component={LocationPermissionPage} options={{ headerShown: false }} />
        <Stack.Screen name="Main" component={MainPage} initialParams={{location}} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};


export default App;
