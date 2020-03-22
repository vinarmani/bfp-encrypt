const BITBOXSDK = require('bitbox-sdk')
const bitbox = new BITBOXSDK.BITBOX({ restURL: 'https://rest.bitcoin.com/v2/' });
const Bfp = require('bitcoinfiles-node').bfp
const eccryptoJS = require('eccrypto-js')
const wif = require('wif')

class BfpEncrypt {
    constructor(bfp, network) {
        this.bfp = bfp || new Bfp(bitbox, 'mainnet', 'https://bchd.jeton.tech:8335');
        this.network = network || this.bfp.network;
    }

    async sendData(dataBuffer, senderWif, recipientPublicKey, fileName, fileExt) {
        // Encrypt with eccrypto-js
        const structuredEj = await eccryptoJS.encrypt(recipientPublicKey, dataBuffer)
        let encryptedEj = Buffer.concat([structuredEj.ephemPublicKey, structuredEj.iv, structuredEj.ciphertext, structuredEj.mac])

        // 1 - Use the encrypted data
        fileExt = `${fileExt}.enc`;
        const fileSize = encryptedEj.length
        const fileSha256Hex = bitbox.Crypto.sha256(encryptedEj).toString('hex');

        // 2 - estimate upload cost for funding the transaction
        let config = {
            msgType: 1,
            chunkCount: 1,
            fileName: fileName,
            fileExt: fileExt,
            fileSize: fileSize,
            fileSha256Hex: fileSha256Hex,
            prevFileSha256Hex: null,
            fileUri: null,
            chunkData: null  // chunk not needed for cost estimate stage
        };
        let uploadCost = Bfp.calculateFileUploadCost(fileSize, config);
        console.log('upload cost: ', uploadCost);

        // 3 - create a funding transaction
        let fundingWif = senderWif
        let ecpair = bitbox.ECPair.fromWIF(fundingWif)
        let fundingAddress = bitbox.ECPair.toCashAddress(ecpair)

        let recipientPubKeyBuf = Buffer.from(recipientPublicKey, 'hex')
        let recipientEcpair = bitbox.ECPair.fromPublicKey(recipientPubKeyBuf)
        let recipientAddress = bitbox.ECPair.toCashAddress(recipientEcpair)

        // 4 - Make sure address above is funded with the amount equal to the uploadCost
        let fundingUtxo;
        try {
            fundingUtxo = await this.network.getLastUtxoWithRetry(fundingAddress);
        } catch(e) {
            console.error(e)
            throw new Error('Cannot fetch UTXO from address: ' + fundingAddress)
        }

        if(fundingUtxo.utxos && fundingUtxo.utxos.length == 0)
            throw new Error('There are no UTXOs available in address: '  + fundingAddress)

        console.log('got funding Utxo.')
        
        if(fundingUtxo.satoshis < uploadCost)
            throw new Error('The most recent UTXO in '  + fundingAddress + ' has inadequate funds. Minimum satoshis must be '+ uploadCost)

        // wait for network to resolve...

        // 5 - upload the file
        let fileId = await this.bfp.uploadFile(fundingUtxo, fundingAddress, fundingWif, encryptedEj, fileName, fileExt, null,null,recipientAddress,null,null,null,null);
        return fileId
    }

    async fetchEncryptedData(bfpURI, recipientWif) {
        // 1 - download file using URI
        let result = await this.bfp.downloadFile(bfpURI);
        console.log("download complete.");

        // 2 - result includes a boolean check telling you if the file's sha256 matches the file's metadata```
        if(result.passesHashCheck){
            console.log("Success: downloaded file sha256 matches file's metadata");
        }

        // 3 - do something with the file...
        let encryptedBuffer = result.fileBuf;

        // console.log(encryptedBuffer)

        try {
            let encStruct = BfpEncrypt.convertToEncryptStruct(encryptedBuffer)
            let privKeyBuf = wif.decode(recipientWif).privateKey
            let fileBuf = await eccryptoJS.decrypt(privKeyBuf, encStruct)
            return fileBuf
        } catch (e) {
            console.error(e)
            throw new Error('Error trying to decrypt this data')
        }
    }

    static convertToEncryptStruct(encbuf) {
        let offset = 0;
        let tagLength = 32;
        let pub;
        switch(encbuf[0]) {
          case 4:
            pub = encbuf.slice(0, 65);
            break;
          case 3:
          case 2:
            pub = encbuf.slice(0, 33);
            break;
          default:
            throw new Error('Invalid type: ' + encbuf[0]);
        }
          offset += pub.length;
      
        let c = encbuf.slice(offset, encbuf.length - tagLength);
        let ivbuf = c.slice(0, 128 / 8);
        let ctbuf = c.slice(128 / 8);
      
        let d = encbuf.slice(encbuf.length - tagLength, encbuf.length);
    
        return {
            iv: ivbuf,
            ephemPublicKey: pub,
            ciphertext: ctbuf,
            mac: d
        }
    }

}

module.exports = BfpEncrypt;
