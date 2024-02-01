import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [pin, setPin] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const accounts = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(accounts);
    }
  };

  const handleAccount = (accounts) => {
    if (accounts.length > 0) {
      console.log("Account connected: ", accounts[0]);
      setAccount(accounts[0]);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  };

  const getBalance = async () => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  };

  const checkPin = async () => {
    if (atm) {
      try {
        const isValid = await atm.checkPin(pin);
        if (isValid) {
          setSuccessMessage("PIN is correct!");
        } else {
          setErrorMessage("Invalid PIN!");
        }
      } catch (error) {
        setErrorMessage(`Error checking PIN: ${error.message}`);
        console.error("Error checking PIN:", error.message);
      }
    }
  };

  const handlePinChange = (event) => {
    setPin(event.target.value);
  };

  const deposit = async () => {
    if (atm) {
      try {
        let tx = await atm.deposit(50);
        await tx.wait();
        const currentTime = new Date().toLocaleString();
        setSuccessMessage(`Deposit successful! transaction Date & Time: ${currentTime}`);
        getBalance();
      } catch (error) {
        setErrorMessage(`Deposit error: ${error.message}`);
        console.error("Deposit error:", error.message);
      }
    }
  };

  const withdraw = async () => {
    if (atm) {
      try {
        let tx = await atm.withdraw(50);
        await tx.wait();
        const currentTime = new Date().toLocaleString();
        setSuccessMessage(`Withdrawal successful! transaction Date & Time: ${currentTime}`);
        getBalance();
      } catch (error) {
        setErrorMessage(`Withdrawal error: ${error.message}`);
        console.error("Withdrawal error:", error.message);
      }
    }
  };

  const resetBalance = async () => {
    if (atm) {
      try {
        let tx = await atm.resetBalance();
        await tx.wait();
        const currentTime = new Date().toLocaleString();
        setSuccessMessage(`Balance reset successful! transaction Date & Time: ${currentTime}`);
        getBalance();
      } catch (error) {
        setErrorMessage(`Balance reset error: ${error.message}`);
        console.error("Balance reset error:", error.message);
      }
    }
  };

  const initUser = () => {
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>;
    }

    if (!account) {
      return <button onClick={connectAccount}>Please connect your Metamask wallet</button>;
    }

    if (balance === undefined) {
      getBalance();
    }

    return (
      <div>
        <p>Your Account: {account}</p>
        <p>Your Balance: {balance}</p>
        <input type="number" placeholder="Enter PIN" value={pin} onChange={handlePinChange} />
        <button onClick={checkPin}>Check PIN</button>
        <button onClick={deposit}>Deposit 50 ETH</button>
        <button onClick={withdraw}>Withdraw 50 ETH</button>
        <button onClick={resetBalance}>Reset Balance  to 1 </button>
        {successMessage && <p style={{ color: "white" }}>{successMessage}</p>}
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container" style={{ backgroundColor: "purple", color: "white" }}>
      <header>
        <h1>Welcome to the Smart ATM</h1>
        <h2>Account Information</h2>
      </header>
      <div>
        <p><strong>ACC_Holder  Name:</strong> Nagesh K C</p>
        <p><strong>Average Monthly Balance:</strong> 450 ETH</p>
        <p><strong>Previous Month Highest Balance:</strong> 450 ETH</p>
        <p><strong>Previous Month Lowest Balance:</strong> 24 ETH</p>
      </div>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center;
        }
      `}</style>
    </main>
  );
}
