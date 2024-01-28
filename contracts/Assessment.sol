// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

//import "hardhat/console.sol";

contract Assessment {
    address payable public owner;
    uint256 public balance;

    event Deposit(uint256 amount);
    event Withdraw(uint256 amount);
    event ReceiptGenerated(address indexed recipient, uint256 amount);
    event RewardDistributed(address indexed recipient, uint256 amount);
    event RewardReplenished(uint256 amount);

    constructor(uint initBalance) payable {
        owner = payable(msg.sender);
        balance = initBalance;
    }

    function getBalance() public view returns(uint256) {
        return balance;
    }

    function deposit(uint256 _amount) public payable {
        uint _previousBalance = balance;
        require(msg.sender == owner, "You are not the owner of this account");
        balance += _amount;
        assert(balance == _previousBalance + _amount);
        emit Deposit(_amount);
    }

    error InsufficientBalance(uint256 balance, uint256 withdrawAmount);

    function withdraw(uint256 _withdrawAmount) public {
        require(msg.sender == owner, "You are not the owner of this account");
        uint _previousBalance = balance;
        if (balance < _withdrawAmount) {
            revert InsufficientBalance({
                balance: balance,
                withdrawAmount: _withdrawAmount
            });
        }
        balance -= _withdrawAmount;
        assert(balance == (_previousBalance - _withdrawAmount));
        emit Withdraw(_withdrawAmount);
    }

    function generateReceipt(address _recipient, uint256 _amount) public {
        require(msg.sender == owner, "You are not authorized to generate receipts");
        emit ReceiptGenerated(_recipient, _amount);
    }

    function distributeReward(address _recipient, uint256 _amount) public {
        require(msg.sender == owner, "You are not authorized to distribute rewards");
        balance -= _amount;
        emit RewardDistributed(_recipient, _amount);
    }

    function replenishReward(uint256 _amount) public payable {
        require(msg.sender == owner, "You are not authorized to replenish rewards");
        balance += _amount;
        emit RewardReplenished(_amount);
    }
}
