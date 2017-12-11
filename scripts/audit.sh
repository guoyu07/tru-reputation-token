#!/usr/bin/env bash

# This script is Copyright 2017 Tru Ltd. For more information see https://tru.ltd
# Licensed under the Apache License, version 2.0: https://github.com/TruLtd/tru-reputation-token/blob/master/LICENSE.txt

CURRENTVER=$(node -p -e "require('./package.json').version")

oyente_contracts(){
  flatten_src
  
  # Setup directories
  mkdir -p audits/oyente/$CURRENTVER > /dev/null 2>&1;
  mkdir -p audits/oyente/current > /dev/null 2>&1;
  rm audits/oyente/$CURRENTVER/* > /dev/null 2>&1;
  rm audits/oyente/current/* > /dev/null 2>&1;

  echo "Generating Oyente Audit on TruAddress.sol..."
  ADDRREP=$(oyente -s src/$CURRENTVER/TruAddress.sol 2>&1)
  echo $ADDRREP > audits/oyente/$CURRENTVER/TruAddress.report
  sed -i -e 's/ WARNING/\'$'\nWARNING/g' audits/oyente/$CURRENTVER/TruAddress.report
  sed -i -e 's/ INFO/\'$'\nINFO/g' audits/oyente/$CURRENTVER/TruAddress.report
  rm audits/oyente/$CURRENTVER/TruAddress.report-e

  echo "Generating Oyente Audit on TruReputationToken.sol..."
  TOKENREP=$(oyente -s src/$CURRENTVER/TruReputationToken.sol 2>&1)
  echo $TOKENREP > audits/oyente/$CURRENTVER/TruReputationToken.report
  sed -i -e 's/ WARNING/\'$'\nWARNING/g' audits/oyente/$CURRENTVER/TruReputationToken.report
  sed -i -e 's/ INFO/\'$'\nINFO/g' audits/oyente/$CURRENTVER/TruReputationToken.report
  rm audits/oyente/$CURRENTVER/TruReputationToken.report-e

  echo "Generating Oyente Audit on TruPreSale.sol..."
  PRESALEREP=$(oyente -s src/$CURRENTVER/TruPreSale.sol 2>&1)
  echo $PRESALEREP > audits/oyente/$CURRENTVER/TruPreSale.report
  sed -i -e 's/ WARNING/\'$'\nWARNING/g' audits/oyente/$CURRENTVER/TruPreSale.report
  sed -i -e 's/ INFO/\'$'\nINFO/g' audits/oyente/$CURRENTVER/TruPreSale.report
  rm audits/oyente/$CURRENTVER/TruPreSale.report-e

  echo "Generating Oyente Audit on TruCrowdSale.sol..."
  CROWDSALEREP=$(oyente -s src/$CURRENTVER/TruCrowdSale.sol 2>&1)
  echo $CROWDSALEREP > audits/oyente/$CURRENTVER/TruCrowdSale.report
  sed -i -e 's/ WARNING/\'$'\nWARNING/g' audits/oyente/$CURRENTVER/TruCrowdSale.report
  sed -i -e 's/ INFO/\'$'\nINFO/g' audits/oyente/$CURRENTVER/TruCrowdSale.report
  rm audits/oyente/$CURRENTVER/TruCrowdSale.report-e

  cp audits/oyente/$CURRENTVER/* audits/oyente/current > /dev/null 2>&1;

}

mythril_contracts(){

  flatten_src
  mkdir -p audits/mythril/$CURRENTVER > /dev/null 2>&1;
  mkdir -p audits/mythril/current > /dev/null 2>&1;
  rm audits/mythril/$CURRENTVER/* > /dev/null 2>&1;
  rm audits/mythril/current/* > /dev/null 2>&1;

  echo "Generating Mythril Audit on TruAddress.sol..."
  echo "===================================================" > audits/mythril/$CURRENTVER/TruAddress.report
  echo "src/$CURRENTVER/TruAddress.sol" >> audits/mythril/$CURRENTVER/TruAddress.report
  echo "===================================================" >> audits/mythril/$CURRENTVER/TruAddress.report
  myth -x src/$CURRENTVER/TruAddress.sol >> audits/mythril/$CURRENTVER/TruAddress.report
  myth -g audits/mythril/$CURRENTVER/TruAddress.html src/$CURRENTVER/TruAddress.sol

  echo "Generating Mythril Audit on TruReputationToken.sol..."
  echo "===================================================" > audits/mythril/$CURRENTVER/TruReputationToken.report
  echo "src/$CURRENTVER/TruReputationToken.sol" >> audits/mythril/$CURRENTVER/TruReputationToken.report
  echo "===================================================" >> audits/mythril/$CURRENTVER/TruReputationToken.report
  myth -x src/$CURRENTVER/TruReputationToken.sol >> audits/mythril/$CURRENTVER/TruReputationToken.report
  myth -g audits/mythril/$CURRENTVER/TruReputationToken.html src/$CURRENTVER/TruReputationToken.sol

  echo "Generating Mythril Audit on TruPreSale.sol..."
  echo "===================================================" > audits/mythril/$CURRENTVER/TruPreSale.report
  echo "src/$CURRENTVER/TruPreSale.sol" >> audits/mythril/$CURRENTVER/TruPreSale.report
  echo "===================================================" >> audits/mythril/$CURRENTVER/TruPreSale.report
  myth -x src/$CURRENTVER/TruPreSale.sol >> audits/mythril/$CURRENTVER/TruPreSale.report
  myth -g audits/mythril/$CURRENTVER/TruPreSale.html src/$CURRENTVER/TruPreSale.sol

  echo "Generating Mythril Audit on TruCrowdSale.sol..."
  echo "===================================================" > audits/mythril/$CURRENTVER/TruCrowdSale.report
  echo "src/$CURRENTVER/TruCrowdSale.sol" >> audits/mythril/$CURRENTVER/TruCrowdSale.report
  echo "===================================================" >> audits/mythril/$CURRENTVER/TruCrowdSale.report
  myth -x src/$CURRENTVER/TruCrowdSale.sol >> audits/mythril/$CURRENTVER/TruCrowdSale.report
  myth -g audits/mythril/$CURRENTVER/TruCrowdSale.html src/$CURRENTVER/TruCrowdSale.sol

  cp audits/mythril/$CURRENTVER/* audits/mythril/current > /dev/null 2>&1;
}

flatten_src(){
  bash scripts/flattensrc.sh flatten
}

case "$1" in
  (oyente)
    oyente_contracts
    ;;
  (mythril)
    mythril_contracts
    ;;
  (all)
    oyente_contracts
    mythril_contracts
    ;;
  (*)
    echo -e "\x1B[94m\n================================================================================\n\x1B[96m                         TRU REPUTATION TOKEN\x1B[97m\n                               audit.sh\x1B[94m\n================================================================================\n\x1B[0m"
    echo -e "\x1B[97mUSAGE:\x1B[0m\n"
    echo -e "\x1B[97mAppend script with one of the following commands:\n\x1B[0m"
    echo -e "\x1B[92moyente\x1B[0m   \x1B[97mGenerate Oyente Audits - https://github.com/melonproject/oyente\x1B[0m"
    echo -e "\x1B[92mmythril\x1B[0m  \x1B[97mGenerate Oyente Audits - https://github.com/b-mueller/mythril\x1B[0m"
    echo -e "\x1B[92mall\x1B[0m      \x1B[97mGenerate all Security Audits\x1B[0m"
    echo -e "\x1B[94m\n================================================================================\n\x1B[0m"
    exit 0
    ;;
esac