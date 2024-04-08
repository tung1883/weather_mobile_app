import { StyleSheet, View, ScrollView, Text } from "react-native";
import { useContext, useEffect  } from "react";

import CurrentForecast from "./CurrentForecast";
import DailyForecast from "./DailyForecast";
import Health from "../ui/Health";
import { WeatherContext } from "../Context";
import ForecastInterface from "../ui/ForecastInterface";
import PrecipInterface from "../ui/PrecipInterface";

export default TodayWeather = ({setCurrentSection}) => {
    const { weather } = useContext(WeatherContext)

    return (
        <>
            {weather && 
            <ScrollView>
                <CurrentForecast currentWeather={weather} timezone={weather?.timezone} />
                <ForecastInterface setCurrentSection={setCurrentSection}/>
                <PrecipInterface setCurrentSection={setCurrentSection}></PrecipInterface>
                <View contentContainerStyle={{ flexGrow: 1 }} style={{ flex: 1 }}>
                </View>
                <Health></Health>
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
