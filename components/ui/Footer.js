import React, { useContext } from "react";
import { Text, View, StyleSheet, FlatList, Dimensions, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { darkStyles } from "../defaultStyles";
import { FunctionalContext } from "../Context";

const SCREEN_WIDTH = Dimensions.get('window').width

export const sectionList = [
  { title: 'today', icon: 'calendar' },
  { title: 'forecast', icon: 'clock' },
  { title: 'precip', icon: 'water' },
  { title: 'radar', icon: 'radar' },
  { title: 'sun', icon: 'weather-sunset' },
]

export default Footer = ({currentSection, setCurrentSection}) => {
  const { t, isDarkMode } = useContext(FunctionalContext)

  const renderSection = ({item, index}) => {
    const contentColor = (currentSection === index) ? ((!isDarkMode) ? '#2D5DA1' : "#068FFF") : darkStyles.secondaryBgColor

    return (
      <Pressable 
        onPress={() => setCurrentSection(index)}
        style={[{width: SCREEN_WIDTH / 5, alignItems: 'center', justifyContent: 'space-between', 
            paddingVertical: 7}, isDarkMode && { backgroundColor: 'black'}]}>
        <MaterialCommunityIcons name={item.icon} size={17} color={contentColor}/> 
        <Text style={{fontSize: 10, color: contentColor}}>{t('footer.' + item.title).toUpperCase()}</Text> 
      </Pressable>
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