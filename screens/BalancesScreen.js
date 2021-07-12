import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import BalancesList from '../components/BalancesList';
import Balance from '../components/Balance';

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
      <Stack.Screen
        name="Account"
        component={Balance}
        options={({ route }) => ({ title: route.params.name })}
      />
    </Stack.Navigator>
  );
};

export default BalancesScreen;
