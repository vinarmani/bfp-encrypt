const BfpEncrypt = require('../lib/BfpEncrypt');

const recipientWif = 'L1xkJtaYWBzvs4VnusLqbfKJKDuY2cZ3qB8mePeNWccfcJPHyyGL';
const bfpUri = 'bitcoinfile:1a26ed85244943308e3bc4415f09ee7618eb2af852faa941b172cb03511b03bc';

(async function(){

    let bfpEnc = new BfpEncrypt();
    let fileBuf = await bfpEnc.fetchEncryptedData(bfpUri, recipientWif);
    console.log('Decrypted message:', fileBuf.toString('utf-8'));

})();