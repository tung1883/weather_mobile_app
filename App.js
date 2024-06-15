import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import MainPage from "./components/MainPage";
import SearchPage from './components/SearchPage';
import LoadingPage from './components/LoadingPage';
import LocationPermissionPage from './components/LocationPermissionPage';
import Settings from './components/settingsPages/Settings';
import WidgetSettings from './components/settingsPages/WidgetSetting';
import LocationSettings from './components/settingsPages/LocationSettings';
import NotificationSettings from './components/settingsPages/NotificationSettings'
import LanguageUnitsPage, { Language } from './components/settingsPages/LanguageUnits';
import { FunctionalProvider, NotificationProvider, WeatherProvider } from './components/Context';
import LocationAdd from './components/settingsPages/LocationAdd';
import Indicator from './components/ui/Indicator';
import HealthPage from './components/weather/HealthPage';

const Stack = createStackNavigator();

const App = () => {
  useEffect(() => {
    (async () => {
      //check if the user uses the app for the first time
      // await AsyncStorage.removeItem('notFirstTime') //uncomment this to be first time user
      const notFirstTime = await AsyncStorage.getItem('notFirstTime'); // null if the first time, "true" otherwise
      
      if (notFirstTime === null) {
        await AsyncStorage.setItem('favoriteLocations', JSON.stringify([]))
        await AsyncStorage.setItem('theme', 'auto')
        await AsyncStorage.setItem('lang', 'auto')
        await AsyncStorage.setItem('unit', 'metric')
      }
    }) ()

  }, [])

  return (
    <FunctionalProvider>
      <WeatherProvider>
        <NotificationProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Loading">
              <Stack.Screen name="Loading" component={LoadingPage} options={{ headerShown: false }} />
              <Stack.Screen name="LocationPermission" component={LocationPermissionPage} options={{ headerShown: false }} />
              <Stack.Screen name="Search" options={{ headerShown: false }}>{(navigation) => <SearchPage {...navigation}/>}</Stack.Screen>
              <Stack.Screen name="Main" options={{ headerShown: false }}>{(navigation) => <>
                <MainPage {...navigation}/>
                <Indicator></Indicator>
              </>}</Stack.Screen>
              <Stack.Screen name='HealthPage' options={{headerShown: false}}>{(navigation) => <HealthPage {...navigation}></HealthPage>}</Stack.Screen>
              <Stack.Screen name='Settings' options={{headerShown: false}}>{(navigation) => <Settings {...navigation}/>}</Stack.Screen>
              <Stack.Screen name='WidgetSettings' options={{headerShown: false}}>{(navigation) => <WidgetSettings {...navigation}/>}</Stack.Screen>
              <Stack.Screen name='LocationSettings' options={{headerShown: false}}>{(navigation) => <LocationSettings {...navigation}/>}</Stack.Screen>
              <Stack.Screen name='LocationAdd' options={{headerShown: false}}>{(navigation) => <LocationAdd {...navigation}/>}</Stack.Screen>
              <Stack.Screen name='NotificationSettings' options={{headerShown: false}}>{(navigation) => <NotificationSettings {...navigation}/>}</Stack.Screen>
              <Stack.Screen name='LanguageUnits' options={{headerShown: false}}>
                {(navigation) => <LanguageUnitsPage {...navigation}></LanguageUnitsPage>}</Stack.Screen>
              <Stack.Screen name='Language' options={{headerShown: false}}>{(navigation) => <Language {...navigation}></Language>}
              </Stack.Screen>
          </Stack.Navigator>
          </NavigationContainer>
        </NotificationProvider>
      </WeatherProvider>
    </FunctionalProvider>
  );
};

export default App;
