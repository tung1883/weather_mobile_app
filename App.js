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

const Stack = createStackNavigator();

const App = () => {
  const [locationStatus, setLocationStatus] = useState()
  const [location, setLocation] = useState({
    lat: 21.0245,
    long: 105.8412
  });
  const [city, setCity] = useState('Hanoi')
  const [weather, setWeather] = useState({})

  //language
  const {t, i18n} = useTranslation(); 
  const [currentLanguage,setLanguage] = useState ('vn'); 
  const changeLanguage = (lang)=> { 
    i18n 
      .changeLanguage(lang) 
      .then(() => setLanguage(lang)) 
      .catch(err => console.log(err)); 
  }; 

  useEffect(() => {
    const checkUser = async () => {
      const notFirstTime = await AsyncStorage.getItem('notFirstTime'); // null if the first time, "true" otherwise
      AsyncStorage.removeItem('notFirstTime') //uncomment this and comment 3 lines to below to be first time user
      // if (notFirstTime === null) {
      //   AsyncStorage.setItem('notFirstTime', "true");
      // }
    };

    checkUser();
  }, []);

  useEffect(() => {
    getLocation()
    fetchWeatherInfo()
  }, []);

  const controller = new AbortController();
  const signal = controller.signal;

  const getLocation = async () => {
      try {
        const { status } = await Location.getForegroundPermissionsAsync();
        setLocationStatus(status)

        if (status !== 'granted') {
          console.log('Permission to access location was denied');
          return;
        }

        const { latitude, longitude } = (await Location.getCurrentPositionAsync({})).coords
        setLocation({lat: latitude, long: longitude})
      } catch (error) {
        console.error('Error getting location:', error);
      }
    }
    
  const fetchWeatherInfo = async (key) => {
    // if (!location) return

    // fetch(
    //   `https://api.openweathermap.org/data/3.0/onecall?lat=${location.lat}&lon=${location.long}&exclude=hourly,minutely&units=metric&appid=${config.API_KEY}`,
    //   { signal }
    // )
    // .then((res) => {
    //   return res.json()
    // })
    // .then((data) => {
    //   setWeather(data);
    // })
    // .catch((err) => {
    //   console.log("error", err);
    // });

    if (!key) key = 'Hanoi'
    AsyncStorage.getItem(key)
    .then((res) => {
      setWeather(JSON.parse(res))
    })
  }

  //fetch lat long by city
  const fetchLatLongHandler = async (city) => {
    try {
      const response = await fetch(
        `http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${config.API_KEY}`
      );
      const data = await response.json();
      if (!data?.coord?.lat) {
        console.log('fetchLatLongHandler Error');
        return false;
      }
      setLocation({ lat: data.coord.lat, long: data.coord.lon });
      return true;
    } catch (error) {
      console.error('fetchLatLongHandler Error:', error);
      return false;
    }
  };

  return (
    <ColorProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Loading">
          <Stack.Screen name="Search" options={{ headerShown: false }}>
            {(navigation) => <SearchPage 
              {...navigation} setCity={setCity} getLocation={getLocation} fetchLatLongHandler={fetchLatLongHandler}
              fetchWeatherInfo={fetchWeatherInfo}
            ></SearchPage>}
          </Stack.Screen>
          <Stack.Screen name="Loading" component={LoadingPage} options={{ headerShown: false }} />
          <Stack.Screen name="LocationPermission" component={LocationPermissionPage} options={{ headerShown: false }} />
          <Stack.Screen 
            name="Main" 
            options={{ headerShown: false }}>
              {(navigation) => <MainPage {...navigation} city={city} setCity={setCity} 
                fetchLatLongHandler={fetchLatLongHandler}
                fetchWeatherInfo={fetchWeatherInfo}
                location={location} setLocation={setLocation} 
                weather={weather} setWeather={setWeather}/>}
            </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </ColorProvider>
  );
};


export default App;
