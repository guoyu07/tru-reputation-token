#!/usr/bin/env bash

# This script is Copyright 2017 Tru Ltd. For more information see https://tru.ltd
# Licensed under the Apache License, version 2.0: https://github.com/TruLtd/tru-reputation-token/blob/master/LICENSE
# This script is used to increment the minor version of the project automatically

CURRENTVER=$(node -e "console.log(require('./package.json').version);")
DOCVER=$(cat docs/conf.py | grep 'version =' | cut -f3 -d" " | cut -f2 -d"'")

if [[ $DOCVER != $CURRENTVER ]]; then
    sed -i -e "s/$DOCVER/$CURRENTVER/g" docs/conf.py > /dev/null 2>&1;
    rm docs/conf.py-e > /dev/null 2>&1;
fi

npm install > /dev/null 2>&1;

MYTHCURR="./audits/mythril/$CURRENTVER";
OYENTECURR="./audits/oyente/$CURRENTVER";

# Only execute Code Audit if it has not already been executed
if [[ (! -d $MYTHCURR) || (! -d $OYENTECURR) ]] ; then 
    bash scripts/audit.sh all;
fi;


# Clean up Repository
rm src/$CURRENTVER/*.evm > /dev/null 2>&1;
rm src/$CURRENTVER/*.disasm > /dev/null 2>&1;
rm src/$CURRENTVER/*.log > /dev/null 2>&1;
rm src/current/*.evm > /dev/null 2>&1;
rm src/current/*.disasm > /dev/null 2>&1;
rm src/current/*.log > /dev/null 2>&1;

# Add All files to Git Repo
git add .
sleep 2