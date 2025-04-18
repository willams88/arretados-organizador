// Importações do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// 🔐 Configuração do projeto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCgFN0lCf0xeJaLnWkTfjAbvDBwQXxXe0A",
  authDomain: "arretados-ingressos-app.firebaseapp.com",
  projectId: "arretados-ingressos-app",
  storageBucket: "arretados-ingressos-app.appspot.com",
  messagingSenderId: "309467408671",
  appId: "1:309467408671:web:d4be567df9b4d39a1e282a",
  measurementId: "G-R5V0QVJBB5"
};

// 🔌 Inicializa o Firebase e exporta
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
