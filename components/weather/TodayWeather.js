import { StyleSheet, View, ScrollView, Text, TouchableOpacity } from "react-native";
import { useContext  } from "react";
import { MaterialCommunityIcons} from '@expo/vector-icons';

import CurrentWeather from "./CurrentWeather";
import Health from "../ui/Health";
import { FunctionalContext, WeatherContext } from "../Context";
import ForecastInterface from "../ui/ForecastInterface";
import PrecipInterface from "../ui/PrecipInterface";
import Sunrise from "../ui/Sunrise";

export default TodayWeather = ({setCurrentSection, navigation}) => {
    const { weather } = useContext(WeatherContext)
    const { t, isDarkMode } = useContext(FunctionalContext)

    return (
        <>
            {weather && 
            <ScrollView>
                <CurrentWeather currentWeather={weather} timezone={weather?.timezone} />
                <ForecastInterface setCurrentSection={setCurrentSection}/>
                <PrecipInterface setCurrentSection={setCurrentSection}></PrecipInterface>
                <View contentContainerStyle={{ flexGrow: 1 }} style={{ flex: 1 }}>
                </View>
                <Health navigation={navigation}></Health>
                <View style={{width: '100%', marginBottom: 20}}>
                    <View style={{marginTop: 20, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Text style={[{marginHorizontal: 20, fontSize: 20, fontWeight: 'bold'}, {color: 'white'}]}>{t('sun.title')}</Text>
                    <TouchableOpacity 
                        style={{marginRight: 12, flexDirection: 'row', alignItems: 'center'}}
                        onPress={() => setCurrentSection(4)}    
                    >
                        <Text style={{color: (isDarkMode) ? 'dodgerblue' : '#2D5DA1', fontWeight: 'bold'}}>{t('health.viewmore')}</Text>
                        <MaterialCommunityIcons name={'chevron-right'} color={(isDarkMode) ? 'dodgerblue' : '#2D5DA1'} size={20} style={{paddingTop: 3}}/>
                    </TouchableOpacity>
                    </View>
                    <Sunrise></Sunrise>
                </View>
            </ScrollView>}          
            {!weather && <View style={styles.noWeather}><Text style={{color: 'white', textAlign: 'center'}}>No Weather to Show</Text></View>}
        </>
    )
}

const styles = StyleSheet.create({
    noWeather: {
        flexGrow: 1
    }, 
    futureForecastContainer: {
        alignItems: 'center',
        justifyContent: 'center'
    }
})
