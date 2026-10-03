import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

export default function CircuitBackground() {
  const { theme } = useTheme();

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Image
        source={require('../../assets/circuit-bg.png')}
        style={[
          styles.circuitImage,
          {
            opacity: theme === 'dark' ? 0.09 : 0.06,
            tintColor: theme === 'dark' ? '#38bdf8' : '#2563eb',
          },
        ]}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  circuitImage: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
});
