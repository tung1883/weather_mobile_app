import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, FontAwesome6} from '@expo/vector-icons';

import { FunctionalContext, WeatherContext } from "../Context";
import config from "../../config";

export default Health = () => {
    const { isDarkMode, t, lang, parsedLang } = useContext(FunctionalContext)
    const { location } = useContext(WeatherContext)
    const [health, setHealth] = useState(null)

    useEffect(() => {
        healthFetch()
    }, [lang, location])

    const getIndexColor = (index) => {
        switch (true) {
            case index <= 50: return '#83A95C'
            case index <= 100: return '#3E7C17'
            case index <= 150: return '#125C13'
            case index <= 200: return '#DC6B19'
            case index <= 300: return '#B80000'
            case index > 300: return '#820300'
            default: return (isDarkMode ? 'white' : 'black')
        }
    }

    const getPollen = (type) => {
        if (!health || health?.pollen?.length == 0) return t('health.none')

        if (type == 'grass') return health.pollen.filter((pollen) => pollen.code == 'GRASS')[0].info
        if (type == 'weed') return health.pollen.filter((pollen) => pollen.code == 'WEED')[0].info
        if (type == 'tree') return health.pollen.filter((pollen) => pollen.code == 'TREE')[0].info
    }

    const healthFetch = async () => {
        if (!location || !lang) return

        let temp = null

        fetch(`https://airquality.googleapis.com/v1/currentConditions:lookup?key=${config.GOOGLE_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }, 
            body: JSON.stringify({
                "universalAqi": true,
                "location": {
                    "latitude": location.lat,
                    "longitude": location.long
                },
                "extraComputations": [
                    "HEALTH_RECOMMENDATIONS"
                ],
                "languageCode": parsedLang(lang.lang)
            })
        }).then((res) => {
            return res.json()
        }).then((data) => {
            if (!data) return

            temp = {
                index: data.indexes[0].aqi,
                quality: data.indexes[0].category,
                rec: data.healthRecommendations.generalPopulation,
                pollen: []
            }
        }).then(() => {
            return fetch(`https://pollen.googleapis.com/v1/forecast:lookup?key=${config.GOOGLE_KEY}&location.longitude=${location.long}&location.latitude=${location.lat}&languageCode=${parsedLang(lang.lang)}&days=1`)
        }).then((res) => {
            return res.json()
        }).then((data) => {
            if (!data?.error) {
                pollenList = data.dailyInfo[0].pollenTypeInfo.filter((pollen) => pollen.code == 'GRASS' || pollen.code == 'WEED' || pollen.code == 'TREE')
                temp.pollen = pollenList.map((pollen) => { return { code: pollen.code, info: (pollen?.indexInfo?.category) ? pollen?.indexInfo?.category : t('health.none')} })
            }

            setHealth(temp)
        }).catch((err) => {
            console.log("healthFetchError: " + err)
        })
    }

    return (
        <View style={styles.currentView}>
            <View style={{marginTop: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <Text style={[{marginHorizontal: 20, fontSize: 20, fontWeight: 'bold'}, isDarkMode && {color: 'white'}]}>{t('health.title')}</Text>
                <TouchableOpacity 
                    style={{marginRight: 12, flexDirection: 'row', alignItems: 'center'}}
                    onPress={() => {
                        console.log("View more health details")
                    }}    
                >
                    <Text style={{color: (isDarkMode) ? 'dodgerblue' : '#2D5DA1', fontWeight: 'bold'}}>View more</Text>
                    <MaterialCommunityIcons name={'chevron-right'} color={(isDarkMode) ? 'dodgerblue' : '#2D5DA1'} size={20} style={{paddingTop: 3}}></MaterialCommunityIcons>
                </TouchableOpacity>
            </View>
            <View style={[styles.secondaryInfoContainer, isDarkMode && { backgroundColor: '#1E1E1E', borderColor: 'grey', borderWidth: 1 }]}>
                <View style={{marginHorizontal: 10, borderBottomWidth: 1, borderBottomColor: 'grey'}}>
                    <Text style={[{fontSize: 14, paddingTop: 15, paddingBottom: 10, paddingHorizontal: 10}, isDarkMode && {color: 'white'}]}>{t('health.air')}</Text>
                    {
                        health ? 
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>  
                            <Text style={[{fontSize: 30, minWidth: 95, paddingVertical: 15, paddingHorizontal: 30, color: getIndexColor(health?.index)}]}>
                                {health?.index}
                            </Text>
                            <View style={{width: '80%'}}>
                                <Text style={[{fontSize: 15, fontWeight: 'bold', paddingLeft: 10}, isDarkMode && {color: 'white'}]}>{health.quality}</Text>
                                <Text style={[{fontSize: 13, paddingLeft: 10, paddingRight: 50, textAlign: 'justify', flexWrap: 'wrap'}, isDarkMode && {color: 'white'}]}>{health.rec}</Text>
                            </View>
                        </View> :
                        <View style={{alignItems: 'center', justifyContent: 'center'}}><Text style={[{fontSize: 16, fontWeight: 'bold'}, isDarkMode && {color: 'white'}]}>{t('health.notfound')}</Text></View>
                    }
                    <GradientBar></GradientBar>
                </View>
                <View style={{marginHorizontal: 10}}>
                    <Text style={[{fontSize: 14, paddingTop: 15, paddingBottom: 10, paddingHorizontal: 10}, isDarkMode && {color: 'white'}]}>{t('health.allergy')}</Text>
                    <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingBottom: 20}}>
                        {
                            health?.pollen?.length !== 0 ? 
                            <>
                                <View style={{paddingHorizontal: 20, minWidth: 20, justifyContent: 'center', alignItems: 'center'}}>
                                    <MaterialCommunityIcons name='grass'  style={{paddingBottom: 10}} size={20} color='#84CF33'/>
                                    <Text style={[isDarkMode && {color: 'white', fontWeight: 'bold'}]}>{t('health.grass')}</Text>
                                    <Text style={[isDarkMode && {color: '#84CF33'}]}>{getPollen('grass')}</Text>
                                </View>
                                <View style={{paddingHorizontal: 20,  minWidth: 20, justifyContent: 'center', alignItems: 'center'}}>
                                    <FontAwesome6 name='wheat-awn'  style={{paddingBottom: 10}} size={20} color='#FFD700'/>
                                    <Text style={[isDarkMode && {color: 'white', fontWeight: 'bold'}]}>{t('health.weed')}</Text>
                                    <Text style={[isDarkMode && {color: '#84CF33'}]}>{getPollen('weed')}</Text>
                                </View>
                                <View style={{paddingHorizontal: 20, minWidth: 20, justifyContent: 'center', alignItems: 'center'}}>
                                    <MaterialCommunityIcons name='pine-tree' style={{paddingBottom: 10}} size={20} color='#228B22'/>
                                    <Text style={[isDarkMode && {color: 'white', fontWeight: 'bold'}]}>{t('health.tree')}</Text>
                                    <Text style={[isDarkMode && {color: '#84CF33'}]}>{getPollen('grass')}</Text>
                                </View>
                            </> :
                            <View style={{alignItems: 'center', justifyContent: 'center'}}><Text style={[{fontSize: 16, fontWeight: 'bold'}, isDarkMode && {color: 'white'}]}>{t('health.notfound')}</Text></View>
                        }
                        
                    </View>
                </View>
            </View>
        </View>
    );
};

const GradientBar = () => {
    const { isDarkMode, t } = useContext(FunctionalContext)

    return (
        <View style={styles.gradientBar}>
            <View style={[styles.barSection, styles.red]}>
                <Text style={[{position: 'relative', top: -20, fontSize: 12, height: 15}, isDarkMode && {color: 'white'}]}>0</Text>
                <Text style={[{position: 'relative', bottom: 6, fontSize: 12, height: 15}, isDarkMode && {color: 'white'}]}>{t('health.hazardous')}</Text>
            </View>
            <View style={[styles.barSection, styles.orange]}>
                <Text style={[{position: 'relative', top: -20, fontSize: 12, height: 15}, isDarkMode && {color: 'white'}]}>20</Text>
            </View>
            <View style={[styles.barSection, styles.yellow]}>
                <Text style={[{position: 'relative', top: -20, fontSize: 12, height: 15}, isDarkMode && {color: 'white'}]}>40</Text>
                <Text style={[{position: 'relative', bottom: 6, left: -10, width: 100, fontSize: 12, height: 15}, isDarkMode && {color: 'white'}]}>{t('health.moderate')}</Text>
            </View>
            <View style={[styles.barSection, styles.darkGreen]}>
                <Text style={[{position: 'relative', top: -20, fontSize: 12, height: 15}, isDarkMode && {color: 'white'}]}>60</Text>
            </View>
            <View style={[styles.barSection, styles.green, {flex: 1/2}]}>
                <Text style={[{position: 'relative', top: -20, fontSize: 12, height: 15}, isDarkMode && {color: 'white'}]}>80</Text>
            </View>
            <View style={[styles.barSection, styles.green, {alignItems: 'flex-end', flex: 1/2, borderTopRightRadius: 20, borderBottomRightRadius: 20,}]}>
                <Text style={[{position: 'relative', top: -20, fontSize: 12, height: 15}, isDarkMode && {color: 'white'}]}>100</Text>
                <Text style={[{position: 'relative', bottom: 6, fontSize: 12, height: 15}, isDarkMode && {color: 'white'}]}>{t('health.good')}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    gradientBar: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '100%',
        padding: 10,
        paddingVertical: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    barSection: {
        flex: 1,
        height: 5,
        fontSize: 12,
    },
    darkGreen: {
        backgroundColor: '#009E3A',
    },
    green: {
        backgroundColor: '#84CF33',
    },
    yellow: {
        backgroundColor: '#FFFF00', 
    },
    orange: {
        backgroundColor: '#FF8C00', 
        },
    red: {
        backgroundColor: '#FF0000', 
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
    },
    currentView: {
        width: '100%',
    },
    secondaryInfoContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 20,
        display: 'flex',
        margin: 10,
        marginHorizontal: 10,
        width: '95%',
        maxWidth: 478,
    }
});
