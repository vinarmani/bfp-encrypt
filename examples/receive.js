const BfpEncrypt = require('../lib/BfpEncrypt');

const recipientWif = 'L1xkJtaYWBzvs4VnusLqbfKJKDuY2cZ3qB8mePeNWccfcJPHyyGL';
const bfpUri = 'bitcoinfile:2de05ed87120e99dcc1c6606fd156ec4500bc1271aba2a71566e00769e65a85c';

(async function(){

    let bfpEnc = new BfpEncrypt();
    let fileBuf = await bfpEnc.fetchEncryptedData(bfpUri, recipientWif);
    console.log('Decrypted message:', fileBuf.toString('utf-8'));

})();