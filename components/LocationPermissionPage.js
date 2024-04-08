import React, { useContext } from "react";
import { View, Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import * as Location from 'expo-location';
import MapImg from "../assets/google_map_icon.png"
import { FunctionalContext } from "./Context";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default LocationPermissionPage = ({navigation}) => {
  const { t, isDarkMode } = useContext(FunctionalContext)
  const requestLocationPermission = async () => {
      try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status === 'granted') {
          await AsyncStorage.setItem('notFirstTime', 'true')
          navigation.replace('Main')
      }

      } catch (error) {
      console.error('Error requesting location permission: ', error);
      }
  };

  return (
      <View style={[styles.container, isDarkMode && { backgroundColor: '#1E1E1E' }]}>
        <Image source={MapImg} style={styles.image}></Image>
        <Text style={[{fontSize: 18, fontWeight: 'bold', marginTop: 15, marginBottom: 15}, isDarkMode && { color: 'white' }]}>{t('locationPermission.title')}</Text>
        <Text style={[styles.text, isDarkMode && { color: 'white' }]}>{t('locationPermission.subtext')}
        </Text>

        <TouchableOpacity 
            onPress={requestLocationPermission}
            style={{...styles.button, marginBottom: 20}}
        >
            <Text style={styles.buttonText}>{t('locationPermission.allowButton')}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
            style={styles.button}
        >
            <Text 
              onPress={async () => {
                await AsyncStorage.setItem('notFirstTime', 'true')
                navigation.replace('Search')
              }}
              style={styles.buttonText}
            >{t('locationPermission.rejectButton')} </Text>
        </TouchableOpacity>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    display: 'flex',
    alignItems: 'center',
  },
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

