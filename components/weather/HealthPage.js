import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ActivityIndicator, Pressable, ScrollView } from 'react-native';
import { MaterialCommunityIcons, FontAwesome6} from '@expo/vector-icons';

import { lightStyles, darkStyles } from '../defaultStyles';
import { FunctionalContext, WeatherContext } from '../Context';

const HealthPage = ({ navigation }) => {    
    const goBack = navigation?.canGoBack()
    const { isDarkMode, t } = useContext(FunctionalContext);
    const { health, getIndexColor, getPollen, location } = useContext(WeatherContext)

    const polLevel = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'];
    const thresholds = {
        SO2: [20, 80, 250, 350],
        NO2: [40, 70, 150, 200],
        PM10: [20, 50, 100, 200],
        PM25: [10, 25, 50, 75],
        O3: [60, 100, 140, 180],
        CO: [4400, 9400, 12400, 15400]
    };
    
    const color = ['#84CF33', '#009E3A', '#FFFF00', '#FF8C00', '#FF0000']

    function polQuality(pollutant, value) {
        const threshold = (pollutant == 'PM2.5') ? thresholds['PM25'] : thresholds[pollutant];

        for (let i = 0; i < 4; i++) {
            if (value >= threshold[i]) {
                return i + 2;
            }
        }

        return 1; // Default to "Good" if value is below all thresholds
    }

    const getUnit = (units) => {
        if (units === 'PARTS_PER_BILLION') return 'ppb'
        return 'µg/m³'
    }

    return (
        <ScrollView 
            style={[styles.container, isDarkMode && styles.darkContainer]}
        >
            <View style={[{flexDirection: 'row', alignItems: 'center', paddingBottom: 10, borderBottomColor: 'grey', borderBottomWidth: 0.5}, !isDarkMode && {backgroundColor: 'white'}]}>
                {
                    // goBack &&
                    <MaterialCommunityIcons 
                        name="arrow-left" size={24} color={isDarkMode ? "white" : "black"}
                        style={{margin: -3, padding: -3, marginRight: 15, paddingLeft: 20}}
                        onPress={() => {navigation.goBack()}}
                    />
                }
                <Text style={[{fontSize: 18, fontWeight: 'bold'}, isDarkMode && { color: 'white' }]}>{t('health.title')}</Text>
            </View>
                {/* F6F5F2 */}
            <View style={[{paddingTop: 10}]}>
                <View style={[styles.secondaryInfoContainer, { backgroundColor: '#F5F5F5'}, isDarkMode && { backgroundColor: '#1E1E1E', borderColor: 'grey', borderWidth: 1 }]}>
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
                        <View style={{alignItems: 'center', justifyContent: 'center'}}>
                            <Text style={[{fontSize: 16, fontWeight: 'bold'}, isDarkMode && {color: 'white'}]}>{t('health.notfound') + ' ' + location.city}</Text>
                        </View>
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
                            <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                <Text style={[{fontSize: 16, fontWeight: 'bold'}, isDarkMode && {color: 'white'}]}>{t('health.notfound') + ' ' + location.city}</Text>
                            </View>
                        }
                        
                    </View>
                </View>
            </View>
            </View>
            <ScrollView style={[styles.secondaryInfoContainer, {paddingHorizontal: 20, height: '1000', backgroundColor: '#F5F5F5'}, isDarkMode && { backgroundColor: '#1E1E1E', borderWidth: 1, borderColor: 'grey'}]}>
                <Text style={{color: isDarkMode ? 'white' : 'black', paddingVertical: 20}}>POLLUTANTS</Text>
                {
                    health?.pollutants ? 
                    <View style={{flexDirection: 'row', paddingBottom: 10}}>
                        <View
                            style={{borderRightWidth: 0.5, borderRightColor: 'grey', flex: 1}}
                        >
                            {
                                health?.pollutants?.slice(0, 3).map((pol, index) => {
                                    return <View key={index} style={{flexDirection: 'row', justifyContent: 'space-between', paddingBottom: (index == 2) ? 10 : 25}}>
                                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                            <MaterialCommunityIcons name='circle' color={color[polQuality(pol.displayName, pol.concentration.value)]}></MaterialCommunityIcons>
                                            <View style={{paddingLeft: 10}}>
                                                <Text style={{color: isDarkMode ? 'white' : 'black'}}>{pol.displayName}</Text>
                                                <Text style={{color: 'grey'}}>{polLevel[polQuality(pol.displayName, pol.concentration.value)]}</Text>
                                            </View>
                                        </View>     
                                        <View style={{alignItems: 'flex-end', paddingRight: 25}}>
                                            <Text style={{color: isDarkMode ? 'white' : 'black'}}>{Math.round(pol.concentration.value)}</Text>
                                            <Text style={{color: 'grey'}}>{getUnit(pol.concentration.units)}</Text>
                                        </View>                           
                                    </View>
                                })
                            }
                        </View>
                        <View style={{flex: 1}}>
                            {
                                health?.pollutants?.slice(3, 6).map((pol, index) => {
                                    return <View key={index} style={{flexDirection: 'row', justifyContent: 'space-between', paddingBottom: (index == 2) ? 10 : 25}}>
                                        <View style={{flexDirection: 'row', alignItems: 'center', paddingLeft: 15}}>
                                            <MaterialCommunityIcons name='circle' color={color[polQuality(pol.displayName, pol.concentration.value)]}></MaterialCommunityIcons>
                                            <View style={{paddingLeft: 10}}>
                                                <Text style={{color: isDarkMode ? 'white' : 'black'}}>{pol.displayName}</Text>
                                                <Text style={{color: 'grey'}}>{polLevel[polQuality(pol.displayName, pol.concentration.value)]}</Text>
                                            </View>
                                        </View>     
                                        <View style={{alignItems: 'flex-end'}}>
                                            <Text style={{color: isDarkMode ? 'white' : 'black'}}>{Math.round(pol.concentration.value)}</Text>
                                            <Text style={{color: 'grey'}}>{getUnit(pol.concentration.units)}</Text>
                                        </View>                           
                                    </View>
                                })
                            }
                        </View>
                    </View> :
                    <View style={{alignItems: 'center', justifyContent: 'center', marginBottom: 20}}>
                        <Text style={[{fontSize: 16, fontWeight: 'bold'}, isDarkMode && {color: 'white'}]}>{t('health.notfound') + ' ' + location.city}</Text>
                    </View>
                }
            </ScrollView>
        </ScrollView>
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
    container: {
        flex: 1,
        paddingTop: 40,
        backgroundColor: lightStyles.bgColor
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
    green: {
        backgroundColor: '#84CF33',
    },
    darkGreen: {
        backgroundColor: '#009E3A',
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

export default HealthPage;
