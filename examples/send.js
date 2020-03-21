const BfpEncrypt = require('../lib/BfpEncrypt');

const senderWif = 'Kzydc5SSZRzR9u91smKx4SPqNxKk9PTx6Ff2YP8gB17yMvrKK5U8'; // Address = bitcoincash:qqmyyxv06tp2gzm59wv3wc04saqd49rxaqpdts4zvm
const recipientPublicKey = Buffer.from('0392102c24297553870016313008f5392b84e6f57533058f99e4ce073fa2b80925', 'hex');
const data = Buffer.from('You can put whatever kind of data or message you want right here as a buffer');
const fileName = 'EncryptedData';
const fileExt = '.txt';

(async function(){

    try {
        let bfpEnc = new BfpEncrypt();
        let fileId = await bfpEnc.sendData(data, senderWif, recipientPublicKey, fileName, fileExt);
        console.log('fileId:', fileId);
    } catch (e) {
        console.error(e)
    }

})();