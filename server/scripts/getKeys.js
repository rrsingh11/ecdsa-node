const { utils, getPublicKey } = require('ethereum-cryptography/secp256k1')
const { toHex } = require('ethereum-cryptography/utils')
const  fs  = require('fs')
const { get } = require('http')

function generateKeys(count) {
    const address = {}
    var privateKey;
    var publicKey;
    var walletAddress

    for(let i=0; i<count; i++){
        privateKey = utils.randomPrivateKey()
        publicKey = getPublicKey(privateKey)
        // Wallet address is the last 20 bytes of the hash of the public key and we remove 1st byte because it  indicates the format of the key
        walletAddress = `0x${toHex(publicKey.slice(1).slice(-20))}`
        address[walletAddress] = Math.floor(Math.random() * 100) + 50
    }

    const keysInfo = {
        PrivateKey: toHex(privateKey),
        PublicKey: toHex(publicKey),
        WalletAddress: walletAddress
    }
    getKeys(keysInfo) //This will give us the private key of the last generated key 
    return address
}
function getKeys(keysInfo) {
    // console.log(keysInfo)
    fs.writeFileSync(
        '../keys.json',
        JSON.stringify(keysInfo),
        'utf-8')
}
async function getAddress(count) {
    fs.writeFileSync(
        '../address.json', 
        JSON.stringify(generateKeys(count)),
        'utf-8')
}
getAddress(3)