import { Dimensions, StyleSheet, View, ScrollView, Text } from "react-native";
import { LineChart } from "react-native-chart-kit";
import React, { useContext } from "react";
import moment from "moment";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { FunctionalContext, WeatherContext } from "../Context";

export default Precip = () => {
    const { weather } = useContext(WeatherContext)
    const { isDarkMode, t } = useContext(FunctionalContext)
    
    return (
        <>
            {weather &&
            <ScrollView>
                <Text style={[{marginLeft: 10, marginTop: 5, marginBottom: 10, fontSize: 20, fontWeight: 'bold'}, {color: 'white'}]}>{t('today.precipTitle')}</Text>
                 <View style={{flexDirection: 'row', justifyContent: 'center', backgroundColor: isDarkMode ? '#696969' : 'rgba(255, 255, 255, 0.6)', marginHorizontal: 10, 
                    borderRadius: 20, marginBottom: 20, paddingVertical: 20}}>
                    {
                        weather?.daily?.slice(0, 7)?.map((day) => {
                            return (
                                <View key={day.dt} style={{height: 150, justifyContent: 'center', alignItems: 'center'}}>
                                    <Text style={{color: isDarkMode ? 'white' : 'black'}}>{moment(day.dt * 1000).format("ddd")}</Text>
                                    <View style={{height: 120, width: 8, paddingVertical: 10, paddingHorizontal: 25, alignItems: 'center'}}>
                                        <View style={[{backgroundColor: 'white', borderTopLeftRadius: 100, borderTopRightRadius: 100, 
                                            flex: 100 - day.pop * 100, width: 8}, day.pop == 0 && {borderBottomLeftRadius: 100, borderBottomRightRadius: 100}]}/>
                                        <LinearGradient 
                                            colors={['#C5FFF8', '#5FBDFF']} 
                                            start={{x: 0, y: 0}}
                                            end={{x: 1, y: 1}}
                                            style={[{backgroundColor: '#40A2E3', borderBottomLeftRadius: 100, borderBottomRightRadius: 100, 
                                                flex: day.pop * 100, width: 8}, day.pop == 1 && {borderTopRightRadius: 100, borderTopLeftRadius: 100}]}/>
                                    </View>
                                    <Text style={{color: isDarkMode ? 'white' : 'black'}}>{Math.round(day.pop * 100)}%</Text>
                                </View>
                            )
                        })
                    }
                </View> 
                <View style={[{marginHorizontal: 10, borderBottomWidth: 0.5, borderBottomColor: '#EEEDEB'}, isDarkMode && { borderWidth: 1, borderBottomColor: 'grey' }]}></View>
                <PrecipInterface></PrecipInterface>

                <View style={[{marginHorizontal: 10, borderBottomWidth: 0.5, borderBottomColor: '#EEEDEB'}, isDarkMode && { borderWidth: 1, borderBottomColor: 'grey' }]}></View>
                <View contentContainerStyle={{ flexGrow: 1, borderWidth: 1 }} style={{ marginTop: 20, flex: 1 }}>
                    <View style={styles.futureForecastContainer}>
                        {weather?.hourly?.map((hour, index) => {
                            if (index !== 0) {
                                return <Hourly key={hour.dt} hour={hour} index={index} />;
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
            <Text style={[{marginLeft: 10, marginBottom: 5, fontSize: 20, fontWeight: 'bold'}, {color: 'white'}]}>{t('today.rain')}</Text>
            <LineGraph 
                isDarkMode={isDarkMode}
                labels={weather?.daily?.map((day) => (moment(day.dt * 1000).format("ddd")))}
                data={weather?.daily?.map((day) => (day.rain) ? day.rain : 0)}
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
                    backgroundGradientFrom: '#1D5D9B',
                    backgroundGradientTo:'#75C2F6',
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

const Hourly = ({ hour }) => {
    const { unit, getUnit } = useContext(WeatherContext)
    const { t, isDarkMode } = useContext(FunctionalContext)

    const getDate = (dt) => {
        const date = new Date(dt * 1000);
        const day = date.getDate();
        const month = date.getMonth() + 1; 
        const formattedDay = day < 10 ? '0' + day : day;
        const formattedMonth = month < 10 ? '0' + month : month;
        return `${formattedDay}/${formattedMonth}`;
    }

    function capitalizeEachWord(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    return (
        <View style={[styles.dayContainer, isDarkMode && { backgroundColor: '#696969'}]}>
        <View style={styles.dateContainer}>
            <Text style={[styles.weekDay, { fontWeight: 'bold' }, isDarkMode && { color: 'white' }]}>{getDate(hour.dt)}</Text>
            <Text style={[styles.weekDay, isDarkMode && { color: 'white' }]}>{(new Date(hour.dt * 1000)).getHours() + ':00'}</Text>
        </View>
        <View style={styles.iconTempView}>
            <MaterialCommunityIcons name='weather-pouring' color='#00A9FF' size={25}/>
            <Text style={[{fontSize: 15, marginLeft: 10}, isDarkMode && { color: 'white' }]}>{Math.round(hour.pop * 100)}%</Text>
        </View>
        <View style={styles.degreeView}>
            <Text style={isDarkMode && { color: 'white'}}>{capitalizeEachWord(hour.weather[0].description)}</Text>
        </View>
        </View>
    );
};

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
        marginBottom: 20,
        marginTop: 20
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
    },
    dayContainer: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 10,
    margin: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '95%',
    maxWidth: 478,
    },
    dateContainer: {
        textAlign: 'right',
        maxWidth: 50,
        flex: 1,
    },
    weekDay: {
        fontSize: 14,
        textAlign: 'center',
        marginVertical: 1,
    },
    iconTempView: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 2,
    },
    weatherIcon: {
        width: 50,
        height: 50,
    },
    degreeView: {
        textAlign: 'center',
        flex: 1,
        minWidth: 30,
        marginLeft: 30
    },
    degree: {
        fontSize: 20,
    },
    feelsLike: {
        fontSize: 12,
    },
})