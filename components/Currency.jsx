import React from 'react';
import { Text } from 'react-native';

// FIXME get it from API and put it in context
// formatting will be different depends on the value
const currency = '$';

function Currency({ style, value }) {
  const sign = value < 0 ? '-' : '';

  return (
    <Text style={style}>
      {sign}
      {currency}
      {Math.abs(value).toFixed(2)}
    </Text>
  );
}

export default Currency;
