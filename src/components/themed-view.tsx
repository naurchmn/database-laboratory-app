import type { ViewProps } from 'react-native';
import { View } from 'react-native';

import { Colors } from '../constants/theme';
import { useColorScheme } from '../hooks/use-color-scheme';

type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...rest }: ThemedViewProps) {
  const theme = useColorScheme() ?? 'light';
  const backgroundColor =
    theme === 'light' ? (lightColor ?? Colors.light.background) : (darkColor ?? Colors.dark.background);

  return <View style={[{ backgroundColor }, style]} {...rest} />;
}
