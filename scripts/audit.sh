#!/usr/bin/env bash

# This script is Copyright 2017 Tru Ltd. For more information see https://tru.ltd
# Licensed under the Apache License, version 2.0: https://github.com/TruLtd/tru-reputation-token/blob/master/LICENSE.txt

function oyente_contracts(){
  PRESALEREP=$(oyente -s contracts/TruPreSale.sol 2>&1)
  CROWDSALEREP=$(oyente -s contracts/TruCrowdSale.sol 2>&1)
  TOKENREP=$(oyente -s contracts/TruReputationToken.sol 2>&1)
  
  echo 'Generating Oyente Audit on TruPreSale.sol...'
  echo $PRESALEREP > audits/oyente/TruPreSale.report

  echo 'Generating Oyente Audit on TruCrowdSale.sol...'
  echo $CROWDSALEREP > audits/oyente/TruCrowdSale.report

  echo 'Generating Oyente Audit on TruReputationToken.sol...'
  echo $TOKENREP > audits/oyente/TruReputationToken.report

  # Reformat Reports
   sed -i -e 's/ WARNING/\'$'\nWARNING/g' audits/oyente/TruPreSale.report
   sed -i -e 's/ INFO/\'$'\nINFO/g' audits/oyente/TruPreSale.report

   sed -i -e 's/ WARNING/\'$'\nWARNING/g' audits/oyente/TruCrowdSale.report
   sed -i -e 's/ INFO/\'$'\nINFO/g' audits/oyente/TruCrowdSale.report
   
   sed -i -e 's/ WARNING/\'$'\nWARNING/g' audits/oyente/TruReputationToken.report
   sed -i -e 's/ INFO/\'$'\nINFO/g' audits/oyente/TruReputationToken.report

   rm audits/oyente/TruReputationToken.report-e
   rm audits/oyente/TruPreSale.report-e
   rm audits/oyente/TruCrowdSale.report-e

}

case "$1" in
  (oyente)
    oyente_contracts
    ;;
  (*)
    echo -e "\x1B[94m\n================================================================================\n\x1B[96m                         TRU REPUTATION TOKEN\x1B[97m\n                               audit.sh\x1B[94m\n================================================================================\n\x1B[0m"
    echo -e "\x1B[97mUSAGE:\x1B[0m\n"
    echo -e "\x1B[97mAppend script with one of the following commands:\n\x1B[0m"
    echo -e "\x1B[92moyente\x1B[0m           \x1B[97mGenerate Oyente Audits - https://github.com/melonproject/oyente\x1B[0m"
    echo -e "\x1B[94m\n================================================================================\n\x1B[0m"
    exit 0
    ;;
esac