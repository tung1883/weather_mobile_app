import { useEffect, useState } from 'react'
import { StyleSheet, View, FlatList, TouchableOpacity, Image, Text } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'

import logoImg from '../../assets/logo.png'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default Taskbar = ({navigation, setLocation, location, setWeather, getWeather, fav, setFavs}) => {
    const [selectedLocation, setSelectedLocation] = useState(location?.city)
    const [locationList, setLocationList] = useState([])
    const [isViewingMore, setIsViewingMore] = useState(false) //to change the UI when click "view more locations"

    useEffect(() => {
      let fetchFavs = async () => {
        AsyncStorage.getItem('favoriteLocations')
        .then((result) => {
          return JSON.parse(result)
        })
        .then((data) => {
          let tempList = []
          data.forEach(async (item, index) => {
            const weather = (await getWeather({location: item.location}))
            
            if (weather) {
              tempList.push({name: item.location.city, icon: weather.current.weather[0].icon, temp: Math.round(weather.current.temp)})
            }
          
            if (index === data.length - 1 || index > 9) {
              return setLocationList(tempList)
            }
          })
        })
      }

      fetchFavs()
    }, [])

    const featureList = [
        {icon: <MaterialCommunityIcons name='widgets' color='#87CEEB' size={18}/>, title: 'Add Widgets to Home Screen', page: 'WidgetSettings'},
        {icon: <MaterialCommunityIcons name='bell' color='#FFDB58' size={18}/>, title: 'Daily Summary Notification', page: 'NotificationSettings'},
        {icon: <MaterialCommunityIcons name='account-plus' color='#32CD32' size={18}/>, title: 'Refer a Friend'}
    ]

    const settingList = [
        'Settings', 'Restore to AdFree', 'AdChoices', 'Help', 'Remove Ads', 'Privacy Settings', 'About'
    ]

    const renderLocation = ( {item, index} ) => {
        selectedTextStyle = (item.name === selectedLocation) ? {color: '#2D5DA1', fontSize: 16, fontWeight: 'bold'} : {}
        return (
        <TouchableOpacity 
            onPress={() => {
              setSelectedLocation(item.name)
              setLocation({city: item.name})
            }}
            style={{width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8}}
        >
            <Text style={[{fontSize: 15}, selectedTextStyle]}>{item.name}</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {item.name === selectedLocation && <MaterialCommunityIcons name='navigation-variant' color='#2D5DA1' size={20} style={{marginRight: 5}}></MaterialCommunityIcons>}
            <Image style={{width: 35, height: 20}} source={{uri: `https://openweathermap.org/img/wn/${item.icon}@2x.png`}}></Image>
            <Text style={{minWidth: 30, textAlign: 'right'}}>{item.temp + '°'}</Text>
            </View>
        </TouchableOpacity>
        )
    }

    const renderFeatures = ( {item, index} ) => {
        return (
        <TouchableOpacity 
          onPress={() => {
            if (index == 2) return
            navigation.navigate(item.page)
          }}
          style={{width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', 
            paddingVertical: 10}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {item.icon}
            <Text style={{paddingLeft: 5}}>{item.title}</Text>
            </View>
            <MaterialCommunityIcons name='chevron-right' size={20}></MaterialCommunityIcons>
        </TouchableOpacity>
        )
    }

    const renderSettings = ( {item, index} ) => {
        return (
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}
            style={{width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', 
                paddingVertical: 10}}>
            <Text style={{fontSize: 15}}>{item}</Text>
            <MaterialCommunityIcons name='chevron-right' size={20}></MaterialCommunityIcons>
        </TouchableOpacity>
        )
    }

    return (
        <View style={styles.taskbar}>
          {/* logo */}
          <View style ={[styles.grid, {flexDirection: 'row', alignItems: 'center', paddingTop: 50, paddingBottom: 30}]}>
            <Image source={logoImg} style={styles.taskbarLogo}></Image>
            <Text style={{marginLeft: 10, fontWeight: 'bold', fontSize: 18}}>OpenWeather</Text>
          </View>

          {/* locations */}
          <View> 
            <View style={[styles.grid, {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}]}>
              <Text style={{fontWeight: 'bold'}}>Locations</Text>
              <TouchableOpacity 
                onPress={() => navigation.navigate('LocationSettings')}
                style={{flexDirection: 'row', alignItems: 'center'}}>
                <MaterialCommunityIcons name='pencil' size={16}></MaterialCommunityIcons>
                <Text style={{paddingLeft: 5, paddingRight: 2}}>Edit</Text>
              </TouchableOpacity>
            </View>
            
            <View style={{padding: 10, marginBottom: 5, borderBottomWidth: 0.2, borderBottomColor: 'grey'}}>
              <FlatList
                  data={locationList.slice(0, 3)}
                  renderItem={({item, index}) => renderLocation({ item, index })}
                  keyExtractor={(item) => item?.location?.city}
                  style={{width: '100%'}}
              />
              {
                isViewingMore && 
                <FlatList
                  data={locationList.slice(3, 11)}
                  renderItem={({item, index}) => renderLocation({ item, index })}
                  keyExtractor={(item) => item?.location?.city}
                  style={{width: '100%'}}
              />
              }
              <TouchableOpacity
                onPress={() => setIsViewingMore(!isViewingMore)}
              >
                <View style={{width: '100%', flexDirection: 'row', alignItems: 'center', 
                  justifyContent: 'space-between', paddingVertical: 5, paddingRight: 0}}>
                  {(locationList.length > 3) &&
                    <>
                      <Text style={{fontSize: 15}}>
                        {(isViewingMore) ? 'View fewer locations' : 
                          `View ${locationList.length - 3} more locations`}</Text>
                      <MaterialCommunityIcons name={(isViewingMore) ? 'chevron-up' : 'chevron-down'} size={20}></MaterialCommunityIcons>
                    </>
                  }
                </View>
              </TouchableOpacity>
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
