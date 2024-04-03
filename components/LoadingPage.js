import React, { useEffect, useContext } from "react";
import { Image, StyleSheet, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import logoImg from "../assets/logo.png"
import { lightStyles, darkStyles } from "./defaultStyles";
import { FunctionalContext } from "./Context";

export default LoadingPage = ({navigation}) => {
  const { isDarkMode } = useContext(FunctionalContext);
  
  useEffect(() => {
      const timer = setTimeout(async () => {
          const notFirstTime = await AsyncStorage.getItem('notFirstTime') 
          navigation.replace((notFirstTime === 'true') ? 'Main' : 'LocationPermission'); // Replace the loading screen with the menu screen
      }, 2000); // Wait for 2 seconds before navigating to the menu
      return () => clearTimeout(timer); // Cleanup function to clear the timer
  }, [navigation]);

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

