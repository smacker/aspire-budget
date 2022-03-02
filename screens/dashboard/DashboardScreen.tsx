import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import CategoriesBalance from './components/CategoriesBalance';
import Category from './components/Category';
import Header from './components/Header';
import { Category as CategoryType } from '../../types';

export type StackParamList = {
  Categories: undefined;
  Category: CategoryType;
};
const Stack = createStackNavigator<StackParamList>();

function DashboardScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{
          title: 'Dashboard',
          headerTitle: (props) => <Header {...props} />,
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
