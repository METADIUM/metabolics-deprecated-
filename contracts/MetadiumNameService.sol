pragma solidity ^0.4.23;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract MetadiumNameService is Ownable{
    
    mapping(bytes32=>address) public contracts;
    mapping(bytes32=>mapping(address=>bool)) public permissions;


    function setContractDomain(bytes32 _name, address _addr) onlyOwner public {
        contracts[_name] = _addr;

    }
    function getContractAddress(bytes32 _name) public constant returns(address) {
        return contracts[_name];
    }

    function setPermission(bytes32 _contract, address _granted, bool _status) onlyOwner public returns(bool) {
        permissions[_contract][_granted] = _status;
        return true;
    }

    function getPermission(bytes32 _contract, address _granted) public constant returns(bool) {
        return permissions[_contract][_granted];
    }
}