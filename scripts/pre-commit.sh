#!/usr/bin/env bash

# This script is Copyright 2017 Tru Ltd. For more information see https://tru.ltd
# Licensed under the Apache License, version 2.0: https://github.com/TruLtd/tru-reputation-token/blob/master/LICENSE
# This script is used to increment the minor version of the project automatically

OLDVER=$(node -e "console.log(require('./package.json').version);")
node_modules/.bin/versiony package.json --patch > /dev/null 2>&1;
CURRENTVER=$(node -e "console.log(require('./package.json').version);")
sed -i -e "s/$OLDVER/$CURRENTVER/g" docs/conf.py > /dev/null 2>&1;
rm docs/conf.py-e > /dev/null 2>&1;
npm install > /dev/null 2>&1;