import { db } from './firebase-config.js';
import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Função auxiliar: remove acentos e normaliza para contagem
function normalizar(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Contar e ordenar mantendo o nome original mais frequente
function contarEOrdenar(lista) {
  const contagem = {};
  const nomesOriginais = {};

  lista.forEach(item => {
    if (typeof item === 'string' && item.trim() && item !== '-') {
      const chave = normalizar(item);
      contagem[chave] = (contagem[chave] || 0) + 1;

      // Atualiza apenas se não existir ainda ou se o nome original for mais longo (mais completo)
      if (!nomesOriginais[chave] || item.length > nomesOriginais[chave].length) {
        nomesOriginais[chave] = item.trim();
      }
    }
  });

  return Object.entries(contagem)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([chave, total]) => [nomesOriginais[chave], total]);
}

export async function carregarEstatisticas() {
  const snapshot = await getDocs(collection(db, "marcacoes"));
  const total = snapshot.size;

  let pendentes = 0, tratados = 0, cancelados = 0, exames = 0, consultas = 0;
  const medicos = [], especialidades = [], examesLista = [];

  snapshot.forEach(doc => {
    const m = doc.data();
    const tipo = normalizar(m.tipo || '');

    if (m.estado === 'pendente') pendentes++;
    else if (m.estado === 'tratado') tratados++;
    else if (m.estado === 'cancelado') cancelados++;

    if (tipo === 'exame') {
      exames++;
      if (m.exame && m.exame.trim() !== '-') {
        examesLista.push(m.exame.trim());
      }
    }

    if (tipo === 'consulta') {
      consultas++;
      if (m.medico && m.medico.trim() !== '-') {
        medicos.push(m.medico.trim());
      }
      if (m.especialidade && m.especialidade.trim() !== '-') {
        especialidades.push(m.especialidade.trim());
      }
    }
  });

  document.getElementById('total').textContent = total;
  document.getElementById('pendentes').textContent = pendentes;
  document.getElementById('tratados').textContent = tratados;
  document.getElementById('cancelados').textContent = cancelados;
  document.getElementById('exames').textContent = exames;
  document.getElementById('consultas').textContent = consultas;

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
