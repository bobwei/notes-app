import React, { useState, useEffect } from 'react';
import { View, Button, FlatList } from 'react-native';
import AudioRecord from 'react-native-audio-record';
import { Buffer } from 'buffer';
import firebase from 'react-native-firebase';
import * as R from 'ramda';

/* eslint-disable import/no-extraneous-dependencies */
import useMessages from '@project/core/src/hooks/useMessages';
import { SPEECH_API_BASE_URL } from '../../../env';
import styles from './styles';
import MessageItem from '../../components/MessageItem';

const Comp = ({ navigation }) => {
  const [isRecording, setIsRecording] = useState(false);
  const noteId = navigation.getParam('noteId');
  const [messages] = useMessages({ firebase, noteId });
  const [inProgressText, setInProgressText] = useState('');
  useEffect(() => {
    if (isRecording) {
      return startRecording({ noteId, setInProgressText });
    }
  }, [isRecording]);
  return (
    <View style={styles.container}>
      <View style={styles.list}>
        <FlatList
          contentContainerStyle={styles.listContentContainer}
          data={!inProgressText ? messages : [...messages, { id: '0', text: inProgressText }]}
          renderItem={({ item }) => <MessageItem {...item} />}
          keyExtractor={R.prop('id')}
        />
      </View>
      <View style={styles.toolbar}>
        <View style={styles.button}>
          <Button onPress={createOnPress({ setIsRecording })} title={!isRecording ? 'Start' : 'Stop'} />
        </View>
      </View>
    </View>
  );
};

Comp.navigationOptions = ({ navigation }) => {
  return {
    title: navigation.getParam('noteId'),
  };
};

function startRecording({ noteId, setInProgressText }) {
  const options = {
    sampleRate: 16000,
  };
  const ws = new WebSocket(SPEECH_API_BASE_URL + '/api/speech');
  AudioRecord.init(options);
  AudioRecord.start();
  AudioRecord.on('data', (data) => {
    const arr8 = Buffer.from(data, 'base64');
    const samples = new Int16Array(arr8.buffer);
    if (ws.readyState === ws.OPEN) {
      ws.send(samples);
    }
  });
  const db = firebase.firestore();
  ws.onmessage = R.pipe(
    R.prop('data'),
    (data) => JSON.parse(data),
    R.applySpec({
      transcript: R.path(['results', 0, 'alternatives', 0, 'transcript']),
      isFinal: R.path(['results', 0, 'isFinal']),
    }),
    ({ transcript, isFinal }) => {
      if (!isFinal) {
        setInProgressText(transcript);
        return;
      }
      setInProgressText('');
      db.collection('notes')
        .doc(noteId)
        .collection('messages')
        .add({
          text: transcript,
          createdAt: new Date(),
        });
    },
  );
  return () => {
    AudioRecord.stop();
    ws.close();
  };
}

function createOnPress({ setIsRecording }) {
  return () => {
    setIsRecording((val) => !val);
  };
}

export default Comp;
