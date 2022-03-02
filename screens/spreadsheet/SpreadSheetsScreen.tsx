import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import SpreadSheetsList from './components/SpreadSheetsList';

type StackParamList = {
  SpreadsheetPicker: undefined;
};
const Stack = createStackNavigator<StackParamList>();

function SpreadSheetsScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{ title: 'Choose aspire file' }}
        name="SpreadsheetPicker"
        component={SpreadSheetsList}
      ></Stack.Screen>
    </Stack.Navigator>
  );
}

export default SpreadSheetsScreen;
