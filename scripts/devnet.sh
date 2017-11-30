#!/usr/bin/env bash

# This script is Copyright 2017 Tru Ltd. For more information see https://tru.ltd
# Licensed under the Apache License, version 2.0: https://github.com/TruLtd/tru-reputation-token/blob/master/LICENSE.txt

DEVNET_DATA_DIR="../tru-devnet"
DEVNET_PWD_FILE="../tru-devnet/pwd.sec"
GETH_IPCPATH="~/Library/Ethereum/geth.ipc"
DEVNET_GENESIS_JSON="../tru-devnet/genesis.json"
DEVNET_NETWORK_ID="1066"
DEVNET_PORT="8547"
DEVNET_LOG="devnet.log"
DEVNET_NAME="devnet"

check_state(){
  local PSID=$(pgrep -f "tru-devnet")
  if [[ -z $PSID ]]; then
    echo "not running"
    return false
  else
    echo "running"
    return true
  fi
}

check_net_state(){
  
  local DNID=$(pgrep -f "tru-devnet")
  if [[ -z $DNID ]]; then
    echo -e "\x1B[91mTru-Devnet is NOT Running.\x1B[0m"
    exit 0
  else
    echo -e "\x1B[92mTru-Devnet is Running.\x1B[0m"
    exit 0
  fi

}

start(){
  local DEVNET_ACCOUNTS=(
    "0x627306090abaB3A6e1400e9345bC60c78a8BEf57"
  )
  echo -e "\x1B[94mStarting Tru-Devnet...\x1B[0m"
  nohup geth --networkid $DEVNET_NETWORK_ID --mine --datadir $DEVNET_DATA_DIR --nodiscover --rpc --rpcport $DEVNET_PORT --rpccorsdomain '*' --nat 'any' --rpcapi 'eth,web3,personal,net' --unlock 0 --password $DEVNET_PWD_FILE --ipcpath $GETH_IPCPATH > $DEVNET_LOG & > /dev/null

  if [[ check_state -eq false ]]; then
    echo -e "\x1B[92mTru-Devnet Started Successfully.\x1B[0m"
    exit 0
  else
    echo -e "\x1B[91mFailed to start Tru-Devnet. Check Parameters.\x1B[0m"
    exit 1
  fi
}

stop(){

  kill $(pgrep -f tru-devnet) > /dev/null
  if [[ check_state -eq false ]]; then
    echo -e "\x1B[92mTru-Devnet stopped.\x1B[0m"
    exit 0
  else
    echo -e "\x1B[91mUnable to stop Tru-Devnet. Force kill Geth manually.\x1B[0m"
    exit 2
  fi
}

create_devnet(){
  
  echo -e "\x1B[94mCreating Tru-Devnet...\x1B[0m"
  geth --datadir $DEVNET_DATA_DIR init $DEVNET_GENESIS_JSON
  echo -e "\x1B[92mTru-Devnet created.\x1B[0m"

}

create_devnet_account(){

  echo -e "\x1B[94mCreating new Tru-Devnet account...\x1B[0m"
  geth --datadir $DEVNET_DATA_DIR --password $DEVNET_PWD_FILE account new
  echo -e "\x1B[92mNew Tru-Devnet account created.\x1B[0m"

}

clamp_devnet(){
  echo -e "\x1B[94mDropping Tru Devnet CPU Priority...\x1B[0m"
  renice 20 $(pgrep -f tru-devnet)
}

unclamp_devnet(){
  echo -e "\x1B[94mNormalising Tru Devnet CPU Priority...\x1B[0m"
  renice 0 $(pgrep -f tru-devnet)
}

test_tru(){
  local START_TIME=$(date '+%Y-%m-%d %H:%M:%S')
  echo -e "\x1B[95mStarting Tests on Tru RPC Devnet \x1B[97m$START_TIME\x1B[0m";
  env FUZZLOOPS="1000" truffle test --network=$DEVNET_NAME;
  local END_TIME=$(date '+%Y-%m-%d %H:%M:%S')
  echo -e "\x1B[95mTests Completed on Tru RPC Devnet \x1B[97m$END_TIME\x1B[0m";
}

migrate(){
  truffle migrate --network=devnet
}

open_console(){
  truffle console --network=devnet
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
  (add)
    create_devnet_account
    ;;
  (create)
    create_devnet
    ;;
  (limit)
    clamp_devnet
    ;;
  (restore)
    unclamp_devnet
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
    echo -e "\x1B[94m\n================================================================================\n\x1B[96m                         TRU REPUTATION TOKEN\x1B[97m\n                               devnet.sh\x1B[94m\n================================================================================\n\x1B[0m"
    echo -e "\x1B[97mUSAGE:\x1B[0m\n"
    echo -e "\x1B[97mAppend script with one of the following commands:\n\x1B[0m"
    echo -e "\x1B[92mstart\x1B[0m          \x1B[97mStarts the Tru-Devnet\x1B[0m"
    echo -e "\x1B[92mstop\x1B[0m           \x1B[97mStops the Tru-Devnet\x1B[0m"
    echo -e "\x1B[92mcreate\x1B[0m         \x1B[97mGenerates the Tru-Devnet\x1B[0m"
    echo -e "\x1B[92madd\x1B[0m            \x1B[97mAdds new account to the Tru-Devnet\x1B[0m"
    echo -e "\x1B[92mlimit\x1B[0m          \x1B[97mDrops CPU priority of Tru-Devnet\x1B[0m"
    echo -e "\x1B[92mrestore\x1B[0m        \x1B[97mRestores CPU priority of Tru-Devnet\x1B[0m"
    echo -e "\x1B[92mtest\x1B[0m           \x1B[97mRuns full Mocha Test Suite on Tru RPC Testnet\x1B[0m"
    echo -e "\x1B[92mmigrate\x1B[0m        \x1B[97mCompiles and migrates the Contract Suite to Tru RPC TestNet\x1B[0m"
    echo -e "\x1B[92mconsole\x1B[0m        \x1B[97mOpens the Truffle Console on Tru RPC Testnet\x1B[0m"
    echo -e "\x1B[94m\n================================================================================\n\x1B[0m"
    exit 0
    ;;
esac