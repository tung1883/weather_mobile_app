import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import i18n from './functionalities/language/i18n';

import MainPage from "./components/MainPage";
import { LoadingPage } from './components/LoadingPage';
import { LocationPermissionPage } from './components/LocationPermissionPage';
import SearchPage from './components/SearchPage';
import config from './config'
import { ColorProvider } from './components/ColorContext';
import Settings from './components/settingsPages/Settings';
import WidgetSettings from './components/settingsPages/WidgetSetting';
import LocationSettings from './components/settingsPages/LocationSettings';
import NotificationSettings from './components/settingsPages/NotificationSettings'
import { cities } from './assets/citiList';

const Stack = createStackNavigator();

const App = () => {
  const [location, setLocation] = useState({});
  const [weather, setWeather] = useState({})
  const [favs, setFavs] = useState([])

  //language
  {
    const {t, i18n} = useTranslation(); 
    const [currentLanguage, setLanguage] = useState ('vn'); 
    const changeLanguage = (lang)=> { 
      i18n 
        .changeLanguage(lang) 
        .then(() => setLanguage(lang)) 
        .catch(err => console.log(err)); 
    }; 
  }

  useEffect(() => {
    init()
  }, [])

  const init = async () => {
    //check if the user uses the app for the first time
    const notFirstTime = await AsyncStorage.getItem('notFirstTime'); // null if the first time, "true" otherwise
    // AsyncStorage.removeItem('notFirstTime') //uncomment this and comment 3 lines to below to be first time user
    if (notFirstTime === null) {
      await AsyncStorage.setItem('notFirstTime', "true");
      await AsyncStorage.setItem('favoriteLocations', JSON.stringify([]))
    }

    const location = await getCurrentLocation()
    const weather = await getWeather({location})
    setWeather(weather)
    await AsyncStorage.setItem('current', JSON.stringify(location))
  
    const favs = JSON.parse(await AsyncStorage.getItem('favoriteLocations'))
    setFavs((favs) ? favs : [])

    //store data to AsyncStorage to reduce api calls
    // { 
    //   //key: name from cities -> value: location
    //   //key: current -> value: current location
    //   //key: location -> value: weather 
    //   cities.forEach(async (city) => {
    //     const location = await getLocationByCity(city)
    //     if (!location) return 

    //     const weather = await getWeather({location})
    //     await AsyncStorage.setItem(city, JSON.stringify(location))
    //     await AsyncStorage.setItem(JSON.stringify(location), JSON.stringify(weather))
    //   })

    //   const location = await getCurrentLocation()
    //   const weather = await getWeather({location})
    //   await AsyncStorage.setItem('current', JSON.stringify(location))
    //   await AsyncStorage.setItem(JSON.stringify(location), JSON.stringify(weather))

    ////print all values
    //   const keys = await AsyncStorage.getAllKeys()
    //   keys.forEach(async (key) => {
    //     if (key !== 'current') return
    //     console.log("KEY: " + key + " VALUE: " + await AsyncStorage.getItem(key))
    //     console.log(" -------------------------- ")
    //   })
    // }
  }


  const controller = new AbortController();
  const signal = controller.signal;

  const getCurrentLocation = async () => {
      try {
        const { status } = await Location.getForegroundPermissionsAsync();

        if (status !== 'granted') {
          console.log('Permission to access location was denied');
          return null;
        }

        const { latitude: lat, longitude: long } = (await Location.getCurrentPositionAsync({})).coords
        const {city, country} = await getLocationDetails({lat, long})
        setLocation({ lat, long, city, country});
        return {lat, long, city, country}
      } catch (error) {
        console.error('Error getting location:', error);
        return null
      }
    }

  const getLocationByCity = async (city) => {
    try {
      const response = await fetch(
        `http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${config.API_KEY}`
      );
      const data = await response.json();
      if (!data?.coord?.lat) {
        console.log('getLocationByCity Error');
        return null
      }

      const {lat, lon: long} = data.coord
      const details = await getLocationDetails({lat, long})
      setLocation({ lat, long, city: details.city, country: details.country});
      return {lat, long, city: details.city, country: details.country}
    } catch (error) {
      console.error('getLocationByCity Error:', error);
      return null
    }
  };

   const getLocationDetails = async ({lat, long}) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${long}&limit=1&appid=${config.API_KEY}`
      );
      const data = (await response.json()).sort((a, b) => b.name.length - a.name.length)
      return {city: data[0].name, country: data[0].country}
    } catch (error) {
      console.error('Error fetching location info:', error);
    }
  };

  const getWeather = async ({location, current}) => {
    //TRUE API CALL
    // if (!location) return null

    // return fetch(
    //   `https://api.openweathermap.org/data/3.0/onecall?lat=${location.lat}&lon=${location.long}&exclude=hourly,minutely&units=metric&appid=${config.API_KEY}`,
    //   { signal }
    // )
    // .then((res) => {
    //   return res.json()
    // })
    // .then((data) => {
    //   return data
    // })
    // .catch((err) => {
    //   console.log("error", err);
    //   return null
    // });

    //MOCK API CALL
    if (current) {
      location = await AsyncStorage.getItem('current')
    }
    
    return JSON.parse(await AsyncStorage.getItem(JSON.stringify(location)))
  }

  return (
    <ColorProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Loading">
          <Stack.Screen name="Loading" component={LoadingPage} options={{ headerShown: false }} />
          <Stack.Screen name="LocationPermission" component={LocationPermissionPage} options={{ headerShown: false }} />
          
          <Stack.Screen name="Search" options={{ headerShown: false }}>
            {(navigation) => <SearchPage {...navigation}
              getCurrentLocation={getCurrentLocation} getLocationByCity={getLocationByCity} getWeather={getWeather} 
              favs={favs} setFavs={setFavs} setWeather={setWeather}
            ></SearchPage>}
          </Stack.Screen>
          <Stack.Screen 
            name="Main" 
            options={{ headerShown: false }}>
              {(navigation) => <MainPage {...navigation} location={location} weather={weather} setWeather={setWeather}
                getWeather={getWeather} getLocationByCity={getLocationByCity}
                setLocation={setLocation}
              />}
            </Stack.Screen>

          <Stack.Screen name='Settings' options={{headerShown: false}}>{(navigation) => <Settings {...navigation}/>}</Stack.Screen>
          <Stack.Screen name='WidgetSettings' options={{headerShown: false}}>{(navigation) => <WidgetSettings {...navigation}/>}</Stack.Screen>
          <Stack.Screen name='LocationSettings' options={{headerShown: false}}>{(navigation) => <LocationSettings {...navigation}/>}</Stack.Screen>
          <Stack.Screen name='NotificationSettings' options={{headerShown: false}}>{(navigation) => <NotificationSettings {...navigation}/>}</Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </ColorProvider>
  );
};

export default App;
