import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Currency from '../../../components/Currency';

import { useStore, useGate } from 'effector-react';
import { StatsGate, $statsPending, $stats } from '../../../state/dashboard';

import { colors } from '../../../components/constants';
import { unsetColor } from '../../../components/utils';

const styles = StyleSheet.create<any>({
  container: {
    width: '100%',
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
  const pending = useStore($statsPending);
  const stats = useStore($stats);

  useGate(StatsGate);

  if (pending) {
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
          style={styles.AvailableValue(stats.toBudget)}
          value={+stats.toBudget}
        />
      </View>
      <View style={styles.item}>
        <Text>spent</Text>
        <Currency
          style={styles.ActivityValue(stats.spent)}
          value={+stats.spent}
        />
      </View>
      <View style={styles.item}>
        <Text>pending</Text>
        <Text style={styles.PendingTxsValue(stats.pending)}>
          {stats.pending}
        </Text>
      </View>
    </View>
  );
}

export default Header;
