pragma solidity ^0.4.21;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";


/**
 * @title MetaID
 * This mock just provides a public mint and burn functions for testing purposes,
 * and a public setter for metadata URI
 */
contract MetaRecovery is ERC721Token {
  struct MetaProfile{
    address addr;
    string metaID;
    bytes32 attestationMask;
    uint timestamp;
    uint status;
  }
  mapping(bytes32 => MetaProfile) public metaProfile;

  function MetaRecovery(string name, string symbol) public ERC721Token(name, symbol){ }
/**
  * @dev Function to register New Meta ID as ERC721 Token.
  * @param _to The address that will receive the minted tokens.
  * @param _tokenId the token index of newly minted token.
  * @param _uri the metaID that the newly minted token would get.
  * @return A boolean that indicates if the operation was successful.
  */
  function mint(address _to, uint256 _tokenId, string _uri) public returns (bool) {
    super._mint(_to, _tokenId);
    super._setTokenURI(_tokenId, _uri);
    return true;
  }

  function burn(uint256 _tokenId) public returns (bool){
    super._burn(ownerOf(_tokenId), _tokenId);
    return true;
  }

  function getMetaProfileByUri(bytes32 _uri) constant returns(address, string, bytes32, uint, uint){
    return (metaProfile[_uri].addr, metaProfile[_uri].metaID, metaProfile[_uri].attestationMask, metaProfile[_uri].timestamp, metaProfile[_uri].status);
  }
}