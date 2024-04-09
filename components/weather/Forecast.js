import { Dimensions, StyleSheet, View, ScrollView, Text, Pressable, Image } from "react-native";
import { LineChart } from "react-native-chart-kit";
import React, { useContext, useState } from "react";
import moment from "moment";

import { FunctionalContext, WeatherContext } from "../Context";

export default Forecast = () => {
    const { weather } = useContext(WeatherContext)
    const { isDarkMode, t } = useContext(FunctionalContext)
    const [type, setType] = useState(0) //0: daily, 1: hourly

    return (
        <>
            {weather && 
            <ScrollView>
                <View style={[{margin: 10, padding: 2, flexDirection: 'row', 
                    borderColor: 'grey', borderRadius: 20, width: '95%', backgroundColor: isDarkMode ? '#1E1E1E' : 'white'}, isDarkMode && { borderWidth: 1.5, borderColor: 'grey'}]}>
                    <Pressable 
                        onPress={() => setType(0)}
                        style={[{flex: 1, alignItems: 'center', borderRadius: 20, padding: 5}, type == 0 && { backgroundColor: isDarkMode ? '#696969' : '#008DDA' }]}>
                        <Text style={[{fontWeight: 'bold', color: isDarkMode ? 'white' : 'black'}, !isDarkMode && type == 0 && { color: 'white' }]}>{t('today.daily')}</Text>
                    </Pressable>
                    <Pressable 
                        onPress={() => setType(1)}
                        style={[{flex: 1, alignItems: 'center', borderRadius: 20, padding: 5}, type == 1 && { backgroundColor: isDarkMode ? '#696969' : '#008DDA' }]}>
                        <Text style={[{fontWeight: 'bold', color: isDarkMode ? 'white' : 'black'}, !isDarkMode && type == 1 && { color: 'white' }]}>{t('today.hourly')}</Text>
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
                                            return <Hourly key={hour.dt} hour={hour} index={index} />;
                                        }
                                    })
                                }
                            </>
                            : <>
                                {
                                    weather?.daily?.map((day, index) => {
                                        if (index !== 0) {
                                            return <Daily key={day.dt} day={day} index={index} />;
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
                    backgroundGradientFrom: isDarkMode ? "#ffa726" : '#41C9E2',
                    backgroundGradientTo: isDarkMode ? "#FF204E" : '#008DDA',
                    decimalPlaces: 2, // optional, defaults to 2dp
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    style: {
                        borderRadius: 16,
                    },
                    propsForDots: {
                        r: "3",
                        strokeWidth: "2"
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

const Daily = ({ day }) => {
  const { unit, getUnit } = useContext(WeatherContext)
  const { t, isDarkMode } = useContext(FunctionalContext)

  function capitalizeEachWord(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  return (
    <View style={[styles.dayContainer, isDarkMode && { backgroundColor: '#696969'}]}>
      <View style={styles.dateContainer}>
        <Text style={[styles.weekDay, isDarkMode && { color: 'white' }]}>{moment(day.dt * 1000).format("ddd")}</Text>
      </View>
      <View style={styles.iconTempView}>
        <Image
          style={styles.weatherIcon}
          source={{
            uri: `http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`,
          }}
          resizeMode={"contain"}
        />
        <Text style={isDarkMode && { color: 'white'}}>{capitalizeEachWord(day.weather[0].description)}</Text>
      </View>
      <View style={styles.degreeView}>
        <Text style={[styles.degree, isDarkMode && { color: 'white'}]}>{Math.round(day.temp.max)}{getUnit('temp', unit)}</Text>
        <Text style={[styles.feelsLike, isDarkMode && { color: 'white' }]}>{t('weather.feels')} {Math.round(day.feels_like.day)}{getUnit('temp', unit)}</Text>
      </View>
    </View>
  );
};

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

    const getHour = (dt) => {
      let hour = new Date(dt * 1000).getHours()
      return (hour < 10) ? '0' + hour + ':00' : hour + ':00'
    }

    function capitalizeEachWord(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    return (
        <View style={[{paddingVertical: 10, paddingHorizontal: 10, backgroundColor: 'rgba(255, 255, 255, 0.6)', borderRadius: 10, margin: 10, display: 'flex',
          flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', width: '95%', maxWidth: 478,
        }, isDarkMode && { backgroundColor: '#696969'}]}>
        <View style={{textAlign: 'right', maxWidth: 50, flex: 1}}>
            <Text style={[{fontSize: 14, textAlign: 'center', marginVertical: 1,}, { fontWeight: 'bold' }, isDarkMode && { color: 'white' }]}>{getDate(hour.dt)}</Text>
            <Text style={[{fontSize: 14, textAlign: 'center', marginVertical: 1}, isDarkMode && { color: 'white' }]}>{getHour(hour.dt)}</Text>
        </View>
        <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', flex: 2}}>
            <Image
            style={{width: 50, height: 50}}
            source={{
                uri: `http://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`,
            }}
            resizeMode={"contain"}
            />
            <Text style={isDarkMode && { color: 'white'}}>{capitalizeEachWord(hour.weather[0].description)}</Text>
        </View>
        <View style={{ textAlign: 'center', flex: 1, minWidth: 30, marginLeft: 30}}>
            <Text style={[{fontSize: 30}, isDarkMode && { color: 'white'}]}>{Math.round(hour.temp)}{getUnit('temp', unit)}</Text>
            <Text style={[{fontSize: 12}, isDarkMode && { color: 'white' }]}>{t('weather.feels')} {Math.round(hour.feels_like)}{getUnit('temp', unit)}</Text>
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
        fontSize: 20,
        textAlign: 'center',
        marginVertical: 1,
    },
    iconTempView: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
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
    }
})