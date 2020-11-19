import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

import TransactionForm from './TransactionForm';

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
        <Text style={[styles.AmountValue, styles.BudgetedAmount]}>
          {item.budgeted}
        </Text>
      </View>
      <View style={styles.Amount}>
        <Text>Available</Text>
        <Text style={[styles.AmountValue, styles.AvailableAmount]}>
          {item.available}
        </Text>
      </View>
      <View style={styles.Amount}>
        <Text>Activity</Text>
        <Text style={[styles.AmountValue, styles.ActivityAmount]}>
          {item.activity}
        </Text>
      </View>
    </View>
  );
}

function Category({ route, navigation }) {
  return (
    <View style={styles.Container}>
      <Amounts item={route.params} />
      <TransactionForm
        category={route.params.name}
        back={() => navigation.goBack()}
      />
    </View>
  );
}

export default Category;
