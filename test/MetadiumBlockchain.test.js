import assertRevert from './helpers/assertRevert';
import EVMRevert from './helpers/EVMRevert';

const BigNumber = web3.BigNumber;

require('chai')
    .use(require('chai-as-promised'))
    .use(require('chai-bignumber')(BigNumber))
    .should();

const Metadium = artifacts.require('Metadium');
const MetaID = artifacts.require('MetaID');
const CIS = artifacts.require('CIS');
const MasterContract = artifacts.require('MasterContract');

contract('Metadium Blockchain Simulation', function ([deployer, owner, user1, anotherAccount, anotherAccount2]) {
    const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
    const INITIAL_SUPPLY = 2000000000 * 10 ** 18;

    beforeEach(async function () {
        this.metadium = await Metadium.new({ from: owner });
        this.metaID = await MetaID.new("metaID", "mt", { from: owner });
        this.CIS = await CIS.new({ from: owner });
        this.masterContract = await MasterContract.new({ from: owner });

    });

    describe('Register Contracts to the Master Contract', function () {
        beforeEach(async function () {
            this.masterContract.set("MetaID", this.metaID.address, { from: owner });
            this.masterContract.set("Metadium", this.metadium.address, { from: owner });

            this.CIS.setMasterContractAddress(this.masterContract.address, { from: owner });

            await this.metadium.transfer(this.CIS.address, 100 * (10 **18), { from: owner });

            
        });
        it('A user who registered new meta ID gets metadium', async function () {
            const randomTokenID = 123456;
            const exampleMetaID = "thisismetaID";
            this.CIS.registerNewID(user1, randomTokenID,exampleMetaID , { from: owner })

            var userBalance = await this.metadium.balanceOf(user1);
            console.log('balance : ', userBalance);
            assert.equal(userBalance, 10**18);

            const randomTokenID2 = 1234567;
            const exampleMetaID2 = "thisismetaID";

            this.CIS.registerNewID(user1, randomTokenID2,exampleMetaID2 , { from: owner })

            userBalance = await this.metadium.balanceOf(user1);
            var complements = new BigNumber(3* 10**18)
            assert.equal(userBalance.toString(), complements.toString());

        });

    });

});
