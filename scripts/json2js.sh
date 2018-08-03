#!/bin/bash

[ "${SOL_GAS}" = "" ] && SOL_GAS="0x10000000"

function usage ()
{
    echo "Usage: $(basename $0) [-g gas] [-p gas-price] <json-file> <js-file>

-g <gas>:       gas amount to spend.
-p <gas-price>: gas price

Environment Variables:
  SOL_GAS for gas amount, equivalent to -g option.

'json2js.sh' converts truffle generated .json files to geth console loadable .js files.
"
}

# void json2js(string jsonFile, string jsFile)
function json2js ()
{
    cat $1 | awk -v gas="$SOL_GAS" -v gas_price="$SOL_GASPRICE" '
END {
  flush()
}

/^  "contractName":/ {
  contract_name = $2
  sub("^\"", "", contract_name)
  sub("\",.*$", "", contract_name)
}

/^  "bytecode":/ {
  bytecode = $2
  sub(",$", "", bytecode)
}

/^  "abi": \[/ {
  abi = $2
  if ($0 != "  \"abi\": [],") {
    in_abi = 1
  }
}

/^}/ {
  flush()
}

/^  ],$/ {
  if (in_abi) {
    in_abi = 0
    abi = abi "]"
  }
}

{
  if (in_abi && index($0, "  \"abi\"") != 1) {
    line = $0
    gsub(" ", "", line)
    abi = abi line
  }
}

function flush() {
  if (length(contract_name) == 0) {
    return;
  }
  print "var " contract_name "_data = " bytecode;
  print "var " contract_name "_contract = " abi;
  if (length(gas_price) != 0) {
      gas_price_2 = ",\
    gasPrice: \"" gas_price "\"";
  }
  if (length(contract_name) > 0) {
    printf "\
function %s_new() {\
  return %s_contract.new(\
  {\
    from: web3.eth.accounts[0],\
    data: %s_data,\
    gas: \"%s\"%s\
  }, function (e, contract) {\
    console.log(e, contract);\
    if (typeof contract.address !== \"undefined\") {\
      console.log(\"Contract mined! address: \" + contract.address + \" transactionHash: \" + contract.transactionHash);\
    }\
  });\
}\
\
function %s_load(addr) {\
   return %s_contract.at(addr);\
}\
\
", contract_name, contract_name, contract_name, gas, gas_price_2, contract_name, contract_name;
  }
  contract_name = ""
  bytecode = ""
  abi = ""
}' > $2
}

args=`getopt g:p: $*`
if [ $? != 0 ]; then
    usage;
    exit 1;
fi
set -- $args

for i; do
    case "$i" in
    -g)
	SOL_GAS=$2
	shift;
	shift;;
    -p)
	SOL_GASPRICE=$2
	shift;
	shift;;
    esac
done

if [ $# != 3 ]; then
    usage
    exit 1
fi

json2js "$2" "$3"

# EOF
