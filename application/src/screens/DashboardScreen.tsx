import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import CircuitBackground from '../components/CircuitBackground';
import AnonymousChat from '../components/AnonymousChat';
import api from '../services/api';
import { Search, Shield, Activity, Users, MessageCircle, MapPin } from 'lucide-react-native';

export default function DashboardScreen() {
  const { user } = useAuth();
  const { colors } = useTheme();

  const [stats, setStats] = useState({ count: 0, devices: [] });
  const [chats, setChats] = useState([]);
  const [chatSearch, setChatSearch] = useState('');
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Police registration state
  const [policeUsername, setPoliceUsername] = useState('');
  const [policePassword, setPolicePassword] = useState('');

  useEffect(() => {
    fetchStats();
    fetchChats('');
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/stats');
      if (res.data.success) {
        setStats({ count: res.data.count, devices: res.data.devices });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchChats = async (search: string) => {
    try {
      const res = await api.get(`/admin/chats?search=${encodeURIComponent(search)}`);
      if (res.data.success) {
        setChats(res.data.sessions || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRegisterPolice = async () => {
    if (!policeUsername.trim() || !policePassword.trim()) {
      Alert.alert('Error', 'Username and password are required');
      return;
    }
    try {
      const res = await api.post('/admin/register-police', {
        username: policeUsername,
        password: policePassword,
      });
      if (res.data.success) {
        Alert.alert('Success', 'Police account registered!');
        setPoliceUsername('');
        setPolicePassword('');
      } else {
        Alert.alert('Error', res.data.error || 'Failed to register');
      }
    } catch (e) {
      Alert.alert('Error', 'Error connecting to server');
    }
  };

  if (!user || (user.role !== 'admin' && user.role !== 'police')) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: colors.rose, fontSize: 18, fontWeight: 'bold' }}>Access Denied</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CircuitBackground />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {user.role === 'admin' ? 'Admin Dashboard' : 'Police Dashboard'}
          </Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
        ) : (
          <>
            {/* Stats Card */}
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.cardHeader}>
                <Activity color={colors.sky} size={20} />
                <Text style={[styles.cardTitle, { color: colors.text }]}>System Stats</Text>
              </View>
              <Text style={[styles.statsText, { color: colors.rose }]}>
                {stats.count} Devices Reported Lost
              </Text>
            </View>

            {/* Admin Register Police */}
            {user.role === 'admin' && (
              <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.cardHeader}>
                  <Shield color={colors.sky} size={20} />
                  <Text style={[styles.cardTitle, { color: colors.text }]}>Register Police Account</Text>
                </View>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                  placeholder="Police Username"
                  placeholderTextColor={colors.subText}
                  value={policeUsername}
                  onChangeText={setPoliceUsername}
                  autoCapitalize="none"
                />
                <TextInput
                  style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border, marginTop: 10 }]}
                  placeholder="Password"
                  placeholderTextColor={colors.subText}
                  value={policePassword}
                  onChangeText={setPolicePassword}
                  secureTextEntry
                />
                <TouchableOpacity
                  style={[styles.primaryBtn, { backgroundColor: colors.primary, marginTop: 12 }]}
                  onPress={handleRegisterPolice}
                >
                  <Text style={styles.primaryBtnText}>Register Police</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Global Devices List (Map substitute for now or simple list) */}
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.cardHeader}>
                <MapPin color={colors.sky} size={20} />
                <Text style={[styles.cardTitle, { color: colors.text }]}>Global Lost Devices</Text>
              </View>
              {stats.devices.length > 0 ? (
                stats.devices.slice(0, 5).map((d: any, idx) => (
                  <View key={idx} style={[styles.deviceRow, { borderBottomColor: colors.border }]}>
                    <Text style={[styles.deviceName, { color: colors.text }]}>
                      {d.devicename || d.deviceid}
                    </Text>
                    <Text style={[styles.deviceInfo, { color: colors.subText }]}>
                      User: {d.username}
                    </Text>
                    <Text style={[styles.deviceInfo, { color: colors.subText }]}>
                      Lat: {d.lat}, Lon: {d.lon}
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={[styles.emptyText, { color: colors.subText }]}>No lost devices to display</Text>
              )}
            </View>

            {/* Active Chats */}
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.cardHeader}>
                <MessageCircle color={colors.sky} size={20} />
                <Text style={[styles.cardTitle, { color: colors.text }]}>Monitor Active Chats</Text>
              </View>
              
              <View style={styles.searchRow}>
                <TextInput
                  style={[styles.input, { flex: 1, backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                  placeholder="Search by username..."
                  placeholderTextColor={colors.subText}
                  value={chatSearch}
                  onChangeText={setChatSearch}
                />
                <TouchableOpacity
                  style={[styles.searchBtn, { backgroundColor: colors.primary }]}
                  onPress={() => fetchChats(chatSearch)}
                >
                  <Search color="#ffffff" size={18} />
                </TouchableOpacity>
              </View>

              {chats.length === 0 && (
                <Text style={[styles.emptyText, { color: colors.subText, marginTop: 10 }]}>
                  No active chat sessions found.
                </Text>
              )}

              {chats.map((session: any) => (
                <View key={session.session_id} style={[styles.chatRow, { backgroundColor: colors.background, borderColor: colors.border }]}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.deviceName, { color: colors.text }]}>{session.devicename || session.deviceid}</Text>
                    <Text style={[styles.deviceInfo, { color: colors.subText }]}>ID: {session.deviceid}</Text>
                    <Text style={[styles.deviceInfo, { color: colors.subText }]}>Session: {session.session_id}</Text>
                    <Text style={[styles.deviceInfo, { color: colors.subText, marginTop: 4 }]}>
                      Messages: {session.message_count}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.joinBtn, { backgroundColor: colors.primary }]}
                    onPress={() => setSelectedChat(session)}
                  >
                    <Text style={styles.joinBtnText}>Join</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>

      <Modal
        visible={!!selectedChat}
        animationType="slide"
        onRequestClose={() => setSelectedChat(null)}
        presentationStyle="pageSheet"
      >
        {selectedChat && (
          <AnonymousChat
            deviceId={selectedChat.deviceid}
            deviceName={selectedChat.devicename || selectedChat.deviceid}
            sessionId={selectedChat.session_id}
            onClose={() => setSelectedChat(null)}
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
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  statsText: {
    fontSize: 20,
    fontWeight: '800',
  },
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
  },
  primaryBtn: {
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  deviceRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  deviceName: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  deviceInfo: {
    fontSize: 12,
  },
  emptyText: {
    fontSize: 13,
    fontStyle: 'italic',
  },
  searchRow: {
    flexDirection: 'row',
    gap: 8,
  },
  searchBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 10,
  },
  joinBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  joinBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
});
