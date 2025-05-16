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

    const estadoSelect = document.createElement('select');
    const opcoesEstado = ['pendente', 'tratado', 'cancelado'];

    opcoesEstado.forEach(op => {
      const option = document.createElement('option');
      option.value = op;
      option.textContent = op.charAt(0).toUpperCase() + op.slice(1);
      if (op === dados.estado) option.selected = true;
      estadoSelect.appendChild(option);
    });

    estadoSelect.className = `estado-select ${dados.estado}`;
    estadoSelect.style.fontWeight = 'bold';
    estadoSelect.style.border = 'none';
    estadoSelect.style.padding = '4px 8px';
    estadoSelect.style.borderRadius = '4px';
    estadoSelect.style.cursor = 'pointer';
    estadoSelect.style.transition = 'background-color 0.3s ease, color 0.3s ease';

    // aplica cor inicial
    aplicarEstiloEstado(estadoSelect, dados.estado);

    estadoSelect.onchange = async () => {
      const novoEstado = estadoSelect.value;
      try {
        await updateDoc(doc(db, "marcacoes", documento.id), {
          estado: novoEstado
        });
        aplicarEstiloEstado(estadoSelect, novoEstado); // muda cor sem reload
      } catch (e) {
        alert('Erro ao atualizar estado.');
        console.error(e);
      }
    };

    const estadoTd = document.createElement('td');
    estadoTd.appendChild(estadoSelect);

    linha.innerHTML = `
      <td>${dados.dataPedido?.toDate().toLocaleString('pt-PT') || ''}</td>
      <td>${dados.nome || ''}</td>
      <td>${dados.nascimento || ''}</td>
      <td>${dados.contacto || ''}</td>
      <td>${dados.especialidade || dados.exame || '-'}</td>
      <td>${dados.medico || '-'}</td>
      <td>${dados.tipo === 'exame' ? 'Exame' : 'Consulta'}</td>
    `;

    linha.appendChild(estadoTd);
    tabela.appendChild(linha);
  });
}

function aplicarEstiloEstado(elemento, estado) {
  elemento.className = `estado-select ${estado}`;
  switch (estado) {
    case 'pendente':
      elemento.style.backgroundColor = '#fff3cd';
      elemento.style.color = '#b58900';
      break;
    case 'tratado':
      elemento.style.backgroundColor = '#d4edda';
      elemento.style.color = 'green';
      break;
    case 'cancelado':
      elemento.style.backgroundColor = '#f8d7da';
      elemento.style.color = '#c0392b';
      break;
    default:
      elemento.style.backgroundColor = '';
      elemento.style.color = '';
  }
}

carregarMarcacoes();
