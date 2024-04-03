import React, { useContext, useEffect, useState } from 'react';
import Checkbox from 'expo-checkbox'

import { View, Button, Text, StyleSheet, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { lightStyles, darkStyles } from '../defaultStyles';
import { FunctionalContext } from '../Context';
import { langs } from '../../functionalities/language/langs';

const LanguageUnitsPage = ({ navigation }) => {    
    const goBack = navigation?.canGoBack()
    const { isDarkMode, toggleTheme, lang, t, getAutoLang } = useContext(FunctionalContext)

    return (
        <View style={[styles.container, isDarkMode && styles.darkContainer]}>
            <View style={{flexDirection: 'row', alignItems: 'center', paddingBottom: 10, borderBottomColor: 'grey', borderBottomWidth: 0.5}}>
                {
                    goBack &&
                    <MaterialCommunityIcons 
                        name="arrow-left" size={24} color={isDarkMode ? "white" : "black"}
                        style={{margin: -3, padding: -3, marginRight: 15, paddingLeft: 20}}
                        onPress={() => {navigation.goBack()}}
                    />
                }
                <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>{t('languageAndUnitsPage.title')}</Text>
            </View>
            <View>
                <TouchableOpacity 
                    onPress={() => navigation.navigate('Language')}
                    style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 20,
                        borderBottomColor: 'grey', borderBottomWidth: 0.5, marginHorizontal: 20}}>
                    <View>
                        <Text style={{color: 'white', fontSize: 16}}>{t('languageAndUnitsPage.item1')}</Text>
                        <Text style={{color: 'white', fontSize: 12, color: 'grey', paddingTop: 8, paddingBottom: 12}}>{lang.auto ? t('map.auto') : t('map.' + lang.lang)}</Text>
                    </View>
                    <MaterialCommunityIcons name='chevron-right' size={18} color='white'></MaterialCommunityIcons>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export const Language = ({navigation}) => {
    const goBack = navigation?.canGoBack()
    const { isDarkMode, lang, t, changeLanguage, getAutoLang } = useContext(FunctionalContext)
    const [selected, setSelected] = useState((lang.auto) ? 'auto' : lang.lang)

    return (
        <View style={[styles.container, isDarkMode && styles.darkContainer]}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', borderBottomColor: 'grey', borderBottomWidth: 0.5}}>
                <View style={{flexDirection: 'row', alignItems: 'center', paddingBottom: 10, borderBottomColor: 'grey', borderBottomWidth: 0.5}}>
                    {goBack &&
                        <MaterialCommunityIcons 
                            name="arrow-left" size={24} color={isDarkMode ? "white" : "black"}
                            style={{margin: -3, padding: -3, marginRight: 15, paddingLeft: 20}}
                            onPress={() => {navigation.goBack()}}
                        />
                    }
                    <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>{t('languagePage.title')}</Text>
                </View>
                { ((lang.auto && selected !== 'auto') || (!lang.auto && selected !== lang.lang)) && 
                    <TouchableOpacity
                        onPress={() => {
                            if (selected == 'auto') changeLanguage(getAutoLang())
                            else changeLanguage({auto: false, lang: selected})
                        }}
                    >
                        <Text style={{color: 'white', fontSize: 18, paddingRight: 20}}>{t('languagePage.saveBtn')}</Text>
                    </TouchableOpacity>
                }
            </View>
            {
                langs.map((item, index) => {
                    return (
                        <TouchableOpacity 
                            key={index} onPress={() => setSelected(item)}
                            style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', 
                                paddingVertical: 20, borderBottomColor: 'grey', borderBottomWidth: 0.5, marginHorizontal: 20}}>
                            <View>
                                <Text style={{color: 'white', fontSize: 16}}>{t('map.' + item)}</Text>
                            </View>
                            <Checkbox color='dodgerblue' value={item === selected } onValueChange={() => {
                                setSelected(item)
                            }}></Checkbox>
                        </TouchableOpacity>
                    )
                })
            }
        </View>
    );

}

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

export default LanguageUnitsPage;
