const getAdvice = (aqi, exposureHours = 0, weeklyAvgAqi = 0) => {
  const tips = [];

  // ── Immediate advice based on current AQI ──────
  if (aqi <= 50) {
    tips.push({ icon: '✅', text: 'Air quality is safe. Enjoy outdoor activities!' });
    tips.push({ icon: '🪟', text: 'Open windows to let in fresh air.' });
    tips.push({ icon: '🏃', text: 'Great day for exercise — go outside!' });
  } else if (aqi <= 100) {
    tips.push({ icon: '⚠️', text: 'Air quality is acceptable. Unusually sensitive people should limit prolonged exertion.' });
    tips.push({ icon: '🌬️', text: 'Ventilate your home carefully during peak traffic hours.' });
    tips.push({ icon: '🌳', text: 'Morning or evening walks are safer when AQI is lower.' });
  } else if (aqi <= 150) {
    tips.push({ icon: '😷', text: 'Wear a mask (N95/KN95) when going outdoors.' });
    tips.push({ icon: '🚫', text: 'Avoid strenuous outdoor activities.' });
    tips.push({ icon: '🪟', text: 'Keep windows and doors closed.' });
    tips.push({ icon: '🌿', text: 'Use an air purifier indoors if available.' });
  } else if (aqi <= 200) {
    tips.push({ icon: '🚨', text: 'Stay indoors as much as possible today.' });
    tips.push({ icon: '😷', text: 'Always wear N95 mask if you must go outside.' });
    tips.push({ icon: '🏠', text: 'Keep all windows and doors shut tightly.' });
    tips.push({ icon: '❌', text: 'Cancel or postpone outdoor exercise plans.' });
    tips.push({ icon: '🌿', text: 'Run air purifiers on high setting.' });
  } else {
    tips.push({ icon: '🚨', text: 'Emergency conditions. Avoid all outdoor exposure.' });
    tips.push({ icon: '🏥', text: 'Seek medical attention if experiencing breathing difficulty.' });
    tips.push({ icon: '😷', text: 'Wear respirator-grade mask if you must go outside.' });
    tips.push({ icon: '🔒', text: 'Seal gaps in windows and doors with tape if possible.' });
    tips.push({ icon: '📱', text: 'Alert family and neighbors about hazardous conditions.' });
  }

  // ── Advice based on cumulative exposure ────────
  if (exposureHours > 8) {
    tips.push({ icon: '😴', text: 'High cumulative exposure tracked. Rest and hydrate well.' });
  }
  if (weeklyAvgAqi > 100) {
    tips.push({ icon: '📊', text: 'Your weekly average AQI is elevated. Consider relocating temporarily.' });
  }

  // ── General wellness tips ──────────────────────
  tips.push({ icon: '💧', text: 'Drink plenty of water to help flush pollutants from your system.' });

  return tips.slice(0, 6);
};

module.exports = { getAdvice };
