// backend/server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./database');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Rota para adicionar paciente
app.post('/api/pacientes', (req, res) => {
  const {
    nome, cpf, dataNascimento, dataConsulta,
    relato, doencasPreexistentes, alergias,
    medicacoes, diagnostico, examesSolicitados,
    anotacoesRetorno
  } = req.body;

  const query = `
    INSERT INTO Pacientes 
    (nome, cpf, dataNascimento, dataConsulta, relato, doencasPreexistentes, 
     alergias, medicacoes, diagnostico, examesSolicitados, anotacoesRetorno)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(query, [
    nome, cpf, dataNascimento, dataConsulta,
    relato, doencasPreexistentes, alergias,
    medicacoes, diagnostico, examesSolicitados,
    anotacoesRetorno
  ], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID });
  });
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
