const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// ==========================================
// ROTAS DE PRODUTOS
// ==========================================

// Listar todos os produtos
app.get('/produtos', (req, res) => {
  try {
    const produtos = db.prepare('SELECT * FROM produtos').all();
    res.json(produtos);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar produtos.' });
  }
});

// Buscar produto por ID
app.get('/produtos/:id', (req, res) => {
  try {
    const produto = db.prepare('SELECT * FROM produtos WHERE id = ?').get(req.params.id);
    if (!produto) return res.status(404).json({ erro: 'Produto não encontrado.' });
    res.json(produto);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar produto.' });
  }
});

// Criar produto
app.post('/produtos', (req, res) => {
  const { nome, descricao, categoria, imagem, destaque } = req.body;
  if (!nome) return res.status(400).json({ erro: 'Nome é obrigatório.' });

  try {
    const result = db.prepare(`
      INSERT INTO produtos (nome, descricao, categoria, imagem, destaque)
      VALUES (?, ?, ?, ?, ?)
    `).run(nome, descricao || '', categoria || '', imagem || '', destaque ? 1 : 0);

    res.status(201).json({ id: result.lastInsertRowid, mensagem: 'Produto criado com sucesso.' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao criar produto.' });
  }
});

// Editar produto
app.put('/produtos/:id', (req, res) => {
  const { nome, descricao, categoria, imagem, destaque } = req.body;
  if (!nome) return res.status(400).json({ erro: 'Nome é obrigatório.' });

  try {
    const result = db.prepare(`
      UPDATE produtos
      SET nome = ?, descricao = ?, categoria = ?, imagem = ?, destaque = ?
      WHERE id = ?
    `).run(nome, descricao || '', categoria || '', imagem || '', destaque ? 1 : 0, req.params.id);

    if (result.changes === 0) return res.status(404).json({ erro: 'Produto não encontrado.' });
    res.json({ mensagem: 'Produto atualizado com sucesso.' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar produto.' });
  }
});

// Deletar produto
app.delete('/produtos/:id', (req, res) => {
  try {
    const result = db.prepare('DELETE FROM produtos WHERE id = ?').run(req.params.id);
    if (result.changes === 0) return res.status(404).json({ erro: 'Produto não encontrado.' });
    res.json({ mensagem: 'Produto deletado com sucesso.' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao deletar produto.' });
  }
});

// ==========================================
// ROTAS DE ORÇAMENTOS
// ==========================================

// Listar todos os orçamentos
app.get('/orcamentos', (req, res) => {
  try {
    const orcamentos = db.prepare('SELECT * FROM orcamentos ORDER BY id DESC').all();
    res.json(orcamentos);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar orçamentos.' });
  }
});

// Criar orçamento
app.post('/orcamentos', (req, res) => {
  const { nome, empresa, email, telefone, mensagem, produtos } = req.body;
  if (!nome || !email) return res.status(400).json({ erro: 'Nome e e-mail são obrigatórios.' });

  try {
    const result = db.prepare(`
      INSERT INTO orcamentos (nome, empresa, email, telefone, mensagem, produtos)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      nome,
      empresa || '',
      email,
      telefone || '',
      mensagem || '',
      JSON.stringify(produtos || [])
    );

    res.status(201).json({ id: result.lastInsertRowid, mensagem: 'Orçamento enviado com sucesso!' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao salvar orçamento.' });
  }
});

// Atualizar status do orçamento
app.put('/orcamentos/:id/status', (req, res) => {
  const { status } = req.body;
  const statusValidos = ['pendente', 'em andamento', 'concluido', 'cancelado'];
  if (!statusValidos.includes(status)) return res.status(400).json({ erro: 'Status inválido.' });

  try {
    const result = db.prepare('UPDATE orcamentos SET status = ? WHERE id = ?')
      .run(status, req.params.id);
    if (result.changes === 0) return res.status(404).json({ erro: 'Orçamento não encontrado.' });
    res.json({ mensagem: 'Status atualizado com sucesso.' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar status.' });
  }
});

// Deletar orçamento
app.delete('/orcamentos/:id', (req, res) => {
  try {
    const result = db.prepare('DELETE FROM orcamentos WHERE id = ?').run(req.params.id);
    if (result.changes === 0) return res.status(404).json({ erro: 'Orçamento não encontrado.' });
    res.json({ mensagem: 'Orçamento deletado com sucesso.' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao deletar orçamento.' });
  }
});

// ==========================================
// INICIAR SERVIDOR
// ==========================================
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});