export const APP_MODE = import.meta.env?.MODE || 'development'

// Default: production -> '/api'; development -> 'http://localhost:8123/api' (can be overridden via VITE_API_BASE_URL)
export const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || (APP_MODE === 'production' ? '/api' : 'http://localhost:8123/api')

