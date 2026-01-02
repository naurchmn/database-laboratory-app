import React from 'react';
import { StyleSheet, Text } from 'react-native';
import renderer from 'react-test-renderer';

import { ThemedText } from '../../components/themed-text';
import { Colors } from '../../constants/theme';
import * as colorScheme from '../../hooks/use-color-scheme';

describe('ThemedText', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('uses light theme default text color', () => {
    jest.spyOn(colorScheme, 'useColorScheme').mockReturnValue('light');

    let tree!: renderer.ReactTestRenderer;
    renderer.act(() => {
      tree = renderer.create(<ThemedText>hello</ThemedText>);
    });
    const node = tree.root.findByType(Text);

    const style = StyleSheet.flatten(node.props.style);
    expect(style.color).toBe(Colors.light.text);
  });

  it('uses dark theme default text color', () => {
    jest.spyOn(colorScheme, 'useColorScheme').mockReturnValue('dark');

    let tree!: renderer.ReactTestRenderer;
    renderer.act(() => {
      tree = renderer.create(<ThemedText>hello</ThemedText>);
    });
    const node = tree.root.findByType(Text);

    const style = StyleSheet.flatten(node.props.style);
    expect(style.color).toBe(Colors.dark.text);
  });

  it('respects lightColor/darkColor overrides', () => {
    jest.spyOn(colorScheme, 'useColorScheme').mockReturnValue('dark');

    let tree!: renderer.ReactTestRenderer;
    renderer.act(() => {
      tree = renderer.create(
        <ThemedText lightColor="#111111" darkColor="#222222">
          hello
        </ThemedText>
      );
    });
    const node = tree.root.findByType(Text);

    const style = StyleSheet.flatten(node.props.style);
    expect(style.color).toBe('#222222');
  });

  it('applies defaultSemiBold type style', () => {
    jest.spyOn(colorScheme, 'useColorScheme').mockReturnValue('light');

    let tree!: renderer.ReactTestRenderer;
    renderer.act(() => {
      tree = renderer.create(<ThemedText type="defaultSemiBold">hello</ThemedText>);
    });
    const node = tree.root.findByType(Text);

    const style = StyleSheet.flatten(node.props.style);
    expect(style.fontWeight).toBe('600');
  });
});
