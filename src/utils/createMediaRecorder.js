const createMediaRecorder = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: false,
  });
  const codec = 'audio/webm';
  const recorder = new MediaRecorder(stream, {
    audioBitsPerSecond: 128000,
    mimeType: codec,
  });
  return recorder;
};

export default createMediaRecorder;
