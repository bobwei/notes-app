const fn = ({ stream }) => {
  const audioContext = new AudioContext();

  const inputPoint = audioContext.createGain();
  const microphone = audioContext.createMediaStreamSource(stream);
  const analyser = audioContext.createAnalyser();
  const scriptProcessor = inputPoint.context.createScriptProcessor(2048, 2, 2);

  microphone.connect(inputPoint);
  inputPoint.connect(analyser);
  inputPoint.connect(scriptProcessor);
  scriptProcessor.connect(inputPoint.context.destination);

  const url = `ws://${window.location.host}/api/speech`;
  const ws = new WebSocket(url);

  const onAudioProcess = (e) => {
    if (ws.readyState === ws.OPEN) {
      const floatSamples = e.inputBuffer.getChannelData(0);
      const data = new Int16Array(floatSamples.buffer);
      ws.send(data);
    }
  };

  scriptProcessor.addEventListener('audioprocess', onAudioProcess);
  return () => {
    scriptProcessor.removeEventListener('audioprocess', onAudioProcess);
    ws.close();
  };
};

export default fn;
