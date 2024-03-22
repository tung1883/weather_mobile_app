import React, { useEffect } from "react";
import { Image, StyleSheet} from "react-native";
import styled from "styled-components/native";
import logoImg from "../assets/logo.png"
import AsyncStorage from "@react-native-async-storage/async-storage";

export const LoadingPage = ({navigation}) => {
  useEffect(() => {
      const timer = setTimeout(async () => {
          const notFirstTime = await AsyncStorage.getItem('notFirstTime') 
          navigation.replace((notFirstTime === 'true') ? 'Main' : 'LocationPermission'); // Replace the loading screen with the menu screen
      }, 2000); // Wait for 2 seconds before navigating to the menu
      return () => clearTimeout(timer); // Cleanup function to clear the timer
  }, [navigation]);

  return (
      <Container>
      <Image source={logoImg} style={styles.image}></Image>
      </Container>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: #1E1E1E;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
    resizeMode: 'contain', 
  },
});

