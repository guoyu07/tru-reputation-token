#!/usr/bin/env bash

# This script is Copyright 2017 Tru Ltd. For more information see https://tru.ltd
# Licensed under the Apache License, version 2.0: https://github.com/TruLtd/tru-reputation-token/blob/master/LICENSE.txt

start(){
  SOLIDITY_COVERAGE=true scripts/testnet.sh start
}

stop(){
  SOLIDITY_COVERAGE=true scripts/testnet.sh stop
}

generate(){
  SOLIDITY_COVERAGE=true scripts/testnet.sh coverage
}

rename_src(){
  find src/ -name "*.sol" -exec bash -c 'mv "$1" "${1%.sol}".source' - '{}' \;
  rm coverage-testnet.log > /dev/null 2>&1;
  rm coverage.json > /dev/null 2>&1;
}

restore_src(){
  find src -name "*.source" -exec bash -c 'mv "$1" "${1%.source}".sol' - '{}' \;
}


case "$1" in
  (start)
    start
    ;;
  (stop)
    stop
    ;;
  (generate)
    rename_src
    generate
    restore_src
    ;;
  (*)
    echo -e "\x1B[94m\n================================================================================\n\x1B[96m                         TRU REPUTATION TOKEN\x1B[97m\n                               coverage.sh\x1B[94m\n================================================================================\n\x1B[0m"
    echo -e "\x1B[97mUSAGE:\x1B[0m\n"
    echo -e "\x1B[97mAppend script with one of the following commands:\n\x1B[0m"
    echo -e "\x1B[92mstart\x1B[0m        \x1B[97mStarts the Coverage Tru RPC Testnet\x1B[0m"
    echo -e "\x1B[92mstop\x1B[0m         \x1B[97mStops the Coverage Tru RPC Testnet\x1B[0m"
    echo -e "\x1B[92mgenerate\x1B[0m     \x1B[97mGenerate Code Coverage Report\x1B[0m"
    echo -e "\x1B[94m\n================================================================================\n\x1B[0m"
    exit 0
    ;;
esac