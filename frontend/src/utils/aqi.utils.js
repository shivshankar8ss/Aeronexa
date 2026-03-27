export const getAqiMeta = (aqi) => {
  if (aqi <= 50)  return { label: 'Good',                         emoji: '🟢', cssClass: 'aqi-good',      textColor: '#16a34a', bgColor: '#f0fdf4', borderColor: '#bbf7d0', effect: 'Safe to breathe' };
  if (aqi <= 100) return { label: 'Moderate',                     emoji: '🟡', cssClass: 'aqi-moderate',  textColor: '#ca8a04', bgColor: '#fefce8', borderColor: '#fef08a', effect: 'Acceptable — sensitive people take care' };
  if (aqi <= 150) return { label: 'Unhealthy for Sensitive Groups',emoji: '🟠', cssClass: 'aqi-sensitive', textColor: '#ea580c', bgColor: '#fff7ed', borderColor: '#fed7aa', effect: 'Breathing discomfort possible' };
  if (aqi <= 200) return { label: 'Unhealthy',                    emoji: '🔴', cssClass: 'aqi-unhealthy', textColor: '#dc2626', bgColor: '#fef2f2', borderColor: '#fecaca', effect: 'Lung impact for all groups' };
  if (aqi <= 300) return { label: 'Very Unhealthy',               emoji: '🟣', cssClass: 'aqi-very-bad',  textColor: '#9333ea', bgColor: '#faf5ff', borderColor: '#e9d5ff', effect: 'Serious risk for everyone' };
  return           { label: 'Hazardous',                          emoji: '⚫', cssClass: 'aqi-hazardous', textColor: '#be123c', bgColor: '#fff1f2', borderColor: '#fecdd3', effect: 'Emergency conditions' };
};

export const getRiskMeta = (level) => {
  const map = {
    Low:      { textColor: '#16a34a', bgColor: '#f0fdf4', borderColor: '#bbf7d0' },
    Moderate: { textColor: '#ca8a04', bgColor: '#fefce8', borderColor: '#fef08a' },
    High:     { textColor: '#ea580c', bgColor: '#fff7ed', borderColor: '#fed7aa' },
    Critical: { textColor: '#dc2626', bgColor: '#fef2f2', borderColor: '#fecaca' },
  };
  return map[level] || map.Low;
};

export const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const formatDateFull = (dateStr) => {
  return new Date(dateStr).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

export const formatDateShort = (dateStr) => {
  return new Date(dateStr).toLocaleDateString([], { month: 'short', day: 'numeric' });
};
