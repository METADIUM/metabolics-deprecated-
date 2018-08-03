
on geth

abi = [ { "constant": true, "inputs": [], "name": "MNS", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "nameMetaIdentityManager", "outputs": [ { "name": "", "type": "bytes32" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "nameMetaID", "outputs": [ { "name": "", "type": "bytes32" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "newOwner", "type": "address" } ], "name": "transferOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "owner", "type": "address" }, { "indexed": true, "name": "metaID", "type": "bytes32" } ], "name": "CreateMetaID", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "owner", "type": "address" }, { "indexed": true, "name": "oldMetaID", "type": "bytes32" }, { "indexed": true, "name": "newMetaID", "type": "bytes32" } ], "name": "UpdateMetaID", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "owner", "type": "address" }, { "indexed": true, "name": "oldMetaID", "type": "bytes32" }, { "indexed": true, "name": "newMetaID", "type": "bytes32" } ], "name": "RestoreMetaID", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "owner", "type": "address" }, { "indexed": true, "name": "metaID", "type": "bytes32" } ], "name": "DeleteMetaID", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "previousOwner", "type": "address" }, { "indexed": true, "name": "newOwner", "type": "address" } ], "name": "OwnershipTransferred", "type": "event" }, { "constant": false, "inputs": [ { "name": "_addr", "type": "address" } ], "name": "setMetadiumNameServiceAddress", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_metaID", "type": "bytes32" }, { "name": "_sig", "type": "bytes" }, { "name": "_metaPackage", "type": "bytes" } ], "name": "createMetaID", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_metaID", "type": "bytes32" }, { "name": "_timestamp", "type": "bytes" }, { "name": "_sig", "type": "bytes" } ], "name": "deleteMetaID", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_oldMetaID", "type": "bytes32" }, { "name": "_newMetaID", "type": "bytes32" }, { "name": "_sig", "type": "bytes" }, { "name": "_metaPackage", "type": "bytes" } ], "name": "updateMetaID", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_oldMetaID", "type": "bytes32" }, { "name": "_newMetaID", "type": "bytes32" }, { "name": "_oldAddress", "type": "address" }, { "name": "_sig", "type": "bytes" }, { "name": "_metaPackage", "type": "bytes" } ], "name": "restoreMetaID", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "name": "_tokenId", "type": "bytes32" } ], "name": "ownerOf", "outputs": [ { "name": "_owner", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "_tokenId", "type": "bytes32" } ], "name": "tokenURI", "outputs": [ { "name": "", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "_tokenId", "type": "bytes32" } ], "name": "tokenURIAsBytes", "outputs": [ { "name": "", "type": "bytes" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "_owner", "type": "address" } ], "name": "balanceOf", "outputs": [ { "name": "_balance", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "_owner", "type": "address" }, { "name": "_index", "type": "uint256" } ], "name": "tokenOfOwnerByIndex", "outputs": [ { "name": "_tokenId", "type": "bytes32" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "hash", "type": "bytes32" }, { "name": "sig", "type": "bytes" } ], "name": "ecrecovery", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "message", "type": "bytes32" }, { "name": "sig", "type": "bytes" }, { "name": "signer", "type": "address" } ], "name": "ecverify", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "message", "type": "bytes32" }, { "name": "timestamp", "type": "bytes" }, { "name": "sig", "type": "bytes" }, { "name": "signer", "type": "address" } ], "name": "ecverifyWithTimestamp", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "b", "type": "bytes" } ], "name": "getAddressFromMetaPackage", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "pure", "type": "function" } ]

//create MetaID
mimContract = eth.contract(abi)
mim = mimContract.at('0xacc650c912df6a92c0eb3a81843ada08f9f04b2f')
// for node3 geth proxy1
_metaPackage = "0x01084f8293f1b047d3a217025b24cd7b5ace8fc65765656565656565656565656565656565656565656565"
metaID = "0x1b442640e0333cb03054940e3cda07da982d2b57af68c3df8d0557b47a77d0bc";
signedMetaID = web3.eth.sign(eth.accounts[1],metaID)

mim.createMetaID(metaID, signedMetaID, _metaPackage, {from :eth.accounts[1],gas:3000000,gasPrice:1000})
mim.balanceOf(eth.accounts[1])
mim.tokenOfOwnerByIndex(eth.accounts[1],0)
mim.tokenURIAsBytes(metaID)


//delete MetaID
timestamp = Math.floor(Date.now() / 1000).toString(16) // "ab01cd"
metaIDAndTimeStamp = metaID.concat(timestamp)
signedMetaIDAndTimestamp = web3.eth.sign(eth.accounts[1], metaIDAndTimeStamp)
timestamp = "0x" + timestamp;
mim.deleteMetaID(metaID, timestamp, signedMetaIDAndTimestamp, { from: eth.accounts[1], gas:3000000, gasPrice:1000 });
mim.balanceOf(eth.accounts[1])

// 아래꺼 mid import 하고

mid.balanceOf(eth.accounts[1])
mid.tokenOfOwnerByIndex(eth.accounts[1],0)
mid.tokenURIAsBytes(metaID)

metaid1 = mid.tokenOfOwnerByIndex(eth.accounts[1],0)
web3.toHex(metaid1)


// (eth.accounts[1] == proxy1 ==  )

mnsabi=[ { "constant": true, "inputs": [ { "name": "", "type": "bytes32" }, { "name": "", "type": "address" } ], "name": "permissions", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "bytes32" } ], "name": "contracts", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "newOwner", "type": "address" } ], "name": "transferOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "previousOwner", "type": "address" }, { "indexed": true, "name": "newOwner", "type": "address" } ], "name": "OwnershipTransferred", "type": "event" }, { "constant": false, "inputs": [ { "name": "_name", "type": "bytes32" }, { "name": "_addr", "type": "address" } ], "name": "setContractDomain", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "name": "_name", "type": "bytes32" } ], "name": "getContractAddress", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_contract", "type": "bytes32" }, { "name": "_granted", "type": "address" }, { "name": "_status", "type": "bool" } ], "name": "setPermission", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "name": "_contract", "type": "bytes32" }, { "name": "_granted", "type": "address" } ], "name": "getPermission", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "view", "type": "function" } ]
mnsContract = eth.contract(mnsabi)
mns = mnsContract.at('0xb2cdd687dc0805f003a7020765886db5136b0db7')
mns.getContractAddress("MetaID")
mns.permissions("MetadiumIdentityManager",eth.accounts[1]) // == true


midabi=[ { "constant": true, "inputs": [], "name": "name", "outputs": [ { "name": "", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "_tokenId", "type": "uint256" } ], "name": "getApproved", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "MNS", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "_owner", "type": "address" }, { "name": "_index", "type": "uint256" } ], "name": "tokenOfOwnerByIndex", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "_tokenId", "type": "uint256" } ], "name": "exists", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "_index", "type": "uint256" } ], "name": "tokenByIndex", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "_tokenId", "type": "uint256" } ], "name": "ownerOf", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "_owner", "type": "address" } ], "name": "balanceOf", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [ { "name": "", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "_tokenId", "type": "uint256" } ], "name": "tokenURI", "outputs": [ { "name": "", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "_owner", "type": "address" }, { "name": "_operator", "type": "address" } ], "name": "isApprovedForAll", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "newOwner", "type": "address" } ], "name": "transferOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "name": "name", "type": "string" }, { "name": "symbol", "type": "string" } ], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "owner", "type": "address" }, { "indexed": true, "name": "metaID", "type": "uint256" } ], "name": "Mint", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "owner", "type": "address" }, { "indexed": true, "name": "metaID", "type": "uint256" } ], "name": "Burn", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "previousOwner", "type": "address" }, { "indexed": true, "name": "newOwner", "type": "address" } ], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "_from", "type": "address" }, { "indexed": true, "name": "_to", "type": "address" }, { "indexed": false, "name": "_tokenId", "type": "uint256" } ], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "_owner", "type": "address" }, { "indexed": true, "name": "_approved", "type": "address" }, { "indexed": false, "name": "_tokenId", "type": "uint256" } ], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "_owner", "type": "address" }, { "indexed": true, "name": "_operator", "type": "address" }, { "indexed": false, "name": "_approved", "type": "bool" } ], "name": "ApprovalForAll", "type": "event" }, { "constant": false, "inputs": [ { "name": "_addr", "type": "address" } ], "name": "setMetadiumNameServiceAddress", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_to", "type": "address" }, { "name": "_tokenId", "type": "uint256" }, { "name": "_uri", "type": "string" } ], "name": "mint", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_tokenId", "type": "uint256" } ], "name": "burn", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "name": "_tokenId", "type": "uint256" } ], "name": "tokenURIAsBytes", "outputs": [ { "name": "", "type": "bytes" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_tokenId", "type": "uint256" } ], "name": "transferFrom", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_tokenId", "type": "uint256" } ], "name": "safeTransferFrom", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_tokenId", "type": "uint256" }, { "name": "_data", "type": "bytes" } ], "name": "safeTransferFrom", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_to", "type": "address" }, { "name": "_tokenId", "type": "uint256" } ], "name": "approve", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_operator", "type": "address" }, { "name": "_approved", "type": "bool" } ], "name": "setApprovalForAll", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" } ]
midContract = eth.contract(midabi)
mid = midContract.at('0xbaf2292f199e95964f793c4b746c24b2f82d1d92')

//   MetadiumNameService: 0x24211f4606e1e069df4a1f34ebd47f963a888ce2

//   MetaID: 0xa5fe169bf0e17a44d38a0dcf4b340f9783165c77

//   MetadiumIdentityManager: 0xc0b39803ae89ffa15b06a9b2784a1504b48eeb30

// node3 has owner key. eth.accounts[2]


change Metadium Identity Manager only

// set MNS on MIM
mim.setMetadiumNameServiceAddress('0xb2cdd687dc0805f003a7020765886db5136b0db7',{from:eth.accounts[2]})

mns.getContractAddress("MetadiumIdentityManager")

// change address on MNS
mns.setContractDomain("MetadiumIdentityManager",'0xacc650c912df6a92c0eb3a81843ada08f9f04b2f',{from:eth.accounts[2]})

// set permission new MIM -> MID
mns.setPermission("MetaID",'0xacc650c912df6a92c0eb3a81843ada08f9f04b2f','true',{from:eth.accounts[2]})
mns.getPermission("MetaID",'0xacc650c912df6a92c0eb3a81843ada08f9f04b2f')

// remove permission old MIM -> MID
mns.setPermission("MetaID",'0x7fc9f6c286549902e4101241e5b8b9b88a021a3e','false',{from:eth.accounts[2]})
mns.getPermission("MetaID",'0x7fc9f6c286549902e4101241e5b8b9b88a021a3e')

07/02 저녁
MetadiumNameService: 0xb2cdd687dc0805f003a7020765886db5136b0db7
MetaID: 0xbaf2292f199e95964f793c4b746c24b2f82d1d92
MetadiumIdentityManager: 0x7fc9f6c286549902e4101241e5b8b9b88a021a3e

07/08 저녁

MetadiumNameService: 0xb2cdd687dc0805f003a7020765886db5136b0db7
MetaID: 0xbaf2292f199e95964f793c4b746c24b2f82d1d92
MetadiumIdentityManager: 0xacc650c912df6a92c0eb3a81843ada08f9f04b2f

07/30 
newMIM = '0xb2f709afef65f7ed00d2465fff766418df5bd856'
MIM : 0xb2f709afef65f7ed00d2465fff766418df5bd856


mim = mimContract.at(newMIM)
mns.setPermission("MetaID",newMIM,'true',{from:eth.accounts[2]})
mim.setMetadiumNameServiceAddress('0xb2cdd687dc0805f003a7020765886db5136b0db7',{from:eth.accounts[2]})
mns.setContractDomain("MetadiumIdentityManager",newMIM,{from:eth.accounts[2]})


mns.getContractAddress("MetadiumIdentityManager")
mns.setPermission("MetaID",'0xacc650c912df6a92c0eb3a81843ada08f9f04b2f','false',{from:eth.accounts[2]})
mns.setPermission("MetaID",'0x9179bedafbfe602b8b5f7d551690603741eb1b68','false',{from:eth.accounts[2]})
mns.getPermission("MetaID",'0xacc650c912df6a92c0eb3a81843ada08f9f04b2f')
mns.getPermission("MetaID",'0x9179bedafbfe602b8b5f7d551690603741eb1b68')
mns.getPermission("MetaID",'0xb2f709afef65f7ed00d2465fff766418df5bd856')
0xb2f709afef65f7ed00d2465fff766418df5bd856