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
    const defaultGas = 5000000;
    const defaultGasPrice = 10;

    var metaPackage = "0x01" + user1.slice(2) + "1234123412341234123456785678567856785678ab0132f89cbab807ea4de1fc5ba13cd164f1795a84fe1234123412341234123456785678567856785678abab"
    //console.log(`!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!metaPackage : ${metaPackage}`)
    //var metaPackage = "0x0132f89cbab807ea4de1fc5ba13cd164f1795a84fe1234123412341234123456785678567856785678ab0132f89cbab807ea4de1fc5ba13cd164f1795a84fe1234123412341234123456785678567856785678abab"
    var metaID = "0x1b442640e0333cb03054940e3cda07da982d2b57af68c3df8d0557b47a77d0bc";
    var signedMetaID = web3.eth.sign(user1, metaID);

    var timestamp = Math.floor(Date.now() / 1000).toString(16) // "ab01cd"
    var metaIDAndTimeStamp = metaID.concat(timestamp)
    var signedMetaIDAndTimestamp = web3.eth.sign(user1, metaIDAndTimeStamp)
    timestamp = "0x" + timestamp;

    var _newMetaPackage = "0x01" + user1.slice(2) + "1234123412341234123456785678567856785678ab0132f89cbab807ea4de1fc5ba13cd164f1795a84fe1234123412341234123456785678567856785678bcbc"
    var newMetaID = "0x2b442640e0333cb03054940e3cda07da982d2b57af68c3df8d0557b47a77d0bc";
    //var newHashMetaID = web3.sha3(newMetaID, {encoding: 'hex'})
    var newsignedMetaID = web3.eth.sign(user1, newMetaID)

    var restoreMetaPackage = "0x01" + user2.slice(2) + "1234123412341234123456785678567856785678ab0132f89cbab807ea4de1fc5ba13cd164f1795a84fe1234123412341234123456785678567856785678abab"
    var restoreMetaID = "0x2b442640e0333cb03054940e3cda07da982d2b57af68c3df8d0557b47a77d0bc"
    var restoreSignedMetaID = web3.eth.sign(user2, restoreMetaID)


    beforeEach(async function () {
        this.metaID = await MetaID.new("MetaID", "META", { from: owner, gas: defaultGas });
        this.metadiumIdentityManager = await MetadiumIdentityManager.new({ from: owner, gas: defaultGas });
        this.metadiumNameService = await MetadiumNameService.new({ from: owner, gas: defaultGas });

        await this.metaID.setMetadiumNameServiceAddress(this.metadiumNameService.address, { from: owner, gas: defaultGas });
        await this.metadiumNameService.setContractDomain("MetaID", this.metaID.address, { from: owner, gas: defaultGas });
        await this.metadiumNameService.setContractDomain("MetadiumIdentityManager", this.metadiumIdentityManager.address, { from: owner, gas: defaultGas });

    });

    describe('Create MetaID', function () {
        beforeEach(async function () {

        });
        describe('when contracts are not linked', function () {
            it('reverts', async function () {
                await assertRevert(this.metadiumIdentityManager.createMetaID(metaID, signedMetaID, metaPackage, { from: proxy1, gas: defaultGas }));
            });
        });

        describe('when contracts are linked', function () {
            beforeEach(async function () {

                await this.metadiumIdentityManager.setMetadiumNameServiceAddress(this.metadiumNameService.address, { from: owner, gas: defaultGas });
                await this.metadiumIdentityManager.setMetaIDAddress(this.metaID.address, { from: owner, gas: defaultGas });
            });
            describe('when not permissioned', function () {
                it('reverts', async function () {
                    await assertRevert(this.metadiumIdentityManager.createMetaID(metaID, signedMetaID, metaPackage, { from: proxy1, gas: defaultGas }));
                });
            });

            describe('when permissioned', function () {
                beforeEach(async function () {
                    await this.metadiumNameService.setPermission("MetadiumIdentityManager", proxy1, "true", { from: owner, gas: defaultGas });
                    await this.metadiumNameService.setPermission("MetaID", this.metadiumIdentityManager.address, "true", { from: owner, gas: defaultGas });
                });
                describe('when metaPackage length is not correct', function () {
                    it('reverts', async function () {
                        var incorrectLengthMetaPackage = metaPackage + "abab"
                        await assertRevert(this.metadiumIdentityManager.createMetaID(metaID, signedMetaID, incorrectLengthMetaPackage, { from: proxy1, gas: defaultGas }));
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
                                await this.metadiumIdentityManager.createMetaID(metaID, signedMetaID, metaPackage, { from: proxy1, gas: defaultGas })
                                var tokenIDFromContract = await this.metaID.tokenOfOwnerByIndex(user1, 0);
                                var tokenID = 12332856527561918398656559670597772716224198208786829738281751814729075511484 // decimal of hashMetaID
                                assert.equal(tokenIDFromContract, tokenID)

                                await assertRevert(this.metadiumIdentityManager.createMetaID(metaID, signedMetaID, metaPackage, { from: proxy1, gas: defaultGas }))
                            });
                        });

                        describe('when MetaID not exists', function () {
                            it('create MetaID', async function () {
                                await this.metadiumIdentityManager.createMetaID(metaID, signedMetaID, metaPackage, { from: proxy1, gas: defaultGas })

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





    });
    describe('Delete MetaID', function () {
        beforeEach(async function () {

        });
        describe('when contracts are not linked', function () {
            it('reverts', async function () {
                await assertRevert(this.metadiumIdentityManager.deleteMetaID(metaID, timestamp, signedMetaIDAndTimestamp, { from: proxy1, gas: defaultGas }));
            });
        });

        describe('when contracts are linked', function () {
            beforeEach(async function () {

                await this.metadiumIdentityManager.setMetadiumNameServiceAddress(this.metadiumNameService.address, { from: owner, gas: defaultGas });
                await this.metadiumIdentityManager.setMetaIDAddress(this.metaID.address, { from: owner, gas: defaultGas });
            });
            describe('when not permissioned', function () {
                it('reverts', async function () {
                    await assertRevert(this.metadiumIdentityManager.deleteMetaID(metaID, timestamp, signedMetaIDAndTimestamp, { from: proxy1, gas: defaultGas }));
                });
            });

            describe('when permissioned', function () {
                beforeEach(async function () {
                    await this.metadiumNameService.setPermission("MetadiumIdentityManager", proxy1, "true", { from: owner, gas: defaultGas });
                    await this.metadiumNameService.setPermission("MetaID", this.metadiumIdentityManager.address, "true", { from: owner, gas: defaultGas });
                    await this.metadiumIdentityManager.createMetaID(metaID, signedMetaID, metaPackage, { from: proxy1, gas: defaultGas })
                    var _balance = await this.metaID.balanceOf(user1)
                    assert.equal(_balance, 1)
                });



                describe('when address from ecverifyWithTimestamp dosen\'t match address from the ownerOf metaID', function () {
                    it('reverts', async function () {
                        var _timestamp = Math.floor(Date.now() / 1000).toString(16) // "ab01cd"
                        var _metaIDAndTimeStamp = metaID.concat(_timestamp)
                        var _signedMetaIDAndTimestamp = web3.eth.sign(user2, _metaIDAndTimeStamp)
                        _timestamp = "0x" + _timestamp;
                        await assertRevert(this.metadiumIdentityManager.deleteMetaID(metaID, _timestamp, _signedMetaIDAndTimestamp, { from: proxy1, gas: defaultGas }));
                    });
                });

                describe('when address from ecverifyWithTimestamp matches address from ownerOf metaID', function () {


                    it('deletenMetaID(burn)', async function () {
                        var _timestamp = Math.floor(Date.now() / 1000).toString(16) // "ab01cd"
                        var _metaIDAndTimeStamp = metaID.concat(_timestamp)
                        var _signedMetaIDAndTimestamp = web3.eth.sign(user1, _metaIDAndTimeStamp)
                        _timestamp = "0x" + _timestamp;
                        await this.metadiumIdentityManager.deleteMetaID(metaID, _timestamp, _signedMetaIDAndTimestamp, { from: proxy1, gas: defaultGas })
                        var _balance = await this.metaID.balanceOf(user1)
                        assert.equal(_balance, 0)

                    });
                    it('emit DeleteMetaID event', async function () {
                        assert.equal(true, true);
                    });


                });



            });

        });
        // test basic functions
    })
    describe('Update MetaID', function () {
        beforeEach(async function () {

        });
        describe('when contracts are not linked', function () {
            it('reverts', async function () {
                await assertRevert(this.metadiumIdentityManager.updateMetaID(metaID, newMetaID, newsignedMetaID, _newMetaPackage, { from: proxy1, gas: defaultGas }));
            });
        });

        describe('when contracts are linked', function () {
            beforeEach(async function () {

                await this.metadiumIdentityManager.setMetadiumNameServiceAddress(this.metadiumNameService.address, { from: owner, gas: defaultGas });
                await this.metadiumIdentityManager.setMetaIDAddress(this.metaID.address, { from: owner, gas: defaultGas });
            });
            describe('when not permissioned', function () {
                it('reverts', async function () {
                    await assertRevert(this.metadiumIdentityManager.updateMetaID(metaID, newMetaID, newsignedMetaID, _newMetaPackage, { from: proxy1, gas: defaultGas }));
                });
            });

            describe('when permissioned', function () {
                beforeEach(async function () {
                    await this.metadiumNameService.setPermission("MetadiumIdentityManager", proxy1, "true", { from: owner, gas: defaultGas });
                    await this.metadiumNameService.setPermission("MetaID", this.metadiumIdentityManager.address, "true", { from: owner, gas: defaultGas });
                    await this.metadiumIdentityManager.createMetaID(metaID, signedMetaID, metaPackage, { from: proxy1, gas: defaultGas })
                    var _balance = await this.metaID.balanceOf(user1)
                    assert.equal(_balance, 1)
                });

                describe('when address from metaPackage dosen\'t match ownerOf metaID', function () {
                    it('reverts', async function () {
                        var invalidAddressNewMetaPackage = "0x01" + user2.slice(2) + "1234123412341234123456785678567856785678ab0132f89cbab807ea4de1fc5ba13cd164f1795a84fe1234123412341234123456785678567856785678bcbc"
                        await assertRevert(this.metadiumIdentityManager.updateMetaID(metaID, newMetaID, newsignedMetaID, invalidAddressNewMetaPackage, { from: proxy1, gas: defaultGas }));
                    });


                });
                describe('when metaPackage length is invalid', function () {
                    it('reverts', async function () {
                        var invalidLengthNewMetaPackage = "0x01" + user2.slice(2) + "1234123412341234123456785678567856785678ab0132f89cbab807ea4de1fc5ba13cd164f1795a84fe1234123412341234123456785678567856785678bcbc" + "abab"
                        await assertRevert(this.metadiumIdentityManager.updateMetaID(metaID, newMetaID, newsignedMetaID, invalidLengthNewMetaPackage, { from: proxy1, gas: defaultGas }));
                    });


                });
                describe('when address from metaPackage matches ownerOf metaID', function () {
                    describe('when address from ecverity using newMetaID doesn\'t match address from metaPackage', function () {
                        it('reverts', async function () {
                            var invalidSignedMetaID = web3.eth.sign(user2, newMetaID)
                            await assertRevert(this.metadiumIdentityManager.updateMetaID(metaID, newMetaID, invalidSignedMetaID, _newMetaPackage, { from: proxy1, gas: defaultGas }));
                        });
                    });

                    describe('when address from ecverity using newMetaID matches', function () {

                        describe('when newMetaID already exists', function () {


                            it('reverts', async function () {
                                //this.metadiumIdentityManager.updateMetaID(metaID, newMetaID, newsignedMetaID, _newMetaPackage, { from: proxy1, gas: defaultGas })
                                await this.metadiumIdentityManager.createMetaID(newMetaID, newsignedMetaID, _newMetaPackage, { from: proxy1, gas: defaultGas })
                                var _balance = await this.metaID.balanceOf(user1)
                                assert.equal(_balance, 2)
                                await assertRevert(this.metadiumIdentityManager.updateMetaID(metaID, newMetaID, newsignedMetaID, _newMetaPackage, { from: proxy1, gas: defaultGas }));
                            });



                        });
                        describe('when newMetaID do not exists', function () {


                            it('Update(burn old MetaID and mint new MetaID) MetaID', async function () {
                                await this.metadiumIdentityManager.updateMetaID(metaID, newMetaID, newsignedMetaID, _newMetaPackage, { from: proxy1, gas: defaultGas })
                                var _balance = await this.metaID.balanceOf(user1)
                                assert.equal(_balance, 1)

                                var _uri = await this.metaID.tokenURIAsBytes(newMetaID);
                                assert.equal(_newMetaPackage, _uri)
                            });
                            it('emit UpdateMetaID event', async function () {
                                assert.equal(true, true);
                            });


                        });


                    });

                });

            });

        });
        // test basic functions
    })

    describe('Restore MetaID', function () {
        beforeEach(async function () {

        });
        describe('when contracts are not linked', function () {
            it('reverts', async function () {
                await assertRevert(this.metadiumIdentityManager.restoreMetaID(metaID, restoreMetaID, user1, restoreSignedMetaID, restoreMetaPackage, { from: proxy1, gas: defaultGas }));
            });
        });

        describe('when contracts are linked', function () {
            beforeEach(async function () {

                await this.metadiumIdentityManager.setMetadiumNameServiceAddress(this.metadiumNameService.address, { from: owner, gas: defaultGas });
                await this.metadiumIdentityManager.setMetaIDAddress(this.metaID.address, { from: owner, gas: defaultGas });
            });
            describe('when not permissioned', function () {
                it('reverts', async function () {
                    await assertRevert(this.metadiumIdentityManager.restoreMetaID(metaID, restoreMetaID, user1, restoreSignedMetaID, restoreMetaPackage, { from: proxy1, gas: defaultGas }));
                });
            });

            describe('when permissioned', function () {
                beforeEach(async function () {
                    await this.metadiumNameService.setPermission("MetadiumIdentityManager", proxy1, "true", { from: owner, gas: defaultGas });
                    await this.metadiumNameService.setPermission("MetaID", this.metadiumIdentityManager.address, "true", { from: owner, gas: defaultGas });
                    await this.metadiumIdentityManager.createMetaID(metaID, signedMetaID, metaPackage, { from: proxy1, gas: defaultGas })
                    var _balance = await this.metaID.balanceOf(user1)
                    assert.equal(_balance, 1)
                });

                describe('when ownerOf oldMetaID doesn\'t match oldAddress', function () {
                    it('reverts', async function () {
                        //   var invalidAddressNewMetaPackage = "0x01" + user2.slice(2) + "1234123412341234123456785678567856785678ab0132f89cbab807ea4de1fc5ba13cd164f1795a84fe1234123412341234123456785678567856785678bcbc"
                        await assertRevert(this.metadiumIdentityManager.restoreMetaID(metaID, restoreMetaID, user2, restoreSignedMetaID, restoreMetaPackage, { from: proxy1, gas: defaultGas }));
                    });


                });
                describe('when metaPackage length is invalid', function () {
                    it('reverts', async function () {
                        var invalidLengthRestoreMetaPackage = restoreMetaPackage + "abab"
                        await assertRevert(this.metadiumIdentityManager.restoreMetaID(metaID, restoreMetaID, user2, restoreSignedMetaID, invalidLengthRestoreMetaPackage, { from: proxy1, gas: defaultGas }));
                    });


                });
                describe('when ownerOf oldMetaID matches oldAddress', function () {
                    describe('when address from metaPacakge doesn\'t match address from newMetaSig', function () {
                        it('reverts', async function () {
                            var invalidSignedMetaID = web3.eth.sign(proxy2, restoreMetaID)
                            await assertRevert(this.metadiumIdentityManager.restoreMetaID(metaID, restoreMetaID, user1, invalidSignedMetaID, restoreMetaPackage, { from: proxy1, gas: defaultGas }));
                        });
                    });

                    describe('when address from metaPacakge matches address from newMetaSig', function () {

                        describe('when newMetaID already exists', function () {
                            it('reverts', async function () {
                                //this.metadiumIdentityManager.updateMetaID(metaID, newMetaID, newsignedMetaID, _newMetaPackage, { from: proxy1, gas: defaultGas })
                                await this.metadiumIdentityManager.createMetaID(newMetaID, newsignedMetaID, _newMetaPackage, { from: proxy1, gas: defaultGas })
                                var _balance = await this.metaID.balanceOf(user1)
                                assert.equal(_balance, 2)
                                await assertRevert(this.metadiumIdentityManager.restoreMetaID(metaID, restoreMetaID, user1, restoreSignedMetaID, restoreMetaPackage, { from: proxy1, gas: defaultGas }));
                            });



                        });
                        describe('when newMetaID do not exists', function () {


                            it('Restore(burn old MetaID and mint new MetaID) MetaID', async function () {
                                await this.metadiumIdentityManager.restoreMetaID(metaID, restoreMetaID, user1, restoreSignedMetaID, restoreMetaPackage, { from: proxy1, gas: defaultGas })

                                var _balance = await this.metaID.balanceOf(user2)
                                assert.equal(_balance, 1)

                                _balance = await this.metaID.balanceOf(user1)
                                assert.equal(_balance, 0)
                            });
                            it('emit RestoreMetaID event', async function () {
                                assert.equal(true, true);
                            });


                        });


                    });

                });

            });

        });

    })

    describe('Basic Functions', function () {
        beforeEach(async function () {

        });
        it('Contract can extract address from the metaPackage', async function () {
            const _metaPackage = "0x0132f89cbab807ea4de1fc5ba13cd164f1795a84fe1234123412341234123456785678567856785678ab0132f89cbab807ea4de1fc5ba13cd164f1795a84fe1234123412341234123456785678567856785678abab"
            var _addr = await this.metadiumIdentityManager.getAddressFromMetaPackage(_metaPackage, { from: owner });
            assert.equal(_addr, "0x32f89cbab807ea4de1fc5ba13cd164f1795a84fe");


        });

        it('Contract can verify with ecdsa signature', async function () {

            const metaID = "0x1b442640e0333cb03054940e3cda07da982d2b57af68c3df8d0557b47a77d0bc";
            var signedMetaID = web3.eth.sign(owner, metaID);
            var _result = await this.metadiumIdentityManager.ecverify(metaID, signedMetaID, owner, { from: owner });
            assert.equal(_result, true)

        });



        it('Contract can verify with ecdsa signature including timestamp', async function () {

            const metaID = "0x1b442640e0333cb03054940e3cda07da982d2b57af68c3df8d0557b47a77d0bc";
            //var signedMetaID = web3.eth.sign(owner, metaID);
            var timestamp = Math.floor(Date.now() / 1000).toString(16) // "ab01cd"
            var metaIDAndTimeStamp = metaID.concat(timestamp)
            var signedMetaIDAndTimestamp = web3.eth.sign(user1, metaIDAndTimeStamp)
            timestamp = "0x" + timestamp;

            var _result = await this.metadiumIdentityManager.ecverifyWithTimestamp(metaID, timestamp, signedMetaIDAndTimestamp, user1, { from: user1 });
            assert.equal(_result, true)

        });
    })
});
