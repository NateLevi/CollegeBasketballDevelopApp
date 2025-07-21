// API Configuration for different environments

const config = {
  development: {
    apiUrl: 'http://localhost:5000'
  },
  production: {
    apiUrl: import.meta.env.VITE_API_URL || 'https://collegedevelopapp.onrender.com'
  }
};

const environment = import.meta.env.MODE || 'development';

export const API_CONFIG = config[environment as keyof typeof config] || config.development;

export const API_ENDPOINTS = {
  basketballStats: `${API_CONFIG.apiUrl}/basketball-stats`,
  playerImage: (playerName: string) => `${API_CONFIG.apiUrl}/player-image/${encodeURIComponent(playerName)}`,
  playerProgression: (playerName: string) => `${API_CONFIG.apiUrl}/player-progression/${encodeURIComponent(playerName)}`
}; 