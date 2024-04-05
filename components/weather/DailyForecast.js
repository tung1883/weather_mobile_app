import React, { useContext } from "react";
import { Text, StyleSheet, View, Image } from "react-native";
import styled from "styled-components/native";
import moment from "moment";
import { FunctionalContext, WeatherContext } from "../Context";

const DailyForecast = ({ day }) => {
  const { unit, getUnit } = useContext(WeatherContext)
  const { t, isDarkMode } = useContext(FunctionalContext)

  function capitalizeEachWord(str) {
    return str.replace(/\b\w/g, function(char) {
      return char.toUpperCase();
    });
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

const styles = StyleSheet.create({
  dayContainer: {
    padding: 10,
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
    flex: 1,
  },
  weekDay: {
    fontSize: 24,
    textAlign: 'center',
    marginVertical: 3,
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
  },
  degree: {
    fontSize: 24,
  },
  feelsLike: {
    fontSize: 12,
  },
});

export default DailyForecast;
