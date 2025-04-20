
const firebaseConfig = {
  apiKey: "AIzaSyCgFN0lCf0xeJaLnWkTfjAbvDBwQXxXe0A",
  authDomain: "arretados-ingressos-app.firebaseapp.com",
  projectId: "arretados-ingressos-app",
  storageBucket: "arretados-ingressos-app.firebasestorage.app",
  messagingSenderId: "309467408671",
  appId: "1:309467408671:web:d4be567df9b4d39a1e282a",
  measurementId: "G-R5V0QVJBB5"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
