# Analysis result for MetaID

No issues found.
# Analysis result for AddressUtils

No issues found.
# Analysis result for Math

No issues found.
# Analysis result for SafeMath

No issues found.
# Analysis result for MetadiumNameService

No issues found.
# Analysis result for MetadiumIdentityManager:

==== Integer Overflow  ====
Type: Warning
Contract: Unknown
Function name: ecverify(bytes32,bytes,address)
PC address: 674
A possible integer overflow exists in the function `ecverify(bytes32,bytes,address)`.
The addition or multiplication may result in a value higher than the maximum representable integer.
--------------------
In file: MetadiumIdentityManager.json:208

function ecverify(bytes32 message, bytes sig, address signer) public constant returns (bool) {
        //message = keccak256(message);
        bytes memory prefix = "\x19Ethereum Signed Message:\n32";
        message = keccak256(prefix, message);
        return signer == ecrecovery(message, sig);
    }

--------------------

==== Message call to external contract ====
Type: Informational
Contract: Unknown
Function name: tokenURIAsBytes(uint256)
PC address: 3219
This contract executes a message call to to another contract. Make sure that the called contract is trusted and does not execute user-supplied code.
--------------------
In file: MetadiumIdentityManager.json:161

MNS.getContractAddress(nameMetaID)

--------------------

==== Multiple Calls ====
Type: Information
Contract: Unknown
Function name: tokenURIAsBytes(uint256)
PC address: 3219
Multiple sends exist in one transaction, try to isolate each external call into its own transaction. As external calls can fail accidentally or deliberately.
Consecutive calls: 
Call at address: 3391

--------------------
In file: MetadiumIdentityManager.json:161

MNS.getContractAddress(nameMetaID)

--------------------

==== Message call to external contract ====
Type: Informational
Contract: Unknown
Function name: tokenURIAsBytes(uint256)
PC address: 3391
This contract executes a message call to to another contract. Make sure that the called contract is trusted and does not execute user-supplied code.
--------------------
In file: MetadiumIdentityManager.json:162

metaIDContract.tokenURIAsBytes(_tokenId)

--------------------

==== Message call to external contract ====
Type: Informational
Contract: Unknown
Function name: tokenOfOwnerByIndex(address,uint256)
PC address: 3732
This contract executes a message call to to another contract. Make sure that the called contract is trusted and does not execute user-supplied code.
--------------------
In file: MetadiumIdentityManager.json:171

MNS.getContractAddress(nameMetaID)

--------------------

==== Multiple Calls ====
Type: Information
Contract: Unknown
Function name: tokenOfOwnerByIndex(address,uint256)
PC address: 3732
Multiple sends exist in one transaction, try to isolate each external call into its own transaction. As external calls can fail accidentally or deliberately.
Consecutive calls: 
Call at address: 3956

--------------------
In file: MetadiumIdentityManager.json:171

MNS.getContractAddress(nameMetaID)

--------------------

==== Message call to external contract ====
Type: Informational
Contract: Unknown
Function name: tokenOfOwnerByIndex(address,uint256)
PC address: 3956
This contract executes a message call to to another contract. Make sure that the called contract is trusted and does not execute user-supplied code.
--------------------
In file: MetadiumIdentityManager.json:172

metaIDContract.tokenOfOwnerByIndex(_owner, _index)

--------------------

==== Message call to external contract ====
Type: Informational
Contract: Unknown
Function name: ownerOf(uint256)
PC address: 4458
This contract executes a message call to to another contract. Make sure that the called contract is trusted and does not execute user-supplied code.
--------------------
In file: MetadiumIdentityManager.json:146

MNS.getContractAddress(nameMetaID)

--------------------

==== Message call to external contract ====
Type: Informational
Contract: Unknown
Function name: createMetaID(bytes32,bytes,bytes)
PC address: 4939
This contract executes a message call to to another contract. Make sure that the called contract is trusted and does not execute user-supplied code.
--------------------
In file: MetadiumIdentityManager.json:42

MNS.getPermission(nameMetaIdentityManager, msg.sender)

--------------------


# Analysis result for ERC721Token

No issues found.
# Analysis result for ERC721BasicToken

No issues found.
# Analysis result for Ownable

No issues found.
