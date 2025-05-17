import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCFUE-h0mH-NTfDrVTalWpj2M3tREX2HoA",
  authDomain: "chatbot-elvira.firebaseapp.com",
  projectId: "chatbot-elvira",
  storageBucket: "chatbot-elvira.firebasestorage.app",
  messagingSenderId: "794247687628",
  appId: "1:794247687628:web:e13e114370fe2e278f8169"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const btn = document.getElementById('entrar');
const erro = document.getElementById('erro');

btn.addEventListener('click', async () => {
  const user = document.getElementById('utilizador').value.trim();
  const pass = document.getElementById('password').value;

  if (!user || !pass) {
    erro.textContent = 'Preencha todos os campos.';
    return;
  }

  const emailCompleto = `${user}@marcacoes.pt`;

  try {
    await signInWithEmailAndPassword(auth, emailCompleto, pass);
    window.location.href = 'index.html';
  } catch (e) {
    erro.textContent = 'Credenciais inválidas.';
    console.error(e);
  }
});
