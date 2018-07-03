# Metadium Smart Contracts
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


## Update
ver 0.1 we don't use status, attestation mask field,

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
    function createMetaID(bytes32 _metaID, bytes _sig, bytes _metaPackage) permissioned public returns (bool)
```

Create New MetaID. MetaID is minted as ERC721 Format. You can either read from this contract or directly from ERC721 MetaID contract.


```
    function deleteMetaID(bytes32 _metaID, bytes _sig, bytes _metaPackage) permissioned public returns (bool)
```
Delete MetaID if exists.

```
    function updateMetaID(bytes32 _oldMetaID, bytes32 _newMetaID, bytes _sig, bytes _metaPackage) permissioned public returns (bool)
```     
Update MetaID. Burn old metaID and mint new metaID to the user.


```
    function ownerOf(uint256 _tokenId) public view returns (address _owner)
    function tokenURI(uint256 _tokenId) public view returns (string)
    function balanceOf(address _owner) public view returns (uint256 _balance)
    function tokenOfOwnerByIndex(address _owner, uint256 _index) public view returns (uint256 _tokenId)
```
proxy interface of MetaID.
get metaID information from MetaID contract.


#### MetaRecovery functions

```
    function getRecoveryData(uint256 _metaID) public constant returns (bytes32)
```
Get the IPFS path of the user metaID

```
    function createNewMetaRecovery(uint256 _metaID, uint8 _sigV, bytes32 _sigR, bytes32 _sigS, bytes _metaPackage) public returns (bool)
```
Create new Meta Recovery Token as ERC721 format. This token has IPFS path of the user's recovery document.

## how to test

node version : v9.4.0

토큰 하나에 344 byte 까지 저장 가능 한 것 확인. max가 얼마인지는 모름

###

//proxy1 address : 0x084f8293F1b047D3A217025B24cd7b5aCe8fC657
//proxy1 private key : 348a1e57efc055f3b8243f6e78fb18d0508f68d6f2e7cadf92b87e84a0b51024
//this is node3 account[1]

07/02
MetadiumNameService: 0xe06dbbcb9af642017012d5021d586536673b955f
MetaID: 0x58fe1753151573185566e46c14330a08d6359249
MetadiumIdentityManager: 0x280c4b294f9179691f30466c14963eb2d5b0addf