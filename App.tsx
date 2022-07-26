import './polyfills';

import React, { useCallback } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { MaterialIcons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { useStore, useGate } from 'effector-react';
import { $isAuth, gSignIn, gSignInFx } from './state/auth';
import { $spreadsheetId } from './state/spreadsheet';

import LockScreen from './screens/LockScreen';
import LoginScreen from './screens/LoginScreen';
import SpreadSheetsScreen from './screens/spreadsheet/SpreadSheetsScreen';
import DashboardScreen from './screens/dashboard/DashboardScreen';
import BalancesScreen from './screens/balances/BalancesScreen';
import SettingsScreen from './screens/settings/SettingsScreen';

import './state/app/init';
import { AppGate, $isReady } from './state/app';
import { $isLocked, tryUnlock } from './state/lock';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const Tab = createBottomTabNavigator();

function MainScreen() {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={({ route }) => ({
        headerShown: false,
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

  const onReady = useCallback(async () => {
    if (isReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [isReady]);

  // waiting for loading of resources and initialization of the state
  // no need to render anything, splash screen is shown
  if (!isReady) {
    return null;
  }

  if (isLocked) {
    return <LockScreen onClick={tryUnlock} onLayout={onReady} />;
  }

  return (
    <NavigationContainer onReady={onReady}>
      <ScreenSelector />
    </NavigationContainer>
  );
}

export default App;
