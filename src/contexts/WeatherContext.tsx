import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type WeatherType = 'sunny' | 'rainy' | 'cloudy';

interface WeatherContextType {
  weather: WeatherType;
  setWeather: (weather: WeatherType) => void;
  isRaining: boolean;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export function WeatherProvider({ children }: { children: ReactNode }) {
  const [weather, setWeather] = useState<WeatherType>('cloudy');
  
  // Simulate weather changes - in real app, this would fetch from weather API
  useEffect(() => {
    // Random weather for demo - Bogor is famous for rain!
    const weatherOptions: WeatherType[] = ['rainy', 'cloudy', 'sunny'];
    const randomWeather = weatherOptions[Math.floor(Math.random() * weatherOptions.length)];
    setWeather(randomWeather);

    // Change weather every 2 minutes for demo
    const interval = setInterval(() => {
      const newWeather = weatherOptions[Math.floor(Math.random() * weatherOptions.length)];
      setWeather(newWeather);
    }, 120000);

    return () => clearInterval(interval);
  }, []);

  const isRaining = weather === 'rainy';

  return (
    <WeatherContext.Provider value={{ weather, setWeather, isRaining }}>
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeather() {
  const context = useContext(WeatherContext);
  if (context === undefined) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
}
