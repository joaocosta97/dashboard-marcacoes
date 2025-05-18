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

// Função para carregar conteúdo da página
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
        // Esperar que o conteúdo esteja no DOM antes de correr o script embutido
        setTimeout(() => {
          const scriptTag = conteudo.querySelector('script[type="module"]');
          if (scriptTag) {
            eval(scriptTag.textContent);
          }
        }, 50);
      }

      if (nomeFicheiro === "logs.html") {
        setTimeout(() => {
          const scriptTag = conteudo.querySelector('script[type="module"]');
          if (scriptTag) {
            eval(scriptTag.textContent);
          }
        }, 50);
      }
    })
    .catch(err => {
      conteudo.innerHTML = `<p>Erro ao carregar ${nomeFicheiro}</p>`;
      console.error(err);
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
