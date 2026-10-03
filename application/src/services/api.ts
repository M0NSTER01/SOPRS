import axios from 'axios';

// ------------------------------------------------------------------
// IMPORTANT: API URL CONFIGURATION
// ------------------------------------------------------------------
// Development Backend (VS Code Dev Tunnels or Local IP)
// Set to PROD_URL for now to guarantee it works over the internet with ngrok
const DEV_URL = 'https://phone-lost-and-found.vercel.app'; 
// Production / Hosted Backend (Vercel)
const PROD_URL = 'https://phone-lost-and-found.vercel.app';
// ------------------------------------------------------------------

const PRIMARY_URL = __DEV__ ? DEV_URL : PROD_URL;

const api = axios.create({
  baseURL: PRIMARY_URL,
  timeout: 4000, // 4-second timeout so it fails over quickly if local is down
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to handle automatic fallback to Vercel if Local IP is unreachable
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    
    // If config doesn't exist, or we've already retried, throw error
    if (!config || config._retried) {
      return Promise.reject(error);
    }
    
    // If the request failed due to a network error or timeout (meaning local isn't reachable)
    if (error.code === 'ECONNABORTED' || error.message === 'Network Error' || !error.response) {
      // If we were trying the primary URL, switch to the production URL
      if (config.baseURL === PRIMARY_URL && PRIMARY_URL !== PROD_URL) {
        console.warn(`Primary backend unreachable. Falling back to production: ${PROD_URL}${config.url}`);
        config._retried = true;
        config.baseURL = PROD_URL;
        
        // Retry the request with the new base URL
        return axios(config);
      }
    }
    
    return Promise.reject(error);
  }
);

export const storeLocation = async (deviceId: string, latitude: number, longitude: number, timestamp: string) => {
  try {
    const response = await api.post('/storeLocation', {
      deviceId,
      latitude,
      longitude,
      timestamp,
    });
    return response.data;
  } catch (error) {
    console.error('API Error (storeLocation):', error);
    throw error;
  }
};

export const fetchDeviceLocation = async (deviceId: string) => {
  try {
    const response = await api.get(`/locatedevice/${deviceId}`);
    return response.data;
  } catch (error) {
    console.error('API Error (fetchDeviceLocation):', error);
    throw error;
  }
};

export const locateDevice = async (deviceId: string) => {
  try {
    const response = await api.get(`/locatedevice/${deviceId}`);
    return response.data;
  } catch (error) {
    console.error('Error locating device:', error);
    throw error;
  }
};

// 5. Report a device as lost
export const reportLost = async (deviceId: string) => {
  try {
    const response = await api.post(`/reportlost/${deviceId}`);
    return response.data;
  } catch (error) {
    console.error('Error reporting device as lost:', error);
    throw error;
  }
};

// 6. Mark a device as found (remove from lost registry)
export const markFound = async (deviceId: string) => {
  try {
    const response = await api.post(`/markfound/${deviceId}`);
    return response.data;
  } catch (error) {
    console.error('Error marking device as found:', error);
    throw error;
  }
};

export default api;
