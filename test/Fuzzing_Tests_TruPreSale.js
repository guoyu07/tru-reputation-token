/**
 * @file        The following Tests are written for fuzz testing the TruPreSale Smart Contract as part of good 
 * security and development practice to detect unhandled exceptions, bugs and security holes in any or all 
 * contracts or libraries used by the Tru Reputation Token. These tests can take a very long time to perform 
 * as they use large data sets and loops to effectively test the functionality. Documentation for these tests 
 * are maintained outside of these files for sake of clarity and can be found at {@link https://trultd.readthedocs.org}
 * 
 * @author      Ian Bray, Tru Ltd
 * @copyright   2017 Tru Ltd
 */

'use strict';
const BigNumber = web3.BigNumber;
const TruReputationToken = artifacts.require('./TruReputationToken.sol');
const TruPreSale = artifacts.require('./TruPreSale.sol');
import { increaseTime, increaseTimeTo, duration } from './helpers/increaseTime';
import expectFuzzFail from './helpers/expectFuzzFail';
import expectNotDeployed from './helpers/expectNotDeployed';

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

let fuzzer = require("fuzzer");
let fuzzStrOne = '0xPerfectlyWastedStringOnePerfectlyWastedStringOnePerfectlyWastedStringOnePerfectlyWastedStringOne';
let fuzzStrTwo = "0xFuzzyStringThatShouldAlwaysFailTwoFuzzyStringThatShouldAlwaysFailTwoFuzzyStringThatShouldAlwaysFailTwo";
let fuzzStrThree = "0xANonsenseStringForFuzzingThreeANonsenseStringForFuzzingThreeANonsenseStringForFuzzingThree";
let fuzzStrFour = "ogaEDNPdWYAkouECXukowmDWQJpyAmxHiBgToykXrznAbVpTtluLTbaOHVKmZJCIQWolwIemZlJxumZjPaGwhLLrXgSCXlHRRvtH";
let fuzzStrFive = "DskPMBMAMSWkFATtkwwPEAYxNrHGDrDPlnHUcYJiKUFJtcjLwPhtsdTtrOWXHwGqiioaAfNUTIfiXJaJYxCkoxQpPNDArQlgcKgr";
let fuzzStrSix = "eSrXfsRCyRZPxJGTjDcpzeYHkTHoRQbhGZTfoNMKFXpLzDLClnnvLDKdZgKqpYcaeMFspKeMkCXeUaVpPCWFIJlrplGzMlbhTRUZ";
let timeoutDuration = 0;
let oneDayTS = 86400;
let oneMonthTS = 2592000;
let fuzzLoops = parseInt(process.env.FUZZLOOPS || '1000');
let loopStart = 1000;
let loopEnd = loopStart + fuzzLoops;

contract('TruPreSale', function(accounts) {

  let truToken;
  let psStartTime;
  let psEndTime;
  let preSale;
  let acctOne = accounts[0];
  let acctTwo = accounts[1];
  let acctThree = accounts[2];
  let acctSix = accounts[5];
  let execAcct = accounts[8];
  let currentTime = web3.eth.getBlock('latest').timestamp;
  fuzzer.seed(0);

  it('FUZZING TESTS - TRUPRESALE - TEST CASE 01: Fuzz test of TruPreSale Constructor with invalid parameters', async function() {
    let fuzzGenOne, fuzzGenTwo, saleDeployed;

    // Setup Tru Token
    truToken = await TruReputationToken.new({ from: acctOne });
    await truToken.changeBoardAddress(execAcct, { from: acctOne });
    currentTime = web3.eth.getBlock('latest').timestamp;

    // TEST CASE 01: Pre-Fuzz Test #1
    saleDeployed = await expectNotDeployed(TruPreSale.deployed());
    assert.isUndefined(saleDeployed,
      '\n      ' +
      'FUZZING TESTS - TRUPRESALE - TEST CASE 01: Pre-Fuzz Test #1\n      ' +
      'TEST DESCRIPTION: TruPreSale should not be deployed\n      ' +
      'EXPECTED RESULT: undefined\n      ' +
      'ACTUAL RESULT: ' + saleDeployed);

    // Fuzzing
    for (var i = loopStart; i < loopEnd; i++) {
      let pass = i - loopStart + 1;
      fuzzer.seed(i);
      fuzzGenOne = fuzzer.mutate.string(fuzzStrOne);
      fuzzGenTwo = fuzzer.mutate.string(fuzzStrTwo);
      let validStart = currentTime + oneMonthTS;
      let validExpiry = validStart + oneDayTS;

      // TEST CASE 01: Test #1
      await expectFuzzFail(TruPreSale.new(fuzzGenOne, validExpiry, truToken.address, execAcct, { from: acctOne }));
      saleDeployed = await expectNotDeployed(TruPreSale.deployed());
      assert.isUndefined(saleDeployed,
        '\n      ' +
        'FUZZING TESTS - TRUPRESALE - TEST CASE 01: Pass #' + pass + ', Test #1\n      ' +
        'TEST DESCRIPTION: TruPreSale should not be deployed\n      ' +
        'EXPECTED RESULT: undefined\n      ' +
        'ACTUAL RESULT: ' + saleDeployed);

      // TEST CASE 01: Test #2
      await expectFuzzFail(TruPreSale.new(validStart, fuzzGenTwo, truToken.address, execAcct, { from: acctOne }))
      saleDeployed = await expectNotDeployed(TruPreSale.deployed());
      assert.isUndefined(saleDeployed,
        '\n      ' +
        'FUZZING TESTS - TRUPRESALE - TEST CASE 01: Pass #' + pass + ', Test #2\n      ' +
        'TEST DESCRIPTION: TruPreSale should not be deployed\n      ' +
        'EXPECTED RESULT: undefined\n      ' +
        'ACTUAL RESULT: ' + saleDeployed);

      // TEST CASE 01: Test #3
      await expectFuzzFail(TruPreSale.new(validStart, validExpiry, fuzzGenOne, execAcct, { from: acctOne }));
      saleDeployed = await expectNotDeployed(TruPreSale.deployed());
      assert.isUndefined(saleDeployed,
        '\n      ' +
        'FUZZING TESTS - TRUPRESALE - TEST CASE 01: Pass #' + pass + ', Test #3\n      ' +
        'TEST DESCRIPTION: TruPreSale should not be deployed\n      ' +
        'EXPECTED RESULT: undefined\n      ' +
        'ACTUAL RESULT: ' + saleDeployed);

      // TEST CASE 01: Test #4
      await expectFuzzFail(TruPreSale.new(validStart, validExpiry, truToken.address, fuzzGenOne, { from: fuzzGenOne }))
      saleDeployed = await expectNotDeployed(TruPreSale.deployed());
      assert.isUndefined(saleDeployed,
        '\n      ' +
        'FUZZING TESTS - TRUPRESALE - TEST CASE 01: Pass #' + pass + ', Test #4\n      ' +
        'TEST DESCRIPTION: TruPreSale should not be deployed\n      ' +
        'EXPECTED RESULT: undefined\n      ' +
        'ACTUAL RESULT: ' + saleDeployed);

      // TEST CASE 01: Test #5
      await expectFuzzFail(TruPreSale.new(validStart, validExpiry, truToken.address, execAcct, { from: fuzzGenOne }))
      saleDeployed = await expectNotDeployed(TruPreSale.deployed());
      assert.isUndefined(saleDeployed,
        '\n      ' +
        'FUZZING TESTS - TRUPRESALE - TEST CASE 01: Pass #' + pass + ', Test #5\n      ' +
        'TEST DESCRIPTION: TruPreSale should not be deployed\n      ' +
        'EXPECTED RESULT: undefined\n      ' +
        'ACTUAL RESULT: ' + saleDeployed);

      // TEST CASE 01: Test #6
      await expectFuzzFail(TruPreSale.new(fuzzGenOne, fuzzGenTwo, truToken.address, execAcct, { from: acctOne }))
      saleDeployed = await expectNotDeployed(TruPreSale.deployed());
      assert.isUndefined(saleDeployed,
        '\n      ' +
        'FUZZING TESTS - TRUPRESALE - TEST CASE 01: Pass #' + pass + ', Test #6\n      ' +
        'TEST DESCRIPTION: TruPreSale should not be deployed\n      ' +
        'EXPECTED RESULT: undefined\n      ' +
        'ACTUAL RESULT: ' + saleDeployed);

      // TEST CASE 01: Test #7
      await expectFuzzFail(TruPreSale.new(fuzzGenOne, validExpiry, fuzzGenTwo, execAcct, { from: acctOne }))
      saleDeployed = await expectNotDeployed(TruPreSale.deployed());
      assert.isUndefined(saleDeployed,
        '\n      ' +
        'FUZZING TESTS - TRUPRESALE - TEST CASE 01: Pass #' + pass + ', Test #7\n      ' +
        'TEST DESCRIPTION: TruPreSale should not be deployed\n      ' +
        'EXPECTED RESULT: undefined\n      ' +
        'ACTUAL RESULT: ' + saleDeployed);

      // TEST CASE 01: Test #8
      await expectFuzzFail(TruPreSale.new(fuzzGenOne, validExpiry, truToken.address, fuzzGenTwo, { from: acctOne }))
      saleDeployed = await expectNotDeployed(TruPreSale.deployed());
      assert.isUndefined(saleDeployed,
        '\n      ' +
        'FUZZING TESTS - TRUPRESALE - TEST CASE 01: Pass #' + pass + ', Test #8\n      ' +
        'TEST DESCRIPTION: TruPreSale should not be deployed\n      ' +
        'EXPECTED RESULT: undefined\n      ' +
        'ACTUAL RESULT: ' + saleDeployed);

      // TEST CASE 01: Test #9
      await expectFuzzFail(TruPreSale.new(fuzzGenOne, validExpiry, truToken.address, execAcct, { from: fuzzGenOne }))
      saleDeployed = await expectNotDeployed(TruPreSale.deployed());
      assert.isUndefined(saleDeployed,
        '\n      ' +
        'FUZZING TESTS - TRUPRESALE - TEST CASE 01: Pass #' + pass + ', Test #9\n      ' +
        'TEST DESCRIPTION: TruPreSale should not be deployed\n      ' +
        'EXPECTED RESULT: undefined\n      ' +
        'ACTUAL RESULT: ' + saleDeployed);

      // TEST CASE 01: Test #10
      await expectFuzzFail(TruPreSale.new(validStart, fuzzGenOne, truToken.address, execAcct, { from: fuzzGenOne }))
      saleDeployed = await expectNotDeployed(TruPreSale.deployed());
      assert.isUndefined(saleDeployed,
        '\n      ' +
        'FUZZING TESTS - TRUPRESALE - TEST CASE 01: Pass #' + pass + ', Test #10\n      ' +
        'TEST DESCRIPTION: TruPreSale should not be deployed\n      ' +
        'EXPECTED RESULT: undefined\n      ' +
        'ACTUAL RESULT: ' + saleDeployed);

      // TEST CASE 01: Test #11
      await expectFuzzFail(TruPreSale.new(validStart, validExpiry, fuzzGenOne, execAcct, { from: fuzzGenTwo }))
      saleDeployed = await expectNotDeployed(TruPreSale.deployed());
      assert.isUndefined(saleDeployed,
        '\n      ' +
        'FUZZING TESTS - TRUPRESALE - TEST CASE 01: Pass #' + pass + ', Test #11\n      ' +
        'TEST DESCRIPTION: TruPreSale should not be deployed\n      ' +
        'EXPECTED RESULT: undefined\n      ' +
        'ACTUAL RESULT: ' + saleDeployed);

      // TEST CASE 01: Test #12
      await expectFuzzFail(TruPreSale.new(validStart, validExpiry, truToken.address, fuzzGenOne, { from: fuzzGenTwo }))
      saleDeployed = await expectNotDeployed(TruPreSale.deployed());
      assert.isUndefined(saleDeployed,
        '\n      ' +
        'FUZZING TESTS - TRUPRESALE - TEST CASE 01: Pass #' + pass + ', Test #12\n      ' +
        'TEST DESCRIPTION: TruPreSale should not be deployed\n      ' +
        'EXPECTED RESULT: undefined\n      ' +
        'ACTUAL RESULT: ' + saleDeployed);

      // TEST CASE 01: Test #13
      await expectFuzzFail(TruPreSale.new(validStart, fuzzGenOne, fuzzGenOne, execAcct, { from: fuzzGenTwo }))
      saleDeployed = await expectNotDeployed(TruPreSale.deployed());
      assert.isUndefined(saleDeployed,
        '\n      ' +
        'FUZZING TESTS - TRUPRESALE - TEST CASE 01: Pass #' + pass + ', Test #13\n      ' +
        'TEST DESCRIPTION: TruPreSale should not be deployed\n      ' +
        'EXPECTED RESULT: undefined\n      ' +
        'ACTUAL RESULT: ' + saleDeployed);

      // TEST CASE 01: Test #14
      await expectFuzzFail(TruPreSale.new(fuzzGenOne, fuzzGenTwo, truToken.address, execAcct, { from: fuzzGenTwo }))
      saleDeployed = await expectNotDeployed(TruPreSale.deployed());
      assert.isUndefined(saleDeployed,
        '\n      ' +
        'FUZZING TESTS - TRUPRESALE - TEST CASE 01: Pass #' + pass + ', Test #14\n      ' +
        'TEST DESCRIPTION: TruPreSale should not be deployed\n      ' +
        'EXPECTED RESULT: undefined\n      ' +
        'ACTUAL RESULT: ' + saleDeployed);

      // TEST CASE 01: Test #15
      await expectFuzzFail(TruPreSale.new(fuzzGenOne, fuzzGenTwo, fuzzGenOne, execAcct, { from: acctOne }))
      saleDeployed = await expectNotDeployed(TruPreSale.deployed());
      assert.isUndefined(saleDeployed,
        '\n      ' +
        'FUZZING TESTS - TRUPRESALE - TEST CASE 01: Pass #' + pass + ', Test #15\n      ' +
        'TEST DESCRIPTION: TruPreSale should not be deployed\n      ' +
        'EXPECTED RESULT: undefined\n      ' +
        'ACTUAL RESULT: ' + saleDeployed);

      // TEST CASE 01: Test #16
      await expectFuzzFail(TruPreSale.new(fuzzGenOne, fuzzGenTwo, truToken.address, fuzzGenOne, { from: acctOne }))
      saleDeployed = await expectNotDeployed(TruPreSale.deployed());
      assert.isUndefined(saleDeployed,
        '\n      ' +
        'FUZZING TESTS - TRUPRESALE - TEST CASE 01: Pass #' + pass + ', Test #16\n      ' +
        'TEST DESCRIPTION: TruPreSale should not be deployed\n      ' +
        'EXPECTED RESULT: undefined\n      ' +
        'ACTUAL RESULT: ' + saleDeployed);

      // TEST CASE 01: Test #17
      await expectFuzzFail(TruPreSale.new(fuzzGenOne, fuzzGenTwo, fuzzGenOne, fuzzGenOne, { from: fuzzGenTwo }))
      saleDeployed = await expectNotDeployed(TruPreSale.deployed());
      assert.isUndefined(saleDeployed,
        '\n      ' +
        'FUZZING TESTS - TRUPRESALE - TEST CASE 01: Pass #' + pass + ', Test #17\n      ' +
        'TEST DESCRIPTION: TruPreSale should not be deployed\n      ' +
        'EXPECTED RESULT: undefined\n      ' +
        'ACTUAL RESULT: ' + saleDeployed);
    }

    // TEST CASE 01: Post-Fuzz Test #1
    saleDeployed = await expectNotDeployed(TruPreSale.deployed());
    assert.isUndefined(saleDeployed,
      '\n      ' +
      'FUZZING TESTS - TRUPRESALE - TEST CASE 01: Post-Fuzz Test #1\n      ' +
      'TEST DESCRIPTION: TruPreSale should not be deployed\n      ' +
      'EXPECTED RESULT: undefined\n      ' +
      'ACTUAL RESULT: ' + saleDeployed);
  }).timeout(timeoutDuration);

  it('FUZZING TESTS - TRUPRESALE - TEST CASE 02: Fuzz test of TruPreSale updateWhiteList with invalid parameters', async function() {
    let fuzzGenOne, fuzzGenTwo;
    currentTime = web3.eth.getBlock('latest').timestamp;
    psStartTime = currentTime + oneDayTS;
    psEndTime = psStartTime + oneMonthTS;
    preSale = await TruPreSale.new(psStartTime, psEndTime, truToken.address, execAcct, { from: acctOne });
    let actThreeWhiteListed, actSixWhiteListed;

    await preSale.updateWhitelist(acctThree, 1, { from: acctOne });
    // TEST CASE 02: Pre-Fuzz Test #1a
    actThreeWhiteListed = await preSale.purchaserWhiteList(acctThree, { from: acctOne });
    assert.isTrue(actThreeWhiteListed,
      '\n      ' +
      'FUZZING TESTS - TRUPRESALE - TEST CASE 02: Pre-Fuzz Test #1a\n      ' +
      'TEST DESCRIPTION: Account Three should be on WhiteList\n      ' +
      'EXPECTED RESULT: true\n      ' +
      'ACTUAL RESULT: ' + actThreeWhiteListed);

    // TEST CASE 02: Pre-Fuzz Test #1b
    actSixWhiteListed = await preSale.purchaserWhiteList(acctSix, { from: acctOne });
    assert.isFalse(actSixWhiteListed,
      '\n      ' +
      'FUZZING TESTS - TRUPRESALE - TEST CASE 02: Pre-Fuzz Test #1b\n      ' +
      'TEST DESCRIPTION: Account Six should not be on WhiteList\n      ' +
      'EXPECTED RESULT: false\n      ' +
      'ACTUAL RESULT: ' + actSixWhiteListed);

    // Fuzzing
    for (var i = loopStart; i < loopEnd; i++) {
      let pass = i - loopStart + 1;
      fuzzer.seed(i);
      fuzzGenOne = fuzzer.mutate.string(fuzzStrOne);
      fuzzGenTwo = fuzzer.mutate.string(fuzzStrTwo);

      // TEST CASE 02: Test #1
      await expectFuzzFail(preSale.updateWhitelist(fuzzGenOne, 1, { from: acctOne }));
      actThreeWhiteListed = await preSale.purchaserWhiteList(acctThree, { from: acctOne });
      assert.isTrue(actThreeWhiteListed,
        '\n      ' +
        'FUZZING TESTS - TRUPRESALE - TEST CASE 02: Pass #' + pass + ', Test #1a\n      ' +
        'TEST DESCRIPTION: Account Three should be on WhiteList\n      ' +
        'EXPECTED RESULT: true\n      ' +
        'ACTUAL RESULT: ' + actThreeWhiteListed);
      actSixWhiteListed = await preSale.purchaserWhiteList(acctSix, { from: acctOne });
      assert.isFalse(actSixWhiteListed,
        '\n      ' +
        'FUZZING TESTS - TRUPRESALE - TEST CASE 02: Pass #' + pass + ', Test #1b\n      ' +
        'TEST DESCRIPTION: Account Six should not be on WhiteList\n      ' +
        'EXPECTED RESULT: false\n      ' +
        'ACTUAL RESULT: ' + actSixWhiteListed);

      // TEST CASE 02: Test #2
      await expectFuzzFail(preSale.updateWhitelist(fuzzGenOne, fuzzGenTwo, { from: acctOne }))
      actThreeWhiteListed = await preSale.purchaserWhiteList(acctThree, { from: acctOne });
      assert.isTrue(actThreeWhiteListed,
        '\n      ' +
        'FUZZING TESTS - TRUPRESALE - TEST CASE 02: Pass #' + pass + ', Test #2a\n      ' +
        'TEST DESCRIPTION: Account Three should be on WhiteList\n      ' +
        'EXPECTED RESULT: true\n      ' +
        'ACTUAL RESULT: ' + actThreeWhiteListed);
      actSixWhiteListed = await preSale.purchaserWhiteList(acctSix, { from: acctOne });
      assert.isFalse(actSixWhiteListed,
        '\n      ' +
        'FUZZING TESTS - TRUPRESALE - TEST CASE 02: Pass #' + pass + ', Test #2b\n      ' +
        'TEST DESCRIPTION: Account Six should not be on WhiteList\n      ' +
        'EXPECTED RESULT: false\n      ' +
        'ACTUAL RESULT: ' + actSixWhiteListed);

      // TEST CASE 02: Test #3
      await expectFuzzFail(preSale.updateWhitelist(acctSix, 1, { from: fuzzGenOne }))
      actThreeWhiteListed = await preSale.purchaserWhiteList(acctThree, { from: acctOne });
      assert.isTrue(actThreeWhiteListed,
        '\n      ' +
        'FUZZING TESTS - TRUPRESALE - TEST CASE 02: Pass #' + pass + ', Test #3a\n      ' +
        'TEST DESCRIPTION: Account Three should be on WhiteList\n      ' +
        'EXPECTED RESULT: true\n      ' +
        'ACTUAL RESULT: ' + actThreeWhiteListed);
      actSixWhiteListed = await preSale.purchaserWhiteList(acctSix, { from: acctOne });
      assert.isFalse(actSixWhiteListed,
        '\n      ' +
        'FUZZING TESTS - TRUPRESALE - TEST CASE 02: Pass #' + pass + ', Test #3b\n      ' +
        'TEST DESCRIPTION: Account Six should not be on WhiteList\n      ' +
        'EXPECTED RESULT: false\n      ' +
        'ACTUAL RESULT: ' + actSixWhiteListed);

      // TEST CASE 02: Test #4
      await expectFuzzFail(preSale.updateWhitelist(fuzzGenOne, fuzzGenTwo, { from: acctOne }));
      actThreeWhiteListed = await preSale.purchaserWhiteList(acctThree, { from: acctOne });
      assert.isTrue(actThreeWhiteListed,
        '\n      ' +
        'FUZZING TESTS - TRUPRESALE - TEST CASE 02: Pass #' + pass + ', Test #4a\n      ' +
        'TEST DESCRIPTION: Account Three should be on WhiteList\n      ' +
        'EXPECTED RESULT: true\n      ' +
        'ACTUAL RESULT: ' + actThreeWhiteListed);
      actSixWhiteListed = await preSale.purchaserWhiteList(acctSix, { from: acctOne });
      assert.isFalse(actSixWhiteListed,
        '\n      ' +
        'FUZZING TESTS - TRUPRESALE - TEST CASE 02: Pass #' + pass + ', Test #4b\n      ' +
        'TEST DESCRIPTION: Account Six should not be on WhiteList\n      ' +
        'EXPECTED RESULT: false\n      ' +
        'ACTUAL RESULT: ' + actSixWhiteListed);

      // TEST CASE 02: Test #5
      await expectFuzzFail(preSale.updateWhitelist(fuzzGenOne, fuzzGenOne, { from: fuzzGenTwo }));
      actThreeWhiteListed = await preSale.purchaserWhiteList(acctThree, { from: acctOne });
      assert.isTrue(actThreeWhiteListed,
        '\n      ' +
        'FUZZING TESTS - TRUPRESALE - TEST CASE 02: Pass #' + pass + ', Test #5a\n      ' +
        'TEST DESCRIPTION: Account Three should be on WhiteList\n      ' +
        'EXPECTED RESULT: true\n      ' +
        'ACTUAL RESULT: ' + actThreeWhiteListed);
      actSixWhiteListed = await preSale.purchaserWhiteList(acctSix, { from: acctOne });
      assert.isFalse(actSixWhiteListed,
        '\n      ' +
        'FUZZING TESTS - TRUPRESALE - TEST CASE 02: Pass #' + pass + ', Test #5b\n      ' +
        'TEST DESCRIPTION: Account Six should not be on WhiteList\n      ' +
        'EXPECTED RESULT: false\n      ' +
        'ACTUAL RESULT: ' + actSixWhiteListed);

      // TEST CASE 02: Test #6
      await expectFuzzFail(preSale.updateWhitelist(fuzzGenOne, fuzzGenTwo, { from: fuzzGenTwo }));
      actThreeWhiteListed = await preSale.purchaserWhiteList(acctThree, { from: acctOne });
      assert.isTrue(actThreeWhiteListed,
        '\n      ' +
        'FUZZING TESTS - TRUPRESALE - TEST CASE 02: Pass #' + pass + ', Test #6a\n      ' +
        'TEST DESCRIPTION: Account Three should be on WhiteList\n      ' +
        'EXPECTED RESULT: true\n      ' +
        'ACTUAL RESULT: ' + actThreeWhiteListed);
      actSixWhiteListed = await preSale.purchaserWhiteList(acctSix, { from: acctOne });
      assert.isFalse(actSixWhiteListed,
        '\n      ' +
        'FUZZING TESTS - TRUPRESALE - TEST CASE 02: Pass #' + pass + ', Test #6b\n      ' +
        'TEST DESCRIPTION: Account Six should not be on WhiteList\n      ' +
        'EXPECTED RESULT: false\n      ' +
        'ACTUAL RESULT: ' + actSixWhiteListed);

      // TEST CASE 02: Test #7
      await expectFuzzFail(preSale.updateWhitelist(0x0, 2, { from: acctOne }));
      actThreeWhiteListed = await preSale.purchaserWhiteList(acctThree, { from: acctOne });
      assert.isTrue(actThreeWhiteListed,
        '\n      ' +
        'FUZZING TESTS - TRUPRESALE - TEST CASE 02: Pass #' + pass + ', Test #7a\n      ' +
        'TEST DESCRIPTION: Account Three should be on WhiteList\n      ' +
        'EXPECTED RESULT: true\n      ' +
        'ACTUAL RESULT: ' + actThreeWhiteListed);
      actSixWhiteListed = await preSale.purchaserWhiteList(acctSix, { from: acctOne });
      assert.isFalse(actSixWhiteListed,
        '\n      ' +
        'FUZZING TESTS - TRUPRESALE - TEST CASE 02: Pass #' + pass + ', Test #7b\n      ' +
        'TEST DESCRIPTION: Account Six should not be on WhiteList\n      ' +
        'EXPECTED RESULT: false\n      ' +
        'ACTUAL RESULT: ' + actSixWhiteListed);

      // TEST CASE 02: Test #8
      await expectFuzzFail(preSale.updateWhitelist(acctSix, 3, { from: acctOne }));
      actThreeWhiteListed = await preSale.purchaserWhiteList(acctThree, { from: acctOne });
      assert.isTrue(actThreeWhiteListed,
        '\n      ' +
        'FUZZING TESTS - TRUPRESALE - TEST CASE 02: Pass #' + pass + ', Test #8a\n      ' +
        'TEST DESCRIPTION: Account Three should be on WhiteList\n      ' +
        'EXPECTED RESULT: true\n      ' +
        'ACTUAL RESULT: ' + actThreeWhiteListed);
      actSixWhiteListed = await preSale.purchaserWhiteList(acctSix, { from: acctOne });
      assert.isFalse(actSixWhiteListed,
        '\n      ' +
        'FUZZING TESTS - TRUPRESALE - TEST CASE 02: Pass #' + pass + ', Test #8b\n      ' +
        'TEST DESCRIPTION: Account Six should not be on WhiteList\n      ' +
        'EXPECTED RESULT: false\n      ' +
        'ACTUAL RESULT: ' + actSixWhiteListed);
    }

    // TEST CASE 02: Post-Fuzz Test #1a
    actThreeWhiteListed = await preSale.purchaserWhiteList(acctThree, { from: acctOne });
    assert.isTrue(actThreeWhiteListed,
      '\n      ' +
      'FUZZING TESTS - TRUPRESALE - TEST CASE 02: Post-Fuzz Test #1a\n      ' +
      'TEST DESCRIPTION: Account Three should be on WhiteList\n      ' +
      'EXPECTED RESULT: true\n      ' +
      'ACTUAL RESULT: ' + actThreeWhiteListed);

    // TEST CASE 02: Post-Fuzz Test #1b
    actSixWhiteListed = await preSale.purchaserWhiteList(acctSix, { from: acctOne });
    assert.isFalse(actSixWhiteListed,
      '\n      ' +
      'FUZZING TESTS - TRUPRESALE - TEST CASE 02: Post-Fuzz Test #1b\n      ' +
      'TEST DESCRIPTION: Account Six should not be on WhiteList\n      ' +
      'EXPECTED RESULT: false\n      ' +
      'ACTUAL RESULT: ' + actSixWhiteListed);
  }).timeout(timeoutDuration);

  it('FUZZING TESTS - TRUPRESALE - TEST CASE 03: Fuzz test of TruPreSale buy with invalid parameters', async function() {
    let fuzzGenOne, fuzzGenTwo, weiRaised;
    let duringPreSale = psStartTime + oneDayTS;
    await increaseTimeTo(duringPreSale);

    // TEST CASE 03: Pre-Fuzz Test #1
    weiRaised = await preSale.weiRaised.call();
    assert.equal(weiRaised,
      0,
      '\n      ' +
      'FUZZING TESTS - TRUPRESALE - TEST CASE 03: Pre-Fuzz Test #1\n      ' +
      'TEST DESCRIPTION: Wei Raised on PreSale should be 0\n      ' +
      'EXPECTED RESULT: 0\n      ' +
      'ACTUAL RESULT: ' + web3.fromWei(weiRaised, 'ether') + ' ETH');

    // Fuzzing
    for (var i = loopStart; i < loopEnd; i++) {
      let pass = i - loopStart + 1;
      fuzzer.seed(i);
      fuzzGenOne = fuzzer.mutate.string(fuzzStrOne);
      fuzzGenTwo = fuzzer.mutate.string(fuzzStrTwo);

      // TEST CASE 03: Test #1
      await expectFuzzFail(preSale.buy({ from: acctOne, value: fuzzGenOne }))
      weiRaised = await preSale.weiRaised.call();
      assert.equal(weiRaised,
        0,
        '\n      ' +
        'FUZZING TESTS - TRUPRESALE - TEST CASE 03: Pass #' + pass + ', Test #1\n      ' +
        'TEST DESCRIPTION: Wei Raised on PreSale should be 0\n      ' +
        'EXPECTED RESULT: 0\n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(weiRaised, 'ether') + ' ETH');

      // TEST CASE 03: Test #2
      await expectFuzzFail(preSale.buy({ from: fuzzGenOne, value: web3.toWei(1, 'ether') }));
      weiRaised = await preSale.weiRaised.call();
      assert.equal(weiRaised,
        0,
        '\n      ' +
        'FUZZING TESTS - TRUPRESALE - TEST CASE 03: Pass #' + pass + ', Test #2\n      ' +
        'TEST DESCRIPTION: Wei Raised on PreSale should be 0\n      ' +
        'EXPECTED RESULT: 0\n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(weiRaised, 'ether') + ' ETH');

      // TEST CASE 03: Test #3
      await expectFuzzFail(preSale.buy({ from: fuzzGenOne, value: fuzzGenTwo }));
      weiRaised = await preSale.weiRaised.call();
      assert.equal(weiRaised,
        0,
        '\n      ' +
        'FUZZING TESTS - TRUPRESALE - TEST CASE 03: Pass #' + pass + ', Test #3\n      ' +
        'TEST DESCRIPTION: Wei Raised on PreSale should be 0\n      ' +
        'EXPECTED RESULT: 0\n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(weiRaised, 'ether') + ' ETH');

      // TEST CASE 03: Test #4
      await expectFuzzFail(preSale.buy({ from: 0x0, value: 0 }));
      weiRaised = await preSale.weiRaised.call();
      assert.equal(weiRaised,
        0,
        '\n      ' +
        'FUZZING TESTS - TRUPRESALE - TEST CASE 03: Pass #' + pass + ', Test #4\n      ' +
        'TEST DESCRIPTION: Wei Raised on PreSale should be 0\n      ' +
        'EXPECTED RESULT: 0\n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(weiRaised, 'ether') + ' ETH');

      // TEST CASE 03: Test #5
      await expectFuzzFail(preSale.buy({ from: 0x0, value: fuzzGenTwo }));
      weiRaised = await preSale.weiRaised.call();
      assert.equal(weiRaised,
        0,
        '\n      ' +
        'FUZZING TESTS - TRUPRESALE - TEST CASE 03: Pass #' + pass + ', Test #5\n      ' +
        'TEST DESCRIPTION: Wei Raised on PreSale should be 0\n      ' +
        'EXPECTED RESULT: 0\n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(weiRaised, 'ether') + ' ETH');

      // TEST CASE 03: Test #6
      await expectFuzzFail(preSale.buy({ from: 0x0, value: web3.toWei(1, 'ether') }));
      weiRaised = await preSale.weiRaised.call();
      assert.equal(weiRaised,
        0,
        '\n      ' +
        'FUZZING TESTS - TRUPRESALE - TEST CASE 03: Pass #' + pass + ', Test #6\n      ' +
        'TEST DESCRIPTION: Wei Raised on PreSale should be 0\n      ' +
        'EXPECTED RESULT: 0\n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(weiRaised, 'ether') + ' ETH');

      // TEST CASE 03: Test #7
      await expectFuzzFail(preSale.buy({ from: fuzzGenOne, value: web3.toWei(1, 'ether') }));
      weiRaised = await preSale.weiRaised.call();
      assert.equal(weiRaised,
        0,
        '\n      ' +
        'FUZZING TESTS - TRUPRESALE - TEST CASE 03: Pass #' + pass + ', Test #7\n      ' +
        'TEST DESCRIPTION: Wei Raised on PreSale should be 0\n      ' +
        'EXPECTED RESULT: 0\n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(weiRaised, 'ether') + ' ETH');

    }

    // TEST CASE 03: Post-Fuzz Test #1
    weiRaised = await preSale.weiRaised.call();
    assert.equal(weiRaised,
      0,
      '\n      ' +
      'FUZZING TESTS - TRUPRESALE - TEST CASE 03: Post-Fuzz Test #1\n      ' +
      'TEST DESCRIPTION: Wei Raised on PreSale should be 0\n      ' +
      'EXPECTED RESULT: 0\n      ' +
      'ACTUAL RESULT: ' + web3.fromWei(weiRaised, 'ether') + ' ETH');
  }).timeout(timeoutDuration);

  it('FUZZING TESTS - TRUPRESALE - TEST CASE 04: Fuzz test of TruPreSale finalise with invalid parameters', async function() {
    let fuzzGenOne, fuzzGenTwo;

    // TEST CASE 04: Pre-Fuzz Test #1
    let pSaleStatus = await preSale.hasEnded.call();
    assert.isFalse(pSaleStatus,
      '\n      ' +
      'FUZZING TESTS - TRUPRESALE - TEST CASE 04: Pre-Fuzz Test #1\n      ' +
      'TEST DESCRIPTION: PreSale should not have ended\n      ' +
      'EXPECTED RESULT: false\n      ' +
      'ACTUAL RESULT: ' + pSaleStatus);

    // Fuzzing
    for (var i = loopStart; i < loopEnd; i++) {
      let pass = i - loopStart + 1;
      fuzzer.seed(i);
      fuzzGenOne = fuzzer.mutate.string(fuzzStrOne);
      fuzzGenTwo = fuzzer.mutate.string(fuzzStrTwo);

      // TEST CASE 04: Test #1
      await expectFuzzFail(preSale.finalise({ from: fuzzGenOne }));
      pSaleStatus = await preSale.hasEnded.call();
      assert.isFalse(pSaleStatus,
        '\n      ' +
        'FUZZING TESTS - TRUPRESALE - TEST CASE 04: Pass #' + pass + ', Test #1\n      ' +
        'TEST DESCRIPTION: PreSale should not have ended\n      ' +
        'EXPECTED RESULT: false\n      ' +
        'ACTUAL RESULT: ' + pSaleStatus);

      // TEST CASE 04: Test #2
      await expectFuzzFail(preSale.finalise({ from: fuzzGenOne, value: fuzzGenTwo }));
      pSaleStatus = await preSale.hasEnded.call();
      assert.isFalse(pSaleStatus,
        '\n      ' +
        'FUZZING TESTS - TRUPRESALE - TEST CASE 04: Pass #' + pass + ', Test #2\n      ' +
        'TEST DESCRIPTION: PreSale should not have ended\n      ' +
        'EXPECTED RESULT: false\n      ' +
        'ACTUAL RESULT: ' + pSaleStatus);
    }

    // TEST CASE 04: Post-Fuzz Test #1
    pSaleStatus = await preSale.hasEnded.call();
    assert.isFalse(pSaleStatus,
      '\n      ' +
      'FUZZING TESTS - TRUPRESALE - TEST CASE 04: Post-Fuzz Test #1\n      ' +
      'TEST DESCRIPTION: PreSale should not have ended\n      ' +
      'EXPECTED RESULT: false\n      ' +
      'ACTUAL RESULT: ' + pSaleStatus);
  }).timeout(timeoutDuration);

  it('FUZZING TESTS - TRUPRESALE - TEST CASE 05: Fuzz test of TruPreSale halt with invalid parameters', async function() {
    let fuzzGenOne, fuzzGenTwo;

    // TEST CASE 05: Pre-Fuzz Test #1
    let pSaleHaltStatus = await preSale.halted.call();
    assert.isFalse(pSaleHaltStatus,
      '\n      ' +
      'FUZZING TESTS - TRUPRESALE - TEST CASE 05: Pre-Fuzz Test #1\n      ' +
      'TEST DESCRIPTION: PreSale should not be halted\n      ' +
      'EXPECTED RESULT: false\n      ' +
      'ACTUAL RESULT: ' + pSaleHaltStatus);

    // Fuzzing
    for (var i = loopStart; i < loopEnd; i++) {
      let pass = i - loopStart + 1;
      fuzzer.seed(i);
      fuzzGenOne = fuzzer.mutate.string(fuzzStrOne);
      fuzzGenTwo = fuzzer.mutate.string(fuzzStrTwo);

      // TEST CASE 05: Test #1
      await expectFuzzFail(preSale.halt({ from: fuzzGenOne }));
      pSaleHaltStatus = await preSale.halted.call();
      assert.isFalse(pSaleHaltStatus,
        '\n      ' +
        'FUZZING TESTS - TRUPRESALE - TEST CASE 05: Pass #' + pass + ', Test #1\n      ' +
        'TEST DESCRIPTION: PreSale should not be halted\n      ' +
        'EXPECTED RESULT: false\n      ' +
        'ACTUAL RESULT: ' + pSaleHaltStatus);

      // TEST CASE 05: Test #2
      await expectFuzzFail(preSale.halt({ from: fuzzGenOne, to: fuzzGenTwo }));
      pSaleHaltStatus = await preSale.halted.call();
      assert.isFalse(pSaleHaltStatus,
        '\n      ' +
        'FUZZING TESTS - TRUPRESALE - TEST CASE 05: Pass #' + pass + ', Test #2\n      ' +
        'TEST DESCRIPTION: PreSale should not be halted\n      ' +
        'EXPECTED RESULT: false\n      ' +
        'ACTUAL RESULT: ' + pSaleHaltStatus);

      // TEST CASE 05: Test #3
      await expectFuzzFail(preSale.halt({ from: fuzzGenOne, value: fuzzGenTwo }));
      pSaleHaltStatus = await preSale.halted.call();
      assert.isFalse(pSaleHaltStatus,
        '\n      ' +
        'FUZZING TESTS - TRUPRESALE - TEST CASE 05: Pass #' + pass + ', Test #3\n      ' +
        'TEST DESCRIPTION: PreSale should not be halted\n      ' +
        'EXPECTED RESULT: false\n      ' +
        'ACTUAL RESULT: ' + pSaleHaltStatus);
    }

    // TEST CASE 05: Post-Fuzz Test #1
    pSaleHaltStatus = await preSale.halted.call();
    assert.isFalse(pSaleHaltStatus,
      '\n      ' +
      'FUZZING TESTS - TRUPRESALE - TEST CASE 05: Post-Fuzz Test #1\n      ' +
      'TEST DESCRIPTION: PreSale should not be halted\n      ' +
      'EXPECTED RESULT: false\n      ' +
      'ACTUAL RESULT: ' + pSaleHaltStatus);
  }).timeout(timeoutDuration);

  it('FUZZING TESTS - TRUPRESALE - TEST CASE 06: Fuzz test of TruPreSale hasEnded with invalid parameters', async function() {
    let fuzzGenOne, fuzzGenTwo;

    // TEST CASE 06: Pre-Fuzz Test #1
    let hasEnded = await preSale.hasEnded.call();
    assert.isFalse(hasEnded,
      '\n      ' +
      'FUZZING TESTS - TRUPRESALE - TEST CASE 06: Pre-Fuzz Test #1\n      ' +
      'TEST DESCRIPTION: PreSale should not have ended\n      ' +
      'EXPECTED RESULT: false\n      ' +
      'ACTUAL RESULT: ' + hasEnded);

    // Fuzzing
    for (var i = loopStart; i < loopEnd; i++) {
      let pass = i - loopStart + 1;
      fuzzer.seed(i);
      fuzzGenOne = fuzzer.mutate.string(fuzzStrOne);
      fuzzGenTwo = fuzzer.mutate.string(fuzzStrTwo);

      // TEST CASE 06: Test #1
      await expectFuzzFail(preSale.hasEnded.call({ from: fuzzGenOne }));
      hasEnded = await preSale.hasEnded.call();
      assert.isFalse(hasEnded,
        '\n      ' +
        'FUZZING TESTS - TRUPRESALE - TEST CASE 06: Pass #' + pass + ', Test #1\n      ' +
        'TEST DESCRIPTION: PreSale should not have ended\n      ' +
        'EXPECTED RESULT: false\n      ' +
        'ACTUAL RESULT: ' + hasEnded);

      // TEST CASE 06: Test #2
      await expectFuzzFail(preSale.hasEnded.call({ from: fuzzGenOne, value: fuzzGenTwo }))
      hasEnded = await preSale.hasEnded.call();
      assert.isFalse(hasEnded,
        '\n      ' +
        'FUZZING TESTS - TRUPRESALE - TEST CASE 06: Pass #' + pass + ', Test #2\n      ' +
        'TEST DESCRIPTION: PreSale should not have ended\n      ' +
        'EXPECTED RESULT: false\n      ' +
        'ACTUAL RESULT: ' + hasEnded);

      // TEST CASE 06: Test #3
      await expectFuzzFail(preSale.hasEnded.call({ from: fuzzGenOne, to: fuzzGenTwo }))
      hasEnded = await preSale.hasEnded.call();
      assert.isFalse(hasEnded,
        '\n      ' +
        'FUZZING TESTS - TRUPRESALE - TEST CASE 06: Pass #' + pass + ', Test #3\n      ' +
        'TEST DESCRIPTION: PreSale should not have ended\n      ' +
        'EXPECTED RESULT: false\n      ' +
        'ACTUAL RESULT: ' + hasEnded);
    }

    // TEST CASE 06: Post-Fuzz Test #1
    hasEnded = await preSale.hasEnded.call();
    assert.isFalse(hasEnded,
      '\n      ' +
      'FUZZING TESTS - TRUPRESALE - TEST CASE 06: Post-Fuzz Test #1\n      ' +
      'TEST DESCRIPTION: PreSale should not have ended\n      ' +
      'EXPECTED RESULT: false\n      ' +
      'ACTUAL RESULT: ' + hasEnded);
  }).timeout(timeoutDuration);

  it('FUZZING TESTS - TRUPRESALE - TEST CASE 07: Fuzz test of TruPreSale send with invalid parameters', async function() {
    let fuzzGenOne, fuzzGenTwo, fuzzGenThree, fuzzGenFour, fuzzGenFive, fuzzGenSix;
    // Fuzzing
    for (var i = loopStart; i < loopEnd; i++) {
      let pass = i - loopStart + 1;
      fuzzer.seed(i);
      fuzzGenOne = fuzzer.mutate.string(fuzzStrOne);
      fuzzGenTwo = fuzzer.mutate.string(fuzzStrTwo);
      fuzzGenThree = fuzzer.mutate.string(fuzzStrThree);
      fuzzGenFour = fuzzer.mutate.string(fuzzStrFour);
      fuzzGenFive = fuzzer.mutate.string(fuzzStrFive);
      fuzzGenSix = fuzzer.mutate.string(fuzzStrSix);

      // TEST CASE 07: Test #1
      await expectFuzzFail(preSale.send({ from: fuzzGenOne }));

      // TEST CASE 07: Test #2
      await expectFuzzFail(preSale.send({ to: fuzzGenTwo }));

      // TEST CASE 07: Test #3
      await expectFuzzFail(preSale.send({ from: fuzzGenOne, value: fuzzGenThree }));

      // TEST CASE 07: Test #4
      await expectFuzzFail(preSale.send({ from: fuzzGenOne, data: fuzzGenFour }));

      // TEST CASE 07: Test #5
      await expectFuzzFail(preSale.send({ from: fuzzGenOne, gasPrice: fuzzGenFive }));

      // TEST CASE 07: Test #6
      await expectFuzzFail(preSale.send({ from: fuzzGenOne, nonce: fuzzGenSix }));

      // TEST CASE 07: Test #7
      await expectFuzzFail(preSale.send({ from: fuzzGenOne, value: fuzzGenThree }));

      // TEST CASE 07: Test #8
      await expectFuzzFail(preSale.send({ from: fuzzGenOne, to: fuzzGenTwo, value: fuzzGenThree }));

      // TEST CASE 07: Test #9
      await expectFuzzFail(preSale.send({ from: fuzzGenOne, to: fuzzGenTwo, value: fuzzGenThree, data: fuzzGenFour, gasPrice: fuzzGenFive, nonce: fuzzGenSix }));
    }

  }).timeout(timeoutDuration);

  it('FUZZING TESTS - TRUPRESALE - TEST CASE 08: Fuzz test of TruPreSale sendTransaction with invalid parameters', async function() {
    let fuzzGenOne, fuzzGenTwo, fuzzGenThree, fuzzGenFour, fuzzGenFive, fuzzGenSix;
    // Fuzzing
    for (var i = loopStart; i < loopEnd; i++) {
      let pass = i - loopStart + 1;
      fuzzer.seed(i);
      fuzzGenOne = fuzzer.mutate.string(fuzzStrOne);
      fuzzGenTwo = fuzzer.mutate.string(fuzzStrTwo);
      fuzzGenThree = fuzzer.mutate.string(fuzzStrThree);
      fuzzGenFour = fuzzer.mutate.string(fuzzStrFour);
      fuzzGenFive = fuzzer.mutate.string(fuzzStrFive);
      fuzzGenSix = fuzzer.mutate.string(fuzzStrSix);

      // TEST CASE 08: Test #1
      await expectFuzzFail(preSale.sendTransaction({ from: fuzzGenOne }));

      // TEST CASE 08: Test #2
      await expectFuzzFail(preSale.sendTransaction({ to: fuzzGenTwo }));

      // TEST CASE 08: Test #3
      await expectFuzzFail(preSale.sendTransaction({ from: fuzzGenOne, value: fuzzGenThree }));

      // TEST CASE 08: Test #4
      await expectFuzzFail(preSale.sendTransaction({ from: fuzzGenOne, data: fuzzGenFour }));

      // TEST CASE 08: Test #5
      await expectFuzzFail(preSale.sendTransaction({ from: fuzzGenOne, gasPrice: fuzzGenFive }));

      // TEST CASE 08: Test #6
      await expectFuzzFail(preSale.sendTransaction({ from: fuzzGenOne, nonce: fuzzGenSix }));

      // TEST CASE 08: Test #7
      await expectFuzzFail(preSale.sendTransaction({ from: fuzzGenOne, value: fuzzGenThree }));

      // TEST CASE 08: Test #8
      await expectFuzzFail(preSale.sendTransaction({ from: fuzzGenOne, to: fuzzGenTwo, value: fuzzGenThree }));

      // TEST CASE 08: Test #9
      await expectFuzzFail(preSale.sendTransaction({ from: fuzzGenOne, to: fuzzGenTwo, value: fuzzGenThree, data: fuzzGenFour, gasPrice: fuzzGenFive, nonce: fuzzGenSix }));
    }
  }).timeout(timeoutDuration);

  it('FUZZING TESTS - TRUPRESALE - TEST CASE 09: Fuzz test of TruPreSale transferOwnership with invalid parameters', async function() {
    let fuzzGenOne, fuzzGenTwo;

    // TEST CASE 09: Pre-Fuzz Test #1
    let owner = await preSale.owner.call();
    assert.equal(owner,
      acctOne,
      '\n      ' +
      'FUZZING TESTS - TRUPRESALE - TEST CASE 09: Pre-Fuzz Test #1\n      ' +
      'TEST DESCRIPTION: PreSale should be owned by Account One\n      ' +
      'EXPECTED RESULT: ' + acctOne + '\n      ' +
      'ACTUAL RESULT: ' + owner);

    // Fuzzing
    for (var i = loopStart; i < loopEnd; i++) {
      let pass = i - loopStart + 1;
      fuzzer.seed(i);
      fuzzGenOne = fuzzer.mutate.string(fuzzStrOne);
      fuzzGenTwo = fuzzer.mutate.string(fuzzStrTwo);

      // TEST CASE 09: Test #1
      await expectFuzzFail(preSale.transferOwnership(fuzzGenOne, { from: acctOne }));
      owner = await preSale.owner.call();
      assert.equal(owner,
        acctOne,
        '\n      ' +
        'FUZZING TESTS - TRUPRESALE - TEST CASE 09: Pass #' + pass + ', Test #1\n      ' +
        'TEST DESCRIPTION: PreSale should be owned by Account One\n      ' +
        'EXPECTED RESULT: ' + acctOne + '\n      ' +
        'ACTUAL RESULT: ' + owner);

      // TEST CASE 09: Test #2
      await expectFuzzFail(preSale.transferOwnership(acctTwo, { from: fuzzGenTwo }));
      owner = await preSale.owner.call();
      assert.equal(owner,
        acctOne,
        '\n      ' +
        'FUZZING TESTS - TRUPRESALE - TEST CASE 09: Pass #' + pass + ', Test #2\n      ' +
        'TEST DESCRIPTION: PreSale should be owned by Account One\n      ' +
        'EXPECTED RESULT: ' + acctOne + '\n      ' +
        'ACTUAL RESULT: ' + owner);

      // TEST CASE 09: Test #3
      await expectFuzzFail(preSale.transferOwnership(fuzzGenOne, { from: fuzzGenTwo }));
      owner = await preSale.owner.call();
      assert.equal(owner,
        acctOne,
        '\n      ' +
        'FUZZING TESTS - TRUPRESALE - TEST CASE 09: Pass #' + pass + ', Test #3\n      ' +
        'TEST DESCRIPTION: PreSale should be owned by Account One\n      ' +
        'EXPECTED RESULT: ' + acctOne + '\n      ' +
        'ACTUAL RESULT: ' + owner);
    }

    // TEST CASE 09: Post-Fuzz Test #1
    owner = await preSale.owner.call();
    assert.equal(owner,
      acctOne,
      '\n      ' +
      'FUZZING TESTS - TRUPRESALE - TEST CASE 09: Post-Fuzz Test #1\n      ' +
      'TEST DESCRIPTION: PreSale should be owned by Account One\n      ' +
      'EXPECTED RESULT: ' + acctOne + '\n      ' +
      'ACTUAL RESULT: ' + owner);
  }).timeout(timeoutDuration);

  it('FUZZING TESTS - TRUPRESALE - TEST CASE 10: Fuzz test of TruPreSale unhalt with invalid parameters', async function() {
    let fuzzGenOne, fuzzGenTwo;

    await preSale.halt({ from: acctOne });

    // TEST CASE 10: Pre-Fuzz Test #1
    let pSaleHaltStatus = await preSale.halted.call();
    assert.isTrue(pSaleHaltStatus,
      '\n      ' +
      'FUZZING TESTS - TRUPRESALE - TEST CASE 10: Pre-Fuzz Test #1\n      ' +
      'TEST DESCRIPTION: PreSale should be halted\n      ' +
      'EXPECTED RESULT: true\n      ' +
      'ACTUAL RESULT: ' + pSaleHaltStatus);

    // Fuzzing
    for (var i = loopStart; i < loopEnd; i++) {
      let pass = i - loopStart + 1;
      fuzzer.seed(i);
      fuzzGenOne = fuzzer.mutate.string(fuzzStrOne);
      fuzzGenTwo = fuzzer.mutate.string(fuzzStrTwo);

      // TEST CASE 10: Test #1
      await expectFuzzFail(preSale.unhalt({ from: fuzzGenOne }));
      pSaleHaltStatus = await preSale.halted.call();
      assert.isTrue(pSaleHaltStatus,
        '\n      ' +
        'FUZZING TESTS - TRUPRESALE - TEST CASE 10: Pass #' + pass + ', Test #1\n      ' +
        'TEST DESCRIPTION: PreSale should be halted\n      ' +
        'EXPECTED RESULT: true\n      ' +
        'ACTUAL RESULT: ' + pSaleHaltStatus);

      // TEST CASE 10: Test #2
      await expectFuzzFail(preSale.unhalt({ from: fuzzGenOne, to: fuzzGenTwo }));
      pSaleHaltStatus = await preSale.halted.call();
      assert.isTrue(pSaleHaltStatus,
        '\n      ' +
        'FUZZING TESTS - TRUPRESALE - TEST CASE 10: Pass #' + pass + ', Test #2\n      ' +
        'TEST DESCRIPTION: PreSale should be halted\n      ' +
        'EXPECTED RESULT: true\n      ' +
        'ACTUAL RESULT: ' + pSaleHaltStatus);

      // TEST CASE 10: Test #3
      await expectFuzzFail(preSale.unhalt({ from: fuzzGenOne, value: fuzzGenTwo }));
      pSaleHaltStatus = await preSale.halted.call();
      assert.isTrue(pSaleHaltStatus,
        '\n      ' +
        'FUZZING TESTS - TRUPRESALE - TEST CASE 10: Pass #' + pass + ', Test #3\n      ' +
        'TEST DESCRIPTION: PreSale should be halted\n      ' +
        'EXPECTED RESULT: true\n      ' +
        'ACTUAL RESULT: ' + pSaleHaltStatus);
    }

    // TEST CASE 10: Post-Fuzz Test #1
    pSaleHaltStatus = await preSale.halted.call();
    assert.isTrue(pSaleHaltStatus,
      '\n      ' +
      'FUZZING TESTS - TRUPRESALE - TEST CASE 10: Pre-Fuzz Test #1\n      ' +
      'TEST DESCRIPTION: PreSale should be halted\n      ' +
      'EXPECTED RESULT: true\n      ' +
      'ACTUAL RESULT: ' + pSaleHaltStatus);

    // TEST CASE 10: Post-Fuzz Test #2
    await preSale.unhalt({ from: acctOne });
    pSaleHaltStatus = await preSale.halted.call();
    assert.isFalse(pSaleHaltStatus,
      '\n      ' +
      'FUZZING TESTS - TRUPRESALE - TEST CASE 10: Post-Fuzz Test #2\n      ' +
      'TEST DESCRIPTION: PreSale should not be halted\n      ' +
      'EXPECTED RESULT: false\n      ' +
      'ACTUAL RESULT: ' + pSaleHaltStatus);
  }).timeout(timeoutDuration);

  it('FUZZING TESTS - TRUPRESALE - TEST CASE 11: Fuzz test of TruPreSale purchasedAmount with invalid parameters', async function() {
    let fuzzGenOne, fuzzGenTwo;

    // TEST CASE 11: Pre-Fuzz Test #1
    let purchasedAmount = await preSale.purchasedAmount(acctOne, { from: acctOne });
    assert.equal(web3.fromWei(purchasedAmount, 'ether').toFormat(0),
      0,
      '\n      ' +
      'FUZZING TESTS - TRUPRESALE - TEST CASE 11: Pre-Fuzz Test #1\n      ' +
      'TEST DESCRIPTION: Account One should have zero purchased TRU\n      ' +
      'EXPECTED RESULT: 0 TRU\n      ' +
      'ACTUAL RESULT: ' + web3.fromWei(purchasedAmount, 'ether').toFormat(0));

    // Fuzzing
    for (var i = loopStart; i < loopEnd; i++) {
      let pass = i - loopStart + 1;
      fuzzer.seed(i);
      fuzzGenOne = fuzzer.mutate.string(fuzzStrOne);
      fuzzGenTwo = fuzzer.mutate.string(fuzzStrTwo);

      // TEST CASE 11: Test #1
      await expectFuzzFail(preSale.purchasedAmount(fuzzGenOne, { from: acctOne }));
      purchasedAmount = await preSale.purchasedAmount(acctOne, { from: acctOne });
      assert.equal(web3.fromWei(purchasedAmount, 'ether').toFormat(0),
        0,
        '\n      ' +
        'FUZZING TESTS - TRUPRESALE - TEST CASE 11: Pass #' + pass + ', Test #1\n      ' +
        'TEST DESCRIPTION: Account One should have zero purchased TRU\n      ' +
        'EXPECTED RESULT: 0 TRU\n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(purchasedAmount, 'ether').toFormat(0));

      // TEST CASE 11: Test #2
      await expectFuzzFail(preSale.purchasedAmount(fuzzGenOne, { from: fuzzGenTwo }));
      purchasedAmount = await preSale.purchasedAmount(acctOne, { from: acctOne });
      assert.equal(web3.fromWei(purchasedAmount, 'ether').toFormat(0),
        0,
        '\n      ' +
        'FUZZING TESTS - TRUPRESALE - TEST CASE 11: Pass #' + pass + ', Test #2\n      ' +
        'TEST DESCRIPTION: Account One should have zero purchased TRU\n      ' +
        'EXPECTED RESULT: 0 TRU\n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(purchasedAmount, 'ether').toFormat(0));
    }

    // TEST CASE 11: Post-Fuzz Test #1
    purchasedAmount = await preSale.purchasedAmount(acctOne, { from: acctOne });
    assert.equal(web3.fromWei(purchasedAmount, 'ether').toFormat(0),
      0,
      '\n      ' +
      'FUZZING TESTS - TRUPRESALE - TEST CASE 11: Post-Fuzz Test #1\n      ' +
      'TEST DESCRIPTION: Account One should have zero purchased TRU\n      ' +
      'EXPECTED RESULT: 0 TRU\n      ' +
      'ACTUAL RESULT: ' + web3.fromWei(purchasedAmount, 'ether').toFormat(0));
  }).timeout(timeoutDuration);

  it('FUZZING TESTS - TRUPRESALE - TEST CASE 12: Fuzz test of TruPreSale purchaserWhiteList with invalid parameters', async function() {
    let fuzzGenOne, fuzzGenTwo;

    // TEST CASE 12: Pre-Fuzz Test #1
    let onWhiteList = await preSale.purchaserWhiteList(acctOne, { from: acctOne });
    assert.isFalse(onWhiteList,
      '\n      ' +
      'FUZZING TESTS - TRUPRESALE - TEST CASE 12: Pre-Fuzz Test #1\n      ' +
      'TEST DESCRIPTION: Account One should not be on WhiteList\n      ' +
      'EXPECTED RESULT: false\n      ' +
      'ACTUAL RESULT: ' + onWhiteList);

    // Fuzzing
    for (var i = loopStart; i < loopEnd; i++) {
      let pass = i - loopStart + 1;
      fuzzer.seed(i);
      fuzzGenOne = fuzzer.mutate.string(fuzzStrOne);
      fuzzGenTwo = fuzzer.mutate.string(fuzzStrTwo);

      // TEST CASE 12: Test #1
      await expectFuzzFail(preSale.purchaserWhiteList(fuzzGenOne, { from: acctOne }));
      onWhiteList = await preSale.purchaserWhiteList(acctOne, { from: acctOne });
      assert.isFalse(onWhiteList,
        '\n      ' +
        'FUZZING TESTS - TRUPRESALE - TEST CASE 12: Pass #' + pass + ', Test #1\n      ' +
        'TEST DESCRIPTION: Account One should not be on WhiteList\n      ' +
        'EXPECTED RESULT: false\n      ' +
        'ACTUAL RESULT: ' + onWhiteList);

      // TEST CASE 12: Test #2
      await expectFuzzFail(preSale.purchaserWhiteList(fuzzGenOne, { from: fuzzGenTwo }));
      onWhiteList = await preSale.purchaserWhiteList(acctOne, { from: acctOne });
      assert.isFalse(onWhiteList,
        '\n      ' +
        'FUZZING TESTS - TRUPRESALE - TEST CASE 12: Pass #' + pass + ', Test #2\n      ' +
        'TEST DESCRIPTION: Account One should not be on WhiteList\n      ' +
        'EXPECTED RESULT: false\n      ' +
        'ACTUAL RESULT: ' + onWhiteList);
    }

    // TEST CASE 12: Post-Fuzz Test #1
    onWhiteList = await preSale.purchaserWhiteList(acctOne, { from: acctOne });
    assert.isFalse(onWhiteList,
      '\n      ' +
      'FUZZING TESTS - TRUPRESALE - TEST CASE 12: Post-Fuzz Test #1\n      ' +
      'TEST DESCRIPTION: Account One should not be on WhiteList\n      ' +
      'EXPECTED RESULT: false\n      ' +
      'ACTUAL RESULT: ' + onWhiteList);
  }).timeout(timeoutDuration);

  it('FUZZING TESTS - TRUPRESALE - TEST CASE 13: Fuzz test of TruPreSale tokenAmount with invalid parameters', async function() {
    let fuzzGenOne, fuzzGenTwo;

    // TEST CASE 13: Pre-Fuzz Test #1
    let tokenAmount = await preSale.tokenAmount(acctOne, { from: acctOne });
    assert.equal(web3.fromWei(tokenAmount, 'ether').toFormat(0),
      0,
      '\n      ' +
      'FUZZING TESTS - TRUPRESALE - TEST CASE 13: Pre-Fuzz Test #1\n      ' +
      'TEST DESCRIPTION: Account One should have zero TRU balance\n      ' +
      'EXPECTED RESULT: 0 TRU\n      ' +
      'ACTUAL RESULT: ' + web3.fromWei(tokenAmount, 'ether').toFormat(0));

    // Fuzzing
    for (var i = loopStart; i < loopEnd; i++) {
      let pass = i - loopStart + 1;
      fuzzer.seed(i);
      fuzzGenOne = fuzzer.mutate.string(fuzzStrOne);
      fuzzGenTwo = fuzzer.mutate.string(fuzzStrTwo);

      // TEST CASE 13: Test #1
      await expectFuzzFail(preSale.tokenAmount(fuzzGenOne, { from: acctOne }));
      tokenAmount = await preSale.tokenAmount(acctOne, { from: acctOne });
      assert.equal(web3.fromWei(tokenAmount, 'ether').toFormat(0),
        0,
        '\n      ' +
        'FUZZING TESTS - TRUPRESALE - TEST CASE 13: Pass #' + pass + ', Test #1\n      ' +
        'TEST DESCRIPTION: Account One should have zero TRU balance\n      ' +
        'EXPECTED RESULT: 0 TRU\n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(tokenAmount, 'ether').toFormat(0));

      // TEST CASE 13: Test #2
      await expectFuzzFail(preSale.tokenAmount(fuzzGenOne, { from: fuzzGenTwo }));
      tokenAmount = await preSale.tokenAmount(acctOne, { from: acctOne });
      assert.equal(web3.fromWei(tokenAmount, 'ether').toFormat(0),
        0,
        '\n      ' +
        'FUZZING TESTS - TRUPRESALE - TEST CASE 13: Pass #' + pass + ', Test #2\n      ' +
        'TEST DESCRIPTION: Account One should have zero TRU balance\n      ' +
        'EXPECTED RESULT: 0 TRU\n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(tokenAmount, 'ether').toFormat(0));
    }

    // TEST CASE 13: Post-Fuzz Test #1
    tokenAmount = await preSale.tokenAmount(acctOne, { from: acctOne });
    assert.equal(web3.fromWei(tokenAmount, 'ether').toFormat(0),
      0,
      '\n      ' +
      'FUZZING TESTS - TRUPRESALE - TEST CASE 13: Post-Fuzz Test #1\n      ' +
      'TEST DESCRIPTION: Account One should have zero TRU balance\n      ' +
      'EXPECTED RESULT: 0 TRU\n      ' +
      'ACTUAL RESULT: ' + web3.fromWei(tokenAmount, 'ether').toFormat(0));
  }).timeout(timeoutDuration);
});