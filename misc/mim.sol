pragma solidity ^0.4.13;

contract ERC20Basic {
  function totalSupply() public view returns (uint256);
  function balanceOf(address who) public view returns (uint256);
  function transfer(address to, uint256 value) public returns (bool);
  event Transfer(address indexed from, address indexed to, uint256 value);
}

contract MetaID {
    function mint(address _to, uint256 _tokenId, string _uri) public returns (bool);
    function setTokenURI(uint256 _tokenId, string _uri) public;
    function balanceOf(address _owner) public view returns (uint256 _balance);
    function burn(uint256 _tokenId) public returns (bool);
    function exists(uint256 _tokenId) public view returns (bool _exists);
    function ownerOf(uint256 _tokenId) public view returns (address _owner);
    function tokenURI(uint256 _tokenId) public view returns (string);
    function tokenOfOwnerByIndex(address _owner, uint256 _index) public view returns (uint256 _tokenId);
    function tokenURIAsBytes(uint256 _tokenId) public view returns (bytes);
}

contract Ownable {
  address public owner;


  event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);


  /**
   * @dev The Ownable constructor sets the original `owner` of the contract to the sender
   * account.
   */
  function Ownable() public {
    owner = msg.sender;
  }

  /**
   * @dev Throws if called by any account other than the owner.
   */
  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  /**
   * @dev Allows the current owner to transfer control of the contract to a newOwner.
   * @param newOwner The address to transfer ownership to.
   */
  function transferOwnership(address newOwner) public onlyOwner {
    require(newOwner != address(0));
    emit OwnershipTransferred(owner, newOwner);
    owner = newOwner;
  }

}

contract MetadiumIdentityManager is Ownable {

    MetadiumNameService public MNS; // address of Metadium Name Service
    MetaID public MID; // address of MetaID

    bytes32 public constant nameMetaIdentityManager = "MetadiumIdentityManager";
    bytes32 public constant nameMetaID = "MetaID";
    
    event CreateMetaID(address indexed owner, bytes32 indexed metaID);
    event UpdateMetaID(address indexed owner, bytes32 indexed oldMetaID, bytes32 indexed newMetaID);
    event RestoreMetaID(address indexed owner, bytes32 indexed oldMetaID, bytes32 indexed newMetaID);
    event DeleteMetaID(address indexed owner, bytes32 indexed metaID);

    modifier permissioned() {
        require(MNS.getPermission(nameMetaIdentityManager, msg.sender));
        _;
    }

    modifier linked() {
        require(MNS != address(0) && MID != address(0));
        _;
    }

    modifier fixedLengthMetaPackage(bytes _metaPackage){
        // Version 0x01 -> metaPackage.length == 85 bytes
        uint256 version01Length = 85;
        require(_metaPackage.length == version01Length);
        _;
    }
    
    /**
    * @dev Function to create New Meta ID. signature = user_privatekey_sign(_metaID)
    * @param _metaID metaID of the user
    * @param _sig ECDSA signature
    * @param _metaPackage = Version(1 byte) . userSenderAddress(20 bytes) . AttestationMask(32 bytes) . Status(32 bytes) 
    * @return A boolean that indicates if the operation was successful.
    */
    function createMetaID(bytes32 _metaID, bytes _sig, bytes _metaPackage) linked permissioned fixedLengthMetaPackage(_metaPackage) public returns (bool){
        //permission checked by modifier permissioned

        //get address from metaPackage
        address _senderFromMetaPackage = getAddressFromMetaPackage(_metaPackage);
        
        //verify the signature using ecverify & sender address
        require(ecverify(_metaID, _sig, _senderFromMetaPackage));

        //check whether same meta ID exists if yes, revert
        require(!MID.exists(uint256(_metaID)));

        require(balanceOf(_senderFromMetaPackage) == 0);

        //if not, mint erc721 token to sender address 
        require(MID.mint(_senderFromMetaPackage, uint256(_metaID), string(_metaPackage)));

        emit CreateMetaID(_senderFromMetaPackage, _metaID);

        return true;

    }

    /**
    * @dev Function to delete Meta ID. signature = user_privatekey_sign(_metaID . _timestamp)
    * @param _metaID metaID of the user
    * @param _sig ECDSA signature
    * @return A boolean that indicates if the operation was successful.
    */
    function deleteMetaID(bytes32 _metaID, bytes _timestamp, bytes _sig) linked permissioned public returns (bool){
        //permission check from modifier permissioned

        //get address from metaPackage
        address _senderFromMetaID = ownerOf(_metaID);
        
        //verify the signature using ecverify & sender address
        require(ecverifyWithTimestamp(_metaID, _timestamp, _sig, _senderFromMetaID));

        //check whether the metaID belongs to the sender. this also checks existence
        //require(MID.ownerOf(uint256(_metaID)) == _senderFromMetaID); // double checked

        //burn metaID
        require(MID.burn(uint256(_metaID)));

        emit DeleteMetaID(_senderFromMetaID, _metaID);
        
        return true;
    }

    /**
    * @dev Function to update old MetaID to New MetaID. signature = user_privatekey_sign(_newMetaID)
    * @param _oldMetaID metaID of the user
    * @param _newMetaID metaID of the user
    * @param _sig ECDSA signature
    * @param _metaPackage = Version(1 byte) . userSenderAddress(20 bytes) . AttestationMask(32 bytes) . Status(32 bytes) 
    * @return A boolean that indicates if the operation was successful.
    */
    function updateMetaID(bytes32 _oldMetaID, bytes32 _newMetaID, bytes _sig, bytes _metaPackage) linked permissioned fixedLengthMetaPackage(_metaPackage) public returns (bool){
        //permission check from modifier permissionedOnly(msg.sender)

        //get address from metaPackage
        address _senderFromMetaPackage = getAddressFromMetaPackage(_metaPackage);

        //check the owner has this metaID
        require(ownerOf(_oldMetaID) == _senderFromMetaPackage);

        //verify the signature using ecverify & sender address
        require(ecverify(_newMetaID, _sig, _senderFromMetaPackage));

        //check whether same old Meta ID exists
        //require(metaIDContract.exists(uint256(_oldMetaID))); // double checked

        //check whether same new Meta ID exists
        require(!MID.exists(uint256(_newMetaID)));
      
        //burn old erc721 token from sender address
        require(MID.burn(uint256(_oldMetaID)));

        //mint new erc721 token to sender address 
        require(MID.mint(_senderFromMetaPackage, uint256(_newMetaID), string(_metaPackage)));

        //approve transfer and burn and mint to permissioned address(e.g. proxy)
        emit UpdateMetaID(_senderFromMetaPackage, _oldMetaID, _newMetaID);

        return true;

    }

    /**
    * @dev Function to update old MetaID to New MetaID. signature = user_privatekey_sign(_newMetaID)
    * @param _oldMetaID metaID of the user
    * @param _newMetaID metaID of the user
    * @param _oldAddress old address of the user
    * @param _sig ECDSA signature
    * @param _metaPackage = Version(1 byte) . userSenderAddress(20 bytes) . AttestationMask(32 bytes) . Status(32 bytes) 
    * @return A boolean that indicates if the operation was successful.
    */
    function restoreMetaID(bytes32 _oldMetaID, bytes32 _newMetaID, address _oldAddress, bytes _sig, bytes _metaPackage) linked permissioned fixedLengthMetaPackage(_metaPackage) public returns (bool){
        //permission check from modifier permissionedOnly(msg.sender)

        //get NEW address from metaPackage
        address _senderFromMetaPackage = getAddressFromMetaPackage(_metaPackage);

        //check the old address owner has old metaID
        require(ownerOf(_oldMetaID) == _oldAddress);

        //verify the signature using ecverify & new sender address
        require(ecverify(_newMetaID, _sig, _senderFromMetaPackage));

        //check whether same old Meta ID exists
        //require(metaIDContract.exists(uint256(_oldMetaID))); // double checked

        //check whether same new Meta ID exists
        require(!MID.exists(uint256(_newMetaID)));
      
        //burn old erc721 token from sender address
        require(MID.burn(uint256(_oldMetaID)));

        //mint new erc721 token to sender address 
        require(MID.mint(_senderFromMetaPackage, uint256(_newMetaID), string(_metaPackage)));

        //approve transfer and burn and mint to permissioned address(e.g. proxy)
        emit RestoreMetaID(_senderFromMetaPackage, _oldMetaID, _newMetaID);

        return true;

    }

    function ownerOf(bytes32 _tokenId) linked public view returns (address _owner){
        return MID.ownerOf(uint256(_tokenId));
    }

    function tokenURI(bytes32 _tokenId) linked public view returns (string){
        return MID.tokenURI(uint256(_tokenId));
    }

    /**
    * @dev Returns an URI as bytes for a given token ID
    * @dev Throws if the token ID does not exist. May return an empty string.
    * @param _tokenId uint256 ID of the token to query
    */
    function tokenURIAsBytes(bytes32 _tokenId) linked public view returns (bytes) {
        return MID.tokenURIAsBytes(uint256(_tokenId));
    }

    function balanceOf(address _owner) linked public view returns (uint256 _balance){
        return MID.balanceOf(_owner);
    }

    function tokenOfOwnerByIndex(address _owner, uint256 _index) linked public view returns (bytes32 _tokenId){
        return bytes32(MID.tokenOfOwnerByIndex(_owner, _index));
    }

    function ecrecovery(bytes32 hash, bytes sig) public constant returns (address) {
        bytes32 r;
        bytes32 s;
        uint8 v;
    
        if (sig.length != 65) {
        return 0;
        }

        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := and(mload(add(sig, 65)), 255)
        }

        // https://github.com/ethereum/go-ethereum/issues/2053
        if (v < 27) {
            v += 27;
        }

        if (v != 27 && v != 28) {
            return 0;
        }

        /* prefix might be needed for geth only
        * https://github.com/ethereum/go-ethereum/issues/3731
        */
        // bytes memory prefix = "\x19Ethereum Signed Message:\n32";
        // hash = sha3(prefix, hash);

        return ecrecover(hash, v, r, s);
    }

    function ecverify(bytes32 message, bytes sig, address signer) public constant returns (bool) {
        //message = keccak256(message);
        bytes memory prefix = "\x19Ethereum Signed Message:\n32";
        message = keccak256(prefix, message);
        return signer == ecrecovery(message, sig);
    }

    function ecverifyWithTimestamp(bytes32 message, bytes timestamp, bytes sig, address signer) public constant returns (bool) {
        
        bytes memory prefix = "\x19Ethereum Signed Message:\n32";
        uint256 lens = message.length + timestamp.length;

        //change the prefix 32 to message+timestamp length
        prefix[prefix.length-2] = byte(lens / 10 + 48);
        prefix[prefix.length-1] = byte(lens % 10 + 48);

        bytes32 hashedMessage = keccak256(prefix, message, timestamp);
        return signer == ecrecovery(hashedMessage, sig);

    }

    function getAddressFromMetaPackage(bytes b) public pure returns (address) {
        uint minLength = 22;
        require(b.length > minLength);

        bytes20 out;
        // b[0] = version
        for (uint i = 1; i < 21; i++) {
            out |= bytes20(b[i] & 0xFF) >> ((i-1) * 8);    
        }
        return address(out);
    }

    function setMetadiumNameServiceAddress(address _addr) onlyOwner {
        MNS = MetadiumNameService(_addr);
    }
    
    function setMetaIDAddress(address _addr) onlyOwner {
        MID = MetaID(MNS.getContractAddress(nameMetaID));
    }
}

contract MetadiumNameService is Ownable{
    
    mapping(bytes32=>address) public contracts;
    mapping(bytes32=>mapping(address=>bool)) public permissions;


    function setContractDomain(bytes32 _name, address _addr) onlyOwner public {
        require(_addr != address(0x0));
        contracts[_name] = _addr;
        //TODO should decide whether to set 0x00 to destoryed contract or not
        

    }
    function getContractAddress(bytes32 _name) public constant returns(address) {
        require(contracts[_name] != address(0x0));
        return contracts[_name];
    }

    function setPermission(bytes32 _contract, address _granted, bool _status) onlyOwner public returns(bool) {
        require(_granted != address(0x0));
        permissions[_contract][_granted] = _status;
        return true;
    }

    function getPermission(bytes32 _contract, address _granted) public constant returns(bool) {
        return permissions[_contract][_granted];
    }
    //TODO
    
}

