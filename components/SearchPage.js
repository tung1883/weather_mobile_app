import React, { useContext, useEffect, useState } from 'react';
import { View, TextInput, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions, Pressable, Modal, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location'
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { useRoute } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';

import { cities, popularCities } from '../assets/citiList';
import { lightStyles, darkStyles } from './defaultStyles';
import { FunctionalContext, WeatherContext } from './Context';
import { addCounter, putToFrontFavs } from '../functionalities/favoriteLocations';
import { widgetLocationUpdate } from './widgets/widgetTaskHandler';

const screenWidth = Dimensions.get('window').width;

const SearchPage = ({navigation}) => {
    const route = useRoute()
    let forWidget, forNotification
    if (route?.params) {
        forWidget = route?.params?.forWidget
        forNotification = route?.params?.forNotification
    }
    
    const goBack = navigation?.canGoBack()
    const { isDarkMode, t} = useContext(FunctionalContext);
    let { setLocation, gps, setGps, getGpsLocation, getLocationDetails, getLocationByCity, getWeather, 
        location, favs, setFavs, setWeather } = useContext(WeatherContext)
    const [searchQuery, setSearchQuery] = useState('');
    const [mapSearchQuery, setMapSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState(popularCities);
    const [listTitle, setListTitle] = useState(t('searchPage.popularSuggestion'))
    const [isFetching, setIsFetching] = useState(false) //to render pop-up while waiting for search page AND main page to fetch data
    const [mapCoordinate, setMapCoordinate] = useState({latitude: 9.5, longitude: 10.23})
    const [markerCoordinate, setMarkerCoordinate] = useState({latitude: 10, longitude: 10}) //used for marker in map feature
    const [openMap, setOpenMap] = useState(false)
    const [mapFetching, setMapFetching] = useState(false)

    useEffect(() => {
        if (location) {
            setMapCoordinate({latitude: location.lat - 0.5, longitude: location.long + 0.23})
            setMarkerCoordinate({latitude: location.lat, longitude: location.long})
            return
        }

        if (gps?.location?.lat) {
            setMapCoordinate({latitude: gps.location.lat - 0.5, longitude: gps.location.long + 0.23})
            setMarkerCoordinate({latitude: gps.location.lat, longitude: gps.location.long})
            return
        }

        if (favs && favs.length > 0) {
            setMapCoordinate({latitude: favs[0].location.lat - 0.5, longitude: favs[0].location.long + 0.23})
            setMarkerCoordinate({latitude: favs[0].location.lat, longitude: favs[0].location.long})
        } 
    }, [])

    const requestLocationPermission = async () => {
        try {
            if (isFetching) return
            const { status } = await Location.requestForegroundPermissionsAsync();
            
            if (status === 'granted') {
                setIsFetching(true) 

                if (gps?.location) {
                    if (forWidget) {
                        await AsyncStorage.setItem('widgetLocation', JSON.stringify(gps.location))
                        await widgetLocationUpdate()
                        return navigation?.goBack()
                    }

                    if (forNotification) {
                        await AsyncStorage.setItem('notificationLocation', JSON.stringify(gps.location))
                        return navigation?.goBack()
                    }

                    setLocation(gps.location)
                    setWeather(gps.weather)
                    putToFrontFavs({favs, setFavs, fav: {...gps, gps: true}})
                    setIsFetching(false)
                    return navigation.replace('Main')
                }

                const location = await getGpsLocation()
                if (location) {
                    if (forWidget) {
                        await AsyncStorage.setItem('widgetLocation', JSON.stringify(gps.location))
                        await widgetLocationUpdate()
                        return navigation?.goBack()
                    }

                    if (forNotification) {
                        await AsyncStorage.setItem('notificationLocation', JSON.stringify(gps.location))
                        return navigation?.goBack()
                    }

                    const weather = await getWeather({location})
                    setLocation(location)
                    setWeather(weather)
                    setGps({location, weather})
                    putToFrontFavs({favs, setFavs, fav: {location, weather, gps: true}})
                    setIsFetching(false)
                    return navigation.replace('Main')
                }

                setIsFetching(false)
            }
        } catch (error) {
            console.error('Error requesting location permission: ', error);
        }
    };

    const handleSearch = (text) => {
        setSearchQuery(text);

        if (text === '') {
            setListTitle(t('searchPage.popularSuggestion'))
            return setSuggestions(popularCities)
        }

        setListTitle('SUGGESTIONS')
        // Filter cities based on the search query
        const filteredCities = cities.filter(city =>
            city.toLowerCase().startsWith(text.toLowerCase())
        );
        setSuggestions(filteredCities);
    };

    const clearSearch = () => {
        setSearchQuery('');
        setListTitle(t('searchPage.popularSuggestion'))
        setSuggestions(popularCities)
    };

    const enterSearch = async () => {
        if (isFetching) return
      
        getLocationByCity(searchQuery)
        .then(async (result) => {
            if (!result) return setIsFetching(false)

            if (forWidget) {
                await AsyncStorage.setItem('widgetLocation', JSON.stringify(result))
                await widgetLocationUpdate()
                return navigation?.goBack()
            }

            if (forNotification) {
                await AsyncStorage.setItem('notificationLocation', JSON.stringify(result))
                return navigation?.goBack()
            }

            setIsFetching(true)
            const weather = await getWeather({location: result})
            setLocation(result)
            setWeather(weather)
            addCounter({location: result, favs, setFavs})
            putToFrontFavs({favs, setFavs, fav: {location: result, weather}})
            setIsFetching(false)
            navigation.replace('Main')
        })
    }

    const renderItem = ({ item, index }) => {
        itemContainerStyle = styles.itemContainer
        if (index === suggestions.length - 1) {
            itemContainerStyle = {...itemContainerStyle, ...styles.lastItemContainer}
        }

        return (
            <TouchableOpacity style={[itemContainerStyle, isDarkMode && styles.darkItemContainer]} activeOpacity={1}
                onPress={async () => {
                    if (isFetching) return 
                    setIsFetching(true)
                    
                    const location = await getLocationByCity(item)
                    if (!location) return setIsFetching(false)

                    if (forWidget) {
                        await AsyncStorage.setItem('widgetLocation', JSON.stringify(location))
                        await widgetLocationUpdate()
                        return navigation?.goBack()
                    }

                    if (forNotification) {
                        await AsyncStorage.setItem('notificationLocation', JSON.stringify(location))
                        return navigation?.goBack()
                    }

                    const weather = await getWeather({location})
                    setLocation(location)
                    setWeather(weather)
                    addCounter({location, favs, setFavs})
                    putToFrontFavs({favs, setFavs, fav: {location, weather}})
                    setIsFetching(false)
                    navigation.replace('Main');
                }}
            >
                <Text style={[styles.item, isDarkMode && styles.darkItem]}>{item}</Text>
                <MaterialCommunityIcons name="navigation-variant" size={20} color={isDarkMode ? "white" : "black"} style={{margin: -3, padding: -3, marginRight: 5}}/>
            </TouchableOpacity>
        )
    };

    return (
        <>
            {
                openMap ?
                <>
                    <Pressable 
                        style={{
                            position: 'absolute', top: 30, left: (screenWidth - 350) / 2, zIndex: 100, width: 350,
                            flexDirection: 'row', alignItems: 'center'
                        }}
                    >
                        <View style={[styles.searchBar]}>
                            <MaterialCommunityIcons name="magnify" size={24} color={"black"} style={{marginLeft: 10}} />
                            <TextInput
                                style={styles.input}
                                placeholder={t('searchPage.mapPlaceholder')}
                                value={mapSearchQuery}
                                onChangeText={(text) => setMapSearchQuery(text)}
                                onSubmitEditing={async () => {
                                    if (mapSearchQuery[0] === '{') return 
                                    const result = await getLocationByCity(mapSearchQuery)
                                    if (!result || !result.lat || !result.long) return

                                    const coord = { latitude: result.lat, longitude: result.long }
                                    setMapCoordinate({
                                        latitude: coord.latitude - 0.5, 
                                        longitude: coord.longitude + 0.3
                                    })
                                    setMarkerCoordinate(coord)
                                }}
                                placeholderTextColor='black'
                            />
                            {searchQuery.length > 0 && (
                                <MaterialCommunityIcons name="close" size={20} color="black" 
                                    style={{marginRight: 10}} onPress={setMapSearchQuery('')} />
                            )}
                        </View>
                        <MaterialCommunityIcons name="check" size={24} color="black" style={{marginLeft: 5, marginRight: 5, display: mapFetching ? 'none' : 'flex'}} 
                            onPress={async () => { 
                                if (!markerCoordinate) return
                                setMapFetching(true)
                                const { city }= await getLocationDetails({lat: markerCoordinate.latitude, long: markerCoordinate.longitude})
                                if (!city) return setMapFetching(false)

                                getLocationByCity(city)
                                .then(async (result) => {
                                    if (!result) return setMapFetching(false)

                                    if (forWidget) {
                                        await AsyncStorage.setItem('widgetLocation', JSON.stringify(result))
                                        await widgetLocationUpdate()
                                        return navigation?.goBack()
                                    }

                                    if (forNotification) {
                                        await AsyncStorage.setItem('notificationLocation', JSON.stringify(result))
                                        return navigation?.goBack()
                                    }

                                    setMapFetching(true)
                                    const weather = await getWeather({location: result})
                                    setLocation(result)
                                    setWeather(weather)
                                    addCounter({location: result, favs, setFavs})
                                    putToFrontFavs({favs, setFavs, fav: {location: result, weather}})
                                    setMapFetching(false)
                                    navigation.replace('Main')
                                })
                            }}
                        />
                        {mapFetching && <ActivityIndicator color='black' size={24} style={{marginLeft: 5, marginRight: 5}}></ActivityIndicator>}
                        <MaterialCommunityIcons 
                            name="close" size={24} color="black"
                            onPress={() => {setOpenMap(false)}}
                        />
                    </Pressable>
                    <MapView
                        provider={PROVIDER_GOOGLE}
                        userInterfaceStyle={isDarkMode ? 'dark' : 'light'}
                        style={{width: '200%', height: '200%'}}
                        rotateEnabled={false}
                        showsCompass={false}
                        onPress={(e) => {
                            setMapSearchQuery(`{${e.nativeEvent.coordinate.latitude.toFixed(1)}, ${e.nativeEvent.coordinate.longitude.toFixed(1)}}`)
                            setMarkerCoordinate(e.nativeEvent.coordinate)
                        }}
                        region={{
                            ...mapCoordinate,
                            latitudeDelta: 0.5,
                            longitudeDelta: 1,
                        }}
                    >
                        {
                            markerCoordinate &&
                            <Marker
                                coordinate={markerCoordinate}
                                image={require('../assets/map_marker.png')}
                            />
                        }
                    </MapView>
                </> :
                <View style={[styles.container, isDarkMode && styles.darkContainer]}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        {
                            goBack &&
                            <MaterialCommunityIcons 
                                name="arrow-left" size={24} color={isDarkMode ? "white" : "black"}
                                style={{margin: -3, padding: -3, marginRight: 15}}
                                onPress={() => {navigation?.goBack()}}
                            />
                        }
                        <View style={[styles.searchBar, isDarkMode && styles.darkSearchBar]}>
                            <MaterialCommunityIcons name="magnify" size={24} color={isDarkMode ? "white" : "black"} style={{marginLeft: 10}} />
                            <TextInput
                                style={styles.input}
                                placeholder={t('searchPage.placeholder')}
                                value={searchQuery}
                                onChangeText={handleSearch}
                                onSubmitEditing={enterSearch}
                                placeholderTextColor={isDarkMode ? 'white' : 'black'}
                            />
                            {searchQuery.length > 0 && (
                                <MaterialCommunityIcons name="close" size={20} color={isDarkMode ? "white" : "black"} 
                                    style={{marginRight: 10}} onPress={clearSearch} />
                            )}
                            {searchQuery.length === 0 && (
                                <MaterialCommunityIcons name="map-marker" size={20} color={isDarkMode ? "white" : "black"} 
                                    style={{marginRight: 10}} onPress={() => setOpenMap(true)} />
                            )}
                        </View>
                    </View>
                    <TouchableOpacity   
                        onPress={requestLocationPermission}
                        style={[styles.button, isDarkMode && styles.darkButton]}
                    >
                        <MaterialCommunityIcons name="navigation-variant" size={20} color="white" style={{margin: -3, padding: -3, marginRight: 5}}/>
                        <Text style={styles.buttonText}>{t('searchPage.currentLocation')}</Text>
                    </TouchableOpacity>
                    <Text style={[{marginTop: 20, marginBottom: 5, fontSize: 16, fontWeight: 'bold', color: 'black'}, isDarkMode && { color: 'white' }]}>{listTitle}</Text>
                    <FlatList
                        data={suggestions}
                        renderItem={({item, index}) => renderItem({ item, index })}
                        keyExtractor={(item) => item}
                        style={styles.list}
                        />
                    <Modal visible={isFetching} transparent animationType="fade">
                        <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <ActivityIndicator size="large" color="black" />
                            <Text style={styles.loadingText}>{t('searchPage.fetch')}</Text>
                        </View>
                    </View>
                </Modal>

            </View>
            }
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
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

export default SearchPage;
