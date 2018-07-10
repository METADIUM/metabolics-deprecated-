import assertRevert from './helpers/assertRevert';
import EVMRevert from './helpers/EVMRevert';

const BigNumber = web3.BigNumber;

require('chai')
    .use(require('chai-as-promised'))
    .use(require('chai-bignumber')(BigNumber))
    .should();

const MetaID = artifacts.require('MetaID');
const MetadiumIdentityManager = artifacts.require('MetadiumIdentityManager');
const MetadiumNameService = artifacts.require('MetadiumNameService');

contract('Metadium Identity Manager', function ([deployer, owner, proxy1, proxy2, user1, user2]) {
    const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
    const INITIAL_SUPPLY = 2000000000 * 10 ** 18;
    const defaultGas = 5000000;
    const defaultGasPrice = 10;
    var metaPackage = "0x01" + user1.slice(2) + "1234123412341234123456785678567856785678ab0132f89cbab807ea4de1fc5ba13cd164f1795a84fe1234123412341234123456785678567856785678abab"
    //console.log(`!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!metaPackage : ${metaPackage}`)
    //var metaPackage = "0x0132f89cbab807ea4de1fc5ba13cd164f1795a84fe1234123412341234123456785678567856785678ab0132f89cbab807ea4de1fc5ba13cd164f1795a84fe1234123412341234123456785678567856785678abab"
    var metaID = "0x1b442640e0333cb03054940e3cda07da982d2b57af68c3df8d0557b47a77d0bc";
    var signedMetaID = web3.eth.sign(user1, metaID);

    beforeEach(async function () {
        this.metaID = await MetaID.new("MetaID", "META", { from: owner, gas: defaultGas });
        this.metadiumIdentityManager = await MetadiumIdentityManager.new({ from: owner, gas: defaultGas });
        this.metadiumNameService = await MetadiumNameService.new({ from: owner, gas: defaultGas });

        this.metaID.setMetadiumNameServiceAddress(this.metadiumNameService.address, { from: owner, gas: defaultGas });
        this.metadiumNameService.setContractDomain("MetaID", this.metaID.address, { from: owner, gas: defaultGas });
        this.metadiumNameService.setContractDomain("MetadiumIdentityManager", this.metadiumIdentityManager.address, { from: owner, gas: defaultGas });
        /*
            this.metadiumNameService.setContractDomain("MetaID", this.metaID.address, { from: owner });
            this.metadiumNameService.setContractDomain("MetadiumIdentityManager", this.metadiumIdentityManager.address, { from: owner });
            this.metadiumNameService.setPermission("MetadiumIdentityManager", proxy1, "true", { from: owner });
            this.metadiumNameService.setPermission("MetaID", this.metadiumIdentityManager.address, "true", { from: owner });
            this.metadiumIdentityManager.setMetadiumNameServiceAddress(this.metadiumNameService.address, { from: owner });
            this.metadiumIdentityManager.setMetaIDAddress(this.metaID.address, { from: owner });

        */
    });

    describe('Create MetaID', function () {
        beforeEach(async function () {

        });
        describe('when contracts are not linked', function () {
            it('when contracts are not linked, reverts', async function () {
                await assertRevert(this.metadiumIdentityManager.createMetaID(metaID, signedMetaID, metaPackage, { from: proxy1, gas: defaultGas }));
            });
        });

        describe('when contracts are linked', function () {
            beforeEach(async function () {

                this.metadiumIdentityManager.setMetadiumNameServiceAddress(this.metadiumNameService.address, { from: owner, gas: defaultGas });
                this.metadiumIdentityManager.setMetaIDAddress(this.metaID.address, { from: owner, gas: defaultGas });
            });
            describe('when not permissioned', function () {
                it('reverts', async function () {
                    await assertRevert(this.metadiumIdentityManager.createMetaID(metaID, signedMetaID, metaPackage, { from: proxy1, gas: defaultGas }));
                });
            });
            
            describe('when permissioned', function () {
                beforeEach(async function () {
                    this.metadiumNameService.setPermission("MetadiumIdentityManager", proxy1, "true", { from: owner, gas: defaultGas });
                    this.metadiumNameService.setPermission("MetaID", this.metadiumIdentityManager.address, "true", { from: owner, gas: defaultGas });
                });
                describe('when metaPackage length is not correct', function () {
                    it('reverts', async function () {
                     //   var incorrectLengthMetaPackage = metaPackage + "abab"
                     //   await assertRevert(this.metadiumIdentityManager.createMetaID(metaID, signedMetaID, incorrectLengthMetaPackage, { from: proxy1, gas: defaultGas }));
                    });
                });
                
                describe('when metaPackage length is correct', function () {
                    describe('when address from ecverify using signature(metaID) doesn\'t match address from metaPackage', function () {
                        it('reverts', async function () {
                            var incorrectAddressMetaPackage = "0x01" + user2.slice(2) + "1234123412341234123456785678567856785678ab0132f89cbab807ea4de1fc5ba13cd164f1795a84fe1234123412341234123456785678567856785678abab"
                            await assertRevert(this.metadiumIdentityManager.createMetaID(metaID, signedMetaID, incorrectAddressMetaPackage, { from: proxy1, gas: defaultGas }));
                        });
                    });
                    
                    describe('when address from ecverify using signature(metaID) matches address from metaPackage', function () {
                        describe('when MetaID already exists', function () {
                            it('reverts', async function () {
                                assert.equal(true, true);
                            });
                        });
                        
                        describe('when MetaID not exists', function () {
                            it('create MetaID', async function () {
                                this.metadiumIdentityManager.createMetaID(metaID, signedMetaID, metaPackage, { from: proxy1, gas: defaultGas })
                                
                                var tokenIDFromContract = await this.metaID.tokenOfOwnerByIndex(user1, 0);
                                var tokenID = 12332856527561918398656559670597772716224198208786829738281751814729075511484 // decimal of hashMetaID
                                assert.equal(tokenIDFromContract, tokenID)
                                
                                var _balance = await this.metaID.balanceOf(user1)
                                assert.equal(_balance, 1)

                                var _tokenID1 = "12332856527561918398656559670597772716224198208786829738281751814729075511484" // decimal version of metaID
                                var _tokenOwner = await this.metaID.ownerOf(_tokenID1)
                                assert.equal(_tokenOwner, user1)

                                //ERC721's tokenURI doesn't work because of js error. It cannot return arbitrary bytes as string.
                                var _uri = await this.metaID.tokenURIAsBytes(_tokenID1);
                                assert.equal(metaPackage, _uri)
                                assert.equal(true, true);
                            });
                            it('emit CreateMetaID event', async function () {
                                assert.equal(true, true);
                            });
                        });
                        
                    });
                    
                });
                
            });
            
        });
        // test basic functions
    })
    
    /*
    it('Contract can extract address from the metaPackage', async function () {

        assert.equal(true, true);


    });
    */
    /*
     describe('Contract basic function test', function () {
         beforeEach(async function () {
 
 
         });
         // test basic functions
         it('Contract can extract address from the metaPackage', async function () {
             const _metaPackage = "0x0132f89cbab807ea4de1fc5ba13cd164f1795a84fe1234123412341234123456785678567856785678ab0132f89cbab807ea4de1fc5ba13cd164f1795a84fe1234123412341234123456785678567856785678abab"
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
             const _metaPackage = "0x0132f89cbab807ea4de1fc5ba13cd164f1795a84fe1234123412341234123456785678567856785678ab0132f89cbab807ea4de1fc5ba13cd164f1795a84fe1234123412341234123456785678567856785678abab"
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
             const _metaPackage = "0x0132f89cbab807ea4de1fc5ba13cd164f1795a84fe1234123412341234123456785678567856785678ab0132f89cbab807ea4de1fc5ba13cd164f1795a84fe1234123412341234123456785678567856785678abab"
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
             
         });
 
         it('authorized member can update new user\'s erc721 metaID token ', async function () {
             const _metaPackage = "0x0132f89cbab807ea4de1fc5ba13cd164f1795a84fe1234123412341234123456785678567856785678ab0132f89cbab807ea4de1fc5ba13cd164f1795a84fe1234123412341234123456785678567856785678abab"
             const metaID = "0x1b442640e0333cb03054940e3cda07da982d2b57af68c3df8d0557b47a77d0bc";
             const hashMetaID = web3.sha3(metaID, {encoding: 'hex'})
             //const signedMetaID = web3.eth.sign(owner,hashMetaID)
             const signedMetaID = web3.eth.sign(owner,metaID)
             const _newMetaPackage = "0x0132f89cbab807ea4de1fc5ba13cd164f1795a84fe1234123412341234123456785678567856785678ab0132f89cbab807ea4de1fc5ba13cd164f1795a84fe1234123412341234123456785678567856785678bcbc"
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
             const _metaPackage = "0x0132f89cbab807ea4de1fc5ba13cd164f1795a84fe1234123412341234123456785678567856785678ab0132f89cbab807ea4de1fc5ba13cd164f1795a84fe1234123412341234123456785678567856785678abab"
             const metaID = "0x1b442640e0333cb03054940e3cda07da982d2b57af68c3df8d0557b47a77d0bc";
             //const hashMetaID = web3.sha3(metaID, {encoding: 'hex'})
             const signedMetaID = web3.eth.sign(owner,metaID)
             const _newMetaPackage = "0x011db530ced50e1bc77e724d4d3705c1630c8a9ba81234123412341234123456785678567856785678ab0132f89cbab807ea4de1fc5ba13cd164f1795a84fe1234123412341234123456785678567856785678abab"
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
     */

});
/*
MetadiumIdentityManager
each test must have test about permission






createMetaID
when not contracts are linked
 reverts
when contracts are linked
 when not permissioned
  reverts
 when permissioned
  when metaPakcage length is not correct
   reverts
  when metaPakcage length is correct
   when address from ecverify using signature(metaID) 
    doesn't match address from metaPackage
     reverts
    matches address from metaPackage
     when MetaID already exists
      reverts
     when MetaID not exists
      createMetaID(mint)
      emit CreateMetaID event
   

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