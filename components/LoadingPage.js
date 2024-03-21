import React, { useEffect } from "react";
import { Image, StyleSheet} from "react-native";
import styled from "styled-components/native";
import logoImg from "../assets/logo.png"

export const LoadingPage = ({navigation, route}) => {
  useEffect(() => {
      const timer = setTimeout(() => {
          navigation.replace((route?.params?.firstTimeUser) ? 'LocationPermission' : "Main"); // Replace the loading screen with the menu screen
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
  background-color: #696969;
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

