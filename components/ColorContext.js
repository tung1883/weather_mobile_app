import React, { createContext, useState, useEffect } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ColorContext = createContext();

export const ColorProvider = ({ children }) => {
  const [isAuto, setIsAuto] = useState()
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const getColorTheme = async () => {
      let theme = await AsyncStorage.getItem('theme')

      if (!theme) {
        AsyncStorage.setItem('theme', 'auto')
        theme = 'auto'
      }
  
      if (theme === 'auto') {
        setIsAuto(true)
        if (Appearance.getColorScheme() === 'light') setIsDarkMode(false)
        else setIsDarkMode(true)
        return
      }
  
      if (theme === 'light') setIsDarkMode(false)
      else setIsDarkMode(true)
    }

    getColorTheme()
  }, []);

  useEffect(() => {
    let subscription = null 

    if (isAuto) {
      subscription = Appearance.addChangeListener(({ colorScheme }) => {
        if (colorScheme === 'light') setIsDarkMode(false)
        else setIsDarkMode(true)
      });
    }

    return () => subscription?.remove();
  }, [isAuto]);


  const toggleTheme = async (theme) => {
    if (theme === 'auto') {
      setIsAuto(true)
      if (Appearance.getColorScheme() === 'light') setIsDarkMode(false)
      else setIsDarkMode(true)
    }

    if (theme === 'light') setIsDarkMode(false)
    else setIsDarkMode(true)
    AsyncStorage.setItem('theme', theme)
  };

  return (
    <ColorContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ColorContext.Provider>
  );
};
