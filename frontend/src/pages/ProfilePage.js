import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [prefs, setPrefs] = useState({
    notifications:    user?.preferences?.notifications    ?? true,
    alertThreshold:   user?.preferences?.alertThreshold   ?? 100,
    units:            user?.preferences?.units            ?? 'metric',
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await api.put('/auth/preferences', prefs);
      updateUser(data.user);
      toast.success('Preferences saved!');
    } catch {
      toast.error('Failed to save preferences.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Profile</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage your account and preferences</p>
      </div>

      {/* Account Info */}
      <div className="card">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Account</p>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center text-2xl font-bold">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900">{user?.name}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <p className="text-xs text-gray-400 mt-0.5 font-mono">
              Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-gray-50 rounded-xl">
            <p className="text-xs text-gray-400 font-mono">User ID</p>
            <p className="text-xs font-mono text-gray-600 truncate mt-0.5">{user?.id || user?._id}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-xl">
            <p className="text-xs text-gray-400 font-mono">Account Type</p>
            <p className="text-xs font-mono text-gray-600 mt-0.5">Standard</p>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="card">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Preferences</p>
        <div className="space-y-5">

          {/* Notifications toggle */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-800">AQI Notifications</p>
              <p className="text-xs text-gray-400 mt-0.5">Get alerts when AQI exceeds threshold</p>
            </div>
            <button
              onClick={() => setPrefs((p) => ({ ...p, notifications: !p.notifications }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200
                ${prefs.notifications ? 'bg-blue-600' : 'bg-gray-200'}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200
                  ${prefs.notifications ? 'translate-x-6' : 'translate-x-1'}`}
              />
            </button>
          </div>

          {/* Alert threshold */}
          <div>
            <div className="flex justify-between mb-2">
              <div>
                <p className="text-sm font-semibold text-gray-800">Alert Threshold</p>
                <p className="text-xs text-gray-400 mt-0.5">Alert me when AQI exceeds this value</p>
              </div>
              <span className="text-sm font-bold text-blue-600">{prefs.alertThreshold}</span>
            </div>
            <input
              type="range"
              min={50} max={300} step={10}
              value={prefs.alertThreshold}
              onChange={(e) => setPrefs((p) => ({ ...p, alertThreshold: parseInt(e.target.value) }))}
              className="w-full accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1 font-mono">
              <span>50 (Moderate)</span><span>300 (Hazardous)</span>
            </div>
          </div>

          {/* Units */}
          <div>
            <p className="text-sm font-semibold text-gray-800 mb-2">Units</p>
            <div className="flex gap-2">
              {['metric', 'imperial'].map((u) => (
                <button
                  key={u}
                  onClick={() => setPrefs((p) => ({ ...p, units: u }))}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all
                    ${prefs.units === u
                      ? 'bg-blue-50 border-blue-200 text-blue-700'
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                >
                  {u.charAt(0).toUpperCase() + u.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button onClick={handleSave} disabled={saving} className="btn-primary mt-6">
          {saving ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving…
            </span>
          ) : 'Save Preferences'}
        </button>
      </div>

      {/* About */}
      <div className="card">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">About Aeronexa</p>
        <div className="space-y-2 text-sm text-gray-600">
          <p>🌬️ <strong>Version:</strong> 1.0.0</p>
          <p>📡 <strong>Data sources:</strong> AQICN, OpenWeatherMap</p>
          <p>🔄 <strong>Refresh interval:</strong> Every 10 minutes</p>
          <p>🧠 <strong>Prediction model:</strong> Moving average with linear trend</p>
          <p>💾 <strong>Cache TTL:</strong> 10 minutes</p>
        </div>
      </div>
    </div>
  );
}
