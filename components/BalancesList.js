import React, { useContext } from 'react';
import { View, FlatList, Text } from 'react-native';

import { ListItem } from 'react-native-elements';

import Loading from './Loading';

import useAsync from '../state/useAsync';
import { ApiContext } from '../state/apiContext';

function BalancesList() {
  const { fetchBalances } = useContext(ApiContext);
  const { status, value, error } = useAsync(fetchBalances);

  if (status === 'pending') {
    return <Loading />;
  }

  if (status === 'error') {
    return <Text>{error}</Text>;
  }

  return (
    <FlatList
      data={value}
      keyExtractor={(item) => item.id}
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
