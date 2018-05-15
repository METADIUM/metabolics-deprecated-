pragma solidity ^0.4.21;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";


/**
 * @title MetaID
 * This mock just provides a public mint and burn functions for testing purposes,
 * and a public setter for metadata URI
 */
contract MetaID is ERC721Token {
  function MetaID(string name, string symbol) public
    ERC721Token(name, symbol)
  { }

  function mint(address _to, uint256 _tokenId) public {
    super._mint(_to, _tokenId);
  }

  function burn(uint256 _tokenId) public {
    super._burn(ownerOf(_tokenId), _tokenId);
  }

  function setTokenURI(uint256 _tokenId, string _uri) public {
    super._setTokenURI(_tokenId, _uri);
  }
}