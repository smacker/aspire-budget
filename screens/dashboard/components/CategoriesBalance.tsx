import React from 'react';
import { StyleSheet, View, FlatList, Text } from 'react-native';
import { ListItem } from 'react-native-elements';
import { StackScreenProps } from '@react-navigation/stack';

import Retry from '../../../components/Retry';
import Currency from '../../../components/Currency';
import { StackParamList } from '../DashboardScreen';

import { useStore, useGate } from 'effector-react';
import {
  CategoriesGate,
  $categoriesPending,
  $categoriesError,
  $categories,
  loadCategories,
} from '../../../state/dashboard';

import { colors } from '../../../components/constants';
import { unsetColor, coloredValue } from '../../../components/utils';
import { Category } from '../../../types';

const styles = StyleSheet.create<any>({
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
  BudgetedValue: (v: number) => ({
    color: unsetColor(v, colors.budgeted),
  }),
  AvailableValue: (v: number, total: number) => ({
    color: coloredValue(v, total, colors.available),
  }),
  ActivityValue: (v: number) => ({
    color: unsetColor(v, colors.activity),
  }),
});

function Value({ children }) {
  return <View style={styles.Value}>{children}</View>;
}

function Row({ item, onPress }: { item: Category; onPress: () => void }) {
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

type Props = StackScreenProps<StackParamList, 'Categories'>;

function CategoriesBalance({ navigation }: Props) {
  const pending = useStore($categoriesPending);
  const error = useStore($categoriesError);
  const categories = useStore($categories);

  useGate(CategoriesGate);

  if (error) {
    return <Retry action={loadCategories} />;
  }

  return (
    <FlatList
      data={categories}
      keyExtractor={(item) => item.id}
      refreshing={pending}
      onRefresh={loadCategories}
      renderItem={({ item }) => {
        return (
          <Row
            item={item}
            onPress={
              item.isGroup || item.isCreditCard
                ? null
                : () => navigation.navigate('Category', item)
            }
          />
        );
      }}
    ></FlatList>
  );
}

export default CategoriesBalance;
