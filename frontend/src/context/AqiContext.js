import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const AqiContext = createContext(null);
export const useAqi = () => useContext(AqiContext);

export const AqiProvider = ({ children }) => {
  const { user } = useAuth();
  const [currentAqi, setCurrentAqi]   = useState(null);
  const [health, setHealth]           = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [history, setHistory]         = useState([]);
  const [stats, setStats]             = useState(null);
  const [heatmap, setHeatmap]         = useState([]);
  const [location, setLocation]       = useState(null);
  const [loadingAqi, setLoadingAqi]   = useState(false);
  const [locationError, setLocationError] = useState(null);
  const intervalRef = useRef(null);

  const getLocation = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        () => resolve({ lat: 25.5941, lon: 85.1376 }), // Fallback: Patna
        { timeout: 8000, maximumAge: 300000 }
      );
    });
  }, []);

  const fetchCurrentAqi = useCallback(async (loc) => {
    try {
      setLoadingAqi(true);
      const { lat, lon } = loc || location || { lat: 25.5941, lon: 85.1376 };
      const { data } = await api.get(`/aqi/current?lat=${lat}&lon=${lon}`);
      setCurrentAqi(data.data);

      // Auto-log exposure
      await api.post('/aqi/log', {
        latitude: lat, longitude: lon,
        aqi: data.data.aqi,
        duration: 60,
        pollutants: data.data.pollutants || {},
        city: data.data.city || '',
        source: data.data.source || 'aqicn',
      });

      return data.data;
    } catch (err) {
      console.error('AQI fetch error:', err);
    } finally {
      setLoadingAqi(false);
    }
  }, [location]);

  const fetchHealth = useCallback(async () => {
    try {
      const { data } = await api.get('/health');
      setHealth(data.data);
    } catch (err) {
      console.error('Health fetch error:', err);
    }
  }, []);

  const fetchPredictions = useCallback(async () => {
    try {
      const { data } = await api.get('/predict?steps=6');
      setPredictions(data.predictions || []);
    } catch (err) {
      console.error('Predict error:', err);
    }
  }, []);

  const fetchHistory = useCallback(async (days = 7) => {
    try {
      const { data } = await api.get(`/aqi/history?days=${days}&limit=100`);
      setHistory(data.logs || []);
      setStats(data.stats || null);
      setHeatmap(data.heatmap || []);
    } catch (err) {
      console.error('History error:', err);
    }
  }, []);

  const refresh = useCallback(async () => {
    if (!user) return;
    const toastId = toast.loading('Refreshing air quality data…');
    try {
      const loc = await getLocation();
      setLocation(loc);
      setLocationError(null);
      await Promise.all([
        fetchCurrentAqi(loc),
        fetchHealth(),
        fetchPredictions(),
        fetchHistory(),
      ]);
      toast.success('Data refreshed!', { id: toastId });
    } catch (err) {
      setLocationError(err.message);
      toast.error('Could not get location. Using fallback.', { id: toastId });
      await Promise.all([fetchCurrentAqi(), fetchHealth(), fetchPredictions(), fetchHistory()]);
    }
  }, [user, getLocation, fetchCurrentAqi, fetchHealth, fetchPredictions, fetchHistory]);

  // Initial load
  useEffect(() => {
    if (user) {
      refresh();
      // Auto-refresh every 10 minutes
      intervalRef.current = setInterval(refresh, 10 * 60 * 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [user]); 

  return (
    <AqiContext.Provider value={{
      currentAqi, health, predictions, history, stats, heatmap,
      location, loadingAqi, locationError,
      refresh, fetchHistory,
    }}>
      {children}
    </AqiContext.Provider>
  );
};
