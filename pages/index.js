import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'reactstrap';
import { Button } from 'reactstrap';

import createMediaRecorder from '../src/utils/createMediaRecorder';

const fn = () => {
  const [mediaRecorder, setMediaRecorder] = useState(null);
  return (
    <>
      <div className="main-container">
        <Container>
          <Row>
            <Col md={{ size: 4, offset: 4 }}>
              {!mediaRecorder && (
                <Button
                  block
                  color="primary"
                  onClick={createOnStart({ setMediaRecorder })}
                >
                  Record
                </Button>
              )}
              {mediaRecorder && (
                <Button
                  block
                  color="primary"
                  onClick={createOnStop({ mediaRecorder, setMediaRecorder })}
                >
                  Stop
                </Button>
              )}
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
    </>
  );
};

export default fn;

function createOnStart({ setMediaRecorder }) {
  return async () => {
    const mediaRecorder = await createMediaRecorder();
    mediaRecorder.addEventListener('dataavailable', (event) => {
      console.log(event.data);
    });
    mediaRecorder.start(1000);
    setMediaRecorder(mediaRecorder);
  };
}

function createOnStop({ mediaRecorder, setMediaRecorder }) {
  return () => {
    mediaRecorder.stop();
    setMediaRecorder(null);
  };
}
