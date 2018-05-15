const IDToken721DB = artifacts.require('IDToken721DB.sol')
// truffle migrate metadium --reset
module.exports = deployer => {
    const args = process.argv.slice()
    //console.log('args length :', args.length)
    //console.log('args  :', args[0], args[1], args[2], args[3])

    if (args[3] == 'IDToken721DB') {
        var name='Metadium';
        var symbol='META';
        deployer.deploy(IDToken721DB, name, symbol);
    }
}
