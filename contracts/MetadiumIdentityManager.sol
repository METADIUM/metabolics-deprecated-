pragma solidity ^0.4.21;

import "./openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "./MetadiumNameService.sol";
// contract MasterContract{

// }
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

contract MetadiumIdentityManager is Ownable {

    MetadiumNameService public MNS;
    bytes32 public constant nameMetaIdentityManager = "MetadiumIdentityManager";
    bytes32 public constant nameMetaID = "MetaID";
    
    event CreateMetaID(address indexed owner, bytes32 indexed metaID);
    event UpdateMetaID(address indexed owner, bytes32 indexed oldMetaID, bytes32 indexed newMetaID);
    event DeleteMetaID(address indexed owner, bytes32 indexed metaID);
    
    function setMetadiumNameServiceAddress(address _addr) onlyOwner {
        MNS = MetadiumNameService(_addr);
    }

    modifier permissioned() {
        require(MNS.getPermission(nameMetaIdentityManager, msg.sender));
        _;
    }

    /**
    * @dev Function to create New Meta ID. signature = user_privatekey_sign(_metaID)
    * @param _metaID metaID of user
    * @param _sig ECDSA signature
    * @param _metaPackage = Version(1 byte) . userSenderAddress(20 bytes) . AttestationMask(32 bytes) . Status(32 bytes) 
    * @return A boolean that indicates if the operation was successful.
    */
    function createMetaID(bytes32 _metaID, bytes _sig, bytes _metaPackage) permissioned public returns (bool){
        //permission checked by modifier permissioned

        //get address from metaPackage
        address _senderFromMetaPackage = getAddressFromMetaPackage(_metaPackage);
        
        //verify the signature using ecverify & sender address
        require(ecverify(_metaID, _sig, _senderFromMetaPackage));

        //get metaID address from Metadium Name Service
        MetaID metaIDContract = MetaID(MNS.getContractAddress(nameMetaID));

        //check whether same meta ID exists if yes, revert
        require(!metaIDContract.exists(uint256(_metaID)));

        //if not, mint erc721 token to sender address 
        require(metaIDContract.mint(_senderFromMetaPackage, uint256(_metaID), string(_metaPackage)));

        CreateMetaID(_senderFromMetaPackage, _metaID);
        return true;

    }

/**
    * @dev Function to delete Meta ID. signature = user_privatekey_sign(_metaID)
    * @param _metaID metaID of user
    * @param _sig ECDSA signature
    * @return A boolean that indicates if the operation was successful.
    */
    function deleteMetaID(bytes32 _metaID, bytes _timestamp, bytes _sig) permissioned public returns (bool){
        //permission check from modifier permissioned

        //get address from metaPackage
        address _senderFromMetaID = ownerOf(uint256(_metaID));
        
        //verify the signature using ecverify & sender address
        require(ecverifyWithTimestamp(_metaID, _timestamp, _sig, _senderFromMetaID));
        
        //get metaID address from Metadium Name Service
        MetaID metaIDContract = MetaID(MNS.getContractAddress(nameMetaID));

        //check whether the metaID belongs to the sender. this also checks existence
        require(metaIDContract.ownerOf(uint256(_metaID)) == _senderFromMetaID);

        //burn metaID
        require(metaIDContract.burn(uint256(_metaID)));

        DeleteMetaID(_senderFromMetaID, _metaID);
        
        
    }

    /**
    * @dev Function to update old MetaID to New MetaID. signature = user_privatekey_sign(_newMetaID)
    * @param _oldMetaID metaID of user
    * @param _newMetaID metaID of user
    * @param _sig ECDSA signature
    * @param _metaPackage = Version(1 byte) . userSenderAddress(20 bytes) . AttestationMask(32 bytes) . Status(32 bytes) 
    * @return A boolean that indicates if the operation was successful.
    */
    function updateMetaID(bytes32 _oldMetaID, bytes32 _newMetaID, bytes _sig, bytes _metaPackage) permissioned public returns (bool){
        //permission check from modifier permissionedOnly(msg.sender)

        //get address from metaPackage
        address _senderFromMetaPackage = getAddressFromMetaPackage(_metaPackage);

        //check the owner has this metaID
        require(ownerOf(uint256(_oldMetaID)) == _senderFromMetaPackage);

        //verify the signature using ecverify & sender address
        require(ecverify(_newMetaID, _sig, _senderFromMetaPackage));

        //get metaID address from Metadium Name Service
        MetaID metaIDContract = MetaID(MNS.getContractAddress(nameMetaID));

        //check whether same old Meta ID exists
        //require(metaIDContract.exists(uint256(_oldMetaID))); // double checked

        //check whether same new Meta ID exists
        require(!metaIDContract.exists(uint256(_newMetaID)));
      
        //burn old erc721 token from sender address
        require(metaIDContract.burn(uint256(_oldMetaID)));

        //mint new erc721 token to sender address 
        require(metaIDContract.mint(_senderFromMetaPackage, uint256(_newMetaID), string(_metaPackage)));

        //approve transfer and burn and mint to permissioned address(e.g. proxy)
        UpdateMetaID(_senderFromMetaPackage, _oldMetaID, _newMetaID);

    }

    function ownerOf(uint256 _tokenId) public view returns (address _owner){
        MetaID metaIDContract = MetaID(MNS.getContractAddress(nameMetaID));
        return metaIDContract.ownerOf(_tokenId);
    }

    function tokenURI(uint256 _tokenId) public view returns (string){
        MetaID metaIDContract = MetaID(MNS.getContractAddress(nameMetaID));
        return metaIDContract.tokenURI(_tokenId);
    }

    /**
    * @dev Returns an URI as bytes for a given token ID
    * @dev Throws if the token ID does not exist. May return an empty string.
    * @param _tokenId uint256 ID of the token to query
    */
    function tokenURIAsBytes(uint256 _tokenId) public view returns (bytes) {
        MetaID metaIDContract = MetaID(MNS.getContractAddress(nameMetaID));
        return metaIDContract.tokenURIAsBytes(_tokenId);
    }

    function balanceOf(address _owner) public view returns (uint256 _balance){
        MetaID metaIDContract = MetaID(MNS.getContractAddress(nameMetaID));
        return metaIDContract.balanceOf(_owner);
    }

    function tokenOfOwnerByIndex(address _owner, uint256 _index) public view returns (bytes32 _tokenId){
        MetaID metaIDContract = MetaID(MNS.getContractAddress(nameMetaID));
        return bytes32(metaIDContract.tokenOfOwnerByIndex(_owner, _index));
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

    function concatMetaIDTimestamp(bytes32 message, bytes timestamp, bytes sig) public constant returns (address){
        //bytes memory prefix = "\x19Ethereum Signed Message:\n32";
        //bytes32 hashedMessage = keccak256(prefix, message, timestamp);
        bytes32 hashedMessage = keccak256(message, timestamp);
        return ecrecovery(hashedMessage, sig);
        
    }
    function ecverifyWithTimestamp(bytes32 message, bytes timestamp, bytes sig, address signer) public constant returns (bool) {
        
        bytes memory prefix = "\x19Ethereum Signed Message:\n32";
        uint256 lens = message.length + timestamp.length;
        prefix[prefix.length-2] = byte(lens / 10 + 48);
        prefix[prefix.length-1] = byte(lens % 10 + 48);

        bytes32 hashedMessage = keccak256(prefix, message, timestamp);
        return signer == ecrecovery(hashedMessage, sig);

    }

    function getAddressFromMetaPackage(bytes b) public pure returns (address) {
        //constant 22 should be named.
        uint minLength = 22;
        require(b.length > minLength);

        bytes20 out;
        for (uint i = 1; i < 21; i++) {
            out |= bytes20(b[i] & 0xFF) >> ((i-1) * 8);    
        }
        return address(out);
    }
}