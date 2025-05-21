const conteudo = document.getElementById("conteudo");
const links = document.querySelectorAll("a[data-page]");

// Carrega a primeira página por defeito
window.addEventListener("DOMContentLoaded", () => {
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
  fetch(nomeFicheiro)
    .then(res => res.text())
    .then(html => {
      conteudo.innerHTML = html;

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

      // Remover elementos duplicados do chatbot
      setTimeout(() => {
        const toggles = document.querySelectorAll('#chatbot-toggle');
        const boxes = document.querySelectorAll('#chatbot-box');

        if (toggles.length > 1) {
          for (let i = 1; i < toggles.length; i++) toggles[i].remove();
        }

        if (boxes.length > 1) {
          for (let i = 1; i < boxes.length; i++) boxes[i].remove();
        }
      }, 100);
    })
    .catch(err => {
      conteudo.innerHTML = `<p>Erro ao carregar ${nomeFicheiro}</p>`;
      console.error(err);
    });
}

// Logout
const logoutBtn = document.getElementById("logout");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js").then(({ getAuth, signOut }) => {
      const auth = getAuth();
      signOut(auth).then(() => {
        window.location.href = "index.html";
      });
    });
  });
}
