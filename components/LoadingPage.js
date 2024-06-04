import React, { useEffect, useContext, useRef } from "react";
import { Image, StyleSheet, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import logoImg from "../assets/logo.png"
import { lightStyles, darkStyles } from "./defaultStyles";
import { FunctionalContext, WeatherContext } from "./Context";

export default LoadingPage = ({navigation}) => {
  const { isDarkMode } = useContext(FunctionalContext);
  const { location, weather } = useContext(WeatherContext)
  const notFirstTime = useRef(null)
  const timer = useRef(null)

  useEffect(() => {
    const navigate = async () => {
      if (notFirstTime.current === null) {
        notFirstTime.current = (await AsyncStorage.getItem('notFirstTime')) ? true : false
      }

      if (notFirstTime.current) {
        if (JSON.stringify(weather) !== '{}') navigation.replace('Main'); 
      }
      else {
        timer.current =  setTimeout(async () => {
            navigation.replace('LocationPermission'); 
        }, 2000);
      }
    }
    
    navigate()

    return () => clearTimeout(timer.current);
  }, [navigation, location, weather]);

  return (
      <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <Image source={logoImg} style={styles.image}></Image>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightStyles.bgColor,
    alignItems: 'center',
    justifyContent: 'center',
  },

  darkContainer: {
    backgroundColor: darkStyles.bgColor
  },

  image: {
    width: 100,
    height: 100,
    resizeMode: 'contain', 
  },
});

