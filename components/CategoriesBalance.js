import React, { useContext } from 'react';
import { StyleSheet, View, FlatList, Text } from 'react-native';

import { ListItem } from 'react-native-elements';

import Retry from './Retry';
import Currency from './Currency';

import useAsync from '../state/useAsync';
import { ApiContext } from '../state/apiContext';

import { colors } from './constants';
import { unsetColor, warningColor } from './utils';

const styles = StyleSheet.create({
  Row: {
    paddingTop: 13,
    paddingBottom: 13,
    flexDirection: 'row',
  },
  RowGroup: {
    paddingTop: 6,
    paddingBottom: 6,
    backgroundColor: colors.bgHeader,
  },
  Name: {
    flex: 1,
  },
  Values: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  Value: {
    alignItems: 'flex-end',
    width: 85,
  },
  GroupText: {
    fontWeight: 'bold',
  },
  BudgetedValue: (v) => ({
    color: unsetColor(v, colors.budgeted),
  }),
  AvailableValue: (v, total) => ({
    color: unsetColor(v, warningColor(v, total, colors.available)),
  }),
  ActivityValue: (v) => ({
    color: unsetColor(v, colors.activity),
  }),
});

function Value({ children }) {
  return <View style={styles.Value}>{children}</View>;
}

function Row({ item, onPress }) {
  return (
    <ListItem
      bottomDivider
      containerStyle={[styles.Row, item.isGroup ? styles.RowGroup : null]}
      onPress={onPress}
    >
      <View style={styles.Name}>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={item.isGroup ? styles.GroupText : null}
        >
          {item.name}
        </Text>
      </View>
      <View style={styles.Values}>
        {!item.isCreditCard ? (
          <Value>
            {item.isGroup ? <Text>budgeted</Text> : null}
            <Currency
              style={[
                styles.BudgetedValue(item.budgetedTotal),
                item.isGroup ? styles.GroupText : null,
              ]}
              value={item.budgetedTotal}
            />
          </Value>
        ) : null}
        {!item.isCreditCard ? (
          <Value>
            {item.isGroup ? <Text>available</Text> : null}
            <Currency
              style={[
                styles.AvailableValue(item.available, item.budgetedTotal),
                item.isGroup ? styles.GroupText : null,
              ]}
              value={item.available}
            />
          </Value>
        ) : (
          <Value>
            {item.isGroup ? <Text>activity</Text> : null}
            <Currency
              style={[
                styles.ActivityValue(item.activity),
                item.isGroup ? styles.GroupText : null,
              ]}
              value={item.activity}
            />
          </Value>
        )}
      </View>
    </ListItem>
  );
}

function CategoriesBalance({ navigation }) {
  const { fetchCategoriesBalance } = useContext(ApiContext);
  const { status, value, execute } = useAsync(fetchCategoriesBalance);

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
          <Row
            item={item}
            onPress={
              item.group ? null : () => navigation.navigate('Category', item)
            }
          />
        );
      }}
    ></FlatList>
  );
}

export default CategoriesBalance;
