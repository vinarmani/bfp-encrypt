const BfpEncrypt = require('../lib/BfpEncrypt');

const senderWif = 'L2UzaFZxz6ATgo4zTiNXmR9ioHbtdcyhG89cLdSZGFwdMamDV14u'; // Address = bitcoincash:qpjvzz50gscheeh0fk6mnpr70zrf8lzccu2fu7lr3p
const recipientPublicKey = Buffer.from('02551b0063575007fe4e757f37cda5f03144d207bc19404ea1a37c1f1cceb12a3b', 'hex'); // Address = bitcoincash:qqcrlpjfkjwaep56c42fnlhj3uancz8wsgr36ajq2z
const data = Buffer.from('You can put whatever kind of data or message you want right here as a buffer');
const fileName = 'EncryptedData';
const fileExt = '.txt';

(async function(){

    try {
        let bfpEnc = new BfpEncrypt();
        let bfpUri = await bfpEnc.sendData(data, senderWif, recipientPublicKey, fileName, fileExt);
        console.log('BFP File ID:', bfpUri);
    } catch (e) {
        console.error(e)
    }

})();