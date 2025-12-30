import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient, type LinearGradientProps } from 'expo-linear-gradient';
import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';

const DEFAULT_COLORS = ['#652EC7', '#DF3983', '#FFD300'] as const;

type GradientTextProps = {
  children: React.ReactNode;
  colors?: LinearGradientProps['colors'];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  textStyle?: TextStyle;
} & Omit<TextProps, 'style'>;

export default function GradientText({
  children,
  colors = DEFAULT_COLORS,
  start = { x: 0, y: 0 },
  end = { x: 1, y: 0 },
  textStyle,
  ...textProps
}: GradientTextProps) {
  return (
    <MaskedView
      maskElement={
        <Text {...textProps} style={textStyle}>
          {children}
        </Text>
      }
    >
      <LinearGradient colors={colors} start={start} end={end}>
        <Text {...textProps} style={[textStyle, { opacity: 0 }]}>
          {children}
        </Text>
      </LinearGradient>
    </MaskedView>
  );
}