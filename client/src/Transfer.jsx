import { useState } from "react";
import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1"
import { keccak256 } from "ethereum-cryptography/keccak"
import { toHex, utf8ToBytes } from "ethereum-cryptography/utils"


function Transfer({ address, setBalance, privateKey, setPrivateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);
  
  async function transfer(evt) {
    evt.preventDefault();

// My code here
    const data = {
      sender: address,
      amount: parseInt(sendAmount),
      recipient,
    }

    // console.log(privateKey)
    const messageHash = toHex(keccak256(utf8ToBytes(JSON.stringify(data))))
    // console.log(messageHash)
  
    const sign = await secp.sign(messageHash, privateKey, { recovered: Boolean = true})

    
//--------------------------------------------
    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        data,
        messageHash,
        sign,
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      
      <label>
        Private Key*
        <input
          placeholder="Relax! we won't save it"
          type="password"
          value={privateKey}
          onChange={setValue(setPrivateKey)}
          required
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
