import React, { createContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ColorContext = createContext();

export const ColorProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // useEffect(() => {
  //   // Load theme preference from AsyncStorage
  //   AsyncStorage.getItem('darkModeEnabled').then((value) => {
  //     setIsDarkMode(value === 'true');
  //   });
  // }, []);

  const toggleTheme = async () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    await AsyncStorage.setItem('darkModeEnabled', JSON.stringify(newMode));
  };

  return (
    <ColorContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ColorContext.Provider>
  );
};
