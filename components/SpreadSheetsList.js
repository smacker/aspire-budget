import React, { useContext } from 'react';
import { FlatList } from 'react-native';

import { ListItem } from 'react-native-elements';

import Loading from './Loading';

import useAsync from '../state/useAsync';
import { ApiContext } from '../state/apiContext';

function SpreadSheetsList({ onSelect }) {
  const { fetchSpreadSheets } = useContext(ApiContext);
  const { status, value, error } = useAsync(fetchSpreadSheets);

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
          <ListItem bottomDivider onPress={() => onSelect(item.id)}>
            <ListItem.Content>
              <ListItem.Title>{item.name}</ListItem.Title>
            </ListItem.Content>
          </ListItem>
        );
      }}
    ></FlatList>
  );
}

export default SpreadSheetsList;
