import React from 'react';
import { StyleSheet, View, Button, Text } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  text: {
    marginBottom: 20,
  },
});

function Retry({ action }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Oops. Something went wrong.</Text>
      <Button title="Retry" onPress={action} />
    </View>
  );
}

export default Retry;
