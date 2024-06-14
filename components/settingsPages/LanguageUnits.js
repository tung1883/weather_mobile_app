import React, { useContext, useEffect, useState } from 'react';
import Checkbox from 'expo-checkbox'
import { View, Text, StyleSheet, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { lightStyles, darkStyles } from '../defaultStyles';
import { FunctionalContext, WeatherContext } from '../Context';
import { langs } from '../../functionalities/language/langs';
import { widgetLocationUpdate } from '../widgets/widgetTaskHandler';

const LanguageUnitsPage = ({ navigation }) => {    
    const goBack = navigation?.canGoBack()
    const { isDarkMode, lang, t } = useContext(FunctionalContext)
    const { unit, changeUnit, fetching, setFetching } = useContext(WeatherContext)
    const [selected, setSelected] = useState(unit)

    const units = [
        {name: "standard", title: t('languageAndUnitsPage.standard'), details: t('languageAndUnitsPage.standardDetails')}, 
        {name: "metric", title: t('languageAndUnitsPage.metric'), details: t('languageAndUnitsPage.metricDetails')}, 
        {name: "imperial", title: t('languageAndUnitsPage.imperial'), details: t('languageAndUnitsPage.imperialDetails')}
    ]
    
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
                <Text style={[{fontSize: 18, fontWeight: 'bold'}, isDarkMode && {color: 'white'}]}>{t('languageAndUnitsPage.title')}</Text>
            </View>
            
            <View>
                <TouchableOpacity 
                    onPress={() => navigation.navigate('Language')}
                    style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 20, marginHorizontal: 20}}>
                    <View>
                        <Text style={[{fontSize: 16}, isDarkMode && {color: 'white'}]}>{t('languageAndUnitsPage.item1')}</Text>
                        <Text style={{color: 'white', fontSize: 14, color: 'grey', paddingTop: 8, paddingBottom: 12}}>{lang.auto ? t('map.auto') : t('map.' + lang.lang)}</Text>
                    </View>
                    <MaterialCommunityIcons name='chevron-right' size={18} color={isDarkMode ? 'white' : 'black'}></MaterialCommunityIcons>
                </TouchableOpacity>
            </View>

            <View style={{backgroundColor: isDarkMode ? "#31363F" : '#DDDDDD'}}>
                <Text style={[{padding: 15, paddingLeft: 20, fontSize: 16, fontWeight: 'bold'}, isDarkMode && {color: 'white'}]}>{t('languageAndUnitsPage.units')}</Text>
            </View>
            
            {
                units.map((u, index) => {
                    return (
                        <View 
                            key={index}
                            style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 20,
                                borderBottomColor: 'grey', borderBottomWidth: 0.5, 
                                marginHorizontal: 20}}>
                            <View>
                                <Text style={[{fontSize: 16}, isDarkMode && {color: 'white'}]}>{u.title}</Text>
                                <Text style={{color: 'white', fontSize: 14, color: 'grey', paddingTop: 8, paddingBottom: 12}}>{u.details}</Text>
                            </View>
                            <Checkbox color='dodgerblue' value={u.name === selected} onValueChange={async () => {
                                setFetching(true)
                                setSelected(u.name)
                                await changeUnit({newU: u.name})
                                await widgetLocationUpdate()
                            }}></Checkbox>
                        </View>
                    )
                })
            }
            
            <Modal visible={fetching} transparent animationType="fade">
                <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <ActivityIndicator size="large" color="black" />
                    <Text style={styles.loadingText}>{t('searchPage.fetch')}</Text>
                </View>
                </View>
            </Modal>
        </View>
    );
};

export const Language = ({navigation}) => {
    const goBack = navigation?.canGoBack()
    const { isDarkMode, lang, t, changeLanguage, getAutoLang } = useContext(FunctionalContext)
    const { fetching, setFetching } = useContext(WeatherContext)
    const [selected, setSelected] = useState((lang.auto) ? 'auto' : lang.lang)
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        if ((!lang.auto && selected !== lang.lang) || (lang.auto && selected !== 'auto')) {
            setIsSaving(true)
        } else setIsSaving(false)
    }, [lang, selected])

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
                    <Text style={[{fontSize: 18, fontWeight: 'bold'}, isDarkMode && {color: 'white'}]}>{t('languagePage.title')}</Text>
                </View>
                { isSaving && 
                    <TouchableOpacity
                        onPress={async () => {
                            setFetching(true)
                            setIsSaving(false)
                            if (selected === 'auto') await changeLanguage(getAutoLang())
                            else await changeLanguage({auto: false, lang: selected})
                            await widgetLocationUpdate()
                        }}
                    >
                        <Text style={[{fontSize: 18, paddingRight: 20}, isDarkMode && {color: 'white'}]}>{t('languagePage.saveBtn')}</Text>
                    </TouchableOpacity>
                }
            </View>
            {
                langs.map((item, index) => {
                    return (
                        <TouchableOpacity 
                            key={index} onPress={() => { setSelected(item) }}
                            style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', 
                                paddingVertical: 20, borderBottomColor: 'grey', borderBottomWidth: 0.5, marginHorizontal: 20}}>
                            <View>
                                <Text style={[{fontSize: 16}, isDarkMode && {color: 'white'}]}>{t('map.' + item)}</Text>
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
