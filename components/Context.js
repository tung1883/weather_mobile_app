import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import { Appearance, Share } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location'
import { useTranslation } from 'react-i18next';
import * as Localization from 'expo-localization'
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import i18n from '../functionalities/language/i18n';
import config from '../config'
import { use } from 'i18next';

export const FunctionalContext = createContext();
export const WeatherContext = createContext()
export const NotificationContext = createContext()

export const WeatherProvider = ({ children }) => {
  const { lang, parsedLang, t, isDarkMode } = useContext(FunctionalContext)
  const [location, setLocation] = useState({});
  const [weather, setWeather] = useState({})
  const [gps, setGps] = useState({})
  const [favs, setFavs] = useState([])
  const [fetching, setFetching] = useState(false)
  const [unit, setUnit] = useState()
  const [health, setHealth] = useState(null)

  useEffect(() => {
    if (!lang.lang) return
    init()
  }, [unit, lang])


  const init = async () => {
    try {
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
      
      favs?.forEach(async (fav, index) => {
        if (!fav?.location?.city) {
          favs.splice(index, 1)
        }
  
        if (!fav?.weather) {
          const weather = await getWeather({location: fav.location})
          fav.weather = weather
        }
        
        if (index == favs.length - 1) setFavs([...favs])
      })
  
      healthFetch({location, weather})
      setFetching(false)
    } catch (err) {
      console.log('init Error: ' + err)
    }
  }

  const getWeather = async ({location}) => {
    if (!location) return null

    return fetch(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${location.lat}&lon=${location.long}&exclude=minutely&units=${unit}&lang=${parsedLang(lang.lang)}&appid=${config.API_KEY}`
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
  }

  const share = async ({text}) => {
    try {
      await Share.share({ message: text });
    } catch (error) {
      console.log(error)
    }
  };

  const changeUnit = async ({newU}) => {
    if (newU == unit) return
    setUnit(newU)
    await AsyncStorage.setItem('unit', newU)
  }

  //health functionalities
    const getIndexColor = (index) => {
      switch (true) {
          case index <= 50: return '#83A95C'
          case index <= 100: return '#3E7C17'
          case index <= 150: return '#125C13'
          case index <= 200: return '#DC6B19'
          case index <= 300: return '#B80000'
          case index > 300: return '#820300'
          default: return (isDarkMode ? 'white' : 'black')
      }
    }

    const getPollen = (type) => {
        if (!health || health?.pollen?.length == 0) return t('health.none')

        if (type == 'grass') return health.pollen.filter((pollen) => pollen.code == 'GRASS')[0].info
        if (type == 'weed') return health.pollen.filter((pollen) => pollen.code == 'WEED')[0].info
        if (type == 'tree') return health.pollen.filter((pollen) => pollen.code == 'TREE')[0].info
    }

    const healthFetch = async ({location, weather}) => {
        if (!location || !lang) return

        let temp = null

        fetch(`https://airquality.googleapis.com/v1/currentConditions:lookup?key=${config.GOOGLE_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }, 
            body: JSON.stringify({
                "universalAqi": true,
                "location": {
                    "latitude": location.lat,
                    "longitude": location.long
                },
                "extraComputations": [
                    "HEALTH_RECOMMENDATIONS",
                    "POLLUTANT_CONCENTRATION",
                ],
                "languageCode": parsedLang(lang.lang)
            })
        }).then((res) => {
            return res.json()
        }).then((data) => {
            if (!data) return

            temp = {
                index: data.indexes[0].aqi,
                quality: data.indexes[0].category,
                rec: data.healthRecommendations.generalPopulation,
                pollen: [],
                pollutants: data.pollutants
            }
        }).then(() => {
            return fetch(`https://pollen.googleapis.com/v1/forecast:lookup?key=${config.GOOGLE_KEY}&location.longitude=${location.long}&location.latitude=${location.lat}&languageCode=${parsedLang(lang.lang)}&days=1`)
        }).then((res) => {
            return res.json()
        }).then((data) => {
            if (!data?.error) {
              pollenList = data.dailyInfo[0].pollenTypeInfo.filter((pollen) => pollen.code == 'GRASS' || pollen.code == 'WEED' || pollen.code == 'TREE')
              temp.pollen = pollenList.map((pollen) => { return { code: pollen.code, info: (pollen?.indexInfo?.category) ? pollen?.indexInfo?.category : t('health.none')} })
            }

            setHealth(temp)
        }).catch((err) => {
            console.log("healthFetchError: " + err)
        })
    }

  return (
    <WeatherContext.Provider value={{location, setLocation, weather, setWeather, favs, setFavs, gps, setGps, fetching, setFetching, share, init,
      getGpsLocation, getLocationByCity, getWeather, unit, changeUnit, getUnit, health, getIndexColor, getPollen, getLocationDetails
    }}>
      {children}
    </WeatherContext.Provider>
  );
};

export const FunctionalProvider = ({ children }) => {
  const [isAuto, setIsAuto] = useState()
  const [isDarkMode, setIsDarkMode] = useState(null);
  const { t } = useTranslation(); 
  const [lang, setLang] = useState ({auto: false, lang: null})

  useEffect(() => {
    const init = async () => {
      //set theme
      let theme = await AsyncStorage.getItem('theme')

      if (!theme) {
        await AsyncStorage.setItem('theme', 'auto')
      }
  
      if (theme === 'auto') {
        setIsAuto(true)
        if (getAutoTheme() === 'light') {
          setIsDarkMode(false)
        }
        else setIsDarkMode(true)
      } else {
        if (theme == 'light') setIsDarkMode(false)
        else setIsDarkMode(true)
      }
  
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

  const getAutoLang = () => {
    return { auto: true, lang: Localization.getLocales()[0].languageCode}
  }

  return (
    <FunctionalContext.Provider value={{ isDarkMode, isAuto, setIsAuto, setIsDarkMode, getAutoTheme, changeTheme, lang, setLang, t, 
      changeLanguage, getAutoLang, parsedLang }}>
      {children}
    </FunctionalContext.Provider>
  );
};

export const NotificationProvider = ({ children }) => {
  const notificationListener = useRef()
  
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  })

  useEffect(() => {
    registerForPushNotificationsAsync()
    .then(async (token) => {
      await AsyncStorage.setItem('pushToken', token)
    })
    .catch((error) => setExpoPushToken(`${error}`))

    notificationListener.current = Notifications.addNotificationReceivedListener(async (notification) => {
      let lang = await AsyncStorage.getItem('lang') 
      if (!lang || lang == 'auto') lang = Localization.getLocales()[0].languageCode

      if (notification?.request?.content.title?.startsWith(notificationMessageTranslator('daily', lang, 'title'))) {
        await AsyncStorage.setItem('dailyNotification', notification.request.identifier)
      }

      if (notification?.request?.content.title?.startsWith(notificationMessageTranslator('live', lang, 'title'))) {
        await AsyncStorage.setItem('liveNotification', notification.request.identifier)
      }
    });

    return () => notificationListener.current && Notifications.removeNotificationSubscription(notificationListener.current)
  }, []);

  async function registerForPushNotificationsAsync() {
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    const { status } = await Notifications.getPermissionsAsync()
    if (status !== 'granted') await Notifications.requestPermissionsAsync()
    
    const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId
    if (!projectId) console.log('Project ID not found')

    try { return (await Notifications.getExpoPushTokenAsync({ projectId })).data } 
    catch (e) { console.log('error')}
  }

  return (
    <NotificationContext.Provider value={{ }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const getGpsLocation = async () => {
  try {
    const { status } = await Location.getForegroundPermissionsAsync();

    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return null;
    }

    const { latitude: lat, longitude: long } = (await Location.getCurrentPositionAsync({})).coords
    const {city, country} = await getLocationDetails({lat, long})
    await AsyncStorage.setItem('currentLocation', JSON.stringify({city, country}))
    return { lat, long, city, country }
  } catch (error) {
    console.error('Error getting location:', error);
    return null
  }
}

export const getLocationByCity = async (city) => {
  try {
    const response = await fetch(
      `http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${config.API_KEY}`
    );
    const data = await response.json();
    if (!data?.coord?.lat) {
      console.log('getLocationByCity Error')
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

const parsedLang = (lang) => {
  if (lang == 'vn') return 'vi'
  return lang
}

export const getLocationDetails = async ({lat, long}) => {
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

export const getWeather = async ({location}) => {
  if (!location) return null
  
  let unit = await AsyncStorage.getItem('unit')
  if (!unit) unit = 'metric'
  let lang = await AsyncStorage.getItem('lang') 
  if (!lang || lang == 'auto') lang = Localization.getLocales()[0].languageCode
 
  return fetch(
    `https://api.openweathermap.org/data/3.0/onecall?lat=${location.lat}&lon=${location.long}&exclude=minutely&units=${unit}&lang=${parsedLang(lang)}&appid=${config.API_KEY}`
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
}

export const getUnit = (type, unit) => {
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

export const getStoredLocation = async (feature) => {
  try {
      let storedLocation = null
      if (feature == 'notification') {
        storedLocation =  JSON.parse(await AsyncStorage.getItem(feature + 'Location'))
        if (storedLocation) return storedLocation
      }

      if (feature == 'widget') {
        storedLocation =  JSON.parse(await AsyncStorage.getItem(feature + 'Location'))
        if (storedLocation) return storedLocation
      }

      const currentLocation = JSON.parse(await AsyncStorage.getItem('currentLocation'))
      if (currentLocation) return currentLocation

      const favs = JSON.parse(await AsyncStorage.getItem('favoriteLocations'))
      if (favs.length == 0) return null

      return favs[0].location
    } catch (error) {
      console.error('Error getting location:', error);
      const favs = JSON.parse(await AsyncStorage.getItem('favoriteLocations'))
      if (favs.length == 0) return null

      return favs[0].location
    }
}

export async function sendDailyNotification(location, weather) {
  const expoPushToken = await AsyncStorage.getItem('pushToken')
  if (!expoPushToken) return 

  const oldIdentifier = await AsyncStorage.getItem('dailyNotification')
  if (oldIdentifier) {
    try { await Notifications.dismissNotificationAsync(oldIdentifier) }
    catch (err) { console.log(err) }
  }

  let unit = await AsyncStorage.getItem('unit')
  if (!unit) unit = 'metric'
  let lang = await AsyncStorage.getItem('lang') 
  if (!lang || lang == 'auto') lang = Localization.getLocales()[0].languageCode

  const weatherDescription = `☁️ ${weather.current.weather[0].description.charAt(0).toUpperCase() + weather.current.weather[0].description.slice(1)} | `
    + `${notificationMessageTranslator('daily', lang, 'feels')}${Math.round(weather.current.feels_like)}${getUnit('temp', unit)}`
  
  try {
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: expoPushToken,
        sound: 'default',
        title: `${notificationMessageTranslator('daily', lang, 'title')}${Math.round(weather.current.temp)}${getUnit('temp', unit)} - ${location.city}`,
        body: `⏰${notificationMessageTranslator('daily', lang, 'time')}${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}\n${weatherDescription}`,
      }),
    });

    const result = await response.json();

    if (!response.ok) console.error('Failed to send daily notification', result)
  } catch (error) {
    console.error('Error sending daily notification', error);
  }
}

export async function sendLiveNotification(location, weather) {
  const expoPushToken = await AsyncStorage.getItem('pushToken')
  if (!expoPushToken) return 

  const oldIdentifier = await AsyncStorage.getItem('liveNotification')
  if (oldIdentifier) {
    try { await Notifications.dismissNotificationAsync(oldIdentifier) }
    catch (err) { console.log(err) }
  }
  
  let unit = await AsyncStorage.getItem('unit')
  if (!unit) unit = 'metric'
  let lang = await AsyncStorage.getItem('lang') 
  if (!lang || lang == 'auto') lang = Localization.getLocales()[0].languageCode

  const weatherDescription = `☁️ ${weather.current.weather[0].description.charAt(0).toUpperCase() + weather.current.weather[0].description.slice(1)} | `
    + `${notificationMessageTranslator('live', lang, 'feels')}${Math.round(weather.current.feels_like)}${getUnit('temp', unit)}`
  
  try {
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: expoPushToken,
        sound: 'default',
        title: `${notificationMessageTranslator('live', lang, 'title')}${Math.round(weather.current.temp)}${getUnit('temp', unit)} - ${location.city}`,
        body: `⏰${notificationMessageTranslator('live', lang, 'time')}${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}\n${weatherDescription}`,
      }),
    });

    const result = await response.json();

    if (!response.ok) console.error('Failed to send live notification', result)
  } catch (error) {
    console.error('Error sending live notification', error);
  }
}

export const notificationMessageTranslator = (type, lang, text) => {
  if (type == 'live') {
      switch (text) {
        case 'title':
          if (lang == 'en') return 'Live Weather: '
          if (lang == 'vn') return 'Hiện tại: '
        case 'feels':
          if (lang == 'en') return 'Feels like '
          if (lang == 'vn') return 'Cảm giác như '
        case 'time':
          if (lang == 'en') return 'Time: '
          if (lang == 'vn') return 'Thời gian: '
      }
  }

  if (type == 'daily') {
      switch (text) {
        case 'title':
          if (lang == 'en') return 'Today: '
          if (lang == 'vn') return 'Hôm nay: '
        case 'feels':
          if (lang == 'en') return 'Feels like '
          if (lang == 'vn') return 'Cảm giác như '
        case 'time':
          if (lang == 'en') return 'Time: '
          if (lang == 'vn') return 'Thời gian: '
      }
  }
}