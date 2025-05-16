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

const corpoPendentes = document.getElementById('marcacoes-pendentes');
const corpoTratadas = document.getElementById('marcacoes-tratadas');

async function carregarMarcacoes() {
  corpoPendentes.innerHTML = '';
  corpoTratadas.innerHTML = '';

  const q = query(collection(db, "marcacoes"), orderBy("dataPedido", "desc"));
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((documento) => {
    const dados = documento.data();
    const idDoc = documento.id;

    const linha = document.createElement('tr');
    const detalheRow = document.createElement('tr');
    detalheRow.style.display = 'none';

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
    aplicarEstiloEstado(estadoSelect, dados.estado);

    estadoSelect.onchange = async () => {
      const novoEstado = estadoSelect.value;
      try {
        await updateDoc(doc(db, "marcacoes", idDoc), { estado: novoEstado });
        aplicarEstiloEstado(estadoSelect, novoEstado);
        if (novoEstado === 'pendente') {
          corpoTratadas.removeChild(linha);
          corpoTratadas.removeChild(detalheRow);
          corpoPendentes.appendChild(linha);
          corpoPendentes.appendChild(detalheRow);
        } else {
          corpoPendentes.removeChild(linha);
          corpoPendentes.removeChild(detalheRow);
          corpoTratadas.appendChild(linha);
          corpoTratadas.appendChild(detalheRow);
        }
      } catch (e) {
        alert('Erro ao atualizar estado.');
        console.error(e);
      }
    };

    const expandirBtn = document.createElement('button');
    expandirBtn.textContent = '▼';
    expandirBtn.style.border = 'none';
    expandirBtn.style.background = 'transparent';
    expandirBtn.style.cursor = 'pointer';
    expandirBtn.style.fontSize = '16px';
    expandirBtn.style.marginLeft = '10px';

    expandirBtn.onclick = () => {
      const isExpanded = detalheRow.style.display === 'table-row';
      detalheRow.style.display = isExpanded ? 'none' : 'table-row';
      expandirBtn.textContent = isExpanded ? '▼' : '▲';
    };

    const estadoTd = document.createElement('td');
    estadoTd.appendChild(estadoSelect);
    estadoTd.appendChild(expandirBtn);

    linha.innerHTML = `
      <td>${dados.dataPedido?.toDate().toLocaleString('pt-PT') || ''}</td>
      <td>${dados.nome || ''}</td>
      <td>${dados.nascimento || '-'}</td>
      <td>${dados.contacto || '-'}</td>
      <td>${dados.especialidade || dados.exame || '-'}</td>
      <td>${dados.medico || '-'}</td>
      <td>${dados.tipo === 'exame' ? 'Exame' : 'Consulta'}</td>
    `;
    linha.appendChild(estadoTd);

    const detalheTd = document.createElement('td');
    detalheTd.colSpan = 9;
    detalheTd.innerHTML = `
      <div style="padding: 12px; background-color: #f5f5f5; border-left: 3px solid #26a7b5; border-radius: 4px;">
        <label><strong>Observações:</strong></label><br>
        <textarea style="width: 100%; padding: 6px; border-radius: 4px; font-family: 'Poppins', sans-serif;" rows="3" placeholder="Observações...">${dados.obs || ''}</textarea>
      </div>
    `;

    const textareaObs = detalheTd.querySelector('textarea');
    textareaObs.onblur = async () => {
      try {
        await updateDoc(doc(db, "marcacoes", idDoc), { obs: textareaObs.value.trim() });
      } catch (e) {
        alert('Erro ao guardar observações.');
        console.error(e);
      }
    };

    detalheRow.appendChild(detalheTd);

    const destino = dados.estado === 'pendente' ? corpoPendentes : corpoTratadas;
    destino.appendChild(linha);
    destino.appendChild(detalheRow);
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
