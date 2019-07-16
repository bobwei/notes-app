import { useState, useEffect } from 'react';

const fn = ({ firebase, noteId, onCreated }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const db = firebase.firestore();

    db.collection('notes')
      .doc(noteId)
      .get()
      .then((snapshot) => {
        if (!snapshot.exists) {
          return db
            .collection('notes')
            .doc(noteId)
            .set({ createdAt: new Date() }, { merge: true });
        }
      });

    const unsubscribe = db
      .collection('notes')
      .doc(noteId)
      .collection('messages')
      .orderBy('createdAt', 'asc')
      .onSnapshot((snapshot) => {
        const data = snapshot.docs.map((doc) => {
          const { id } = doc;
          return { id, ...doc.data() };
        });
        setMessages(data);
        if (onCreated) onCreated();
      });
    return () => {
      unsubscribe();
    };
  }, [noteId]);

  return [messages, setMessages];
};

export default fn;
