import React from 'react';
import { FlatList, Switch } from 'react-native';
import * as Linking from 'expo-linking';
import { ListItem, Divider } from 'react-native-elements';

import { useStore } from 'effector-react';
import {
  $isAvailable,
  $isEnabled,
  setEnabled
} from '../state/lock';

import { logout } from '../state/auth';

function SettingsList() {
  const isAvailable = useStore($isAvailable);
  const isEnabled = useStore($isEnabled);

  const data = [
    {
      id: 'fingerprint',
      text: 'Use fingerprint',
      disabled: !isAvailable,
      switch: {
        value: isEnabled,
        onChange: () => setEnabled(!isEnabled),
      },
    },
    {
      id: 'reddit',
      text: 'Ask for help on reddit',
      onPress: () => {
        Linking.openURL('https://www.reddit.com/r/aspirebudgeting/');
      },
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
            {item.switch ? (
              <Switch
                value={item.switch.value}
                onValueChange={item.switch.onChange}
              />
            ) : null}
          </ListItem>
        );
      }}
    ></FlatList>
  );
}

export default SettingsList;
