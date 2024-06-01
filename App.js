import React, { useEffect, useState, useRef } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pressable, Text, Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

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
import LocationAdd from './components/settingsPages/LocationAdd';
import Indicator from './components/ui/Indicator';
import HealthPage from './components/weather/HealthPage';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function sendPushNotification(expoPushToken) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'Original Title',
    body: 'And here is the body!',
    data: { someData: 'goes here' },
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

function handleRegistrationError(errorMessage) {
  alert(errorMessage);
  throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    console.group('jehre1')
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status: existingStatus } =
    await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    handleRegistrationError('Permission not granted to get push token for push notification!');
    return;
  }
  const projectId =
    Constants?.expoConfig?.extra?.eas?.projectId ??
    Constants?.easConfig?.projectId;
  if (!projectId) {
    handleRegistrationError('Project ID not found');
  }
  try {
    const pushTokenString = (
      await Notifications.getExpoPushTokenAsync({
        projectId,
      })
    ).data;
    console.log(pushTokenString);
    return pushTokenString;
  } catch (e) {
    console.log('error')
    handleRegistrationError(`${e}`);
  }
}

const Stack = createStackNavigator();

const App = () => {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(undefined);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => {
        console.log(token)
        setExpoPushToken(token ?? '')
      })
      .catch((error) => setExpoPushToken(`${error}`));

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current,
        );
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  useEffect(() => {
    (async () => {
      //check if the user uses the app for the first time
      AsyncStorage.removeItem('notFirstTime') //uncomment this to be first time user
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
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Search">
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
            <Stack.Screen name='LanguageUnits' options={{headerShown: false}}>{(navigation) => <LanguageUnitsPage {...navigation}></LanguageUnitsPage>}</Stack.Screen>
            <Stack.Screen name='Language' options={{headerShown: false}}>{(navigation) => <Language {...navigation}></Language>}</Stack.Screen>
            <Stack.Screen name='PushNotification' options={{headerShown: false}}>{(navigation) => <PushNotification {...navigation}></PushNotification>}</Stack.Screen>
          </Stack.Navigator>
        </NavigationContainer>
      </WeatherProvider>
    </FunctionalProvider>
  );
};

export default App;
