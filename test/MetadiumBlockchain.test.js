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
        this.metadiumNameService.setPermission("MetadiumIdentityManager", owner, "true" , { from: owner });
        this.metadiumIdentityManager.setMetadiumNameServiceAddress(this.metadiumNameService.address, { from: owner });

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
            const hashMetaID = web3.sha3(metaID) // 0x4686941a4855346945b1e529201897ba689ad3657110220cf117d9ec01ac524b
            var sigendMetaID = web3.eth.sign(owner,hashMetaID);
            //var signedMetaID = web3.eth.sign(owner, metaID); //0xd737c9d5e55f0e89bc1198dd12ba5274957a42f53d8750619caef38de801430360e6286956c1c3726db4021510ed2ac3c37acbba9bcb056a0369b4cd159d063f00
            //var _result = await this.metadiumIdentityManager.ecverify(metaID, sigendMetaID, owner, { from: owner });
            //console.log(`web3.sha3 : ${hashMetaID}`)
            //console.log(`signedMetaID : ${signedMetaID}`)
            
            var _result = await this.metadiumIdentityManager.ecverify(hashMetaID, sigendMetaID, owner, { from: owner });
            
            assert.equal(_result, true)
            
        });

        
        it.only('authorized member can register new user\'s erc721 metaID token ', async function () {
            const _metaPackage = "0x0132f89cbab807ea4de1fc5ba13cd164f1795a84fe65656565656565656565656565656565656565656565"
            const metaID = "0x1b442640e0333cb03054940e3cda07da982d2b57af68c3df8d0557b47a77d0bc";
            const hashMetaID = web3.sha3(metaID)
            var sigendMetaID = web3.eth.sign(owner,hashMetaID)
            
            //var per = await this.metadiumNameService.getPermission("MetadiumIdentityManager", owner,{from:owner});
            
            await this.metadiumIdentityManager.createNewMetaID(hashMetaID, sigendMetaID, _metaPackage, { from: owner, gas:2000000 });
            //check whether token minted
            //var _addr = await this.metaID.tokenURI(hashMetaID, { from: owner });
            //var _addr = await this.metaID.tokenURI(uintMetaID, { from: owner });
            var tokenIDFromContract = await this.metaID.tokenOfOwnerByIndex(owner, 0);
            var tokenID = 31899679074544425229216118885577919972647828462196161673408641034862277186123 // decimal of hashMetaID
            
            assert.equal(tokenIDFromContract, tokenID)
            var _balance = await this.metaID.balanceOf(owner)
            assert.equal(_balance, 1)

            var tokenID1 = "31899679074544425229216118885577919972647828462196161673408641034862277186123"
            var _tokenOwner = await this.metaID.ownerOf(tokenID1)
            assert.equal(_tokenOwner, owner)
            var tokenID2 = "0x4686941a4855346945b1e529201897ba689ad3657110220cf117d9ec01ac524b"
            var _uri = await this.metaID.tokenURIAsBytes(tokenID1); 
            //console.log(_uri);
            assert.equal(_metaPackage, _uri)

        });

    });

});
