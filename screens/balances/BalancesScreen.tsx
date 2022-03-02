import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import BalancesList from './components/BalancesList';
import Account from './components/Account';
import { Balance } from '../../types';

export type StackParamList = {
  BalancesList: undefined;
  Account: Balance;
};
const Stack = createStackNavigator<StackParamList>();

const BalancesScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{
          title: 'Balances',
        }}
        name="BalancesList"
        component={BalancesList}
      />
      <Stack.Screen
        name="Account"
        component={Account}
        options={({ route }) => ({ title: route.params.name })}
      />
    </Stack.Navigator>
  );
};

export default BalancesScreen;
