const conteudo = document.getElementById("conteudo");
const links = document.querySelectorAll("a[data-page]");

// Carrega a primeira página por defeito
window.addEventListener("DOMContentLoaded", () => {
  carregarPagina("marcacoes.html");
  configurarChatbot();
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
  fetch(nomeFicheiro)
    .then(res => res.text())
    .then(html => {
      conteudo.innerHTML = html;

      // Elimina duplicações do chatbot
      const duplicadoToggle = document.querySelectorAll('#chatbot-toggle');
      const duplicadoBox = document.querySelectorAll('#chatbot-box');
      if (duplicadoToggle.length > 1) {
        for (let i = 1; i < duplicadoToggle.length; i++) duplicadoToggle[i].remove();
      }
      if (duplicadoBox.length > 1) {
        for (let i = 1; i < duplicadoBox.length; i++) duplicadoBox[i].remove();
      }

      configurarChatbot();

      if (nomeFicheiro === "marcacoes.html") {
        import("./firebase-config.js").then(m => {
          if (typeof m.carregarMarcacoes === "function") {
            m.carregarMarcacoes();
          }
        });
      }

      if (nomeFicheiro === "estatisticas.html") {
        import("./estatisticas.js").then(m => {
          console.log("✅ estatisticas.js importado");
          if (typeof m.carregarEstatisticas === "function") {
            m.carregarEstatisticas();
          } else {
            console.warn("⚠️ carregarEstatisticas não encontrada no módulo");
          }
        }).catch(err => {
          console.error("Erro ao importar estatisticas.js:", err);
        });
      }
    })
    .catch(err => {
      conteudo.innerHTML = `<p>Erro ao carregar ${nomeFicheiro}</p>`;
      console.error(err);
    });
}

// Configurar comportamento do botão do chatbot
function configurarChatbot() {
  const toggleBtn = document.getElementById('chatbot-toggle');
  const box = document.getElementById('chatbot-box');
  if (toggleBtn && box) {
    toggleBtn.onclick = () => {
      const isVisible = box.style.display === 'block';
      box.style.display = isVisible ? 'none' : 'block';
    };
  }
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
