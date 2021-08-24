import React from 'react';
import { StyleSheet, View } from 'react-native';

import TransactionForm from './TransactionForm';

import { colors } from './constants';

const styles = StyleSheet.create({
  Container: {
    flex: 1,
  },
  // FIXME
  Amounts: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingTop: 10,
    paddingBottom: 10,
    marginBottom: 20,
  },
  Amount: {
    flex: 1,
    alignItems: 'center',
  },
  AmountValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  BudgetedAmount: {
    color: colors.budgeted,
  },
  AvailableAmount: {
    color: colors.available,
  },
  ActivityAmount: {
    color: colors.activity,
  },
});

// <Amounts item={route.params} />
function Balance({ route, navigation }) {
  return (
    <View style={styles.Container}>
      <TransactionForm
        accountInit={route.params.name}
        back={() => navigation.goBack()}
      />
    </View>
  );
}

export default Balance;
