import React from 'react';
import { View, Text } from 'react-native';

import styles from './styles';

const Comp = ({ text, createdAt }) => {
  return (
    <View style={styles.message}>
      <Text style={styles.time}>{createdAt && mapTime(createdAt)}</Text>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

export default Comp;

function mapTime(createdAt) {
  const t = createdAt.toDate();
  return `${t.getMonth() + 1}/${t.getDate()} ${t.getHours()}:${t.getMinutes()}`;
}
