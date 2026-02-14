import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
  timeout: 30000, // 30 second timeout for better reliability
  headers: {
    "x-api-key": import.meta.env.VITE_API_KEY,
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
    // Check if the request was canceled
    if (error.code === "ERR_CANCELED" || error.name === "CanceledError") {
      // Do not log canceled requests
      return Promise.reject(error);
    }

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
