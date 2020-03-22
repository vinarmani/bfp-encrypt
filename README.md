# bfp-encrypt
Javascript library to encrypt and decrypt data and write that data to the Bitcoin Cash blockchain using the [Bitcoin Files Protocol (BFP)](https://github.com/simpleledger/slp-specification/blob/master/bitcoinfiles.md).

Uses [Elliptic Curve Integrated Encryption Scheme (ECIES)](https://cryptobook.nakov.com/asymmetric-key-ciphers/ecies-public-key-encryption) and is compatible with the following Javascript libraries:
* [eccrypto](https://github.com/bitchan/eccrypto)
* [eccrypto-js](https://github.com/pedrouid/eccrypto-js)
* [bitcore-ecies (Jeton fork)](https://github.com/jeton-tech/bitcore-ecies)

# Installation

#### For node.js
`npm install bfp-encrypt`

# Example Data / Message Send
Below is an example of sending a text message from one address (sender WIF) to the P2PKH address associated with the recipient's public key. It uses the most recent UTXO in the sender's address and, if the UTXO amount is inadequate, will give an error saying the minimum satoshis necessary to send the data.
```javascript
const BfpEncrypt = require('bfp-encrypt');

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
```

# Example Data / Message Receive
Below is an example of downloading and decrypting a text message sent to the recipient's address

```javascript
const BfpEncrypt = require('bfp-encrypt');

const recipientWif = 'KwR6LVssEsTNV238wDCqhAbtvRquNWg8425AkujYDe5pRrMg1LjE'; // Address = bitcoincash:qqcrlpjfkjwaep56c42fnlhj3uancz8wsgr36ajq2z
const bfpUri = 'bitcoinfile:afe0cacba2635eb0696f353f31eabf01232695c092fc24f2da98eaf2ba355b87';

(async function(){

    let bfpEnc = new BfpEncrypt();
    let fileBuf = await bfpEnc.fetchEncryptedData(bfpUri, recipientWif);
    console.log('Decrypted message:', fileBuf.toString('utf-8'));

})();

```
