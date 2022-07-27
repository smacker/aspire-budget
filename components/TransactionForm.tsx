import React, { useState } from 'react';
import { StyleSheet, View, Switch, TextInput } from 'react-native';

import { ListItem, Button, Text, BottomSheet } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import SnackBar from 'react-native-snackbar-component';
import { useForm, Controller } from 'react-hook-form';

import { useStore, useGate } from 'effector-react';
import {
  AccountsGate,
  $accounts,
  $txError,
  addTransactionFx,
} from '../state/transactions';
import { $dateFormatter } from '../state/configuration';

import { colors } from './constants';

const accountTransferCategory = '↕️ Account Transfer';
const accountTxCategories = [
  'Available to budget',
  accountTransferCategory,
  '🔢 Balance Adjustment',
  '➡️ Starting Balance',
];

function TransactionForm({ categoryInit = '', accountInit = '', back }) {
  const accounts = useStore($accounts);
  const serverError = useStore($txError);
  const dateFormatter = useStore($dateFormatter);

  useGate(AccountsGate);

  // setup form
  const defaultValues = {
    date: new Date(),
    inflow: categoryInit === '',
    amount: '',
    category: categoryInit,
    account: accountInit,
    account2: '',
    to: '',
    memo: '',
  };
  const {
    control,
    handleSubmit,
    register,
    unregister,
    trigger,
    watch,
    setValue,
    formState,
  } = useForm({
    mode: 'onChange',
    defaultValues,
  });
  const [date, category, account, account2, inflow] = watch([
    'date',
    'category',
    'account',
    'account2',
    'inflow',
  ]);
  React.useEffect(() => {
    register('date', { required: true });
    register('account', { required: true });
    register('category', { required: true });
  }, [register]);
  React.useEffect(() => {
    if (!accountInit || category !== accountTransferCategory) {
      unregister('account2');
      return;
    }

    register('account2', { required: true });
    trigger('account2'); // force re-validation
  }, [register, unregister, trigger, category, accountInit]);

  // read from form state as it is a proxy
  const { dirtyFields, isValid, isSubmitting } = formState;

  // setup popups state
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showAccountsList, setShowAccountsList] = useState(false);
  const [showCategoriesList, setShowCategoriesList] = useState(false);

  const onAdd = async (data) => {
    try {
      await addTransactionFx(data);
      if (data.account2) {
        await addTransactionFx({
          ...data,
          account: data.account2,
          inflow: !data.inflow,
        });
      }
    } catch (e) {
      return;
    }

    await back();
  };

  const accountItemComponent = (
    <ListItem bottomDivider onPress={() => setShowAccountsList(true)}>
      <ListItem.Content style={styles.FormRow}>
        <Text>Account</Text>
        <Text style={styles.DefaultValue(dirtyFields.account)}>
          {account || 'Select'}
        </Text>
      </ListItem.Content>
      <ListItem.Chevron />
    </ListItem>
  );

  const accountListComponent = (
    <BottomSheet isVisible={showAccountsList}>
      {(accounts || []).map((account, i) => (
        <ListItem
          key={i}
          onPress={() => {
            setShowAccountsList(false);
            setValue(
              category !== accountTransferCategory ? 'account' : 'account2',
              account,
              {
                shouldValidate: true,
                shouldDirty: true,
              }
            );
          }}
        >
          <ListItem.Content>
            <ListItem.Title>{account}</ListItem.Title>
          </ListItem.Content>
        </ListItem>
      ))}
    </BottomSheet>
  );

  const categoryItemComponent = (
    <ListItem bottomDivider onPress={() => setShowCategoriesList(true)}>
      <ListItem.Content style={styles.FormRow}>
        <Text>Category</Text>
        <Text style={styles.DefaultValue(dirtyFields.category)}>
          {category || 'Select'}
        </Text>
      </ListItem.Content>
      <ListItem.Chevron />
    </ListItem>
  );

  const categoriesListComponent = (
    <BottomSheet isVisible={showCategoriesList}>
      {(accountTxCategories || []).map((category, i) => (
        <ListItem
          key={i}
          onPress={() => {
            setShowCategoriesList(false);
            setValue('category', category, {
              shouldValidate: true,
              shouldDirty: true,
            });
          }}
        >
          <ListItem.Content>
            <ListItem.Title>{category}</ListItem.Title>
          </ListItem.Content>
        </ListItem>
      ))}
    </BottomSheet>
  );

  const toItemComponent = (
    <ListItem bottomDivider onPress={() => setShowAccountsList(true)}>
      <ListItem.Content style={styles.FormRow}>
        <Text>{inflow ? 'From' : 'To'}</Text>
        <Text style={styles.DefaultValue(dirtyFields.account2)}>
          {account2 || 'Select'}
        </Text>
      </ListItem.Content>
      <ListItem.Chevron />
    </ListItem>
  );

  return (
    <View style={styles.Container}>
      <View>
        <ListItem bottomDivider>
          <ListItem.Content style={styles.FormRow}>
            <Controller
              control={control}
              render={({ field: { onChange, value } }) => (
                <Switch
                  thumbColor={inflow ? colors.available : colors.activity}
                  value={value}
                  onValueChange={(v) => onChange(v)}
                />
              )}
              name="inflow"
            />
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.AmountWrapper}>
                  {value ? (
                    <Text style={styles.Amount(inflow)}>
                      {(inflow ? '+' : '-') + '$'}
                    </Text>
                  ) : null}
                  <TextInput
                    placeholder={!value ? '$0.00' : null}
                    value={value}
                    onBlur={onBlur}
                    onChangeText={(v) => {
                      // sadly it makes the text flicker but RN doesn't have any way to avoid it
                      if (!/^[0-9]*\.?[0-9]*$/.test(v)) {
                        return;
                      }
                      onChange(v);
                    }}
                    keyboardType="numeric"
                    returnKeyType="next"
                    textAlign="right"
                    style={[
                      styles.Amount(inflow),
                      !value ? styles.AmountInputEmpty : null,
                    ]}
                  />
                </View>
              )}
              name="amount"
              rules={{ required: true }}
            />
          </ListItem.Content>
        </ListItem>
        <ListItem bottomDivider onPress={() => setShowDatePicker(true)}>
          <ListItem.Content style={styles.FormRow}>
            <Text>Date</Text>
            <Text style={styles.DefaultValue(dirtyFields.date)}>
              {dateFormatter.format(date)}
            </Text>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
        {categoryInit ? accountItemComponent : categoryItemComponent}
        {accountInit && category === accountTransferCategory
          ? toItemComponent
          : null}
        <ListItem bottomDivider>
          <ListItem.Content style={[styles.FormRow, styles.MemoRow]}>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="Memo"
                  onBlur={onBlur}
                  onChangeText={(value) => onChange(value)}
                  value={value}
                  style={styles.Input}
                />
              )}
              name="memo"
            />
          </ListItem.Content>
        </ListItem>
      </View>
      <View style={styles.ButtonContainer}>
        <Button
          title="Add transaction"
          onPress={handleSubmit(onAdd)}
          disabled={!isValid || isSubmitting}
        />
      </View>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            setValue('date', selectedDate || date, {
              shouldValidate: true,
              shouldDirty: true,
            });
          }}
        />
      )}
      {categoryInit ? accountListComponent : categoriesListComponent}
      {accountInit && category === accountTransferCategory
        ? accountListComponent
        : null}
      <SnackBar
        visible={!!serverError}
        key="notification"
        textMessage="Could not submit transaction. Please try again."
        backgroundColor="#b00020"
      ></SnackBar>
    </View>
  );
}

export default TransactionForm;

const styles = StyleSheet.create<any>({
  Container: {
    flex: 1,
  },
  FormRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  MemoRow: {
    marginTop: -4,
    marginBottom: -4,
  },
  AmountWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  Amount: (inflow) => ({
    fontSize: 30,
    fontWeight: 'bold',
    color: inflow ? colors.available : colors.activity,
    textAlign: 'right',
  }),
  AmountInputEmpty: {
    flex: 1,
  },
  DefaultValue: (isSet) => ({
    color: isSet ? colors.normal : colors.unset,
  }),
  Input: {
    flex: 1,
    margin: 0,
    padding: 0,
  },
  ButtonContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
});
