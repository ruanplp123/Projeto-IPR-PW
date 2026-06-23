const Database = require('better-sqlite3');
const db = new Database('database.db');

// Vou colocar isso aqui só pra criar as tabelas caso n existam
db.exec(`
  CREATE TABLE IF NOT EXISTS produtos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    descricao TEXT,
    categoria TEXT,
    imagem TEXT,
    destaque INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS orcamentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    empresa TEXT,
    email TEXT NOT NULL,
    telefone TEXT,
    mensagem TEXT,
    produtos TEXT,
    data TEXT DEFAULT (datetime('now', 'localtime')),
    status TEXT DEFAULT 'pendente'
  );
`);

// Insere produtos iniciais se a tabela estiver vazia
const total = db.prepare('SELECT COUNT(*) as count FROM produtos').get();
if (total.count === 0) {
  const insert = db.prepare(`
    INSERT INTO produtos (nome, descricao, categoria, imagem, destaque)
    VALUES (?, ?, ?, ?, ?)
  `);

  insert.run('Perfis Pultrudados', 'Perfis estruturais de alta performance em fibra de vidro para diversas aplicações industriais.', 'Pultrusão', 'perfispultrudados.png', 1);
  insert.run('Moldados BMC', 'Peças técnicas moldadas com alta precisão e resistência para componentes elétricos.', 'BMC', 'moldadosbmc.png', 1);
  insert.run('Laminados Epóxi', 'Chapas e laminados para isolamento elétrico e térmico de alta durabilidade.', 'Laminados', 'laminadosepoxi.png', 1);
  insert.run('Laminados Poliéster', 'Laminados em poliéster com excelente resistência química e mecânica.', 'Laminados', 'laminadospoliester.png', 0);
}

module.exports = db;