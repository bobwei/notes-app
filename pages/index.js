import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'reactstrap';
import { Button } from 'reactstrap';
import { withRouter } from 'next/router';
import shortid from 'shortid';

const Comp = ({ router }) => {
  return (
    <>
      <div className="main-container">
        <Container className="main-container">
          <Row>
            <Col md={{ size: 4, offset: 4 }}>
              <Button block color="primary" onClick={() => create({ router })}>
                Create Note
              </Button>
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

export default withRouter(Comp);

function create({ router }) {
  router.push('/notes/' + shortid.generate());
}
