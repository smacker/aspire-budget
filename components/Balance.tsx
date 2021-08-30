import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

import TransactionForm from './TransactionForm';
import Currency from './Currency';

import { colors } from './constants';
import { unsetColor } from './utils';

const styles = StyleSheet.create<any>({
  Container: {
    flex: 1,
  },
  Amount: {
    backgroundColor: '#fff',
    paddingTop: 10,
    paddingBottom: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  AmountValue: (v) => ({
    fontSize: 20,
    fontWeight: 'bold',
    color: unsetColor(v, v > 0 ? colors.available : colors.activity),
  }),
});

function Balance({ route, navigation }) {
  const { name, amount } = route.params;
  return (
    <View style={styles.Container}>
      <View style={styles.Amount}>
        <Text>Balance</Text>
        <Currency style={styles.AmountValue(amount)} value={amount} />
      </View>
      <TransactionForm accountInit={name} back={() => navigation.goBack()} />
    </View>
  );
}

export default Balance;
