import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ActivityIndicator, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { lightStyles, darkStyles } from '../defaultStyles';
import { FunctionalContext, WeatherContext } from '../Context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HealthPage = ({ navigation }) => {    
    const goBack = navigation?.canGoBack()
    const { isDarkMode, setIsAuto, getAutoTheme, setIsDarkMode, t } = useContext(FunctionalContext);

    return (
        <View 
            style={[styles.container, isDarkMode && styles.darkContainer]}
        >
            <View style={{flexDirection: 'row', alignItems: 'center', paddingBottom: 10, borderBottomColor: 'grey', borderBottomWidth: 0.5}}>
                {
                    goBack &&
                    <MaterialCommunityIcons 
                        name="arrow-left" size={24} color={isDarkMode ? "white" : "black"}
                        style={{margin: -3, padding: -3, marginRight: 15, paddingLeft: 20}}
                        onPress={() => {navigation.goBack()}}
                    />
                }
                <Text style={[{fontSize: 18, fontWeight: 'bold'}, isDarkMode && { color: 'white' }]}>{t('health.title')}</Text>
            </View>
            <View>
                <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 20,
                    borderBottomColor: 'grey', borderBottomWidth: 0.5, marginHorizontal: 20}}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <MaterialCommunityIcons name='bell' color={isDarkMode ? '#FCDC2A' : '#FFD23F'} size={18} style={{paddingRight: 10}}/>
                        <Text style={[{fontSize: 16}, isDarkMode && { color: 'white' }]}>{t('settings.noti')}</Text>
                    </View>
                    <MaterialCommunityIcons name='chevron-right' size={18} color={(isDarkMode) ? 'white' : 'black'}></MaterialCommunityIcons>
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={() => navigation.navigate('LanguageUnits')}
                    style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 20,
                    borderBottomColor: 'grey', borderBottomWidth: 0.5, marginHorizontal: 20}}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <MaterialCommunityIcons name='earth' color={isDarkMode ? '#9BCF53' : '#87A922'} size={18} style={{paddingRight: 10}}/>
                        <Text style={[{fontSize: 16}, isDarkMode && { color: 'white' }]}>{t('settings.lu')}</Text>
                    </View>
                    <MaterialCommunityIcons name='chevron-right' size={18} color={(isDarkMode) ? 'white' : 'black'}></MaterialCommunityIcons>
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={() => setIsSettingTheme(true)}
                    style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 20,
                    borderBottomColor: 'grey', borderBottomWidth: 0.5, marginHorizontal: 20}}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <MaterialCommunityIcons name='palette' color={!isDarkMode ? '#5D5D5D' : '#B4B4B3'} size={18} style={{paddingRight: 10}}/>
                        <Text style={[{fontSize: 16}, isDarkMode && { color: 'white' }]}>{t('settings.theme')}</Text>
                    </View>
                    <MaterialCommunityIcons name='chevron-right' size={18} color={(isDarkMode) ? 'white' : 'black'}></MaterialCommunityIcons>
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
        padding: 30,
        borderRadius: 10
    },
    loadingText: {
        marginTop: 10,
    },
});

export default HealthPage;
