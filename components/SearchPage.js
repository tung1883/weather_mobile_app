import React, { useContext, useState } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location'

import { cities, popularCities } from '../assets/citiList';
import config from '../config';
import { jsonWriter, loadAllData } from './jsonWriter';
import { lightStyles, darkStyles } from './defaultStyles';
import { ColorContext } from './ColorContext';

const SearchPage = ({navigation, setCity, getLocation,fetchLatLongHandler, addFavoriteLocation, removeFavoriteLocation, addFavoriteLocationCounter }) => {
    const goBack = navigation?.canGoBack()
    const { isDarkMode, toggleTheme } = useContext(ColorContext);
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState(popularCities);
    const [listTitle, setListTitle] = useState("POPULAR CITIES")
    const [isFetching, setIsFetching] = useState(false) //to render pop-up while waiting for search page AND main page to fetch data

    const requestLocationPermission = async () => {
        // try {
        //     if (isFetching) return
        //     const { status } = await Location.requestForegroundPermissionsAsync();
            
        //     if (status === 'granted') {
        //         setIsFetching(true)
        //         await getLocation()
        //         navigateToMainPage()
        //     }
        // } catch (error) {
        //     console.error('Error requesting location permission: ', error);
        // }

        // popularCities.forEach(async (city) => {
        //     fetch(
        //     `http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${config.API_KEY}`
        //     )
        //     .then((response) => response.json())
        //     .then((data) => { console.log(data); return {lat: data.coord.lat, long: data.coord.lon}})
        //     .then(({lat, long}) => {
        //         return fetch(
        //         `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${long}&exclude=hourly,minutely&units=metric&appid=${config.API_KEY}`
        //         )
        //     }) 
        //     .then((res) => {
        //         return res.json()
        //     })
        //     .then((data) => {
        //         jsonWriter(city, data)    
        //     })
        //     .then(() => loadAllData())
        //     .catch((err) => {
        //     console.log("error", err);
        // });
        
        // })
    };

    const navigateToMainPage = () => {
        navigation.replace('Main', {
            onDataFetchComplete: () => setIsFetching(false), 
        });
    };

    const handleSearch = (text) => {
        setSearchQuery(text);

        if (text === '') {
            setListTitle('POPULAR CITIES')
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
        setListTitle('POPULAR CITIES')
        setSuggestions(popularCities)
    };

    const enterSearch = async () => {
        if (isFetching) return
      
        fetchLatLongHandler(searchQuery)
        .then((result) => {
            if (result) {
                setIsFetching(true)
                setCity(searchQuery)
                navigateToMainPage()
            }
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
                    // if (isFetching) return 
                    // setIsFetching(true)
                    // await fetchLatLongHandler(item)
                    // setCity(item)
                    // navigateToMainPage()
                    addFavoriteLocationCounter(item)
                }}
            >
                <Text style={[styles.item, isDarkMode && styles.darkItem]}>{item}</Text>
                <MaterialCommunityIcons name="navigation-variant" size={20} color={isDarkMode ? "white" : "black"} style={{margin: -3, padding: -3, marginRight: 5}}/>
            </TouchableOpacity>
        )
    };

    return (
        <View style={[styles.container, isDarkMode && styles.darkContainer]}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {
                    goBack &&
                    <MaterialCommunityIcons 
                        name="arrow-left" size={24} color={isDarkMode ? "white" : "black"}
                        style={{margin: -3, padding: -3, marginRight: 15}}
                        onPress={() => {navigation.goBack()}}
                    />
                }
                <View style={[styles.searchBar, isDarkMode && styles.darkSearchBar]}>
                    <MaterialCommunityIcons name="magnify" size={24} color={isDarkMode ? "white" : "black"} style={{marginLeft: 10}} />
                    <TextInput
                        style={styles.input}
                        placeholder="Search for a city"
                        value={searchQuery}
                        onChangeText={handleSearch}
                        onSubmitEditing={enterSearch}
                        placeholderTextColor={isDarkMode ? 'white' : 'black'}
                    />
                    {searchQuery.length > 0 && (
                        <MaterialCommunityIcons name="close" size={20} color={isDarkMode ? "white" : "black"} 
                            style={{marginRight: 10}} onPress={clearSearch} />
                    )}
                </View>
            </View>
            <TouchableOpacity   
                onPress={requestLocationPermission}
                style={[styles.button, isDarkMode && styles.darkButton]}
            >
                <MaterialCommunityIcons name="navigation-variant" size={20} color="white" style={{margin: -3, padding: -3, marginRight: 5}}/>
                <Text style={styles.buttonText}>Use Current Location </Text>
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
                    <Text style={styles.loadingText}>Fetching weather data...</Text>
                </View>
                </View>
            </Modal>
        </View>
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
