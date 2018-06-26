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

contract('Metadium Identity Manager Test', function ([deployer, owner, proxy1, user1, user2, proxy2]) {
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
            var sigendMetaID = web3.eth.sign(owner,hashMetaID);
            
            //var hash = web3.sha3(metaID, {encoding: 'hex'});// 0x48e6ec26e0f025fdd77f0fc8017f9d2c73f26cc1afa3a163c92c0408ad9b514c == solidity sha3
            //var hash2 = web3.sha3(metaID);// 0x4686941a4855346945b1e529201897ba689ad3657110220cf117d9ec01ac524b

            var _result = await this.metadiumIdentityManager.ecverify(metaID, sigendMetaID, owner, { from: owner });
            
            assert.equal(_result, true)
            
        });

        
        it('authorized member can register new user\'s erc721 metaID token ', async function () {
            const _metaPackage = "0x0132f89cbab807ea4de1fc5ba13cd164f1795a84fe65656565656565656565656565656565656565656565"
            //const _metaPackage = "0x01084f8293f1b047d3a217025b24cd7b5ace8fc65765656565656565656565656565656565656565656565" for node3 geth proxy1
            //0x084f8293f1b047d3a217025b24cd7b5ace8fc657
            const metaID = "0x1b442640e0333cb03054940e3cda07da982d2b57af68c3df8d0557b47a77d0bc";
            const hashMetaID = web3.sha3(metaID, {encoding: 'hex'})
            var sigendMetaID = web3.eth.sign(owner,hashMetaID)
            
            //var per = await this.metadiumNameService.getPermission("MetadiumIdentityManager", owner,{from:owner});
            
            await this.metadiumIdentityManager.createMetaID(metaID, sigendMetaID, _metaPackage, { from: proxy1, gas:2000000 });
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
            const hashMetaID = web3.sha3(metaID, {encoding: 'hex'})
            var sigendMetaID = web3.eth.sign(owner,hashMetaID)
            
            //var per = await this.metadiumNameService.getPermission("MetadiumIdentityManager", owner,{from:owner});
            await this.metadiumIdentityManager.createMetaID(metaID, sigendMetaID, _metaPackage, { from: proxy1, gas:2000000 });
            
            //check whether token minted
            var _balance = await this.metaID.balanceOf(owner)
            assert.equal(_balance, 1)

            await this.metadiumIdentityManager.deleteMetaID(metaID, sigendMetaID, _metaPackage, { from: proxy1, gas:2000000, gasPrice:10 });
            //check whether token burned
            _balance = await this.metaID.balanceOf(owner)
            //console.log(_balance)
            assert.equal(_balance, 0)
            
        });

        it('authorized member can update new user\'s erc721 metaID token ', async function () {
            const _metaPackage = "0x0132f89cbab807ea4de1fc5ba13cd164f1795a84fe65656565656565656565656565656565656565656565"
            const metaID = "0x1b442640e0333cb03054940e3cda07da982d2b57af68c3df8d0557b47a77d0bc";
            const hashMetaID = web3.sha3(metaID, {encoding: 'hex'})
            const sigendMetaID = web3.eth.sign(owner,hashMetaID)
            const _newMetaPackage = "0x0132f89cbab807ea4de1fc5ba13cd164f1795a84fe878787878787878787878787878787878787878787"
            const newMetaID = "0x2b442640e0333cb03054940e3cda07da982d2b57af68c3df8d0557b47a77d0bc";
            const newHashMetaID = web3.sha3(newMetaID, {encoding: 'hex'})
            const newSigendMetaID = web3.eth.sign(owner,newHashMetaID)
            
            //var per = await this.metadiumNameService.getPermission("MetadiumIdentityManager", owner,{from:owner});
            await this.metadiumIdentityManager.createMetaID(metaID, sigendMetaID, _metaPackage, { from: proxy1, gas:2000000 });
            
            //check whether token minted
            var _balance = await this.metaID.balanceOf(owner)
            assert.equal(_balance, 1)

            await this.metadiumIdentityManager.updateMetaID(metaID, newMetaID, newSigendMetaID, _newMetaPackage, { from: proxy1, gas:2000000, gasPrice:10 });
            //check whether old token burned and newly minted
            _balance = await this.metaID.balanceOf(owner)
            assert.equal(_balance, 1)
            
            var _uri = await this.metaID.tokenURIAsBytes(newMetaID); 
            assert.equal(_newMetaPackage, _uri)

        });

    });

});