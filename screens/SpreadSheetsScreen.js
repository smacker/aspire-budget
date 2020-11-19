import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import SpreadSheetsList from '../components/SpreadSheetsList';

const Stack = createStackNavigator();

function SpreadSheetsScreen({ onSelect }) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{ title: 'Choose aspire file' }}
        name="spreadsheet-picker"
      >
        {(props) => <SpreadSheetsList {...props} onSelect={onSelect} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

export default SpreadSheetsScreen;
