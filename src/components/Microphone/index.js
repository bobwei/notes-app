import React from 'react';

const Comp = ({ isRecording, ...props }) => {
  return (
    <>
      <button className="btn-primary microphone" type="button" {...props}>
        {!isRecording ? <i className="fas fa-microphone" /> : <i className="fas fa-stop" />}
      </button>
      <style jsx>
        {`
          .microphone {
            width: 65px;
            height: 65px;
            border-radius: 65px;
            font-size: 28px;
            padding: 0;
          }
        `}
      </style>
    </>
  );
};

export default Comp;
