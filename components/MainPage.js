import React, { useContext, useEffect, useRef, useState } from "react";
import { ImageBackground, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import bgImg1 from '../assets/light_bg_1.jpg'
import bgImg2 from '../assets/light_bg_2.jpg'
import bgImg3 from '../assets/light_bg_3.jpg'
import darkBgImg1 from '../assets/dark_bg_1.png'
import darkBgImg2 from '../assets/dark_bg_2.png'
import radarDarkBg from '../assets/radar_dark_bg.png'
import radarWhiteBg from '../assets/radar_light_bg.png'
import Footer from "./ui/Footer";
import WeatherPage from "./ui/WeatherPage";
import Taskbar from "./ui/Taskbar";
import { FunctionalContext, WeatherContext } from "./Context";

const MainPage = ({ navigation }) => {
  const { location, weather, setWeather, getWeather, share, unit, getUnit} = useContext(WeatherContext)
  const { isDarkMode, t } = useContext(FunctionalContext)
  const [isTaskbarOpen, setIsTaskbarOpen] = useState(false);  
  const [formattedTime, setFormattedTime] = useState('');
  const [bgList, setBgList] = useState(isDarkMode ? [darkBgImg1, darkBgImg2] : [bgImg1, bgImg2, bgImg3])
  const [bg, setBg] = useState(Math.floor(Math.random() * (bgList.length - 1)))
  const intervals = useRef([])
  const [currentSection, setCurrentSection] = useState(0) //used to move between different weather sections, see sectionList in Footer.js
  
  useEffect(() => {
    if (currentSection == 3) return 

    setBgList(isDarkMode ? [darkBgImg1, darkBgImg2] : [bgImg1, bgImg2, bgImg3])
    setBg(Math.floor(Math.random() * (bgList.length - 1)))
  }, [isDarkMode, currentSection])

  useEffect(() => {
    if (currentSection == 3) return 
    
    setNextBg()
  }, [currentSection])

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

  const setNextBg = () => {
    setBg(bg => (bg + 1) % bgList.length)
    setTimeout(setNextBg, 1000)
  }
  
  const getBg = () => {
    if (currentSection == 3) return (isDarkMode) ? radarDarkBg : radarWhiteBg
    return bgList[bg]
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setIsTaskbarOpen(false)} style={{ width: "100%", height: "100%" }} activeOpacity={1}>
        <ImageBackground source={getBg()} style={{ width: "100%", height: "100%" }}>
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
                share({text: `${location?.city}${t('main.referText1')}${Math.round(weather?.current?.temp)}${getUnit('temp', unit)}${t('main.referText2')}`})
              }}>
                <MaterialCommunityIcons name='share-variant' color='white' size={25}></MaterialCommunityIcons>
              </TouchableOpacity>
            </View>
          </View>

          {/* body */}
          <WeatherPage currentSection={currentSection} setCurrentSection={setCurrentSection} navigation={navigation}></WeatherPage>

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
    justifyContent: 'space-between',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default MainPage;