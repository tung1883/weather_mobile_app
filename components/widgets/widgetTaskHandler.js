import React from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization'
import { requestWidgetUpdate } from 'react-native-android-widget';

import { SmallWidget } from './SmallWidget';
import { BigWidget } from './BigWidget'
import { getWeather, getLocationByCity, getUnit, getStoredLocation } from '../Context';

export async function widgetTaskHandler (props) {
  const widgetInfo = props.widgetInfo
  
  //unit, language, theme
  let theme = await AsyncStorage.getItem('theme')
  if (!theme || theme == 'auto') theme = Appearance.getColorScheme()
  const isDarkMode = (theme == 'dark') ? true : false
  let unit = await AsyncStorage.getItem('unit')
  if (!unit) unit = 'metric'
  let lang = await AsyncStorage.getItem('lang') 
  if (!lang || lang == 'auto') lang = Localization.getLocales()[0].languageCode
  
  let location = await getStoredLocation('widget')
  if (!location.lat) location = await getLocationByCity(location.city)
  let weatherInfo = null
  let currentWeather = null

  if (location) {
    weatherInfo = await getWeather({location})
    currentWeather = weatherInfo.current
  }
  
  if (widgetInfo.widgetName == 'Small') {
    switch (props.widgetAction) {
      default:
        if (location) props.renderWidget(<SmallWidget location={location.city} weather={Math.round(currentWeather.temp) + getUnit('temp', unit)} isDarkMode={isDarkMode} 
          lang={lang} icon={currentWeather.weather[0].icon} date={getCurrentDate()}/>);
        else props.renderWidget(<SmallWidget location={null} isDarkMode={isDarkMode} lang={lang} />);
        break;
    }

    return 
  }

  if (widgetInfo.widgetName == 'Big') {
    let daily = (location) ? weatherInfo.daily : null
    
    switch (props.widgetAction) {  
      default:
        if (location) props.renderWidget(<BigWidget location={location.city} weather={currentWeather} daily={daily} unit={getUnit('temp', unit)} date={getCurrentDate()} 
          nextDays={getNextThreeDays()} locationDetails={location.city + ', ' + location.country}isDarkMode={isDarkMode} lang={lang}/>);
        else props.renderWidget(<BigWidget location={null} isDarkMode={isDarkMode} lang={lang}/>);
        break;
    }
  }
}

const getCurrentDate = () => {
  const date = new Date();
  const format = (part) => part < 10 ? '0' + part : part.toString()
  return  format(date.getMonth() + 1) + '/' + format(date.getDate()) + '/' + format(date.getFullYear() % 100) 
};

function getNextThreeDays() {
  const today = new Date();
  const daysArray = [];

  for (let i = 1; i <= 3; i++) {
    const nextDay = new Date(today);
    nextDay.setDate(today.getDate() + i);

    const day = String(nextDay.getDate()).padStart(2, '0');
    const month = String(nextDay.getMonth() + 1).padStart(2, '0'); // Months are 0-based in JavaScript

    daysArray.push(`${day}/${month}`);
  }

  return daysArray;
}

export const widgetLocationUpdate = async () => {
  //unit, language, theme
  let theme = await AsyncStorage.getItem('theme')
  if (!theme || theme == 'auto') theme = Appearance.getColorScheme()
  const isDarkMode = (theme == 'dark') ? true : false
  let unit = await AsyncStorage.getItem('unit')
  if (!unit) unit = 'metric'
  let lang = await AsyncStorage.getItem('lang') 
  if (!lang || lang == 'auto') lang = Localization.getLocales()[0].languageCode
  
  let location = await getStoredLocation('widget')
  if (!location.lat) location = await getLocationByCity(location.city)
  let weatherInfo = null
  let currentWeather = null

  if (location) {
    weatherInfo = await getWeather({location})
    currentWeather = weatherInfo.current
  }

  if (!location) {
    requestWidgetUpdate({
      widgetName: 'Big',
      renderWidget: () => <BigWidget location={null} isDarkMode={isDarkMode} lang={lang}/>
    });
  
    requestWidgetUpdate({
      widgetName: 'Small',
      renderWidget: () => <SmallWidget location={null} isDarkMode={isDarkMode} lang={lang} />
    });
  } else {
    let daily = (location) ? weatherInfo.daily : null

    requestWidgetUpdate({
      widgetName: 'Big',
      renderWidget: () => <BigWidget location={location.city} weather={currentWeather} daily={daily} unit={getUnit('temp', unit)} date={getCurrentDate()} 
          nextDays={getNextThreeDays()} locationDetails={location.city + ', ' + location.country}isDarkMode={isDarkMode} lang={lang}/>
    });
  
    requestWidgetUpdate({
      widgetName: 'Small',
      renderWidget: () => <SmallWidget location={location.city} weather={Math.round(currentWeather.temp) + getUnit('temp', unit)} isDarkMode={isDarkMode} 
        lang={lang} icon={currentWeather.weather[0].icon} date={getCurrentDate()}/>
    }); 
  }
}