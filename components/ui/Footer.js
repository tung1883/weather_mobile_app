import React from "react";
import { Text, TouchableOpacity, View, StyleSheet, FlatList, Dimensions } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { lightStyles, darkStyles } from "../defaultStyles";

const SCREEN_WIDTH = Dimensions.get('window').width

export const sectionList = [
  { title: 'today', icon: 'calendar' },
  { title: 'forecast', icon: 'clock' },
  { title: 'precip', icon: 'water' },
  { title: 'radar', icon: 'radar' },
  { title: 'sun', icon: 'weather-sunset' },
]


export default Footer = ({currentSection, setCurrentSection}) => {
  const renderSection = ({item, index}) => {
    const contentColor = (currentSection === index) ? '#2D5DA1' : darkStyles.secondaryBgColor

    return (
      <TouchableOpacity 
        onPress={() => setCurrentSection(index)}
        style={{width: SCREEN_WIDTH / 5, alignItems: 'center', justifyContent: 'space-between', 
            paddingVertical: 7}}>
        <MaterialCommunityIcons name={item.icon} size={17} color={contentColor}/> 
        <Text style={{fontSize: 10, color: contentColor}}>{item.title.toUpperCase()}</Text> 
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.footer}>
    <FlatList
        data={sectionList}
        renderItem={({item, index}) => renderSection({ item, index })}
        keyExtractor={(item) => item.title}
        style={{width: '100%'}}
        horizontal={true}
    />
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    backgroundColor: 'white', 
    borderTopWidth: 0.5,
    borderTopColor: 'grey'
  }
})