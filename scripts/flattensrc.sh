#!/usr/bin/env bash

# This script is Copyright 2017 Tru Ltd. For more information see https://tru.ltd
# Licensed under the Apache License, version 2.0: https://github.com/TruLtd/tru-reputation-token/blob/master/LICENSE.txt
# This script is used to generate a single Solidity File per main Ethereum Contract
# This script requires solidity-flattener: https://github.com/BlockCatIO/solidity-flattener
project_root() {
    if [[ $PWD == *"/scripts" ]]; then
     cd ..
    fi
}

flatten_trt() {
    project_root
    rm src/TruReputationToken.sol > /dev/null 2>&1;
    truffle-flattener contracts/TruReputationToken.sol > src/TempTRT.sol
    sed -i -e '/pragma solidity/d' src/TempTRT.sol
    echo "pragma solidity ^0.4.18;" > src/TruReputationToken.sol
    cat src/TempTRT.sol >> src/TruReputationToken.sol
    rm src/TempTRT.* > /dev/null 2>&1;
    rm src/*.sol-e > /dev/null 2>&1;
}

flatten_tps() {
    project_root
    rm src/TruPreSale.sol > /dev/null 2>&1;
    truffle-flattener contracts/TruPreSale.sol > src/TempTPS.sol
    sed -i -e '/pragma solidity/d' src/TempTPS.sol
    echo "pragma solidity ^0.4.18;" > src/TruPreSale.sol
    cat src/TempTPS.sol >> src/TruPreSale.sol
    rm src/TempTPS.* > /dev/null 2>&1;
    rm src/*.sol-e > /dev/null 2>&1;
}

flatten_tcs() {
    project_root
    rm src/TruCrowdSale.sol > /dev/null 2>&1;
    truffle-flattener contracts/TruCrowdSale.sol > src/TempTCS.sol
    sed -i -e '/pragma solidity/d' src/TempTCS.sol
    echo "pragma solidity ^0.4.18;" > src/TruCrowdSale.sol
    cat src/TempTCS.sol >> src/TruCrowdSale.sol
    rm src/TempTCS.* > /dev/null 2>&1;
    rm src/*.sol-e > /dev/null 2>&1;
}

flatten_truaddress() {
    project_root
    rm src/TruAddress.sol > /dev/null 2>&1;
    truffle-flattener contracts/supporting/TruAddress.sol > src/TempAddr.sol
    sed -i -e '/pragma solidity/d' src/TempAddr.sol
    echo "pragma solidity ^0.4.18;" > src/TruAddress.sol
    cat src/TempAddr.sol >> src/TruAddress.sol
    rm src/TempAddr.* > /dev/null 2>&1;
    rm src/*.sol-e > /dev/null 2>&1;
}

flatten(){
    project_root
    rm src/*.sol > /dev/null 2>&1;
    flatten_trt
    flatten_tps
    flatten_tcs
    flatten_truaddress
}

case "$1" in
  (flatten)
    flatten
    ;;
  (token)
    flatten_trt
    ;;
  (presale)
    flatten_tps
    ;;
  (crowdsale)
    flatten_tcs
    ;;
  (address)
    flatten_truaddress
    ;;
  (*)
    echo -e "\x1B[94m\n================================================================================================\n\x1B[96m                         TRU REPUTATION TOKEN\x1B[97m\n                               flattensrc.sh\x1B[94m\n================================================================================================\n\x1B[0m"
    echo -e "\x1B[97mUSAGE:\x1B[0m\n"
    echo -e "\x1B[97mAppend script with one of the following commands:\n\x1B[0m"
    echo -e "\x1B[92mflatten\x1B[0m      \x1B[97mGenerate flattened Solidity Source for all Tru Reputation Token Smart Contracts\x1B[0m"
    echo -e "\x1B[92mtoken\x1B[0m        \x1B[97mGenerate flattened Solidity Source for TruReputationToken.sol\x1B[0m"
    echo -e "\x1B[92mpresale\x1B[0m      \x1B[97mGenerate flattened Solidity Source for TruPreSale.sol\x1B[0m"
    echo -e "\x1B[92mcrowdsale\x1B[0m    \x1B[97mGenerate flattened Solidity Source for TruCrowdSale.sol\x1B[0m"
    echo -e "\x1B[92maddress\x1B[0m      \x1B[97mGenerate flattened Solidity Source for TruAddress.sol\x1B[0m"
    echo -e "\x1B[94m\n================================================================================================\n\x1B[0m"
    exit 0
    ;;
esac