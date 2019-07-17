import React from 'react';
import { View } from 'react-native';

import styles from './styles';

const Comp = ({ value }) => {
  const width = (value / 2 ** 12) * 100 + '%';
  console.log(value, width);
  return (
    <View style={styles.bar}>
      <View style={[styles.value, { width }]} />
    </View>
  );
};

export default Comp;
