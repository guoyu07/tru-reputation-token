#!/usr/bin/env bash

# This script is Copyright 2017 Tru Ltd. For more information see https://tru.ltd
# Licensed under the Apache License, version 2.0: https://github.com/TruLtd/tru-reputation-token/blob/master/LICENSE.txt

DEVNET_NETWORK_ID="1066"
TESTNET_PORT="8546"
TESTNET_ACCOUNT_NO=10
DEVNET_DATA_DIR="../tru-devnet"
TESTNET_LOG="../devnet.log"

test_tru(){
  echo -e "\x1B[94mStarting Tests on Tru RPC Testnet...\x1B[0m"
  ../truffle test --network=ropsten
}


migrate(){
  ../truffle migrate --network=ropsten
}

open_console(){
  truffle console --network=ropsten
}

case "$1" in
  (start)
    start
    ;;
  (stop)
    stop
    ;;
  (status)
    check_net_state
    ;;
  (test)
    test_tru
    ;;
  (migrate)
    migrate
    ;;
  (console)
    open_console
    ;;
  (*)
    echo -e "\x1B[97m\n================================================================================"
    echo -e "                                 ropsten.sh"
    echo -e "================================================================================\n\x1B[0m"
    echo -e "\x1B[97mUSAGE:\x1B[0m\n"
    echo -e "\x1B[92mtest\x1B[0m        \x1B[97mRuns full Mocha Test Suite on Ropsten Testnet\x1B[0m"
    echo -e "\x1B[92mmigrate\x1B[0m        \x1B[97mCompiles and migrates the Contract Suite to Tru RPC TestNet\x1B[0m"
    echo -e "\x1B[92mconsole\x1B[0m        \x1B[97mOpens the Truffle Console on Tru RPC Testnet\x1B[0m"
    echo -e "\x1B[97m\n================================================================================\n\x1B[0m"
    echo -e "\x1B[97m================================================================================\n\x1B[0m"
    exit 0
    ;;
esac