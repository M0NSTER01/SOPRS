import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import { Wifi, User, Lock, Phone, MapPin, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react-native';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import CircuitBackground from '../components/CircuitBackground';

export default function LoginScreen() {
  const { login, register } = useAuth();
  const { colors, theme } = useTheme();

  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');

  const handleSubmit = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Required Fields', 'Please enter your username and password.');
      return;
    }

    setIsLoading(true);
    try {
      if (isLoginMode) {
        await login(username.trim(), password.trim());
      } else {
        if (!contact.trim() || !address.trim()) {
          Alert.alert('Required Fields', 'Contact number and address are required to register.');
          setIsLoading(false);
          return;
        }
        await register({
          username: username.trim(),
          password: password.trim(),
          contact: contact.trim(),
          address: address.trim(),
        });
        Alert.alert('Success', 'Account created! You can now log in.');
        setIsLoginMode(true);
      }
    } catch (error: any) {
      Alert.alert('Authentication Failed', error.message || 'Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyDemo = () => {
    setUsername('sample');
    setPassword('sample');
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <CircuitBackground />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Brand Header */}
        <View style={styles.brandContainer}>
          <View style={[styles.logoBox, { shadowColor: colors.sky }]}>
            <Wifi color="#ffffff" size={32} />
          </View>
          <View style={styles.brandTitleRow}>
            <Text style={[styles.brandTitle, { color: colors.text }]}>SPORS</Text>
            <View style={[styles.networkTag, { backgroundColor: colors.badgeBg, borderColor: colors.badgeBorder }]}>
              <View style={[styles.pulseDot, { backgroundColor: colors.sky }]} />
              <Text style={[styles.networkTagText, { color: colors.badgeText }]}>NETWORK</Text>
            </View>
          </View>
          <Text style={[styles.subtitle, { color: colors.subText }]}>
            {isLoginMode
              ? 'Community-driven device tracking. Even when offline.'
              : 'Join the decentralized peer tracking mesh.'}
          </Text>
        </View>

        {/* Auth Card */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {/* Mode Switcher Tabs */}
          <View style={[styles.tabContainer, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <TouchableOpacity
              style={[
                styles.tab,
                isLoginMode && [styles.activeTab, { backgroundColor: colors.primary }],
              ]}
              onPress={() => setIsLoginMode(true)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: isLoginMode ? '#ffffff' : colors.subText },
                  isLoginMode && styles.activeTabText,
                ]}
              >
                Sign In
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tab,
                !isLoginMode && [styles.activeTab, { backgroundColor: colors.primary }],
              ]}
              onPress={() => setIsLoginMode(false)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: !isLoginMode ? '#ffffff' : colors.subText },
                  !isLoginMode && styles.activeTabText,
                ]}
              >
                Create Account
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form Fields */}
          <View style={styles.form}>
            {/* Username Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.subText }]}>USERNAME // ID</Text>
              <View style={[styles.inputWrapper, { backgroundColor: colors.background, borderColor: colors.border }]}>
                <User color={colors.sky} size={18} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Enter username"
                  placeholderTextColor={colors.subText}
                  autoCapitalize="none"
                  value={username}
                  onChangeText={setUsername}
                />
              </View>
            </View>

            {/* Extra Registration Fields */}
            {!isLoginMode && (
              <>
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: colors.subText }]}>CONTACT // PHONE</Text>
                  <View style={[styles.inputWrapper, { backgroundColor: colors.background, borderColor: colors.border }]}>
                    <Phone color={colors.sky} size={18} style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, { color: colors.text }]}
                      placeholder="+1 (555) 000-0000"
                      placeholderTextColor={colors.subText}
                      keyboardType="phone-pad"
                      value={contact}
                      onChangeText={setContact}
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: colors.subText }]}>RECOVERY ADDRESS</Text>
                  <View style={[styles.inputWrapper, { backgroundColor: colors.background, borderColor: colors.border }]}>
                    <MapPin color={colors.sky} size={18} style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, { color: colors.text }]}
                      placeholder="Home / Organization Location"
                      placeholderTextColor={colors.subText}
                      value={address}
                      onChangeText={setAddress}
                    />
                  </View>
                </View>
              </>
            )}

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.subText }]}>ENCRYPTION KEY // PASSWORD</Text>
              <View style={[styles.inputWrapper, { backgroundColor: colors.background, borderColor: colors.border }]}>
                <Lock color={colors.sky} size={18} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Enter password"
                  placeholderTextColor={colors.subText}
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              </View>
            </View>

            {/* Primary Submit Button */}
            <TouchableOpacity
              style={[
                styles.submitButton,
                { backgroundColor: colors.primary, shadowColor: colors.primaryGlow },
              ]}
              onPress={handleSubmit}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              {isLoading ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <View style={styles.submitContent}>
                  <Text style={styles.submitText}>
                    {isLoginMode ? 'Connect to Network' : 'Register Peer Node'}
                  </Text>
                  <ArrowRight color="#ffffff" size={18} />
                </View>
              )}
            </TouchableOpacity>

            {/* Quick Demo Pre-fill Pill (Login Mode Only) */}
            {isLoginMode && (
              <TouchableOpacity
                style={[styles.demoPill, { backgroundColor: colors.badgeBg, borderColor: colors.badgeBorder }]}
                onPress={handleApplyDemo}
                activeOpacity={0.7}
              >
                <Sparkles color={colors.sky} size={14} />
                <Text style={[styles.demoText, { color: colors.sky }]}>
                  Try Demo: <Text style={styles.demoBold}>sample / sample</Text>
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Security Badge Footer */}
        <View style={styles.footerNote}>
          <ShieldCheck color={colors.emerald} size={16} />
          <Text style={[styles.footerText, { color: colors.subText }]}>
            Zero-knowledge encrypted location beacons.
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
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logoBox: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  networkTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  networkTagText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    maxWidth: 290,
    lineHeight: 20,
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 22,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 6,
  },
  tabContainer: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 22,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeTab: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
  },
  activeTabText: {
    fontWeight: '700',
  },
  form: {
    gap: 14,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
  },
  submitButton: {
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  submitContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  submitText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  demoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 4,
  },
  demoText: {
    fontSize: 12,
    fontWeight: '500',
  },
  demoBold: {
    fontWeight: '700',
  },
  footerNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 24,
  },
  footerText: {
    fontSize: 12,
  },
});
