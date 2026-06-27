/**
 * @file StatBar.tsx
 * @layer Features / Pokédex / Components
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { colors, spacing, borderRadius } from '@/ui/tokens';
import { Label, Typography } from '@/ui/components/Typography';

const MAX_STAT = 255;

const getStatColor = (value: number): string => {
  if (value >= 100) return colors.success;
  if (value >= 60) return colors.warning;
  return colors.error;
};

interface StatBarProps {
  label: string;
  value: number;
  testID?: string;
}

export const StatBar: React.FC<StatBarProps> = ({ label, value, testID }) => {
  const animWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animWidth, {
      toValue: Math.min((value / MAX_STAT) * 100, 100),
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [value, animWidth]);

  const barColor = getStatColor(value);

  const widthInterpolated = animWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container} testID={testID}>
      <Label
        size="sm"
        color="textSecondary"
        style={styles.label}
        testID={testID ? `${testID}-label` : undefined}
      >
        {label}
      </Label>

      <Typography
        variant="statValue"
        style={styles.value}
        testID={testID ? `${testID}-value` : undefined}
      >
        {value}
      </Typography>

      <View style={styles.barBackground} testID={testID ? `${testID}-bar` : undefined}>
        <Animated.View
          style={[
            styles.barFill,
            {
              backgroundColor: barColor,
              width: widthInterpolated,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginVertical: spacing.xxxs,
  },
  label: {
    width: 70,
    textAlign: 'right',
  },
  value: {
    width: 36,
    textAlign: 'right',
  },
  barBackground: {
    flex: 1,
    height: 8,
    backgroundColor: colors.surfaceMuted,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
});
