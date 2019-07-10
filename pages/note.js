import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.css';
import { Container, Row, Col } from 'reactstrap';
import { Form, FormGroup } from 'reactstrap';
import * as R from 'ramda';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import shortid from 'shortid';

import createStreamToServer from '../src/utils/createStreamToServer';
import Microphone from '../src/components/Microphone';
import Transcript from '../src/components/Transcript';

const Comp = ({ noteId }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inProgressText, setInProgressText] = useState('');
  const textarea = useRef(null);
  useDB({ noteId, setMessages, setInProgressText, textarea });
  useRecording({ isRecording, noteId, inProgressText, setInProgressText, textarea });
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

async function startRecording({ noteId, setInProgressText, textarea }) {
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
          scrollToBottom(textarea);
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

function useDB({ noteId, setMessages, setInProgressText, textarea }) {
  useEffect(() => {
    if (noteId) {
      const db = firebase.firestore();

      db.collection('notes')
        .doc(noteId)
        .collection('messages')
        .orderBy('createdAt', 'asc')
        .get()
        .then((snapshot) => {
          const data = snapshot.docs.map((obj) => obj.data());
          setMessages(data);
          scrollToBottom(textarea);
        });

      const unsubscribe = db
        .collection('notes')
        .doc(noteId)
        .collection('messages')
        .orderBy('createdAt', 'asc')
        .where('createdAt', '>', new Date())
        .onSnapshot((snapshot) => {
          if (snapshot.docs.length) {
            const data = snapshot
              .docChanges()
              .filter((change) => change.type === 'added')
              .map((change) => change.doc.data());
            setMessages((messages) => [...messages, ...data]);
            setInProgressText('');
            scrollToBottom(textarea);
          }
        });
      return () => {
        unsubscribe();
      };
    }
  }, [noteId]);
}

function useRecording({ isRecording, noteId, inProgressText, setInProgressText, textarea }) {
  useEffect(() => {
    if (isRecording) {
      const recording = startRecording({ noteId, setInProgressText, textarea });
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

function scrollToBottom(ref) {
  const $el = ref.current;
  if ($el) {
    $el.scrollTop = $el.scrollHeight;
  }
}
