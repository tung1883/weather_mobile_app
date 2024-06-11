import React, { useContext } from "react";
import { StyleSheet, View, Text } from "react-native";
import { MaterialCommunityIcons, FontAwesome6 } from '@expo/vector-icons';

import { FunctionalContext, WeatherContext } from "../Context";

export default CurrentWeather = ({ currentWeather }) => {
  const { unit, getUnit } = useContext(WeatherContext)
  const { isDarkMode, t } = useContext(FunctionalContext)

  return (
    <View style={styles.currentView}>
      <View style={styles.mainInfoContainer}>
        <View style={styles.currentTempView}>
          <Text style={styles.currentDegrees}>
            {Math.round(currentWeather.current && currentWeather.current.temp)}
            {getUnit('temp', unit)}
          </Text>
        </View>
        <Text style={styles.description}>
          <Text style={{fontWeight: 'bold'}}>
            {currentWeather.current &&
              currentWeather.current.weather[0].description.charAt(0).toUpperCase() + currentWeather.current.weather[0].description.slice(1)}
          </Text>
          {` | ${t('weather.feels')} `}
          <Text style={{fontWeight: 'bold'}}>
            {currentWeather.current &&
              `${Math.round(currentWeather.current.feels_like)}` + getUnit('temp', unit)
            }
          </Text>
        </Text>
      </View>
      <View style={[styles.secondaryInfoContainer, isDarkMode && { backgroundColor: '#696969' }]}>
        <View style={styles.row}>
          <View style={styles.detailsBox}>
           <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
              <MaterialCommunityIcons name='weather-windy' color={isDarkMode ? 'white' : 'black' } size={20} style={{paddingRight: 5}}></MaterialCommunityIcons>
              <Text style={[styles.label, isDarkMode && { color: 'white'}]}>{t('weather.wind')}</Text>
            </View>
            <Text style={[styles.details, isDarkMode && { color: 'white'}]}>
              {currentWeather.current && currentWeather.current.wind_speed} {getUnit('wind', unit)}
            </Text>
          </View>
          <View style={[styles.detailsBox, isDarkMode && { color: 'white'}]}>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
              <FontAwesome6 name='temperature-low' color={isDarkMode ? 'white' : 'black' } size={20} style={{paddingRight: 5}}></FontAwesome6>
              <Text style={[styles.label, isDarkMode && { color: 'white'}]}>{t('weather.low')}</Text>
            </View>
            <Text style={[styles.details, isDarkMode && { color: 'white'}]}>
              {currentWeather.daily &&
                Math.round(currentWeather.daily[0].temp.min) + getUnit('temp', unit)}
            </Text>
          </View>
          <View style={[styles.detailsBox, isDarkMode && { color: 'white'}]}>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
              <MaterialCommunityIcons name='thermometer-high' color={isDarkMode ? 'white' : 'black' } size={20} style={{paddingRight: 5}}></MaterialCommunityIcons>
              <Text style={[styles.label, isDarkMode && { color: 'white'}]}>{t('weather.high')}</Text>
            </View>
            <Text style={[styles.details, isDarkMode && { color: 'white'}]}>
              {currentWeather.daily &&
                Math.round(currentWeather.daily[0].temp.max)}
              {getUnit('temp', unit)}
            </Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.detailsBox}>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
              <FontAwesome6 name='arrows-to-circle' color={isDarkMode ? 'white' : 'black' } size={15} style={{paddingHorizontal: 5}}></FontAwesome6>
              <Text style={[styles.label, isDarkMode && { color: 'white'}]}>{t('weather.pressure')}</Text>
            </View>
            <Text style={[styles.details, isDarkMode && { color: 'white'}]}>
              {currentWeather.current &&
                Math.round(currentWeather.current.pressure) + ' '}
              {getUnit('pressure', unit)}
            </Text>
            
          </View>
          <View style={[styles.detailsBox, isDarkMode && { color: 'white'}]}>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
              <MaterialCommunityIcons name='air-humidifier' color={isDarkMode ? 'white' : 'black' } size={20} style={{paddingRight: 5}}></MaterialCommunityIcons>
              <Text style={[styles.label, isDarkMode && { color: 'white'}]}>{t('weather.humid')}</Text>
            </View>
            <Text style={[styles.details, isDarkMode && { color: 'white'}]}>
              {currentWeather.current && currentWeather.current.humidity}%
            </Text>
          </View>
          <View style={[styles.detailsBox, isDarkMode && { color: 'white'}]}>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
              <MaterialCommunityIcons name='weather-rainy' color={isDarkMode ? 'white' : 'black' } size={20} style={{paddingRight: 5}}></MaterialCommunityIcons>
              <Text style={[styles.label, isDarkMode && { color: 'white'}]}>{t('weather.rain')}</Text>
            </View>
            <Text style={[styles.details, isDarkMode && { color: 'white'}]}>
              {typeof currentWeather?.current?.rain?.["1h"] === 'number' ? currentWeather.current.rain["1h"].toString() : "0"} mm
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
    marginBottom: 20
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
    paddingHorizontal: 10,
  },
  detailsBox: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 100
  },
  label: {
    fontSize: 18,
    // fontWeight: 'bold'
  },
  details: {
    color: 'black',
    fontSize: 15,
    paddingHorizontal: 10
  },
});