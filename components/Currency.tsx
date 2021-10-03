import React from 'react';
import { Text, TextProps } from 'react-native';
import { useStore } from 'effector-react';
import { $currencyFormatter } from '../state/configuration';

function Currency({ style, value }: { style: TextProps; value: number }) {
  const formatter = useStore($currencyFormatter);

  return <Text style={style}>{formatter.format(value)}</Text>;
}

export default Currency;
