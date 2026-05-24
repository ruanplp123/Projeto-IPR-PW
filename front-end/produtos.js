const API = 'http://localhost:3000';
let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
let todosProdutos = [];

// ===== CARREGAR PRODUTOS =====
async function carregarProdutos() {
  try {
    const res = await fetch(`${API}/produtos`);
    todosProdutos = await res.json();
    renderizarProdutos(todosProdutos);
  } catch (err) {
    document.getElementById('produtosGrid').innerHTML =
      '<p class="loading">Erro ao carregar produtos. Verifique se o servidor está rodando.</p>';
  }
}

function renderizarProdutos(lista) {
  const grid = document.getElementById('produtosGrid');

  if (lista.length === 0) {
    grid.innerHTML = '<p class="loading">Nenhum produto encontrado.</p>';
    return;
  }

  grid.innerHTML = lista.map(p => {
    const noCarrinho = carrinho.some(c => c.id === p.id);
    return `
      <div class="produto-card" data-categoria="${p.categoria}">
        <div class="produto-card-img">
          <img src="Imagens/${p.imagem}" alt="${p.nome}"
            onerror="this.src='https://placehold.co/400x200/1a2a2a/2ec4b6?text=${encodeURIComponent(p.nome)}'">
        </div>
        <div class="produto-card-body">
          <p class="produto-categoria">${p.categoria}</p>
          <h3>${p.nome}</h3>
          <p>${p.descricao}</p>
          <button
            class="btn-add-carrinho ${noCarrinho ? 'adicionado' : ''}"
            onclick="toggleCarrinho(${p.id})"
            id="btn-${p.id}">
            ${noCarrinho ? '✓ Adicionado' : '+ Adicionar ao Orçamento'}
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// ===== FILTROS =====
function filtrar(categoria, btn) {
  document.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('filtro-btn--ativo'));
  btn.classList.add('filtro-btn--ativo');

  const filtrados = categoria === 'todos'
    ? todosProdutos
    : todosProdutos.filter(p => p.categoria === categoria);

  renderizarProdutos(filtrados);
}

// ===== CARRINHO =====
function toggleCarrinho(id) {
  const produto = todosProdutos.find(p => p.id === id);
  const idx = carrinho.findIndex(c => c.id === id);

  if (idx === -1) {
    carrinho.push(produto);
  } else {
    carrinho.splice(idx, 1);
  }

  salvarCarrinho();
  atualizarBotao(id);
  renderizarCarrinho();
}

function atualizarBotao(id) {
  const btn = document.getElementById(`btn-${id}`);
  if (!btn) return;
  const noCarrinho = carrinho.some(c => c.id === id);
  btn.textContent = noCarrinho ? '✓ Adicionado' : '+ Adicionar ao Orçamento';
  btn.classList.toggle('adicionado', noCarrinho);
}

function renderizarCarrinho() {
  const itensEl = document.getElementById('carrinhoItens');
  const countEl = document.getElementById('carrinhoCount');
  const totalEl = document.getElementById('carrinhoTotalItens');

  countEl.textContent = carrinho.length;
  totalEl.textContent = carrinho.length;

  if (carrinho.length === 0) {
    itensEl.innerHTML = '<p class="carrinho-vazio">Nenhum produto adicionado ainda.</p>';
    return;
  }

  itensEl.innerHTML = carrinho.map(p => `
    <div class="carrinho-item">
      <img src="Imagens/${p.imagem}" alt="${p.nome}"
        onerror="this.src='https://placehold.co/56x56/1a2a2a/2ec4b6?text=IPR'">
      <div class="carrinho-item-info">
        <h4>${p.nome}</h4>
        <p>${p.categoria}</p>
      </div>
      <button class="carrinho-item-remover" onclick="toggleCarrinho(${p.id})">✕</button>
    </div>
  `).join('');
}

function salvarCarrinho() {
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

function abrirCarrinho() {
  document.getElementById('carrinhoDrawer').classList.add('aberto');
  document.getElementById('carrinhoOverlay').classList.add('ativo');
}

function fecharCarrinho() {
  document.getElementById('carrinhoDrawer').classList.remove('aberto');
  document.getElementById('carrinhoOverlay').classList.remove('ativo');
}

// ===== INIT =====
carregarProdutos();
renderizarCarrinho();