const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname, {
  isCSSEnabled: true,
});

config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve("react-native-svg-transformer"),
};

config.resolver = {
  ...config.resolver,
  sourceExts: [...config.resolver.sourceExts, "svg"],
  assetExts: config.resolver.assetExts.filter((ext) => ext !== "svg"),
};

module.exports = withNativeWind(config, {
  input: "./global.css",
});