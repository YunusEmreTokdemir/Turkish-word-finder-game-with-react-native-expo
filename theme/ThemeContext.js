import React, { createContext, useState, useContext } from 'react';

export const lightTheme = {
  backgroundColor: '#ffffff',
  textColor: '#000000',
  buttonColor: '#e0e0e0',
  buttonTextColor: '#000000',
};

export const darkTheme = {
  backgroundColor: '#121212',
  textColor: '#ffffff',
  buttonColor: '#333333',
  buttonTextColor: '#ffffff',
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(lightTheme);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === lightTheme ? darkTheme : lightTheme));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
