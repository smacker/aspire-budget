import React, { useContext } from 'react';
import { FlatList } from 'react-native';

import { ListItem, Divider } from 'react-native-elements';

import { AuthContext } from '../state/authContext';

function SettingsList() {
  const { logout } = useContext(AuthContext);

  const data = [
    {
      id: 'fingerprint',
      text: 'Use fingerprint to log in',
      disabled: true,
    },
    {
      id: 'autolock',
      text: 'Auto-lock security',
      disabled: true,
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
