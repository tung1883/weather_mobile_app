import React from 'react';
import * as Location from 'expo-location'
import { SmallWidget } from './SmallWidget';
import { BigWidget } from './BigWidget'
import AsyncStorage from '@react-native-async-storage/async-storage';

import config from '../../config'

export async function widgetTaskHandler (props) {
  const widgetInfo = props.widgetInfo;

  const getLocation = async () => {
    try {
        const currentLocation = JSON.parse(await AsyncStorage.getItem('currentLocation'))
        if (currentLocation) return currentLocation.city

        const favs = JSON.parse(await AsyncStorage.getItem('favoriteLocations'))
        if (favs.length == 0) return null

        return favs[0].location.city
      } catch (error) {
        console.error('Error getting location:', error);
        const favs = JSON.parse(await AsyncStorage.getItem('favoriteLocations'))
        if (favs.length == 0) return null

        return favs[0].location.city
      }
  }

  const getCurrentDate = () => {
    const date = new Date();

    const formatDatePart = (part) => {
      return part < 10 ? '0' + part : part.toString();
    };

    const formattedDate =
      formatDatePart(date.getMonth() + 1) +
      '/' +
      formatDatePart(date.getDate()) +
      '/' +
      formatDatePart(date.getFullYear() % 100) 

    return formattedDate;
  };

  const getWeather = async ({location}) => {
    //TRUE API CALL
    if (!location) return null

    return fetch(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${location.lat}&lon=${location.long}&units=metric&exclude=minutely&appid=${config.API_KEY}`
    )
    .then((res) => {
      return res.json()
    })
    .then((data) => {
      return data
    })
    .catch((err) => {
      console.log("error", err);
      return null
    });
  }

  const getLocationByCity = async (city) => {
    try {
      const response = await fetch(
        `http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${config.API_KEY}`
      );
      const data = await response.json();
      if (!data?.coord?.lat) {
        console.log('getLocationByCity Error');
        return null
      }

      const {lat, lon: long} = data.coord
      const details = await getLocationDetails({lat, long})
      return { lat, long, city: details.city }
    } catch (error) {
      console.error('getLocationByCity Error:', error);
      return null
    }
  };

  const getLocationDetails = async ({lat, long}) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${long}&limit=1&appid=${config.API_KEY}`
      );
      const data = (await response.json()).sort((a, b) => b.name.length - a.name.length)
      return {city: data[0].name, country: data[0].country}
    } catch (error) {
      console.error('Error fetching location info:', error);
    }
  };

  const location = await getLocation()
  let weatherInfo = null
  let weather = null

  if (location) {
    weatherInfo = await getWeather({location: await getLocationByCity(location)})
    weather = weatherInfo.current
  }
  
  if (widgetInfo.widgetName == 'Small') {
    switch (props.widgetAction) {
      default:
        if (location) props.renderWidget(<SmallWidget location={location} weather={Math.round(weather.temp) + '°C'} icon={weather.weather[0].icon} date={getCurrentDate()}/>);
        else props.renderWidget(<SmallWidget location={null} />);
        break;
    }

    return 
  }


  if (widgetInfo.widgetName == 'Big') {
    let daily, locationDetails
    if (location) {
      daily = weatherInfo.daily
      locationDetails = location + ', ' + (await getLocationDetails(await getLocationByCity(location))).country
    }
    
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

    switch (props.widgetAction) {  
      default:
        if (location) props.renderWidget(<BigWidget location={location} weather={weather} daily={daily} date={getCurrentDate()} nextDays={getNextThreeDays()} locationDetails={locationDetails}/>);
        else props.renderWidget(<BigWidget location={null} />);
        break;
    }

    return
  }
}