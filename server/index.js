const express = require("express");
const fs = require('fs')
const app = express();
const cors = require("cors");
const dotenv = require('dotenv')
dotenv.config()

const port = process.env.PORT;

const secp  = require('ethereum-cryptography/secp256k1')
const { toHex } = require('ethereum-cryptography/utils')

app.use(cors());
app.use(express.json());

const balances = JSON.parse(fs.readFileSync("./address.json", 'utf-8'))

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { data, messageHash, sign } = req.body;

  const sender = data.sender
  const amount = data.amount
  setInitialBalance(data.sender);
  setInitialBalance(data.recipient);

  const isValid = isValidTransaction(messageHash,sign,sender)
  if(!isValid) {
    res.status(400).send({message: "Not a valid Sender"})
  }

  // console.log(balances[], amount)
  if (balances[sender] < data.amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[data.recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});
app.use("/", (req, res) => {
  res.send("Nothing Here!");
});
app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

function isValidTransaction(messageHash, sign, sender) {
  const signature = Uint8Array.from(Object.values(sign[0]))
  const recoveryBit = sign[1]
  // console.log(recoveredPublicKey)
  // console.log(recoveryBit)
  const recoveredPublicKey = secp.recoverPublicKey(messageHash, signature, recoveryBit)
  // console.log("hello")
  const isSigned = secp.verify(signature, messageHash, recoveredPublicKey)

  const isValidSender = (sender.slice(2).toString() === toHex(recoveredPublicKey.slice(1).slice(-20)).toString()) ? true:false

  if(isValidSender && isSigned) return true

  return false
}
