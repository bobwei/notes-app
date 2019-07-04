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

  const onAudioProcess = (e) => {
    const floatSamples = e.inputBuffer.getChannelData(0);
    const data = Int16Array.from(floatSamples);
  };

  scriptProcessor.addEventListener('audioprocess', onAudioProcess);
  return () => {
    scriptProcessor.removeEventListener('audioprocess', onAudioProcess);
  };
};

export default fn;
