const conteudo = document.getElementById("conteudo");
const links = document.querySelectorAll("a[data-page]");

// Carrega a primeira página por defeito
window.addEventListener("DOMContentLoaded", () => {
  console.log("🔄 DOM totalmente carregado. A iniciar...");
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
          console.log("📦 firebase-config.js importado");
          if (typeof m.carregarMarcacoes === "function") {
            m.carregarMarcacoes();
          } else {
            console.warn("⚠️ carregarMarcacoes não encontrada no módulo");
          }
        }).catch(err => {
          console.error("❌ Erro ao importar firebase-config.js:", err);
        });
      }

      if (nomeFicheiro === "estatisticas.html") {
        import("./estatisticas.js").then(m => {
          console.log("📦 estatisticas.js importado");
          if (typeof m.carregarEstatisticas === "function") {
            m.carregarEstatisticas();
          } else {
            console.warn("⚠️ carregarEstatisticas não encontrada no módulo");
          }
        }).catch(err => {
          console.error("❌ Erro ao importar estatisticas.js:", err);
        });
      }

      if (nomeFicheiro === "logs.html") {
        import("./logs.js").then(m => {
          console.log("📦 logs.js importado");
          if (typeof m.carregarLogs === "function") {
            m.carregarLogs();
          } else {
            console.warn("⚠️ carregarLogs não encontrada no módulo");
          }
        }).catch(err => {
          console.error("❌ Erro ao importar logs.js:", err);
        });
      }
    })
    .catch(err => {
      conteudo.innerHTML = `<p>Erro ao carregar ${nomeFicheiro}</p>`;
      console.error(`❌ Falha ao carregar ${nomeFicheiro}:`, err);
    });
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
