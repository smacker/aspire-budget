import React from 'react';

import { StyleSheet, Pressable, ImageBackground, Text } from 'react-native';
import splash from '../assets/splash.png';

const styles = StyleSheet.create({
  container: {
    display: 'none',
    flex: 1,
  },
  visible: {
    display: 'flex',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
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

function LockScreen({ onClick, isLocked, children }) {
  return (
    <>
      {children}
      <Pressable
        onPress={onClick}
        style={[styles.container, isLocked && styles.visible]}
      >
        <ImageBackground source={splash} style={styles.image}>
          <Text style={styles.text}>Tap to unlock</Text>
        </ImageBackground>
      </Pressable>
    </>
  );
}

export default LockScreen;
