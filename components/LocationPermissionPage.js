import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import * as Location from 'expo-location';
import styled from "styled-components/native";
import MapImg from "../assets/google_map_icon.png"

export const LocationPermissionPage = ({navigation}) => {
    const requestLocationPermission = async () => {
        try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        
        if (status === 'granted') {
            navigation.replace('Main')
        }

        } catch (error) {
        console.error('Error requesting location permission: ', error);
        }
    };

    return (
        <Container>
            <Image source={MapImg} style={styles.image}></Image>
            <Text style={{fontSize: 18, fontWeight: 'bold', 
                color: 'white', marginTop: 15, marginBottom: 15}}>Precise Weather Information</Text>
            <Text style={styles.text}>
                Enabling location services will provide you with 
                accurate weather forecasts, important local alerts and much more features
            </Text>

            <TouchableOpacity 
                onPress={requestLocationPermission}
                style={{...styles.button, marginBottom: 20}}
            >
                <Text style={styles.buttonText}>Allow Location Service </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
                style={styles.button}
            >
                <Text style={styles.buttonText}>No, I do not allow </Text>
            </TouchableOpacity>
        </Container>
    );
};

const Container = styled.View`
  flex: 1;
  background-color: #696969;
  display: flex;
  align-items: center;
`;

const styles = StyleSheet.create({
  image: {
    marginTop: '60%',
    width: 100,
    height: 100,
    resizeMode: 'contain', 
  },
  text: {
    paddingLeft: '10%',
    paddingRight: '10%',
    textAlign: 'center',
    color: 'white',
    marginBottom: '40%'
  },
  button: {
    backgroundColor: '#6495ED',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10, // Set corner radius to 10
    minWidth: 200
  },
  buttonText: {
    textAlign: 'center',
    color: 'white'
  }
});

