import { StyleSheet, View, ScrollView, Text } from "react-native";
import { useEffect  } from "react";
import CurrentForecast from "./CurrentForecast";
import DailyForecast from "./DailyForecast";
import Health from "../ui/Health";

export default TodayWeather = ({weather}) => {
    return (
        <>
            {weather && 
            <ScrollView>
                <CurrentForecast currentWeather={weather} timezone={weather?.timezone} />
                <View contentContainerStyle={{ flexGrow: 1 }} style={{ flex: 1 }}>
                    <View style={styles.futureForecastContainer}>
                        {weather?.daily?.map((day, index) => {
                        if (index !== 0) {
                            return <DailyForecast key={day.dt} day={day} index={index} />;
                        }
                        })}
                    </View>
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
