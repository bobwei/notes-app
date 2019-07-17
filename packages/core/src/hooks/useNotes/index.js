import { useState, useEffect } from 'react';

const fn = ({ firebase }) => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const db = firebase.firestore();

    const unsubscribe = db
      .collection('notes')
      .orderBy('createdAt', 'desc')
      .onSnapshot((snapshot) => {
        const data = snapshot.docs.map((doc) => {
          const { id } = doc;
          return { id, ...doc.data() };
        });
        setNotes(data);
      });
    return () => {
      unsubscribe();
    };
  }, []);

  return [notes, setNotes];
};

export default fn;
