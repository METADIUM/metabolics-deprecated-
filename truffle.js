require('babel-register')
require('dotenv').config()

var HDWalletProvider = require("truffle-hdwallet-provider");

var mnemonic = ""; // put your mnemonic for deploy

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*", // Match any network id
      gas:6000000
    },
    ropsten: {
      network_id: 3,
      gas: 4600000,
      gasPrice:40000000000
    },
    metadium: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "http://13.125.247.228:8545");
      },
      network_id: '127',
    }
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
}

if (typeof(fs) == "undefined")
    fs = require('fs')
if (fs.existsSync('./truffle.local.js')) {
  eval(fs.readFileSync('./truffle.local.js')+'')
}

// EOF
