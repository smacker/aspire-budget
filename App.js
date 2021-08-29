import React from 'react';
import AppLoading from 'expo-app-loading';
import { MaterialIcons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { useStore, useGate } from 'effector-react';
import { $isAuth, gSignIn, gSignInFx } from './state/auth';
import { $spreadsheetId } from './state/spreadsheet';

import LockScreen from './screens/LockScreen';
import LoginScreen from './screens/LoginScreen';
import SpreadSheetsScreen from './screens/SpreadSheetsScreen';
import DashboardScreen from './screens/DashboardScreen';
import BalancesScreen from './screens/BalancesScreen';
import SettingsScreen from './screens/SettingsScreen';

import './state/app/init';
import { AppGate, $isReady } from './state/app';
import { $isLocked, tryUnlock } from './state/lock';

const Tab = createBottomTabNavigator();

function MainScreen() {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={({ route }) => ({
        tabBarIcon: function TabIcon({ color, size }) {
          let iconName;

          switch (route.name) {
            case 'Dashboard':
              iconName = 'home';
              break;

            case 'Balances':
              iconName = 'account-balance';
              break;

            case 'Settings':
              iconName = 'settings';
              break;
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Balances" component={BalancesScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

function ScreenSelector() {
  const isAuth = useStore($isAuth);
  const spreadsheetId = useStore($spreadsheetId);
  const loginPending = useStore(gSignInFx.pending);

  if (!isAuth) {
    return <LoginScreen pending={loginPending} login={gSignIn} />;
  }

  if (!spreadsheetId) {
    return <SpreadSheetsScreen />;
  }

  return <MainScreen />;
}

function App() {
  const isReady = useStore($isReady);
  const isLocked = useStore($isLocked);

  // init the app
  useGate(AppGate);

  // waiting for loading of resources and initialization of the state
  if (!isReady) {
    return <AppLoading />;
  }

  if (isLocked) {
    return <LockScreen onClick={tryUnlock} />;
  }

  return (
    <NavigationContainer>
      <ScreenSelector />
    </NavigationContainer>
  );
}

export default App;
