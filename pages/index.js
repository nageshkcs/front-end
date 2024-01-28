import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState({
    accountOwnerName: "Nagesh K C",
    nomineeName1: "Mahesh",
    nomineeName2: "Manjula",
    balance: 0,
    transactionAmount: 0,
    ifscCode: "",
    branchCode: "",
  });

  const [transactionHistory, setTransactionHistory] = useState([]);
  const [depositAmount, setDepositAmount] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState(0);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const accounts = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(accounts[0]);
    }
  };

  const handleAccount = (account) => {
    if (account) {
      console.log("Account connected: ", account);
      setAccount(account);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({
      method: "eth_requestAccounts",
    });
    handleAccount(accounts[0]);

    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(
      contractAddress,
      atmABI,
      signer
    );

    setATM(atmContract);
  };

  const getBalance = async () => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  };

  const deposit = async () => {
    if (atm) {
      if (depositAmount <= 0) {
        alert("Please enter a valid deposit amount.");
        return;
      }
      let tx = await atm.deposit(depositAmount);
      await tx.wait();
      getBalance();
      showTransactionReceipt("Deposit", depositAmount);
    }
  };

  const withdraw = async () => {
    if (atm) {
      if (withdrawAmount <= 0) {
        alert("Please enter a valid withdrawal amount.");
        return;
      }
      let tx = await atm.withdraw(withdrawAmount);
      await tx.wait();
      getBalance();
      showTransactionReceipt("Withdrawal", withdrawAmount);
    }
  };

  const showTransactionReceipt = (type, amount) => {
    const now = new Date();

    const newReceipt = {
      accountOwnerName: "Nagesh K C",
      nomineeName1: "Mahesh",
      nomineeName2: "Manjula",
      balance: balance,
      transactionAmount: amount,
      ifscCode: "ABC123456",
      branchCode: "XYZ789",
    };

    setReceiptData(newReceipt);
    setShowReceipt(true);

    setTransactionHistory((prevHistory) => [newReceipt, ...prevHistory]);
  };

  const hideReceipt = () => {
    setShowReceipt(false);
  };

  const renderReceipt = () => {
    return (
      <div className="receipt" style={{ backgroundColor: 'green', padding: '20px', borderRadius: '8px' }}>
        <h2>Receipt</h2>
        <p>Account Owner Name: {receiptData.accountOwnerName}</p>
        <p>Nominee Name 1: {receiptData.nomineeName1}</p>
        <p>Nominee Name 2: {receiptData.nomineeName2}</p>
        <p>Balance: {receiptData.balance} ETH</p>
        <p>Transaction Amount: {receiptData.transactionAmount} ETH</p>
        <p>IFSC Code: {receiptData.ifscCode}</p>
        <p>Branch Code: {receiptData.branchCode}</p>
      </div>
    );
  };

  const initUser = () => {
    if (!ethWallet) {
      return (
        <p>Please install Metamask in order to use this ATM.</p>
      );
    }

    if (!account) {
      return (
        <button onClick={connectAccount}>
          Please connect your Metamask wallet
        </button>
      );
    }

    if (balance === undefined) {
      getBalance();
    }

    return (
      <div>
        <p>Your Account: {account}</p>
        <p>Your Balance: {balance} ETH</p>
        <input type="number" placeholder="Amount to deposit" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} />
        <button onClick={deposit} style={{ background: 'orange', color: 'white' }}>
          Confirm Deposit
        </button>
        <br />
        <input type="number" placeholder="Amount to withdraw" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} />
        <button onClick={withdraw} style={{ background: 'orange', color: 'white' }}>
          Confirm Withdraw
        </button>
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container" style={{ backgroundColor: 'orange' }}>
      <header>
        <h1>Explore the next Gen ATM</h1>
      </header>
      {initUser()}
      {showReceipt && (
        <div className="modal">
          <div className="modal-content">
            {renderReceipt()}
            <button onClick={hideReceipt}>Close Receipt</button>
          </div>
        </div>
      )}
      <style jsx>{`
        .container {
          text-align: center;
        }

        .modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .modal-content {
          background: white;
          padding: 20px;
          border-radius: 8px;
        }

        .receipt {
          text-align: left;
        }
      `}</style>
    </main>
  );
}
