import React from 'react';

import { StyleSheet, Pressable, ImageBackground, Text } from 'react-native';
import splash from '../assets/splash.png';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
    resizeMode: 'center',
  },
  text: {
    marginTop: 180,
    textAlign: 'center',
    fontSize: 20,
  },
});

function LockScreen({ onClick, onLayout }) {
  return (
    <Pressable onPress={onClick} style={styles.container} onLayout={onLayout}>
      <ImageBackground source={splash} style={styles.image}>
        <Text style={styles.text}>Tap to unlock</Text>
      </ImageBackground>
    </Pressable>
  );
}

export default LockScreen;
