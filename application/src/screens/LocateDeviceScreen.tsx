import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
  Modal,
  Linking,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { MapPin, Search, Clock, Smartphone, Sparkles, Navigation, ShieldCheck, MessageCircle } from 'lucide-react-native';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import CircuitBackground from '../components/CircuitBackground';
import AnonymousChat from '../components/AnonymousChat';
import { fetchDeviceLocation } from '../services/api';

// Sleek dark map style to match the website's dark circuit theme
const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#0f1722' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#080b0e' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8292a2' }] },
  { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#f8fafc' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1e293b' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#0d1218' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#2563eb' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#080b0e' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#131a24' }] },
];

export default function LocateDeviceScreen() {
  const { user } = useAuth();
  const { colors, theme } = useTheme();

  const [deviceId, setDeviceId] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<any>(null);
  const [chatVisible, setChatVisible] = useState(false);

  const handleSearch = async (idToSearch: string) => {
    const trimmed = idToSearch.trim();
    if (!trimmed) {
      Alert.alert('Required', 'Please enter a device ID to locate.');
      return;
    }

    setIsSearching(true);
    setSelectedDevice(null);

    try {
      const data = await fetchDeviceLocation(trimmed);
      setSelectedDevice(data);
    } catch (error) {
      Alert.alert('Device Not Found', 'No recent location beacon was found for this ID in the SPORS network.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleApplyDemo = (demoId: string) => {
    setDeviceId(demoId);
    handleSearch(demoId);
  };

  const openInNativeMaps = () => {
    if (!selectedDevice?.location?.lat || !selectedDevice?.location?.lng) return;
    const lat = selectedDevice.location.lat;
    const lng = selectedDevice.location.lng;
    const label = encodeURIComponent(selectedDevice.name || 'Located Device');
    const url = Platform.select({
      ios: `maps:0,0?q=${label}@${lat},${lng}`,
      android: `geo:0,0?q=${lat},${lng}(${label})`,
    });
    if (url) Linking.openURL(url);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CircuitBackground />
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Search Console Card (Styled after website's tracker console) */}
      <View style={[styles.consoleCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.consoleHeader}>
          <View style={styles.consoleHeaderLeft}>
            <View style={[styles.pulseDot, { backgroundColor: colors.sky }]} />
            <Text style={[styles.consoleHeaderText, { color: colors.text }]}>DEVICE TRACKER CONSOLE</Text>
          </View>
          <View style={[styles.meshStatusBadge, { backgroundColor: colors.emeraldBg, borderColor: 'rgba(16,185,129,0.3)' }]}>
            <Text style={[styles.meshStatusText, { color: colors.emerald }]}>PEER MESH: READY</Text>
          </View>
        </View>

        {/* Input Row */}
        <View style={styles.searchRow}>
          <View style={[styles.inputBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <Text style={[styles.inputPrefix, { color: colors.sky }]}>ID //</Text>
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="e.g. SIH_PROJECT_COBRA"
              placeholderTextColor={colors.subText}
              value={deviceId}
              onChangeText={setDeviceId}
              autoCapitalize="none"
              returnKeyType="search"
              onSubmitEditing={() => handleSearch(deviceId)}
            />
          </View>

          <TouchableOpacity
            style={[styles.searchButton, { backgroundColor: colors.primary, shadowColor: colors.primaryGlow }]}
            onPress={() => handleSearch(deviceId)}
            disabled={isSearching}
            activeOpacity={0.85}
          >
            {isSearching ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <Search color="#ffffff" size={18} />
            )}
          </TouchableOpacity>
        </View>

        {/* Try Demo Shortcut */}
        <View style={styles.demoShortcutRow}>
          <Text style={[styles.demoShortcutLabel, { color: colors.subText }]}>Try Demo:</Text>
          <TouchableOpacity
            style={[styles.demoPill, { backgroundColor: colors.badgeBg, borderColor: colors.badgeBorder }]}
            onPress={() => handleApplyDemo('SIH_PROJECT_COBRA')}
            activeOpacity={0.7}
          >
            <Sparkles color={colors.sky} size={12} />
            <Text style={[styles.demoPillText, { color: colors.sky }]}>SIH_PROJECT_COBRA</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick Select from Registered Devices */}
      {user?.devices && user.devices.length > 0 && (
        <View style={styles.quickSelectSection}>
          <Text style={[styles.quickSelectTitle, { color: colors.subText }]}>YOUR REGISTERED HARDWARE</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
            {user.devices.map((d: any) => {
              const isSelected = deviceId === d.deviceid;
              return (
                <TouchableOpacity
                  key={d.deviceid}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: isSelected ? colors.primary : colors.card,
                      borderColor: isSelected ? colors.sky : colors.border,
                    },
                  ]}
                  onPress={() => {
                    setDeviceId(d.deviceid);
                    handleSearch(d.deviceid);
                  }}
                  activeOpacity={0.8}
                >
                  <Smartphone color={isSelected ? '#ffffff' : colors.sky} size={14} />
                  <Text style={[styles.chipText, { color: isSelected ? '#ffffff' : colors.text }]}>
                    {d.devicename || d.deviceid}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* Interactive Map View Card */}
      <View style={[styles.mapContainer, { borderColor: colors.border, backgroundColor: colors.card }]}>
        {selectedDevice ? (
          <MapView
            style={styles.map}
            customMapStyle={theme === 'dark' ? darkMapStyle : undefined}
            initialRegion={{
              latitude: Number(selectedDevice.location.lat) || 28.6139,
              longitude: Number(selectedDevice.location.lng) || 77.2090,
              latitudeDelta: 0.008,
              longitudeDelta: 0.008,
            }}
          >
            <Marker
              coordinate={{
                latitude: Number(selectedDevice.location.lat) || 28.6139,
                longitude: Number(selectedDevice.location.lng) || 77.2090,
              }}
              title={selectedDevice.name}
              description={selectedDevice.location.address}
            >
              <View style={[styles.customMarker, { backgroundColor: colors.primary, shadowColor: colors.sky }]}>
                <MapPin color="#ffffff" size={20} />
              </View>
            </Marker>
          </MapView>
        ) : (
          <View style={styles.mapPlaceholder}>
            <View style={[styles.placeholderIconBox, { backgroundColor: colors.badgeBg, borderColor: colors.badgeBorder }]}>
              <MapPin color={colors.sky} size={32} />
            </View>
            <Text style={[styles.placeholderText, { color: colors.text }]}>Awaiting Target Coordinates</Text>
            <Text style={[styles.placeholderSub, { color: colors.subText }]}>
              Enter or select a device ID to view its real-time GPS triangulation on the peer network.
            </Text>
          </View>
        )}
      </View>

      {/* Located Device Telemetry Dossier */}
      {selectedDevice && (
        <View style={[styles.detailsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.detailsHeader}>
            <View style={styles.detailsHeaderLeft}>
              <View style={[styles.detailsIconBox, { backgroundColor: colors.badgeBg }]}>
                <Smartphone color={colors.sky} size={20} />
              </View>
              <View>
                <Text style={[styles.deviceName, { color: colors.text }]}>{selectedDevice.name}</Text>
                <Text style={[styles.deviceSubId, { color: colors.subText }]}>{deviceId}</Text>
              </View>
            </View>

            <View style={[styles.deviceStatusPill, { backgroundColor: colors.emeraldBg, borderColor: 'rgba(16,185,129,0.3)' }]}>
              <View style={[styles.pulseDot, { backgroundColor: colors.emerald }]} />
              <Text style={[styles.deviceStatusText, { color: colors.emerald }]}>LOCATED</Text>
            </View>
          </View>

          {/* Coordinate & Address Grid */}
          <View style={[styles.telemetryGrid, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <View style={styles.telemetryField}>
              <Text style={[styles.fieldLabel, { color: colors.subText }]}>ADDRESS / FIX</Text>
              <Text style={[styles.fieldValue, { color: colors.text }]}>
                {selectedDevice.location.address || 'Street triangulation confirmed'}
              </Text>
            </View>

            <View style={styles.fieldDivider} />

            <View style={styles.fieldRow}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.fieldLabel, { color: colors.subText }]}>COORDINATES</Text>
                <Text style={[styles.fieldMono, { color: colors.sky }]}>
                  {Number(selectedDevice.location.lat).toFixed(5)}, {Number(selectedDevice.location.lng).toFixed(5)}
                </Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={[styles.fieldLabel, { color: colors.subText }]}>LAST RELAY FIX</Text>
                <View style={styles.timeInline}>
                  <Clock color={colors.subText} size={13} style={{ marginRight: 4 }} />
                  <Text style={[styles.fieldMono, { color: colors.text }]}>
                    {new Date(selectedDevice.lastSeen).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Navigation Action */}
          <TouchableOpacity
            style={[styles.navigateButton, { backgroundColor: colors.primary, shadowColor: colors.primaryGlow }]}
            onPress={openInNativeMaps}
            activeOpacity={0.85}
          >
            <Navigation color="#ffffff" size={18} />
            <Text style={styles.navigateButtonText}>Navigate to Device</Text>
          </TouchableOpacity>
          {/* Chat Action */}
          <TouchableOpacity
            style={[styles.chatButton, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => setChatVisible(true)}
            activeOpacity={0.85}
          >
            <MessageCircle color={colors.sky} size={18} />
            <Text style={[styles.chatButtonText, { color: colors.text }]}>Open Anonymous Chat</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>

    <Modal
      visible={chatVisible}
      animationType="slide"
      onRequestClose={() => setChatVisible(false)}
      presentationStyle="pageSheet"
    >
      {selectedDevice && (
        <AnonymousChat
          deviceId={selectedDevice.id || deviceId}
          deviceName={selectedDevice.name || deviceId}
          sessionId={`chat_${selectedDevice.id || deviceId}`}
          onClose={() => setChatVisible(false)}
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
  consoleCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  consoleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  consoleHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  consoleHeaderText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  meshStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
  },
  meshStatusText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  searchRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  inputBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
  },
  inputPrefix: {
    fontSize: 11,
    fontWeight: '800',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    marginRight: 6,
  },
  input: {
    flex: 1,
    fontSize: 13,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  searchButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  demoShortcutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  demoShortcutLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  demoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  demoPillText: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  quickSelectSection: {
    marginBottom: 16,
  },
  quickSelectTitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginLeft: 2,
  },
  chipsScroll: {
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  mapContainer: {
    height: 280,
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 16,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  customMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  mapPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  placeholderIconBox: {
    width: 60,
    height: 60,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  placeholderText: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  placeholderSub: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  detailsCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  detailsHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  detailsIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '800',
  },
  deviceSubId: {
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  deviceStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
  },
  deviceStatusText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  telemetryGrid: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 10,
    marginBottom: 16,
  },
  telemetryField: {},
  fieldLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.6,
    marginBottom: 3,
  },
  fieldValue: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  fieldMono: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  fieldDivider: {
    height: 1,
    backgroundColor: '#1e293b',
  },
  fieldRow: {
    flexDirection: 'row',
    gap: 12,
  },
  timeInline: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navigateButton: {
    height: 48,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  navigateButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  chatButton: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 10,
  },
  chatButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
