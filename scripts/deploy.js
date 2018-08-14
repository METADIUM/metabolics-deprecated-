// deploy.js

var fs = require('fs');
var Web3 = require('web3');

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

// Contract deployContract(Web3 web3, Contract contract, Account acct, int gas, int gasPrice, arguments[])
async function deployContract(web3, contract, acct, gas, gasPrice, args) {
    param = {}
    if (args)
        param.arguments = args;
    return await contract.deploy(param).send({
        from: acct,
        gas: gas,
        gasPrice: gasPrice
    });
}

// Contract loadContract(Contract contract, Address contractAddress)
function loadContract(contract, contractAddress) {
    contract.options.address = contractAddress;
    return contract;
}

// void deployMetadiumContracts(Web3 web3, Address deployAccount, string dir,
//                              Address proxyAccount)
async function deployMetadiumContracts(web3, deployAccount, dir, proxyAccount) {
    if (!web3.utils.isAddress(deployAccount) ||
        !web3.utils.isAddress(proxyAccount)) {
        console.log("Invalid address");
        return;
    }

    // MetadiumnameService, MetaID and MetadiumIdentityManager respectively
    var mns, mid, mim;
    try {
        var _name = "Metadium";
        var _symbol = "META";

        console.log("Creating contracts...")
        mns = loadJsonContract(dir + "/MetadiumNameService.json");
        mns = deployContract(web3, mns, deployAccount, "0x1000000");
        mid = loadJsonContract(dir + "/MetaID.json");
        mid = deployContract(web3, mid, deployAccount, "0x1000000", null,
                             [ _name, _symbol ]);
        mim = loadJsonContract(dir + "/MetadiumIdentityManager.json");
        mim = deployContract(web3, mim, deployAccount, "0x1000000");

        mns = await mns;
        mid = await mid;
        mim = await mim;

        console.log("MetadiumNameService address is", mns.options.address);
        console.log("MetaID address is", mid.options.address);
        console.log("MetadiumIdentityManager address is", mim.options.address);
    } catch (e) {
        console.log("Failed to deploy:", e);
        return;
    }

    console.log("Setting links...")
    param = { from: deployAccount, gas: "0x1000000" };
    objs = [];
    objs[objs.length] = mns.methods.setContractDomain(
        web3.utils.fromAscii("MetaID"), mid.address)
        .send(param);
    objs[objs.length] = mns.methods.setContractDomain(
        web3.utils.fromAscii("MetadiumIdentityManager"), mim.address)
        .send(param);
    objs[objs.length] = mns.methods.setPermission(
        web3.utils.fromAscii("MetadiumIdentityManager"), proxyAccount,
        "true")
        .send(param);
    objs[objs.length] = mns.methods.setPermission(
        web3.utils.fromAscii("MetaID"), mim.address, "true")
        .send(param);
    objs[objs.length] = mim.methods.setMetadiumNameServiceAddress(mns.address)
        .send(param);
    objs[objs.length] = mid.methods.setMetadiumNameServiceAddress(mns.address)
        .send(param);

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
"Usage: node " + cmd + " [-a <account> | -k <password> <account-file>]\n" +
"	[-c <contract>] [-s <url>] [-n|--network <network-name>]\n" +
"	[deploy-meta <contracts-directory> <proxy-account>]\n" +
"	[deploy <json-file> [args...]]\n" +
"	[hash-put <json-file> <key> <value>] [hash-get <json-file> <key>]\n" +
"	[bulk-hash-put <json-file> <prefix> <start> <end>]\n" +
"	[bulk-hash-get <json-file> <prefix> <start> <end>]\n" +
"\n" +
"-a <account>: account address to use to send transactions. Should be unlocked in the target node.\n" +
"-k <password> <acccount-file>: go-ethereum wallet file and password to unlock it. Use '-' as <password> to type password securely.\n" +
"-c <contract>: contract address, if not sepcified environ ETHC_CONTRACT.\n" +
"-s <url>: gmet node rpc url.\n" +
"-n|--network <network-name>: network name in 'truffle.js'.\n");
}

async function main() {
    var accountAddress, accountFile, accountPassword, contractAddress,
        serverUrl, networkName;

    args = process.argv;
    nargs = new Array()
    if (args.length < 3) {
        usage();
        return;
    }
    for (var i = 2; i < args.length; i++) {
        switch (args[i]) {
        case "-a":
            accountAddress = i < args.length - 1 ? args[i+1] : null;
            i++;
            break;
        case "-k":
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
        accountAddress = await getDeployAccount(
            web3, accountAddress, accountPassword, accountFile);
        if (nargs.length < 2 || !accountAddress) {
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
            deployMetadiumContracts(web3, accountAddress, nargs[1], proxyAccount);
        } catch (e) {
            console.log(e);
            return;
        }
        break;

    case "deploy":
        accountAddress = await getDeployAccount(
            web3, accountAddress, accountPassword, accountFile);
        if (nargs.length < 2 || !accountAddress) {
            usage();
            return;
        }
        try {
            var contract = loadJsonContract(nargs[1]);
            contract = await deployContract(web3, contract, acct, "0x100000");
            console.log("Deployed contract address is", contract.options.address);
        } catch (e) {
            console.log("Deploy failed:", e);
            return;
        }
        break;

    case "hash-put":
        accountAddress = await getDeployAccount(
            web3, accountAddress, accountPassword, accountFile);
        contractAddress = getContractAddress(contractAddress);
        if (nargs.length < 4 || !accountAddress || !contractAddress) {
            usage();
            return;
        }

        try {
            var contract = loadJsonContract(nargs[1]);
            loadContract(contract, contractAddress);

            if (false) {
                receipt = await contract.methods.put(
                    web3.utils.asciiToHex(nargs[2]),
                    web3.utils.asciiToHex(nargs[3]),
                    false).send({
                        from: accountAddress,
                        gas: "0x1000000"
                    });
                console.log(receipt);
            } else {
                contract.methods.put(
                    web3.utils.asciiToHex(nargs[2]),
                    web3.utils.asciiToHex(nargs[3]),
                    false).send({
                        from: accountAddress,
                        gas: "0x1000000"
                    })
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
        if (nargs.length < 5 || accountAddress == null ||
            contractAddress == null) {
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
        accountAddress = await getDeployAccount(
            web3, accountAddress, accountPassword, accountFile);
        contractAddress = getContractAddress(contractAddress);
        if (nargs.length < 3 || accountAddress == null ||
            contractAddress == null) {
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
