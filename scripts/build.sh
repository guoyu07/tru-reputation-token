#!/usr/bin/env bash

# This script is Copyright 2017 Tru Ltd. For more information see https://tru.ltd
# Licensed under the Apache License, version 2.0: https://github.com/TruLtd/tru-reputation-token/blob/master/LICENSE.txt

copy_dependencies(){
  mkdir -p contracts/supporting/zeppelin/{contracts,ownership,math}
  cp node_modules/zeppelin-solidity/contracts/token/BasicToken.sol contracts/supporting/zeppelin/contracts
  cp node_modules/zeppelin-solidity/contracts/token/ERC20.sol contracts/supporting/zeppelin/contracts
  cp node_modules/zeppelin-solidity/contracts/token/ERC20Basic.sol contracts/supporting/zeppelin/contracts
  cp node_modules/zeppelin-solidity/contracts/token/StandardToken.sol contracts/supporting/zeppelin/contracts
  cp node_modules/zeppelin-solidity/contracts/token/BurnableToken.sol contracts/supporting/zeppelin/contracts
  cp node_modules/zeppelin-solidity/contracts/token/MintableToken.sol contracts/supporting/zeppelin/contracts
  cp node_modules/zeppelin-solidity/contracts/math/SafeMath.sol contracts/supporting/zeppelin/math
  cp node_modules/zeppelin-solidity/contracts/ownership/Ownable.sol contracts/supporting/zeppelin/ownership
}

clean_dependencies(){
  rm -rf contracts/supporting/zeppelin/ > /dev/null 2>&1;
}

refresh_dependencies(){
  clean_dependencies;
  sleep 1;
  copy_dependencies;
}

case "$1" in
  (build)
    copy_dependencies
    ;;
  (clean)
    clean_dependencies
    ;;
  (refresh)
    refresh_dependencies
    ;;
  (*)
    echo -e "\x1B[97m\n================================================================================"
    echo -e "                                 build.sh"
    echo -e "================================================================================\n\x1B[0m"
    echo -e "\x1B[97mUSAGE:\x1B[0m\n"
    echo -e "\x1B[92mbuild\x1B[0m       \x1B[97mBuilds in Open-Zeppelin Depedencies\x1B[0m"
    echo -e "\x1B[92mclean\x1B[0m        \x1B[97mCleans all Open-Zeppelin Dependencies\x1B[0m"
    echo -e "\x1B[92mrefresh\x1B[0m     \x1B[97mRefreshes all Open-Zeppelin Dependencies\x1B[0m"
    echo -e "\x1B[97m\n================================================================================\n\x1B[0m"
    echo -e "\x1B[97m================================================================================\n\x1B[0m"
    exit 0
    ;;
esac