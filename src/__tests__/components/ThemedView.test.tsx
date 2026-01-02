import React from 'react';
import { StyleSheet, View } from 'react-native';
import renderer from 'react-test-renderer';

import { ThemedView } from '../../components/themed-view';
import { Colors } from '../../constants/theme';
import * as colorScheme from '../../hooks/use-color-scheme';

describe('ThemedView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('uses light theme default background color', () => {
    jest.spyOn(colorScheme, 'useColorScheme').mockReturnValue('light');

    let tree!: renderer.ReactTestRenderer;
    renderer.act(() => {
      tree = renderer.create(<ThemedView />);
    });
    const node = tree.root.findByType(View);

    const style = StyleSheet.flatten(node.props.style);
    expect(style.backgroundColor).toBe(Colors.light.background);
  });

  it('uses dark theme default background color', () => {
    jest.spyOn(colorScheme, 'useColorScheme').mockReturnValue('dark');

    let tree!: renderer.ReactTestRenderer;
    renderer.act(() => {
      tree = renderer.create(<ThemedView />);
    });
    const node = tree.root.findByType(View);

    const style = StyleSheet.flatten(node.props.style);
    expect(style.backgroundColor).toBe(Colors.dark.background);
  });

  it('respects lightColor/darkColor overrides', () => {
    jest.spyOn(colorScheme, 'useColorScheme').mockReturnValue('light');

    let tree!: renderer.ReactTestRenderer;
    renderer.act(() => {
      tree = renderer.create(<ThemedView lightColor="#fafafa" darkColor="#111111" />);
    });
    const node = tree.root.findByType(View);

    const style = StyleSheet.flatten(node.props.style);
    expect(style.backgroundColor).toBe('#fafafa');
  });
});
