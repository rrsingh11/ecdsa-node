import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useState } from "react";

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [privateKey, setPrivatekey] = useState("")

  return (
    <div className="app">
      <Wallet
        balance={balance}
        setBalance={setBalance}
        address={address}
        setAddress={setAddress}
      />
      <Transfer 
        setBalance={setBalance} 
        address={address} 
        privateKey={privateKey}
        setPrivateKey={setPrivatekey}
      />
    </div>
  );
}

export default App;
