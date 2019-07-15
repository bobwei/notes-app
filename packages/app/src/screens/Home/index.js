import React from 'react';
import { View, Button } from 'react-native';
import shortid from 'shortid';

import styles from './styles';

const Comp = ({ navigation: { navigate } }) => {
  return (
    <View style={styles.container}>
      <Button title="Create Note" onPress={() => navigate('Note', { noteId: shortid.generate() })} />
    </View>
  );
};

Comp.navigationOptions = {
  title: 'Notes',
};

export default Comp;
