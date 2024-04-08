import { StyleSheet, View, ScrollView, Text } from "react-native";
import { useContext, useEffect  } from "react";

import CurrentForecast from "./CurrentForecast";
import DailyForecast from "./DailyForecast";
import Health from "../ui/Health";
import { WeatherContext } from "../Context";
import ForecastInterface from "../ui/ForecastInterface";
import PrecipInterface from "../ui/PrecipInterface";
import Sunrise from "../ui/Sunrise";

export default Sun = ({setCurrentSection}) => {
    const { weather } = useContext(WeatherContext)

    return (
        <>
            {weather && 
            <ScrollView style={{backgroundColor: 'white'}}>
                <Sunrise></Sunrise>
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
