import React, { useState } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location'
import { cities, popularCities } from '../assets/citiList';

const SearchPage = ({navigation, setCity, getLocation,fetchLatLongHandler}) => {
    const goBack = navigation.canGoBack()
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState(popularCities);
    const [listTitle, setListTitle] = useState("POPULAR CITIES")
    const [isFetching, setIsFetching] = useState(false) //to render pop-up while waiting for search page AND main page to fetch data

    const requestLocationPermission = async () => {
        try {
            if (isFetching) return
            const { status } = await Location.requestForegroundPermissionsAsync();
            
            if (status === 'granted') {
                setIsFetching(true)
                await getLocation()
                navigateToMainPage()
            }
        } catch (error) {
        console.error('Error requesting location permission: ', error);
        }
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
            <TouchableOpacity style={itemContainerStyle} activeOpacity={1}
                onPress={async () => {
                    if (isFetching) return 
                    setIsFetching(true)
                    await fetchLatLongHandler(item)
                    setCity(item)
                    navigateToMainPage()
                }}
            >
                <Text style={styles.item}>{item}</Text>
                <MaterialCommunityIcons name="navigation-variant" size={20} color="white" style={{margin: -3, padding: -3, marginRight: 5}}/>
            </TouchableOpacity>
        )
    };

    return (
        <View style={styles.container}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {
                    goBack &&
                    <MaterialCommunityIcons 
                        name="arrow-left" size={24} color="white" 
                        style={{margin: -3, padding: -3, marginRight: 15}}
                        onPress={() => {navigation.goBack()}}
                    />
                }
                <View style={styles.searchBar}>
                    <MaterialCommunityIcons name="magnify" size={24} color="white" style={{marginLeft: 10}} />
                    <TextInput
                        style={styles.input}
                        placeholder="Search for a city"
                        value={searchQuery}
                        onChangeText={handleSearch}
                        onSubmitEditing={enterSearch}
                        placeholderTextColor={'white'}
                    />
                    {searchQuery.length > 0 && (
                        <MaterialCommunityIcons name="close" size={20} color="white" style={{marginRight: 10}} onPress={clearSearch} />
                    )}
                </View>
            </View>
            <TouchableOpacity   
                onPress={requestLocationPermission}
                style={{...styles.button}}
            >
                <MaterialCommunityIcons name="navigation-variant" size={20} color="white" style={{margin: -3, padding: -3, marginRight: 5}}/>
                <Text style={styles.buttonText}>Use Current Location </Text>
            </TouchableOpacity>
            <Text style={{marginTop: 20, marginBottom: 5, fontSize: 16, fontWeight: 'bold', color: 'white'}}>{listTitle}</Text>
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
        backgroundColor: '#1E1E1E',
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 10,
        backgroundColor: '#696969',
    },
    input: {
        flex: 1,
        height: 40,
        marginLeft: 10,
        marginTop: 5,
        marginBottom: 5,
        fontSize: 16,
        color: 'white'
    },
    list: {
        width: '100%',
    },
    item: {
        padding: 15,
        paddingLeft: 0,
        marginLeft: 5,
        fontSize: 14,
        color: 'white',
    },
    itemContainer: {
        flexDirection: 'row',
        borderBottomWidth: 0.5,
        borderBottomColor: '#ccc',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    lastItemContainer: {
        borderBottomWidth: 0
    },
    button: {
        backgroundColor: '#6495ED',
        paddingVertical: 10,
        paddingHorizontal: 20,
        paddingLeft: 10,
        borderRadius: 10, // Set corner radius to 10
        minWidth: 200,
        marginBottom: 20, 
        marginTop: 30,
        flexDirection: 'row',
        alignItems: 'center'
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
