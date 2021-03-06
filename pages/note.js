import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.css';
import { Container, Row, Col } from 'reactstrap';
import { Form, FormGroup } from 'reactstrap';
import * as R from 'ramda';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import shortid from 'shortid';

/* eslint-disable import/no-extraneous-dependencies */
import useMessages from '@project/core/src/hooks/useMessages';
import createStreamToServer from '../src/utils/createStreamToServer';
import Microphone from '../src/components/Microphone';
import Transcript from '../src/components/Transcript';

const Comp = ({ noteId }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [inProgressText, setInProgressText] = useState('');
  const [messages] = useMessages({ firebase, noteId, onCreated: () => setInProgressText('') });
  useRecording({ isRecording, noteId, inProgressText, setInProgressText });
  return (
    <>
      <div className="main-container">
        <Container>
          <Row className="block">
            <Col md={{ size: 8, offset: 2 }}>
              <Form>
                <FormGroup>
                  <Transcript messages={!inProgressText ? messages : [...messages, { text: inProgressText }]} />
                </FormGroup>
              </Form>
            </Col>
          </Row>
          <Row className="block">
            <Col md={{ size: 4, offset: 4 }} className="text-center">
              <Microphone isRecording={isRecording} onClick={() => setIsRecording((val) => !val)} />
            </Col>
          </Row>
        </Container>
      </div>
      <style jsx>
        {`
          .main-container {
            margin-top: 50px;
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

async function startRecording({ noteId, setInProgressText }) {
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
        createMessage({ noteId, text: transcript });
      },
    ),
  });
  return () => {
    cleanUpStreamToServer();
    mediaRecorder.stop();
    stream.getTracks()[0].stop();
  };
}

async function createMessage({ noteId, text }) {
  const db = firebase.firestore();
  const storageKey = 'userId';
  if (!localStorage.getItem(storageKey)) {
    localStorage.setItem(storageKey, shortid.generate());
  }
  const userId = localStorage.getItem(storageKey);
  await db
    .collection('notes')
    .doc(noteId)
    .collection('messages')
    .add({
      text,
      createdAt: new Date(),
      userId,
    });
}

function useRecording({ isRecording, noteId, inProgressText, setInProgressText }) {
  useEffect(() => {
    if (isRecording) {
      const recording = startRecording({ noteId, setInProgressText });
      return () => recording.then((cleanUp) => cleanUp());
    }
    if (!isRecording) {
      setInProgressText('');
      if (inProgressText) {
        createMessage({ noteId, text: inProgressText });
      }
    }
  }, [isRecording]);
}
