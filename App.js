import React, { useEffect, useState, useContext } from 'react';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import useBiometric from './state/useBiometric';
import useGoogleAuth from './state/useGoogleAuth';
import useSecureStore from './state/useSecureStore';
import useAsync from './state/useAsync';
import { AuthProvider } from './state/authContext';
import { ApiProvider, ApiContext } from './state/apiContext';

import LoginScreen from './screens/LoginScreen';
import SpreadSheetsScreen from './screens/SpreadSheetsScreen';
import DashboardScreen from './screens/DashboardScreen';
import BalancesScreen from './screens/BalancesScreen';
import SettingsScreen from './screens/SettingsScreen';
import Loading from './components/Loading';
import SnackBar from 'react-native-snackbar-component';

const Tab = createBottomTabNavigator();

// This component cases bad UX when incorrect item chosen
// - it shows empty loading (without header)
// - header is rendered but new loader appears inside list of items
function SpreadsheetValidator({ setSpreadsheetId }) {
  const { verifySpreadSheet } = useContext(ApiContext);
  const { status, value, error } = useAsync(verifySpreadSheet);
  const [visible, setVisible] = useState(true);

  if (status === 'pending') {
    return <Loading size="large" fill />;
  }

  if (error || !value) {
    return [
      <SpreadSheetsScreen
        onSelect={(id) => {
          setSpreadsheetId(id);
          setVisible(true);
        }}
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

  return <MainScreen />;
}

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

function App() {
  const [isReady, setReady] = useState(false);
  const [isBiometricSuccess] = useBiometric();
  const [authStatus, token, login, logout] = useGoogleAuth();
  const [isIdReady, spreadsheetId, setSpreadsheetId] = useSecureStore(
    'aspire-spreadsheet-id'
  );

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

  // waiting for initial load
  if (!isReady || !authStatus || !isIdReady) {
    return <AppLoading />;
  }

  if (!isBiometricSuccess) {
    return <AppLoading />;
  }

  // Login screen
  if (authStatus !== 'authorized') {
    return <LoginScreen authStatus={authStatus} login={login} />;
  }

  return (
    <AuthProvider
      login={login}
      logout={() => {
        logout();
        setSpreadsheetId(null);
      }}
    >
      <ApiProvider
        token={token}
        spreadsheetId={spreadsheetId}
        onUnauthorizedError={logout}
      >
        <NavigationContainer>
          {spreadsheetId ? (
            <SpreadsheetValidator setSpreadsheetId={setSpreadsheetId} />
          ) : (
            <SpreadSheetsScreen onSelect={setSpreadsheetId} />
          )}
        </NavigationContainer>
      </ApiProvider>
    </AuthProvider>
  );
}

export default App;
