import React, { createContext, useState, useEffect, useContext } from 'react';
import { Appearance, Share } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location'
import { useTranslation } from 'react-i18next';
import * as Localization from 'expo-localization'

import i18n from '../functionalities/language/i18n';
import config from '../config'
import { putToFrontFavs } from '../functionalities/favoriteLocations';

export const FunctionalContext = createContext();
export const WeatherContext = createContext()

export const WeatherProvider = ({ children }) => {
  const [location, setLocation] = useState({});
  const [weather, setWeather] = useState({})
  const [gps, setGps] = useState({})
  const [favs, setFavs] = useState([])
  const [fetching, setFetching] = useState(false)
  const [unit, setUnit] = useState()
  const { lang, parsedLang } = useContext(FunctionalContext)

  useEffect(() => {
    init()
  }, [unit])

  const init = async () => {
    if (!unit) {
      let u = await AsyncStorage.getItem('unit')
      setUnit(u)
      return 
    }

    const location = await getGpsLocation()
    const weather = await getWeather({location})
    setLocation(location)
    setWeather(weather)
    setGps({location, weather})
    await AsyncStorage.setItem('current', JSON.stringify(location))
  
    let favs = JSON.parse(await AsyncStorage.getItem('favoriteLocations'))
    if (location) favs = [{location, weather, gps: true}, ...favs]
    
    favs.forEach(async (fav, index) => {
      if (!fav?.location?.city) {
        favs.splice(index, 1)
      }

      if (!fav?.weather) {
        const weather = await getWeather({location: fav.location})
        fav.weather = weather
      }
      
      if (index == favs.length - 1) setFavs([...favs])
    })

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

    //   const location = await getGpsLocation()
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

  const getGpsLocation = async () => {
      try {
        const { status } = await Location.getForegroundPermissionsAsync();

        if (status !== 'granted') {
          console.log('Permission to access location was denied');
          return null;
        }

        const { latitude: lat, longitude: long } = (await Location.getCurrentPositionAsync({})).coords
        const {city, country} = await getLocationDetails({lat, long})
        return { lat, long, city, country }
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
    if (!location) return null

    return fetch(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${location.lat}&lon=${location.long}&exclude=hourly,minutely&units=${unit}&lang=${parsedLang(lang.lang)}&appid=${config.API_KEY}`,
      { signal }
    )
    .then((res) => {
      return res.json()
    })
    .then((data) => {
      return data
    })
    .catch((err) => {
      console.log("error", err);
      return null
    });

    //MOCK API CALL
    // if (current) {
    //   location = await AsyncStorage.getItem('current')
    // }
    
    // return JSON.parse(await AsyncStorage.getItem(JSON.stringify(location)))
  }

  const share = async ({text}) => {
    try {
      const result = await Share.share({
        message: text,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      console.log(error)
    }
  };

  const changeUnit = async ({newU}) => {
    if (newU == unit) return
    setUnit(newU)
    await AsyncStorage.setItem('unit', newU)
  }

  const getUnit = (type, unit) => {
    switch (unit) {
      case 'standard':
        switch (type) {
          case 'temp':
            return 'K'
          case 'wind':
            return 'm/s'
          case 'pressure':
            return 'hPa'
          default: break
        }
        break
      case 'metric':
        switch (type) {
          case 'temp':
            return '°C'
          case 'wind':
            return 'm/s'
          case 'pressure':
            return 'hPa'
          default: break
        }
      case 'imperial':
        switch (type) {
          case 'temp':
            return '°F'
          case 'wind':
            return 'mph'
          case 'pressure':
            return 'in'
          default: break
        }
      default: break
    }
  }

  return (
    <WeatherContext.Provider value={{location, setLocation, weather, setWeather, favs, setFavs, gps, setGps, fetching, setFetching, share,
      getGpsLocation, getLocationByCity, getWeather, unit, changeUnit, getUnit}}>
      {children}
    </WeatherContext.Provider>
  );
};

export const FunctionalProvider = ({ children }) => {
  const [isAuto, setIsAuto] = useState()
  const [isDarkMode, setIsDarkMode] = useState(false);
  const {t, i18n} = useTranslation(); 
  const [lang, setLang] = useState ({auto: false, lang: null}); 

  useEffect(() => {
    const init = async () => {
      //set theme
      let theme = await AsyncStorage.getItem('theme')

      if (!theme) {
        AsyncStorage.setItem('theme', 'auto')
        theme = 'auto'
      }
  
      if (theme === 'auto') {
        setIsAuto(true)
        if (getAutoTheme() === 'light') setIsDarkMode(false)
        else setIsDarkMode(true)
      }
  
      if (theme === 'light') setIsDarkMode(false)
      else setIsDarkMode(true)

      setIsDarkMode(true)

      //set language
      let lang = await AsyncStorage.getItem('lang')
      let auto = false

      if (lang == 'auto') {
        auto = true
        lang = Localization.getLocales()[0].languageCode
      }

      i18n.changeLanguage(lang)
      setLang({auto, lang})
    }

    init()
  }, []);

  useEffect(() => {
    let subscription = null 

    if (isAuto) {
      subscription = Appearance.addChangeListener(({ colorScheme }) => {
        if (colorScheme === 'light') setIsDarkMode(false)
        else setIsDarkMode(true)
      });
    }

    return () => subscription?.remove();
  }, [isAuto]);

  const getAutoTheme = () => {
    return Appearance.getColorScheme() 
  }

  const changeTheme = async (theme) => {
    if (theme === 'auto') {
      setIsAuto(true)
      if (Appearance.getColorScheme() === 'light') setIsDarkMode(false)
      else setIsDarkMode(true)
    }

    if (theme === 'light') setIsDarkMode(false)
    else setIsDarkMode(true)
  
    await AsyncStorage.setItem('theme', theme)
  };

  const changeLanguage = (lang)=> { 
    i18n 
      .changeLanguage(lang.lang) 
      .then(() => AsyncStorage.setItem('lang', (lang.auto) ? 'auto' : lang.lang))
      .then(() => setLang(lang)) 
      .catch(err => console.log(err)); 
  }; 

  const translateText = async ({src, dest, text}) => {
    const res = await fetch("https://libretranslate.com/translate", {
      method: "POST",
      body: JSON.stringify({
        q: text,
        source: (src) ? src : 'auto',
        target: dest,
        format: "text",
        api_key: ""
      }),
      headers: { "Content-Type": "application/json" }
    });

    return await res.json()
  }

  const getAutoLang = () => {
    return { auto: true, lang: Localization.getLocales()[0].languageCode}
  }

  const parsedLang = (lang) => {
    if (lang == 'vn') return 'vi'
    return lang
  }

  return (
    <FunctionalContext.Provider value={{ isDarkMode, isAuto, setIsAuto, setIsDarkMode, getAutoTheme, changeTheme, lang, setLang, t, i18n, changeLanguage, getAutoLang,
      parsedLang }}>
      {children}
    </FunctionalContext.Provider>
  );
};