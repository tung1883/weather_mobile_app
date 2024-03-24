import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import * as Location from 'expo-location';
import styled from "styled-components/native";
import MapImg from "../assets/google_map_icon.png"
import i18n from "../functionalities/language/i18n";

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
                color: 'white', marginTop: 15, marginBottom: 15}}>{i18n.t('locationPermission.title')}</Text>
            <Text style={styles.text}>{i18n.t('locationPermission.subtext')}
            </Text>

            <TouchableOpacity 
                onPress={requestLocationPermission}
                style={{...styles.button, marginBottom: 20}}
            >
                <Text style={styles.buttonText}>{i18n.t('locationPermission.allowButton')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
                style={styles.button}
            >
                <Text 
                  onPress={() => navigation.replace('Search')}
                  style={styles.buttonText}
                >{i18n.t('locationPermission.rejectButton')} </Text>
            </TouchableOpacity>
        </Container>
    );
};

const Container = styled.View`
  flex: 1;
  background-color: #1E1E1E;
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

