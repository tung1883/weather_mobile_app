import React, { useEffect, useState } from "react";
import { ScrollView, ImageBackground } from "react-native";
import ForecastSearch from "../components/ForecastSearch";
import CurrentForecast from "../components/CurrentForecast";
import DailyForecast from "../components/DailyForecast";
import styled from "styled-components/native";
import config from "../config";
import bgImg from "../assets/background_light.png"
import { TouchableOpacity } from "react-native-gesture-handler";

const MainPage = ({ city, setCity, location, setLocation, weather, setWeather, fetchLatLongHandler, navigation }) => {
  const [toggleSearch, setToggleSearch] = useState("city");
  const [postalCode, setPostalCode] = useState("L4W1S9");

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

    getLocationInfo()
  }, [])

  const controller = new AbortController();
  const signal = controller.signal;

  //fetch lat long by postal code/zip since OpenWeather Api only accepts zips
  const fetchByPostalHandler = () => {
    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?key=${config.GOOGLE_KEY}&components=postal_code:${postalCode}`
    )
      .then((res) => res.json())
      .then((data) => {
        setLocation({
          lat: data.results[0].geometry.location.lat,
          long: data.results[0].geometry.location.lng
        })
      });
  };

  //updates the weather when lat long changes
  useEffect(() => {
    fetch(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${location.lat}&lon=${location.long}&exclude=hourly,minutely&units=metric&appid=${config.API_KEY}`,
      { signal }
    )
      .then((res) => res.json())
      .then((data) => {
        setWeather(data);
      })
      .catch((err) => {
        console.log("error", err);
      });
    return () => controller.abort();
  }, [location]);

  return (
    <Container>
      <ImageBackground source={bgImg} style={{ width: "100%", height: "100%" }}>
        <TouchableOpacity onPress={() => navigation.navigate('Search')}>
          <ForecastSearch
            city={city}
            setCity={setCity}
            fetchLatLongHandler={fetchLatLongHandler}
            toggleSearch={toggleSearch}
            setToggleSearch={setToggleSearch}
            fetchByPostalHandler={fetchByPostalHandler}
            setPostalCode={setPostalCode}
            postalCode={postalCode}
          />
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
