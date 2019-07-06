import App from 'next/app';
import * as firebase from 'firebase/app';
import 'firebase/firestore';

class Comp extends App {
  componentDidMount() {
    if (!firebase.apps.length) {
      const firebaseConfig = process.env.FIREBASE_CONFIG;
      firebase.initializeApp(firebaseConfig);
    }
  }
}

export default Comp;
