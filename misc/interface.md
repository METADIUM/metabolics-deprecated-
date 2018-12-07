
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