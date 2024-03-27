import { useState } from 'react'
import { StyleSheet, View, FlatList, TouchableOpacity, Image, Text } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'

import logoImg from '../../assets/logo.png'

export default Taskbar = ({navigation}) => {
    const [selectedLocation, setSelectedLocation] = useState(0)

    //3 following lists are just for UI
    const locations = [
        {'name': 'Hoan Kiem, VN', icon: <MaterialCommunityIcons name='weather-cloudy' size={16}/>, temp: '23°'},
        {'name': 'New York City', icon: <MaterialCommunityIcons name='weather-cloudy' size={16}/>, temp: '24°'},
        {'name': 'Ho Chi Minh', icon: <MaterialCommunityIcons name='weather-cloudy' size={16}/>, temp: '25°'}
    ]

    const featureList = [
        {icon: <MaterialCommunityIcons name='widgets' color='#87CEEB' size={18}/>, title: 'Add Widgets to Home Screen'},
        {icon: <MaterialCommunityIcons name='bell' color='#FFDB58' size={18}/>, title: 'Daily Summary Notification'},
        {icon: <MaterialCommunityIcons name='account-plus' color='#32CD32' size={18}/>, title: 'Refer a Friend'}
    ]

    const settingList = [
        'Settings', 'Restore to AdFree', 'AdChoices', 'Help', 'Remove Ads', 'Privacy Settings', 'About'
    ]

    const renderLocation = ( {item, index} ) => {
        selectedTextStyle = (index === selectedLocation) ? {color: '#2D5DA1', fontSize: 16, fontWeight: 'bold'} : {}
        return (
        <TouchableOpacity 
            onPress={() => setSelectedLocation(index)}
            style={{width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8}}
        >
            <Text style={[{fontSize: 15}, selectedTextStyle]}>{item.name}</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {index === selectedLocation && <MaterialCommunityIcons name='navigation-variant' color='#2D5DA1' size={20} style={{marginRight: 5}}></MaterialCommunityIcons>}
            {item.icon}
            <Text style={{paddingLeft: 10}}>{item.temp}</Text>
            </View>
        </TouchableOpacity>
        )
    }

    const renderFeatures = ( {item, index} ) => {
        return (
        <TouchableOpacity style={{width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', 
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
        <TouchableOpacity
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
              <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center'}}>
                <MaterialCommunityIcons name='pencil' size={16}></MaterialCommunityIcons>
                <Text style={{paddingLeft: 5, paddingRight: 2}}>Edit</Text>
              </TouchableOpacity>
            </View>
            
            <View style={{padding: 10, marginBottom: 5, borderBottomWidth: 0.2, borderBottomColor: 'grey'}}>
              <FlatList
                  data={locations}
                  renderItem={({item, index}) => renderLocation({ item, index })}
                  keyExtractor={(item) => item.name}
                  style={{width: '100%'}}
              />
              <TouchableOpacity>
                <View style={{width: '100%', flexDirection: 'row', alignItems: 'center', 
                  justifyContent: 'space-between', paddingVertical: 5, paddingRight: 0}}>
                  <Text style={{fontSize: 15}}>View 1 more locations</Text>
                  <MaterialCommunityIcons name='chevron-down' size={20}></MaterialCommunityIcons>
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
