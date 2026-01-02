import type { TextProps } from 'react-native';
import { StyleSheet, Text } from 'react-native';

import { Colors } from '../constants/theme';
import { useColorScheme } from '../hooks/use-color-scheme';

type ThemedTextType = 'default' | 'defaultSemiBold';

type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: ThemedTextType;
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const theme = useColorScheme() ?? 'light';
  const color = theme === 'light' ? (lightColor ?? Colors.light.text) : (darkColor ?? Colors.dark.text);

  return <Text style={[{ color }, styles[type], style]} {...rest} />;
}

const styles = StyleSheet.create({
  default: {},
  defaultSemiBold: {
    fontWeight: '600',
  },
});
