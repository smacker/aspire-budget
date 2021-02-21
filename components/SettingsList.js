import React, { useContext } from 'react';
import { FlatList } from 'react-native';

import { ListItem, Divider } from 'react-native-elements';

import {
  useBiometricIsAvailable,
  useBiometricIsEnabled,
  biometricSetEnable,
} from '../state/useBiometric';
import { StateContext } from '../state/stateContext';

function SettingsList() {
  const [bioAvailableReady, bioAvailable] = useBiometricIsAvailable();
  const [bioEnabledReady, bioEnabled] = useBiometricIsEnabled();
  const { logout } = useContext(StateContext);

  const data = [
    // FIXME: make human UI here
    {
      id: 'fingerprint',
      text: 'Use fingerprint',
      disabled: !bioAvailableReady || !bioEnabledReady || !bioAvailable,
      onPress: () => biometricSetEnable(!bioEnabled),
    },
    {
      // https://www.reddit.com/r/aspirebudgeting/
      id: 'reddit',
      text: 'Ask for help on reddit',
      disabled: true,
    },
    {
      id: 'divider',
      divider: true,
    },
    {
      id: 'logout',
      text: 'Logout',
      onPress: logout,
      separate: true,
    },
  ];

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => {
        if (item.divider) {
          return (
            <Divider height={20} style={{ backgroundColor: 'transparent' }} />
          );
        }

        return (
          <ListItem
            topDivider={item.separate}
            bottomDivider
            disabled={item.disabled}
            onPress={item.onPress}
          >
            <ListItem.Content>
              <ListItem.Title>{item.text}</ListItem.Title>
            </ListItem.Content>
            {item.chevron ? <ListItem.Chevron /> : null}
          </ListItem>
        );
      }}
    ></FlatList>
  );
}

export default SettingsList;
