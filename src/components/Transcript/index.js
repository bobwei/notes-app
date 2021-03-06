import React, { useRef, useEffect } from 'react';
import ColorHash from 'color-hash';

const Comp = ({ messages }) => {
  const container = useRef(null);
  useEffect(() => {
    scrollToBottom(container);
  }, [messages]);
  return (
    <>
      <div className="container" ref={container}>
        {messages.map(({ id, text, createdAt, userId }, index) => {
          return (
            <div key={id || index} className="message">
              <div className="user">
                <i className="fas fa-user" style={{ color: new ColorHash().hex(userId) }} />
              </div>
              <div className="info">
                <div className="time">{createdAt && mapTime(createdAt)}</div>
                <div className="text">{text}</div>
              </div>
            </div>
          );
        })}
      </div>
      <style jsx>
        {`
          .container {
            height: calc(100vh - 50px * 3 - 25px * 4 - 115px);
            border: 1px solid #eee;
            padding: 8px;
            overflow-y: auto;
          }
          .message {
            min-height: 50px;
            margin: 15px 0;
          }
          .user {
            float: left;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: 40px;
            height: 50px;
          }
          .user > .fa-user {
            color: #ddd;
          }
          .info {
            padding-left: 40px;
          }
          .time {
            color: #8294a5;
            font-size: 14px;
            margin-bottom: 5px;
            min-height: 21px;
          }
        `}
      </style>
    </>
  );
};

export default Comp;

function scrollToBottom(ref) {
  const $el = ref.current;
  if ($el) {
    $el.scrollTop = $el.scrollHeight;
  }
}

function mapTime(createdAt) {
  const t = createdAt.toDate();
  return `${t.getMonth() + 1}/${t.getDate()} ${t.getHours()}:${t.getMinutes()}`;
}
