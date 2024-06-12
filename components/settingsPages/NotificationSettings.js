import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { lightStyles, darkStyles } from '../defaultStyles';
import { FunctionalContext, WeatherContext } from "../Context";

async function sendPushNotification(expoPushToken, weatherData, location) {
    const weatherIcon = `☀️`;  
    const degreeSymbol = '°';
    const currentTime = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}); // Lấy giờ hiện tại
    const updateTime = ` ${currentTime} ⟳`;
    const weatherDescription = weatherData.current.weather[0].description.charAt(0).toUpperCase() + weatherData.current.weather[0].description.slice(1);
    const viewDailyText = 'View Daily';
    const spaces = ' '.repeat(23);
    const spaces1 = ' '.repeat(32);
    
    const message = {
        to: expoPushToken,
        sound: 'default',
        title: `${Math.round(weatherData.current.temp)}${degreeSymbol} ${location.city} ${spaces1}${updateTime} `,
        body: ` ${weatherIcon} ${weatherDescription} ${spaces}${viewDailyText}`,
        data: {
            someData: 'goes here',
        
        },
    };

    // Gửi thông báo bằng cách sử dụng dịch vụ thông báo của bạn

    try {
        const response = await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        });

        const result = await response.json();
        if (!response.ok) {
            console.log('Failed to send push notification', result);
        } else {
            console.log('Push notification sent successfully', result);
        }
    } catch (error) {
        console.error('Error sending push notification', error);
    }
}
const NotificationSettings = ({ navigation }) => {    
    const goBack = navigation?.canGoBack();
    const { isDarkMode } = useContext(FunctionalContext);
    const [isFetching, setIsFetching] = useState(false); // to render pop-up while waiting for search page AND main page to fetch data
    const { location, weather } = useContext(WeatherContext);

    const handleSendNotification = async () => {
        if (weather && location) {
            await sendPushNotification('ExponentPushToken[x0Rgn_Ozz8h3tonrGkwKZ-]', weather, location);
        } else {
            console.log('Weather data or location is missing');
        }
    };

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
                <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Notifications</Text>
            </View>
            <View>
                <TouchableOpacity onPress={handleSendNotification}>
                    <View style={{ borderBottomColor: 'grey', borderBottomWidth: 0.2, paddingVertical: 20, marginHorizontal: 30 }}>
                        <Text style={{ color: 'white', fontSize: 15 }}>Push Notifications</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
};



const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 40,
        backgroundColor: lightStyles.bgColor,
    },
    darkContainer: {
        backgroundColor: darkStyles.bgColor
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 10,
        backgroundColor: lightStyles.secondaryBgColor,
    },
    darkSearchBar: {
        borderColor: 'black',
        backgroundColor: darkStyles.secondaryBgColor,
    },
    input: {
        flex: 1,
        height: 40,
        marginLeft: 10,
        marginTop: 5,
        marginBottom: 5,
        fontSize: 16,
        color: lightStyles.contentColor
    },
    darkInput: {
        color: darkStyles.contentColor
    },
    list: {
        width: '100%',
    },
    item: {
        padding: 15,
        paddingLeft: 0,
        marginLeft: 5,
        fontSize: 14,
        color: 'black',
    },
    darkItem: {
        color: 'white'
    },
    itemContainer: {
        flexDirection: 'row',
        borderBottomWidth: 0.5,
        borderBottomColor: '#444444',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    darkItemContainer: {
        borderBottomColor: '#ccc',
    },
    lastItemContainer: {
        borderBottomWidth: 0
    },
    button: {
        backgroundColor: '#085db4',
        paddingVertical: 15,
        paddingHorizontal: 20,
        paddingLeft: 10,
        borderRadius: 10, // Set corner radius to 10
        minWidth: 200,
        marginBottom: 10, 
        marginTop: 30,
        flexDirection: 'row',
        alignItems: 'center'
    },
    darkButton: {
        backgroundColor: '#6495ED', 
    },
    buttonText: {
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
    },
});

export default NotificationSettings;
