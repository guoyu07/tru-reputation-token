"use strict";
require('babel-register');
require('babel-polyfill');

var fs = require("fs"),
    HDWalletProvider = require("truffle-hdwallet-provider"),
    infuraRinkeby = "https://rinkeby.infura.io/",
    infuraMainNet = "https://mainnet.infura.io/",
    infuraRopsten = "https://ropsten.infura.io/",
    rinkebyMnemonicFile = "./secret/rinkeby.mnemonic",
    mainNetMnemonicFile = "./secret/mainnet.mnemonic",
    ropstenMnemonicFile = "./secret/ropsten.mnemonic",
    rinkebyTokenFile = "./secret/rinkeby.infuratoken",
    mainNetTokenFile = "./secret/mainnet.infuratoken",
    ropstenTokenFile = "./secret/ropsten.infuratoken",
    rinkebyMnemonic,
    rinkebyToken,
    mainNetMnemonic,
    mainNetToken,
    ropstenMnemonic,
    ropstenToken,
    rinkebyUrl,
    ropstenUrl,
    mainNetUrl;

// Setup Rinkeby Variables
if (fs.existsSync(rinkebyMnemonicFile)) {
  rinkebyMnemonic = fs.readFileSync(rinkebyMnemonicFile, "utf8");
}
if (fs.existsSync(rinkebyTokenFile)) {
  rinkebyToken = fs.readFileSync(rinkebyTokenFile, "utf8");
  if (rinkebyToken != null) {
    rinkebyUrl = infuraRinkeby + rinkebyToken;
  }
}

// Setup Ropsten Variables
if (fs.existsSync(ropstenMnemonicFile)) {
  ropstenMnemonic = fs.readFileSync(ropstenMnemonicFile, "utf8");
}
if (fs.existsSync(ropstenTokenFile)) {
  ropstenToken = fs.readFileSync(ropstenTokenFile, "utf8");
  if (ropstenToken != null) {
    ropstenUrl = infuraRopsten + ropstenToken;
  }
}


// Setup MainNet Variables
if (fs.existsSync(rinkebyMnemonicFile)) {
  mainNetMnemonic = fs.readFileSync(rinkebyMnemonicFile, "utf8");
}
if (fs.existsSync(mainNetTokenFile)) {
  mainNetToken = fs.readFileSync(mainNetTokenFile, "utf8");
  if (mainNetToken != null) {
    mainNetUrl = infuraMainNet + mainNetToken;
  }
}

module.exports = {
  mocha: {
    enableTimeouts: false,
    useColors: true
  },
  networks: {
    testnet: {
      host: 'localhost',
      port: 8546,
      network_id: '1064', // Match any network id
      gasPrice: 20e9,
      gas: 0xfffffff,
      before_timeout: 3600000,
      test_timeout: 3600000
    },
    devnet: {
      host: 'tru-devnet',
      gas: 4712388,
      port: 8547,
      network_id: '1066', // Tru Reputation Token Development Network ID is 1066
      before_timeout: 3600000,
      test_timeout: 3600000
    },
    ganache: {
      host: 'localhost',
      gas: 4712388, // Default MainNet Gas Limit
      port: 8548, // Tru Reputation Token Test Ganache Port Number is 8548
      network_id: '1067', // Tru Reputation Token Test Ganache Network ID is 1067
      before_timeout: 3600000,
      test_timeout: 3600000
    },
    rinkeby: {
      provider: function() {
        return new HDWalletProvider(rinkebyMnemonic, rinkebyUrl);
      },
      network_id: 4  // Network ID for Rinkeby is 4
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(ropstenMnemonic, ropstenUrl);
      },
      network_id: 3  // Network ID for Ropsten is 3
    },
    coverage: {
      host: 'localhost',
      network_id: '1065',
      port: 8556,
      gasPrice: 20e9,
      gas: 0xfffffff,
      before_timeout: 3600000,
      test_timeout: 3600000
    }
  }
};