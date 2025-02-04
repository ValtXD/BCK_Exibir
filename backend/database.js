// backend/database.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS Pacientes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT,
      cpf TEXT,
      dataNascimento TEXT,
      dataConsulta TEXT,
      relato TEXT,
      doencasPreexistentes TEXT,
      alergias TEXT,
      medicacoes TEXT,
      diagnostico TEXT,
      examesSolicitados TEXT,
      anotacoesRetorno TEXT
    )
  `);
});

module.exports = db;
