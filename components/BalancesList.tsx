import React from 'react';
import { View, FlatList } from 'react-native';
import { ListItem } from 'react-native-elements';

import Retry from './Retry';

import { useStore, useGate } from 'effector-react';
import {
  BalancesGate,
  $balancesPending,
  $balancesError,
  $balances,
  loadBalances,
} from '../state/balances';

function BalancesList({ navigation }) {
  const pending = useStore($balancesPending);
  const error = useStore($balancesError);
  const balances = useStore($balances);

  useGate(BalancesGate);

  if (error) {
    return <Retry action={loadBalances} />;
  }

  return (
    <FlatList
      data={balances}
      keyExtractor={(item) => item.id}
      refreshing={pending}
      onRefresh={loadBalances}
      renderItem={({ item }) => {
        return (
          <ListItem
            bottomDivider
            onPress={() => navigation.navigate('Account', item)}
          >
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