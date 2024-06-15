import React, { useContext, useState } from "react";
import { View, Image, StyleSheet, Text, TouchableOpacity, Modal, ActivityIndicator } from "react-native";
import * as Location from 'expo-location';
import MapImg from "../assets/google_map_icon.png"
import { FunctionalContext, WeatherContext } from "./Context";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default LocationPermissionPage = ({navigation}) => {
  const { t, isDarkMode } = useContext(FunctionalContext)
  const { init, location, weather } = useContext(WeatherContext)
  const [isFetching, setIsFetching] = useState(false)

  const requestLocationPermission = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync()

        if (status == 'granted') {
            await AsyncStorage.setItem('notFirstTime', 'true')

            if (!location || !weather || Object.keys(location).length == 0 || Object.keys(weather).length == 0 ) {
              setIsFetching(true)
              await init()
              setIsFetching(false)
            }

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
            onPress={() => requestLocationPermission()}
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
        <Modal visible={isFetching} transparent animationType="fade">
                <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <ActivityIndicator size="large" color="black" />
                    <Text style={styles.loadingText}>{t('searchPage.fetch')}</Text>
                </View>
                </View>
            </Modal>
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
  },
  modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
      alignItems: 'center',
  },
  loadingText: {
      marginTop: 10,
  },
});

