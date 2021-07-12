import React, { useContext } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import Currency from './Currency';

import { useRequireAsync } from '../state/useAsync';
import { StateContext } from '../state/stateContext';

import { colors } from './constants';
import { unsetColor } from './utils';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  item: {
    alignItems: 'center',
  },
  monthContainer: {
    justifyContent: 'center',
  },
  monthText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  AvailableValue: (v) => ({
    color: unsetColor(v, colors.available),
  }),
  ActivityValue: (v) => ({
    color: unsetColor(v, colors.activity),
  }),
  PendingTxsValue: (v) => ({
    color: unsetColor(v, colors.budgeted),
  }),
});

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

function Header() {
  const { stats } = useContext(StateContext);
  const { status, value, execute } = stats;

  useRequireAsync(status, execute);

  if (status !== 'success') {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.monthContainer}>
        <Text style={styles.monthText}>{months[new Date().getMonth()]}</Text>
      </View>
      <View style={styles.item}>
        <Text>to budget</Text>
        <Currency
          style={styles.AvailableValue(value.toBudget)}
          value={value.toBudget}
        />
      </View>
      <View style={styles.item}>
        <Text>spent</Text>
        <Currency
          style={styles.ActivityValue(value.spent)}
          value={value.spent}
        />
      </View>
      <View style={styles.item}>
        <Text>pending</Text>
        <Text style={styles.PendingTxsValue(value.pending)}>
          {value.pending}
        </Text>
      </View>
    </View>
  );
}

export default Header;
