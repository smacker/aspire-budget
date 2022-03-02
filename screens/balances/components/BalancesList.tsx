import React from 'react';
import { View, FlatList } from 'react-native';
import { ListItem } from 'react-native-elements';
import { StackScreenProps } from '@react-navigation/stack';

import Retry from '../../../components/Retry';
import Currency from '../../../components/Currency';
import { StackParamList } from '../BalancesScreen';

import { useStore, useGate } from 'effector-react';
import {
  BalancesGate,
  $balancesPending,
  $balancesError,
  $balances,
  loadBalances,
} from '../../../state/balances';

import { colors } from '../../../components/constants';
import { unsetColor } from '../../../components/utils';

type Props = StackScreenProps<StackParamList, 'BalancesList'>;

function BalancesList({ navigation }: Props) {
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
                  <Currency
                    style={{
                      color: unsetColor(
                        item.amount,
                        item.amount > 0 ? colors.available : colors.activity
                      ),
                    }}
                    value={item.amount}
                  />
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
