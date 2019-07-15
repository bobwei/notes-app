import React, { useRef } from 'react';
import { View, FlatList } from 'react-native';
import * as R from 'ramda';

import styles from './styles';
import MessageItem from '../MessageItem';

const Comp = ({ messages }) => {
  const container = useRef(null);
  return (
    <View style={styles.list}>
      <FlatList
        ref={container}
        contentContainerStyle={styles.listContentContainer}
        data={messages}
        renderItem={({ item }) => <MessageItem {...item} />}
        keyExtractor={R.prop('id')}
        onContentSizeChange={() => container.current.scrollToEnd()}
      />
    </View>
  );
};

export default Comp;
