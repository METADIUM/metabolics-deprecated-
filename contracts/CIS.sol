pragma solidity ^0.4.21;

import "./MasterContract.sol";

// contract MasterContract{

// }
contract ERC20Basic {
  function totalSupply() public view returns (uint256);
  function balanceOf(address who) public view returns (uint256);
  function transfer(address to, uint256 value) public returns (bool);
  event Transfer(address indexed from, address indexed to, uint256 value);
}

contract metaERC721 {
    function mint(address _to, uint256 _tokenId) public;
    function setTokenURI(uint256 _tokenId, string _uri) public;
    function balanceOf(address _owner) public view returns (uint256 _balance);
}

contract CIS {
    
    MasterContract public MC;
    mapping(bytes32=>address) public contracts;
    
    address public owner;

    function CIS() public {
        owner = msg.sender;
    }
    function setMasterContractAddress(address _addr){
        MC = MasterContract(_addr);
    }
    /**
    * @dev Function to register New Meta ID.
    * @param _owner The address that will receive the minted tokens.
    * @param _metaID the metaID that the new minted token would get.
    * @return A boolean that indicates if the operation was successful.
    */
    function registerNewID(address _owner, uint256 _tokenID, string _metaID) public returns (bool){
        
        //step 1
        //get IDToken address from Master Contract
        metaERC721 metaID = metaERC721(MC.getContract("MetaID"));

        //register new metaID
        
        metaID.mint(_owner, _tokenID);
        metaID.setTokenURI(_tokenID, _metaID);

        //get metaID cnt , and set the complements
        uint256 _balance = metaID.balanceOf(_owner); 

        //step 2
        //get metadiumToken address from Master contract
        ERC20Basic _metadium = ERC20Basic(MC.getContract("Metadium"));

        //give this address metadium token along with above the condition.
        //CIS contract must have enough tokens
        _metadium.transfer(_owner, _balance * (10 **18));

        return true;

    }
}