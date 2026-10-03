import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  PermissionsAndroid,
  Platform,
  ScrollView,
  ActivityIndicator,
  Animated,
  Easing,
  Modal,
} from 'react-native';
import { startForegroundScan, stopForegroundScan, BACKGROUND_BLE_TASK } from '../services/BleScannerService';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { Radar, Play, Square, Wifi, Shield, CheckCircle2, Radio, Activity, MessageCircle } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import CircuitBackground from '../components/CircuitBackground';
import AnonymousChat from '../components/AnonymousChat';
import { useAuth } from '../contexts/AuthContext';

interface ScanResult {
  deviceId: string;
  timestamp: string;
  lat: number;
  lon: number;
}

export default function ScannerScreen() {
  const { user } = useAuth();
  const { colors, theme } = useTheme();
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [selectedDeviceChat, setSelectedDeviceChat] = useState<any>(null);

  // Radar Pulse Animation
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let animation: Animated.CompositeAnimation | null = null;
    if (isScanning) {
      animation = Animated.loop(
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2200,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        })
      );
      animation.start();
    } else {
      pulseAnim.setValue(0);
    }

    return () => {
      if (animation) animation.stop();
    };
  }, [isScanning, pulseAnim]);

  useEffect(() => {
    return () => {
      stopForegroundScan();
    };
  }, []);

  const handleDeviceFound = (device: ScanResult) => {
    setScanResults((prev) => {
      // Avoid immediate duplicates
      if (prev.length > 0 && prev[0].deviceId === device.deviceId) return prev;
      return [device, ...prev.slice(0, 5)];
    });
  };

  const toggleScan = async () => {
    if (isScanning) {
      stopForegroundScan();
      setIsScanning(false);

      const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_BLE_TASK);
      if (isRegistered) {
        await Location.stopLocationUpdatesAsync(BACKGROUND_BLE_TASK);
      }
    } else {
      if (Platform.OS === 'android' && Platform.Version >= 31) {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        ]);

        if (
          granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] !== PermissionsAndroid.RESULTS.GRANTED ||
          granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] !== PermissionsAndroid.RESULTS.GRANTED
        ) {
          Alert.alert('Permission Denied', 'Bluetooth permissions are required for scanning.');
          return;
        }
      }

      const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
      if (foregroundStatus !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required for scanning.');
        return;
      }

      const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
      if (backgroundStatus === 'granted') {
        await Location.startLocationUpdatesAsync(BACKGROUND_BLE_TASK, {
          accuracy: Location.Accuracy.Balanced,
          distanceInterval: 10,
          deferredUpdatesInterval: 1000 * 60 * 1,
        });
      }

      startForegroundScan(handleDeviceFound);
      setIsScanning(true);
    }
  };

  const pulseScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1.4],
  });

  const pulseOpacity = pulseAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.8, 0.4, 0],
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CircuitBackground />
      <ScrollView contentContainerStyle={styles.scrollContent}>
      {/* Radar Hub Card */}
      <View style={[styles.radarCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.consoleHeader}>
          <View style={styles.consoleHeaderLeft}>
            <View style={[styles.pulseDot, { backgroundColor: isScanning ? colors.emerald : colors.subText }]} />
            <Text style={[styles.consoleHeaderText, { color: colors.text }]}>PEER BEACON RADAR</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: isScanning ? colors.emeraldBg : colors.badgeBg, borderColor: isScanning ? 'rgba(16,185,129,0.3)' : colors.border }]}>
            <Text style={[styles.statusBadgeText, { color: isScanning ? colors.emerald : colors.sky }]}>
              {isScanning ? 'SCANNING' : 'STANDBY'}
            </Text>
          </View>
        </View>

        {/* Animated Sonar Dish */}
        <View style={styles.sonarContainer}>
          {isScanning && (
            <Animated.View
              style={[
                styles.pulseRing,
                {
                  borderColor: colors.sky,
                  transform: [{ scale: pulseScale }],
                  opacity: pulseOpacity,
                },
              ]}
            />
          )}

          <View style={[styles.outerRadarRing, { borderColor: isScanning ? colors.sky : colors.border }]}>
            <View style={[styles.innerRadarRing, { borderColor: isScanning ? 'rgba(56,189,248,0.4)' : colors.border }]}>
              <View style={[styles.radarCenter, { backgroundColor: isScanning ? colors.primary : colors.cardElevated, shadowColor: colors.sky }]}>
                <Radar color="#ffffff" size={32} />
              </View>
            </View>
          </View>
        </View>

        {/* Live Status readout */}
        <Text style={[styles.radarStatusTitle, { color: colors.text }]}>
          {isScanning ? 'Listening on 2.4GHz BLE Mesh' : 'Ready to Scan Peer Relays'}
        </Text>
        <Text style={[styles.radarStatusSub, { color: colors.subText }]}>
          {isScanning
            ? 'Your phone is currently scanning for lost tags and phone beacons in Bluetooth proximity.'
            : 'Turn on the scanner to assist nearby lost devices anonymously.'}
        </Text>

        {/* Toggle Scan CTA Button */}
        <TouchableOpacity
          style={[
            styles.toggleButton,
            isScanning
              ? [styles.btnStop, { backgroundColor: colors.rose, shadowColor: colors.rose }]
              : [styles.btnStart, { backgroundColor: colors.primary, shadowColor: colors.primaryGlow }],
          ]}
          onPress={toggleScan}
          activeOpacity={0.85}
        >
          {isScanning ? <Square color="#ffffff" size={20} /> : <Play color="#ffffff" size={20} />}
          <Text style={styles.toggleButtonText}>
            {isScanning ? 'Stop Scanning' : 'Engage Beacon Scanner'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Telemetry Readout Strip */}
      <View style={[styles.statsStrip, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.statBox}>
          <Text style={[styles.statNum, { color: colors.sky }]}>{scanResults.length}</Text>
          <Text style={[styles.statLabel, { color: colors.subText }]}>RELAYS FOUND</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={[styles.statNum, { color: colors.emerald }]}>{isScanning ? 'ONLINE' : 'OFF'}</Text>
          <Text style={[styles.statLabel, { color: colors.subText }]}>BLE SERVICE</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={[styles.statNum, { color: colors.text }]}>E2EE</Text>
          <Text style={[styles.statLabel, { color: colors.subText }]}>PRIVACY</Text>
        </View>
      </View>

      {/* Recent Detections List */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <Activity color={colors.sky} size={18} />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Detected Peer Beacons</Text>
        </View>
        <Text style={[styles.sectionSub, { color: colors.subText }]}>
          Recently captured signals in your wireless perimeter
        </Text>
      </View>

      {scanResults.length > 0 ? (
        <View style={styles.resultsList}>
          {scanResults.map((result, index) => (
            <View key={index} style={[styles.resultCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.resultCardHeader}>
                <View style={styles.deviceIdRow}>
                  <Radio color={colors.sky} size={16} />
                  <Text style={[styles.resultDeviceId, { color: colors.text }]}>{result.deviceId}</Text>
                </View>
                <View style={[styles.relayedBadge, { backgroundColor: colors.emeraldBg, borderColor: 'rgba(16,185,129,0.3)' }]}>
                  <CheckCircle2 color={colors.emerald} size={12} />
                  <Text style={[styles.relayedBadgeText, { color: colors.emerald }]}>RELAYED</Text>
                </View>
              </View>

              <View style={[styles.coordBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
                <Text style={[styles.coordText, { color: colors.subText }]}>
                  FIX: <Text style={{ color: colors.text }}>{result.lat.toFixed(4)}, {result.lon.toFixed(4)}</Text>
                </Text>
                <Text style={[styles.timeText, { color: colors.subText }]}>
                  {new Date(result.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </Text>
              </View>

              <TouchableOpacity
                style={[styles.chatBtn, { backgroundColor: colors.primary }]}
                onPress={() => setSelectedDeviceChat({
                  id: result.deviceId,
                  name: result.deviceId,
                  sessionId: `chat_${result.deviceId}`
                })}
              >
                <MessageCircle color="#ffffff" size={16} />
                <Text style={styles.chatBtnText}>Chat with Owner</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      ) : (
        <View style={[styles.emptyCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Wifi color={colors.subText} size={28} style={{ opacity: 0.5, marginBottom: 8 }} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>No Beacons Detected</Text>
          <Text style={[styles.emptySub, { color: colors.subText }]}>
            {isScanning
              ? 'Listening for BLE beacons within ~30 meters...'
              : 'Start the scanner to automatically detect offline lost devices.'}
          </Text>
        </View>
      )}

      {/* Privacy Notice Card */}
      <View style={[styles.privacyCard, { backgroundColor: colors.cardElevated, borderColor: colors.border }]}>
        <Shield color={colors.sky} size={20} style={styles.privacyIcon} />
        <View style={{ flex: 1 }}>
          <Text style={[styles.privacyTitle, { color: colors.text }]}>Anonymous Relaying</Text>
          <Text style={[styles.privacyText, { color: colors.subText }]}>
            Location packets are securely signed and encrypted before relaying. No personal identifier or node IP is ever disclosed to the device owner.
          </Text>
        </View>
      </View>
    </ScrollView>

    <Modal
      visible={!!selectedDeviceChat}
      animationType="slide"
      onRequestClose={() => setSelectedDeviceChat(null)}
      presentationStyle="pageSheet"
    >
      {selectedDeviceChat && (
        <AnonymousChat
          deviceId={selectedDeviceChat.id}
          deviceName={selectedDeviceChat.name}
          sessionId={selectedDeviceChat.sessionId}
          onClose={() => setSelectedDeviceChat(null)}
        />
      )}
    </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 40,
  },
  radarCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 22,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 4,
  },
  consoleHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  consoleHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  consoleHeaderText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  statusBadge: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  sonarContainer: {
    width: 170,
    height: 170,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  pulseRing: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 2,
  },
  outerRadarRing: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    borderStyle: 'dashed',
  },
  innerRadarRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radarCenter: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  radarStatusTitle: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3,
    marginBottom: 6,
    textAlign: 'center',
  },
  radarStatusSub: {
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    maxWidth: 290,
    marginBottom: 20,
  },
  toggleButton: {
    width: '100%',
    height: 52,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 5,
  },
  btnStart: {},
  btnStop: {},
  toggleButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  statsStrip: {
    flexDirection: 'row',
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 8,
    marginBottom: 24,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statNum: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#334155',
    alignSelf: 'center',
  },
  sectionHeader: {
    marginBottom: 14,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  sectionSub: {
    fontSize: 12,
  },
  resultsList: {
    gap: 10,
    marginBottom: 20,
  },
  resultCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
  },
  resultCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  deviceIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  resultDeviceId: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  relayedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  relayedBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  coordBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  coordText: {
    fontSize: 11,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  timeText: {
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  emptyCard: {
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 32,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  emptySub: {
    fontSize: 12,
    textAlign: 'center',
    maxWidth: 240,
    lineHeight: 18,
  },
  privacyCard: {
    flexDirection: 'row',
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 12,
    alignItems: 'flex-start',
  },
  privacyIcon: {
    marginTop: 2,
  },
  privacyTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 3,
  },
  privacyText: {
    fontSize: 11,
    lineHeight: 16,
  },
  chatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    marginTop: 10,
    borderRadius: 8,
  },
  chatBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
});
