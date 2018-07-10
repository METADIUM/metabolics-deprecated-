//import assertRevert from './helpers/assertRevert';
//import EVMRevert from './helpers/EVMRevert';

const BigNumber = web3.BigNumber;

require('chai')
    .use(require('chai-as-promised'))
    .use(require('chai-bignumber')(BigNumber))
    .should();

const MetaID = artifacts.require('MetaID');
const MetadiumIdentityManager = artifacts.require('MetadiumIdentityManager');
const MetadiumNameService = artifacts.require('MetadiumNameService');

contract('Metadium Identity Manager', function ([deployer, owner, proxy1, user1, user2, proxy2]) {
    const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
    const INITIAL_SUPPLY = 2000000000 * 10 ** 18;
    
    beforeEach(async function () {

        this.metaID = await MetaID.new("MetaID", "META", { from: owner });
        this.metadiumIdentityManager = await MetadiumIdentityManager.new({ from: owner });
        this.metadiumNameService = await MetadiumNameService.new({ from: owner });
        this.metadiumNameService.setContractDomain("MetaID", this.metaID.address, { from: owner });
        this.metadiumNameService.setContractDomain("MetadiumIdentityManager", this.metadiumIdentityManager.address, { from: owner });
        this.metadiumNameService.setPermission("MetadiumIdentityManager", proxy1, "true" , { from: owner });
        this.metadiumNameService.setPermission("MetaID", this.metadiumIdentityManager.address , "true" , { from: owner });
        this.metadiumIdentityManager.setMetadiumNameServiceAddress(this.metadiumNameService.address, { from: owner });
        this.metaID.setMetadiumNameServiceAddress(this.metadiumNameService.address, { from: owner });

    });
    describe('Contract basic function test', function () {
        describe('Contract basic function test', function () {
            beforeEach(async function () {


            });
            // test basic functions
            it('Contract can extract address from the metaPackage', async function () {
                
                assert.equal(true,true);
    
    
            });
        });
        beforeEach(async function () {


        });
        // test basic functions
        it('Contract can extract address from the metaPackage', async function () {
            
            assert.equal(true,true);


        });
    })
    describe('Contract basic function test', function () {
        beforeEach(async function () {


        });
        // test basic functions
        it('Contract can extract address from the metaPackage', async function () {
            const _metaPackage = "0x0132f89cbab807ea4de1fc5ba13cd164f1795a84fe1234123412341234123456785678567856785678ab"
            var _addr = await this.metadiumIdentityManager.getAddressFromMetaPackage(_metaPackage, { from: owner });
            assert.equal(_addr, "0x32f89cbab807ea4de1fc5ba13cd164f1795a84fe");


        });
        
        it('Contract can verify with ecdsa signature', async function () {
            
            const metaID = "0x1b442640e0333cb03054940e3cda07da982d2b57af68c3df8d0557b47a77d0bc";
            const hashMetaID = web3.sha3(metaID, {encoding: 'hex'}) // 0x48e6ec26e0f025fdd77f0fc8017f9d2c73f26cc1afa3a163c92c0408ad9b514c
            //var signedMetaID = web3.eth.sign(owner,hashMetaID); 원래 쓰던거
            var signedMetaID = web3.eth.sign(owner,metaID);

            var _result = await this.metadiumIdentityManager.ecverify(metaID, signedMetaID, owner, { from: owner });
            //var hash = web3.sha3(metaID, {encoding: 'hex'});// 0x48e6ec26e0f025fdd77f0fc8017f9d2c73f26cc1afa3a163c92c0408ad9b514c == solidity sha3
            //var hash2 = web3.sha3(metaID);// 0x4686941a4855346945b1e529201897ba689ad3657110220cf117d9ec01ac524b

            
            
            assert.equal(_result, true)
            
        });

        
        it('authorized member can register new user\'s erc721 metaID token ', async function () {
            const _metaPackage = "0x0132f89cbab807ea4de1fc5ba13cd164f1795a84fe65656565656565656565656565656565656565656565"
            //const _metaPackage = "0x01084f8293f1b047d3a217025b24cd7b5ace8fc65765656565656565656565656565656565656565656565" for node3 geth proxy1
            //0x084f8293f1b047d3a217025b24cd7b5ace8fc657
            const metaID = "0x1b442640e0333cb03054940e3cda07da982d2b57af68c3df8d0557b47a77d0bc";
            const hashMetaID = web3.sha3(metaID, {encoding: 'hex'})
            //var signedMetaID = web3.eth.sign(owner,hashMetaID)
            var signedMetaID = web3.eth.sign(owner,metaID)
            
            //var per = await this.metadiumNameService.getPermission("MetadiumIdentityManager", owner,{from:owner});
            
            await this.metadiumIdentityManager.createMetaID(metaID, signedMetaID, _metaPackage, { from: proxy1, gas:2000000 });
            //check whether token minted
            var tokenIDFromContract = await this.metaID.tokenOfOwnerByIndex(owner, 0);
            var tokenID = 12332856527561918398656559670597772716224198208786829738281751814729075511484 // decimal of hashMetaID
            assert.equal(tokenIDFromContract, tokenID)
            var _balance = await this.metaID.balanceOf(owner)

            assert.equal(_balance, 1)

            var _tokenID1 = "12332856527561918398656559670597772716224198208786829738281751814729075511484" // decimal version of metaID
            var _tokenOwner = await this.metaID.ownerOf(_tokenID1)
            assert.equal(_tokenOwner, owner)
            
            //ERC721's tokenURI doesn't work because of js error. It cannot return arbitrary bytes as string.
            var _uri = await this.metaID.tokenURIAsBytes(_tokenID1); 
            assert.equal(_metaPackage, _uri)
                        
        });

        it('authorized member can delete new user\'s erc721 metaID token ', async function () {
            const _metaPackage = "0x0132f89cbab807ea4de1fc5ba13cd164f1795a84fe65656565656565656565656565656565656565656565"
            const metaID = "0x1b442640e0333cb03054940e3cda07da982d2b57af68c3df8d0557b47a77d0bc";
            //var signedMetaID = web3.eth.sign(owner,hashMetaID)
            var signedMetaID = web3.eth.sign(owner,metaID)
            //"0x1b442640e0333cb03054940e3cda07da982d2b57af68c3df8d0557b47a77d0bc","0xab"
            //"0x1b442640e0333cb03054940e3cda07da982d2b57af68c3df8d0557b47a77d0bc","0x5b39bb16"
            //var per = await this.metadiumNameService.getPermission("MetadiumIdentityManager", owner,{from:owner});
            //console.log(`metaID : ${metaID} \n signedMetaID : ${signedMetaID}\n`)
            await this.metadiumIdentityManager.createMetaID(metaID, signedMetaID, _metaPackage, { from: proxy1, gas:2000000 });
            
            //check whether token minted
            var _balance = await this.metaID.balanceOf(owner)
            assert.equal(_balance, 1)


            var timestamp = Math.floor(Date.now() / 1000).toString(16) // "ab01cd"
            var metaIDAndTimeStamp = metaID.concat(timestamp)
            var signedMetaIDAndTimestamp = web3.eth.sign(owner, metaIDAndTimeStamp)
            
            timestamp = "0x" + timestamp;
            
            //console.log(`${signedMetaIDAndTimestamp}`)
            
            await this.metadiumIdentityManager.deleteMetaID(metaID, timestamp, signedMetaIDAndTimestamp, { from: proxy1, gas:2000000, gasPrice:10});
            //var cons = await this.metadiumIdentityManager.ecverifyWithTimestamp(metaID, timestamp, signedMetaIDAndTimestamp,owner, { from: proxy1, gas:2000000, gasPrice:10 });

            //check whether token burned
            _balance = await this.metaID.balanceOf(owner)
            //console.log(_balance)
            assert.equal(_balance, 0)
            
            /*
            metaID = "0x1b442640e0333cb03054940e3cda07da982d2b57af68c3df8d0557b47a77d0bc"
            timestamp = "0x5b39bb16"
            idtime = "0x1b442640e0333cb03054940e3cda07da982d2b57af68c3df8d0557b47a77d0bc5b39bb16"
            signedMetaIDAndTimestamp = "0x982852773adbf0f8e89beb3bdaaebcdb56c57ef4afefed7135f6cad43da956e83252a3324efb2f2e9641580b36339705818bd5475f488f1d31ab8d12245c9c891c"
            signer = "0x084f8293f1b047d3a217025b24cd7b5ace8fc657"
            "0x1b442640e0333cb03054940e3cda07da982d2b57af68c3df8d0557b47a77d0bc","0x5b39bb16","0x982852773adbf0f8e89beb3bdaaebcdb56c57ef4afefed7135f6cad43da956e83252a3324efb2f2e9641580b36339705818bd5475f488f1d31ab8d12245c9c891c","0x084f8293f1b047d3a217025b24cd7b5ace8fc657"
            "0x1b442640e0333cb03054940e3cda07da982d2b57af68c3df8d0557b47a77d0bc","0x5b39d0df","0x537aaf13384c03f30e70b3e4a97903f3c61749e863db7b893394a6333d0fc91d228cf53dd04eb9a789fd1a783931d889c3c8de450fa88fdc6ff1deff9d369ddb00"
            */
        });

        it('authorized member can update new user\'s erc721 metaID token ', async function () {
            const _metaPackage = "0x0132f89cbab807ea4de1fc5ba13cd164f1795a84fe65656565656565656565656565656565656565656565"
            const metaID = "0x1b442640e0333cb03054940e3cda07da982d2b57af68c3df8d0557b47a77d0bc";
            const hashMetaID = web3.sha3(metaID, {encoding: 'hex'})
            //const signedMetaID = web3.eth.sign(owner,hashMetaID)
            const signedMetaID = web3.eth.sign(owner,metaID)
            const _newMetaPackage = "0x0132f89cbab807ea4de1fc5ba13cd164f1795a84fe878787878787878787878787878787878787878787"
            const newMetaID = "0x2b442640e0333cb03054940e3cda07da982d2b57af68c3df8d0557b47a77d0bc";
            const newHashMetaID = web3.sha3(newMetaID, {encoding: 'hex'})
            //const newsignedMetaID = web3.eth.sign(owner,newHashMetaID)
            const newsignedMetaID = web3.eth.sign(owner,newMetaID)
            
            //var per = await this.metadiumNameService.getPermission("MetadiumIdentityManager", owner,{from:owner});
            await this.metadiumIdentityManager.createMetaID(metaID, signedMetaID, _metaPackage, { from: proxy1, gas:2000000 });
            
            //check whether token minted
            var _balance = await this.metaID.balanceOf(owner)
            assert.equal(_balance, 1)

            await this.metadiumIdentityManager.updateMetaID(metaID, newMetaID, newsignedMetaID, _newMetaPackage, { from: proxy1, gas:2000000, gasPrice:10 });
            //check whether old token burned and newly minted
            _balance = await this.metaID.balanceOf(owner)
            assert.equal(_balance, 1)
            
            var _uri = await this.metaID.tokenURIAsBytes(newMetaID); 
            assert.equal(_newMetaPackage, _uri)

        });

        it('authorized member can restore new user\'s erc721 metaID token with new user address', async function () {
            const _metaPackage = "0x0132f89cbab807ea4de1fc5ba13cd164f1795a84fe65656565656565656565656565656565656565656565"
            const metaID = "0x1b442640e0333cb03054940e3cda07da982d2b57af68c3df8d0557b47a77d0bc";
            //const hashMetaID = web3.sha3(metaID, {encoding: 'hex'})
            const signedMetaID = web3.eth.sign(owner,metaID)
            const _newMetaPackage = "0x011db530ced50e1bc77e724d4d3705c1630c8a9ba86170687878787878787878787878787878787878787878"
            const newMetaID = "0x2b442640e0333cb03054940e3cda07da982d2b57af68c3df8d0557b47a77d0bc";
            const newAddress = "0x1db530ced50e1bc77e724d4d3705c1630c8a9ba8" // user1
            //const newsignedMetaID = web3.eth.sign(owner,newHashMetaID)
            const newsignedMetaID = web3.eth.sign(user1, newMetaID)
            
            //var per = await this.metadiumNameService.getPermission("MetadiumIdentityManager", owner,{from:owner});
            await this.metadiumIdentityManager.createMetaID(metaID, signedMetaID, _metaPackage, { from: proxy1, gas:2000000 });
            
            //check whether token minted
            var _balance = await this.metaID.balanceOf(owner)
            assert.equal(_balance, 1)

            await this.metadiumIdentityManager.restoreMetaID(metaID, newMetaID, owner, newsignedMetaID, _newMetaPackage, { from: proxy1, gas:2000000, gasPrice:10 });

            //check whether old token burned and newly minted
            _balance = await this.metaID.balanceOf(user1)
            assert.equal(_balance, 1)
            
            var _uri = await this.metaID.tokenURIAsBytes(newMetaID); 
            assert.equal(_newMetaPackage, _uri)

        });

    });

});
/*
MetadiumIdentityManager
each test must have test about permission

createMetaID

deleteMetaID

updateMetaID

restoreMetaID



-----------------------
ownerOf

tokenURI

tokenURIAsBytes

balanceOf

tokenOfOwnerByIndex

ecverify

ecverifyWithTimestamp

getAddressFromMetaPackage

setMetadiumNameServiceAddress
------------------------


*/

/*
MetadiumNameService

setContractDomain
getContractAddress
setPermission
getPermission

*/


/*
MetaID

mint
burn
tokenURIAsBytes
transferFrom
safeTransferFrom1
safeTransferFrom2
approve
setApprovalForAll

*/