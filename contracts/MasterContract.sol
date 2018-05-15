pragma solidity ^0.4.21;

contract MasterContract {
    
    mapping(bytes32=>address) public contracts;

    address public owner;

    function MasterContract() public {
        owner = msg.sender;
    }

    function set(bytes32 contractName, address addr) public {
        require(msg.sender == owner);
        contracts[contractName] = addr;

    }
    function getContract(bytes32 contractName) constant returns(address) {
        return contracts[contractName];
    }
}