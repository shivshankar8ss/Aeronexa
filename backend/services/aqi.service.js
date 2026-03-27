const axios = require('axios');
const cache = require('../config/cache');

// AQI Category mapping
const getAqiCategory = (aqi) => {
  if (aqi <= 50)  return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
};

const getAqiColor = (aqi) => {
  if (aqi <= 50)  return '#22c55e';
  if (aqi <= 100) return '#eab308';
  if (aqi <= 150) return '#f97316';
  if (aqi <= 200) return '#ef4444';
  if (aqi <= 300) return '#9333ea';
  return '#be123c';
};

const getHealthEffect = (aqi) => {
  if (aqi <= 50)  return 'Air quality is satisfactory and poses little or no risk.';
  if (aqi <= 100) return 'Acceptable air quality; some pollutants may affect very sensitive people.';
  if (aqi <= 150) return 'Sensitive groups may experience health effects. General public less likely affected.';
  if (aqi <= 200) return 'Everyone may begin to experience health effects; sensitive groups more serious effects.';
  if (aqi <= 300) return 'Health alert: everyone may experience more serious health effects.';
  return 'Health warning of emergency conditions. Entire population likely to be affected.';
};

// Fetch from AQICN API
const fetchFromAQICN = async (lat, lon) => {
  const token = process.env.AQICN_TOKEN;
  if (!token || token === 'your_aqicn_api_token_here') {
    throw new Error('AQICN token not configured');
  }

  const url = `https://api.waqi.info/feed/geo:${lat};${lon}/?token=${token}`;
  const response = await axios.get(url, { timeout: 8000 });

  if (response.data.status !== 'ok') {
    throw new Error('AQICN API returned non-ok status');
  }

  const data = response.data.data;
  const aqi = data.aqi;
  const iaqi = data.iaqi || {};

  return {
    aqi: parseInt(aqi),
    category: getAqiCategory(aqi),
    color: getAqiColor(aqi),
    healthEffect: getHealthEffect(aqi),
    city: data.city?.name || '',
    dominantPollutant: data.dominentpol || 'pm25',
    pollutants: {
      pm25: iaqi.pm25?.v || 0,
      pm10: iaqi.pm10?.v || 0,
      o3:   iaqi.o3?.v   || 0,
      no2:  iaqi.no2?.v  || 0,
      co:   iaqi.co?.v   || 0,
      so2:  iaqi.so2?.v  || 0,
    },
    source: 'aqicn',
    fetchedAt: new Date(),
  };
};

// Fetch from OpenWeatherMap
const fetchFromOpenWeather = async (lat, lon) => {
  const key = process.env.OPENWEATHER_API_KEY;
  if (!key || key === 'your_openweathermap_api_key_here') {
    throw new Error('OpenWeather key not configured');
  }

  const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${key}`;
  const response = await axios.get(url, { timeout: 8000 });

  const list = response.data.list[0];
  const components = list.components;

  // OpenWeather uses 1-5 index, convert to EPA AQI approximate
  const owAqi = list.main.aqi;
  const aqiMap = { 1: 25, 2: 75, 3: 125, 4: 175, 5: 250 };
  const aqi = aqiMap[owAqi] || 50;

  return {
    aqi,
    category: getAqiCategory(aqi),
    color: getAqiColor(aqi),
    healthEffect: getHealthEffect(aqi),
    city: '',
    dominantPollutant: 'pm2_5',
    pollutants: {
      pm25: components.pm2_5  || 0,
      pm10: components.pm10   || 0,
      o3:   components.o3     || 0,
      no2:  components.no2    || 0,
      co:   components.co     || 0,
      so2:  components.so2    || 0,
    },
    source: 'openweather',
    fetchedAt: new Date(),
  };
};

// Simulated fallback (for development when API keys are not set)
const simulateAqi = (lat, lon) => {
  const seed = Math.abs(Math.sin(lat * 127.1 + lon * 311.7) * 43758.5453);
  const base = Math.floor((seed % 1) * 180) + 10;
  const timeVariation = Math.sin(Date.now() / 3600000) * 12;
  const aqi = Math.max(1, Math.min(400, Math.round(base + timeVariation)));

  return {
    aqi,
    category: getAqiCategory(aqi),
    color: getAqiColor(aqi),
    healthEffect: getHealthEffect(aqi),
    city: 'Simulated Location',
    dominantPollutant: 'pm25',
    pollutants: {
      pm25: Math.round(aqi * 0.4),
      pm10: Math.round(aqi * 0.6),
      o3:   Math.round(aqi * 0.3),
      no2:  Math.round(aqi * 0.25),
      co:   parseFloat((aqi * 0.02).toFixed(2)),
      so2:  Math.round(aqi * 0.1),
    },
    source: 'simulated',
    fetchedAt: new Date(),
  };
};

// Main fetch function with caching + fallback chain
const getCurrentAqi = async (lat, lon) => {
  const cacheKey = `aqi_${parseFloat(lat).toFixed(2)}_${parseFloat(lon).toFixed(2)}`;
  const cached = cache.get(cacheKey);
  if (cached) {
    return { ...cached, fromCache: true };
  }

  let result;

  try {
    result = await fetchFromAQICN(lat, lon);
  } catch (e1) {
    console.warn('⚠️  AQICN failed, trying OpenWeather:', e1.message);
    try {
      result = await fetchFromOpenWeather(lat, lon);
    } catch (e2) {
      console.warn('⚠️  OpenWeather failed, using simulation:', e2.message);
      result = simulateAqi(lat, lon);
    }
  }

  cache.set(cacheKey, result);
  return { ...result, fromCache: false };
};

module.exports = { getCurrentAqi, getAqiCategory, getAqiColor, getHealthEffect };
