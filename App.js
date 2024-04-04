import React, { useEffect } from 'react';
import { Appearance } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization'

import MainPage from "./components/MainPage";
import SearchPage from './components/SearchPage';
import LoadingPage from './components/LoadingPage';
import LocationPermissionPage from './components/LocationPermissionPage';
import Settings from './components/settingsPages/Settings';
import WidgetSettings from './components/settingsPages/WidgetSetting';
import LocationSettings from './components/settingsPages/LocationSettings';
import NotificationSettings from './components/settingsPages/NotificationSettings'
import LanguageUnitsPage, { Language } from './components/settingsPages/LanguageUnits';
import { FunctionalProvider, WeatherProvider } from './components/Context';

const Stack = createStackNavigator();

const App = () => {

  useEffect(() => {
    (async () => {
      //check if the user uses the app for the first time
      AsyncStorage.removeItem('notFirstTime') //uncomment this to be first time user
      const notFirstTime = await AsyncStorage.getItem('notFirstTime'); // null if the first time, "true" otherwise
      if (notFirstTime === null) {
        await AsyncStorage.setItem('notFirstTime', "true");
        await AsyncStorage.setItem('favoriteLocations', JSON.stringify([]))
        await AsyncStorage.setItem('theme', 'aut')
        await AsyncStorage.setItem('lang', 'auto')
        await AsyncStorage.setItem('notFirstTime', 'true')
      }
    }) ()

  }, [])

  return (
    <FunctionalProvider>
      <WeatherProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Loading">
            <Stack.Screen name="Loading" component={LoadingPage} options={{ headerShown: false }} />
            <Stack.Screen name="LocationPermission" component={LocationPermissionPage} options={{ headerShown: false }} />
            <Stack.Screen name="Search" options={{ headerShown: false }}>{(navigation) => <SearchPage {...navigation}/>}</Stack.Screen>
            <Stack.Screen name="Main" options={{ headerShown: false }}>{(navigation) => <MainPage {...navigation}/>}</Stack.Screen>
            <Stack.Screen name='Settings' options={{headerShown: false}}>{(navigation) => <Settings {...navigation}/>}</Stack.Screen>
            <Stack.Screen name='WidgetSettings' options={{headerShown: false}}>{(navigation) => <WidgetSettings {...navigation}/>}</Stack.Screen>
            <Stack.Screen name='LocationSettings' options={{headerShown: false}}>{(navigation) => <LocationSettings {...navigation}/>}</Stack.Screen>
            <Stack.Screen name='NotificationSettings' options={{headerShown: false}}>{(navigation) => <NotificationSettings {...navigation}/>}</Stack.Screen>
            <Stack.Screen name='LanguageUnits' options={{headerShown: false}}>{(navigation) => <LanguageUnitsPage {...navigation}></LanguageUnitsPage>}</Stack.Screen>
            <Stack.Screen name='Language' options={{headerShown: false}}>{(navigation) => <Language {...navigation}></Language>}</Stack.Screen>
          </Stack.Navigator>
        </NavigationContainer>
      </WeatherProvider>
    </FunctionalProvider>
  );
};

export default App;
