import * as Haptics from 'expo-haptics';
import { HapticTab } from '../../components/haptic-tab';

describe('HapticTab', () => {
  it('triggers haptics on iOS press-in and calls original handler', () => {
    const original = process.env.EXPO_OS;
    process.env.EXPO_OS = 'ios';

    const onPressIn = jest.fn();
    const element = HapticTab({ onPressIn } as any);

    const ev = {} as any;
    element.props.onPressIn(ev);

    expect(Haptics.impactAsync).toHaveBeenCalledWith('light');
    expect(onPressIn).toHaveBeenCalledWith(ev);

    process.env.EXPO_OS = original;
  });

  it('does not trigger haptics on non-iOS', () => {
    const original = process.env.EXPO_OS;
    process.env.EXPO_OS = 'android';

    const onPressIn = jest.fn();
    const element = HapticTab({ onPressIn } as any);

    element.props.onPressIn({} as any);

    expect(Haptics.impactAsync).not.toHaveBeenCalled();
    expect(onPressIn).toHaveBeenCalled();

    process.env.EXPO_OS = original;
  });
});
