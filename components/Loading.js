import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  fill: {
    flex: 1,
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});

function Loading({ size = 'small', fill = false }) {
  return (
    <View style={[styles.container, styles.horizontal, fill && styles.fill]}>
      <ActivityIndicator size={size} />
    </View>
  );
}

export default Loading;
