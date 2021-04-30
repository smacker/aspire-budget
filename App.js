import React, { useEffect, useState, useContext } from 'react';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import useBiometric from './state/useBiometric';
import { StateProvider, StateContext } from './state/stateContext';

import LoginScreen from './screens/LoginScreen';
import SpreadSheetsScreen from './screens/SpreadSheetsScreen';
import DashboardScreen from './screens/DashboardScreen';
import BalancesScreen from './screens/BalancesScreen';
import SettingsScreen from './screens/SettingsScreen';
import SnackBar from 'react-native-snackbar-component';

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

function SpreadSheetsSelector({ spreadsheet }) {
  const [visible, setVisible] = useState(!!spreadsheet.error);

  useEffect(() => {
    setVisible(!!spreadsheet.error);
  }, [spreadsheet.error]);

  return [
    <SpreadSheetsScreen
      onSelect={spreadsheet.setValue}
      validating={spreadsheet.status === 'pending'}
      key="screen"
    />,
    <SnackBar
      visible={visible}
      key="notification"
      textMessage="Incorrect file, please try another one"
      actionHandler={() => setVisible(false)}
      backgroundColor="#b00020"
    ></SnackBar>,
  ];
}

function ScreenSelector() {
  const { authStatus, login, spreadsheet } = useContext(StateContext);
  // for initial loading we need to show full screen loader instead of a loader inside sheet selector
  const [isFirstLoad, setFirstLoad] = useState(true);

  if (
    !authStatus ||
    !spreadsheet.status ||
    (isFirstLoad && spreadsheet.status === 'pending')
  ) {
    return <AppLoading />;
  }
  // if we got here it is not the first load anymore
  if (isFirstLoad) setFirstLoad(false);

  if (authStatus !== 'authorized') {
    return <LoginScreen authStatus={authStatus} login={login} />;
  }

  if (spreadsheet.status !== 'success') {
    return <SpreadSheetsSelector spreadsheet={spreadsheet} />;
  }

  return <MainScreen />;
}

function App() {
  const [isReady, setReady] = useState(false);
  const [isBiometricSuccess] = useBiometric();

  // init the app
  useEffect(() => {
    const init = async () => {
      await Font.loadAsync({
        Roboto: require('native-base/Fonts/Roboto.ttf'), // eslint-disable-line
        Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'), // eslint-disable-line
        ...Ionicons.font,
        ...MaterialIcons.font,
      });

      setReady(true);
    };

    init();
  }, []);

  // waiting for initial load and biometric login if enabled
  if (!isReady || !isBiometricSuccess) {
    return <AppLoading />;
  }

  return (
    <StateProvider>
      <NavigationContainer>
        <ScreenSelector />
      </NavigationContainer>
    </StateProvider>
  );
}

export default App;
