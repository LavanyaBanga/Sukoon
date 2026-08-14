import React, { createContext, useContext, useEffect, useState } from 'react';

const SettingsContext = createContext(null);

export const SettingsProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem('sukoon_theme') || 'dark');
  const [reduceAnimations, setReduceAnimations] = useState(() => localStorage.getItem('sukoon_reduce_motion') === 'true');
  const [musicOn, setMusicOn] = useState(true);

  useEffect(() => {
    document.body.classList.toggle('light', theme === 'light');
    document.body.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('sukoon_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('sukoon_reduce_motion', String(reduceAnimations));
  }, [reduceAnimations]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  return (
    <SettingsContext.Provider
      value={{ theme, setTheme, toggleTheme, reduceAnimations, setReduceAnimations, musicOn, setMusicOn }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
