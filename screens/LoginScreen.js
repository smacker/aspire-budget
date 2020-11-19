import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Loading from '../components/Loading';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  header1Container: {},
  header1: {
    fontSize: 60,
    fontWeight: 'bold',
  },
  header2Container: {
    marginBottom: 45,
  },
  header2: {
    fontSize: 35,
  },
  actionContainer: {
    height: 30,
  },
});

function LoginScreen({ authStatus, login }) {
  return (
    <View style={styles.container}>
      <View style={styles.header1Container}>
        <Text style={styles.header1}>Aspire</Text>
      </View>
      <View style={styles.header2Container}>
        <Text style={styles.header2}>budgeting</Text>
      </View>
      <View style={styles.actionContainer}>
        {authStatus === 'pending' ? (
          <Loading size="large" />
        ) : (
          <Ionicons.Button name="logo-google" onPress={() => login()}>
            Sign in with Google
          </Ionicons.Button>
        )}
      </View>
    </View>
  );
}

export default LoginScreen;
