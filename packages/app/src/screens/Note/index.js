import React, { useState, useEffect } from 'react';
import { View, Button, TextInput } from 'react-native';
import AudioRecord from 'react-native-audio-record';
import { Buffer } from 'buffer';
import firebase from 'react-native-firebase';
import * as R from 'ramda';
import shortid from 'shortid';

import { SPEECH_API_BASE_URL } from '../../../env';
import styles from './styles';

const Comp = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [noteId, setNoteId] = useState('');
  useEffect(() => {
    if (isRecording) {
      return startRecording({ noteId });
    }
  }, [isRecording]);
  return (
    <View style={styles.container}>
      {/* prettier-ignore */}
      <TextInput
        style={styles.textInput}
        placeholder="Please enter noteId."
        onChangeText={setNoteId}
        value={noteId}
      />
      <Button
        onPress={createOnPress({ setIsRecording })}
        style={styles.button}
        title={!isRecording ? 'Start' : 'Stop'}
      />
    </View>
  );
};

Comp.navigationOptions = {
  title: 'Note',
};

function startRecording({ noteId }) {
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
  let messageId = null;
  ws.onmessage = R.pipe(
    R.prop('data'),
    (data) => JSON.parse(data),
    R.applySpec({
      transcript: R.path(['results', 0, 'alternatives', 0, 'transcript']),
      isFinal: R.path(['results', 0, 'isFinal']),
    }),
    ({ transcript, isFinal }) => {
      if (!messageId) {
        messageId = shortid.generate();
      }
      if (isFinal) {
        messageId = null;
      }
      db.collection('notes')
        .doc(noteId)
        .collection('messages')
        .doc(messageId)
        .set(
          {
            text: transcript,
            createdAt: new Date(),
          },
          { merge: true },
        );
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
