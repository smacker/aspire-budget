import React, { useState, useContext } from 'react';
import { StyleSheet, View, Switch, TextInput } from 'react-native';

import { ListItem, Button, Text, BottomSheet } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useForm, Controller } from 'react-hook-form';

import { useRequireAsync } from '../state/useAsync';
import { StateContext } from '../state/stateContext';

import { colors } from './constants';
import { formatDate } from '../helpers/date';

function TransactionForm({ category, back }) {
  const {
    transactionAccounts,
    addTransaction,
    categories,
    balances,
  } = useContext(StateContext);
  const {
    status: accountsStatus,
    value: accounts,
    execute: accountsExecute,
  } = transactionAccounts;
  const { status: categoriesStatus, execute: categoriesExecute } = categories;
  const { status: balancesStatus, execute: balancesExecute } = balances;

  useRequireAsync(accountsStatus, accountsExecute);

  // setup form
  const defaultValues = {
    date: new Date(),
    inflow: false,
    amount: '',
    category,
    account: '',
    memo: '',
  };
  const {
    control,
    handleSubmit,
    register,
    watch,
    setValue,
    formState,
  } = useForm({
    mode: 'onChange',
    defaultValues,
  });
  React.useEffect(() => {
    register('date', { required: true });
    register('account', { required: true });
    register('category', { required: true });
  }, [register]);
  const [date, account, inflow] = watch(['date', 'account', 'inflow']);

  // setup popups state
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showAccountsList, setShowAccountsList] = useState(false);

  // form submit state
  const [serverError, setServerError] = useState(null);

  const onAdd = async (data) => {
    try {
      await addTransaction(data);
    } catch (e) {
      console.error(e);
      setServerError('Could not submit transaction. Please try again.');
    }

    // refresh global cached data
    if (categoriesStatus !== 'idle') categoriesExecute();
    if (balancesStatus !== 'idle') balancesExecute();

    await back();
  };

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
            <Text style={styles.DefaultValue(formState.dirtyFields.date)}>
              {formatDate(date)}
            </Text>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
        <ListItem
          bottomDivider
          onPress={() => setShowAccountsList(true)}
          disabled={accountsStatus !== 'success'}
        >
          <ListItem.Content style={styles.FormRow}>
            <Text>Account</Text>
            <Text style={styles.DefaultValue(formState.dirtyFields.account)}>
              {account || 'Select'}
            </Text>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
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
          disabled={!formState.isValid || formState.isSubmitting}
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
      <BottomSheet isVisible={showAccountsList}>
        {(accounts || []).map((account, i) => (
          <ListItem
            key={i}
            onPress={() => {
              setShowAccountsList(false);
              setValue('account', account, {
                shouldValidate: true,
                shouldDirty: true,
              });
            }}
          >
            <ListItem.Content>
              <ListItem.Title>{account}</ListItem.Title>
            </ListItem.Content>
          </ListItem>
        ))}
      </BottomSheet>
    </View>
  );
}

export default TransactionForm;

const styles = StyleSheet.create({
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
