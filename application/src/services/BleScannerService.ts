import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import { BleManager, Device } from 'react-native-ble-plx';
import { storeLocation } from './api';

export const BACKGROUND_BLE_TASK = 'BACKGROUND_BLE_TASK';

// A single instance of BleManager should be used
export const bleManager = new BleManager();

// Simple base64 decoder since React Native doesn't have a reliable built-in one
const decodeBase64 = (input: string) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  let str = input.replace(/=+$/, '');
  let output = '';
  for (let bc = 0, bs = 0, buffer, i = 0;
    buffer = str.charAt(i++);
    ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer, bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
  ) {
    buffer = chars.indexOf(buffer);
  }
  return output;
};

export const startForegroundScan = async (
  onDeviceFound?: (data: { deviceId: string; lat: number; lon: number; timestamp: string }) => void
) => {
  const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
  if (locationStatus !== 'granted') {
    console.error('Permission to access location was denied');
    return;
  }

  // Check if Bluetooth is actually powered on before scanning
  const btState = await bleManager.state();
  if (btState === 'PoweredOff') {
    try {
      await bleManager.enable();
    } catch (enableError) {
      console.error('User refused to enable Bluetooth or it is unsupported:', enableError);
      return;
    }
  }

  // We explicitly want to scan for our custom UUID to save battery, but passing null scans all
  bleManager.startDeviceScan(null, null, async (error, device) => {
    if (error) {
      // If we get an error, just log it instead of crashing the UI
      console.warn('BLE Scan Error:', error.message);
      return;
    }
    
    // Look for devices broadcasting our specific prefix inside their Service Data!
    let foundDeviceId: string | null = null;
    if (device?.serviceData) {
      for (const [uuid, base64Value] of Object.entries(device.serviceData)) {
        // Our custom UUID has 'feed' inside it (0000FEED-0000-1000-8000-00805F9B34FB)
        if (uuid.toLowerCase().includes('feed')) {
          try {
            const decodedId = decodeBase64(base64Value);
            if (decodedId.startsWith('SIH_TEAM_SAPPHIRE')) {
              foundDeviceId = decodedId;
              break;
            }
          } catch (e) {
            // Ignore malformed base64
          }
        }
      }
    }
    
    if (foundDeviceId) {
      console.log('Found Lost Device (via Service Data):', foundDeviceId);
      
      try {
        const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        const timestamp = new Date().toISOString();
        
        await storeLocation(
          foundDeviceId,
          location.coords.latitude,
          location.coords.longitude,
          timestamp
        );
        console.log('Successfully reported location for:', foundDeviceId);
        
        if (onDeviceFound) {
          onDeviceFound({
            deviceId: foundDeviceId,
            lat: location.coords.latitude,
            lon: location.coords.longitude,
            timestamp
          });
        }
      } catch (err) {
        console.error('Failed to get location or send to backend:', err);
      }
    }
  });
};

export const stopForegroundScan = () => {
  bleManager.stopDeviceScan();
};

// Define the background task
TaskManager.defineTask(BACKGROUND_BLE_TASK, async () => {
  try {
    // In background, we ideally want Location updates, or a background BLE scanner.
    // NOTE: react-native-ble-plx background scanning has limited support on iOS without specific setup.
    // For pure background location triggering (e.g. geofencing triggering a scan) you would use expo-location.
    
    // Example: fetch location
    const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
    console.log('Background Task running at:', location.coords);
    
    // We can briefly scan here if OS allows
    return null;
  } catch (error) {
    console.error('Background Task Error:', error);
    return null;
  }
});
