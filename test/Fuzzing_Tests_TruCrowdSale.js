/**
 * @file        The following Tests are written for fuzz testing the TruCrowdSale Smart Contract as part of good 
 * security and development practice to detect unhandled exceptions, bugs and security holes in any or all 
 * contracts or libraries used by the Tru Reputation Token. These tests can take a very long time to perform 
 * as they use large data sets and loops to effectively test the functionality. Documentation for these tests 
 * are maintained outside of these files for sake of clarity and can be found at {@link https://trultd.readthedocs.org}
 * 
 * @author      Ian Bray, Tru Ltd
 * @copyright   2017 Tru Ltd
 * @version     0.0.10
 */

'use strict';
const BigNumber = web3.BigNumber;
const TruReputationToken = artifacts.require('./TruReputationToken.sol');
const TruPreSale = artifacts.require('./TruPreSale.sol');
const TruCrowdSale = artifacts.require('./TruCrowdSale.sol');
import { increaseTime, increaseTimeTo, duration } from './helpers/increaseTime';
import expectFuzzFail from './helpers/expectFuzzFail';
import expectNotDeployed from './helpers/expectNotDeployed';
import isEven from './helpers/isEven';

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
let fuzzLoops = parseInt(process.env.FUZZLOOPS || '1000');
let loopStart = 1000;
let loopEnd = loopStart + fuzzLoops;

contract('TruCrowdSale', function(accounts) {

  let truToken;
  let psStartTime;
  let sStartTime;
  let sEndTime;
  let psEndTime;
  let preSale;
  let crowdSale;
  let tokenSupply = 0;
  let weiRaised = 0;
  let pSaleCap = 5000;
  let acctOne = accounts[0];
  let accountTwo = accounts[1];
  let accountThree = accounts[2];
  let accountSix = accounts[5];
  let execAcct = accounts[8];
  let currentTime = web3.eth.getBlock('latest').timestamp;
  fuzzer.seed(0);

  it('FUZZING TESTS - TRUCROWDSALE - TEST CASE 01: Fuzz test of TruCrowdSale Constructor with invalid parameters', async function() {
    let fuzzGenOne, fuzzGenTwo, fuzzGenThree, fuzzGenFour, fuzzGenFive, fuzzGenSix, saleDeployed;
    currentTime = web3.eth.getBlock('pending').timestamp;

    // Setup Tru Token
    truToken = await TruReputationToken.new({ from: acctOne });
    await truToken.changeBoardAddress(execAcct, { from: acctOne });

    // TEST CASE 01: Pre-Fuzz Test #1
    saleDeployed = await expectNotDeployed(TruCrowdSale.deployed());
    assert.isUndefined(saleDeployed,
      '\n      ' +
      'FUZZING TESTS - TRUCROWDSALE - TEST CASE 01: Pre-Fuzz Test #1\n      ' +
      'TEST DESCRIPTION: TruCrowdSale should not be deployed\n      ' +
      'EXPECTED RESULT: undefined\n      ' +
      'ACTUAL RESULT: ' + saleDeployed);

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
      let validStart = currentTime + 6000000;
      let validExpiry = validStart + 6000000;

      // TEST CASE 01: Test #1
      await expectFuzzFail(TruCrowdSale.new(fuzzGenOne, validExpiry, truToken.address, execAcct, tokenSupply, weiRaised, { from: acctOne }))
      saleDeployed = await expectNotDeployed(TruCrowdSale.deployed());
      assert.isUndefined(saleDeployed,
        '\n      ' +
        'FUZZING TESTS - TRUCROWDSALE - TEST CASE 01: Pass #' + pass + ', Test #1\n      ' +
        'TEST DESCRIPTION: TruCrowdSale should not be deployed\n      ' +
        'EXPECTED RESULT: undefined\n      ' +
        'ACTUAL RESULT: ' + saleDeployed);

      // TEST CASE 01: Test #2
      await expectFuzzFail(TruCrowdSale.new(validStart, fuzzGenOne, truToken.address, execAcct, tokenSupply, weiRaised, { from: acctOne }))
      saleDeployed = await expectNotDeployed(TruCrowdSale.deployed());
      assert.isUndefined(saleDeployed,
        '\n      ' +
        'FUZZING TESTS - TRUCROWDSALE - TEST CASE 01: Pass #' + pass + ', Test #2\n      ' +
        'TEST DESCRIPTION: TruCrowdSale should not be deployed\n      ' +
        'EXPECTED RESULT: undefined\n      ' +
        'ACTUAL RESULT: ' + saleDeployed);

      // TEST CASE 01: Test #3
      await expectFuzzFail(TruCrowdSale.new(validStart, validExpiry, fuzzGenOne, execAcct, tokenSupply, weiRaised, { from: acctOne }))
      saleDeployed = await expectNotDeployed(TruCrowdSale.deployed());
      assert.isUndefined(saleDeployed,
        '\n      ' +
        'FUZZING TESTS - TRUCROWDSALE - TEST CASE 01: Pass #' + pass + ', Test #3\n      ' +
        'TEST DESCRIPTION: TruCrowdSale should not be deployed\n      ' +
        'EXPECTED RESULT: undefined\n      ' +
        'ACTUAL RESULT: ' + saleDeployed);

      // TEST CASE 01: Test #4
      await expectFuzzFail(TruCrowdSale.new(validStart, validExpiry, fuzzGenOne, execAcct, tokenSupply, weiRaised, { from: acctOne }))
      saleDeployed = await expectNotDeployed(TruCrowdSale.deployed());
      assert.isUndefined(saleDeployed,
        '\n      ' +
        'FUZZING TESTS - TRUCROWDSALE - TEST CASE 01: Pass #' + pass + ', Test #4\n      ' +
        'TEST DESCRIPTION: TruCrowdSale should not be deployed\n      ' +
        'EXPECTED RESULT: undefined\n      ' +
        'ACTUAL RESULT: ' + saleDeployed);

      // TEST CASE 01: Test #5
      await expectFuzzFail(TruCrowdSale.new(validStart, validExpiry, truToken.address, fuzzGenOne, tokenSupply, weiRaised, { from: acctOne }))
      saleDeployed = await expectNotDeployed(TruCrowdSale.deployed());
      assert.isUndefined(saleDeployed,
        '\n      ' +
        'FUZZING TESTS - TRUCROWDSALE - TEST CASE 01: Pass #' + pass + ', Test #5\n      ' +
        'TEST DESCRIPTION: TruCrowdSale should not be deployed\n      ' +
        'EXPECTED RESULT: undefined\n      ' +
        'ACTUAL RESULT: ' + saleDeployed);

      // TEST CASE 01: Test #6
      await expectFuzzFail(TruCrowdSale.new(validStart, validExpiry, truToken.address, execAcct, fuzzGenOne, weiRaised, { from: acctOne }))
      saleDeployed = await expectNotDeployed(TruCrowdSale.deployed());
      assert.isUndefined(saleDeployed,
        '\n      ' +
        'FUZZING TESTS - TRUCROWDSALE - TEST CASE 01: Pass #' + pass + ', Test #6\n      ' +
        'TEST DESCRIPTION: TruCrowdSale should not be deployed\n      ' +
        'EXPECTED RESULT: undefined\n      ' +
        'ACTUAL RESULT: ' + saleDeployed);

      // TEST CASE 01: Test #7
      await expectFuzzFail(TruCrowdSale.new(validStart, validExpiry, truToken.address, execAcct, tokenSupply, fuzzGenOne, { from: acctOne }))
      saleDeployed = await expectNotDeployed(TruCrowdSale.deployed());
      assert.isUndefined(saleDeployed,
        '\n      ' +
        'FUZZING TESTS - TRUCROWDSALE - TEST CASE 01: Pass #' + pass + ', Test #7\n      ' +
        'TEST DESCRIPTION: TruCrowdSale should not be deployed\n      ' +
        'EXPECTED RESULT: undefined\n      ' +
        'ACTUAL RESULT: ' + saleDeployed);

      // TEST CASE 01: Test #8
      await expectFuzzFail(TruCrowdSale.new(validStart, validExpiry, truToken.address, execAcct, tokenSupply, weiRaised, { from: fuzzGenOne }))
      saleDeployed = await expectNotDeployed(TruCrowdSale.deployed());
      assert.isUndefined(saleDeployed,
        '\n      ' +
        'FUZZING TESTS - TRUCROWDSALE - TEST CASE 01: Pass #' + pass + ', Test #8\n      ' +
        'TEST DESCRIPTION: TruCrowdSale should not be deployed\n      ' +
        'EXPECTED RESULT: undefined\n      ' +
        'ACTUAL RESULT: ' + saleDeployed);

      // TEST CASE 01: Test #9
      await expectFuzzFail(TruCrowdSale.new(fuzzGenOne, fuzzGenTwo, truToken.address, execAcct, tokenSupply, weiRaised, { from: acctOne }))
      saleDeployed = await expectNotDeployed(TruCrowdSale.deployed());
      assert.isUndefined(saleDeployed,
        '\n      ' +
        'FUZZING TESTS - TRUCROWDSALE - TEST CASE 01: Pass #' + pass + ', Test #9\n      ' +
        'TEST DESCRIPTION: TruCrowdSale should not be deployed\n      ' +
        'EXPECTED RESULT: undefined\n      ' +
        'ACTUAL RESULT: ' + saleDeployed);

      // TEST CASE 01: Test #10
      await expectFuzzFail(TruCrowdSale.new(fuzzGenOne, fuzzGenTwo, fuzzGenThree, execAcct, tokenSupply, weiRaised, { from: acctOne }))
      saleDeployed = await expectNotDeployed(TruCrowdSale.deployed());
      assert.isUndefined(saleDeployed,
        '\n      ' +
        'FUZZING TESTS - TRUCROWDSALE - TEST CASE 01: Pass #' + pass + ', Test #10\n      ' +
        'TEST DESCRIPTION: TruCrowdSale should not be deployed\n      ' +
        'EXPECTED RESULT: undefined\n      ' +
        'ACTUAL RESULT: ' + saleDeployed);

      // TEST CASE 01: Test #11
      await expectFuzzFail(TruCrowdSale.new(fuzzGenOne, fuzzGenTwo, fuzzGenThree, fuzzGenFour, tokenSupply, weiRaised, { from: acctOne }))
      saleDeployed = await expectNotDeployed(TruCrowdSale.deployed());
      assert.isUndefined(saleDeployed,
        '\n      ' +
        'FUZZING TESTS - TRUCROWDSALE - TEST CASE 01: Pass #' + pass + ', Test #11\n      ' +
        'TEST DESCRIPTION: TruCrowdSale should not be deployed\n      ' +
        'EXPECTED RESULT: undefined\n      ' +
        'ACTUAL RESULT: ' + saleDeployed);

      // TEST CASE 01: Test #12
      await expectFuzzFail(TruCrowdSale.new(fuzzGenOne, fuzzGenTwo, fuzzGenThree, fuzzGenFour, fuzzGenFive, weiRaised, { from: acctOne }))
      saleDeployed = await expectNotDeployed(TruCrowdSale.deployed());
      assert.isUndefined(saleDeployed,
        '\n      ' +
        'FUZZING TESTS - TRUCROWDSALE - TEST CASE 01: Pass #' + pass + ', Test #12\n      ' +
        'TEST DESCRIPTION: TruCrowdSale should not be deployed\n      ' +
        'EXPECTED RESULT: undefined\n      ' +
        'ACTUAL RESULT: ' + saleDeployed);

      // TEST CASE 01: Test #13
      await expectFuzzFail(TruCrowdSale.new(fuzzGenOne, fuzzGenTwo, fuzzGenThree, fuzzGenFour, fuzzGenFive, fuzzGenSix, { from: acctOne }))
      saleDeployed = await expectNotDeployed(TruCrowdSale.deployed());
      assert.isUndefined(saleDeployed,
        '\n      ' +
        'FUZZING TESTS - TRUCROWDSALE - TEST CASE 01: Pass #' + pass + ', Test #13\n      ' +
        'TEST DESCRIPTION: TruCrowdSale should not be deployed\n      ' +
        'EXPECTED RESULT: undefined\n      ' +
        'ACTUAL RESULT: ' + saleDeployed);

      // TEST CASE 01: Test #14
      await expectFuzzFail(TruCrowdSale.new(fuzzGenOne, fuzzGenTwo, fuzzGenThree, fuzzGenFour, fuzzGenFive, fuzzGenSix, { from: fuzzGenOne }))
      saleDeployed = await expectNotDeployed(TruCrowdSale.deployed());
      assert.isUndefined(saleDeployed,
        '\n      ' +
        'FUZZING TESTS - TRUCROWDSALE - TEST CASE 01: Pass #' + pass + ', Test #14\n      ' +
        'TEST DESCRIPTION: TruCrowdSale should not be deployed\n      ' +
        'EXPECTED RESULT: undefined\n      ' +
        'ACTUAL RESULT: ' + saleDeployed);
    }

    // TEST CASE 01: Post-Fuzz Test #1
    saleDeployed = await expectNotDeployed(TruPreSale.deployed());
    assert.isUndefined(saleDeployed,
      '\n      ' +
      'FUZZING TESTS - TRUCROWDSALE - TEST CASE 01: Post-Fuzz Test #1\n      ' +
      'TEST DESCRIPTION: TruCrowdSale should not be deployed\n      ' +
      'EXPECTED RESULT: undefined\n      ' +
      'ACTUAL RESULT: ' + saleDeployed);
  }).timeout(timeoutDuration);

  it('FUZZING TESTS - TRUCROWDSALE - TEST CASE 02: Fuzz test of TruCrowdSale updateWhiteList with invalid parameters', async function() {
    let fuzzGenOne, fuzzGenTwo, fuzzGenThree, fuzzGenFour, fuzzGenFive, fuzzGenSix;
    currentTime = web3.eth.getBlock('latest').timestamp;
    psStartTime = currentTime + 600;
    psEndTime = psStartTime + 3600;

    // Perform Pre-Sale
    preSale = await TruPreSale.new(psStartTime, psEndTime, truToken.address, execAcct, { from: acctOne });
    await truToken.setReleaseAgent(preSale.address, { from: acctOne });
    await truToken.transferOwnership(preSale.address, { from: acctOne });
    await preSale.updateWhitelist(accountTwo, 1, { from: acctOne });
    let duringPreSale = psStartTime + 60;
    await increaseTimeTo(duringPreSale);
    await preSale.buy({ from: accountTwo, value: web3.toWei(pSaleCap, 'ether') })
    await increaseTimeTo(psEndTime);
    await preSale.finalise({ from: acctOne });

    // Setup Crowdsale
    tokenSupply = await truToken.totalSupply.call();
    weiRaised = await preSale.weiRaised.call();
    currentTime = web3.eth.getBlock('latest').timestamp;
    sStartTime = currentTime + 6000;
    sEndTime = sStartTime + 360000;

    crowdSale = await TruCrowdSale.new(sStartTime, sEndTime, truToken.address, execAcct, tokenSupply, weiRaised, { from: acctOne });
    await truToken.setReleaseAgent(crowdSale.address, { from: acctOne });
    await truToken.transferOwnership(crowdSale.address, { from: acctOne });
    let actThreeWhiteListed, actSixWhiteListed;

    // TEST CASE 02: Pre-Fuzz Test #1a
    await crowdSale.updateWhitelist(accountThree, 1, { from: acctOne });
    actThreeWhiteListed = await crowdSale.purchaserWhiteList(accountThree, { from: acctOne });
    assert.isTrue(actThreeWhiteListed,
      '\n      ' +
      'FUZZING TESTS - TRUCROWDSALE - TEST CASE 02: Pre-Fuzz Test #1a\n      ' +
      'TEST DESCRIPTION: Account Three should be on WhiteList\n      ' +
      'EXPECTED RESULT: true\n      ' +
      'ACTUAL RESULT: ' + actThreeWhiteListed);

    // TEST CASE 02: Pre-Fuzz Test #1b
    actSixWhiteListed = await crowdSale.purchaserWhiteList(accountSix, { from: acctOne });
    assert.isFalse(actSixWhiteListed,
      '\n      ' +
      'FUZZING TESTS - TRUCROWDSALE - TEST CASE 02: Pre-Fuzz Test #1b\n      ' +
      'TEST DESCRIPTION: Account Six should not be on WhiteList\n      ' +
      'EXPECTED RESULT: false\n      ' +
      'ACTUAL RESULT: ' + actSixWhiteListed);

    for (var i = loopStart; i < loopEnd; i++) {
      let pass = i - loopStart + 1;
      fuzzer.seed(i);
      fuzzGenOne = fuzzer.mutate.string(fuzzStrOne);
      fuzzGenTwo = fuzzer.mutate.string(fuzzStrTwo);
      fuzzGenThree = fuzzer.mutate.string(fuzzStrThree);
      fuzzGenFour = fuzzer.mutate.string(fuzzStrFour);
      fuzzGenFive = fuzzer.mutate.string(fuzzStrFive);
      fuzzGenSix = fuzzer.mutate.string(fuzzStrSix);

      // TEST CASE 02: Test #1
      await expectFuzzFail(preSale.updateWhitelist(fuzzGenOne, 1, { from: acctOne }));
      actThreeWhiteListed = await crowdSale.purchaserWhiteList(accountThree, { from: acctOne });
      assert.isTrue(actThreeWhiteListed,
        '\n      ' +
        'FUZZING TESTS - TRUCROWDSALE - TEST CASE 02: Pass #' + pass + ', Test #1a\n      ' +
        'TEST DESCRIPTION: Account Three should be on WhiteList\n      ' +
        'EXPECTED RESULT: true\n      ' +
        'ACTUAL RESULT: ' + actThreeWhiteListed);
      actSixWhiteListed = await crowdSale.purchaserWhiteList(accountSix, { from: acctOne });
      assert.isFalse(actSixWhiteListed,
        '\n      ' +
        'FUZZING TESTS - TRUCROWDSALE - TEST CASE 02: Pass #' + pass + ', Test #1b\n      ' +
        'TEST DESCRIPTION: Account Six should not be on WhiteList\n      ' +
        'EXPECTED RESULT: false\n      ' +
        'ACTUAL RESULT: ' + actSixWhiteListed);

      // TEST CASE 02: Test #2
      await expectFuzzFail(preSale.updateWhitelist(fuzzGenOne, fuzzGenTwo, { from: acctOne }))
      actThreeWhiteListed = await crowdSale.purchaserWhiteList(accountThree, { from: acctOne });
      assert.isTrue(actThreeWhiteListed,
        '\n      ' +
        'FUZZING TESTS - TRUCROWDSALE - TEST CASE 02: Pass #' + pass + ', Test #2a\n      ' +
        'TEST DESCRIPTION: Account Three should be on WhiteList\n      ' +
        'EXPECTED RESULT: true\n      ' +
        'ACTUAL RESULT: ' + actThreeWhiteListed);
      actSixWhiteListed = await crowdSale.purchaserWhiteList(accountSix, { from: acctOne });
      assert.isFalse(actSixWhiteListed,
        '\n      ' +
        'FUZZING TESTS - TRUCROWDSALE - TEST CASE 02: Pass #' + pass + ', Test #2b\n      ' +
        'TEST DESCRIPTION: Account Six should not be on WhiteList\n      ' +
        'EXPECTED RESULT: false\n      ' +
        'ACTUAL RESULT: ' + actSixWhiteListed);

      // TEST CASE 02: Test #3
      await expectFuzzFail(preSale.updateWhitelist(accountSix, 1, { from: fuzzGenOne }))
      actThreeWhiteListed = await crowdSale.purchaserWhiteList(accountThree, { from: acctOne });
      assert.isTrue(actThreeWhiteListed,
        '\n      ' +
        'FUZZING TESTS - TRUCROWDSALE - TEST CASE 02: Pass #' + pass + ', Test #3a\n      ' +
        'TEST DESCRIPTION: Account Three should be on WhiteList\n      ' +
        'EXPECTED RESULT: true\n      ' +
        'ACTUAL RESULT: ' + actThreeWhiteListed);
      actSixWhiteListed = await crowdSale.purchaserWhiteList(accountSix, { from: acctOne });
      assert.isFalse(actSixWhiteListed,
        '\n      ' +
        'FUZZING TESTS - TRUCROWDSALE - TEST CASE 02: Pass #' + pass + ', Test #3b\n      ' +
        'TEST DESCRIPTION: Account Six should not be on WhiteList\n      ' +
        'EXPECTED RESULT: false\n      ' +
        'ACTUAL RESULT: ' + actSixWhiteListed);

      // TEST CASE 02: Test #4
      await expectFuzzFail(preSale.updateWhitelist(fuzzGenOne, fuzzGenTwo, { from: acctOne }));
      actThreeWhiteListed = await crowdSale.purchaserWhiteList(accountThree, { from: acctOne });
      assert.isTrue(actThreeWhiteListed,
        '\n      ' +
        'FUZZING TESTS - TRUCROWDSALE - TEST CASE 02: Pass #' + pass + ', Test #4a\n      ' +
        'TEST DESCRIPTION: Account Three should be on WhiteList\n      ' +
        'EXPECTED RESULT: true\n      ' +
        'ACTUAL RESULT: ' + actThreeWhiteListed);
      actSixWhiteListed = await crowdSale.purchaserWhiteList(accountSix, { from: acctOne });
      assert.isFalse(actSixWhiteListed,
        '\n      ' +
        'FUZZING TESTS - TRUCROWDSALE - TEST CASE 02: Pass #' + pass + ', Test #4b\n      ' +
        'TEST DESCRIPTION: Account Six should not be on WhiteList\n      ' +
        'EXPECTED RESULT: false\n      ' +
        'ACTUAL RESULT: ' + actSixWhiteListed);

      // TEST CASE 02: Test #5
      await expectFuzzFail(preSale.updateWhitelist(fuzzGenOne, fuzzGenOne, { from: fuzzGenTwo }));
      actThreeWhiteListed = await crowdSale.purchaserWhiteList(accountThree, { from: acctOne });
      assert.isTrue(actThreeWhiteListed,
        '\n      ' +
        'FUZZING TESTS - TRUCROWDSALE - TEST CASE 02: Pass #' + pass + ', Test #5a\n      ' +
        'TEST DESCRIPTION: Account Three should be on WhiteList\n      ' +
        'EXPECTED RESULT: true\n      ' +
        'ACTUAL RESULT: ' + actThreeWhiteListed);
      actSixWhiteListed = await crowdSale.purchaserWhiteList(accountSix, { from: acctOne });
      assert.isFalse(actSixWhiteListed,
        '\n      ' +
        'FUZZING TESTS - TRUCROWDSALE - TEST CASE 02: Pass #' + pass + ', Test #5b\n      ' +
        'TEST DESCRIPTION: Account Six should not be on WhiteList\n      ' +
        'EXPECTED RESULT: false\n      ' +
        'ACTUAL RESULT: ' + actSixWhiteListed);

      // TEST CASE 02: Test #6
      await expectFuzzFail(preSale.updateWhitelist(fuzzGenOne, fuzzGenTwo, { from: fuzzGenTwo }));
      actThreeWhiteListed = await crowdSale.purchaserWhiteList(accountThree, { from: acctOne });
      assert.isTrue(actThreeWhiteListed,
        '\n      ' +
        'FUZZING TESTS - TRUCROWDSALE - TEST CASE 02: Pass #' + pass + ', Test #6a\n      ' +
        'TEST DESCRIPTION: Account Three should be on WhiteList\n      ' +
        'EXPECTED RESULT: true\n      ' +
        'ACTUAL RESULT: ' + actThreeWhiteListed);
      actSixWhiteListed = await crowdSale.purchaserWhiteList(accountSix, { from: acctOne });
      assert.isFalse(actSixWhiteListed,
        '\n      ' +
        'FUZZING TESTS - TRUCROWDSALE - TEST CASE 02: Pass #' + pass + ', Test #6b\n      ' +
        'TEST DESCRIPTION: Account Six should not be on WhiteList\n      ' +
        'EXPECTED RESULT: false\n      ' +
        'ACTUAL RESULT: ' + actSixWhiteListed);

      // TEST CASE 02: Test #7
      await expectFuzzFail(preSale.updateWhitelist(0x0, 2, { from: acctOne }));
      actThreeWhiteListed = await crowdSale.purchaserWhiteList(accountThree, { from: acctOne });
      assert.isTrue(actThreeWhiteListed,
        '\n      ' +
        'FUZZING TESTS - TRUCROWDSALE - TEST CASE 02: Pass #' + pass + ', Test #7a\n      ' +
        'TEST DESCRIPTION: Account Three should be on WhiteList\n      ' +
        'EXPECTED RESULT: true\n      ' +
        'ACTUAL RESULT: ' + actThreeWhiteListed);
      actSixWhiteListed = await crowdSale.purchaserWhiteList(accountSix, { from: acctOne });
      assert.isFalse(actSixWhiteListed,
        '\n      ' +
        'FUZZING TESTS - TRUCROWDSALE - TEST CASE 02: Pass #' + pass + ', Test #7b\n      ' +
        'TEST DESCRIPTION: Account Six should not be on WhiteList\n      ' +
        'EXPECTED RESULT: false\n      ' +
        'ACTUAL RESULT: ' + actSixWhiteListed);

      // TEST CASE 02: Test #8
      await expectFuzzFail(preSale.updateWhitelist(accountSix, 3, { from: acctOne }));
      actThreeWhiteListed = await crowdSale.purchaserWhiteList(accountThree, { from: acctOne });
      assert.isTrue(actThreeWhiteListed,
        '\n      ' +
        'FUZZING TESTS - TRUCROWDSALE - TEST CASE 02: Pass #' + pass + ', Test #8a\n      ' +
        'TEST DESCRIPTION: Account Three should be on WhiteList\n      ' +
        'EXPECTED RESULT: true\n      ' +
        'ACTUAL RESULT: ' + actThreeWhiteListed);
      actSixWhiteListed = await crowdSale.purchaserWhiteList(accountSix, { from: acctOne });
      assert.isFalse(actSixWhiteListed,
        '\n      ' +
        'FUZZING TESTS - TRUCROWDSALE - TEST CASE 02: Pass #' + pass + ', Test #8b\n      ' +
        'TEST DESCRIPTION: Account Six should not be on WhiteList\n      ' +
        'EXPECTED RESULT: false\n      ' +
        'ACTUAL RESULT: ' + actSixWhiteListed);
    }

    // TEST CASE 02: Post-Fuzz Test #1a
    actThreeWhiteListed = await crowdSale.purchaserWhiteList(accountThree, { from: acctOne });
    assert.isTrue(actThreeWhiteListed,
      '\n      ' +
      'FUZZING TESTS - TRUCROWDSALE - TEST CASE 02: Post-Fuzz Test #1a\n      ' +
      'TEST DESCRIPTION: Account Six should not be on WhiteList\n      ' +
      'EXPECTED RESULT: true\n      ' +
      'ACTUAL RESULT: ' + actThreeWhiteListed);

    // TEST CASE 02: Post-Fuzz Test #1b
    actSixWhiteListed = await crowdSale.purchaserWhiteList(accountSix, { from: acctOne });
    assert.isFalse(actSixWhiteListed,
      '\n      ' +
      'FUZZING TESTS - TRUCROWDSALE - TEST CASE 02: Post-Fuzz Test #1b\n      ' +
      'TEST DESCRIPTION: Account Six should not be on WhiteList\n      ' +
      'EXPECTED RESULT: false\n      ' +
      'ACTUAL RESULT: ' + actSixWhiteListed);
  }).timeout(timeoutDuration);

  it('FUZZING TESTS - TRUCROWDSALE - TEST CASE 03: Fuzz test of TruCrowdSale buy with invalid parameters', async function() {
    let fuzzGenOne, fuzzGenTwo, weiRaised;
    let duringCrowdSale = sStartTime + 60;
    await increaseTimeTo(duringCrowdSale);

    // TEST CASE 03: Pre-Fuzz Test #1
    weiRaised = await crowdSale.weiRaised.call();
    assert.equal(web3.fromWei(weiRaised, 'ether'),
      0,
      '\n      ' +
      'FUZZING TESTS - TRUCROWDSALE - TEST CASE 03: Pre-Fuzz Test #1\n      ' +
      'TEST DESCRIPTION: Raised on CrowdSale should be 0 Ether\n      ' +
      'EXPECTED RESULT: 0\n      ' +
      'ACTUAL RESULT: ' + web3.fromWei(weiRaised, 'ether') + ' ETH');

    // Should fail to buy to buy Tru in CrowdSale with invalid parameters
    for (var i = loopStart; i < loopEnd; i++) {
      let pass = i - loopStart + 1;
      fuzzer.seed(i);
      fuzzGenOne = fuzzer.mutate.string(fuzzStrOne);
      fuzzGenTwo = fuzzer.mutate.string(fuzzStrTwo);

      // TEST CASE 03: Test #1
      await expectFuzzFail(crowdSale.buy({ from: acctOne, value: fuzzGenOne }))
      weiRaised = await crowdSale.weiRaised.call();
      assert.equal(web3.fromWei(weiRaised, 'ether'),
        0,
        '\n      ' +
        'FUZZING TESTS - TRUCROWDSALE - TEST CASE 03: Pass #' + pass + ', Test #1\n      ' +
        'TEST DESCRIPTION: Raised on CrowdSale should be 0 Ether\n      ' +
        'EXPECTED RESULT: 0\n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(weiRaised, 'ether') + ' ETH');

      // TEST CASE 03: Test #2
      await expectFuzzFail(crowdSale.buy({ from: fuzzGenOne, value: web3.toWei(1, 'ether') }));
      weiRaised = await crowdSale.weiRaised.call();
      assert.equal(web3.fromWei(weiRaised, 'ether'),
        0,
        '\n      ' +
        'FUZZING TESTS - TRUCROWDSALE - TEST CASE 03: Pass #' + pass + ', Test #2\n      ' +
        'TEST DESCRIPTION: Raised on CrowdSale should be 0 Ether\n      ' +
        'EXPECTED RESULT: 0\n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(weiRaised, 'ether') + ' ETH');

      // TEST CASE 03: Test #3
      await expectFuzzFail(crowdSale.buy({ from: fuzzGenOne, value: fuzzGenTwo }));
      weiRaised = await crowdSale.weiRaised.call();
      assert.equal(web3.fromWei(weiRaised, 'ether'),
        0,
        '\n      ' +
        'FUZZING TESTS - TRUCROWDSALE - TEST CASE 03: Pass #' + pass + ', Test #3\n      ' +
        'TEST DESCRIPTION: Raised on CrowdSale should be 0 Ether\n      ' +
        'EXPECTED RESULT: 0\n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(weiRaised, 'ether') + ' ETH');
    }

    // TEST CASE 03: Post-Fuzz Test #1
    weiRaised = await crowdSale.weiRaised.call();
    assert.equal(web3.fromWei(weiRaised, 'ether'),
      0,
      '\n      ' +
      'FUZZING TESTS - TRUCROWDSALE - TEST CASE 03: Post-Fuzz Test #1\n      ' +
      'TEST DESCRIPTION: Raised on CrowdSale should be 0 Ether\n      ' +
      'EXPECTED RESULT: 0\n      ' +
      'ACTUAL RESULT: ' + web3.fromWei(weiRaised, 'ether') + ' ETH');
  }).timeout(timeoutDuration);

  it('FUZZING TESTS - TRUCROWDSALE - TEST CASE 04: Fuzz test of TruCrowdSale finalise with invalid parameters', async function() {
    let fuzzGenOne, fuzzGenTwo;

    // TEST CASE 04: Pre-Fuzz Test #1
    let saleStatus = await crowdSale.hasEnded.call();
    assert.isFalse(saleStatus,
      '\n      ' +
      'FUZZING TESTS - TRUCROWDSALE - TEST CASE 04: Pre-Fuzz Test #1\n      ' +
      'TEST DESCRIPTION: CrowdSale should not have ended\n      ' +
      'EXPECTED RESULT: false\n      ' +
      'ACTUAL RESULT: ' + saleStatus);

    for (var i = loopStart; i < loopEnd; i++) {
      let pass = i - loopStart + 1;
      fuzzer.seed(i);
      fuzzGenOne = fuzzer.mutate.string(fuzzStrOne);
      fuzzGenTwo = fuzzer.mutate.string(fuzzStrTwo);

      // TEST CASE 04: Test #1
      await expectFuzzFail(crowdSale.finalise({ from: fuzzGenOne }));
      saleStatus = await crowdSale.hasEnded.call();
      assert.isFalse(saleStatus,
        '\n      ' +
        'FUZZING TESTS - TRUCROWDSALE - TEST CASE 04: Pass #' + pass + ', Test #1\n      ' +
        'TEST DESCRIPTION: CrowdSale should not have ended\n      ' +
        'EXPECTED RESULT: false\n      ' +
        'ACTUAL RESULT: ' + saleStatus);

      // TEST CASE 04: Test #2
      await expectFuzzFail(crowdSale.finalise({ from: fuzzGenOne, value: fuzzGenTwo }));
      saleStatus = await crowdSale.hasEnded.call();
      assert.isFalse(saleStatus,
        '\n      ' +
        'FUZZING TESTS - TRUCROWDSALE - TEST CASE 04: Pass #' + pass + ', Test #2\n      ' +
        'TEST DESCRIPTION: CrowdSale should not have ended\n      ' +
        'EXPECTED RESULT: false\n      ' +
        'ACTUAL RESULT: ' + saleStatus);
    }

    // TEST CASE 04: Post-Fuzz Test #1
    saleStatus = await crowdSale.hasEnded.call();
    assert.isFalse(saleStatus,
      '\n      ' +
      'FUZZING TESTS - TRUCROWDSALE - TEST CASE 04: Post-Fuzz Test #1\n      ' +
      'TEST DESCRIPTION: CrowdSale should not have ended\n      ' +
      'EXPECTED RESULT: false\n      ' +
      'ACTUAL RESULT: ' + saleStatus);
  }).timeout(timeoutDuration);

  it('FUZZING TESTS - TRUCROWDSALE - TEST CASE 05: Fuzz test of TruCrowdSale halt with invalid parameters', async function() {
    let fuzzGenOne, fuzzGenTwo;

    // TEST CASE 05: Pre-Fuzz Test #1
    let saleHaltStatus = await crowdSale.halted.call();
    assert.isFalse(saleHaltStatus,
      '\n      ' +
      'FUZZING TESTS - TRUCROWDSALE - TEST CASE 05: Pre-Fuzz Test #1\n      ' +
      'TEST DESCRIPTION: CrowdSale should not be halted\n      ' +
      'EXPECTED RESULT: false\n      ' +
      'ACTUAL RESULT: ' + saleHaltStatus);

    // Fuzzing
    for (var i = loopStart; i < loopEnd; i++) {
      let pass = i - loopStart + 1;
      fuzzer.seed(i);
      fuzzGenOne = fuzzer.mutate.string(fuzzStrOne);
      fuzzGenTwo = fuzzer.mutate.string(fuzzStrTwo);

      // TEST CASE 05: Test #1
      await expectFuzzFail(crowdSale.halt({ from: fuzzGenOne }));
      saleHaltStatus = await crowdSale.halted.call();
      assert.isFalse(saleHaltStatus,
        '\n      ' +
        'FUZZING TESTS - TRUCROWDSALE - TEST CASE 05: Pass #' + pass + ', Test #1\n      ' +
        'TEST DESCRIPTION: CrowdSale should not be halted\n      ' +
        'EXPECTED RESULT: false\n      ' +
        'ACTUAL RESULT: ' + saleHaltStatus);

      // TEST CASE 05: Test #2
      await expectFuzzFail(crowdSale.halt({ from: fuzzGenOne, to: fuzzGenTwo }));
      saleHaltStatus = await crowdSale.halted.call();
      assert.isFalse(saleHaltStatus,
        '\n      ' +
        'FUZZING TESTS - TRUCROWDSALE - TEST CASE 05: Pass #' + pass + ', Test #2\n      ' +
        'TEST DESCRIPTION: CrowdSale should not be halted\n      ' +
        'EXPECTED RESULT: false\n      ' +
        'ACTUAL RESULT: ' + saleHaltStatus);

      // TEST CASE 05: Test #3
      await expectFuzzFail(crowdSale.halt({ from: fuzzGenOne, value: fuzzGenTwo }));
      saleHaltStatus = await crowdSale.halted.call();
      assert.isFalse(saleHaltStatus,
        '\n      ' +
        'FUZZING TESTS - TRUCROWDSALE - TEST CASE 05: Pass #' + pass + ', Test #3\n      ' +
        'TEST DESCRIPTION: CrowdSale should not be halted\n      ' +
        'EXPECTED RESULT: false\n      ' +
        'ACTUAL RESULT: ' + saleHaltStatus);
    }

    // TEST CASE 05: Post-Fuzz Test #1
    saleHaltStatus = await crowdSale.halted.call();
    assert.isFalse(saleHaltStatus,
      '\n      ' +
      'FUZZING TESTS - TRUCROWDSALE - TEST CASE 05: Post-Fuzz Test #1\n      ' +
      'TEST DESCRIPTION: CrowdSale should not be halted\n      ' +
      'EXPECTED RESULT: false\n      ' +
      'ACTUAL RESULT: ' + saleHaltStatus);
  }).timeout(timeoutDuration);

  it('FUZZING TESTS - TRUCROWDSALE - TEST CASE 06: Fuzz test of TruCrowdSale hasEnded with invalid parameters', async function() {
    let fuzzGenOne, fuzzGenTwo;

    // TEST CASE 06: Pre-Fuzz Test #1
    let hasEnded = await crowdSale.hasEnded.call();
    assert.isFalse(hasEnded,
      '\n      ' +
      'FUZZING TESTS - TRUCROWDSALE - TEST CASE 06: Pre-Fuzz Test #1\n      ' +
      'TEST DESCRIPTION: CrowdSale should not have ended\n      ' +
      'EXPECTED RESULT: false\n      ' +
      'ACTUAL RESULT: ' + hasEnded);

    // Fuzzing
    for (var i = loopStart; i < loopEnd; i++) {
      let pass = i - loopStart + 1;
      fuzzer.seed(i);
      fuzzGenOne = fuzzer.mutate.string(fuzzStrOne);
      fuzzGenTwo = fuzzer.mutate.string(fuzzStrTwo);

      // TEST CASE 06: Test #1
      await expectFuzzFail(crowdSale.hasEnded.call({ from: fuzzGenOne }));
      hasEnded = await crowdSale.hasEnded.call();
      assert.isFalse(hasEnded,
        '\n      ' +
        'FUZZING TESTS - TRUCROWDSALE - TEST CASE 06: Pass #' + pass + ', Test #1\n      ' +
        'TEST DESCRIPTION: CrowdSale should not have ended\n      ' +
        'EXPECTED RESULT: false\n      ' +
        'ACTUAL RESULT: ' + hasEnded);

      // TEST CASE 06: Test #2
      await expectFuzzFail(crowdSale.hasEnded.call({ from: fuzzGenOne, value: fuzzGenTwo }))
      hasEnded = await crowdSale.hasEnded.call();
      assert.isFalse(hasEnded,
        '\n      ' +
        'FUZZING TESTS - TRUCROWDSALE - TEST CASE 06: Pass #' + pass + ', Test #2\n      ' +
        'TEST DESCRIPTION: CrowdSale should not have ended\n      ' +
        'EXPECTED RESULT: false\n      ' +
        'ACTUAL RESULT: ' + hasEnded);

      // TEST CASE 06: Test #3
      await expectFuzzFail(crowdSale.hasEnded.call({ from: fuzzGenOne, to: fuzzGenTwo }))
      hasEnded = await crowdSale.hasEnded.call();
      assert.isFalse(hasEnded,
        '\n      ' +
        'FUZZING TESTS - TRUCROWDSALE - TEST CASE 06: Pass #' + pass + ', Test #3\n      ' +
        'TEST DESCRIPTION: CrowdSale should not have ended\n      ' +
        'EXPECTED RESULT: false\n      ' +
        'ACTUAL RESULT: ' + hasEnded);
    }

    // TEST CASE 06: Post-Fuzz Test #1
    hasEnded = await crowdSale.hasEnded.call();
    assert.isFalse(hasEnded,
      '\n      ' +
      'FUZZING TESTS - TRUCROWDSALE - TEST CASE 06: Post-Fuzz Test #1\n      ' +
      'TEST DESCRIPTION: CrowdSale should not have ended\n      ' +
      'EXPECTED RESULT: false\n      ' +
      'ACTUAL RESULT: ' + hasEnded);
  }).timeout(timeoutDuration);

  it('FUZZING TESTS - TRUCROWDSALE - TEST CASE 07: Fuzz test of TruCrowdSale send with invalid parameters', async function() {
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
      await expectFuzzFail(crowdSale.send({ from: fuzzGenOne }));

      // TEST CASE 07: Test #2
      await expectFuzzFail(crowdSale.send({ to: fuzzGenTwo }));

      // TEST CASE 07: Test #3
      await expectFuzzFail(crowdSale.send({ from: fuzzGenOne, value: fuzzGenThree }));

      // TEST CASE 07: Test #4
      await expectFuzzFail(crowdSale.send({ from: fuzzGenOne, data: fuzzGenFour }));

      // TEST CASE 07: Test #5
      await expectFuzzFail(crowdSale.send({ from: fuzzGenOne, gasPrice: fuzzGenFive }));

      // TEST CASE 07: Test #6
      await expectFuzzFail(crowdSale.send({ from: fuzzGenOne, nonce: fuzzGenSix }));

      // TEST CASE 07: Test #7
      await expectFuzzFail(crowdSale.send({ from: fuzzGenOne, value: fuzzGenThree }));

      // TEST CASE 07: Test #8
      await expectFuzzFail(crowdSale.send({ from: fuzzGenOne, to: fuzzGenTwo, value: fuzzGenThree }));

      // TEST CASE 07: Test #9
      await expectFuzzFail(crowdSale.send({ from: fuzzGenOne, to: fuzzGenTwo, value: fuzzGenThree, data: fuzzGenFour, gasPrice: fuzzGenFive, nonce: fuzzGenSix }));
    }

  }).timeout(timeoutDuration);

  it('FUZZING TESTS - TRUCROWDSALE - TEST CASE 08: Fuzz test of TruCrowdSale sendTransaction with invalid parameters', async function() {
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
      await expectFuzzFail(crowdSale.sendTransaction({ from: fuzzGenOne }));

      // TEST CASE 08: Test #2
      await expectFuzzFail(crowdSale.sendTransaction({ to: fuzzGenTwo }));

      // TEST CASE 08: Test #3
      await expectFuzzFail(crowdSale.sendTransaction({ from: fuzzGenOne, value: fuzzGenThree }));

      // TEST CASE 08: Test #4
      await expectFuzzFail(crowdSale.sendTransaction({ from: fuzzGenOne, data: fuzzGenFour }));

      // TEST CASE 08: Test #5
      await expectFuzzFail(crowdSale.sendTransaction({ from: fuzzGenOne, gasPrice: fuzzGenFive }));

      // TEST CASE 08: Test #6
      await expectFuzzFail(crowdSale.sendTransaction({ from: fuzzGenOne, nonce: fuzzGenSix }));

      // TEST CASE 08: Test #7
      await expectFuzzFail(crowdSale.sendTransaction({ from: fuzzGenOne, value: fuzzGenThree }));

      // TEST CASE 08: Test #8
      await expectFuzzFail(crowdSale.sendTransaction({ from: fuzzGenOne, to: fuzzGenTwo, value: fuzzGenThree }));

      // TEST CASE 08: Test #9
      await expectFuzzFail(crowdSale.sendTransaction({ from: fuzzGenOne, to: fuzzGenTwo, value: fuzzGenThree, data: fuzzGenFour, gasPrice: fuzzGenFive, nonce: fuzzGenSix }));
    }
  }).timeout(timeoutDuration);

  it('FUZZING TESTS - TRUCROWDSALE - TEST CASE 09: Fuzz test of TruCrowdSale transferOwnership with invalid parameters', async function() {
    let fuzzGenOne, fuzzGenTwo;

    // TEST CASE 09: Pre-Fuzz Test #1
    let owner = await crowdSale.owner.call();
    assert.equal(owner,
      acctOne,
      '\n      ' +
      'FUZZING TESTS - TRUCROWDSALE - TEST CASE 09: Pre-Fuzz Test #1\n      ' +
      'TEST DESCRIPTION: CrowdSale should be owned by Account One\n      ' +
      'EXPECTED RESULT: ' + acctOne + '\n      ' +
      'ACTUAL RESULT: ' + owner);

    // Fuzzing
    for (var i = loopStart; i < loopEnd; i++) {
      let pass = i - loopStart + 1;
      fuzzer.seed(i);
      fuzzGenOne = fuzzer.mutate.string(fuzzStrOne);
      fuzzGenTwo = fuzzer.mutate.string(fuzzStrTwo);

      // TEST CASE 09: Test #1
      await expectFuzzFail(crowdSale.transferOwnership(fuzzGenOne, { from: acctOne }));
      owner = await crowdSale.owner.call();
      assert.equal(owner,
        acctOne,
        '\n      ' +
        'FUZZING TESTS - TRUCROWDSALE - TEST CASE 09: Pass #' + pass + ', Test #1\n      ' +
        'TEST DESCRIPTION: CrowdSale should be owned by Account One\n      ' +
        'EXPECTED RESULT: ' + acctOne + '\n      ' +
        'ACTUAL RESULT: ' + owner);

      // TEST CASE 09: Test #2
      await expectFuzzFail(crowdSale.transferOwnership(accountTwo, { from: fuzzGenTwo }));
      owner = await crowdSale.owner.call();
      assert.equal(owner,
        acctOne,
        '\n      ' +
        'FUZZING TESTS - TRUCROWDSALE - TEST CASE 09: Pass #' + pass + ', Test #2\n      ' +
        'TEST DESCRIPTION: CrowdSale should be owned by Account One\n      ' +
        'EXPECTED RESULT: ' + acctOne + '\n      ' +
        'ACTUAL RESULT: ' + owner);

      // TEST CASE 09: Test #3
      await expectFuzzFail(crowdSale.transferOwnership(fuzzGenOne, { from: fuzzGenTwo }));
      owner = await crowdSale.owner.call();
      assert.equal(owner,
        acctOne,
        '\n      ' +
        'FUZZING TESTS - TRUCROWDSALE - TEST CASE 09: Pass #' + pass + ', Test #3\n      ' +
        'TEST DESCRIPTION: CrowdSale should be owned by Account One\n      ' +
        'EXPECTED RESULT: ' + acctOne + '\n      ' +
        'ACTUAL RESULT: ' + owner);
    }

    // TEST CASE 09: Post-Fuzz Test #1
    owner = await crowdSale.owner.call();
    assert.equal(owner,
      acctOne,
      '\n      ' +
      'FUZZING TESTS - TRUCROWDSALE - TEST CASE 09: Post-Fuzz Test #1\n      ' +
      'TEST DESCRIPTION: CrowdSale should be owned by Account One\n      ' +
      'EXPECTED RESULT: ' + acctOne + '\n      ' +
      'ACTUAL RESULT: ' + owner);
  }).timeout(timeoutDuration);

  it('FUZZING TESTS - TRUCROWDSALE - TEST CASE 10: Fuzz test of TruCrowdSale unhalt with invalid parameters', async function() {
    let fuzzGenOne, fuzzGenTwo;

    await crowdSale.halt({ from: acctOne });

    // TEST CASE 10: Pre-Fuzz Test #1
    let saleHaltStatus = await crowdSale.halted.call();
    assert.isTrue(saleHaltStatus,
      '\n      ' +
      'FUZZING TESTS - TRUCROWDSALE - TEST CASE 10: Pre-Fuzz Test #1\n      ' +
      'TEST DESCRIPTION: CrowdSale should be halted\n      ' +
      'EXPECTED RESULT: true\n      ' +
      'ACTUAL RESULT: ' + saleHaltStatus);

    // Fuzzing
    for (var i = loopStart; i < loopEnd; i++) {
      let pass = i - loopStart + 1;
      fuzzer.seed(i);
      fuzzGenOne = fuzzer.mutate.string(fuzzStrOne);
      fuzzGenTwo = fuzzer.mutate.string(fuzzStrTwo);

      // TEST CASE 10: Test #1
      await expectFuzzFail(crowdSale.unhalt({ from: fuzzGenOne }));
      saleHaltStatus = await crowdSale.halted.call();
      assert.isTrue(saleHaltStatus,
        '\n      ' +
        'FUZZING TESTS - TRUCROWDSALE - TEST CASE 10: Pass #' + pass + ', Test #1\n      ' +
        'TEST DESCRIPTION: CrowdSale should be halted\n      ' +
        'EXPECTED RESULT: true\n      ' +
        'ACTUAL RESULT: ' + saleHaltStatus);

      // TEST CASE 10: Test #2
      await expectFuzzFail(crowdSale.unhalt({ from: fuzzGenOne, to: fuzzGenTwo }));
      saleHaltStatus = await crowdSale.halted.call();
      assert.isTrue(saleHaltStatus,
        '\n      ' +
        'FUZZING TESTS - TRUCROWDSALE - TEST CASE 10:Pass #' + pass + ', Test #2\n      ' +
        'TEST DESCRIPTION: CrowdSale should be halted\n      ' +
        'EXPECTED RESULT: true\n      ' +
        'ACTUAL RESULT: ' + saleHaltStatus);

      // TEST CASE 10: Test #3
      await expectFuzzFail(crowdSale.unhalt({ from: fuzzGenOne, value: fuzzGenTwo }));
      saleHaltStatus = await crowdSale.halted.call();
      assert.isTrue(saleHaltStatus,
        '\n      ' +
        'FUZZING TESTS - TRUCROWDSALE - TEST CASE 10: Pass #' + pass + ', Test #3\n      ' +
        'TEST DESCRIPTION: CrowdSale should be halted\n      ' +
        'EXPECTED RESULT: true\n      ' +
        'ACTUAL RESULT: ' + saleHaltStatus);
    }

    // TEST CASE 10: Post-Fuzz Test #1
    saleHaltStatus = await crowdSale.halted.call();
    assert.isTrue(saleHaltStatus,
      '\n      ' +
      'FUZZING TESTS - TRUCROWDSALE - TEST CASE 10: Post-Fuzz Test #1\n      ' +
      'TEST DESCRIPTION: CrowdSale should be halted\n      ' +
      'EXPECTED RESULT: true\n      ' +
      'ACTUAL RESULT: ' + saleHaltStatus);

    // TEST CASE 10: Post-Fuzz Test #2
    await crowdSale.unhalt({ from: acctOne });
    saleHaltStatus = await crowdSale.halted.call();
    assert.isFalse(saleHaltStatus,
      '\n      ' +
      'FUZZING TESTS - TRUCROWDSALE - TEST CASE 10: Post-Fuzz Test #2\n      ' +
      'TEST DESCRIPTION: CrowdSale should not be halted\n      ' +
      'EXPECTED RESULT: false\n      ' +
      'ACTUAL RESULT: ' + saleHaltStatus);
  }).timeout(timeoutDuration);

  it('FUZZING TESTS - TRUCROWDSALE - TEST CASE 11: Fuzz test of TruCrowdSale purchasedAmount with invalid parameters', async function() {
    let fuzzGenOne, fuzzGenTwo;

    // TEST CASE 11: Pre-Fuzz Test #1
    let purchasedAmount = await crowdSale.purchasedAmount(acctOne, { from: acctOne });
    assert.equal(web3.fromWei(purchasedAmount, 'ether').toFormat(0),
      0,
      '\n      ' +
      'FUZZING TESTS - TRUCROWDSALE - TEST CASE 11: Pre-Fuzz Test #1\n      ' +
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
      await expectFuzzFail(crowdSale.purchasedAmount(fuzzGenOne, { from: acctOne }));
      purchasedAmount = await crowdSale.purchasedAmount(acctOne, { from: acctOne });
      assert.equal(web3.fromWei(purchasedAmount, 'ether').toFormat(0),
        0,
        '\n      ' +
        'FUZZING TESTS - TRUCROWDSALE - TEST CASE 11: Pass #' + pass + ', Test #1\n      ' +
        'TEST DESCRIPTION: Account One should have zero purchased TRU\n      ' +
        'EXPECTED RESULT: 0 TRU\n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(purchasedAmount, 'ether').toFormat(0));

      // TEST CASE 11: Test #2
      await expectFuzzFail(crowdSale.purchasedAmount(fuzzGenOne, { from: fuzzGenTwo }));
      purchasedAmount = await crowdSale.purchasedAmount(acctOne, { from: acctOne });
      assert.equal(web3.fromWei(purchasedAmount, 'ether').toFormat(0),
        0,
        '\n      ' +
        'FUZZING TESTS - TRUCROWDSALE - TEST CASE 11: Pass #' + pass + ', Test #2\n      ' +
        'TEST DESCRIPTION: Account One should have zero purchased TRU\n      ' +
        'EXPECTED RESULT: 0 TRU\n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(purchasedAmount, 'ether').toFormat(0));
    }

    // TEST CASE 11: Post-Fuzz Test #1
    purchasedAmount = await crowdSale.purchasedAmount(acctOne, { from: acctOne });
    assert.equal(web3.fromWei(purchasedAmount, 'ether').toFormat(0),
      0,
      '\n      ' +
      'FUZZING TESTS - TRUCROWDSALE - TEST CASE 11: Post-Fuzz Test #1\n      ' +
      'TEST DESCRIPTION: Account One should have zero purchased TRU\n      ' +
      'EXPECTED RESULT: 0 TRU\n      ' +
      'ACTUAL RESULT: ' + web3.fromWei(purchasedAmount, 'ether').toFormat(0));
  }).timeout(timeoutDuration);

  it('FUZZING TESTS - TRUCROWDSALE - TEST CASE 12: Fuzz test of TruCrowdSale purchaserWhiteList with invalid parameters', async function() {
    let fuzzGenOne, fuzzGenTwo;

    // TEST CASE 12: Pre-Fuzz Test #1
    let onWhiteList = await crowdSale.purchaserWhiteList(acctOne, { from: acctOne });
    assert.isFalse(onWhiteList,
      '\n      ' +
      'FUZZING TESTS - TRUCROWDSALE - TEST CASE 12: Pre-Fuzz Test #1\n      ' +
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
      await expectFuzzFail(crowdSale.purchaserWhiteList(fuzzGenOne, { from: acctOne }));
      onWhiteList = await crowdSale.purchaserWhiteList(acctOne, { from: acctOne });
      assert.isFalse(onWhiteList,
        '\n      ' +
        'FUZZING TESTS - TRUCROWDSALE - TEST CASE 12: Pass #' + pass + ', Test #1\n      ' +
        'TEST DESCRIPTION: Account One should not be on WhiteList\n      ' +
        'EXPECTED RESULT: false\n      ' +
        'ACTUAL RESULT: ' + onWhiteList);

      // TEST CASE 12: Test #2
      await expectFuzzFail(crowdSale.purchaserWhiteList(fuzzGenOne, { from: fuzzGenTwo }));
      onWhiteList = await crowdSale.purchaserWhiteList(acctOne, { from: acctOne });
      assert.isFalse(onWhiteList,
        '\n      ' +
        'FUZZING TESTS - TRUCROWDSALE - TEST CASE 12: Pass #' + pass + ', Test #2\n      ' +
        'TEST DESCRIPTION: Account One should not be on WhiteList\n      ' +
        'EXPECTED RESULT: false\n      ' +
        'ACTUAL RESULT: ' + onWhiteList);
    }

    // TEST CASE 12: Post-Fuzz Test #1
    onWhiteList = await crowdSale.purchaserWhiteList(acctOne, { from: acctOne });
    assert.isFalse(onWhiteList,
      '\n      ' +
      'FUZZING TESTS - TRUCROWDSALE - TEST CASE 12: Post-Fuzz Test #1\n      ' +
      'TEST DESCRIPTION: Account One should not be on WhiteList\n      ' +
      'EXPECTED RESULT: false\n      ' +
      'ACTUAL RESULT: ' + onWhiteList);
  }).timeout(timeoutDuration);

  it('FUZZING TESTS - TRUCROWDSALE - TEST CASE 13: Fuzz test of TruCrowdSale tokenAmount with invalid parameters', async function() {
    let fuzzGenOne, fuzzGenTwo;

    // TEST CASE 13: Pre-Fuzz Test #1
    let tokenAmount = await crowdSale.tokenAmount(acctOne, { from: acctOne });
    assert.equal(web3.fromWei(tokenAmount, 'ether').toFormat(0),
      0,
      '\n      ' +
      'FUZZING TESTS - TRUCROWDSALE - TEST CASE 13: Pre-Fuzz Test #1\n      ' +
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
      await expectFuzzFail(crowdSale.tokenAmount(fuzzGenOne, { from: acctOne }));
      tokenAmount = await crowdSale.tokenAmount(acctOne, { from: acctOne });
      assert.equal(web3.fromWei(tokenAmount, 'ether').toFormat(0),
        0,
        '\n      ' +
        'FUZZING TESTS - TRUCROWDSALE - TEST CASE 13: Pass #' + pass + ', Test #1\n      ' +
        'TEST DESCRIPTION: Account One should have zero TRU balance\n      ' +
        'EXPECTED RESULT: 0 TRU\n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(tokenAmount, 'ether').toFormat(0));

      // TEST CASE 13: Test #2
      await expectFuzzFail(crowdSale.tokenAmount(fuzzGenOne, { from: fuzzGenTwo }));
      tokenAmount = await crowdSale.tokenAmount(acctOne, { from: acctOne });
      assert.equal(web3.fromWei(tokenAmount, 'ether').toFormat(0),
        0,
        '\n      ' +
        'FUZZING TESTS - TRUCROWDSALE - TEST CASE 13: Pass #' + pass + ', Test #2\n      ' +
        'TEST DESCRIPTION: Account One should have zero TRU balance\n      ' +
        'EXPECTED RESULT: 0 TRU\n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(tokenAmount, 'ether').toFormat(0));
    }

    // TEST CASE 13: Post-Fuzz Test #1
    tokenAmount = await crowdSale.tokenAmount(acctOne, { from: acctOne });
    assert.equal(web3.fromWei(tokenAmount, 'ether').toFormat(0),
      0,
      '\n      ' +
      'FUZZING TESTS - TRUCROWDSALE - TEST CASE 13: Post-Fuzz Test #1\n      ' +
      'TEST DESCRIPTION: Account One should have zero TRU balance\n      ' +
      'EXPECTED RESULT: 0 TRU\n      ' +
      'ACTUAL RESULT: ' + web3.fromWei(tokenAmount, 'ether').toFormat(0));
  }).timeout(timeoutDuration);
});