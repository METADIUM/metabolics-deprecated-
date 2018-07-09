require('babel-register')
var LedgerWalletProvider = require("truffle-ledger-provider");
var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "emotion produce play museum brown element miracle cart gift blossom arrow vivid";
var privatekey = "5d257ed6b8160c69bc404b9de8cfa5ca80f2e7997947974ad43d6f2bf6e0f0ef"
var ledgerOptions = {
  networkId: 3, // 1 mainnet, 3 ropsten
  path: "44'/60'/0'/0", // ledger default derivation path
  askConfirm: false,
  accountsLength: 1,
  accountsOffset: 0
};


module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*", // Match any network id
      gas:6000000
    },
    
    ropsten: {
      provider: new LedgerWalletProvider(ledgerOptions, "https://ropsten.infura.io/tYiHo1HlBMB7IeA6AM7f"),
      network_id: 3,
      gas: 4600000,
      gasPrice:40000000000
    }
    ,
    mainnet: {
      provider: new LedgerWalletProvider(ledgerOptions, "https://mainnet.infura.io/tYiHo1HlBMB7IeA6AM7f"),
      network_id: 3,
      gas: 4600000,
      gasPrice:4000000000
    },
    metadium: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "http://13.125.247.228:8545");
      },
      network_id: '127',
    }
  }
    
  /*
  solc: {
      optimizer: {
        enabled: true,
        runs: 200
      }
  }
  */
};
