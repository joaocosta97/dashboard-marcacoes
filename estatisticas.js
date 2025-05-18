import { db } from './firebase-config.js';
import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Função auxiliar: remove acentos, espaços duplicados, e normaliza
function normalizar(str) {
  return (str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
    .replace(/\s+/g, ' ')            // espaços normais
    .trim();
}

// Contar e ordenar mantendo nomes originais
function contarEOrdenar(lista) {
  const contagem = {};
  const mapaOriginal = {};

  lista.forEach(item => {
    if (item && item.trim() && item !== '-') {
      const chave = normalizar(item);
      contagem[chave] = (contagem[chave] || 0) + 1;
      mapaOriginal[chave] = item; // guarda versão original
    }
  });

  return Object.entries(contagem)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([chave, total]) => [mapaOriginal[chave], total]);
}

export async function carregarEstatisticas() {
  const snapshot = await getDocs(collection(db, "marcacoes"));
  const total = snapshot.size;

  let pendentes = 0, tratados = 0, cancelados = 0, exames = 0, consultas = 0;
  const medicos = [], especialidades = [], examesLista = [];

  snapshot.forEach(doc => {
    const m = doc.data();
    const tipo = normalizar(m.tipo || '');
    const isExame = tipo.includes('exame');
    const isConsulta = tipo.includes('consulta');

    // Contar estados
    const estado = normalizar(m.estado);
    if (estado === 'pendente') pendentes++;
    else if (estado === 'tratado') tratados++;
    else if (estado === 'cancelado') cancelados++;

    // Exames
    if (isExame) {
      exames++;
      if (m.exame && m.exame.trim() !== '-') {
        examesLista.push(m.exame.trim());
      }
    }

    // Consultas
    if (isConsulta) {
      consultas++;

      if (m.medico && typeof m.medico === 'string' && m.medico.trim() !== '-') {
        medicos.push(m.medico.trim());
        console.log("👨‍⚕️ Médico detectado:", m.medico);
      }

      if (m.especialidade && typeof m.especialidade === 'string' && m.especialidade.trim() !== '-') {
        especialidades.push(m.especialidade.trim());
        console.log("🩺 Especialidade detectada:", m.especialidade);
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

  // Tops
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
