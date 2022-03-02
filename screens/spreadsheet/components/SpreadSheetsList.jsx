import React from 'react';
import { FlatList } from 'react-native';

import { ListItem } from 'react-native-elements';
import SnackBar from 'react-native-snackbar-component';

import Loading from '../../../components/Loading';
import Retry from '../../../components/Retry';

import { useStore, useGate } from 'effector-react';
import {
  SpreadsheetsGate,
  $spreadsheets,
  $spreadsheetsError,
  $spreadsheetError,
  loadSpreadsheetListFx,
  selectSpreadsheetIdFx,
  loadSpreadsheetList,
  selectSpreadsheetId,
} from '../../../state/spreadsheet';

// show a loader inside the component while validating to avoid ugly UI re-draws
function SpreadSheetsList() {
  const loading = useStore(loadSpreadsheetListFx.pending);
  const spreadsheetsError = useStore($spreadsheetsError);
  const validating = useStore(selectSpreadsheetIdFx.pending);
  const spreadsheets = useStore($spreadsheets);
  const error = useStore($spreadsheetError);

  useGate(SpreadsheetsGate);

  if (loading || validating) {
    return <Loading size="large" fill />;
  }

  if (spreadsheetsError) {
    return <Retry action={loadSpreadsheetList} />;
  }

  return (
    <>
      <FlatList
        data={spreadsheets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          return (
            <ListItem
              bottomDivider
              onPress={() => selectSpreadsheetId(item.id)}
            >
              <ListItem.Content>
                <ListItem.Title>{item.name}</ListItem.Title>
              </ListItem.Content>
            </ListItem>
          );
        }}
      ></FlatList>
      <SnackBar
        visible={!!error}
        key="notification"
        textMessage="Incorrect file, please try another one"
        //actionHandler={() => setVisible(false)}
        backgroundColor="#b00020"
      ></SnackBar>
    </>
  );
}

export default SpreadSheetsList;
