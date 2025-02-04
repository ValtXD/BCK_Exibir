const bsv = require('bsv');

const hexPrivateKey = "8E7E3C95E982A7E3064FF9E6E8AB76EF5B589D7BE33A6F69ACFE17C37B69C24A";

// Criar um objeto PrivKey a partir do hexadecimal
const privKey = new bsv.PrivKey().fromHex(hexPrivateKey);

// Converter para WIF (Wallet Import Format)
const wif = privKey.toWif();

console.log("Chave privada em WIF:", wif);
