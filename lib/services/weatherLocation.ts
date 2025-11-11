// Weather and Location Services

export interface WeatherData {
  condition: string; // sunny, cloudy, rainy, etc.
  temperature: number; // in Fahrenheit
  humidity: number; // percentage
  windSpeed: number; // mph
  icon: string;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
}

export interface DailyConditions {
  weather: WeatherData;
  location: LocationData;
  timestamp: string;
}

// Get user's current location
export const getCurrentLocation = (): Promise<LocationData> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Reverse geocoding to get address
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();

          resolve({
            latitude,
            longitude,
            address: data.display_name,
            city: data.address.city || data.address.town,
            state: data.address.state,
            country: data.address.country,
          });
        } catch (error) {
          // Return coordinates even if reverse geocoding fails
          resolve({
            latitude,
            longitude,
          });
        }
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
};

// Get weather data for location
export const getWeatherData = async (
  latitude: number,
  longitude: number
): Promise<WeatherData> => {
  try {
    // Using Open-Meteo API (free, no API key required)
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&temperature_unit=fahrenheit&wind_speed_unit=mph`
    );
    const data = await response.json();

    const weatherCode = data.current.weather_code;
    const condition = getWeatherCondition(weatherCode);
    const icon = getWeatherIcon(weatherCode);

    console.log("Weather Data:", data);

    return {
      condition,
      temperature: Math.round(data.current.temperature_2m),
      humidity: data.current.relative_humidity_2m,
      windSpeed: Math.round(data.current.wind_speed_10m),
      icon,
    };
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
};

// Get both location and weather
export const getDailyConditions = async (): Promise<DailyConditions> => {
  try {
    const location = await getCurrentLocation();
    const weather = await getWeatherData(location.latitude, location.longitude);
    console.log("Daily Conditions:", { weather, location });

    return {
      weather,
      location,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error getting daily conditions:", error);
    throw error;
  }
};

// Convert weather code to condition string
const getWeatherCondition = (code: number): string => {
  if (code === 0) return "Clear";
  if (code === 1 || code === 2) return "Partly Cloudy";
  if (code === 3) return "Cloudy";
  if (code === 45 || code === 48) return "Foggy";
  if (code >= 51 && code <= 57) return "Drizzle";
  if (code >= 61 && code <= 67) return "Rainy";
  if (code >= 71 && code <= 77) return "Snowy";
  if (code >= 80 && code <= 82) return "Rain Showers";
  if (code >= 85 && code <= 86) return "Snow Showers";
  if (code >= 95) return "Thunderstorm";
  return "Unknown";
};

// Get weather icon emoji
const getWeatherIcon = (code: number): string => {
  if (code === 0) return "☀️";
  if (code === 1 || code === 2) return "⛅";
  if (code === 3) return "☁️";
  if (code === 45 || code === 48) return "🌫️";
  if (code >= 51 && code <= 57) return "🌦️";
  if (code >= 61 && code <= 67) return "🌧️";
  if (code >= 71 && code <= 77) return "🌨️";
  if (code >= 80 && code <= 82) return "🌧️";
  if (code >= 85 && code <= 86) return "🌨️";
  if (code >= 95) return "⛈️";
  return "🌤️";
};

// Fake weather data for demo/testing
export const getFakeWeatherData = (): WeatherData => {
  const conditions = [
    { condition: "Sunny", icon: "☀️", temp: 75, humidity: 45, wind: 8 },
    { condition: "Partly Cloudy", icon: "⛅", temp: 68, humidity: 55, wind: 12 },
    { condition: "Cloudy", icon: "☁️", temp: 62, humidity: 65, wind: 15 },
    { condition: "Rainy", icon: "🌧️", temp: 58, humidity: 85, wind: 18 },
  ];
  
  const random = conditions[Math.floor(Math.random() * conditions.length)];
  return {
    condition: random.condition,
    temperature: random.temp,
    humidity: random.humidity,
    windSpeed: random.wind,
    icon: random.icon,
  };
};

// Fake location data for demo/testing
export const getFakeLocationData = (): LocationData => {
  return {
    latitude: 37.7749,
    longitude: -122.4194,
    address: "123 Solar Avenue, San Francisco, CA 94103, USA",
    city: "San Francisco",
    state: "California",
    country: "USA",
  };
};
