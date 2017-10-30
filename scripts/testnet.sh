#!/usr/bin/env bash

# This script is Copyright 2017 Tru Ltd. For more information see https://tru.ltd
# Licensed under the Apache License, version 2.0: https://github.com/TruLtd/tru-reputation-token/blob/master/LICENSE.txt

if [ "$SOLIDITY_COVERAGE" = true ]; then
  TESTNET_PORT="8556"
  TESTNET_LOG="coverage-testnet.log"
  TESTNET_NAME="coverage"
else
  TESTNET_PORT="8546"
  TESTNET_LOG="testnet.log"
  TESTNET_NAME="testnet"
fi

check_state(){
  if [ "$SOLIDITY_COVERAGE" = true ]; then
    STATE_CHECK=$(pgrep -f "testrpc-sc --port $TESTNET_PORT")
  else
    STATE_CHECK=$(pgrep -f "testrpc --port $TESTNET_PORT")
  fi
  if [[ ! -z $STATE_CHECK ]]; then
    echo $STATE_CHECK
  fi
}

check_net_state(){

  if [[ ! -z $(check_state) ]]; then
    echo -e "\x1B[92mTru RPC Testnet is Running.\x1B[0m";
    exit 0;
  else
    echo -e "\x1B[91mTru RPC Testnet is Not Running.\x1B[0m";
    exit 0;
  fi

}

start(){
  echo -e "\x1B[94mStarting Tru RPC Testnet...\x1B[0m"
  echo "" > $TESTNET_LOG;
  local TESTNET_ACCOUNTS=(
      --account="0xb7e2749d15593f9d31230448488b0bf72911d1a19e6435b344a55c186ee0cd0b,50000000000000000000000000"
      --account="0x672d338a17a3045f3dab93371e92d74b0d49ab7dbbc76168d960947d997e21fa,5000000000000000000000000"
      --account="0x5c528f0383ee225e037b5087b2ee967a47660d9cd168e3c189331c1dfef0f43f,5000000000000000000000000"
      --account="0x8937133809f1c758a09a80022266739fbc1852dd5c59924e8da7458c6b8f6590,5000000000000000000000000"
      --account="0xb2bfd3c574e4a7c80b28ef1d3f6d557a53a546c4aa1cbd4e142e3fbe8af77564,5000000000000000000000000"
    )
  if [ "$SOLIDITY_COVERAGE" = true ]; then
    nohup node_modules/.bin/testrpc-sc --port $TESTNET_PORT --gasLimit 0xfffffffffff "${TESTNET_ACCOUNTS[@]}" > $TESTNET_LOG &
  else
    nohup node_modules/.bin/testrpc --port $TESTNET_PORT "${TESTNET_ACCOUNTS[@]}" > $TESTNET_LOG &
  fi

  sleep 1;
  if [[ ! -z $(check_state) ]]; then
    echo -e "\x1B[92mTru RPC Testnet Started Successfully.\x1B[0m";
  else
    echo -e "\x1B[91mFailed to start Tru RPC Testnet. Check Parameters.\x1B[0m";
  fi

}

stop() {
  sleep 1;
  echo -e "\x1B[93mStopping Tru RPC Testnet...\x1B[0m"
  if [[ ! -z $(check_state) ]]; then
    if [ "$SOLIDITY_COVERAGE" = true ]; then
      kill $(pgrep -f "testrpc-sc --port $TESTNET_PORT") > /dev/null 2>&1;
    else
      kill $(pgrep -f "testrpc --port $TESTNET_PORT") > /dev/null 2>&1;
    fi
    sleep 1;
    if [[ ! -z $(check_state) ]]; then
      echo -e "\x1B[91mFailed to stop Tru RPC Testnet. Manually kill process.\x1B[0m"
    else
      echo -e "\x1B[92mTru RPC Testnet stopped.\x1B[0m";
    fi
  fi
}

test_tru(){
  stop;
  start;
  echo -e "\x1B[94mStarting Tests on Tru RPC Testnet...\x1B[0m";
  if [[ ! -z $(check_state) ]]; then
    truffle test --network=$TESTNET_NAME;
  else
    start;
    truffle test --network=$TESTNET_NAME;
  fi
}

restart_testnet(){

  if [[ ! -z $(check_state) ]]; then
    stop;
    sleep 1;
    start;
  else
    start;
  fi
}

migrate(){
  if [[ ! -z $(check_state) ]]; then
    truffle migrate --network=$TESTNET_NAME;
  else
    start;
    truffle migrate --network=$TESTNET_NAME;
  fi
  
}

open_console(){
  if [[ ! -z $(check_state) ]]; then
    truffle console --network=$TESTNET_NAME;
  else
    start;
    truffle console --network=$TESTNET_NAME;
  fi
}

coverage(){
  stop;
  sleep 5;
  start;
  sleep 5;
  node_modules/.bin/solidity-coverage;
  sleep 5;
  stop;
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
  (restart)
    restart_testnet
    ;;
  (coverage)
    coverage
    ;;
  (*)
    echo -e "\x1B[94m\n================================================================================\n\x1B[96m                         TRU REPUTATION TOKEN\x1B[97m\n                               testnet.sh\x1B[94m\n================================================================================\n\x1B[0m"
    echo -e "\x1B[97mUSAGE:\x1B[0m\n"
    echo -e "\x1B[97mAppend script with one of the following commands:\n\x1B[0m"
    echo -e "\x1B[92mstart\x1B[0m       \x1B[97mStarts the Tru RPC Testnet\x1B[0m"
    echo -e "\x1B[92mstop\x1B[0m        \x1B[97mStops the Tru RPC Testnet\x1B[0m"
    echo -e "\x1B[92mrestart\x1B[0m     \x1B[97mRestarts the Tru RPC Testnet\x1B[0m"
    echo -e "\x1B[92mstatus\x1B[0m      \x1B[97mShows the running status of the Tru RPC Testnet\x1B[0m"
    echo -e "\x1B[92mtest\x1B[0m        \x1B[97mRuns full Mocha Test Suite on Tru RPC Testnet\x1B[0m"
    echo -e "\x1B[92mmigrate\x1B[0m     \x1B[97mCompiles and migrates the Contract Suite to Tru RPC TestNet\x1B[0m"
    echo -e "\x1B[92mconsole\x1B[0m     \x1B[97mOpens the Truffle Console on Tru RPC Testnet\x1B[0m"
    echo -e "\x1B[94m\n================================================================================\n\x1B[0m"
    exit 0
    ;;
esac