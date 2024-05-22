import { StyleSheet, View, ScrollView, Text, } from "react-native";
import { useContext  } from "react";
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';

import { FunctionalContext, WeatherContext } from "../Context";

export default Radar = ({setCurrentSection, navigation}) => {
    const { weather } = useContext(WeatherContext)
    const { t, isDarkMode } = useContext(FunctionalContext)

    return (
        <>
            {weather && 
                <View style={{margin: 20, borderRadius: 20}}>
                <MapView
                    provider={PROVIDER_GOOGLE}
                    userInterfaceStyle={isDarkMode ? 'dark' : 'light'}
                    style={{width: '100%', height: '100%'}}
                    mapType='hybrid'
                >
                </MapView>
                </View>
            }          
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
