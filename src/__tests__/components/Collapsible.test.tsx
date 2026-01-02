import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import renderer, { act } from 'react-test-renderer';

import { Collapsible } from '../../components/ui/collapsible';
import * as colorScheme from '../../hooks/use-color-scheme';

describe('Collapsible', () => {
  it('renders title and toggles children visibility', () => {
    jest.spyOn(colorScheme, 'useColorScheme').mockReturnValue('light');

    let tree!: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(
        <Collapsible title="Section">
          <Text>Child content</Text>
        </Collapsible>
      );
    });

    expect(() => tree.root.findByProps({ children: 'Child content' })).toThrow();

    const pressable = tree.root.findByType(TouchableOpacity);
    act(() => {
      pressable.props.onPress();
    });

    expect(tree.root.findByProps({ children: 'Child content' })).toBeTruthy();

    act(() => {
      pressable.props.onPress();
    });

    expect(() => tree.root.findByProps({ children: 'Child content' })).toThrow();
  });
});
