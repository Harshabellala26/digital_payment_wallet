const { Account } = require("../models/db");
const mongoose = require("mongoose");

// Get account balance
const balance = async (req, res) => {
  try {
    const account = await Account.findOne({ userId: req.userId });
    if (!account) {
      return res.status(404).json({ msg: "Account not found" });
    }
    // Round the balance to two decimal places
    res.json({ balance: account.balance.toFixed(2) });
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
};

// Transfer funds
const transfer = async (req, res) => {
  const { amount, to } = req.body;

  try {
    // Validate that the transfer amount is positive
    if (amount <= 0) {
      return res.status(400).json({ msg: "Transfer amount must be positive" });
    }

    // Check if sender and recipient are the same
    if (req.userId === to) {
      return res.status(400).json({ msg: "Self-transfer is not allowed" });
    }

    // Sender's account
    const senderAccount = await Account.findOne({ userId: req.userId });
    if (!senderAccount) {
      return res.status(400).json({ msg: "Sender account not found" });
    }

    // Check if sender has sufficient balance
    if (senderAccount.balance < amount) {
      return res.status(400).json({ msg: "Insufficient balance" });
    }

    // Deduct amount from sender's account
    senderAccount.balance -= amount;
    // Round the sender's balance to two decimal places
    senderAccount.balance = senderAccount.balance.toFixed(2);
    await senderAccount.save(); // Save the updated sender account

    // Add amount to recipient's account
    const recipientAccount = await Account.findOne({ userId: to });
    if (!recipientAccount) {
      return res.status(400).json({ msg: "Recipient account not found" });
    }

    recipientAccount.balance += amount;
    // Round the recipient's balance to two decimal places
    recipientAccount.balance = recipientAccount.balance.toFixed(2);
    await recipientAccount.save(); // Save the updated recipient account

    res.status(200).json({ msg: "Transfer successful" });
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
};

// Create a new user and set a default balance of 10000
const createAccount = async (req, res) => {
  const { userId } = req.body;

  try {
    // Check if the user already has an account
    const existingAccount = await Account.findOne({ userId });
    if (existingAccount) {
      return res.status(400).json({ msg: "Account already exists" });
    }

    // Create a new account with default balance of 10000
    const newAccount = new Account({
      userId,
      balance: 10000, // Default balance of 10000
    });

    await newAccount.save(); // Save the new account

    res.status(201).json({ msg: "Account created successfully with default balance" });
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
};

module.exports = { balance, transfer, createAccount };
