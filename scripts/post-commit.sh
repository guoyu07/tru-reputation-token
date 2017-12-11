#!/usr/bin/env bash

# This script is Copyright 2017 Tru Ltd. For more information see https://tru.ltd
# Licensed under the Apache License, version 2.0: https://github.com/TruLtd/tru-reputation-token/blob/master/LICENSE
# This script is used to set git tags after the commit

CURRENTVER=$(node -e "console.log(require('./package.json').version);")
git tag -a $CURRENTVER -m "$CURRENTVER"