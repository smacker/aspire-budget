module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'module:react-native-dotenv',
      'effector/babel-plugin',
      'react-native-reanimated/plugin',
    ],
  };
};
