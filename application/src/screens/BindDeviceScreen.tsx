import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  PermissionsAndroid,
  Platform,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import CircuitBackground from '../components/CircuitBackground';
import * as Device from 'expo-device';
import {
  Smartphone,
  CheckCircle2,
  Radio,
  Shield,
  PowerOff,
  Cpu,
  Wifi,
  AlertCircle,
  Sparkles,
} from 'lucide-react-native';

import { startAdvertising, stopAdvertising } from '../services/BleAdvertiser';

export default function BindDeviceScreen() {
  const { user } = useAuth();
  const { colors, theme } = useTheme();

  const [boundDeviceId, setBoundDeviceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadBoundDevice();
  }, []);

  const loadBoundDevice = async () => {
    try {
      const savedId = await AsyncStorage.getItem('@bound_device_id');
      if (savedId) {
        setBoundDeviceId(savedId);
        // Automatically resume broadcasting if they restart the app
        const hasPermissions = await requestPermissions();
        if (hasPermissions) {
          await startAdvertising(savedId);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const requestPermissions = async () => {
    if (Platform.OS === 'android' && Platform.Version >= 31) {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]);
      return (
        granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE] === PermissionsAndroid.RESULTS.GRANTED &&
        granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] === PermissionsAndroid.RESULTS.GRANTED
      );
    }
    return true;
  };

  const bindDevice = async (deviceId: string) => {
    setIsProcessing(true);
    try {
      const hasPermissions = await requestPermissions();
      if (!hasPermissions) {
        Alert.alert('Permission Required', 'Bluetooth Advertising permissions are required to broadcast as a mesh beacon.');
        setIsProcessing(false);
        return;
      }

      // Start broadcasting this specific ID natively!
      await startAdvertising(deviceId);
      await AsyncStorage.setItem('@bound_device_id', deviceId);
      setBoundDeviceId(deviceId);

      Alert.alert(
        'Beacon Transmitter Active',
        `This physical device (${Device.modelName || 'Handset'}) is now actively broadcasting BLE beacons for device ID: ${deviceId}.`
      );
    } catch (e: any) {
      console.error(e);
      Alert.alert('Broadcast Error', e.message || 'Failed to start BLE Advertising.');
    } finally {
      setIsProcessing(false);
    }
  };

  const unbindDevice = async () => {
    Alert.alert(
      'Stop Broadcasting',
      'Are you sure you want to stop the BLE beacon broadcast on this physical handset?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Stop Broadcast',
          style: 'destructive',
          onPress: async () => {
            setIsProcessing(true);
            try {
              await stopAdvertising();
              await AsyncStorage.removeItem('@bound_device_id');
              setBoundDeviceId(null);
              Alert.alert('Beacon Offline', 'This phone is no longer broadcasting as a hardware beacon.');
            } catch (e: any) {
              console.error(e);
              Alert.alert('Error', e.message || 'Failed to stop BLE Advertising.');
            } finally {
              setIsProcessing(false);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.sky} />
      </View>
    );
  }

  const boundDeviceObj = user?.devices?.find((d: any) => d.deviceid === boundDeviceId);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />
      <CircuitBackground />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hardware Status Console Card */}
        <View style={[styles.consoleCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.consoleHeader}>
            <View style={styles.consoleHeaderLeft}>
              <View
                style={[
                  styles.pulseDot,
                  { backgroundColor: boundDeviceId ? colors.emerald : colors.subText },
                ]}
              />
              <Text style={[styles.consoleHeaderText, { color: colors.text }]}>
                BLE BEACON TRANSMITTER
              </Text>
            </View>
            <View
              style={[
                styles.meshStatusBadge,
                boundDeviceId
                  ? { backgroundColor: colors.emeraldBg, borderColor: 'rgba(16,185,129,0.3)' }
                  : { backgroundColor: colors.cardElevated, borderColor: colors.border },
              ]}
            >
              <Text
                style={[
                  styles.meshStatusText,
                  { color: boundDeviceId ? colors.emerald : colors.subText },
                ]}
              >
                {boundDeviceId ? 'TRANSMITTING' : 'MESH STANDBY'}
              </Text>
            </View>
          </View>

          {/* Transmitter Dossier */}
          <View
            style={[
              styles.transmitterHero,
              {
                backgroundColor: colors.cardElevated,
                borderColor: boundDeviceId ? 'rgba(56, 189, 248, 0.3)' : colors.border,
              },
            ]}
          >
            <View style={styles.transmitterRow}>
              <View
                style={[
                  styles.transmitterIconCircle,
                  {
                    backgroundColor: boundDeviceId ? 'rgba(16, 185, 129, 0.15)' : 'rgba(100, 116, 139, 0.12)',
                    borderColor: boundDeviceId ? 'rgba(16, 185, 129, 0.4)' : colors.border,
                  },
                ]}
              >
                <Radio color={boundDeviceId ? colors.emerald : colors.subText} size={28} />
              </View>

              <View style={styles.transmitterInfo}>
                <Text style={[styles.transmitterLabel, { color: colors.subText }]}>
                  PHYSICAL HOST HARDWARE
                </Text>
                <Text style={[styles.transmitterModel, { color: colors.text }]}>
                  {Device.modelName || 'Current Android Device'}
                </Text>
                <View style={styles.broadcastDetailsRow}>
                  <Wifi color={boundDeviceId ? colors.sky : colors.subText} size={13} />
                  <Text style={[styles.broadcastDetailsText, { color: boundDeviceId ? colors.sky : colors.subText }]}>
                    {boundDeviceId ? `Broadcasting: ${boundDeviceId}` : 'No active hardware beacon bound'}
                  </Text>
                </View>
              </View>
            </View>

            {boundDeviceId && (
              <View style={styles.activeTransmitterFooter}>
                <View style={[styles.activeStatusPill, { backgroundColor: colors.emeraldBg, borderColor: 'rgba(16,185,129,0.3)' }]}>
                  <View style={[styles.microDot, { backgroundColor: colors.emerald }]} />
                  <Text style={[styles.activeStatusPillText, { color: colors.emerald }]}>
                    Node {boundDeviceObj?.devicename || boundDeviceId} is beaconing over BLE
                  </Text>
                </View>

                <TouchableOpacity
                  style={[styles.unbindBtn, { backgroundColor: colors.roseBg, borderColor: 'rgba(244, 63, 94, 0.35)' }]}
                  onPress={unbindDevice}
                  disabled={isProcessing}
                  activeOpacity={0.8}
                >
                  {isProcessing ? (
                    <ActivityIndicator size="small" color={colors.rose} />
                  ) : (
                    <>
                      <PowerOff color={colors.rose} size={16} />
                      <Text style={[styles.unbindBtnText, { color: colors.rose }]}>Stop Broadcasting</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* Sandbox Architecture Info */}
        <View style={[styles.infoBanner, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.infoHeaderRow}>
            <View style={[styles.infoIconWrap, { backgroundColor: colors.badgeBg, borderColor: colors.badgeBorder }]}>
              <Cpu color={colors.sky} size={16} />
            </View>
            <Text style={[styles.infoTitle, { color: colors.text }]}>
              HARDWARE IDENTIFIER EMULATION
            </Text>
          </View>
          <Text style={[styles.infoBody, { color: colors.subText }]}>
            Modern Android privacy guidelines restrict direct hardware identifier access (IMEI / Serial). SPORS pairs this physical handset ({Device.modelName || 'device'}) with your selected registered identity, transmitting its unique beacon key over BLE.
          </Text>
        </View>

        {/* Device Selection Section */}
        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionTitleWrap}>
            <View style={[styles.pulseDot, { backgroundColor: colors.sky }]} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>REGISTERED FLEET NODES</Text>
          </View>
          <View style={[styles.countBadge, { backgroundColor: colors.badgeBg, borderColor: colors.badgeBorder }]}>
            <Text style={[styles.countBadgeText, { color: colors.badgeText }]}>
              {user?.devices?.length || 0} CONFIGURED
            </Text>
          </View>
        </View>

        {user?.devices && user.devices.length > 0 ? (
          user.devices.map((device: any) => {
            const isBound = boundDeviceId === device.deviceid;
            return (
              <TouchableOpacity
                key={device.deviceid}
                style={[
                  styles.deviceNodeCard,
                  {
                    backgroundColor: isBound ? colors.cardElevated : colors.card,
                    borderColor: isBound ? colors.primaryGlow : colors.border,
                  },
                ]}
                onPress={() => bindDevice(device.deviceid)}
                disabled={isProcessing || isBound}
                activeOpacity={0.7}
              >
                <View style={styles.deviceNodeMain}>
                  <View
                    style={[
                      styles.deviceNodeIcon,
                      {
                        backgroundColor: isBound ? 'rgba(56, 189, 248, 0.15)' : colors.background,
                        borderColor: isBound ? 'rgba(56, 189, 248, 0.4)' : colors.border,
                      },
                    ]}
                  >
                    <Smartphone color={isBound ? colors.sky : colors.subText} size={22} />
                  </View>

                  <View style={styles.deviceNodeDetails}>
                    <View style={styles.deviceNodeNameRow}>
                      <Text style={[styles.deviceNodeName, { color: colors.text }]}>
                        {device.devicename}
                      </Text>
                      {isBound && (
                        <View style={[styles.liveTag, { backgroundColor: colors.emeraldBg, borderColor: 'rgba(16,185,129,0.3)' }]}>
                          <View style={[styles.microDot, { backgroundColor: colors.emerald }]} />
                          <Text style={[styles.liveTagText, { color: colors.emerald }]}>ACTIVE BEACON</Text>
                        </View>
                      )}
                    </View>

                    <Text style={[styles.deviceNodeId, { color: colors.sky }]}>
                      ID: {device.deviceid}
                    </Text>

                    <Text style={[styles.deviceNodeMeta, { color: colors.subText }]}>
                      Status: {device.status || 'Active'} • Added {device.registeredat ? new Date(device.registeredat).toLocaleDateString() : 'Recently'}
                    </Text>
                  </View>
                </View>

                {/* Card Action Footprint */}
                <View style={[styles.deviceCardActionRow, { borderTopColor: colors.border }]}>
                  {isBound ? (
                    <View style={styles.boundStatusRow}>
                      <CheckCircle2 color={colors.emerald} size={16} />
                      <Text style={[styles.boundStatusText, { color: colors.emerald }]}>
                        Currently broadcasting on this handset
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.bindActionRow}>
                      <Radio color={colors.sky} size={15} />
                      <Text style={[styles.bindActionText, { color: colors.sky }]}>
                        Tap to bind & broadcast this identity
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })
        ) : (
          <View style={[styles.emptyContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <AlertCircle color={colors.subText} size={36} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No Registered Devices Found</Text>
            <Text style={[styles.emptySubtitle, { color: colors.subText }]}>
              Register hardware devices in your SPORS account console first to bind this phone as a beacon transmitter.
            </Text>
          </View>
        )}

        {/* Security & Protocol Footnote */}
        <View style={styles.footnote}>
          <Shield color={colors.sky} size={14} />
          <Text style={[styles.footnoteText, { color: colors.subText }]}>
            Zero-Knowledge BLE Beaconing • Anonymous Cryptographic Identifiers
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* Console Card */
  consoleCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  consoleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  consoleHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  consoleHeaderText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  meshStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  meshStatusText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  /* Transmitter Hero */
  transmitterHero: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
  },
  transmitterRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transmitterIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  transmitterInfo: {
    flex: 1,
  },
  transmitterLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.6,
    marginBottom: 3,
  },
  transmitterModel: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
    marginBottom: 4,
  },
  broadcastDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  broadcastDetailsText: {
    fontSize: 12,
    fontWeight: '500',
  },

  activeTransmitterFooter: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    gap: 10,
  },
  activeStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
  },
  microDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  activeStatusPillText: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  unbindBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    gap: 8,
  },
  unbindBtnText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.2,
  },

  /* Info Banner */
  infoBanner: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 20,
  },
  infoHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  infoIconWrap: {
    width: 26,
    height: 26,
    borderRadius: 6,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  infoBody: {
    fontSize: 12,
    lineHeight: 18,
  },

  /* Section Header */
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  countBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },

  /* Device Node Card */
  deviceNodeCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 12,
  },
  deviceNodeMain: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  deviceNodeIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  deviceNodeDetails: {
    flex: 1,
  },
  deviceNodeNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  deviceNodeName: {
    fontSize: 15,
    fontWeight: '700',
  },
  liveTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    gap: 5,
  },
  liveTagText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  deviceNodeId: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.3,
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  deviceNodeMeta: {
    fontSize: 11,
    fontWeight: '400',
  },

  deviceCardActionRow: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  boundStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  boundStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  bindActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bindActionText: {
    fontSize: 12,
    fontWeight: '600',
  },

  /* Empty State */
  emptyContainer: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 28,
    alignItems: 'center',
    textAlign: 'center',
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },

  /* Footnote */
  footnote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    gap: 6,
  },
  footnoteText: {
    fontSize: 11,
    fontWeight: '500',
  },
});
