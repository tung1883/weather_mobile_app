import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location'

import { lightStyles, darkStyles } from '../defaultStyles';
import { FunctionalContext, WeatherContext } from '../Context';
import Checkbox from 'expo-checkbox';
import { putToFrontFavs, removeLocation } from '../../functionalities/favoriteLocations';

const LocationSettings = ({ navigation }) => {    
    const goBack = navigation?.canGoBack()
    const { isDarkMode, t } = useContext(FunctionalContext);
    const { location, favs, setFavs, setGps, getGpsLocation, getWeather, gps } = useContext(WeatherContext)
    const [checked, setChecked ] = useState(gps != null)
    const [isFetching, setIsFetching] = useState(false)

    return (
        <>
            <View 
                style={[styles.container, isDarkMode && styles.darkContainer]}
            >
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 10, borderBottomColor: 'grey', borderBottomWidth: 0.5}}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        {
                            goBack &&
                            <MaterialCommunityIcons 
                                name="arrow-left" size={24} color={isDarkMode ? "white" : "black"}
                                style={{margin: -3, padding: -3, marginRight: 15, paddingLeft: 20}}
                                onPress={() => {navigation.goBack()}}
                            />
                        }
                        <Text style={[{fontSize: 18, fontWeight: 'bold'}, isDarkMode && { color: 'white' }]}>{t('locationSettings.title')}</Text>
                    </View>
                    <TouchableOpacity style={{paddingRight: 20}}
                        onPress={() => {navigation.navigate('LocationAdd')}}
                    >
                        <MaterialCommunityIcons name='plus' size={22} color={(isDarkMode) ? 'white' : 'black'}></MaterialCommunityIcons>
                    </TouchableOpacity>
                </View>

                <View>
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 20,
                        borderBottomColor: 'grey', borderBottomWidth: 0.5, marginHorizontal: 20}}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <MaterialCommunityIcons name='navigation-variant' color='dodgerblue' size={18} style={{paddingRight: 10}}/>
                            <Text style={[{fontSize: 16, fontWeight: 'bold'}, isDarkMode && { color: 'white' }]}>{t('locationSettings.current')}</Text>
                        </View>
                    <Checkbox 
                        color='dodgerblue'
                        value={checked} 
                        onValueChange={async () => {
                            if (checked) { //turn off gps
                                setGps(null)
                                setFavs(favs.filter((fav) => fav.gps !== true))
                            } else { //turn on gps
                                setIsFetching(true)
                                const { status } = await Location.requestForegroundPermissionsAsync();
            
                                if (status === 'granted') {
                                    const loc = await getGpsLocation()
                                    if (loc) {
                                        const weather = await getWeather({location: loc})
                                        setGps({location: loc, weather})

                                        if (JSON.stringify(location) == JSON.stringify(loc)) {
                                            putToFrontFavs({favs, setFavs, fav: {location: loc, weather, gps: true}})
                                        } else {
                                            setFavs([...favs, {location: loc, weather, gps: true}])
                                        }
                                    }
                                }

                                setIsFetching(false)

                            }
                        setChecked(!checked)
                        }}
                    />
                    </View>
                </View>

                {
                    favs.map((fav, index) => {
                        if (fav.gps) return

                        return (
                            <View key={index}>
                                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 20,
                                    borderBottomColor: 'grey', borderBottomWidth: 0.5, marginHorizontal: 20}}>
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <MaterialCommunityIcons name='map-marker-star' color={isDarkMode ? 'white' : 'black'} size={18} style={{paddingRight: 10}}/>
                                        <Text style={[{fontSize: 16}, isDarkMode && { color: 'white' }]}>{`${fav.location.city}, ${fav.location.country}`}</Text>
                                    </View>
                                <TouchableOpacity onPress={() => {
                                    removeLocation({favs, setFavs, location: fav.location})
                                }}>
                                    <MaterialCommunityIcons name='window-close' size={20} color={(isDarkMode) ? 'white' : 'black'}></MaterialCommunityIcons>
                                </TouchableOpacity>
                                </View>
                            </View>
                        )
                    })
                }
            </View>

            <Modal visible={isFetching} transparent animationType="fade">
                <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <ActivityIndicator size="large" color="black" />
                    <Text style={styles.loadingText}>{t('searchPage.fetch')}</Text>
                </View>
                </View>
            </Modal>
        </>
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
        padding: 30,
        borderRadius: 10
    },
    loadingText: {
        marginTop: 10,
    },
});

export default LocationSettings;
