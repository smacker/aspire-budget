import React, { useContext } from 'react';
import { View, FlatList, Text } from 'react-native';

import { ListItem } from 'react-native-elements';

import Retry from './Retry';

import useAsync from '../state/useAsync';
import { ApiContext } from '../state/apiContext';

function BalancesList() {
  const { fetchBalances } = useContext(ApiContext);
  const { status, value, execute } = useAsync(fetchBalances);

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
