import React from 'react';
import { View, Text } from 'react-native';

import styles from './styles';
import Time from '../Time';

const Comp = ({ text, createdAt }) => {
  return (
    <View style={styles.message}>
      <Time time={createdAt} />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

export default Comp;
