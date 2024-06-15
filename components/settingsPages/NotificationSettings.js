import { useContext, useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import Checkbox from 'expo-checkbox'
import { lightStyles, darkStyles } from '../defaultStyles';
import { FunctionalContext, WeatherContext } from "../Context";
import { getWeather, getLocationByCity, getStoredLocation, sendDailyNotification, sendLiveNotification, notificationMessageTranslator } from '../Context';
import AsyncStorage from '@react-native-async-storage/async-storage'
import DatePicker from 'react-native-date-picker'
import { useFocusEffect } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import * as Localization from'expo-localization'

const DAILY = 'daily-notification'
const LIVE = 'live-notification'

TaskManager.defineTask(DAILY, async () => {
    console.log("DAILY NOTIFICATION")
    let targetTime = await AsyncStorage.getItem('dailyTarget')
    if (!targetTime) targetTime = '06:00'
    const timeDifference = timeUntil(targetTime)
    if (timeDifference.hours != 0) return
    if (timeDifference.minutes > 10) return

    let lang = await AsyncStorage.getItem('lang') 
    if (!lang || lang == 'auto') lang = Localization.getLocales()[0].languageCode

    const notificationList = await Notifications.getPresentedNotificationsAsync()
    notificationList.forEach((async (notif) => {
        console.log(notif)
        if (notif.request.content.title.startsWith(notificationMessageTranslator('daily', lang, 'title'))) {
            await Notifications.dismissNotificationAsync(notif.request.identifier)
        }
    }))

    let location = await getStoredLocation('notification')
    let weather = null 

    if (!location.lat) location = await getLocationByCity(location.city)
    if (location) weather = await getWeather({location})
    if (location && weather) sendDailyNotification(location, weather)


    return BackgroundFetch.BackgroundFetchResult.NewData;
});

TaskManager.defineTask(LIVE, async () => {
    console.log("LIVE NOTIFICATION")
    let lang = await AsyncStorage.getItem('lang') 
    if (!lang || lang == 'auto') lang = Localization.getLocales()[0].languageCode

    const notificationList = await Notifications.getPresentedNotificationsAsync()
    notificationList.forEach((async (notif) => {
        if (notif.request.content.title.startsWith(notificationMessageTranslator('live', lang, 'title'))) {
            await Notifications.dismissNotificationAsync(notif.request.identifier)
        }
    }))
    
    let location = await getStoredLocation('notification')
    let weather = null 

    if (!location.lat) location = await getLocationByCity(location.city)
    if (location) weather = await getWeather({location})
    if (location && weather) sendLiveNotification(location, weather)

    return BackgroundFetch.BackgroundFetchResult.NewData;
});

async function registerBackgroundFetchAsync(TASK) {
    return BackgroundFetch.registerTaskAsync(TASK, {
        minimumInterval: 1, 
        stopOnTerminate: false,
        startOnBoot: true,
    });
}

async function unregisterBackgroundFetchAsync(TASK) {
    return BackgroundFetch.unregisterTaskAsync(TASK);
}

const NotificationSettings = ({ navigation }) => {    
    const goBack = navigation?.canGoBack()
    const { isDarkMode, lang, t } = useContext(FunctionalContext)
    const { location } = useContext(WeatherContext)
    const [dailyRegisterd, setDailyRegistered] = useState(false)
    const [liveRegisterd, setLiveRegistered] = useState(false)
    const [targetTime, setTargetTime] = useState(new Date())
    const [isDateModalOpen, setIsDateModalOpen] = useState(false)
    const [notificationLocation, setNotificationLocation] = useState() 

    useFocusEffect(
        useCallback(() => {
            const getLocation = async () => {
                const storedLocation = await getStoredLocation('notification')
                if (storedLocation && Object.keys(storedLocation).length !== 0) setNotificationLocation(storedLocation)
                else {
                    await AsyncStorage.setItem('notificationLocation', JSON.stringify(location))
                    setNotificationLocation(location)
                }
            }

            getLocation()
        }, [])
    )

    const textToTime = (text) => {
        let target = new Date()
        const [targetHours, targetMinutes] = text.split(':').map(Number)
        target.setHours(targetHours , targetMinutes, 0, 0)
        if (new Date() > target) target.setDate(target.getDate() + 1)
        return target
    }

    const timeToText = (time) => {
        if (!time) return '00:00'
        const hours = time.getHours().toString().padStart(2, '0')
        const minutes = time.getMinutes().toString().padStart(2, '0')
        return `${hours}:${minutes}`
    }

    useEffect(() => {
        const init = async () => {
            const storedDaily = JSON.parse(await AsyncStorage.getItem('dailyRegistered'))
            if (storedDaily) setDailyRegistered(true)
            const storedLive = JSON.parse(await AsyncStorage.getItem('liveRegistered'))
            if (storedLive) setLiveRegistered(true)
            let target = await AsyncStorage.getItem('dailyTarget')
            if (target) setTargetTime(textToTime(target))
            else setTargetTime(textToTime('06:00'))
        }

        init()
    }, [])

    return (
        <View style={[styles.container, isDarkMode && styles.darkContainer]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingBottom: 10, borderBottomColor: 'grey', borderBottomWidth: 0.5 }}>
                {goBack &&
                    <MaterialCommunityIcons 
                        name="arrow-left" size={24} color={isDarkMode ? "white" : "black"}
                        style={{ margin: -3, padding: -3, marginRight: 15, paddingLeft: 20 }}
                        onPress={() => { navigation.goBack() }}
                    />
                }
                <Text style={{ color: isDarkMode ? 'white' : 'black', fontSize: 18, fontWeight: 'bold' }}>{t('notification.title')}</Text>
            </View>
            <View>
                <TouchableOpacity>
                    <View style={{ borderBottomColor: 'grey', borderBottomWidth: 0.2, paddingVertical: 20, marginHorizontal: 30, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{color: isDarkMode ? 'white' : 'black', fontSize: 15}}>{t('notification.daily')}</Text>
                        <Checkbox color='dodgerblue' value={dailyRegisterd} onValueChange={async () => {
                            if (!dailyRegisterd) {
                                sendDailyNotification(notificationLocation, await getWeather({location: await getLocationByCity(notificationLocation.city)}))
                                registerBackgroundFetchAsync(DAILY)
                            } else unregisterBackgroundFetchAsync(DAILY)

                            setDailyRegistered(!dailyRegisterd)
                            AsyncStorage.setItem('dailyRegistered', JSON.stringify(!dailyRegisterd))
                        }}></Checkbox>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity>
                    <View style={{ borderBottomColor: 'grey', borderBottomWidth: 0.2, paddingVertical: 20, marginHorizontal: 30, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{color: isDarkMode ? 'white' : 'black', fontSize: 15}}>{t('notification.live')}</Text>
                        <Checkbox color='dodgerblue' value={liveRegisterd} onValueChange={async () => {
                            if (!liveRegisterd) {
                                sendLiveNotification(notificationLocation, await getWeather({location: await getLocationByCity(notificationLocation.city)}))
                                registerBackgroundFetchAsync(LIVE)
                            } else unregisterBackgroundFetchAsync(LIVE)

                            setLiveRegistered(!liveRegisterd)
                            AsyncStorage.setItem('liveRegistered', JSON.stringify(!liveRegisterd))
                        }}></Checkbox>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity>
                    <View style={{ borderBottomColor: 'grey', borderBottomWidth: 0.2, paddingVertical: 20, marginHorizontal: 30, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{color: isDarkMode ? 'white' : 'black', fontSize: 15}}>{t('notification.location')}</Text>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={{fontWeight: 'bold', color: isDarkMode ? 'white' : 'black', fontSize: 15}}>{notificationLocation?.city}</Text>
                            <TouchableOpacity onPress={() => {
                                navigation.navigate('Search', { forNotification: true })
                            }}>
                                <MaterialCommunityIcons name='chevron-right' color={isDarkMode ? 'white' : 'black'} size={20} style={{marginLeft: 3}}></MaterialCommunityIcons>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity>
                    <View style={{ borderBottomColor: 'grey', borderBottomWidth: 0.2, paddingVertical: 20, marginHorizontal: 30, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{color: isDarkMode ? 'white' : 'black', fontSize: 15}}>{t('notification.time')}</Text>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                           <Text style={{fontWeight: 'bold', color: isDarkMode ? 'white' : 'black', fontSize: 15}}>{timeToText(targetTime)}</Text>
                           <TouchableOpacity onPress={() => setIsDateModalOpen(true)}>
                            <MaterialCommunityIcons name='chevron-right' color={isDarkMode ? 'white' : 'black'} size={20} style={{marginLeft: 3}}></MaterialCommunityIcons>
                           </TouchableOpacity>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
            <DatePicker date={targetTime} mode='time' modal={true} open={isDateModalOpen} title={null} dividerColor='dodgerblue'
                onConfirm={async (date) => {
                    const hours = date.getHours().toString().padStart(2, '0');
                    const minutes = date.getMinutes().toString().padStart(2, '0');
                    AsyncStorage.setItem('dailyTarget', `${hours}:${minutes}`)
                    setTargetTime(textToTime(`${hours}:${minutes}`))
                    setIsDateModalOpen(false)
                }}
            ></DatePicker>
        </View>
    );
};

function timeUntil(targetTime) {
    const [targetHours, targetMinutes] = targetTime.split(':').map(Number)
    const now = (new Date())
    
    let target = new Date()
    target.setHours(targetHours , targetMinutes, 0, 0);
    
    if (now >= target) {
        target.setDate(target.getDate() + 1);
    }
    
    const timeDifference = target - now;
    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

    return { hours, minutes, milli: timeDifference };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 40,
        backgroundColor: lightStyles.bgColor,
    },
    darkContainer: {
        backgroundColor: darkStyles.bgColor
    }
});

export default NotificationSettings;
