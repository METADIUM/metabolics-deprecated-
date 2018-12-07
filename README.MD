![meta logo](./misc/Metadium_Logo_Vertical_PNG.png)
# Metadium System Smart Contract - Deprecated
[![Generic badge](https://img.shields.io/badge/build-passing-green.svg)](https://shields.io/)    [![Generic badge](https://img.shields.io/badge/licence-MIT-blue.svg)](https://shields.io/)

This is pre-alpha concept smart contract of Metadium.

Metadium Identity Manager create MetaID with the merkle root of the user data.

Metadium Smart Contracts consist of followings:
* Metadium Name Service
* Metadium Identity Manager
* MetaID(ERC721)
* MetaRecoveery(ERC721)
* Permission


## Deploy
to meta network
```
$ truffle migrate all
```

## Test
Install truffle

```
$ npm install -g truffle

```

Install ganache-cli

```
$ npm install -g ganache-cli

$ ganache-cli -l 0xffffffff
```

In the project root directory, 

```
$ npm install
```

**Whole test**
```
$ truffle test test/MetadiumBlockchain.test.js
```

## How to Use
1. Get the current Metadium Identity Manager contract address from MNS(Metadium Name Service)
    1. call getContractAddress("MetadiumIdentityManager") from MNS -> returns address like 0x390dE26d772D2e2005C6d1d24afC902bae37a4bB
2. Interact with this address.
    1. call createNewMetaID(...)

## static analysis
analysis process : flatten -> analize flattened sources

flatten
-------------
solidity_flattener --output temp/MetaID.sol contracts/MetaID.sol