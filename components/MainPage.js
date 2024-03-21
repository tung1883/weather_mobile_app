import React, { useEffect, useState } from "react";
import { ScrollView, ImageBackground } from "react-native";
import ForecastSearch from "../components/ForecastSearch";
import CurrentForecast from "../components/CurrentForecast";
import DailyForecast from "../components/DailyForecast";
import styled from "styled-components/native";
import config from "../config";
import bgImg from "../assets/background_light.png"

const MainPage = ({route}) => {
  const { location } = route.params
  const [toggleSearch, setToggleSearch] = useState("city");
  const [city, setCity] = useState("Hanoi");
  const [postalCode, setPostalCode] = useState("L4W1S9");
  const [lat, setLat] = useState((location) ? location.coords.latitude : 21.0245);
  const [long, setLong] = useState((location) ? location.coords.longitude : 105.8412);
  const [weather, setWeather] = useState({});

  useEffect(() => {
    const getLocationInfo = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${OPENWEATHERMAP_API_KEY}`
        );
        const data = await response.json();
        // Extract city and country from the response
        const city = data[0].name;
        const country = data[0].country;
        setLocationInfo(`${city}, ${country}`);
      } catch (error) {
        console.error('Error fetching location info:', error);
      }
    };

    getLocationInfo()
  }, [])

  const controller = new AbortController();
  const signal = controller.signal;

  //fetch lat long by city
  const fetchLatLongHandler = () => {
    fetch(
      `http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${config.API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        setLat(data.coord.lat);
        setLong(data.coord.lon);
      });
  };

  //fetch lat long by postal code/zip since OpenWeather Api only accepts zips
  const fetchByPostalHandler = () => {
    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?key=${config.GOOGLE_KEY}&components=postal_code:${postalCode}`
    )
      .then((res) => res.json())
      .then((data) => {
        setLat(data.results[0].geometry.location.lat);
        setLong(data.results[0].geometry.location.lng);
      });
  };

  //updates the weather when lat long changes
  useEffect(() => {
    fetch(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${long}&exclude=hourly,minutely&units=metric&appid=${config.API_KEY}`,
      { signal }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(lat)
        console.log(long)
        setWeather(data);
      })
      .catch((err) => {
        console.log("error", err);
      });
    return () => controller.abort();
  }, [lat, long]);

  return (
    <Container>
      <ImageBackground source={bgImg} style={{ width: "100%", height: "100%" }}>
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
