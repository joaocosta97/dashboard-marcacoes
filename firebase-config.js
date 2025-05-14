// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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

const tabela = document.getElementById('marcacoes');

async function carregarMarcacoes() {
  const q = query(collection(db, "marcacoes"), orderBy("dataPedido", "desc"));
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    const dados = doc.data();
    const linha = document.createElement('tr');

    linha.innerHTML = `
      <td>${dados.dataPedido?.toDate().toLocaleString('pt-PT') || ''}</td>
      <td>${dados.nome || ''}</td>
      <td>${dados.nascimento || ''}</td>
      <td>${dados.contacto || ''}</td>
      <td>${dados.especialidade || dados.exame ||'-'}</td>
      <td>${dados.medico || '-'}</td>
      <td>${dados.tipo === 'exame' ? '🧪 Exame' : '👨‍⚕️ Consulta'}</td>
      <td class="${dados.estado}">${dados.estado}</td>
    `;

    tabela.appendChild(linha);
  });
}

carregarMarcacoes();
