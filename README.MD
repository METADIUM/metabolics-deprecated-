![meta logo](./misc/Metadium_Logo_Vertical_PNG.png)
# Metadium Metadium Identity Manager Smart Contract
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
$ truffle migrate all --reset --network metadium
```
OR
```
$ truffle migrate all --reset --network
```

## How to test
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

mythril
-------------

```
$ myth --truffle >> report.md
```

see report.md


single contract

```
$ myth -x contracts/Migrations.sol
```

oyente
-------------
$ sudo docker pull luongnguyen/oyente
$ sudo docker run -i -t luongnguyen/oyente

## Main Functions
Explanation of the Metadium Smart Contract Main functions

### Metadium Name Service
* setContractDomain
* getContractAddress

```
    function setContractDomain(bytes32 _name, address _addr) onlyOwner public
```
Only MetaGovernance can set domain now.



```
    function getContractAddress(bytes32 _name) public constant returns(address)
```
You can get the specific address of contract you want to read.


### Metadium Identity Manager
* createNewMetaID
* deleteMetaID
* updateMetaID
* getMetaIDOwner
* createNewMetaRecovery
* getRecoveryData


#### MetaID CRUD functions
```
  /**
    * @dev Function to create New Meta ID. signature = user_privatekey_sign(_metaID)
    * @param _metaID metaID of user
    * @param _sig ECDSA signature
    * @param _metaPackage = Version(1 byte) . userSenderAddress(20 bytes) . AttestationMask(32 bytes) . Status(32 bytes) 
    * @return A boolean that indicates if the operation was successful.
    */
    function createMetaID(bytes32 _metaID, bytes _sig, bytes _metaPackage) linked permissioned fixedLengthMetaPackage(_metaPackage) public returns (bool)
```

Create New MetaID. MetaID is minted as ERC721 Format. You can either read from this contract or directly from ERC721 MetaID contract.


```
    function deleteMetaID(bytes32 _metaID, bytes _timestamp, bytes _sig) linked permissioned public returns (bool)
```
Delete MetaID if exists.

```
    function updateMetaID(bytes32 _oldMetaID, bytes32 _newMetaID, bytes _sig, bytes _metaPackage) linked permissioned fixedLengthMetaPackage(_metaPackage) public returns (bool)
```     
Update MetaID. Burn old metaID and mint new metaID to the user.


```
    function ownerOf(uint256 _tokenId) public view returns (address _owner)
    function tokenURI(uint256 _tokenId) public view returns (string)
    function balanceOf(address _owner) public view returns (uint256 _balance)
    function tokenOfOwnerByIndex(address _owner, uint256 _index) public view returns (uint256 _tokenId)
```
Proxy interface of MetaID.

Get metaID information from MetaID contract.