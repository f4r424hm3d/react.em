import axios from "axios";

const api = axios.create({
  baseURL: "https://www.educationmalaysia.in/api", // ✅ Correct base URL
  timeout: 30000, // 30 second timeout for better reliability
  headers: {
    "x-api-key": "vN7kO8pM6vGz1Nz0Vw4k5AjcB5n9hTzY6QsErK8gNbE=", // ✅ Your real API key
  },
});

// Simple request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`[API] → ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[API] Request setup failed:', error);
    return Promise.reject(error);
  }
);

// Simple response interceptor for logging
api.interceptors.response.use(
  (response) => {
    console.log(`[API] ✓ ${response.config.method?.toUpperCase()} ${response.config.url}`);
    return response;
  },
  (error) => {
    const url = error.config?.url || 'unknown';
    const method = error.config?.method?.toUpperCase() || 'GET';
    
    if (error.code === 'ECONNABORTED') {
      console.error(`[API] ⏱ Timeout: ${method} ${url}`);
    } else if (!error.response) {
      console.error(`[API] ✗ Network Error: ${method} ${url}`, error.message);
    } else {
      console.error(`[API] ✗ ${error.response.status}: ${method} ${url}`);
    }
    
    return Promise.reject(error);
  }
);

export default api;
