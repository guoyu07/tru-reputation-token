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
     solidity_flattener contracts/TruReputationToken.sol --output src/TruReputationToken.sol > /dev/null 2>&1;
}

flatten_tps() {
    project_root
    solidity_flattener contracts/TruPreSale.sol --output src/TruPreSale.sol > /dev/null 2>&1;
}

flatten_tcs() {
    project_root
    solidity_flattener contracts/TruCrowdSale.sol --output src/TruCrowdSale.sol > /dev/null 2>&1;
}

flatten(){
    project_root
    rm src/*.sol > /dev/null 2>&1;
    flatten_trt
    flatten_tps
    flatten_tcs
}

case "$1" in
  (flatten)
    flatten
    ;;
  (flattentrt)
    flatten_trt
    ;;
  (flattentps)
    flatten_tps
    ;;
  (flattentcs)
    flatten_tcs
    ;;
  (*)
    echo -e "\x1B[94m\n================================================================================================\n\x1B[96m                         TRU REPUTATION TOKEN\x1B[97m\n                               flattensrc.sh\x1B[94m\n================================================================================================\n\x1B[0m"
    echo -e "\x1B[97mUSAGE:\x1B[0m\n"
    echo -e "\x1B[97mAppend script with one of the following commands:\n\x1B[0m"
    echo -e "\x1B[92mflatten\x1B[0m          \x1B[97mGenerate flattened Solidity Source for all Tru Reputation Token Smart Contracts\x1B[0m"
    echo -e "\x1B[92mflattentrt\x1B[0m       \x1B[97mGenerate flattened Solidity Source for TruReputationToken.sol\x1B[0m"
    echo -e "\x1B[92mflattentps\x1B[0m       \x1B[97mGenerate flattened Solidity Source for TruPreSale.sol\x1B[0m"
    echo -e "\x1B[92mflattentcs\x1B[0m       \x1B[97mGenerate flattened Solidity Source for TruCrowdSale.sol\x1B[0m"
    echo -e "\x1B[94m\n================================================================================================\n\x1B[0m"
    exit 0
    ;;
esac