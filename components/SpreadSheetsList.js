import React, { useContext } from 'react';
import { FlatList } from 'react-native';

import { ListItem } from 'react-native-elements';

import Loading from './Loading';
import Retry from './Retry';

import useAsync from '../state/useAsync';
import { StateContext } from '../state/stateContext';

// show a loader inside the component while validating to avoid ugly UI re-draws
function SpreadSheetsList({ onSelect, validating }) {
  const { fetchSpreadSheets } = useContext(StateContext);
  const { status, value, execute } = useAsync(fetchSpreadSheets);

  if (status === 'pending' || validating) {
    return <Loading size="large" fill />;
  }

  if (status === 'error') {
    return <Retry action={execute} />;
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
