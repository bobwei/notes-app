const fn = ({ stream, onTranscripted }) => {
  const audioContext = new AudioContext({ sampleRate: 16000 });

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

  const MAX_INT = Math.pow(2, 16 - 1) - 1;

  const onAudioProcess = (e) => {
    if (ws.readyState === ws.OPEN) {
      const floatSamples = e.inputBuffer.getChannelData(0);
      const intSamples = Int16Array.from(floatSamples.map((n) => n * MAX_INT));
      ws.send(intSamples);
    }
  };

  ws.onmessage = (event) => {
    onTranscripted(JSON.parse(event.data));
  };

  scriptProcessor.addEventListener('audioprocess', onAudioProcess);
  return () => {
    scriptProcessor.removeEventListener('audioprocess', onAudioProcess);
    ws.close();
  };
};

export default fn;
