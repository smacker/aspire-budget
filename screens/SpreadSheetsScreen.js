import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import SpreadSheetsList from '../components/SpreadSheetsList';

const Stack = createStackNavigator();

function SpreadSheetsScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{ title: 'Choose aspire file' }}
        name="spreadsheet-picker"
        component={SpreadSheetsList}
      ></Stack.Screen>
    </Stack.Navigator>
  );
}

export default SpreadSheetsScreen;
