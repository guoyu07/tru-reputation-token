#!/usr/bin/env bash

# This script is Copyright 2017 Tru Ltd. For more information see https://tru.ltd
# Licensed under the Apache License, version 2.0: https://github.com/TruLtd/tru-reputation-token/blob/master/LICENSE.txt
# This script is used to generate a single Solidity File per main Ethereum Contract
# This script requires solidity-flattener: https://github.com/BlockCatIO/solidity-flattener
CURRENTVER=$(node -p -e "require('./package.json').version")
project_root() {
    if [[ $PWD == *"/scripts" ]]; then
     cd ..
    fi
}

flatten_trt() {
    project_root

    node_modules/.bin//truffle-flattener contracts/TruReputationToken.sol > src/$CURRENTVER/TempTRT.sol
    sed -i -e '/pragma solidity/d' src/$CURRENTVER/TempTRT.sol
    echo "pragma solidity ^0.4.18;" > src/$CURRENTVER/TruReputationTokenFull.sol
    cat src/$CURRENTVER/TempTRT.sol >> src/$CURRENTVER/TruReputationTokenFull.sol
    rm src/$CURRENTVER/TempTRT.* > /dev/null 2>&1;
    rm src/$CURRENTVER/*.sol-e > /dev/null 2>&1;
    cp src/$CURRENTVER/* src/current > /dev/null 2>&1;
}

flatten_tps() {
    project_root

    node_modules/.bin//truffle-flattener contracts/TruPreSale.sol > src/$CURRENTVER/TempTPS.sol
    sed -i -e '/pragma solidity/d' src/$CURRENTVER/TempTPS.sol
    echo "pragma solidity ^0.4.18;" > src/$CURRENTVER/TruPreSaleFull.sol
    cat src/$CURRENTVER/TempTPS.sol >> src/$CURRENTVER/TruPreSaleFull.sol
    rm src/$CURRENTVER/TempTPS.* > /dev/null 2>&1;
    rm src/$CURRENTVER/*.sol-e > /dev/null 2>&1;
    cp src/$CURRENTVER/* src/current > /dev/null 2>&1;
}

flatten_tcs() {
    project_root
    
    node_modules/.bin//truffle-flattener contracts/TruCrowdSale.sol > src/$CURRENTVER/TempTCS.sol
    sed -i -e '/pragma solidity/d' src/$CURRENTVER/TempTCS.sol
    echo "pragma solidity ^0.4.18;" > src/$CURRENTVER/TruCrowdSaleFull.sol
    cat src/$CURRENTVER/TempTCS.sol >> src/$CURRENTVER/TruCrowdSaleFull.sol
    rm src/$CURRENTVER/TempTCS.* > /dev/null 2>&1;
    rm src/$CURRENTVER/*.sol-e > /dev/null 2>&1;
    cp src/$CURRENTVER/* src/current > /dev/null 2>&1;
}

flatten_truaddress() {
    project_root
    node_modules/.bin//truffle-flattener contracts/supporting/TruAddress.sol > src/$CURRENTVER/TempAddr.sol
    sed -i -e '/pragma solidity/d' src/$CURRENTVER/TempAddr.sol
    echo "pragma solidity ^0.4.18;" > src/$CURRENTVER/TruAddressFull.sol
    cat src/$CURRENTVER/TempAddr.sol >> src/$CURRENTVER/TruAddressFull.sol
    rm src/$CURRENTVER/TempAddr.* > /dev/null 2>&1;
    rm src/$CURRENTVER/*.sol-e > /dev/null 2>&1;
    cp src/$CURRENTVER/* src/current > /dev/null 2>&1;
}

flatten(){
    project_root
    mkdir -p src/$CURRENTVER > /dev/null 2>&1;
    mkdir -p src/current > /dev/null 2>&1;
    rm src/$CURRENTVER/*.sol > /dev/null 2>&1;
    rm src/current/*.sol > /dev/null 2>&1;
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