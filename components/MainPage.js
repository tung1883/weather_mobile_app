import React, { useContext, useEffect, useRef, useState } from "react";
import { ImageBackground, Text, TouchableOpacity, View, StyleSheet, Dimensions } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import config from "../config";
import darkBgImg from '../assets/dark_bg.png'
import bgImg from '../assets/background_light.png'
import { lightStyles, darkStyles } from "./defaultStyles";
import WeatherPage from "./ui/WeatherPage";
import Taskbar from "./ui/Taskbar";
import { FunctionalContext, WeatherContext } from "./Context";

const MainPage = ({ navigation }) => {
  const { location, weather, setWeather, getWeather, share } = useContext(WeatherContext)
  const { isDarkMode } = useContext(FunctionalContext)
  const [isTaskbarOpen, setIsTaskbarOpen] = useState(false);  
  const [formattedTime, setFormattedTime] = useState('');
  const intervals = useRef([])
  const [currentSection, setCurrentSection] = useState(0) //used to move between different weather sections, see sectionList in Footer.js
  
  useEffect(() => {
    getTime()

    return () => intervals.current.forEach(clearInterval);
  }, [weather]);

  useEffect(() => {
    (async () => {
      if (location && !weather) {
        setWeather(await getWeather({location}))
      } 
    })()
  }, [weather, location])

  const getTime = () => {
    if (!weather?.timezone_offset) return setFormattedTime('')
    date = new Date()
    let locationTime= new Date(date.getTime() + date.getTimezoneOffset() * 60000 + (1000 * weather.timezone_offset))
    let hour = locationTime.getHours();
    let minutes = locationTime.getMinutes()

    setFormattedTime(`${(hour < 10) ? '0' + hour : hour} : ${((minutes< 10)) ? '0' + minutes : minutes}`);
    intervals.current.push(setInterval(getTime, Math.ceil(date.getTime()  / 60000) * 60000 - date.getTime()))
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setIsTaskbarOpen(false)} style={{ width: "100%", height: "100%" }} activeOpacity={1}>
        <ImageBackground source={(isDarkMode) ? darkBgImg : bgImg} style={{ width: "100%", height: "100%" }}>
          {/* header */}
          <View style={styles.header}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity onPress={() => {setIsTaskbarOpen(true)}}>
                <MaterialCommunityIcons name='menu' size={20} color='white'></MaterialCommunityIcons>
              </TouchableOpacity>
              <View style={{paddingLeft: 30}}>
                <Text style={{fontSize: 20, fontWeight: 'bold', color:  'white'}}>{(location?.city) ? `${location.city}, ${location.country}` : ''}</Text>
                {weather && <Text style={{color: 'white'}}>{formattedTime}</Text>}
              </View>
              <View>
              </View>
            </View>
            <View style={{paddingRight: 10, flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity style={{paddingRight: 10}} onPress={() => { navigation.navigate('Search') }}>
                <MaterialCommunityIcons name='magnify' color='white' size={25}></MaterialCommunityIcons>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                share({text: `${location?.city} is currently ${Math.round(weather?.current?.temp)}°C | Get you up-to-date with the current weather now!`})
              }}>
                <MaterialCommunityIcons name='share-variant' color='white' size={25}></MaterialCommunityIcons>
              </TouchableOpacity>
            </View>
          </View>

          {/* body */}
          <WeatherPage weather={weather} currentSection={currentSection}></WeatherPage>

          {/* footer */}
          <Footer currentSection={currentSection} setCurrentSection={setCurrentSection}/>
        </ImageBackground>
      </TouchableOpacity>

      
      {isTaskbarOpen && <Taskbar navigation={navigation}></Taskbar>}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: 30,
    paddingBottom: 10,
    paddingLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center' 
  }
})

export default MainPage;