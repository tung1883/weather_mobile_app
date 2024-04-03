import { StyleSheet, View, ScrollView, Text } from "react-native";
import { useEffect  } from "react";
import CurrentForecast from "./CurrentForecast";
import DailyForecast from "./DailyForecast";

export default TodayWeather = ({weather}) => {
    return (
        <>
            {weather && <>
                <CurrentForecast currentWeather={weather} timezone={weather?.timezone} />
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ flex: 1 }}>
                <View style={styles.futureForecastContainer}>
                    {weather?.daily?.map((day, index) => {
                    if (index !== 0) {
                        return <DailyForecast key={day.dt} day={day} index={index} />;
                    }
                    })}
                </View>
                </ScrollView>
            </>}          
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
