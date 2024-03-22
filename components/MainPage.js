import React, { useEffect, useState } from "react";
import { ScrollView, ImageBackground, Text } from "react-native";
import ForecastSearch from "../components/ForecastSearch";
import CurrentForecast from "../components/CurrentForecast";
import DailyForecast from "../components/DailyForecast";
import styled from "styled-components/native";
import config from "../config";
import bgImg from "../assets/background_light.png"
import { TouchableOpacity } from "react-native-gesture-handler";

const MainPage = ({ city, setCity, location, weather, fetchWeatherInfo, navigation, route }) => {
  useEffect(() => {
    const getLocationInfo = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/geo/1.0/reverse?lat=${location.lat}&lon=${location.long}&limit=1&appid=${config.API_KEY}`
        );
        const data = await response.json();
        const city = data[0].name;
        // const country = data[0].country;
        setCity(city)
      } catch (error) {
        console.error('Error fetching location info:', error);
      }
    };

    if (!city) {
      getLocationInfo()
    }
  }, [])

  useEffect(() => {
    const fetchWeather = async () => {
      fetchWeatherInfo().then(() => {
        console.log(weather)
        // route?.params?.onDataFetchComplete() 
      })
    }

    fetchWeather()
  }, [location])

  return (
    <Container>
      <ImageBackground source={bgImg} style={{ width: "100%", height: "100%" }}>
        <TouchableOpacity onPress={() => navigation.navigate('Search')}
          style={{borderWidth: 1, borderColor: 'black', backgroundColor: 'grey', height: 50}}
        >
          <Text>Search</Text>
        </TouchableOpacity>
        <CurrentForecast currentWeather={weather} timezone={weather.timezone} />
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ flex: 1 }}>
          <FutureForecastContainer>
            {weather.daily ? (
              weather.daily.map((day, index) => {
                if (index !== 0) {
                  return <DailyForecast key={day.dt} day={day} index={index} />;
                }
              })
            ) : (
              <NoWeather>No Weather to show</NoWeather>
            )}
          </FutureForecastContainer>
        </ScrollView>
      </ImageBackground>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: dodgerblue;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NoWeather = styled.Text`
  text-align: center;
  color: white;
`;

const FutureForecastContainer = styled.View`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default MainPage;
