// deploy.js

const fs = require('fs');
const Web3 = require('web3');
const Tx = require('ethereumjs-tx');

if (fs.existsSync('./truffle.js')) {
    eval(fs.readFileSync('./truffle.js')+'');
}

// Address getFirstAccount(Web3 web3)
async function getFirstAccount(web3) {
    try {
        accounts = await web3.eth.getAccounts();
        return accounts[0];
    } catch (e) {
        console.log(e);
        process.exit(1);
    }
}

// string getPassword()
async function getPassword() {
    prompt = require('password-prompt');
    return prompt("Enter the password: ", { method: "hide" });
}

// Wallet loadV3Wallet(string fileName, string password)
async function loadV3Wallet(fileName, password) {
    ew = require('ethereumjs-wallet');
    data = fs.readFileSync(fileName).toString('utf8');
    if (password == '-' || password == "")
        password = null;
    if (!password) {
        password = await getPassword();
    }
    return ew.fromV3(data, password);
}

// Address getDeployAccount(Web3 web3, Address acct, string passwd, string acctFile)
async function getDeployAccount(web3, acct, passwd, acctFile) {
    if (acct && web3.utils.isAddress(acct)) {
        return acct;
    } else if (acctFile) {
        if (passwd == '-' || passwd == '')
            passwd = null;
        w = await loadV3Wallet(acctFile, passwd)
        return w.getChecksumAddressString();
    } else {
        return await getFirstAccount(web3);
    }
}

// Address getContractAddress(Address contractAddress)
function getContractAddress(contractAddress) {
    if (contractAddress && web3.utils.isAddress(contractAddress)) {
        return contractAddress;
    } else {
        addr = process.env.ETHC_CONTRACT;
        return web3.utils.isAddress(addr) ? addr : null;
    }
}

// string getServerUrl(string url, string networkName)
function getServerUrl(url, networkName) {
    if (url) {
        return url;
    } else if (networkName) {
        try {
            x = module.exports.networks[networkName];
            if (!x || !x.host || !x.port) {
                return null;
            } else {
                return "http://" + x.host + ":" + x.port;
            }
        } catch (e) {
            return null;
        }
    } else {
        return null;
    }
}

// web3.eth.Contract loadJSONContract(string fn)
function loadJsonContract(jsonFileName) {
    var json = JSON.parse(fs.readFileSync(jsonFileName), 'utf8');
    var contract = new web3.eth.Contract(json.abi);
    contract.options.data = json.bytecode;
    return contract
}

// byte[] signTx(Web3 web3, Wallet acct, Tx tx)
async function signTx(web3, acct, tx) {
    if (!tx.nonce) {
        nonce = await web3.eth.getTransactionCount(acct.getChecksumAddressString());
        tx.nonce = web3.utils.toHex(nonce);
    }
    if (!tx.gasPrice) {
        gasPrice = await web3.eth.getGasPrice();
        tx.gasPrice = web3.utils.toHex(gasPrice);
    }
    if (!tx.gas)
        tx.gas = web3.utils.toHex(0x1000000);
    tx = new Tx(tx);
    tx.sign(acct.getPrivateKey());
    stx = tx.serialize();
    return '0x' + stx.toString('hex');
}

// byte[] signMethod(Web3 web3, Wallet acct, Contract contract, func method,
//                   Object args[], Transaction tx)
async function signMethod(web3, acct, contract, method, args, tx) {
    if (!tx)
        tx = {};
    else
        tx = Object.assign({}, tx);
    tx.to = contract.options.address;
    if (args)
        tx.data = method(...args).encodeABI();
    else
        tx.data = method().encodeABI();
    return await signTx(web3, acct, tx);
}

// Address deployContract(Web3 web3, Contract contract, Account acct, int gas, int gasPrice, arguments[])
async function deployContract(web3, contract, acct, args, gas, gasPrice, nonce) {
    param = {}
    if (args)
        param.arguments = args;
    if (!(acct && acct.getChecksumAddressString)) {
        // acct is a simple address
        receipt = await contract.deploy(param).send({
            from: acct,
            gas: gas,
            gasPrice: gasPrice
        });
        return receipt.options.address;
    } else {
        // acct is a wallet
        tx = {
            data: contract.deploy(param).encodeABI(),
        }
        if (nonce)
            tx.nonce = web3.utils.toHex(nonce);
        if (gas)
            tx.gas = web3.utils.toHex(gas);
        if (gasPrice)
            tx.gasPrice = web3.utils.toHex(gasPrice);
        stx = await signTx(web3, acct, tx);
        return web3.eth.sendSignedTransaction(stx);
    }
}

// Contract loadContract(Contract contract, Address contractAddress)
function loadContract(contract, contractAddress) {
    contract.options.address = contractAddress;
    return contract;
}

// Void deployMetadiumContracts(Web3 web3, Wallet acct, string dir,
//                              Address proxyAccount)
async function deployMetadiumContracts(web3, acct, dir, proxyAccount) {
    if (!acct || !web3.utils.isAddress(proxyAccount)) {
        console.log("Invalid address");
        return;
    }

    // MetadiumnameService, MetaID and MetadiumIdentityManager respectively
    var mns, mid, mim;
    try {
        var _name = "Metadium";
        var _symbol = "META";
        var gas = null, gasPrice = null;
        var nonce = await web3.eth.getTransactionCount(acct.getChecksumAddressString());

        console.log("Creating contracts...")
        mns = loadJsonContract(dir + "/MetadiumNameService.json");
        rmns = deployContract(web3, mns, acct, null, gas, gasPrice,
                              nonce++);
        mid = loadJsonContract(dir + "/MetaID.json");
        rmid = deployContract(web3, mid, acct, [ _name, _symbol ], gas, gasPrice,
                              nonce++);
        mim = loadJsonContract(dir + "/MetadiumIdentityManager.json");
        rmim = deployContract(web3, mim, acct, null, gas, gasPrice,
                              nonce++);

        rmns = await rmns;
        rmid = await rmid;
        rmim = await rmim;

        mns.options.address = rmns.contractAddress;
        mid.options.address = rmid.contractAddress;
        mim.options.address = rmim.contractAddress;

        console.log("MetadiumNameService address is", mns.options.address);
        console.log("MetaID address is", mid.options.address);
        console.log("MetadiumIdentityManager address is", mim.options.address);
    } catch (e) {
        console.log("Failed to deploy:", e);
        return;
    }

    console.log("Setting links...")
    tx = {}
    if (gas)
        tx.gas = web3.utils.toHex(gas);
    if (gasPrice)
        tx.gas = web3.utils.toHex(gasPrice);

    objs = [];

    tx.nonce = web3.utils.toHex(nonce++);
    stx = await signMethod(
        web3, acct, mns, mns.methods.setContractDomain,
        [ web3.utils.fromAscii("MetaID"), mid.options.address ],
        tx);
    objs[objs.length] = web3.eth.sendSignedTransaction(stx);

    tx.nonce = web3.utils.toHex(nonce++);
    stx = await signMethod(
        web3, acct, mns, mns.methods.setContractDomain,
        [ web3.utils.fromAscii("MetadiumIdentityManager"), mim.options.address ],
        tx);
    objs[objs.length] = web3.eth.sendSignedTransaction(stx);

    tx.nonce = web3.utils.toHex(nonce++);
    stx = await signMethod(
        web3, acct, mns, mns.methods.setPermission,
        [ web3.utils.fromAscii("MetadiumIdentityManager"), proxyAccount,
          "true" ],
        tx);
    objs[objs.length] = web3.eth.sendSignedTransaction(stx);

    tx.nonce = web3.utils.toHex(nonce++);
    stx = await signMethod(
        web3, acct, mns, mns.methods.setPermission,
        [ web3.utils.fromAscii("MetaID"), mim.options.address, "true" ],
        tx);
    objs[objs.length] = web3.eth.sendSignedTransaction(stx);

    tx.nonce = web3.utils.toHex(nonce++);
    stx = await signMethod(
        web3, acct, mim, mim.methods.setMetadiumNameServiceAddress,
        [ mns.options.address ],
        tx);
    objs[objs.length] = web3.eth.sendSignedTransaction(stx);

    tx.nonce = web3.utils.toHex(nonce++);
    stx = await signMethod(
        web3, acct, mid, mid.methods.setMetadiumNameServiceAddress,
        [ mns.options.address ],
        tx);
    objs[objs.length] = web3.eth.sendSignedTransaction(stx);

    for (i = 0; i < objs.length; i++) {
        await objs[i];
    }

    console.log("All good.");
}

function usage() {
    args = process.argv;
    cmds = args[1].split('/');
    cmd = cmds[cmds.length-1];
    console.log(
"Usage: node " + cmd + " [-w <password> <wallet-file>]\n" +
"	[-c <contract>] [-s <url>] [-n|--network <network-name>]\n" +
"	[deploy-meta <contracts-directory> <proxy-account>]\n" +
"	[deploy <json-file> [args...]]\n" +
"	[hash-put <json-file> <key> <value>] [hash-get <json-file> <key>]\n" +
"	[bulk-hash-put <json-file> <prefix> <start> <end>]\n" +
"	[bulk-hash-get <json-file> <prefix> <start> <end>]\n" +
"\n" +
"-w <password> <wallet-file>: go-ethereum wallet file and password to unlock it. Use '-' as <password> to type password interactively.\n" +
"-c <contract>: contract address, if not sepcified environ ETHC_CONTRACT.\n" +
"-s <url>: gmet node rpc url.\n" +
"-n|--network <network-name>: network name in 'truffle.js'.\n");
}

async function main() {
    var account, accountFile, accountPassword, contractAddress,
        serverUrl, networkName;

    args = process.argv;
    nargs = new Array()
    if (args.length < 3) {
        usage();
        return;
    }
    for (var i = 2; i < args.length; i++) {
        switch (args[i]) {
        case "-w":
            if (i < args.length - 2) {
                accountPassword = args[i+1];
                accountFile = args[i+2];
            }
            i += 2;
            break;
        case "-c":
            contractAddress = i < args.length - 1 ? args[i+1] : null;
            i++;
            break;
        case "-s":
            serverUrl = i < args.length - 1 ? args[i+1] : null;
            i++;
            break;
        case "-n": case "--network":
            networkName = i < args.length - 1 ? args[i+1] : null;
            i++;
            break;
        default:
            nargs[nargs.length] = args[i];
            break;
        }
    }

    serverUrl = getServerUrl(serverUrl, networkName);
    if (nargs.length == 0 || serverUrl == null) {
        usage();
        return;
    }

    web3 = new Web3(serverUrl);
    switch (nargs[0]) {
    case "deploy-meta":
        if (nargs.length < 2 ||
            !(account = await loadV3Wallet(accountFile, accountPassword))) {
            usage();
            return;
        }

        // If null, get proxy_account from truffle.local.js
        proxyAccount = nargs[2];
        if (networkName &&
            (!proxyAccount || !web3.utils.isAddress(proxyAccount))) {
            try {
                x = module.exports.networks[networkName];
                if (x && x.proxy_account && web3.utils.isAddress(x.proxy_account)) {
                    proxyAccount = x.proxy_account;
                }
            } catch (e) {}
        }

        try {
            deployMetadiumContracts(web3, account, nargs[1], proxyAccount);
        } catch (e) {
            console.log(e);
            return;
        }
        break;

    case "deploy":
        if (nargs.length < 2 ||
            !(account = await loadV3Wallet(accountFile, accountPassword))) {
            usage();
            return;
        }
        try {
            var sargs = null;
            if (nargs.length > 2) {
                sargs = [];
                for (var j = 2; j < nargs.length; j++)
                    sargs[sargs.length] = nargs[j];
            }
            var contract = loadJsonContract(nargs[1]);
            receipt = await deployContract(web3, contract, account, sargs, 0x1000000);
            console.log("Deployed contract address is", receipt.contractAddress);
        } catch (e) {
            console.log("Deploy failed:", e);
            return;
        }
        break;

    case "hash-put":
        contractAddress = getContractAddress(contractAddress);
        if (nargs.length < 4 || !contractAddress ||
            !(account = await loadV3Wallet(accountFile, accountPassword))) {
            usage();
            return;
        }

        try {
            var contract = loadJsonContract(nargs[1]);
            loadContract(contract, contractAddress);

            stx = await signMethod(
                web3, account, contract, contract.methods.put,
                [ web3.utils.asciiToHex(nargs[2]),
                  web3.utils.asciiToHex(nargs[3]), false]);
            if (false) {
                // poll for receipt
                receipt = await web3.eth.sendSignedTransaction(stx);
                console.log("TransactionHash is", receipt.transactionHash,
                            "\n", "In block", receipt.blockNumber);
            } else {
                // callback version
                web3.eth.sendSignedTransaction(stx)
                    .on('transactionHash', function(hash) {
                        console.log("TransactionHash is", hash);
                    })
                    .on('receipt', function(receipt) {
                        console.log("In block", receipt.blockNumber);
                    })
                    .on('error', console.error);
            }
        } catch (e) {
            console.log("Failed:", e);
            return;
        }
        break;

    // This doesn't work yet.
    case "bulk-hash-put":
        if (nargs.length < 5 || contractAddress == null) {
            usage();
            return;
        }
        var prefix = nargs[2], six, eix;
        try {
            six = parseInt(nargs[3]);
            eix = parseInt(nargs[4]);
        } catch (e) {
            console.log(e);
            return;
        }

        var contract;
        try {
            contract = loadJsonContract(nargs[1]);
            loadContract(contract, contractAddress);
        } catch (e) {
            console.log("Failed to load contract:", e);
            return;
        }

        for (var i = six; i <= eix; i++) {
            var key = prefix + "-" + i;
            var value = key + "-data";
            j = i;
            contract.methods.put(
                web3.utils.asciiToHex(key), web3.utils.asciiToHex(value), false)
                .send({
                    from: accountAddress,
                    gas: "0x1000000"
                })
                .on('transactionHash', function(hash) {
                    console.log(j, ":", hash);
                })
                .on('error', console.error);
        }
        break;

    case "hash-get":
        contractAddress = getContractAddress(contractAddress);
        if (nargs.length < 3 || contractAddress == null) {
            usage();
            return;
        }

        try {
            var contract = loadJsonContract(nargs[1]);
            loadContract(contract, contractAddress);
            r = await contract.methods.get(
                web3.utils.asciiToHex(nargs[2])).call();
            console.log(web3.utils.hexToAscii(r));
        } catch (e) {
            console.log("Failed:", e);
            return;
        }
        break;

    default:
        usage();
        break;
    }

    return;
}

// it begins...
main();

// EOF
