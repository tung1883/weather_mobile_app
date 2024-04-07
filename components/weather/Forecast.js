import { Dimensions, StyleSheet, View, ScrollView, Text, Pressable } from "react-native";
import { LineChart } from "react-native-chart-kit";
import React, { useContext, useState } from "react";
import moment from "moment";

import { FunctionalContext, WeatherContext } from "../Context";
import DailyForecast from "./DailyForecast";
import HourlyForecast from "./HourlyForecast";

export default Forecast = () => {
    const { weather } = useContext(WeatherContext)
    const { isDarkMode } = useContext(FunctionalContext)
    const [type, setType] = useState(0) //0: daily, 1: hourly

    return (
        <>
            {weather && 
            <ScrollView>
                <View style={[{margin: 10, padding: 2, flexDirection: 'row', 
                    borderColor: 'grey', borderRadius: 20, width: '95%', backgroundColor: isDarkMode ? '#1E1E1E' : 'white'}, isDarkMode && { borderWidth: 1.5, borderColor: 'grey'}]}>
                    <Pressable 
                        onPress={() => setType(0)}
                        style={[{flex: 1, alignItems: 'center', borderRadius: 20, padding: 5}, type == 0 && { backgroundColor: isDarkMode ? '#696969' : '#0C359E' }]}>
                        <Text style={[{fontWeight: 'bold', color: isDarkMode ? 'white' : 'black'}, !isDarkMode && type == 0 && { color: 'white' }]}>Daily</Text>
                    </Pressable>
                    <Pressable 
                        onPress={() => setType(1)}
                        style={[{flex: 1, alignItems: 'center', borderRadius: 20, padding: 5}, type == 1 && { backgroundColor: isDarkMode ? '#696969' : '#0C359E' }]}>
                        <Text style={[{fontWeight: 'bold', color: isDarkMode ? 'white' : 'black'}, !isDarkMode && type == 1 && { color: 'white' }]}>Hourly</Text>
                    </Pressable>
                </View>
                <ForecastInterface type={type}></ForecastInterface>
                <View style={[{marginHorizontal: 10, borderBottomWidth: 0.5, borderBottomColor: '#EEEDEB'}, isDarkMode && { borderWidth: 1, borderBottomColor: 'grey' }]}></View>
                <View contentContainerStyle={{ flexGrow: 1, borderWidth: 1 }} style={{ marginTop: 20, flex: 1 }}>
                    <View style={styles.futureForecastContainer}>
                        {
                            type ? 
                            <>
                                {
                                    weather?.hourly?.map((hour, index) => {
                                        if (index !== 0) {
                                            return <HourlyForecast key={hour.dt} hour={hour} index={index} />;
                                        }
                                    })
                                }
                            </>
                            : <>
                                {
                                    weather?.daily?.map((day, index) => {
                                        if (index !== 0) {
                                            return <DailyForecast key={day.dt} day={day} index={index} />;
                                        }
                                    })
                                }
                            </>
                        }
                    </View>
                </View>
            </ScrollView>
            }
          {!weather && <View style={styles.noWeather}><Text style={{color: 'white', textAlign: 'center'}}>No Weather to Show</Text></View>}
        </>
    )
}

const ForecastInterface = ({type}) => {
    const { isDarkMode } = useContext(FunctionalContext)
    const { weather, unit, getUnit} = useContext(WeatherContext) 

    return (
        <View style={styles.currentView}>
            <LineGraph 
                isDarkMode={isDarkMode}
                labels={
                    type ? weather.hourly.slice(0, 8).map((hour) => (new Date(hour.dt * 1000)).getHours() + ':00') 
                    : weather.daily.map((day) => (moment(day.dt * 1000).format("ddd")))
                }
                data={
                    type ? weather.hourly.slice(0, 8).map((hour) => Math.round(hour.temp))
                    : weather.daily.map((day) => Math.round(day.temp.day))} unit={getUnit('temp', unit)
                }
            >
            </LineGraph>
        </View>
    );
};

const LineGraph = ({data, unit, labels, isDarkMode}) => {
    return (
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <LineChart
                data={{
                    labels: labels,
                    datasets: [{data}]
                }}
                
                width={Dimensions.get("window").width - 20} // from react-native
                height={260}
                yAxisSuffix={unit}
                yAxisInterval={1} 
                chartConfig={{
                    backgroundGradientFrom: isDarkMode ? 'grey' : "#8EA7E9",
                    backgroundGradientTo: isDarkMode ? 'black' : "#4682A9",
                    decimalPlaces: 2, // optional, defaults to 2dp
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    style: {
                        borderRadius: 16,
                    },
                    propsForDots: {
                        r: "3",
                        strokeWidth: "2",
                        stroke: "#ffa726"
                    }
                }}
                fromZero='true'
                bezier
                style={{
                    marginVertical: 8,
                    borderRadius: 16
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    noWeather: {
        flexGrow: 1
    }, 
    futureForecastContainer: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    currentView: {
        width: '100%',
        marginBottom: 20
    },
    secondaryInfoContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 20,
        display: 'flex',
        margin: 10,
        marginHorizontal: 10,
        width: '95%',
        maxWidth: 478,
        justifyContent: 'center',
        alignItems: 'center'
    }
})