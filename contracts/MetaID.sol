pragma solidity ^0.4.21;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "./MetadiumNameService.sol";
/**
 * @title MetaID
 * This mock just provides a public mint and burn functions for testing purposes,
 * and a public setter for metadata URI
 */
contract MetaID is ERC721Token, Ownable {

    MetadiumNameService public MNS;
    
    event Mint(address indexed owner, uint256 indexed metaID);
    event Burn(address indexed owner, uint256 indexed metaID);
    
    function setMetadiumNameServiceAddress(address _addr) onlyOwner {
        MNS = MetadiumNameService(_addr);
    }

    modifier permissioned() {
        require(MNS.getPermission("MetaID", msg.sender));
        _;
    }

    function MetaID(string name, string symbol) public ERC721Token(name, symbol){ }
  /**
    * @dev Function to register New Meta ID as ERC721 Token.
    * @param _to The address that will receive the minted tokens.
    * @param _tokenId the token index of newly minted token.
    * @param _uri the metaID that the newly minted token would get.
    * @return A boolean that indicates if the operation was successful.
    */
    function mint(address _to, uint256 _tokenId, string _uri) permissioned public returns (bool) {
        super._mint(_to, _tokenId);
        super._setTokenURI(_tokenId, _uri);
        Mint(_to, _tokenId);
        return true;
    }

    function burn(uint256 _tokenId) permissioned public returns (bool){
        super._burn(ownerOf(_tokenId), _tokenId);
        Burn(ownerOf(_tokenId), _tokenId);
        return true;
    }

    /**
    * @dev Returns an URI as bytes for a given token ID
    * @dev Throws if the token ID does not exist. May return an empty string.
    * @param _tokenId uint256 ID of the token to query
    */
    function tokenURIAsBytes(uint256 _tokenId) public view returns (bytes) {
        require(exists(_tokenId));
        return bytes(tokenURIs[_tokenId]);
    }

    // Transfer methods are disabled
    function transferFrom(address _from, address _to, uint256 _tokenId) public {
        require(false);
    }
    function safeTransferFrom(address _from, address _to, uint256 _tokenId) public {
        require(false);
    }
    function safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes _data) public {
        require(false);
    }

}