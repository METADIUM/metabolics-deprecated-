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

contract('Metadium Identity Manager Test', function ([deployer, owner, user1, anotherAccount, anotherAccount2]) {
    const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
    const INITIAL_SUPPLY = 2000000000 * 10 ** 18;

    beforeEach(async function () {
        this.metaID = await MetaID.new("MetaID", "META", { from: owner });
        this.metadiumIdentityManager = await MetadiumIdentityManager.new({ from: owner });
        this.metadiumNameService = await MetadiumNameService.new({ from: owner });

        this.metadiumNameService.setContractDomain("MetaID", this.metaID.address, { from: owner });
        this.metadiumNameService.setContractDomain("metadiumIdentityManager", this.metadiumIdentityManager.address, { from: owner });
        this.metadiumIdentityManager.setMetadiumNameServiceAddress(this.metadiumNameService.address, { from: owner });

    });

    describe('Contract basic function test', function () {
        beforeEach(async function () {
            
            
        });
        // test basic functions
        it('Contract can extract address from the metaPackage', async function () {
            const _metaPackage = "ab1234123412341234123456785678567856785678ab1234123412341234123456785678567856785678"
            var _addr = await this.metadiumIdentityManager.getAddressFromMetaPackage(_metaPackage, { from: owner });
            assert.equal(_addr,"0x1234123412341234123456785678567856785678");

            /*
            const randomTokenID = 123456;
            const exampleMetaID = "thisismetaID";
            this.metadiumIdentityManager.registerNewID(user1, randomTokenID,exampleMetaID , { from: owner })

            var userBalance = await this.metadium.balanceOf(user1);
            console.log('balance : ', userBalance);
            assert.equal(userBalance, 10**18);

            const randomTokenID2 = 1234567;
            const exampleMetaID2 = "thisismetaID";

            this.metadiumIdentityManager.registerNewID(user1, randomTokenID2,exampleMetaID2 , { from: owner })

            userBalance = await this.metadium.balanceOf(user1);
            var complements = new BigNumber(3* 10**18)
            assert.equal(userBalance.toString(), complements.toString());
            */
            //assert.equal("good","good");

        });
        // get address from bytes
        it('A user who registered new meta ID gets metadium', async function () {
            /*
            const randomTokenID = 123456;
            const exampleMetaID = "thisismetaID";
            this.metadiumIdentityManager.registerNewID(user1, randomTokenID,exampleMetaID , { from: owner })

            var userBalance = await this.metadium.balanceOf(user1);
            console.log('balance : ', userBalance);
            assert.equal(userBalance, 10**18);

            const randomTokenID2 = 1234567;
            const exampleMetaID2 = "thisismetaID";

            this.metadiumIdentityManager.registerNewID(user1, randomTokenID2,exampleMetaID2 , { from: owner })

            userBalance = await this.metadium.balanceOf(user1);
            var complements = new BigNumber(3* 10**18)
            assert.equal(userBalance.toString(), complements.toString());
            */
        });

    });

});
