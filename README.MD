# Metadium Smart Contracts
Metadium Smart Contracts consist of followings:
* Metadium Name Service
* Metadium Identity Manager
* MetaID(ERC721)
* MetaRecoveery(ERC721)
* Permission

## Update
ver 0.1 we don't use status, attestation mask field,

## How to Use
1. Get the current Metadium Identity Manager contract address from MNS(Metadium Name Service)
    1. call getContractAddress("MetadiumIdentityManager") from MNS -> returns address like 0x390dE26d772D2e2005C6d1d24afC902bae37a4bB
2. Interact with this address.
    1. call createNewMetaID(...)


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
    * @dev Function to create New Meta ID. Signature(v,r,s) =  Sign_User_PrivateKey(metaPackage)
    * @param _metaID metaID of user
    * @param _sigV ECDSA v signature
    * @param _sigV ECDSA r signature
    * @param _sigV ECDSA s signature
    * @param _metaPackage = Version(1 byte) . userSenderAddress(20 bytes) . AttestationMask(32 bytes) . Status(32 bytes), which made signature. 
    * @return A boolean that indicates if the operation was successful.
    * /
    function createNewMetaID(uint256 _metaID, uint8 _sigV, bytes32 _sigR, bytes32 _sigS, bytes _metaPackage) public returns (bool)
```

Create New MetaID. MetaID is minted as ERC721 Format. You can either read from this contract or directly from ERC721 MetaID contract.


```
    function deleteMetaID(uint256 _metaID, uint8 _sigV, bytes32 _sigR, bytes32 _sigS, bytes _newMetaPackage) public returns (bool)
```
Delete MetaID if exists.

```
    function updateMetaID(uint256 _oldMetaID, uint256 _newMetaID, uint8 _sigV, bytes32 sigR, bytes32 _sigS, bytes _metaPackage) public returns (bool)
```     
Update MetaID. Burn old metaID and mint new metaID to the user.

```
    function getMetaIDOwner(uint256 _metaID) public constant returns (address)
```
get the owner of the specific metaID.


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
