import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import TransactionForm from '../../../components/TransactionForm';
import Currency from '../../../components/Currency';
import { StackParamList } from '../BalancesScreen';

import { colors } from '../../../components/constants';
import { unsetColor } from '../../../components/utils';

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
  AmountValue: (v: number) => ({
    fontSize: 20,
    fontWeight: 'bold',
    color: unsetColor(v, v > 0 ? colors.available : colors.activity),
  }),
});

type Props = StackScreenProps<StackParamList, 'Account'>;

function Account({ route, navigation }: Props) {
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

export default Account;
