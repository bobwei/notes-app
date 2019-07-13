import React, { useState, useEffect } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import AudioRecord from 'react-native-audio-record';
import { Buffer } from 'buffer';

const App = () => {
  const [isRecording, setIsRecording] = useState(false);
  useEffect(() => {
    if (isRecording) {
      return startRecording();
    }
  }, [isRecording]);
  return (
    <View style={styles.container}>
      <Button
        onPress={createOnPress({ setIsRecording })}
        style={styles.button}
        title={!isRecording ? 'Start' : 'Stop'}
      />
    </View>
  );
};

function startRecording() {
  const options = {
    sampleRate: 16000,
  };
  const ws = new WebSocket('ws://192.168.31.191:3000/api/speech');
  AudioRecord.init(options);
  AudioRecord.start();
  AudioRecord.on('data', (data) => {
    const arr8 = Buffer.from(data, 'base64');
    const samples = new Int16Array(arr8.buffer);
    ws.send(samples);
  });
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  button: {
    marginTop: 10,
    width: 200,
    alignSelf: 'center',
  },
});

export default App;
