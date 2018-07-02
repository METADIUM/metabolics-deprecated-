const MetadiumIdentityManager = artifacts.require('MetadiumIdentityManager.sol')
const MetadiumNameService = artifacts.require('MetadiumNameService.sol')
const MetaID = artifacts.require('MetaID.sol')


async function deploy(deployer) {
    const args = process.argv.slice()
    //console.log('args length :', args.length)
    //console.log('args  :', args[0], args[1], args[2], args[3])
    _nonce = 20
    if (args[3] == 'all') {
        var _name='Metadium';
        var _symbol='META';
        var proxy1 = '0x084f8293F1b047D3A217025B24cd7b5aCe8fC657'; //node3 account[1]
        //deployer.deploy(MetadiumIdentityManager, name, symbol);
        return deployer.deploy(MetadiumNameService,{gas:3000000, gasPrice:1000}).then((mns)=>{
            return deployer.deploy(MetaID, _name, _symbol,{gas:3000001, gasPrice:1001}).then((mid)=>{
                return deployer.deploy(MetadiumIdentityManager,{gas:4000002, gasPrice:1002}).then(async function initialSetup(mim){
                    
                    //mns: name, permission setup
                    await mns.setContractDomain("MetaID", mid.address,{gas:3000002, gasPrice:1002})
                    await mns.setContractDomain("MetadiumIdentityManager", mim.address,{gas:3000002, gasPrice:1002})
                    await mns.setPermission("MetadiumIdentityManager", proxy1, "true",{gas:3000002, gasPrice:1002})
                    await mns.setPermission("MetaID", mim.address, "true",{gas:3000002, gasPrice:1002})
                    await mim.setMetadiumNameServiceAddress(mns.address,{gas:3000002, gasPrice:1002})
                    await mid.setMetadiumNameServiceAddress(mns.address,{gas:3000002, gasPrice:1002})
                    
                })
            })
        })
        

        
    }
}
//proxy1 address : 0x084f8293F1b047D3A217025B24cd7b5aCe8fC657
//proxy1 private key : 348a1e57efc055f3b8243f6e78fb18d0508f68d6f2e7cadf92b87e84a0b51024
//this is node3 account[1]

module.exports = deploy


// mim = MetadiumNameService.at(MetadiumNameService.address)

// truffle migrate metadium --reset
/*
module.exports = deployer => {
    const args = process.argv.slice()
    //console.log('args length :', args.length)
    //console.log('args  :', args[0], args[1], args[2], args[3])

    if (args[3] == 'all') {
        var name='Metadium';
        var symbol='META';
        //deployer.deploy(MetadiumIdentityManager, name, symbol);
        deployer.deploy(MetadiumIdentityManager);
    }
    
}
*/

// Running migration: 2_deploy_contracts.js
//   Replacing MetadiumNameService...
//   ... 0x821a9dd1b8396368e67be2bcd74ed0162ca3da83a4459fefc0ffbb2325612b48
//   MetadiumNameService: 0x24211f4606e1e069df4a1f34ebd47f963a888ce2
// 20
//   Replacing MetaID...
//   ... 0x37577dfa7e954f7d73ab9acfb3eb5c904cabc9c8d0dc9fb3fb8672107435edef
//   MetaID: 0xa5fe169bf0e17a44d38a0dcf4b340f9783165c77
// 20
//   Replacing MetadiumIdentityManager...
//   ... 0x67d3f703556857329c0ec075cfb5fdbee1afdcaa8f07914eedc9768ba1708a83
//   MetadiumIdentityManager: 0xc0b39803ae89ffa15b06a9b2784a1504b48eeb30
// 20
//   ... 0xddeae03df0a61104c2650246f8ddfa891a047defbb83cc6716566d2a94ce06c4
//   ... 0x4f07dc4b8bea219e697d940e29fa929f889da40f58f73f118adbfde4f48d3e4b
//   ... 0xa97b2ac75fc63c014d90a543ca9847557d55bf5b3463cd81589bc0047c9bd07f
//   ... 0xe0c2bbd76bb42e82e6c4444170c38f31fb535d6d5b33bafc7cbeee451c1a7f6a
//   ... 0x0c83c544af8149ca9858a2d94dfc380008effc027c7022c46eedf44bbc36e250
//   ... 0xfc119b2cabc8a935041088dc155220c667a5df9ecb97e63c5ce37d721e7d2abc