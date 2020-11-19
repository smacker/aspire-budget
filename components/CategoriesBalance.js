import React, { useContext } from 'react';
import { StyleSheet, View, FlatList, Text } from 'react-native';

import { ListItem } from 'react-native-elements';

import Loading from './Loading';

import useAsync from '../state/useAsync';
import { ApiContext } from '../state/apiContext';

import { colors } from './constants';
import { priceColor } from './utils';

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
    color: priceColor(v, colors.budgeted),
  }),
  AvailableValue: (v) => ({
    color: priceColor(v, colors.available),
  }),
});

function Value({ children }) {
  return <View style={styles.Value}>{children}</View>;
}

function Row({ item, onPress }) {
  return (
    <ListItem
      bottomDivider
      containerStyle={[styles.Row, item.group ? styles.RowGroup : null]}
      onPress={onPress}
    >
      <View style={styles.Name}>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={item.group ? styles.GroupText : null}
        >
          {item.name}
        </Text>
      </View>
      <View style={styles.Values}>
        <Value>
          {item.group ? <Text>budgeted</Text> : null}
          <Text
            style={[
              styles.BudgetedValue(item.budgeted),
              item.group ? styles.GroupText : null,
            ]}
          >
            {item.budgeted}
          </Text>
        </Value>
        <Value>
          {item.group ? <Text>available</Text> : null}
          <Text
            style={[
              styles.AvailableValue(item.available),
              item.group ? styles.GroupText : null,
            ]}
          >
            {item.available}
          </Text>
        </Value>
      </View>
    </ListItem>
  );
}

function CategoriesBalance({ navigation }) {
  const { fetchCategoriesBalance } = useContext(ApiContext);
  const { status, value, error } = useAsync(fetchCategoriesBalance);

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
