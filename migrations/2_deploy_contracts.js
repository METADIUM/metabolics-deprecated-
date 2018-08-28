const MetadiumIdentityManager = artifacts.require('MetadiumIdentityManager.sol')
const MetadiumNameService = artifacts.require('MetadiumNameService.sol')
const MetaID = artifacts.require('MetaID.sol')

async function deploy(deployer) {
    const args = process.argv.slice()
    _gas = 3000000
    _gasPrice = 1000
    if (args[3] == 'all') {
        var _name='Metadium';
        var _symbol='META';
        
        //proxy create metaID instead user for now. Because users do not have enough fee.
        var proxy1 = '0x084f8293F1b047D3A217025B24cd7b5aCe8fC657'; //node3 account[1]

        return deployer.deploy(MetadiumNameService,{gas:_gas, gasPrice:_gasPrice}).then((mns)=>{
            return deployer.deploy(MetaID, _name, _symbol,{gas:_gas, gasPrice:_gasPrice}).then((mid)=>{
                return deployer.deploy(MetadiumIdentityManager,{gas:_gas, gasPrice:_gasPrice}).then(async function initialSetup(mim){
                    
                    //mns: name, permission setup
                    await mns.setContractDomain("MetaID", mid.address,{gas:_gas, gasPrice:_gasPrice})
                    await mns.setContractDomain("MetadiumIdentityManager", mim.address,{gas:_gas, gasPrice:_gasPrice})
                    await mns.setPermission("MetadiumIdentityManager", proxy1, "true",{gas:_gas, gasPrice:_gasPrice})
                    await mns.setPermission("MetaID", mim.address, "true",{gas:_gas, gasPrice:_gasPrice})
                    await mim.setMetadiumNameServiceAddress(mns.address,{gas:_gas, gasPrice:_gasPrice})
                    await mid.setMetadiumNameServiceAddress(mns.address,{gas:_gas, gasPrice:_gasPrice})
                    
                })
            })
        })
        

        
    }
}
module.exports = deploy

