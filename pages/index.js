import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'reactstrap';
import { Button } from 'reactstrap';
import { Form, FormGroup, Input } from 'reactstrap';

import createStreamToServer from '../src/utils/createStreamToServer';

const fn = () => {
  const [isRecording, setIsRecording] = useState(false);
  useEffect(() => {
    if (isRecording) {
      const recording = startRecording();
      return () => recording.then((cleanUp) => cleanUp());
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
              <Form>
                <FormGroup>
                  <Input type="textarea" placeholder="Text" />
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

export default fn;

async function startRecording() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const config = { audioBitsPerSecond: 128000, mimeType: 'audio/webm' };
  const mediaRecorder = new MediaRecorder(stream, config);
  mediaRecorder.start(1000);
  const cleanUpStreamToServer = createStreamToServer({ stream });
  return () => {
    cleanUpStreamToServer();
    mediaRecorder.stop();
    stream.getTracks()[0].stop();
  };
}
