import { db } from './firebase-config.js';
import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Utilitário para contar e ordenar
function contarEOrdenar(lista) {
  const contagem = {};
  lista.forEach(item => {
    if (item) {
      contagem[item] = (contagem[item] || 0) + 1;
    }
  });

  return Object.entries(contagem)
    .sort((a, b) => b[1] - a[1]) // ordem decrescente
    .slice(0, 5); // top 5
}

export async function carregarEstatisticas() {
  const snapshot = await getDocs(collection(db, "marcacoes"));
  const total = snapshot.size;

  let pendentes = 0, tratados = 0, cancelados = 0, exames = 0, consultas = 0;
  const medicos = [], especialidades = [], examesLista = [];

  snapshot.forEach(doc => {
    const m = doc.data();

    // Estado
    if (m.estado === 'pendente') pendentes++;
    else if (m.estado === 'tratado') tratados++;
    else if (m.estado === 'cancelado') cancelados++;

    // Tipo
    if (m.tipo === 'exame') {
      exames++;
      examesLista.push(m.exame || null);
    }
    if (m.tipo === 'consulta') {
      consultas++;
      especialidades.push(m.especialidade || null);
      medicos.push(m.medico || null);
    }
  });

  // Mostrar totais
  document.getElementById('total').textContent = total;
  document.getElementById('pendentes').textContent = pendentes;
  document.getElementById('tratados').textContent = tratados;
  document.getElementById('cancelados').textContent = cancelados;
  document.getElementById('exames').textContent = exames;
  document.getElementById('consultas').textContent = consultas;

  // Top 5
  const topMedicos = contarEOrdenar(medicos);
  const topEspecialidades = contarEOrdenar(especialidades);
  const topExames = contarEOrdenar(examesLista);

  preencherLista("top-medicos", topMedicos);
  preencherLista("top-especialidades", topEspecialidades);
  preencherLista("top-exames", topExames);
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
