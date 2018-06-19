pragma solidity ^0.4.23;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract MetadiumNameService is Ownable{
    
    mapping(bytes32=>address) public contracts;

    function setContractDomain(bytes32 _name, address _addr) onlyOwner public {
        contracts[_name] = _addr;

    }
    function getContractAddress(bytes32 _name) public constant returns(address) {
        return contracts[_name];
    }
}