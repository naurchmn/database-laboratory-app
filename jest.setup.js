// Mock all Expo and React Native modules
jest.mock("expo-web-browser", () => ({
  maybeCompleteAuthSession: jest.fn(),
}));

jest.mock("expo-constants", () => ({
  __esModule: true,
  default: {
    appOwnership: "expo",
  },
}));

jest.mock("expo-auth-session", () => ({
  ResponseType: {
    IdToken: "id_token",
  },
  makeRedirectUri: jest.fn(() => "https://auth.expo.dev/@test/app"),
}));

jest.mock("expo-auth-session/providers/google", () => ({
  useAuthRequest: jest.fn(() => [null, null, jest.fn()]),
}));

// Minimal React Native mock for component tests (avoids parsing real RN Flow/ESM)
jest.mock('react-native', () => {
  const React = require('react');

  const createHostComponent = (name) => {
    return function HostComponent(props) {
      return React.createElement(name, props, props?.children);
    };
  };

  const flattenStyle = (style) => {
    if (Array.isArray(style)) {
      return style.reduce((acc, item) => Object.assign(acc, flattenStyle(item)), {});
    }
    return style || {};
  };

  return {
    __esModule: true,
    View: createHostComponent('View'),
    Text: createHostComponent('Text'),
    TouchableOpacity: createHostComponent('TouchableOpacity'),
    StyleSheet: {
      create: (styles) => styles,
      flatten: flattenStyle,
    },
    Platform: {
      OS: 'ios',
      select: (obj) => obj?.ios ?? obj?.default,
    },
    useColorScheme: jest.fn(() => 'light'),
  };
});

// Mock react-navigation elements to avoid ESM import issues in tests
jest.mock('@react-navigation/elements', () => {
  const React = require('react');
  return {
    __esModule: true,
    PlatformPressable: (props) => React.createElement('PlatformPressable', props, props?.children),
  };
});

// Mock vector icons + symbols to keep component tests stable
jest.mock("expo-symbols", () => ({}));

jest.mock("@expo/vector-icons/MaterialIcons", () => {
  const React = require("react");
  return {
    __esModule: true,
    default: () => React.createElement(React.Fragment, null),
  };
});

// Mock Firebase
jest.mock("./src/lib/firebase", () => ({
  db: {},
  storage: {},
  auth: {
    currentUser: null,
  },
}));

// Mock expo-linear-gradient for component testing
jest.mock("expo-linear-gradient", () => ({
  LinearGradient: ({ children, testID, style }) => {
    const React = require("react");
    const { View } = require("react-native");
    return React.createElement(View, { testID: testID || "linear-gradient", style }, children);
  },
}));

// Mock @react-native-masked-view/masked-view
jest.mock("@react-native-masked-view/masked-view", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: ({ children, maskElement }) => {
      return React.createElement(View, { testID: "masked-view" }, [maskElement, children]);
    },
  };
});

// Mock expo-router
jest.mock("expo-router", () => ({
  router: {
    replace: jest.fn(),
    push: jest.fn(),
    back: jest.fn(),
  },
  Link: ({ children, href, style }) => {
    const React = require("react");
    const { Text } = require("react-native");
    return React.createElement(Text, { testID: `link-${href}`, style }, children);
  },
  useRouter: () => ({
    replace: jest.fn(),
    push: jest.fn(),
    back: jest.fn(),
  }),
}));

// Mock expo-haptics
jest.mock("expo-haptics", () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: "light",
    Medium: "medium",
    Heavy: "heavy",
  },
}));

// Suppress console errors/warnings during tests
const originalConsole = { ...console };
global.console = {
  ...originalConsole,
  error: jest.fn(),
  warn: jest.fn(),
  log: originalConsole.log,
};
