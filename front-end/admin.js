const API = 'http://localhost:3000';

// ===== ABAS =====
function mostrarAba(aba, btn) {
  document.getElementById('aba-produtos').style.display = aba === 'produtos' ? 'block' : 'none';
  document.getElementById('aba-orcamentos').style.display = aba === 'orcamentos' ? 'block' : 'none';
  document.querySelectorAll('.admin-menu-btn').forEach(b => b.classList.remove('admin-menu-btn--ativo'));
  btn.classList.add('admin-menu-btn--ativo');
  if (aba === 'produtos') carregarProdutos();
  if (aba === 'orcamentos') carregarOrcamentos();
}

// ===== PRODUTOS =====
async function carregarProdutos() {
  try {
    const res = await fetch(`${API}/produtos`);
    const produtos = await res.json();
    const tbody = document.getElementById('tabelaProdutos');
    if (produtos.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="admin-loading">Nenhum produto cadastrado.</td></tr>';
      return;
    }
    tbody.innerHTML = produtos.map(p => `
      <tr>
        <td>#${p.id}</td>
        <td><img src="Imagens/${p.imagem}" alt="${p.nome}"
          onerror="this.src='https://placehold.co/44x44/1a2a2a/2ec4b6?text=IPR'"></td>
        <td><strong>${p.nome}</strong><br><small style="color:#888">${p.descricao.substring(0,60)}...</small></td>
        <td>${p.categoria}</td>
        <td><span class="badge ${p.destaque ? 'badge--sim' : 'badge--nao'}">${p.destaque ? 'Sim' : 'Não'}</span></td>
        <td>
          <div class="admin-acoes">
            <button class="btn-editar" onclick="editarProduto(${p.id})">✏️ Editar</button>
            <button class="btn-deletar" onclick="deletarProduto(${p.id})">🗑️ Deletar</button>
          </div>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    document.getElementById('tabelaProdutos').innerHTML =
      '<tr><td colspan="6" class="admin-loading">Erro ao carregar. Verifique o servidor.</td></tr>';
  }
}

async function editarProduto(id) {
  const res = await fetch(`${API}/produtos/${id}`);
  const p = await res.json();
  document.getElementById('produtoId').value = p.id;
  document.getElementById('produtoNome').value = p.nome;
  document.getElementById('produtoCategoria').value = p.categoria;
  document.getElementById('produtoImagem').value = p.imagem;
  document.getElementById('produtoDescricao').value = p.descricao;
  document.getElementById('produtoDestaque').checked = p.destaque === 1;
  document.getElementById('modalTitulo').textContent = 'Editar Produto';
  abrirModal();
}

async function deletarProduto(id) {
  if (!confirm('Tem certeza que deseja deletar este produto?')) return;
  try {
    await fetch(`${API}/produtos/${id}`, { method: 'DELETE' });
    mostrarMsg('msgProduto', '✅ Produto deletado com sucesso!', 'ok');
    carregarProdutos();
  } catch (err) {
    mostrarMsg('msgProduto', '❌ Erro ao deletar produto.', 'erro');
  }
}

async function salvarProduto() {
  const id = document.getElementById('produtoId').value;
  const dados = {
    nome: document.getElementById('produtoNome').value.trim(),
    categoria: document.getElementById('produtoCategoria').value,
    imagem: document.getElementById('produtoImagem').value.trim(),
    descricao: document.getElementById('produtoDescricao').value.trim(),
    destaque: document.getElementById('produtoDestaque').checked
  };

  if (!dados.nome) { alert('Nome é obrigatório!'); return; }

  const url = id ? `${API}/produtos/${id}` : `${API}/produtos`;
  const method = id ? 'PUT' : 'POST';

  try {
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });
    fecharModal();
    mostrarMsg('msgProduto', `✅ Produto ${id ? 'atualizado' : 'criado'} com sucesso!`, 'ok');
    carregarProdutos();
  } catch (err) {
    mostrarMsg('msgProduto', '❌ Erro ao salvar produto.', 'erro');
  }
}

// ===== ORÇAMENTOS =====
async function carregarOrcamentos() {
  try {
    const res = await fetch(`${API}/orcamentos`);
    const orcamentos = await res.json();
    const tbody = document.getElementById('tabelaOrcamentos');
    if (orcamentos.length === 0) {
      tbody.innerHTML = '<tr><td colspan="9" class="admin-loading">Nenhum orçamento recebido ainda.</td></tr>';
      return;
    }
    tbody.innerHTML = orcamentos.map(o => {
      const produtos = JSON.parse(o.produtos || '[]');
      const badgeClass = {
        'pendente': 'badge--pendente',
        'em andamento': 'badge--andamento',
        'concluido': 'badge--concluido',
        'cancelado': 'badge--cancelado'
      }[o.status] || 'badge--pendente';

      return `
        <tr>
          <td>#${o.id}</td>
          <td><strong>${o.nome}</strong></td>
          <td>${o.empresa || '—'}</td>
          <td>${o.email}</td>
          <td>${o.telefone || '—'}</td>
          <td>${produtos.map(p => p.nome).join(', ') || '—'}</td>
          <td>${o.data}</td>
          <td><span class="badge ${badgeClass}">${o.status}</span></td>
          <td>
            <div class="admin-acoes">
              <select class="select-status" onchange="atualizarStatus(${o.id}, this.value)">
                <option ${o.status === 'pendente' ? 'selected' : ''}>pendente</option>
                <option ${o.status === 'em andamento' ? 'selected' : ''}>em andamento</option>
                <option ${o.status === 'concluido' ? 'selected' : ''}>concluido</option>
                <option ${o.status === 'cancelado' ? 'selected' : ''}>cancelado</option>
              </select>
              <button class="btn-deletar" onclick="deletarOrcamento(${o.id})">🗑️</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  } catch (err) {
    document.getElementById('tabelaOrcamentos').innerHTML =
      '<tr><td colspan="9" class="admin-loading">Erro ao carregar. Verifique o servidor.</td></tr>';
  }
}

async function atualizarStatus(id, status) {
  try {
    await fetch(`${API}/orcamentos/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    mostrarMsg('msgOrcamento', '✅ Status atualizado!', 'ok');
    carregarOrcamentos();
  } catch (err) {
    mostrarMsg('msgOrcamento', '❌ Erro ao atualizar status.', 'erro');
  }
}

async function deletarOrcamento(id) {
  if (!confirm('Deletar este orçamento?')) return;
  try {
    await fetch(`${API}/orcamentos/${id}`, { method: 'DELETE' });
    mostrarMsg('msgOrcamento', '✅ Orçamento deletado!', 'ok');
    carregarOrcamentos();
  } catch (err) {
    mostrarMsg('msgOrcamento', '❌ Erro ao deletar.', 'erro');
  }
}

// ===== MODAL =====
function abrirModal() {
  document.getElementById('modalOverlay').classList.add('ativo');
  document.getElementById('modalProduto').classList.add('aberto');
}

function fecharModal() {
  document.getElementById('modalOverlay').classList.remove('ativo');
  document.getElementById('modalProduto').classList.remove('aberto');
  document.getElementById('produtoId').value = '';
  document.getElementById('produtoNome').value = '';
  document.getElementById('produtoImagem').value = '';
  document.getElementById('produtoDescricao').value = '';
  document.getElementById('produtoDestaque').checked = false;
  document.getElementById('modalTitulo').textContent = 'Novo Produto';
}

// ===== UTILITÁRIOS =====
function mostrarMsg(id, texto, tipo) {
  const el = document.getElementById(id);
  el.textContent = texto;
  el.className = `admin-msg admin-msg--${tipo}`;
  el.style.display = 'block';
  setTimeout(() => el.style.display = 'none', 4000);
}

// ===== INIT =====
carregarProdutos();