import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import TransactionForm from '../../../components/TransactionForm';
import Currency from '../../../components/Currency';
import { StackParamList } from '../DashboardScreen';

import { colors } from '../../../components/constants';
import { Category as CategoryType } from '../../../types';
import { coloredValue } from '../../../components/utils';

const styles = StyleSheet.create<any>({
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
  AvailableAmount: (v: number, total: number) => ({
    color: coloredValue(v, total, colors.available),
  }),
  ActivityAmount: {
    color: colors.activity,
  },
});

function Amounts({ item }: { item: CategoryType }) {
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
          style={[
            styles.AmountValue,
            styles.AvailableAmount(item.available, item.budgetedTotal),
          ]}
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

type Props = StackScreenProps<StackParamList, 'Category'>;

function Category({ route, navigation }: Props) {
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
