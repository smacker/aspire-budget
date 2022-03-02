import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import SettingsList from './components/SettingsList';

type StackParamList = {
  Settings: undefined;
};
const Stack = createStackNavigator<StackParamList>();

const SettingsScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{
          title: 'Settings',
        }}
        name="Settings"
        component={SettingsList}
      />
    </Stack.Navigator>
  );
};

export default SettingsScreen;
