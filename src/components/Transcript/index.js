import React from 'react';
import ColorHash from 'color-hash';

const Comp = ({ messages }) => {
  return (
    <>
      <div className="container">
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
            margin: 15px 0;
          }
          .user {
            float: left;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: 50px;
            height: 50px;
          }
          .user > .fa-user {
            color: #ddd;
          }
          .info {
            padding-left: 50px;
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

function mapTime(createdAt) {
  const t = createdAt.toDate();
  return `${t.getMonth() + 1}/${t.getDate()} ${t.getHours()}:${t.getMinutes()}`;
}
