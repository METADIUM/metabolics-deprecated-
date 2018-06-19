pragma solidity ^0.4.21;

import "./MetadiumNameService.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
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
}

contract MetadiumIdentityManager is Ownable {
    
    MetadiumNameService public MNS;

    function setMetadiumNameServiceAddress(address _addr) onlyOwner {
        MNS = MetadiumNameService(_addr);
    }
    
    /**
    * @dev Function to create New Meta ID.
    * @param _metaID metaID of user
    * @param _sigV ECDSA v signature
    * @param _sigV ECDSA r signature
    * @param _sigV ECDSA s signature
    * @param _metaPackage = Version(1 byte) . userSenderAddress(20 bytes) . AttestationMask(32 bytes) . Status(32 bytes), which made signature. 
    * @return A boolean that indicates if the operation was successful.
    */
    function createNewMetaID(uint256 _metaID, uint8 _sigV, bytes32 _sigR, bytes32 _sigS, bytes _metaPackage) public returns (bool){
        //permission check from modifier permissionedOnly(msg.sender)
        
        //get address from metaPackage
        
        address _senderFromMetaPackage = getAddressFromMetaPackage(_metaPackage);

        //verify the signature using ecrecovery & sender address
        //check sigV
        address _senderFromSignatrue = ecrecover(keccak256(_metaID), _sigV,_sigR,_sigS);

        require(_senderFromMetaPackage == _senderFromSignatrue);

        //get metaID address from Metadium Name Service
        MetaID metaIDContract = MetaID(MNS.getContractAddress("MetaID"));

        //check whether same meta ID exists if yes, revert
        require(!metaIDContract.exists(_metaID));

        //if not, mint erc721 token to sender address 

        require(metaIDContract.mint(_senderFromSignatrue, _metaID, string(_metaPackage)));

        //approve transfer and burn and mint to permissioned address(this contract or proxy)

        return true;

    }

    function deleteMetaID(uint256 _metaID, uint8 _sigV, bytes32 _sigR, bytes32 _sigS, bytes _newMetaPackage) public returns (bool){
        //permission check from modifier permissionedOnly(msg.sender)

        //verify signature : signed data is _metaID

        //get metaID address from Metadium Name Service

        //check whether same meta ID exists
        
        //if ok,
        
        //change the metaPackage(status : revoked) of this metaID
        
    }

    function updateMetaID(uint256 _oldMetaID, uint256 _newMetaID, uint8 _sigV, bytes32 sigR, bytes32 _sigS, bytes _metaPackage) public returns (bool){
        //permission check from modifier permissionedOnly(msg.sender)

        //get metaID address from Master Contract
        //metaERC721 metaID = metaERC721(MC.getContract("MetaID"));

        //check whether same new Meta ID exists

        //if not,
      
        //burn old erc721 token from sender address

        //mint new erc721 token to sender address 

        //approve transfer and burn and mint to permissioned address(e.g. proxy)

    }

    function createNewMetaRecovery(uint256 _metaID, uint8 _sigV, bytes32 _sigR, bytes32 _sigS, bytes _metaPackage) public returns (bool){
        //permission check from modifier permissionedOnly(msg.sender)
        
        //metaPackage = Version(1 byte) . userSenderAddress(20 bytes) . IPFSpath(bytes)
        
        //get address from metaPackage

        //signature verifying via ecrecovery & sender address 

        
        //get IDToken address from Master Contract
        //metaERC721 metaID = metaERC721(MC.getContract("MetaID"));

        //check whether same meta ID exists

        //if not,
        //mint erc721 token to sender address 


        //approve transfer and burn and mint to permissioned address(e.g. peroxy)
        
        //register new metaID
        
        //require(metaID.mint(_owner, _tokenID, _metaID));

        //get metaID cnt , and set the complements
        //uint256 _balance = metaID.balanceOf(_owner); 

        //step 2
        //get metadiumToken address from Master contract
        //ERC20Basic _metadium = ERC20Basic(MC.getContract("Metadium"));

        //give this address metadium token along with above the condition.
        //CIS contract must have enough tokens
        //require(_metadium.transfer(_owner, _balance * (10 **18)));

        return true;

    }


    function verifyingSignature(uint8 sigV, bytes32 sigR, bytes32 sigS, address destination, bytes data) public returns (bool) {
        bytes32 dataHash = keccak256(data);
        address verifiedAddress = ecrecover(dataHash, sigV, sigR, sigS);
        return (msg.sender == verifiedAddress);

    }

    function getMetaIDOwner(uint256 _metaID) public constant returns (address) {

    }

    function getRecoveryData(uint256 _metaID) public constant returns (bytes32) {

    }

    function ecrecovery(bytes32 hash, bytes sig) public returns (address) {
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

  function ecverify(bytes32 hash, bytes sig, address signer) public returns (bool) {
    return signer == ecrecovery(hash, sig);
  }

  function getAddressFromMetaPackage (bytes b) public constant returns (address) {
    uint result = 0;
    //get Address from bytes. first byte is version. address is 20bytes after that.
    for (uint i = 2; i < 42; i++) {
        uint c = uint(b[i]);
        if (c >= 48 && c <= 57) {
            result = result * 16 + (c - 48);
        }
        if(c >= 65 && c<= 90) {
            result = result * 16 + (c - 55);
        }
        if(c >= 97 && c<= 122) {
            result = result * 16 + (c - 87);
        }
    }
    return address(result);
}
}