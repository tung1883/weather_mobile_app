import React, { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, FontAwesome6} from '@expo/vector-icons';

import { FunctionalContext, WeatherContext } from "../Context";

export default Health = ({navigation}) => {
    const { isDarkMode, t } = useContext(FunctionalContext)
    const { location, health, getIndexColor, getPollen } = useContext(WeatherContext)
    
    return (
        <View style={styles.currentView}>
            <View style={{marginTop: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <Text style={[{marginHorizontal: 20, fontSize: 20, fontWeight: 'bold'}, {color: 'white'}]}>{t('health.title')}</Text>
                <TouchableOpacity 
                    style={{marginRight: 12, flexDirection: 'row', alignItems: 'center'}}
                    onPress={() => {
                        navigation.navigate('HealthPage')
                    }}    
                >
                    <Text style={{color: (isDarkMode) ? 'dodgerblue' : '#2D5DA1', fontWeight: 'bold'}}>{t('health.viewmore')}</Text>
                    <MaterialCommunityIcons name={'chevron-right'} color={(isDarkMode) ? 'dodgerblue' : '#2D5DA1'} size={20} style={{paddingTop: 3}}/>
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
