import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCFUE-h0mH-NTfDrVTalWpj2M3tREX2HoA",
  authDomain: "chatbot-elvira.firebaseapp.com",
  projectId: "chatbot-elvira",
  storageBucket: "chatbot-elvira.firebasestorage.app",
  messagingSenderId: "794247687628",
  appId: "1:794247687628:web:e13e114370fe2e278f8169"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function carregarLogs() {
  const lista = document.getElementById('lista-logs');
  if (!lista) return;

  const q = query(collection(db, "logs_marcacoes"), orderBy("timestamp", "desc"));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    lista.innerHTML = '<p>Sem registos de alterações.</p>';
    return;
  }

  lista.innerHTML = ''; // Limpar antes de carregar novos

  snapshot.forEach(doc => {
    const log = doc.data();
    const li = document.createElement('li');

    const data = log.timestamp?.toDate().toLocaleString('pt-PT') || 'data desconhecida';
    li.innerHTML = `
      <strong>${log.username || 'Desconhecido'}</strong> alterou
      <code>${log.idMarcacao || '???'}</code> de
      <em>${log.estadoAnterior}</em> para
      <em>${log.novoEstado}</em> às ${data}.
    `;

    lista.appendChild(li);
  });
}
