require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { PrivateKey, Script, Transaction, Address } = require('bsv'); // Importação corrigida

const bsv = require('bsv');
    console.log("🔍 Testando bsv:", bsv);

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' }));

console.log("🔍 Testando bsv.PrivateKey:", PrivateKey); // Confirma se foi importado corretamente
//5Ju3NoqVEfJAcaY6NkF8Ni63DMScM97Dovc76S5twiLakKFEtWD
//const PRIVATE_KEY = '8E7E3C95E982A7E3064FF9E6E8AB76EF5B589D7BE33A6F69ACFE17C37B69C24A';
const PRIVATE_KEY = '5Ju3NoqVEfJAcaY6NkF8Ni63DMScM97Dovc76S5twiLakKFEtWD';
const PUBLIC_SCRIPT_KEY = '76a914c03c314d889417c569bd106181a78481834922b488ac';

try {
    //const key = new bsv.PrivKey().fromString(PRIVATE_KEY);
    const key = bsv.PrivateKey.fromWIF(PRIVATE_KEY);
    //const key = bsv.PrivKey.fromString(PRIVATE_KEY);
    //const key = new bsv.PrivKey(PRIVATE_KEY);
    //const key = PrivKey.fromHex(PRIVATE_KEY);
    
    console.log("✅ Chave privada carregada com sucesso!");
} catch (error) {
    console.error("❌ Erro ao carregar a chave privada:", error.message);
}

// Função para criar a transação OP_RETURN
const sendToWhatsOnChain = async (pacienteData) => {
    try {
        const key = PrivateKey.fromHex(PRIVATE_KEY);
        const address = key.toAddress().toString();
        console.log("✅ Endereço da carteira:", address);

        // Buscar UTXOs
        const { data: utxos } = await axios.get(`https://api.whatsonchain.com/v1/bsv/main/address/${address}/unspent`);
        if (utxos.length === 0) {
            throw new Error("❌ Sem saldo suficiente na carteira.");
        }

        const utxo = utxos[0]; // Pegamos o primeiro UTXO disponível
        console.log("✅ UTXO selecionado:", utxo);

        const tx = new Transaction()
            .from([{
                txId: utxo.tx_hash,
                outputIndex: utxo.tx_pos,
                script: PUBLIC_SCRIPT_KEY, // Corrigido para usar o script correto
                satoshis: utxo.value,
            }])
            .addOutput(new Transaction.Output({
                script: Script.buildDataOut(JSON.stringify(pacienteData)), // OP_RETURN com os dados
                satoshis: 0, 
            }))
            .change(address) // O troco volta para o remetente
            .sign(key);

        console.log("✅ Transação assinada!");

        // Enviar para WhatsOnChain
        const rawTx = tx.serialize();
        console.log("📤 Enviando transação para WhatsOnChain...");

        const { data: txid } = await axios.post('https://api.whatsonchain.com/v1/bsv/main/tx/raw', { txhex: rawTx });

        console.log("✅ Transação enviada com sucesso! TXID:", txid);
        return txid;
    } catch (error) {
        console.error('❌ Erro ao enviar transação:', error.message);
        throw new Error('Falha ao enviar para WhatsOnChain');
    }
};

// Rota para enviar transação
app.post('/api/enviar-transacao', async (req, res) => {
    try {
        const pacienteData = req.body;
        console.log("📥 Recebendo dados para transação:", pacienteData);

        const txid = await sendToWhatsOnChain(pacienteData);
        res.json({ success: true, txid });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Servidor rodando na porta ${PORT}`);
});
