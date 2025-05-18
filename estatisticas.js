import { db } from './firebase-config.js';
import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Função auxiliar para contar e ordenar um array
function contarEOrdenar(lista) {
  const contagem = {};
  lista.forEach(item => {
    if (item && item.trim()) {
      const chave = item.trim();
      contagem[chave] = (contagem[chave] || 0) + 1;
    }
  });

  return Object.entries(contagem)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
}

export async function carregarEstatisticas() {
  const snapshot = await getDocs(collection(db, "marcacoes"));
  const total = snapshot.size;

  let pendentes = 0, tratados = 0, cancelados = 0, exames = 0, consultas = 0;
  const medicos = [], especialidades = [], examesLista = [];

  snapshot.forEach(doc => {
    const m = doc.data();

    // Contagem por estado
    if (m.estado === 'pendente') pendentes++;
    else if (m.estado === 'tratado') tratados++;
    else if (m.estado === 'cancelado') cancelados++;

    // Contagem por tipo
    if (m.tipo === 'exame') {
      exames++;
      if (m.exame && m.exame.trim()) {
        examesLista.push(m.exame.trim());
      }
    }

    if (m.tipo === 'consulta') {
      consultas++;
      if (m.especialidade && m.especialidade.trim()) {
        especialidades.push(m.especialidade.trim());
      }
      if (m.medico && m.medico.trim()) {
        medicos.push(m.medico.trim());
      }
    }
  });

  // Mostrar totais
  document.getElementById('total').textContent = total;
  document.getElementById('pendentes').textContent = pendentes;
  document.getElementById('tratados').textContent = tratados;
  document.getElementById('cancelados').textContent = cancelados;
  document.getElementById('exames').textContent = exames;
  document.getElementById('consultas').textContent = consultas;

  // Calcular e preencher tops
  preencherLista("top-medicos", contarEOrdenar(medicos));
  preencherLista("top-especialidades", contarEOrdenar(especialidades));
  preencherLista("top-exames", contarEOrdenar(examesLista));
}

function preencherLista(id, lista) {
  const ul = document.getElementById(id);
  if (!ul) return;
  ul.innerHTML = '';

  lista.forEach(([nome, total]) => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${nome}</strong> <span>(${total})</span>`;
    ul.appendChild(li);
  });
}
