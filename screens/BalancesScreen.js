import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import BalancesList from '../components/BalancesList';

const Stack = createStackNavigator();

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
    </Stack.Navigator>
  );
};

export default BalancesScreen;
