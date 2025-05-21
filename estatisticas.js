import { db } from './firebase-config.js';
import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

export async function carregarEstatisticas() {
  const snapshot = await getDocs(collection(db, "marcacoes"));
  const total = snapshot.size;

  let pendentes = 0, tratados = 0, cancelados = 0, exames = 0, consultas = 0;

  snapshot.forEach(doc => {
    const m = doc.data();
    const tipo = (m.tipo || '').toLowerCase();

    // Contar estados
    if (m.estado === 'pendente') pendentes++;
    else if (m.estado === 'tratado') tratados++;
    else if (m.estado === 'cancelado') cancelados++;

    // Contar tipo
    if (tipo === 'exame') exames++;
    else if (tipo === 'consulta') consultas++;
  });

  document.getElementById('total').textContent = total;
  document.getElementById('pendentes').textContent = pendentes;
  document.getElementById('tratados').textContent = tratados;
  document.getElementById('cancelados').textContent = cancelados;
  document.getElementById('exames').textContent = exames;
  document.getElementById('consultas').textContent = consultas;
}
