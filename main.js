const conteudo = document.getElementById("conteudo");
const links = document.querySelectorAll("a[data-page]");

// Definir o HTML do chatbot como uma constante para reutilização
const chatbotHTML = `
<div id="chatbot-box" style="display: none; position: fixed; bottom: 80px; right: 24px; width: 360px; height: 480px; box-shadow: 0 0 12px rgba(0,0,0,0.2); border-radius: 8px; overflow: hidden; z-index: 999;">
  <iframe src="https://elvira-chatbot-production.up.railway.app" style="width: 100%; height: 100%; border: none;"></iframe>
</div>

<button id="chatbot-toggle" style="position: fixed; bottom: 24px; right: 24px; background-color: #26a7b5; color: white; border: none; border-radius: 50px; padding: 12px 20px; cursor: pointer; font-size: 16px; z-index: 1000;">
  💬 Falar com a Elvira
</button>
`;

// Variável para controlar se o chatbot está atualmente no DOM
let chatbotAtivo = false;

// Função para adicionar o chatbot ao DOM
function adicionarChatbot() {
  if (!chatbotAtivo) {
    // Verificar se já existe para evitar duplicações
    if (!document.getElementById('chatbot-toggle')) {
      document.body.insertAdjacentHTML('beforeend', chatbotHTML);
      configurarChatbot();
      chatbotAtivo = true;
      console.log("🤖 Chatbot adicionado ao DOM.");
    }
  }
}

// Função para remover o chatbot do DOM
function removerChatbot() {
  const toggle = document.getElementById('chatbot-toggle');
  const box = document.getElementById('chatbot-box');
  
  if (toggle) toggle.remove();
  if (box) box.remove();
  
  chatbotAtivo = false;
  console.log("🤖 Chatbot removido do DOM.");
}

// Carrega a primeira página por defeito
window.addEventListener("DOMContentLoaded", () => {
  console.log("🔄 DOM totalmente carregado. A iniciar...");
  carregarPagina("marcacoes.html");
});

// Navegação dinâmica
links.forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const pagina = link.getAttribute("data-page");
    carregarPagina(pagina);

    links.forEach(l => l.classList.remove("ativo"));
    link.classList.add("ativo");
  });
});

// Carregar conteúdo e JS associado
function carregarPagina(nomeFicheiro) {
  console.log(`📄 A carregar página: ${nomeFicheiro}`);

  fetch(nomeFicheiro)
    .then(res => {
      console.log("🔍 Resposta do fetch:", res);
      if (!res.ok) throw new Error(`Erro HTTP: ${res.status}`);
      return res.text();
    })
    .then(html => {
      conteudo.innerHTML = html;
      console.log(`✅ ${nomeFicheiro} carregado com sucesso.`);

      // Gerir o chatbot com base na página carregada
      if (nomeFicheiro === "marcacoes.html") {
        adicionarChatbot();
      } else {
        removerChatbot();
      }

      if (nomeFicheiro === "marcacoes.html") {
        import("./firebase-config.js").then(m => {
          if (typeof m.carregarMarcacoes === "function") {
            m.carregarMarcacoes();
          }
        }).catch(err => {
          console.error("Erro ao importar firebase-config.js:", err);
        });
      }

      if (nomeFicheiro === "estatisticas.html") {
        import("./estatisticas.js").then(m => {
          if (typeof m.carregarEstatisticas === "function") {
            m.carregarEstatisticas();
          }
        }).catch(err => {
          console.error("Erro ao importar estatisticas.js:", err);
        });
      }

      if (nomeFicheiro === "logs.html") {
        import("./logs.js").then(m => {
          if (typeof m.carregarLogs === "function") {
            m.carregarLogs();
          }
        }).catch(err => {
          console.error("Erro ao importar logs.js:", err);
        });
      }
    })
    .catch(err => {
      conteudo.innerHTML = `<p>Erro ao carregar ${nomeFicheiro}</p>`;
      console.error(`❌ Falha ao carregar ${nomeFicheiro}:`, err);
    });
}

// Configurar comportamento do chatbot
function configurarChatbot() {
  const toggle = document.getElementById('chatbot-toggle');
  const box = document.getElementById('chatbot-box');

  if (!toggle || !box) {
    console.warn("⛔ Botão ou caixa do chatbot não encontrados.");
    return;
  }

  // Prevenir múltiplas ligações do evento
  if (!toggle.dataset.listener) {
    toggle.addEventListener('click', () => {
      const isVisible = box.style.display === 'block';
      box.style.display = isVisible ? 'none' : 'block';
    });
    toggle.dataset.listener = "true";
  }

  console.log("🤖 Chatbot configurado.");
}

// Logout
document.getElementById("logout").addEventListener("click", () => {
  import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js").then(({ getAuth, signOut }) => {
    const auth = getAuth();
    signOut(auth).then(() => {
      window.location.href = "index.html";
    });
  });
});
