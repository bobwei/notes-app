import { useState, useEffect } from 'react';

const fn = ({ firebase, noteId, onNewMessage }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (noteId) {
      const db = firebase.firestore();

      db.collection('notes')
        .doc(noteId)
        .collection('messages')
        .orderBy('createdAt', 'asc')
        .get()
        .then((snapshot) => {
          const data = snapshot.docs.map((obj) => {
            const { id } = obj;
            return { id, ...obj.data() };
          });
          setMessages(data);
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
              .map((change) => {
                const { id } = change.doc;
                return { id, ...change.doc.data() };
              });
            setMessages((val) => [...val, ...data]);
            onNewMessage();
          }
        });
      return () => {
        unsubscribe();
      };
    }
  }, [noteId]);

  return [messages, setMessages];
};

export default fn;