import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import CategoriesBalance from '../components/CategoriesBalance';
import Category from '../components/Category';

const Stack = createStackNavigator();

function DashboardScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{
          title: 'Dashboard',
        }}
        name="Categories"
        component={CategoriesBalance}
      />
      <Stack.Screen
        name="Category"
        component={Category}
        options={({ route }) => ({ title: route.params.name })}
      />
    </Stack.Navigator>
  );
}

export default DashboardScreen;
