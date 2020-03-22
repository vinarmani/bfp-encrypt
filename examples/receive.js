const BfpEncrypt = require('../lib/BfpEncrypt');

const recipientWif = 'KwR6LVssEsTNV238wDCqhAbtvRquNWg8425AkujYDe5pRrMg1LjE'; // Address = bitcoincash:qqcrlpjfkjwaep56c42fnlhj3uancz8wsgr36ajq2z
const bfpUri = 'bitcoinfile:afe0cacba2635eb0696f353f31eabf01232695c092fc24f2da98eaf2ba355b87';

(async function(){

    let bfpEnc = new BfpEncrypt();
    let fileBuf = await bfpEnc.fetchEncryptedData(bfpUri, recipientWif);
    console.log('Decrypted message:', fileBuf.toString('utf-8'));

})();