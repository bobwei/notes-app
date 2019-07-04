import speech from '@google-cloud/speech';

const fn = () => {
  return (ws) => {
    const client = new speech.v1p1beta1.SpeechClient();
    const config = {
      encoding: 'LINEAR16',
      sampleRateHertz: 16000,
      languageCode: 'zh-TW',
    };
    const recognizeStream = client.streamingRecognize({ config, interimResults: false });
    recognizeStream
      .on('error', (error) => {
        console.error(error);
      })
      .on('data', (data) => {
        ws.send(JSON.stringify(data));
      });

    ws.on('message', (data) => {
      recognizeStream.write(data);
    });

    ws.on('close', () => {
      recognizeStream.end();
    });
  };
};

export default fn;
