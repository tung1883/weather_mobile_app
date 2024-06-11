import React, { useEffect, useState, useRef, useContext } from 'react';
import { View, Image, StyleSheet, Dimensions, Animated, Easing, Text } from 'react-native';
import { MaterialCommunityIcons} from '@expo/vector-icons';
import { FunctionalContext, WeatherContext } from '../Context';

export default Sunrise = ({animationDuration}) => {
  const [tempDeg, setTempDeg] = useState('0deg');
  const { weather } = useContext(WeatherContext)
  const { isDarkMode, t} = useContext(FunctionalContext)
  const ballAnimatedValue = useRef(new Animated.Value(0)).current;

  const getTime = (dt) => {
    if (!weather || !weather.timezone_offset) return '00:00'
    let date = (dt) ? new Date(dt * 1000) : new Date()
    let locationTime= new Date(date.getTime() + date.getTimezoneOffset() * 60000 + (1000 * weather.timezone_offset))
    let hour = locationTime.getHours();
    let minutes = locationTime.getMinutes()

    return `${(hour < 10) ? '0' + hour : hour}:${((minutes< 10)) ? '0' + minutes : minutes}`
  }

  function getTimeDifference(startDate, endDate) {
    let diff = endDate - startDate
    if (diff < 0) return '00:00'
    let mm = Math.round(diff / 60) % 60;
    let hh = Math.round(diff / 60 / 60);
    return `${hh < 10 ? '0' + hh : hh}:${mm < 10 ? '0' + mm : mm}`
  }

  const startAnimation = (sunPercent) => {
    Animated.timing(ballAnimatedValue, {
      toValue: sunPercent > 1 ? 1 : sunPercent,
      duration: animationDuration,
      useNativeDriver: true,
      easing: Easing.linear
    }).start();
  }

  useEffect(() => { 
    if (weather?.daily?.length > 0) {
      let sunPercent = (Date.now() / 1000 - weather?.daily[0]?.sunrise) / (weather?.daily[0]?.sunset - weather?.daily[0]?.sunrise)
      let angleTilt = (weather?.daily[0]?.sunset - Date.now() / 1000) / (weather?.daily[0]?.sunset - weather?.daily[0]?.sunrise)
      if (angleTilt < 0) angleTilt = 1
      if (angleTilt > 1) angleTilt = 0
      angleTilt = angleTilt * 180
  
      ballAnimatedValue.addListener((val) => {
        setTempDeg((angleTilt * val.value) + 'deg');
        let r = ((angleTilt * val.value) * Math.PI)/180;
      });
  
      startAnimation(sunPercent);
    }
  }, [weather]);

  return (
    <>
      {
        weather && weather?.daily?.length > 0 ?
        <View style={{paddingVertical: 10, justifyContent: 'center', backgroundColor: isDarkMode ? '#696969' : 'rgba(255, 255, 255, 0.6)', marginHorizontal: 10, borderRadius: 20}}>
          <Text style={{padding: 10, paddingLeft: 20, fontSize: 16, fontWeight: 'bold', color: isDarkMode ? 'white' : 'black'}}>{t('sun.title').toUpperCase()}</Text>
          <View style = {[styles.miniContainer]}>
            <View style = {[styles.arc]} />
              <Image style={[styles.globe]} source={require('../../assets/globe.png')} />
              <Animated.View style = {[styles.sunView, {transform: [{rotate: tempDeg}]}]}>
                <MaterialCommunityIcons style={[styles.sun]} name='white-balance-sunny' size={20} color='#FAEF5D'></MaterialCommunityIcons>
              </Animated.View>
              <View style = {[styles.greenView]}>
                <View style = {[styles.greenFillView]}>
                  <Animated.View style = {[styles.greenFill]} />
                </View>
              </View>
              <View style = {[styles.borderBottom, { borderColor: isDarkMode ? 'white' : 'grey'}]} />
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingTop: 5}}>
            <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 30}}>
              <MaterialCommunityIcons name='arrow-up' size={18} color={isDarkMode ? 'white' : 'black'}></MaterialCommunityIcons>
              <Text style={{marginLeft: 2, color: isDarkMode ? 'white' : 'black'}}>{getTime(weather?.daily[0]?.sunrise)}</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', marginRight: 30}}>
              <Text style={{marginRight: 2, color: isDarkMode ? 'white' : 'black'}}>{getTime(weather?.daily[0]?.sunset)}</Text>
              <MaterialCommunityIcons name='arrow-down' size={18} color={isDarkMode ? 'white' : 'black'}></MaterialCommunityIcons>
            </View>
          </View>
          <View style={{padding: 20, paddingBottom: 10}}>
            <Text style={{paddingBottom: 10, color: isDarkMode ? 'white' : 'black'}}>{t('sun.length')} - <Text style={{color: '#E9B824'}}>{getTimeDifference(weather?.daily[0]?.sunrise, weather?.daily[0]?.sunset)}</Text></Text>
            <Text style={{color: isDarkMode ? 'white' : 'black'}}>{t('sun.remain')} - <Text style={{color: '#E9B824'}}>{getTimeDifference((Date.now() / 1000 > weather?.daily[0]?.sunrise) ? Date.now() / 1000 : weather?.daily[0]?.sunrise , weather?.daily[0]?.sunset)}</Text></Text>
          </View>
        </View>
        : <View></View>
      }
    </>
  );
}

const styles = StyleSheet.create ({
  miniContainer: {
    justifyContent: 'flex-end',
    borderRadius: 25,
    width: Dimensions.get('screen').width - 30,
    marginLeft: 5
  },
  arc: {
    width: 300,
    height: 150,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#6DA4AA',
    alignSelf: 'center',
    borderTopLeftRadius: 150,
    borderTopRightRadius: 150,
    zIndex: 1
  },
  sunView: {
    borderWidth: 2,
    borderColor: 'transparent',
    zIndex: 10,
    width: 280,
    alignSelf: 'center',
    position: 'absolute',
  },
  globe: {
    width: 300,
    height: 150,
    marginLeft: 30,
    zIndex: 1,
    backgroundColor: 'transparent',
    borderRadius: 20,
    position: 'absolute'
  },  
  sun: {
    marginLeft: -21,
    marginTop: -9.5,
    zIndex: 10,
    backgroundColor: 'transparent',
    height: 20,
    width: 20,
    borderRadius: 20,
    position: 'absolute'
  },
  borderBottom: {
    borderWidth: 1,
    width: Dimensions.get('screen').width - 60,
    alignSelf: 'center',
    position: 'absolute',
    zIndex: 1
  }
})
