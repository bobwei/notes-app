import React from 'react';
import { Text } from 'react-native';

import mapTime from '@project/core/src/utils/mapTime';
import styles from './styles';

const Comp = ({ time }) => {
  return <Text style={styles.time}>{time && mapTime(time)}</Text>;
};

export default Comp;
