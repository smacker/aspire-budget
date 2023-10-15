module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['effector/babel-plugin', 'react-native-reanimated/plugin'],
  };
};
