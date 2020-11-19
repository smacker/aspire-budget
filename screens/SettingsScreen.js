import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import SettingsList from '../components/SettingsList';

const Stack = createStackNavigator();

const SettingsScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{
          title: 'Settings',
        }}
        name="Categories"
        component={SettingsList}
      />
    </Stack.Navigator>
  );
};

export default SettingsScreen;
