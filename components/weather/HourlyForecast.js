import React, { useContext } from "react";
import { Text, StyleSheet, View, Image } from "react-native";
import { FunctionalContext, WeatherContext } from "../Context";

export default Hourly = ({ hour }) => {
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
        <View style={[styles.dayContainer, isDarkMode && { backgroundColor: '#696969'}]}>
        <View style={styles.dateContainer}>
            <Text style={[styles.weekDay, { fontWeight: 'bold' }, isDarkMode && { color: 'white' }]}>{getDate(hour.dt)}</Text>
            <Text style={[styles.weekDay, isDarkMode && { color: 'white' }]}>{getHour(hour.dt)}</Text>
        </View>
        <View style={styles.iconTempView}>
            <Image
            style={styles.weatherIcon}
            source={{
                uri: `http://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`,
            }}
            resizeMode={"contain"}
            />
            <Text style={isDarkMode && { color: 'white'}}>{capitalizeEachWord(hour.weather[0].description)}</Text>
        </View>
        <View style={styles.degreeView}>
            <Text style={[styles.degree, isDarkMode && { color: 'white'}]}>{Math.round(hour.temp)}{getUnit('temp', unit)}</Text>
            <Text style={[styles.feelsLike, isDarkMode && { color: 'white' }]}>{t('weather.feels')} {Math.round(hour.feels_like)}{getUnit('temp', unit)}</Text>
        </View>
        </View>
    );
};

const styles = StyleSheet.create({
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
});
