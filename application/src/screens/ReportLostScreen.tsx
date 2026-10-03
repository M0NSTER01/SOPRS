import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { AlertTriangle, CheckCircle2, Smartphone, ShieldCheck, Radio, ArrowRight } from 'lucide-react-native';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import CircuitBackground from '../components/CircuitBackground';
import { reportLost, markFound } from '../services/api';

export default function ReportLostScreen() {
  const { user } = useAuth();
  const { colors, theme } = useTheme();

  const [deviceId, setDeviceId] = useState('');
  const [isReporting, setIsReporting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success_lost' | 'success_found'>('idle');

  const handleDeviceAction = async (targetId: string, action: 'lost' | 'found') => {
    const trimmed = targetId.trim();
    if (!trimmed) {
      Alert.alert('Required', 'Please enter or select a valid Device ID');
      return;
    }

    const title = action === 'lost' ? 'Broadcast Lost Status' : 'Mark Device Recovered';
    const message =
      action === 'lost'
        ? `Are you sure you want to flag "${trimmed}" as lost? This will alert all SPORS nodes in the peer mesh to listen for its beacon.`
        : `Are you sure you want to mark "${trimmed}" as recovered? This will withdraw it from the active lost device registry.`;

    Alert.alert(title, message, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: action === 'lost' ? 'Broadcast Alert' : 'Confirm Found',
        style: action === 'lost' ? 'destructive' : 'default',
        onPress: async () => {
          setIsReporting(true);
          try {
            if (action === 'lost') {
              await reportLost(trimmed);
              setStatus('success_lost');
            } else {
              await markFound(trimmed);
              setStatus('success_found');
            }

            setDeviceId('');

            // Reset status after 3.5s
            setTimeout(() => {
              setStatus('idle');
            }, 3500);
          } catch (error: any) {
            const errorMsg = error?.response?.data?.message || `Failed to update device status to ${action}.`;
            Alert.alert('Error', errorMsg);
          } finally {
            setIsReporting(false);
          }
        },
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <CircuitBackground />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Alert Card */}
        <View style={[styles.headerCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.consoleHeader}>
            <View style={styles.consoleHeaderLeft}>
              <View style={[styles.pulseDot, { backgroundColor: colors.rose }]} />
              <Text style={[styles.consoleHeaderText, { color: colors.text }]}>MESH STATUS BROADCASTER</Text>
            </View>
            <View style={[styles.statusTag, { backgroundColor: colors.roseBg, borderColor: 'rgba(244,63,94,0.3)' }]}>
              <Text style={[styles.statusTagText, { color: colors.rose }]}>SOS REGISTRY</Text>
            </View>
          </View>

          <View style={styles.heroAlertRow}>
            <View style={[styles.iconBox, { backgroundColor: colors.roseBg, borderColor: 'rgba(244,63,94,0.3)' }]}>
              <AlertTriangle color={colors.rose} size={28} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.heroTitle, { color: colors.text }]}>Report Lost or Found</Text>
              <Text style={[styles.heroSubtitle, { color: colors.subText }]}>
                Instantly notify community nodes to listen for hardware beacons.
              </Text>
            </View>
          </View>
        </View>

        {/* Live Feedback Banner */}
        {status !== 'idle' && (
          <View
            style={[
              styles.feedbackBanner,
              {
                backgroundColor: status === 'success_lost' ? colors.roseBg : colors.emeraldBg,
                borderColor: status === 'success_lost' ? colors.rose : colors.emerald,
              },
            ]}
          >
            <CheckCircle2 color={status === 'success_lost' ? colors.rose : colors.emerald} size={20} />
            <Text
              style={[
                styles.feedbackText,
                { color: status === 'success_lost' ? colors.rose : colors.emerald },
              ]}
            >
              {status === 'success_lost'
                ? 'Device marked LOST: Network scanning activated!'
                : 'Device marked RECOVERED: Removed from lost registry!'}
            </Text>
          </View>
        )}

        {/* Manual Target Console Card */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Target Hardware ID</Text>
          <Text style={[styles.cardSub, { color: colors.subText }]}>
            Enter the unique identifier assigned to your device
          </Text>

          <View style={[styles.inputBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <Text style={[styles.inputPrefix, { color: colors.sky }]}>ID //</Text>
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="e.g. SIH_PROJECT_COBRA"
              placeholderTextColor={colors.subText}
              value={deviceId}
              onChangeText={setDeviceId}
              editable={!isReporting}
              autoCapitalize="characters"
            />
          </View>

          {/* Dual Action Buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[
                styles.actionBtn,
                { backgroundColor: colors.rose, shadowColor: colors.rose },
                isReporting && { opacity: 0.6 },
              ]}
              onPress={() => handleDeviceAction(deviceId, 'lost')}
              disabled={isReporting}
              activeOpacity={0.85}
            >
              {isReporting ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <View style={styles.btnContent}>
                  <AlertTriangle color="#ffffff" size={16} />
                  <Text style={styles.actionBtnText}>Mark as Lost</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionBtn,
                { backgroundColor: colors.emerald, shadowColor: colors.emerald },
                isReporting && { opacity: 0.6 },
              ]}
              onPress={() => handleDeviceAction(deviceId, 'found')}
              disabled={isReporting}
              activeOpacity={0.85}
            >
              {isReporting ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <View style={styles.btnContent}>
                  <CheckCircle2 color="#ffffff" size={16} />
                  <Text style={styles.actionBtnText}>Mark Recovered</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* User's Registered Hardware List */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Registered Hardware</Text>
          <Text style={[styles.sectionSub, { color: colors.subText }]}>
            One-tap status updates for devices bound to your account
          </Text>
        </View>

        {user?.devices && user.devices.length > 0 ? (
          <View style={styles.deviceList}>
            {user.devices.map((device: any) => (
              <View
                key={device.deviceid}
                style={[styles.deviceItem, { backgroundColor: colors.card, borderColor: colors.border }]}
              >
                <View style={styles.deviceItemLeft}>
                  <View style={[styles.deviceIconBox, { backgroundColor: colors.badgeBg }]}>
                    <Smartphone color={colors.sky} size={20} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.deviceName, { color: colors.text }]}>{device.devicename}</Text>
                    <Text style={[styles.deviceIdText, { color: colors.subText }]}>{device.deviceid}</Text>
                  </View>
                </View>

                {/* Quick actions for this device */}
                <View style={styles.quickDeviceActions}>
                  <TouchableOpacity
                    style={[styles.miniBtn, { backgroundColor: colors.roseBg, borderColor: 'rgba(244,63,94,0.3)' }]}
                    onPress={() => handleDeviceAction(device.deviceid, 'lost')}
                    disabled={isReporting}
                    activeOpacity={0.7}
                  >
                    <AlertTriangle color={colors.rose} size={14} />
                    <Text style={[styles.miniBtnText, { color: colors.rose }]}>Lost</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.miniBtn, { backgroundColor: colors.emeraldBg, borderColor: 'rgba(16,185,129,0.3)' }]}
                    onPress={() => handleDeviceAction(device.deviceid, 'found')}
                    disabled={isReporting}
                    activeOpacity={0.7}
                  >
                    <CheckCircle2 color={colors.emerald} size={14} />
                    <Text style={[styles.miniBtnText, { color: colors.emerald }]}>Found</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={[styles.emptyHardwareCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Radio color={colors.subText} size={24} style={{ opacity: 0.5, marginBottom: 8 }} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No Registered Hardware</Text>
            <Text style={[styles.emptySub, { color: colors.subText }]}>
              Use the manual target input above or register a device on the web console.
            </Text>
          </View>
        )}

        {/* Security & Privacy guarantee */}
        <View style={[styles.securityPill, { backgroundColor: colors.cardElevated, borderColor: colors.border }]}>
          <ShieldCheck color={colors.emerald} size={18} />
          <Text style={[styles.securityText, { color: colors.subText }]}>
            Protected by SPORS decentralized peer encryption protocol.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  headerCard: {
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
    marginBottom: 16,
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
  statusTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
  },
  statusTagText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  heroAlertRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 12,
    lineHeight: 17,
  },
  feedbackBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 16,
  },
  feedbackText: {
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    marginBottom: 22,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
    marginBottom: 2,
  },
  cardSub: {
    fontSize: 12,
    marginBottom: 14,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    marginBottom: 14,
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
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  btnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
    marginBottom: 2,
  },
  sectionSub: {
    fontSize: 12,
  },
  deviceList: {
    gap: 10,
    marginBottom: 20,
  },
  deviceItem: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deviceItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    marginRight: 10,
  },
  deviceIconBox: {
    width: 38,
    height: 38,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deviceName: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  deviceIdText: {
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  quickDeviceActions: {
    flexDirection: 'row',
    gap: 6,
  },
  miniBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  miniBtnText: {
    fontSize: 11,
    fontWeight: '700',
  },
  emptyHardwareCard: {
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  emptySub: {
    fontSize: 12,
    textAlign: 'center',
    maxWidth: 240,
    lineHeight: 17,
  },
  securityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  securityText: {
    fontSize: 11,
    flex: 1,
    lineHeight: 16,
  },
});
