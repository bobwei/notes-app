import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'reactstrap';
import { Button } from 'reactstrap';
import { Form, FormGroup, Input } from 'reactstrap';
import * as R from 'ramda';
import * as firebase from 'firebase/app';
import 'firebase/firestore';

import createStreamToServer from '../src/utils/createStreamToServer';

const Comp = ({ noteId }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [text, setText] = useState(null);
  const [inProgressText, setInProgressText] = useState('');
  useEffect(() => {
    if (noteId) {
      const db = firebase.firestore();
      const unsubscribe = db
        .collection('notes')
        .doc(noteId)
        .onSnapshot((doc) => {
          console.log(doc.data());
        });
      return () => {
        unsubscribe();
      };
    }
  }, [noteId]);
  useEffect(() => {
    if (isRecording) {
      const recording = startRecording({ setText, setInProgressText });
      return () => recording.then((cleanUp) => cleanUp());
    }
    if (!isRecording) {
      setInProgressText('');
      if (inProgressText) {
        setText((val) => inProgressText + '\n\n' + val);
      }
    }
  }, [isRecording]);
  return (
    <>
      <div className="main-container">
        <Container>
          <Row className="block">
            <Col md={{ size: 4, offset: 4 }}>
              <Button block color="primary" onClick={() => setIsRecording((val) => !val)}>
                {!isRecording ? 'Record' : 'Stop'}
              </Button>
            </Col>
          </Row>
          <Row className="block">
            <Col md={{ size: 8, offset: 2 }}>
              <div className="form-control">{inProgressText || 'No one speaking...'}</div>
            </Col>
          </Row>
          <Row className="block">
            <Col md={{ size: 8, offset: 2 }}>
              <Form>
                <FormGroup>
                  <Input
                    type="textarea"
                    placeholder="Transcription"
                    value={text || ''}
                    onChange={(e) => setText(e.target.value)}
                    rows={20}
                  />
                </FormGroup>
              </Form>
            </Col>
          </Row>
        </Container>
      </div>
      <style jsx>
        {`
          .main-container {
            margin-top: 100px;
          }
        `}
      </style>
      <style jsx global>
        {`
          .block {
            padding: 25px 0;
          }
        `}
      </style>
    </>
  );
};

Comp.defaultProps = {
  noteId: null,
};

Comp.getInitialProps = ({ query }) => {
  return { ...query };
};

export default Comp;

async function startRecording({ setText, setInProgressText }) {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const config = { audioBitsPerSecond: 128000, mimeType: 'audio/webm' };
  const mediaRecorder = new MediaRecorder(stream, config);
  mediaRecorder.start(1000);
  const cleanUpStreamToServer = createStreamToServer({
    stream,
    onTranscripted: R.pipe(
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
        setText((text) => transcript + '\n\n' + text);
      },
    ),
  });
  return () => {
    cleanUpStreamToServer();
    mediaRecorder.stop();
    stream.getTracks()[0].stop();
  };
}
