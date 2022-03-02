import React from 'react';
import { Text, TextStyle, StyleProp } from 'react-native';
import { useStore } from 'effector-react';
import { $currencyFormatter } from '../state/configuration';

function Currency({
  style,
  value,
}: {
  style: StyleProp<TextStyle>;
  value: number;
}) {
  const formatter = useStore($currencyFormatter);

  return <Text style={style}>{formatter.format(value)}</Text>;
}

export default Currency;
