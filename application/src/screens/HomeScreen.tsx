import React, { useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import CircuitBackground from '../components/CircuitBackground';
import {
  Radar,
  MapPin,
  AlertTriangle,
  Radio,
  ChevronRight,
  Sun,
  Moon,
  LogOut,
  Wifi,
  Shield,
  Activity,
  LayoutDashboard,
} from 'lucide-react-native';

export default function HomeScreen({ navigation }: any) {
  const { user, logout } = useAuth();
  const { theme, setThemeSetting, colors } = useTheme();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={styles.navHeaderBrand}>
          <View style={styles.navLogoIcon}>
            <Wifi color="#ffffff" size={16} />
          </View>
          <Text style={[styles.navHeaderTitle, { color: colors.text }]}>SPORS</Text>
          <View style={[styles.navMeshBadge, { backgroundColor: colors.badgeBg, borderColor: colors.badgeBorder }]}>
            <View style={[styles.pulseDot, { backgroundColor: colors.emerald }]} />
            <Text style={[styles.navMeshText, { color: colors.emerald }]}>ONLINE</Text>
          </View>
        </View>
      ),
      headerRight: () => (
        <View style={styles.headerRightControls}>
          <TouchableOpacity
            style={[styles.headerIconButton, { backgroundColor: colors.cardElevated, borderColor: colors.border }]}
            onPress={() => setThemeSetting(theme === 'dark' ? 'light' : 'dark')}
            activeOpacity={0.7}
          >
            {theme === 'dark' ? <Sun color={colors.sky} size={18} /> : <Moon color={colors.sky} size={18} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.headerIconButton, { backgroundColor: colors.roseBg, borderColor: 'rgba(244, 63, 94, 0.25)' }]}
            onPress={logout}
            activeOpacity={0.7}
          >
            <LogOut color={colors.rose} size={17} />
          </TouchableOpacity>
        </View>
      ),
      headerStyle: {
        backgroundColor: colors.card,
      },
    });
  }, [navigation, theme, colors, logout]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />
      <CircuitBackground />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero User Banner */}
        <View style={[styles.heroCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.heroTopRow}>
            <View>
              <Text style={[styles.greetingLabel, { color: colors.subText }]}>OPERATOR CONSOLE</Text>
              <Text style={[styles.operatorName, { color: colors.text }]}>
                {user?.firstname || user?.username || 'Field Node'}
              </Text>
            </View>

            <View style={[styles.roleBadge, { backgroundColor: colors.badgeBg, borderColor: colors.badgeBorder }]}>
              <Shield color={colors.sky} size={12} />
              <Text style={[styles.roleText, { color: colors.sky }]}>
                {(user?.role || 'PEER').toUpperCase()}
              </Text>
            </View>
          </View>

          {/* Telemetry Status Strip */}
          <View style={[styles.telemetryBar, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <View style={styles.telemetryItem}>
              <View style={[styles.pulseDot, { backgroundColor: colors.emerald }]} />
              <Text style={[styles.telemetryLabel, { color: colors.subText }]}>MESH: </Text>
              <Text style={[styles.telemetryVal, { color: colors.emerald }]}>READY</Text>
            </View>
            <View style={styles.telemetryDivider} />
            <View style={styles.telemetryItem}>
              <Activity color={colors.sky} size={12} />
              <Text style={[styles.telemetryLabel, { color: colors.subText }]}>RELAY: </Text>
              <Text style={[styles.telemetryVal, { color: colors.sky }]}>ACTIVE</Text>
            </View>
          </View>
        </View>

        {/* Section Heading */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Tracking Services</Text>
          <Text style={[styles.sectionSubtitle, { color: colors.subText }]}>
            Decentralized offline device recovery tools
          </Text>
        </View>

        {/* Action Grid */}
        <View style={styles.grid}>
          {/* 1. Network Scanner */}
          <TouchableOpacity
            style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => navigation.navigate('Scanner')}
            activeOpacity={0.75}
          >
            <View style={styles.cardHeaderRow}>
              <View style={[styles.iconBox, { backgroundColor: 'rgba(56, 189, 248, 0.12)', borderColor: 'rgba(56, 189, 248, 0.3)' }]}>
                <Radar color={colors.sky} size={24} />
              </View>
              <View style={[styles.serviceTag, { backgroundColor: colors.badgeBg }]}>
                <Text style={[styles.serviceTagText, { color: colors.sky }]}>SCANNER</Text>
              </View>
            </View>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Network Scanner</Text>
            <Text style={[styles.cardDesc, { color: colors.subText }]}>
              Detect nearby lost device beacons and relay encrypted fixes anonymously.
            </Text>
            <View style={styles.cardFooter}>
              <Text style={[styles.cardActionText, { color: colors.sky }]}>Start scan</Text>
              <ChevronRight color={colors.sky} size={16} />
            </View>
          </TouchableOpacity>

          {/* 2. Find My Device */}
          <TouchableOpacity
            style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => navigation.navigate('LocateDevice')}
            activeOpacity={0.75}
          >
            <View style={styles.cardHeaderRow}>
              <View style={[styles.iconBox, { backgroundColor: 'rgba(37, 99, 235, 0.12)', borderColor: 'rgba(37, 99, 235, 0.3)' }]}>
                <MapPin color={colors.primary} size={24} />
              </View>
              <View style={[styles.serviceTag, { backgroundColor: 'rgba(37, 99, 235, 0.12)' }]}>
                <Text style={[styles.serviceTagText, { color: '#60a5fa' }]}>GPS MAP</Text>
              </View>
            </View>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Find My Device</Text>
            <Text style={[styles.cardDesc, { color: colors.subText }]}>
              Locate missing hardware on interactive map with real-time triangulation.
            </Text>
            <View style={styles.cardFooter}>
              <Text style={[styles.cardActionText, { color: colors.primary }]}>Open tracker</Text>
              <ChevronRight color={colors.primary} size={16} />
            </View>
          </TouchableOpacity>

          {/* 3. Report Lost */}
          <TouchableOpacity
            style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => navigation.navigate('ReportLost')}
            activeOpacity={0.75}
          >
            <View style={styles.cardHeaderRow}>
              <View style={[styles.iconBox, { backgroundColor: colors.roseBg, borderColor: 'rgba(244, 63, 94, 0.3)' }]}>
                <AlertTriangle color={colors.rose} size={24} />
              </View>
              <View style={[styles.serviceTag, { backgroundColor: colors.roseBg }]}>
                <Text style={[styles.serviceTagText, { color: colors.rose }]}>SOS STATUS</Text>
              </View>
            </View>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Report Lost</Text>
            <Text style={[styles.cardDesc, { color: colors.subText }]}>
              Flag a device as lost to instruct all community nodes to listen for its signal.
            </Text>
            <View style={styles.cardFooter}>
              <Text style={[styles.cardActionText, { color: colors.rose }]}>Update status</Text>
              <ChevronRight color={colors.rose} size={16} />
            </View>
          </TouchableOpacity>

          {/* 4. Bind Phone Beacon */}
          <TouchableOpacity
            style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => navigation.navigate('BindDevice')}
            activeOpacity={0.75}
          >
            <View style={styles.cardHeaderRow}>
              <View style={[styles.iconBox, { backgroundColor: 'rgba(129, 140, 248, 0.12)', borderColor: 'rgba(129, 140, 248, 0.3)' }]}>
                <Radio color="#818cf8" size={24} />
              </View>
              <View style={[styles.serviceTag, { backgroundColor: 'rgba(129, 140, 248, 0.12)' }]}>
                <Text style={[styles.serviceTagText, { color: '#a5b4fc' }]}>BLE BEACON</Text>
              </View>
            </View>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Make Beacon</Text>
            <Text style={[styles.cardDesc, { color: colors.subText }]}>
              Assign this physical phone as a hardware beacon broadcast relay.
            </Text>
            <View style={styles.cardFooter}>
              <Text style={[styles.cardActionText, { color: '#818cf8' }]}>Configure beacon</Text>
              <ChevronRight color="#818cf8" size={16} />
            </View>
          </TouchableOpacity>

          {/* 5. Police Dashboard (conditional) */}
          {(user?.role === 'admin' || user?.role === 'police') && (
            <TouchableOpacity
              style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => navigation.navigate('Dashboard')}
              activeOpacity={0.75}
            >
              <View style={styles.cardHeaderRow}>
                <View style={[styles.iconBox, { backgroundColor: 'rgba(234, 179, 8, 0.12)', borderColor: 'rgba(234, 179, 8, 0.3)' }]}>
                  <LayoutDashboard color="#eab308" size={24} />
                </View>
                <View style={[styles.serviceTag, { backgroundColor: 'rgba(234, 179, 8, 0.12)' }]}>
                  <Text style={[styles.serviceTagText, { color: '#fde047' }]}>CONTROL PANEL</Text>
                </View>
              </View>
              <Text style={[styles.cardTitle, { color: colors.text }]}>
                {user?.role === 'admin' ? 'Admin Dashboard' : 'Police Dashboard'}
              </Text>
              <Text style={[styles.cardDesc, { color: colors.subText }]}>
                Monitor all lost devices and manage communications securely.
              </Text>
              <View style={styles.cardFooter}>
                <Text style={[styles.cardActionText, { color: '#eab308' }]}>Open dashboard</Text>
                <ChevronRight color="#eab308" size={16} />
              </View>
            </TouchableOpacity>
          )}
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
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 36,
  },
  navHeaderBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  navLogoIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navHeaderTitle: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  navMeshBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  navMeshText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  headerRightControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginRight: 4,
  },
  headerIconButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    marginBottom: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  greetingLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  operatorName: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  roleText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  telemetryBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 9,
    paddingHorizontal: 14,
  },
  telemetryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  telemetryLabel: {
    fontSize: 10,
    fontWeight: '700',
  },
  telemetryVal: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  telemetryDivider: {
    width: 1,
    height: 14,
    backgroundColor: '#334155',
    marginHorizontal: 16,
  },
  sectionHeader: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
    marginBottom: 3,
  },
  sectionSubtitle: {
    fontSize: 13,
  },
  grid: {
    gap: 12,
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 13,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  serviceTagText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  cardDesc: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 14,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 'auto',
  },
  cardActionText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
