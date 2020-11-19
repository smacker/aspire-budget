import React, { useEffect, useState, useContext } from 'react';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';

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
import { Snackbar } from 'react-native-paper';

const Tab = createBottomTabNavigator();

// This component has awful UX
function SpreadsheetValidator({ setSpreadsheetId }) {
  const { verifySpreadSheet } = useContext(ApiContext);
  const { status, value, error } = useAsync(verifySpreadSheet);
  const [visible, setVisible] = useState(true);

  if (status === 'pending') {
    return <Loading size="large" fill />;
  }

  if (error || !value) {
    console.log('err', error, 'value', value);

    return [
      <SpreadSheetsScreen
        onSelect={(id) => {
          setSpreadsheetId(id);
          setVisible(true);
        }}
        key="screen"
      />,
      <Snackbar
        visible={visible}
        key="notification"
        onDismiss={() => setVisible(false)}
      >
        Incorrect file, please try another one
      </Snackbar>,
    ];
  }

  console.log('value', value);

  return <MainScreen />;
}

function MainScreen() {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
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
  const [authStatus, token, login, logout] = useGoogleAuth();
  const [isIdReady, spreadsheetId, setSpreadsheetId] = useSecureStore(
    'aspire-spreadsheet-id'
  );

  // init the app
  useEffect(() => {
    const init = async () => {
      await Font.loadAsync({
        Roboto: require('native-base/Fonts/Roboto.ttf'),
        Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
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

  // Login screen
  if (authStatus !== 'authorized') {
    return <LoginScreen authStatus={authStatus} login={login} />;
  }

  // Screen to choose a spreadsheet
  if (!spreadsheetId) {
    return <SpreadSheetsScreen onSelect={setSpreadsheetId} />;
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
        <PaperProvider>
          <NavigationContainer>
            <SpreadsheetValidator setSpreadsheetId={setSpreadsheetId} />
          </NavigationContainer>
        </PaperProvider>
      </ApiProvider>
    </AuthProvider>
  );
}

export default App;
