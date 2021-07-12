import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

import TransactionForm from './TransactionForm';
import Currency from './Currency';

import { colors } from './constants';

const styles = StyleSheet.create({
  Container: {
    flex: 1,
  },
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

function Amounts({ item }) {
  return (
    <View style={styles.Amounts}>
      <View style={styles.Amount}>
        <Text>Budgeted</Text>
        <Currency
          style={[styles.AmountValue, styles.BudgetedAmount]}
          value={item.budgetedTotal}
        />
      </View>
      <View style={styles.Amount}>
        <Text>Available</Text>
        <Currency
          style={[styles.AmountValue, styles.AvailableAmount]}
          value={item.available}
        />
      </View>
      <View style={styles.Amount}>
        <Text>Activity</Text>
        <Currency
          style={[styles.AmountValue, styles.ActivityAmount]}
          value={item.activity}
        />
      </View>
    </View>
  );
}

function Category({ route, navigation }) {
  return (
    <View style={styles.Container}>
      <Amounts item={route.params} />
      <TransactionForm
        categoryInit={route.params.name}
        back={() => navigation.goBack()}
      />
    </View>
  );
}

export default Category;
