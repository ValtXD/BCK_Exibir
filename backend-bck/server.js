require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const bsv = require('bsv');

const app = express();
const PORT = 3001;

app.use(bodyParser.json());

const PRIVATE_KEY = '8E7E3C95E982A7E3064FF9E6E8AB76EF5B589D7BE33A6F69ACFE17C37B69C24A';

console.log("Servidor iniciando...");

// Função para criar a transação OP_RETURN
const sendToWhatsOnChain = async (pacienteData) => {
    try {
        const key = bsv.PrivateKey.fromHex(PRIVATE_KEY);
        const address = key.toAddress().toString();
        
        // Buscar UTXOs para essa carteira
        const { data: utxos } = await axios.get(`https://api.whatsonchain.com/v1/bsv/main/address/${address}/unspent`);

        if (utxos.length === 0) {
            throw new Error("Sem saldo suficiente na carteira.");
        }

        const utxo = utxos[0]; // Pegamos o primeiro UTXO disponível
        const tx = new bsv.Transaction()
            .from({
                txId: utxo.tx_hash,
                outputIndex: utxo.tx_pos,
                script: bsv.Script.buildPublicKeyHashOut(address).toHex(),
                satoshis: utxo.value,
            })
            .addOutput(new bsv.Transaction.Output({
                script: bsv.Script.buildDataOut(JSON.stringify(pacienteData)), // OP_RETURN com os dados
                satoshis: 0, 
            }))
            .change(address) // Troco volta para o remetente
            .sign(key);

        // Enviar para WhatsOnChain
        const rawTx = tx.serialize();
        const { data: txid } = await axios.post('https://api.whatsonchain.com/v1/bsv/main/tx/raw', { txhex: rawTx });

        return txid;
    } catch (error) {
        console.error('Erro ao enviar transação:', error.message);
        throw new Error('Falha ao enviar para WhatsOnChain');
    }
};

// Rota para receber os dados e enviar para WhatsOnChain
app.post('/api/pacientes', async (req, res) => {
    try {
        const pacienteData = req.body;
        const txid = await sendToWhatsOnChain(pacienteData);
        res.json({ success: true, txid });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.use((req, res, next) => {
    console.log(`📢 Requisição recebida: ${req.method} ${req.url}`);
    next();
});

app.use((err, req, res, next) => {
    console.error(`❌ Erro no backend: ${err.message}`);
    res.status(500).send('Erro interno no servidor');
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
