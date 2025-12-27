const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// support .cjs (kadang dibutuhkan beberapa lib)
config.resolver.sourceExts.push("cjs");

module.exports = withNativeWind(config, {
  input: "./app/globals.css",
});
