import { useContext, useEffect, useState } from 'react'
import { StyleSheet, View, FlatList, TouchableOpacity, Image, Text } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'

import logoImg from '../../assets/logo.png'
import { FunctionalContext, WeatherContext } from '../Context';
import { putToFrontFavs } from '../../functionalities/favoriteLocations'

export default Taskbar = ({navigation}) => {
  const { location, share, setLocation, setWeather, getWeather, favs, setFavs, gps } = useContext(WeatherContext)
  const { isDarkMode, t } = useContext(FunctionalContext)
  const { unit, getUnit } = useContext(WeatherContext)
  const [isViewingMore, setIsViewingMore] = useState(false) //to change the UI when click "view more locations"

  useEffect(() => {
    let fetchList = async () => {
      favs.forEach(async (fav, index) => {
        if (!fav?.location?.city) {
          len.current++
          favs.splice(index, 1)
        }

        if (!fav?.weather) {
          const weather = (await getWeather({location: fav.location}))
          fav.weather = weather
        }
        
        if (index == favs.length - 1) setFavs([...favs])
      })
    }

    fetchList()
  }, [])

  const featureList = [
      {icon: <MaterialCommunityIcons name='widgets' color='#87CEEB' size={18}/>, title: t('taskbar.widget'), page: 'WidgetSettings'},
      {icon: <MaterialCommunityIcons name='bell' color='#FFDB58' size={18}/>, title: t('taskbar.noti'), page: 'NotificationSettings'},
      {icon: <MaterialCommunityIcons name='account-plus' color='#77D970' size={18}/>, title: t('taskbar.refer')}
  ]

  const settingList = [
    t('taskbar.settings'),  t('taskbar.help'), t('taskbar.privacy'),  t('taskbar.about')
  ]

  const renderLocation = ( {item, index} ) => {
    if (!item.location.city) {
      return <></>
    }

    let icon = item?.weather?.current?.weather[0]?.icon
    let temp = Math.round(item?.weather?.current?.temp)
    return (
    <TouchableOpacity 
        onPress={() => {
          putToFrontFavs({favs, setFavs, fav: {...item}})
          setLocation(item.location)
          setWeather(item.weather)
        }}
        style={{width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8}}
    >
        {
          (index === 0 && JSON.stringify(item.location) == JSON.stringify(location)) ?
          <Text style={[{color: '#2D5DA1', fontSize: 16, fontWeight: 'bold'}, isDarkMode && { color: '#068FFF'}]}>{item.location.city}</Text> :
            <Text style={[{fontSize: 15}, isDarkMode && { color: 'white' }]}>{item.location.city}</Text> 
        }
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {item.gps === true && <MaterialCommunityIcons name='navigation-variant' color={(isDarkMode) ? "#068FFF" : '#2D5DA1'} size={20} style={{marginRight: 5}}/>}
        <Image style={{width: 35, height: 20}} source={{uri: `https://openweathermap.org/img/wn/${icon}@2x.png`}}></Image>
        <Text style={[{minWidth: 30, textAlign: 'right'}, isDarkMode && { color: 'white' }]}>{`${temp}${getUnit('temp', unit)}`}</Text>
        </View>
    </TouchableOpacity>
    )
  }

  const renderSecondLocation = ( {item, index} ) => {
    if (!item.location.city) {
      return <></>
    }

    let icon = item?.weather?.current?.weather[0]?.icon
    let temp = Math.round(item?.weather?.current?.temp)
    return (
    <TouchableOpacity 
        onPress={() => {
          putToFrontFavs({favs, setFavs, fav: {...item}})
          setLocation(item.location)
          setWeather(item.weather)
        }}
        style={{width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8}}
    >
        <Text style={[{fontSize: 15}, isDarkMode && { color: 'white' }]}>{item.location.city}</Text> 
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {item.gps === true && <MaterialCommunityIcons name='navigation-variant' color='#2D5DA1' size={20} style={{marginRight: 5}}/>}
        <Image style={{width: 35, height: 20}} source={{uri: `https://openweathermap.org/img/wn/${icon}@2x.png`}}></Image>
        <Text style={[{minWidth: 30, textAlign: 'right'}, isDarkMode && { color: 'white' }]}>{temp + '°'}</Text>
        </View>
    </TouchableOpacity>
    )
  }

  const renderFeatures = ( {item, index} ) => {
    return (
      <TouchableOpacity 
        onPress={() => {
          if (index == 2) {
            share({text: t('taskbar.referText')})
            return
          }

          navigation.navigate(item.page)
        }}
        style={{width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', 
          paddingVertical: 10}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {item.icon}
          <Text style={[{paddingLeft: 5}, isDarkMode && { color: 'white' }]}>{item.title}</Text>
          </View>
          <MaterialCommunityIcons color={isDarkMode ? 'white' : 'black'} name='chevron-right' size={20}></MaterialCommunityIcons>
      </TouchableOpacity>
    )
  }

  const renderSettings = ( {item, index} ) => {
      return (
      <TouchableOpacity onPress={() => {
        if (index == 0) navigation.navigate('Settings')
      }}
          style={{width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', 
              paddingVertical: 10}}>
          <Text style={[{fontSize: 15}, isDarkMode && { color: 'white' }]}>{item}</Text>
          <MaterialCommunityIcons color={isDarkMode ? 'white' : 'black'} name='chevron-right' size={20}></MaterialCommunityIcons>
      </TouchableOpacity>
      )
  }

  return (
    <View style={[styles.taskbar, isDarkMode && { backgroundColor: '#1E1E1E' }]}>
      {/* logo */}
      <View style ={[styles.grid, {flexDirection: 'row', alignItems: 'center', paddingTop: 50, paddingBottom: 30}]}>
        <Image source={logoImg} style={styles.taskbarLogo}></Image>
        <Text style={[{marginLeft: 10, fontWeight: 'bold', fontSize: 18}, isDarkMode && { color: 'white' }]}>OpenWeather</Text>
      </View>

      {/* locations */}
      <View> 
        <View style={[styles.grid, {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}]}>
          <Text style={[{fontWeight: 'bold'}, isDarkMode && { color: 'white' }]}>{t('taskbar.location')}</Text>
          <TouchableOpacity 
            onPress={() => navigation.navigate('LocationSettings')}
            style={{flexDirection: 'row', alignItems: 'center'}}>
            <MaterialCommunityIcons color={isDarkMode ? 'white' : 'black'} name='pencil' size={16}></MaterialCommunityIcons>
            <Text style={[{paddingLeft: 5, paddingRight: 2}, isDarkMode && { color: 'white' }]}>{t('taskbar.locEdit')}</Text>
          </TouchableOpacity>
        </View>
        
        <View style={{padding: 10, marginBottom: 5, borderBottomWidth: 0.2, borderBottomColor: 'grey'}}>
          <FlatList
              data={favs.slice(0, 3)}
              renderItem={({item, index}) => renderLocation({ item, index })}
              keyExtractor={(item) => JSON.stringify(item.location.city + item.selected)}
              style={{width: '100%'}}
          />
          {
            isViewingMore && 
            <FlatList
              data={favs.slice(3, 11)}
              renderItem={({item, index}) => renderSecondLocation({ item, index })}
              keyExtractor={(item) => item?.location?.city}
              style={{width: '100%'}}
            />
          }
          {favs.length > 3 && <TouchableOpacity
            onPress={() => setIsViewingMore(!isViewingMore)}
          >
            <View style={{width: '100%', flexDirection: 'row', alignItems: 'center', 
              justifyContent: 'space-between', paddingVertical: 5, paddingRight: 0}}>
              <>
                <Text style={[{fontSize: 15}, isDarkMode && { color: 'white' }]}>
                  {(isViewingMore) ? 'View fewer locations' : 
                    `View more locations`}</Text>
                <MaterialCommunityIcons color={isDarkMode ? 'white' : 'black'} name={(isViewingMore) ? 'chevron-up' : 'chevron-down'} size={20}></MaterialCommunityIcons>
              </>
            </View>
          </TouchableOpacity>}
        </View>
      </View>
    
      {/* special features */}
      <View style={{padding: 10, marginBottom: 5, borderBottomWidth: 0.20, borderBottomColor: 'grey'}}>
          <FlatList
              data={featureList}
              renderItem={({item, index}) => renderFeatures({ item, index })}
              keyExtractor={(item) => item.title}
              style={{width: '100%'}}
          />
        </View>

      {/* settings */}
      <View style={{padding: 10}}>
        <FlatList
            data={settingList}
            renderItem={({item, index}) => renderSettings({ item, index })}
            keyExtractor={(item) => item}
            style={{width: '100%'}}
        />
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  taskbar: { 
      position: 'absolute', 
      top: 0, 
      left: 0, 
      width: '67%', 
      height: "100%", 
      backgroundColor: 'white', 
  },
  taskbarLogo: {
    width: 40,
    height: 40
  },
  grid: {
    padding: 10,
    paddingLeft: 10,
    marginBottom: 5,
    borderBottomWidth: 0.20,
    borderBottomColor: 'grey'
  },
  header: {
    paddingTop: 30,
    paddingBottom: 10,
    paddingLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  }, 
  footer: {
    backgroundColor: 'white', 
    borderTopWidth: 0.5,
    borderTopColor: 'grey'
  }
})

