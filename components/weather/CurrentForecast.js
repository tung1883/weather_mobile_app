import React, { useContext } from "react";
import styled from "styled-components/native";
import { StyleSheet, View, Text, Image } from "react-native";

import { FunctionalContext, WeatherContext } from "../Context";

const CurrentForecast = ({ currentWeather }) => {
  const { unit, getUnit } = useContext(WeatherContext)
  const { isDarkMode, t } = useContext(FunctionalContext)

  const parseTimezone = (timezone) => {
    if (!timezone) return 

    return timezone.replace(/_/g, ' ')
  }

  return (
    <View style={styles.currentView}>
      <Text style={styles.timezone}>{parseTimezone(currentWeather.timezone)}</Text>
      <View style={styles.mainInfoContainer}>
        <View style={styles.currentTempView}>
          {currentWeather.current && (
            <Image style={styles.weatherIcon}
              source={{
                uri: `http://openweathermap.org/img/wn/${currentWeather.current.weather[0].icon}@2x.png`,
              }}
              resizeMode={"contain"}
            />
          )}
          <Text style={styles.currentDegrees}>
            {Math.round(currentWeather.current && currentWeather.current.temp)}
            {getUnit('temp', unit)}
          </Text>
        </View>
        <Text style={styles.description}>
          {currentWeather.current &&
            currentWeather.current.weather[0].description.charAt(0).toUpperCase() + currentWeather.current.weather[0].description.slice(1)}
        </Text>
      </View>
      <View style={[styles.secondaryInfoContainer, isDarkMode && { backgroundColor: '#1E1E1E', borderColor: 'grey', borderWidth: 1 }]}>
        <View style={styles.row}>
          <View style={styles.detailsBox}>
            <Text style={[styles.label, isDarkMode && { color: 'white'}]}>{t('weather.feels')}</Text>
            <Text style={[styles.details, isDarkMode && { color: 'white'}]}>
              {currentWeather.current &&
                Math.round(currentWeather.current.feels_like)}
              {getUnit('temp', unit)}
            </Text>
          </View>
          <View style={[styles.detailsBox, isDarkMode && { color: 'white'}]}>
            <Text style={[styles.label, isDarkMode && { color: 'white'}]}>{t('weather.low')}</Text>
            <Text style={[styles.details, isDarkMode && { color: 'white'}]}>
              {currentWeather.daily &&
                Math.round(currentWeather.daily[0].temp.min)}
              {getUnit('temp', unit)}
            </Text>
          </View>
          <View style={[styles.detailsBox, isDarkMode && { color: 'white'}]}>
            <Text style={[styles.label, isDarkMode && { color: 'white'}]}>{t('weather.high')}</Text>
            <Text style={[styles.details, isDarkMode && { color: 'white'}]}>
              {currentWeather.daily &&
                Math.round(currentWeather.daily[0].temp.max)}
              {getUnit('temp', unit)}
            </Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.detailsBox}>
            <Text style={[styles.label, isDarkMode && { color: 'white'}]}>{t('weather.wind')}</Text>
            <Text style={[styles.details, isDarkMode && { color: 'white'}]}>
              {currentWeather.current && currentWeather.current.wind_speed} {getUnit('wind', unit)}
            </Text>
          </View>
          <View style={[styles.detailsBox, isDarkMode && { color: 'white'}]}>
            <Text style={[styles.label, isDarkMode && { color: 'white'}]}>{t('weather.humid')}</Text>
            <Text style={[styles.details, isDarkMode && { color: 'white'}]}>
              {currentWeather.current && currentWeather.current.humidity}%
            </Text>
          </View>
          <View style={[styles.detailsBox, isDarkMode && { color: 'white'}]}>
            <Text style={[styles.label, isDarkMode && { color: 'white'}]}>{t('weather.rain')}</Text>
            <Text style={[styles.details, isDarkMode && { color: 'white'}]}>
              {currentWeather.daily > 0 ? currentWeather.daily[0].rain : "0"} MM
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  currentView: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  currentTempView: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainInfoContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  description: {
    color: 'white',
    fontSize: 15
  },
  secondaryInfoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
    marginHorizontal: 10,
    width: '95%',
    maxWidth: 478,
  },
  weatherIcon: {
    width: 50,
    height: 50,
  },
  timezone: {
    color: 'white',
    display: 'flex',
    justifyContent: 'center',
    marginTop: 10,
    fontSize: 15,
  },
  currentDegrees: {
    color: 'white',
    display: 'flex',
    justifyContent: 'center',
    marginTop: 10,
    fontSize: 60,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  detailsBox: {
    display: 'flex',
  },
  label: {
    fontSize: 18,
  },
  details: {
    color: 'black',
    fontSize: 15,
    textTransform: 'capitalize',
  },
});


export default CurrentForecast;
