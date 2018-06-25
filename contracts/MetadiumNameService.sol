pragma solidity ^0.4.23;

import "./openzeppelin-solidity/contracts/ownership/Ownable.sol";

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