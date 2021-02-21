import React, { useContext } from 'react';
import { View, FlatList } from 'react-native';

import { ListItem } from 'react-native-elements';

import Retry from './Retry';

import { useRequireAsync } from '../state/useAsync';
import { StateContext } from '../state/stateContext';

function BalancesList() {
  const { balances } = useContext(StateContext);
  const { status, value, execute } = balances;

  useRequireAsync(status, execute);

  if (status === 'error') {
    return <Retry action={execute} />;
  }

  return (
    <FlatList
      data={value}
      keyExtractor={(item) => item.id}
      refreshing={status === 'pending'}
      onRefresh={execute}
      renderItem={({ item }) => {
        return (
          <ListItem bottomDivider>
            <ListItem.Content>
              <View
                style={{
                  width: '100%',
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingBottom: 7,
                }}
              >
                <ListItem.Title>{item.name}</ListItem.Title>
                <ListItem.Title style={{ fontWeight: 'bold' }}>
                  {item.amount}
                </ListItem.Title>
              </View>
              <ListItem.Subtitle>{item.lastUpdateOn}</ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>
        );
      }}
    ></FlatList>
  );
}

export default BalancesList;
