import React from 'react';
import { View, Button, FlatList, Text, TouchableOpacity } from 'react-native';
import shortid from 'shortid';
import firebase from 'react-native-firebase';
import * as R from 'ramda';

/* eslint-disable import/no-extraneous-dependencies */
import useNotes from '@project/core/src/hooks/useNotes';
import Time from '../../components/Time';
import styles from './styles';

const Comp = ({ navigation: { navigate } }) => {
  const [notes] = useNotes({ firebase });
  return (
    <View style={styles.container}>
      <View style={styles.button}>
        <Button title="Create Note" onPress={() => navigate('Note', { noteId: shortid.generate() })} />
      </View>
      <View style={styles.list}>
        <FlatList
          data={notes}
          keyExtractor={R.prop('id')}
          contentContainerStyle={styles.listContentContainer}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity onPress={() => navigate('Note', { noteId: item.id })}>
                <View style={styles.note}>
                  <Time time={item.createdAt} />
                  <Text>{item.id}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </View>
  );
};

Comp.navigationOptions = {
  title: 'Notes',
};

export default Comp;
