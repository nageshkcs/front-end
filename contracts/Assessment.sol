// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Assessment {
    address payable public owner;
    uint256 public balance;
    uint256 public pin = 7564; 

    event Deposit(uint256 amount);
    event Withdraw(uint256 amount);
   
    event BalanceReset(uint256 newBalance);

    constructor(uint initBalance) payable {
        owner = payable(msg.sender);
        balance = initBalance;
    }

    function getBalance() public view returns(uint256){
        return balance;
    }

    function checkPin(uint256 _enteredPin) public view returns(bool) {
        require(msg.sender == owner, "Only owner can set PIN");
        return _enteredPin == pin;
    }

    function deposit(uint256 _amount) public payable {
        // perform transaction
        balance += _amount;

        // emit the event
        emit Deposit(_amount);
    }

    

    function resetBalance() public {
        require(msg.sender == owner, "Only owner can reset balance");

        // reset balance to zero
        balance = 1;

        // emit the event
        emit BalanceReset(balance);
    }

    error InsufficientBalance(uint256 balance, uint256 withdrawAmount);

    function withdraw(uint256 _withdrawAmount) public {
        if (balance < _withdrawAmount) {
            revert InsufficientBalance({
                balance: balance,
                withdrawAmount: _withdrawAmount
            });
        }

        // withdraw the given amount
        balance -= _withdrawAmount;

        // emit the event
        emit Withdraw(_withdrawAmount);
    }
}
