import { Dimensions, StyleSheet, View, ScrollView, Text } from "react-native";
import { LineChart } from "react-native-chart-kit";
import React, { useContext, useState } from "react";
import moment from "moment";

import { FunctionalContext, WeatherContext } from "../Context";
import DailyForecast from "./DailyForecast";
import HourlyForecast from "./HourlyForecast";

export default Precip = () => {
    const { weather } = useContext(WeatherContext)
    const { isDarkMode, t } = useContext(FunctionalContext)
    const [type, setType] = useState(0) 

    const data = [
        { date: 'Mon', pop: 0.25},
        { date: 'Tue', pop: 0.25},
        { date: 'Wed', pop: 0.25},
        { date: 'Thu', pop: 0.25},
        { date: 'Fri', pop: 0.25},
        { date: 'Sat', pop: 0.25},
        { date: 'Sun', pop: 0.25}
    ]

    return (
        <>
            {weather &&
            <ScrollView>
                <PrecipInterface></PrecipInterface>
                <View style={[{marginHorizontal: 10, borderBottomWidth: 0.5, borderBottomColor: '#EEEDEB'}, isDarkMode && { borderWidth: 1, borderBottomColor: 'grey' }]}></View>
                <Text style={[{marginLeft: 10, marginTop: 20, marginBottom: 10, fontSize: 20, fontWeight: 'bold'}, {color: 'white'}]}>{t('today.precipTitle')}</Text>
                 <View style={{flexDirection: 'row', justifyContent: 'center', backgroundColor: '#696969', marginHorizontal: 10, borderRadius: 20, marginBottom: 20, paddingVertical: 20}}>
                    {
                        data.map((day) => {
                            return (
                                <View key={day.date} style={{height: 140, justifyContent: 'center', alignItems: 'center'}}>
                                    <Text style={{color: 'white'}}>{day.date}</Text>
                                    <View style={{height: 100, width: 10, paddingVertical: 10, paddingHorizontal: 25, alignItems: 'center' }}>
                                        <View style={{backgroundColor: 'white', borderTopLeftRadius: 100, borderTopRightRadius: 100, flex: 20, width: 10}}/>
                                        <View style={{backgroundColor: '#40A2E3', borderBottomLeftRadius: 100, borderBottomRightRadius: 100, flex: 80, width: 10}}/>
                                    </View>
                                    <Text style={{color: 'white'}}>{day.pop * 100}%</Text>
                                </View>
                            )
                        })
                    }
                </View> 

                <View style={[{marginHorizontal: 10, borderBottomWidth: 0.5, borderBottomColor: '#EEEDEB'}, isDarkMode && { borderWidth: 1, borderBottomColor: 'grey' }]}></View>
                <View contentContainerStyle={{ flexGrow: 1, borderWidth: 1 }} style={{ marginTop: 20, flex: 1 }}>
                    <View style={styles.futureForecastContainer}>
                        {weather?.daily?.map((day, index) => {
                            if (index !== 0) {
                                return <DailyForecast key={day.dt} day={day} index={index} />;
                            }
                        })}
                    </View>
                </View>
            </ScrollView>
            }
          {!weather && <View style={styles.noWeather}><Text style={{color: 'white', textAlign: 'center'}}>No Weather to Show</Text></View>}
        </>
    )
}

const PrecipInterface = () => {
    const { isDarkMode, t } = useContext(FunctionalContext)
    const { weather } = useContext(WeatherContext) 

    return (
        <View style={styles.currentView}>
            <Text style={[{marginLeft: 10, marginBottom: 10, fontSize: 20, fontWeight: 'bold'}, {color: 'white'}]}>{t('today.precipTitle')}</Text>
            <LineGraph 
                isDarkMode={isDarkMode}
                labels={weather.daily.map((day) => (moment(day.dt * 1000).format("ddd")))}
                data={weather.daily.map((day) => (day.rain) ? day.rain : 0)}
            >
            </LineGraph>
        </View>
    );
};

const LineGraph = ({data, labels}) => {
    return (
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <LineChart
                data={{
                    datasets: [{data}],
                    labels: labels
                }}
                width={Dimensions.get("window").width - 20}
                height={260}
                yAxisSuffix={'mm'}
                chartConfig={{
                    backgroundGradientFrom: '#008DDA',
                    backgroundGradientTo:'#41C9E2',
                    decimalPlaces: 2,
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    style: {
                        borderRadius: 16,
                    },
                    propsForDots: {
                        r: "3"
                    }
                }}
                fromZero={true}
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