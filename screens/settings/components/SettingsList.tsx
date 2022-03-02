import React from 'react';
import { FlatList, Switch } from 'react-native';
import * as Linking from 'expo-linking';
import { ListItem, Divider } from 'react-native-elements';

import { useStore } from 'effector-react';
import { $isAvailable, $isEnabled, setEnabled } from '../../../state/lock';

import { logout } from '../../../state/auth';
import { $currencyCode, $locale } from '../../../state/configuration';

function SettingsList() {
  const isAvailable = useStore($isAvailable);
  const isEnabled = useStore($isEnabled);
  const locale = useStore($locale);
  const currencyCode = useStore($currencyCode);

  const data: {
    id: string;
    text?: string;
    value?: string;
    chevron?: boolean;
    disabled?: boolean;
    divider?: boolean;
    separate?: boolean;
    switch?: { value: boolean; onChange: () => void };
    onPress?: () => void;
  }[] = [
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
      id: 'locale',
      text: 'Locale',
      value: locale,
      chevron: true,
    },
    {
      id: 'currency',
      text: 'Currency code',
      value: currencyCode,
      chevron: true,
    },
    {
      id: 'reddit',
      text: 'Ask for help on reddit',
      onPress: () => {
        Linking.openURL('https://www.reddit.com/r/aspirebudgeting/');
      },
    },
    {
      id: 'logout',
      text: 'Logout',
      onPress: logout,
    },
  ];

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => {
        if (item.divider) {
          return <Divider style={{ backgroundColor: 'transparent' }} />;
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
              {item.value ? (
                <ListItem.Title>{item.value}</ListItem.Title>
              ) : null}
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
