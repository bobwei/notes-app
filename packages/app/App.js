import React, { useState } from 'react';
import { View, Button, StyleSheet } from 'react-native';

const App = () => {
  const [isRecording, setIsRecording] = useState(false);
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
