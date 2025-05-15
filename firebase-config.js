// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy,
  updateDoc,
  doc
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

const tabela = document.getElementById('marcacoes');

async function carregarMarcacoes() {
  tabela.innerHTML = ''; // limpar antes de carregar
  const q = query(collection(db, "marcacoes"), orderBy("dataPedido", "desc"));
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((documento) => {
    const dados = documento.data();
    const linha = document.createElement('tr');

    const estadoBtn = document.createElement('button');
    estadoBtn.textContent = dados.estado || 'pendente';
    estadoBtn.className = dados.estado === 'tratado' ? 'tratado' : 'pendente';
    estadoBtn.style.border = 'none';
    estadoBtn.style.background = 'transparent';
    estadoBtn.style.cursor = 'pointer';
    estadoBtn.onclick = async () => {
      const novoEstado = dados.estado === 'tratado' ? 'pendente' : 'tratado';
      try {
        await updateDoc(doc(db, "marcacoes", documento.id), {
          estado: novoEstado
        });
        carregarMarcacoes(); // recarrega tabela após alteração
      } catch (e) {
        alert('Erro ao atualizar estado.');
        console.error(e);
      }
    };

    const estadoTd = document.createElement('td');
    estadoTd.appendChild(estadoBtn);

    linha.innerHTML = `
      <td>${dados.dataPedido?.toDate().toLocaleString('pt-PT') || ''}</td>
      <td>${dados.nome || ''}</td>
      <td>${dados.nascimento || ''}</td>
      <td>${dados.contacto || ''}</td>
      <td>${dados.especialidade || dados.exame || '-'}</td>
      <td>${dados.medico || '-'}</td>
      <td>${dados.tipo === 'exame' ? '🧪 Exame' : '👨‍⚕️ Consulta'}</td>
    `;

    linha.appendChild(estadoTd);
    tabela.appendChild(linha);
  });
}

carregarMarcacoes();
