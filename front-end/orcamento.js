const API = 'http://localhost:3000';
let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

function renderizarResumo() {
  const resumo = document.getElementById('resumoCarrinho');
  const footer = document.getElementById('resumoFooter');
  const total = document.getElementById('totalProdutos');

  if (carrinho.length === 0) {
    resumo.innerHTML = `
      <p class="orc-vazio">Nenhum produto selecionado.<br>
        <a href="produtos.html">← Voltar ao catálogo</a>
      </p>`;
    footer.style.display = 'none';
    return;
  }

  total.textContent = carrinho.length;
  footer.style.display = 'flex';

  resumo.innerHTML = carrinho.map(p => `
    <div class="orc-item">
      <img src="Imagens/${p.imagem}" alt="${p.nome}"
        onerror="this.src='https://placehold.co/52x52/1a2a2a/2ec4b6?text=IPR'">
      <div class="orc-item-info">
        <h4>${p.nome}</h4>
        <p>${p.categoria}</p>
      </div>
    </div>
  `).join('');
}

async function enviarOrcamento() {
  const nome = document.getElementById('nome').value.trim();
  const empresa = document.getElementById('empresa').value.trim();
  const email = document.getElementById('email').value.trim();
  const telefone = document.getElementById('telefone').value.trim();
  const mensagem = document.getElementById('mensagem').value.trim();

  const erroMsg = document.getElementById('erroMsg');
  const sucessoMsg = document.getElementById('sucessoMsg');

  erroMsg.style.display = 'none';
  sucessoMsg.style.display = 'none';

  if (!nome || !email) {
    erroMsg.textContent = '⚠️ Nome e e-mail são obrigatórios.';
    erroMsg.style.display = 'block';
    return;
  }

  const btn = document.querySelector('.orc-btn-enviar');
  btn.textContent = 'Enviando...';
  btn.disabled = true;

  try {
    const res = await fetch(`${API}/orcamentos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, empresa, email, telefone, mensagem, produtos: carrinho })
    });

    const data = await res.json();

    if (res.ok) {
      sucessoMsg.style.display = 'block';
      localStorage.removeItem('carrinho');
      carrinho = [];
      renderizarResumo();
      document.getElementById('nome').value = '';
      document.getElementById('empresa').value = '';
      document.getElementById('email').value = '';
      document.getElementById('telefone').value = '';
      document.getElementById('mensagem').value = '';
    } else {
      erroMsg.textContent = '⚠️ ' + (data.erro || 'Erro ao enviar. Tente novamente.');
      erroMsg.style.display = 'block';
    }
  } catch (err) {
    erroMsg.textContent = '⚠️ Erro de conexão. Verifique se o servidor está rodando.';
    erroMsg.style.display = 'block';
  }

  btn.textContent = 'Enviar Solicitação de Orçamento →';
  btn.disabled = false;
}

renderizarResumo();