import React, { useEffect, useState } from "react";
import { ScrollView, ImageBackground, Text, Animated, TouchableOpacity, View } from "react-native";
import CurrentForecast from "../components/CurrentForecast";
import DailyForecast from "../components/DailyForecast";
import styled from "styled-components/native";
import config from "../config";
import bgImg from "../assets/background_light.png";
import { SearchBar } from 'react-native-elements';

const colors = {
  taskbarBackground: 'rgba(255, 255, 255, 0.8)',
  textColor: 'black',
  buttonColor: 'rgba(0, 0, 0, 0.5)',
  buttonTextColor: 'white',
};

const sizes = {
  buttonRadius: 10,
  buttonPadding: 10,
  taskbarMarginTop: 20,
  taskbarPaddingHorizontal: 20,
  gridItemPadding: 10,
  gridItemBorderWidth: 1,
};

const GridItem = styled.View`
  border: 2px solid #000; /* Màu viền */
  padding: 5px;
  margin-bottom: 5px;
  border-radius: 5px; /* Bo tròn góc */
`;

const TaskbarItem = ({ text, onPress }) => (
  <TouchableOpacity onPress={onPress} style={{ paddingHorizontal: sizes.taskbarPaddingHorizontal }}>
    <Text>{text}</Text>
  </TouchableOpacity>
);

const MainPage = ({ city, setCity, location, weather, fetchWeatherInfo, navigation, route }) => {
  const [isTaskbarOpen, setIsTaskbarOpen] = useState(false);

  const taskbarWidth = isTaskbarOpen ? '66%' : '0%';
  const taskbarOpacity = isTaskbarOpen ? 1 : 0;

  useEffect(() => {
    const getLocationDetails = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/geo/1.0/reverse?lat=${location.lat}&lon=${location.long}&limit=1&appid=${config.API_KEY}`
        );
        const data = await response.json();
        const city = data[0].name;
        setCity(city)
      } catch (error) {
        console.error('Error fetching location info:', error);
      }
    };

    if (!city) {
      getLocationDetails()
    }
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      fetchWeatherInfo(city).then(() => {
        console.log('here')
        // route?.params?.onDataFetchComplete() 
      })
    }
    
    fetchWeather()
  }, [location]);

  return (
    <Container>
      <ImageBackground source={bgImg} style={{ width: "100%", height: "100%" }}>
        <Animated.View style={{ position: 'absolute', top: 0, left: 0, width: taskbarWidth, height: "100%", backgroundColor: colors.taskbarBackground, opacity: taskbarOpacity }}>
          <GridItem>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <TaskbarItem text="Location" onPress={() => console.log('Edit location')} />
      <TaskbarItem text="Edit" onPress={() => console.log('Edit')} />
    </View>
          </GridItem>
          <GridItem>
            <TaskbarItem text="Hoàn Kiếm, Vn" onPress={() => console.log('View more locations')} />
          </GridItem>
          <GridItem>
            <TaskbarItem text="Add Widget to home Screen" onPress={() => console.log('Add Widget to home Screen')} />
          </GridItem>
          <GridItem>
          <TaskbarItem text="Daily Summary Notifications" onPress={() => console.log('Daily Summary Notifications')} />
          </GridItem>
          <GridItem>
            <TaskbarItem text="Settings" onPress={() => console.log('Settings')} />
          </GridItem>
        </Animated.View>
        <TouchableOpacity onPress={() => setIsTaskbarOpen(!isTaskbarOpen)} 
          style={{ position: 'absolute', top: 20, right: 20, zIndex: 1, borderRadius: sizes.buttonRadius, backgroundColor: colors.buttonColor, padding: sizes.buttonPadding }}
        >
          <Text style={{ color: colors.buttonTextColor, fontSize: 16 }}>Search</Text>
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
