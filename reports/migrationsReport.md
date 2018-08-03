==== Message call to external contract ====
Type: Warning
Contract: Unknown
Function name: upgrade(address)
PC address: 551
This contract executes a message call to an address provided as a function argument. Generally, it is not recommended to call user-supplied addresses using Solidity's call() construct. Note that attackers might leverage reentrancy attacks to exploit race conditions or manipulate this contract's state.
--------------------
In file: contracts/Migrations.sol:19

upgraded.setCompleted(last_completed_migration)

--------------------


