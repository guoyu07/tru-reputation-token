/**
 * @file        The following Tests are written for fuzz testing the TruReputationToken Smart Contract as part of 
 * good security and development practice to detect unhandled exceptions, bugs and security holes in any or all 
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
const MockMigrationTarget = artifacts.require('./MockMigrationTarget.sol');
import { increaseTime, increaseTimeTo, duration } from './helpers/increaseTime';
import expectFuzzFail from './helpers/expectFuzzFail';
import expectNotDeployed from './helpers/expectNotDeployed';
import isEven from './helpers/isEven';

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

var fuzzer = require("fuzzer");
let fuzzStrOne = '0xPerfectlyWastedStringOnePerfectlyWastedStringOnePerfectlyWastedStringOnePerfectlyWastedStringOne';
let fuzzStrTwo = "0xFuzzyStringThatShouldAlwaysFailTwoFuzzyStringThatShouldAlwaysFailTwoFuzzyStringThatShouldAlwaysFailTwo";
let fuzzStrThree = "0xANonsenseStringForFuzzingThreeANonsenseStringForFuzzingThreeANonsenseStringForFuzzingThree";
let hundredTru = web3.toWei(100, 'ether');
let maximumTru = web3.toWei(300000000, 'ether');
let timeoutDuration = 0;
let fuzzLoops = parseInt(process.env.FUZZLOOPS || '1000');
let loopStart = 1000;
let loopEnd = loopStart + fuzzLoops;

contract('TruReputationToken', function(accounts) {
  var truToken;
  let acctOne = accounts[0];
  let acctTwo = accounts[1];
  let execAccount = accounts[2];
  var tempToken;
  var upgradeToken;
  let tenTru = web3.toWei(10, 'ether');
  let oneTru = web3.toWei(1, 'ether');
  fuzzer.seed(0);

  it('FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 01: Fuzz test of TruReputationToken Constructor with invalid executor address', async function() {
    let tokenDeployed, fuzzGen;
    let oTokenDeployed = await TruReputationToken.deployed();

    for (var i = loopStart; i < loopEnd; i++) {
      fuzzer.seed(i);
      let pass = i - loopStart + 1;
      fuzzGen = fuzzer.mutate.string(fuzzStrOne);

      // TEST CASE 01 - Test #1
      await expectFuzzFail(TruReputationToken.new({ from: fuzzGen }));
      await expectFuzzFail(TruReputationToken.new(fuzzGen, { from: fuzzGen }));
      tokenDeployed = await TruReputationToken.deployed();
      assert.equal(tokenDeployed.contract.address,
        oTokenDeployed.contract.address,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 01: Pass #' + pass + ', Test #1\n      ' +
        'TEST DESCRIPTION: TruReputationToken should not be deployed\n      ' +
        'EXPECTED RESULT: ' + oTokenDeployed.contract.address + '\n      ' +
        'ACTUAL RESULT: ' + tokenDeployed.contract.address);
    }

    // TEST CASE 01 - Post-Fuzz Test #1
    tokenDeployed = await TruReputationToken.deployed();
    assert.equal(tokenDeployed.contract.address,
      oTokenDeployed.contract.address,
      '\n      ' +
      'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 01: Post-Fuzz Test #1\n      ' +
      'TEST DESCRIPTION: TruReputationToken should not be deployed\n      ' +
      'EXPECTED RESULT: ' + oTokenDeployed.contract.address + '\n      ' +
      'ACTUAL RESULT: ' + tokenDeployed.contract.address);
  }).timeout(timeoutDuration);

  it('FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 02: Fuzz test of TruReputationToken changeBoardAddress with invalid arguments', async function() {
    var fuzzGen;

    truToken = await TruReputationToken.new({ from: acctOne });
    // TEST CASE 02 - Pre-Fuzz Test #1
    let tokenSymbol = await truToken.symbol.call();
    assert.equal(tokenSymbol,
      'TRU',
      '\n      ' +
      'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 02: Pre-Fuzz Test #1\n      ' +
      'TEST DESCRIPTION: Token Symbol should be TRU. \n      ' +
      'EXPECTED RESULT: TRU \n      ' +
      'ACTUAL RESULT: ' + tokenSymbol);
    let boardAddress = await truToken.execBoard.call();

    // TEST CASE 02 - Pre-Fuzz Test #2
    assert.equal(boardAddress,
      acctOne,
      '\n      ' +
      'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 02: Pre-Fuzz Test #2\n      ' +
      'TEST DESCRIPTION: Incorrect Board Address \n      ' +
      'EXPECTED RESULT: ' + acctOne + '\n      ' +
      'ACTUAL RESULT: ' + boardAddress);

    for (var i = loopStart; i < loopEnd; i++) {
      fuzzer.seed(i);
      fuzzGen = fuzzer.mutate.string(fuzzStrOne);
      let pass = i - loopStart + 1;

      // TEST CASE 02 - Test #1
      await expectFuzzFail(truToken.changeBoardAddress(acctTwo, { from: fuzzGen }));
      boardAddress = await truToken.execBoard.call();
      assert.equal(boardAddress,
        acctOne,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 02: Pass #' + pass + ', Test #1. \n      ' +
        'TEST DESCRIPTION: Incorrect Board Address \n      ' +
        'EXPECTED RESULT: ' + acctOne + '\n      ' +
        'ACTUAL RESULT: ' + boardAddress);

      // TEST CASE 02 - Test #2
      await expectFuzzFail(truToken.changeBoardAddress(fuzzGen, { from: acctOne }));
      boardAddress = await truToken.execBoard.call();
      assert.equal(boardAddress,
        acctOne,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 02: Pass #' + pass + ', Test #2. \n      ' +
        'TEST DESCRIPTION: Incorrect Board Address \n      ' +
        'EXPECTED RESULT: ' + acctOne + '\n      ' +
        'ACTUAL RESULT: ' + boardAddress);

      // TEST CASE 02 - Test #3
      await expectFuzzFail(truToken.changeBoardAddress(fuzzGen, { from: fuzzGen }));
      boardAddress = await truToken.execBoard.call();
      assert.equal(boardAddress,
        acctOne,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 02: Pass #' + pass + ', Test #3. \n      ' +
        'TEST DESCRIPTION: Incorrect Board Address \n      ' +
        'EXPECTED RESULT: ' + acctOne + '\n      ' +
        'ACTUAL RESULT: ' + boardAddress);
    }

    // TEST CASE 02 - Post-Fuzz Test #1
    tokenSymbol = await truToken.symbol.call();
    assert.equal(tokenSymbol,
      'TRU',
      '\n      ' +
      'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 02: Post-Fuzz Test #1\n      ' +
      'TEST DESCRIPTION: Token Symbol should be TRU. \n      ' +
      'EXPECTED RESULT: TRU \n      ' +
      'ACTUAL RESULT: ' + tokenSymbol);

    // TEST CASE 02 - Post-Fuzz Test #2
    boardAddress = await truToken.execBoard.call();
    assert.equal(boardAddress,
      acctOne,
      '\n      ' +
      'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 02: Post-Fuzz Test #2\n      ' +
      'TEST DESCRIPTION: Incorrect Board Address \n      ' +
      'EXPECTED RESULT: ' + acctOne + '\n      ' +
      'ACTUAL RESULT: ' + boardAddress);
  }).timeout(timeoutDuration);

  it('FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 03: Fuzz test of TruMintableToken mint with invalid arguments', async function() {
    var fuzzGen;

    // TEST CASE 03 - Pre-Fuzz Test #1
    let tokenSupply = await truToken.totalSupply.call();
    assert.equal(tokenSupply,
      0,
      '\n      ' +
      'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 03: Pre-Fuzz Test #1\n      ' +
      'TEST DESCRIPTION: Token Supply should be zero\n      ' +
      'EXPECTED RESULT: 0\n      ' +
      'ACTUAL RESULT: ' + tokenSupply);

    for (var i = loopStart; i < loopEnd; i++) {
      fuzzer.seed(i);
      let pass = i - loopStart + 1;
      fuzzGen = fuzzer.mutate.string(fuzzStrOne);

      // TEST CASE 03 - Test 1
      await expectFuzzFail(truToken.mint(fuzzGen, 100, { from: acctOne }));
      tokenSupply = await truToken.totalSupply.call();
      assert.equal(tokenSupply,
        0,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 03: Pass #' + pass + ', Test #1\n      ' +
        'TEST DESCRIPTION: Token Supply should be zero after fuzzing mint function\n      ' +
        'EXPECTED RESULT: 0\n      ' +
        'ACTUAL RESULT: ' + tokenSupply);

      // TEST CASE 03 - Test 2
      await expectFuzzFail(truToken.mint(100, fuzzGen, { from: acctOne }));
      tokenSupply = await truToken.totalSupply.call();
      assert.equal(tokenSupply,
        0,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 03: Pass #' + pass + ', Test #2\n      ' +
        'TEST DESCRIPTION: Token Supply should be zero after fuzzing mint function\n      ' +
        'EXPECTED RESULT: 0\n      ' +
        'ACTUAL RESULT: ' + tokenSupply);

      // TEST CASE 03 - Test 3
      await expectFuzzFail(truToken.mint(100, acctOne, { from: fuzzGen }));
      tokenSupply = await truToken.totalSupply.call();
      assert.equal(tokenSupply,
        0,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 03: Pass #' + pass + ', Test #3\n      ' +
        'TEST DESCRIPTION: Token Supply should be zero after fuzzing mint function\n      ' +
        'EXPECTED RESULT: 0\n      ' +
        'ACTUAL RESULT: ' + tokenSupply);

      // TEST CASE 03 - Test 4
      await expectFuzzFail(truToken.mint(fuzzGen, fuzzGen, { from: fuzzGen }));
      tokenSupply = await truToken.totalSupply.call();
      assert.equal(tokenSupply,
        0,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 03: Pass #' + pass + ', Test #4\n      ' +
        'TEST DESCRIPTION: Token Supply should be zero after fuzzing mint function\n      ' +
        'EXPECTED RESULT: 0\n      ' +
        'ACTUAL RESULT: ' + tokenSupply);
    }

    // TEST CASE 03 - Post-Fuzz Test #1
    tokenSupply = await truToken.totalSupply.call();
    assert.equal(tokenSupply,
      0,
      '\n      ' +
      'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 03: Post-Fuzz Test #1\n      ' +
      'TEST DESCRIPTION: Token Supply should be zero\n      ' +
      'EXPECTED RESULT: 0\n      ' +
      'ACTUAL RESULT: ' + tokenSupply);
  }).timeout(timeoutDuration);

  it('FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 04: Fuzz test of TruMintableToken finishMinting with invalid arguments', async function() {
    var fuzzBoolOne = "fuzzBoolOne";
    var fuzzBoolTwo = "fuzzBoolTrue";
    var fuzzGenOne, fuzzGenTwo, fuzzGenThree, pSaleFinished, mintingStatus, saleFinished;

    // TEST CASE 04 - Pre-Fuzz Test #1a
    pSaleFinished = await truToken.preSaleComplete.call();
    assert.isFalse(pSaleFinished,
      '\n      ' +
      'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 04: Pre-Fuzz Test #1a\n      ' +
      'TEST DESCRIPTION: Pre Sale should not be finished\n      ' +
      'EXPECTED RESULT: false\n      ' +
      'ACTUAL RESULT: ' + pSaleFinished);

    // TEST CASE 04 - Pre-Fuzz Test #1b
    saleFinished = await truToken.saleComplete.call();
    assert.isFalse(saleFinished,
      '\n      ' +
      'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 04: Pre-Fuzz Test #1b\n      ' +
      'TEST DESCRIPTION: CrowdSale should not be finished\n      ' +
      'EXPECTED RESULT: false\n      ' +
      'ACTUAL RESULT: ' + saleFinished);

    // TEST CASE 04 - Pre-Fuzz Test #1c
    mintingStatus = await truToken.mintingFinished.call();
    assert.isFalse(mintingStatus,
      '\n      ' +
      'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 04: Pre-Fuzz Test #1c\n      ' +
      'TEST DESCRIPTION: Minting should not be finished\n      ' +
      'EXPECTED RESULT: false\n      ' +
      'ACTUAL RESULT: ' + mintingStatus);

    for (var i = loopStart; i < loopEnd; i++) {
      fuzzer.seed(i);
      let pass = i - loopStart + 1;
      fuzzGenOne = fuzzer.mutate.string(fuzzStrOne);
      fuzzGenTwo = fuzzer.mutate.string(fuzzBoolOne);
      fuzzGenThree = fuzzer.mutate.string(fuzzBoolTwo);

      // TEST CASE 04 - Test #1
      await expectFuzzFail(truToken.finishMinting(fuzzGenTwo, fuzzGenThree, { from: fuzzGenOne }));
      mintingStatus = await truToken.mintingFinished.call();
      pSaleFinished = await truToken.preSaleComplete.call();
      saleFinished = await truToken.saleComplete.call();
      assert.isFalse(pSaleFinished,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 04: Pass #' + pass + ', Test #1a\n      ' +
        'TEST DESCRIPTION: Pre Sale should not be finished\n      ' +
        'EXPECTED RESULT: false\n      ' +
        'ACTUAL RESULT: ' + pSaleFinished);
      assert.isFalse(saleFinished,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 04: Pass #' + pass + ', Test #1b\n      ' +
        'TEST DESCRIPTION: CrowdSale should not be finished\n      ' +
        'EXPECTED RESULT: false\n      ' +
        'ACTUAL RESULT: ' + saleFinished);
      assert.isFalse(mintingStatus,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 04: Pass #' + pass + ', Test #1c\n      ' +
        'TEST DESCRIPTION: Minting should not be finished\n      ' +
        'EXPECTED RESULT: false\n      ' +
        'ACTUAL RESULT: ' + mintingStatus);

      // TEST CASE 04 - Test #2
      await expectFuzzFail(truToken.finishMinting(true, fuzzGenThree, { from: fuzzGenOne }))
      mintingStatus = await truToken.mintingFinished.call();
      pSaleFinished = await truToken.preSaleComplete.call();
      saleFinished = await truToken.saleComplete.call();
      assert.isFalse(pSaleFinished,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 04: Pass #' + pass + ', Test #2a\n      ' +
        'TEST DESCRIPTION: Pre Sale should not be finished\n      ' +
        'EXPECTED RESULT: false\n      ' +
        'ACTUAL RESULT: ' + pSaleFinished);
      assert.isFalse(saleFinished,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 04: Pass #' + pass + ', Test #2b\n      ' +
        'TEST DESCRIPTION: CrowdSale should not be finished\n      ' +
        'EXPECTED RESULT: false\n      ' +
        'ACTUAL RESULT: ' + saleFinished);
      assert.isFalse(mintingStatus,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 04: Pass #' + pass + ', Test #2c\n      ' +
        'TEST DESCRIPTION: Minting should not be finished\n      ' +
        'EXPECTED RESULT: false\n      ' +
        'ACTUAL RESULT: ' + mintingStatus);

      // TEST CASE 04 - Test #3
      await expectFuzzFail(truToken.finishMinting(true, false, { from: fuzzGenOne }))
      mintingStatus = await truToken.mintingFinished.call();
      pSaleFinished = await truToken.preSaleComplete.call();
      saleFinished = await truToken.saleComplete.call();
      assert.isFalse(pSaleFinished,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 04: Pass #' + pass + ', Test #3a\n      ' +
        'TEST DESCRIPTION: Pre Sale should not be finished\n      ' +
        'EXPECTED RESULT: false\n      ' +
        'ACTUAL RESULT: ' + pSaleFinished);
      assert.isFalse(saleFinished,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 04: Pass #' + pass + ', Test #3b\n      ' +
        'TEST DESCRIPTION: CrowdSale should not be finished\n      ' +
        'EXPECTED RESULT: false\n      ' +
        'ACTUAL RESULT: ' + saleFinished);
      assert.isFalse(mintingStatus,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 04: Pass #' + pass + ', Test #3c\n      ' +
        'TEST DESCRIPTION: Minting should not be finished\n      ' +
        'EXPECTED RESULT: false\n      ' +
        'ACTUAL RESULT: ' + mintingStatus);

      // TEST CASE 04 - Test #4
      await expectFuzzFail(truToken.finishMinting(false, true, { from: fuzzGenOne }))
      mintingStatus = await truToken.mintingFinished.call();
      pSaleFinished = await truToken.preSaleComplete.call();
      saleFinished = await truToken.saleComplete.call();
      assert.isFalse(pSaleFinished,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 04: Pass #' + pass + ', Test #4a\n      ' +
        'TEST DESCRIPTION: Pre Sale should not be finished\n      ' +
        'EXPECTED RESULT: false\n      ' +
        'ACTUAL RESULT: ' + pSaleFinished);
      assert.isFalse(saleFinished,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 04: Pass #' + pass + ', Test #4b\n      ' +
        'TEST DESCRIPTION: CrowdSale should not be finished\n      ' +
        'EXPECTED RESULT: false\n      ' +
        'ACTUAL RESULT: ' + saleFinished);
      assert.isFalse(mintingStatus,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 04: Pass #' + pass + ', Test #4c\n      ' +
        'TEST DESCRIPTION: Minting should not be finished\n      ' +
        'EXPECTED RESULT: false\n      ' +
        'ACTUAL RESULT: ' + mintingStatus);

      // TEST CASE 04 - Test #5
      await expectFuzzFail(truToken.finishMinting(true, true, { from: fuzzGenOne }))
      mintingStatus = await truToken.mintingFinished.call();
      pSaleFinished = await truToken.preSaleComplete.call();
      saleFinished = await truToken.saleComplete.call();
      assert.isFalse(pSaleFinished,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 04: Pass #' + pass + ', Test #5a\n      ' +
        'TEST DESCRIPTION: Pre Sale should not be finished\n      ' +
        'EXPECTED RESULT: false\n      ' +
        'ACTUAL RESULT: ' + pSaleFinished);
      assert.isFalse(saleFinished,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 04: Pass #' + pass + ', Test #5b\n      ' +
        'TEST DESCRIPTION: CrowdSale should not be finished\n      ' +
        'EXPECTED RESULT: false\n      ' +
        'ACTUAL RESULT: ' + saleFinished);
      assert.isFalse(mintingStatus,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 04: Pass #' + pass + ', Test #5c\n      ' +
        'TEST DESCRIPTION: Minting should not be finished\n      ' +
        'EXPECTED RESULT: false\n      ' +
        'ACTUAL RESULT: ' + mintingStatus);


      // TEST CASE 04 - Test #6
      await expectFuzzFail(truToken.finishMinting(fuzzGenTwo, true, { from: fuzzGenOne }))
      mintingStatus = await truToken.mintingFinished.call();
      pSaleFinished = await truToken.preSaleComplete.call();
      saleFinished = await truToken.saleComplete.call();
      assert.isFalse(pSaleFinished,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 04: Pass #' + pass + ', Test #6a\n      ' +
        'TEST DESCRIPTION: Pre Sale should not be finished\n      ' +
        'EXPECTED RESULT: false\n      ' +
        'ACTUAL RESULT: ' + pSaleFinished);
      assert.isFalse(saleFinished,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 04: Pass #' + pass + ', Test #6b\n      ' +
        'TEST DESCRIPTION: CrowdSale should not be finished\n      ' +
        'EXPECTED RESULT: false\n      ' +
        'ACTUAL RESULT: ' + saleFinished);
      assert.isFalse(mintingStatus,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 04: Pass #' + pass + ', Test #6c\n      ' +
        'TEST DESCRIPTION: Minting should not be finished\n      ' +
        'EXPECTED RESULT: false\n      ' +
        'ACTUAL RESULT: ' + mintingStatus);

      // TEST CASE 04 - Test #7
      await expectFuzzFail(truToken.finishMinting(fuzzGenTwo, fuzzGenThree, { from: acctOne }));
      mintingStatus = await truToken.mintingFinished.call();
      pSaleFinished = await truToken.preSaleComplete.call();
      saleFinished = await truToken.saleComplete.call();
      assert.isFalse(pSaleFinished,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 04: Pass #' + pass + ', Test #7a\n      ' +
        'TEST DESCRIPTION: Pre Sale should not be finished\n      ' +
        'EXPECTED RESULT: false\n      ' +
        'ACTUAL RESULT: ' + pSaleFinished);
      assert.isFalse(saleFinished,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 04: Pass #' + pass + ', Test #7b\n      ' +
        'TEST DESCRIPTION: CrowdSale should not be finished\n      ' +
        'EXPECTED RESULT: false\n      ' +
        'ACTUAL RESULT: ' + saleFinished);
      assert.isFalse(mintingStatus,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 04: Pass #' + pass + ', Test #7c\n      ' +
        'TEST DESCRIPTION: Minting should not be finished\n      ' +
        'EXPECTED RESULT: false\n      ' +
        'ACTUAL RESULT: ' + mintingStatus);

      // TEST CASE 04 - Test #8
      await expectFuzzFail(truToken.finishMinting(true, fuzzGenThree, { from: acctOne }));
      mintingStatus = await truToken.mintingFinished.call();
      pSaleFinished = await truToken.preSaleComplete.call();
      saleFinished = await truToken.saleComplete.call();
      assert.isFalse(pSaleFinished,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 04: Pass #' + pass + ', Test #8a\n      ' +
        'TEST DESCRIPTION: Pre Sale should not be finished\n      ' +
        'EXPECTED RESULT: false\n      ' +
        'ACTUAL RESULT: ' + pSaleFinished);
      assert.isFalse(saleFinished,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 04: Pass #' + pass + ', Test #8b\n      ' +
        'TEST DESCRIPTION: CrowdSale should not be finished\n      ' +
        'EXPECTED RESULT: false\n      ' +
        'ACTUAL RESULT: ' + saleFinished);
      assert.isFalse(mintingStatus,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 04: Pass #' + pass + ', Test #8c\n      ' +
        'TEST DESCRIPTION: Minting should not be finished\n      ' +
        'EXPECTED RESULT: false\n      ' +
        'ACTUAL RESULT: ' + mintingStatus);

      // TEST CASE 04 - Test #9
      await expectFuzzFail(truToken.finishMinting(fuzzGenTwo, true, { from: acctOne }));
      mintingStatus = await truToken.mintingFinished.call();
      pSaleFinished = await truToken.preSaleComplete.call();
      saleFinished = await truToken.saleComplete.call();
      assert.isFalse(pSaleFinished,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 04: Pass #' + pass + ', Test #9a\n      ' +
        'TEST DESCRIPTION: Pre Sale should not be finished\n      ' +
        'EXPECTED RESULT: false\n      ' +
        'ACTUAL RESULT: ' + pSaleFinished);
      assert.isFalse(saleFinished,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 04: Pass #' + pass + ', Test #9b\n      ' +
        'TEST DESCRIPTION: CrowdSale should not be finished\n      ' +
        'EXPECTED RESULT: false\n      ' +
        'ACTUAL RESULT: ' + saleFinished);
      assert.isFalse(mintingStatus,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 04: Pass #' + pass + ', Test #9c\n      ' +
        'TEST DESCRIPTION: Minting should not be finished\n      ' +
        'EXPECTED RESULT: false\n      ' +
        'ACTUAL RESULT: ' + mintingStatus);
    }

    mintingStatus = await truToken.mintingFinished.call();
    pSaleFinished = await truToken.preSaleComplete.call();
    saleFinished = await truToken.saleComplete.call();
    // TEST CASE 04 - Post-Fuzz Test #1a
    assert.isFalse(pSaleFinished,
      '\n      ' +
      'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 04: Post-Fuzz Test #1a\n      ' +
      'TEST DESCRIPTION: Pre Sale should not be finished\n      ' +
      'EXPECTED RESULT: false\n      ' +
      'ACTUAL RESULT: ' + pSaleFinished);

    // TEST CASE 04 - Post-Fuzz Test #1b
    assert.isFalse(saleFinished,
      '\n      ' +
      'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 04: Post-Fuzz Test #1c\n      ' +
      'TEST DESCRIPTION: CrowdSale should not be finished\n      ' +
      'EXPECTED RESULT: false\n      ' +
      'ACTUAL RESULT: ' + saleFinished);

    // TEST CASE 04 - Post-Fuzz Test #1c
    assert.isFalse(mintingStatus,
      '\n      ' +
      'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 04: Post-Fuzz Test #1c\n      ' +
      'TEST DESCRIPTION: Minting should not be finished\n      ' +
      'EXPECTED RESULT: false\n      ' +
      'ACTUAL RESULT: ' + mintingStatus);
  }).timeout(timeoutDuration);

  it('FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 05: Fuzz test of ReleasableToken setTransferAgent with invalid arguments', async function() {
    var fuzzBoolOne = "true";
    var fuzzGenOne, fuzzGenTwo, fuzzGenThree, tAgent;
    let oTAgent = truToken.transferAgent;

    // TEST CASE 05 - Pre-Fuzz Test #1
    assert.isUndefined(oTAgent,
      '\n      ' +
      'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 05: Pre-Fuzz Test #1\n      ' +
      'TEST DESCRIPTION: Transfer Agent should be undefined\n      ' +
      'EXPECTED RESULT: undefined\n      ' +
      'ACTUAL RESULT: ' + oTAgent);

    for (var i = loopStart; i < loopEnd; i++) {
      fuzzer.seed(i);
      let pass = i - loopStart + 1;
      fuzzGenOne = fuzzer.mutate.string(fuzzStrOne);
      fuzzGenTwo = fuzzer.mutate.string(fuzzStrTwo);
      fuzzGenThree = fuzzer.mutate.string(fuzzBoolOne);

      // TEST CASE 05 - Test #1
      await expectFuzzFail(truToken.setTransferAgent(fuzzGenTwo, fuzzGenThree, { from: fuzzGenOne }));
      tAgent = truToken.transferAgent;
      assert.isUndefined(tAgent,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 05: Pass #' + pass + ', Test #1a\n      ' +
        'TEST DESCRIPTION: Transfer Agent should be undefined\n      ' +
        'EXPECTED RESULT: undefined\n      ' +
        'ACTUAL RESULT: ' + tAgent);
      assert.equal(tAgent,
        oTAgent,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 05: Pass #' + pass + ', Test #1b\n      ' +
        'TEST DESCRIPTION: Transfer Agent should be unchanged\n      ' +
        'EXPECTED RESULT: ' + oTAgent + '\n      ' +
        'ACTUAL RESULT: ' + tAgent);

      // TEST CASE 05 - Test #2
      await expectFuzzFail(truToken.setTransferAgent(fuzzGenTwo, fuzzGenThree, { from: acctOne }));
      tAgent = truToken.transferAgent;
      assert.isUndefined(tAgent,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 05: Pass #' + pass + ', Test #2a\n      ' +
        'TEST DESCRIPTION: Transfer Agent should be undefined\n      ' +
        'EXPECTED RESULT: undefined\n      ' +
        'ACTUAL RESULT: ' + tAgent);
      assert.equal(tAgent,
        oTAgent,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 05: Pass #' + pass + ', Test #2b\n      ' +
        'TEST DESCRIPTION: Transfer Agent should be unchanged\n      ' +
        'EXPECTED RESULT: ' + oTAgent + '\n      ' +
        'ACTUAL RESULT: ' + tAgent);

      // TEST CASE 05 - Test #3
      await expectFuzzFail(truToken.setTransferAgent(acctOne, fuzzStrThree, { from: fuzzGenOne }));
      tAgent = truToken.transferAgent;
      assert.isUndefined(tAgent,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 05: Pass #' + pass + ', Test #3a\n      ' +
        'TEST DESCRIPTION: Transfer Agent should be undefined\n      ' +
        'EXPECTED RESULT: undefined\n      ' +
        'ACTUAL RESULT: ' + tAgent);
      assert.equal(tAgent,
        oTAgent,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 05: Pass #' + pass + ', Test #3b\n      ' +
        'TEST DESCRIPTION: Transfer Agent should be unchanged\n      ' +
        'EXPECTED RESULT: ' + oTAgent + '\n      ' +
        'ACTUAL RESULT: ' + tAgent);
    }
    oTAgent = truToken.transferAgent;

    // TEST CASE 05 - Post-Fuzz Test #1
    assert.isUndefined(oTAgent,
      '\n      ' +
      'FUZZING TESTS - TRUREPUTATIONTOKEN - Post-Fuzz Test #1\n      ' +
      'TEST DESCRIPTION: Transfer Agent should be undefined\n      ' +
      'EXPECTED RESULT: undefined\n      ' +
      'ACTUAL RESULT: ' + oTAgent);
  }).timeout(timeoutDuration);

  it('FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 06: Fuzz test of ReleasableToken setReleaseAgent with invalid arguments', async function() {
    var fuzzBoolOne = "true";
    var fuzzGenOne, fuzzGenTwo, fuzzGenThree;
    let rAgent = await truToken.releaseAgent.call();

    // TEST CASE 06 - Pre-Fuzz Test #1
    assert.equal(rAgent,
      0x0,
      '\n      ' +
      'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 06: Pre-Fuzz Test #1\n      ' +
      'TEST DESCRIPTION: Release Agent should be 0x0\n      ' +
      'EXPECTED RESULT: ' + 0x0 + '\n      ' +
      'ACTUAL RESULT: ' + rAgent);

    for (var i = loopStart; i < loopEnd; i++) {
      let pass = i - loopStart + 1;
      fuzzer.seed(i);
      fuzzGenOne = fuzzer.mutate.string(fuzzStrOne);
      fuzzGenTwo = fuzzer.mutate.string(fuzzStrTwo);
      fuzzGenThree = fuzzer.mutate.string(fuzzBoolOne);

      // TEST CASE 06 - Test #1
      await expectFuzzFail(truToken.setReleaseAgent(fuzzGenTwo, { from: fuzzGenOne }));
      rAgent = await truToken.releaseAgent.call();
      assert.equal(rAgent,
        0x0,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 06: Pass #' + pass + ', Test #1\n      ' +
        'TEST DESCRIPTION: Release Agent should be 0x0\n      ' +
        'EXPECTED RESULT: ' + 0x0 + '\n      ' +
        'ACTUAL RESULT: ' + rAgent);

      // TEST CASE 06 - Test #2
      await expectFuzzFail(truToken.setReleaseAgent(fuzzGenTwo, { from: acctOne }));
      rAgent = await truToken.releaseAgent.call();
      assert.equal(rAgent,
        0x0,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 06: Pass #' + pass + ', Test #2\n      ' +
        'TEST DESCRIPTION: Release Agent should be 0x0\n      ' +
        'EXPECTED RESULT: ' + 0x0 + '\n      ' +
        'ACTUAL RESULT: ' + rAgent);

      // TEST CASE 06 - Test #3
      await expectFuzzFail(truToken.setReleaseAgent(acctOne, { from: fuzzGenOne }));
      rAgent = await truToken.releaseAgent.call();
      assert.equal(rAgent,
        0x0,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 06: Pass #' + pass + ', Test #3\n      ' +
        'TEST DESCRIPTION: Release Agent should be 0x0\n      ' +
        'EXPECTED RESULT: ' + 0x0 + '\n      ' +
        'ACTUAL RESULT: ' + rAgent);
    }

    // TEST CASE 06 - Post-Fuzz Test #1
    rAgent = await truToken.releaseAgent.call();
    assert.equal(rAgent,
      0x0,
      '\n      ' +
      'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 06: Post-Fuzz Test #1\n      ' +
      'TEST DESCRIPTION: Release Agent should be 0x0\n      ' +
      'EXPECTED RESULT: ' + 0x0 + '\n      ' +
      'ACTUAL RESULT: ' + rAgent);
  }).timeout(timeoutDuration);

  it('FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 07: Fuzz test of ReleasableToken releaseTokenTransfer with invalid arguments', async function() {
    var fuzzGenOne, released;
    released = await truToken.released.call();

    // TEST CASE 07 - Pre-Fuzz Test #1
    assert.isFalse(released,
      '\n      ' +
      'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 07: Pre-Fuzz Test #1\n      ' +
      'TEST DESCRIPTION: Token should not be released\n      ' +
      'EXPECTED RESULT: false\n      ' +
      'ACTUAL RESULT: ' + released);

    for (var i = loopStart; i < loopEnd; i++) {
      let pass = i - loopStart + 1;
      fuzzer.seed(i);
      fuzzGenOne = fuzzer.mutate.string(fuzzStrOne);

      // TEST CASE 07 - Test #1
      await expectFuzzFail(truToken.releaseTokenTransfer({ from: fuzzGenOne }));
      released = await truToken.released.call();
      assert.isFalse(released,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 07: Pass #' + pass + ', Test #1\n      ' +
        'TEST DESCRIPTION: Token should not be released\n      ' +
        'EXPECTED RESULT: false\n      ' +
        'ACTUAL RESULT: ' + released);
    }

    // TEST CASE 07 - Post-Fuzz Test #1
    released = await truToken.released.call();
    assert.isFalse(released,
      '\n      ' +
      'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 07: Post-Fuzz Test #1\n      ' +
      'TEST DESCRIPTION: Token should not be released\n      ' +
      'EXPECTED RESULT: false\n      ' +
      'ACTUAL RESULT: ' + released);

  }).timeout(timeoutDuration);

  it('FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 08: Fuzz test of ReleasableToken transfer with invalid arguments', async function() {
    var fuzzGenOne, fuzzGenTwo;
    var emptyAdr = "0x0000000000000000000000000000000000000000";

    // Create minted pool   
    await truToken.mint(acctOne, hundredTru, { from: acctOne });

    // TEST CASE 08 - Pre-Fuzz Test #1
    let acctOneBal = await truToken.balanceOf.call(acctOne);
    assert.equal(web3.fromWei(acctOneBal, 'ether'),
      100,
      '\n      ' +
      'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 08: Pre-Fuzz Test #1\n      ' +
      'TEST DESCRIPTION: Account One has wrong balance\n      ' +
      'EXPECTED RESULT: 100 TRU; \n      ' +
      'ACTUAL RESULT: ' + web3.fromWei(acctOneBal, 'ether'));

    // Finish minting
    await truToken.setTransferAgent(acctOne, true, { from: acctOne });
    await truToken.finishMinting(true, false, { from: acctOne });
    await truToken.finishMinting(false, true, { from: acctOne });

    // TEST CASE 08 - Pre-Fuzz Test #2
    let mintingStatus = await truToken.mintingFinished.call();
    assert.isTrue(mintingStatus,
      '\n      ' +
      'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 08: Pre-Fuzz Test #2\n      ' +
      'TEST DESCRIPTION: Minting should be finished\n      ' +
      'EXPECTED RESULT: true\n      ' +
      'ACTUAL RESULT: ' + mintingStatus);

    for (var i = loopStart; i < loopEnd; i++) {
      let pass = i - loopStart + 1;
      fuzzer.seed(i);
      fuzzGenOne = fuzzer.mutate.string(fuzzStrOne);
      fuzzGenTwo = fuzzer.mutate.string(fuzzStrTwo);

      // TEST CASE 08 - Test #1
      await expectFuzzFail(truToken.transfer(fuzzGenTwo, hundredTru, { from: fuzzGenOne }));
      acctOneBal = await truToken.balanceOf.call(acctOne);
      assert.equal(web3.fromWei(acctOneBal, 'ether'),
        100,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 08: Pass #' + pass + ', Test #1\n      ' +
        'TEST DESCRIPTION: Account One has wrong balance\n      ' +
        'EXPECTED RESULT: 100 TRU; \n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(acctOneBal, 'ether'));

      // TEST CASE 08 - Test #2
      await expectFuzzFail(truToken.transfer(acctTwo, hundredTru, { from: fuzzGenOne }));
      acctOneBal = await truToken.balanceOf.call(acctOne);
      assert.equal(web3.fromWei(acctOneBal, 'ether'),
        100,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 08: Pass #' + pass + ', Test #2\n      ' +
        'TEST DESCRIPTION: Account One has wrong balance\n      ' +
        'EXPECTED RESULT: 100 TRU; \n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(acctOneBal, 'ether'));

      // TEST CASE 08 - Test #3
      await expectFuzzFail(truToken.transfer(fuzzGenTwo, hundredTru, { from: acctOne }));
      acctOneBal = await truToken.balanceOf.call(acctOne);
      assert.equal(web3.fromWei(acctOneBal, 'ether'),
        100,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 08: Pass #' + pass + ', Test #3\n      ' +
        'TEST DESCRIPTION: Account One has wrong balance\n      ' +
        'EXPECTED RESULT: 100 TRU; \n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(acctOneBal, 'ether'));

      // TEST CASE 08 - Test #4
      await expectFuzzFail(truToken.transfer(fuzzGenTwo, hundredTru, { from: 0x0 }));
      acctOneBal = await truToken.balanceOf.call(acctOne);
      assert.equal(web3.fromWei(acctOneBal, 'ether'),
        100,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 08: Pass #' + pass + ', Test #4\n      ' +
        'TEST DESCRIPTION: Account One has wrong balance\n      ' +
        'EXPECTED RESULT: 100 TRU; \n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(acctOneBal, 'ether'));

      // TEST CASE 08 - Test #5
      await expectFuzzFail(truToken.transfer(emptyAdr, hundredTru, { from: acctOne }));
      acctOneBal = await truToken.balanceOf.call(acctOne);
      assert.equal(web3.fromWei(acctOneBal, 'ether'),
        100,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 08: Pass #' + pass + ', Test #5\n      ' +
        'TEST DESCRIPTION: Account One has wrong balance\n      ' +
        'EXPECTED RESULT: 100 TRU; \n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(acctOneBal, 'ether'));

      // TEST CASE 08 - Test #6
      await expectFuzzFail(truToken.transfer(acctTwo, maximumTru, { from: acctOne }));
      acctOneBal = await truToken.balanceOf.call(acctOne);
      assert.equal(web3.fromWei(acctOneBal, 'ether'),
        100,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 08: Pass #' + pass + ', Test #6\n      ' +
        'TEST DESCRIPTION: Account One has wrong balance\n      ' +
        'EXPECTED RESULT: 100 TRU; \n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(acctOneBal, 'ether'));
    }

    // TEST CASE 08 - Post-Fuzz Test #1
    acctOneBal = await truToken.balanceOf.call(acctOne);
    assert.equal(web3.fromWei(acctOneBal, 'ether'),
      100,
      '\n      ' +
      'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 08: Post-Fuzz Test #1\n      ' +
      'TEST DESCRIPTION: Account One has wrong balance\n      ' +
      'EXPECTED RESULT: 100 TRU; \n      ' +
      'ACTUAL RESULT: ' + web3.fromWei(acctOneBal, 'ether'));

    // TEST CASE 08 - Post-Fuzz Test #2
    mintingStatus = await truToken.mintingFinished.call();
    assert.isTrue(mintingStatus,
      '\n      ' +
      'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 08: Post-Fuzz Test #2\n      ' +
      'TEST DESCRIPTION: Minting should be finished\n      ' +
      'EXPECTED RESULT: true\n      ' +
      'ACTUAL RESULT: ' + mintingStatus);
  }).timeout(timeoutDuration);

  it('FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 09: Fuzz test of ReleasableToken transferFrom with invalid arguments', async function() {
    var fuzzGenOne, fuzzGenTwo;

    // TEST CASE 09 - Pre-Fuzz Test #1
    let acctOneBal = await truToken.balanceOf.call(acctOne);
    assert.equal(web3.fromWei(acctOneBal, 'ether'),
      100,
      '\n      ' +
      'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 09: Pre-Fuzz Test #1\n      ' +
      'TEST DESCRIPTION: Account One has wrong balance\n      ' +
      'EXPECTED RESULT: 100 TRU; \n      ' +
      'ACTUAL RESULT: ' + web3.fromWei(acctOneBal, 'ether'));

    for (var i = loopStart; i < loopEnd; i++) {
      let pass = i - loopStart + 1;
      fuzzer.seed(i);
      fuzzGenOne = fuzzer.mutate.string(fuzzStrOne);
      fuzzGenTwo = fuzzer.mutate.string(fuzzStrTwo);

      // TEST CASE 09 - Test #1
      await expectFuzzFail(truToken.transferFrom(fuzzGenTwo, hundredTru, { from: fuzzGenOne }));
      acctOneBal = await truToken.balanceOf.call(acctOne);
      assert.equal(web3.fromWei(acctOneBal, 'ether'),
        100,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 09: Pass #' + pass + ', Test #1\n      ' +
        'TEST DESCRIPTION: Account One has wrong balance\n      ' +
        'EXPECTED RESULT: 100 TRU; \n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(acctOneBal, 'ether'));

      // TEST CASE 09 - Test #2
      await expectFuzzFail(truToken.transferFrom(acctTwo, hundredTru, { from: fuzzGenOne }));
      acctOneBal = await truToken.balanceOf.call(acctOne);
      assert.equal(web3.fromWei(acctOneBal, 'ether'),
        100,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 09: Pass #' + pass + ', Test #2\n      ' +
        'TEST DESCRIPTION: Account One has wrong balance\n      ' +
        'EXPECTED RESULT: 100 TRU; \n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(acctOneBal, 'ether'));

      // TEST CASE 09 - Test #3
      await expectFuzzFail(truToken.transferFrom(acctTwo, fuzzGenOne, { from: acctOne }));
      acctOneBal = await truToken.balanceOf.call(acctOne);
      assert.equal(web3.fromWei(acctOneBal, 'ether'),
        100,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 09: Pass #' + pass + ', Test #3\n      ' +
        'TEST DESCRIPTION: Account One has wrong balance\n      ' +
        'EXPECTED RESULT: 100 TRU; \n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(acctOneBal, 'ether'));

      // TEST CASE 09 - Test #3
      await expectFuzzFail(truToken.transferFrom(fuzzGenOne, fuzzGenOne, { from: acctOne }));
      acctOneBal = await truToken.balanceOf.call(acctOne);
      assert.equal(web3.fromWei(acctOneBal, 'ether'), 100,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 09: Pass #' + pass + ', Test #4\n      ' +
        'TEST DESCRIPTION: Account One has wrong balance\n      ' +
        'EXPECTED RESULT: 100 TRU; \n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(acctOneBal, 'ether'));

      // TEST CASE 09 - Test #4
      await expectFuzzFail(truToken.transferFrom(acctTwo, fuzzGenOne, { from: fuzzGenOne }));
      acctOneBal = await truToken.balanceOf.call(acctOne);
      assert.equal(web3.fromWei(acctOneBal, 'ether'), 100,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 09: Pass #' + pass + ', Test #5\n      ' +
        'TEST DESCRIPTION: Account One has wrong balance\n      ' +
        'EXPECTED RESULT: 100 TRU; \n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(acctOneBal, 'ether'));

      // TEST CASE 09 - Test #5
      await expectFuzzFail(truToken.transferFrom(fuzzGenOne, fuzzGenTwo, { from: fuzzGenOne }));
      acctOneBal = await truToken.balanceOf.call(acctOne);
      assert.equal(web3.fromWei(acctOneBal, 'ether'), 100,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 09: Pass #' + pass + ', Test #6\n      ' +
        'TEST DESCRIPTION: Account One has wrong balance\n      ' +
        'EXPECTED RESULT: 100 TRU; \n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(acctOneBal, 'ether'));
    }

    // TEST CASE 09 - Post-Fuzz Test #1
    acctOneBal = await truToken.balanceOf.call(acctOne);
    assert.equal(web3.fromWei(acctOneBal, 'ether'), 100,
      '\n      ' +
      'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 09: Post-Fuzz Test #1\n      ' +
      'TEST DESCRIPTION: Account One has wrong balance\n      ' +
      'EXPECTED RESULT: 100 TRU; \n      ' +
      'ACTUAL RESULT: ' + web3.fromWei(acctOneBal, 'ether'));
  }).timeout(timeoutDuration);

  it('FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 10: Fuzz test of StandardToken approve with invalid arguments', async function() {
    var fuzzGenOne;
    let acctOneBal = await truToken.balanceOf.call(acctOne);

    // TEST CASE 10 - Pre-Fuzz Test #1
    assert.equal(web3.fromWei(acctOneBal, 'ether'),
      100,
      '\n      ' +
      'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 10: Pre-Fuzz Test #1\n      ' +
      'TEST DESCRIPTION: Account One has wrong balance\n      ' +
      'EXPECTED RESULT: 100 TRU; \n      ' +
      'ACTUAL RESULT: ' + web3.fromWei(acctOneBal, 'ether'));

    for (var i = loopStart; i < loopEnd; i++) {
      fuzzer.seed(i);
      let pass = i - loopStart + 1;
      fuzzGenOne = fuzzer.mutate.string(fuzzStrOne);

      // TEST CASE 10 - Test #1
      await expectFuzzFail(truToken.approve(fuzzGenOne, hundredTru, { from: acctOne }));
      acctOneBal = await truToken.balanceOf.call(acctOne);
      assert.equal(web3.fromWei(acctOneBal, 'ether'),
        100,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 10: Pass #' + pass + ', Test #1\n      ' +
        'TEST DESCRIPTION: Account One has wrong balance\n      ' +
        'EXPECTED RESULT: 100 TRU; \n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(acctOneBal, 'ether'));

      // TEST CASE 10 - Test #2
      await expectFuzzFail(truToken.approve(acctTwo, hundredTru, { from: fuzzGenOne }));
      acctOneBal = await truToken.balanceOf.call(acctOne);
      assert.equal(web3.fromWei(acctOneBal, 'ether'),
        100,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 10: Pass #' + pass + ', Test #2\n      ' +
        'TEST DESCRIPTION: Account One has wrong balance\n      ' +
        'EXPECTED RESULT: 100 TRU; \n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(acctOneBal, 'ether'));

      // TEST CASE 10 - Test #3
      await expectFuzzFail(truToken.approve(acctTwo, fuzzGenOne, { from: acctOne }));
      acctOneBal = await truToken.balanceOf.call(acctOne);
      assert.equal(web3.fromWei(acctOneBal, 'ether'),
        100,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 10: Pass #' + pass + ', Test #3\n      ' +
        'TEST DESCRIPTION: Account One has wrong balance\n      ' +
        'EXPECTED RESULT: 100 TRU; \n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(acctOneBal, 'ether'));

      // TEST CASE 10 - Test #4
      await expectFuzzFail(truToken.approve(fuzzGenOne, fuzzGenOne, { from: acctOne }));
      acctOneBal = await truToken.balanceOf.call(acctOne);
      assert.equal(web3.fromWei(acctOneBal, 'ether'),
        100,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 10: Pass #' + pass + ', Test #4\n      ' +
        'TEST DESCRIPTION: Account One has wrong balance\n      ' +
        'EXPECTED RESULT: 100 TRU; \n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(acctOneBal, 'ether'));

      // TEST CASE 10 - Test #5
      await expectFuzzFail(truToken.approve(acctTwo, fuzzGenOne, { from: fuzzGenOne }));
      acctOneBal = await truToken.balanceOf.call(acctOne);
      assert.equal(web3.fromWei(acctOneBal, 'ether'),
        100,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 10: Pass #' + pass + ', Test #5\n      ' +
        'TEST DESCRIPTION: Account One has wrong balance\n      ' +
        'EXPECTED RESULT: 100 TRU; \n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(acctOneBal, 'ether'));

      // TEST CASE 10 - Test #6
      await expectFuzzFail(truToken.approve(fuzzGenOne, fuzzGenOne, { from: fuzzGenOne }));
      acctOneBal = await truToken.balanceOf.call(acctOne);
      assert.equal(web3.fromWei(acctOneBal, 'ether'),
        100,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 10: Pass #' + pass + ', Test #6\n      ' +
        'TEST DESCRIPTION: Account One has wrong balance\n      ' +
        'EXPECTED RESULT: 100 TRU; \n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(acctOneBal, 'ether'));
    }

    // TEST CASE 10 - Post-Fuzz Test #1
    acctOneBal = await truToken.balanceOf.call(acctOne);
    assert.equal(web3.fromWei(acctOneBal, 'ether'),
      100,
      '\n      ' +
      'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 10:Post-Fuzz Test #1\n      ' +
      'TEST DESCRIPTION: Account One has wrong balance\n      ' +
      'EXPECTED RESULT: 100 TRU; \n      ' +
      'ACTUAL RESULT: ' + web3.fromWei(acctOneBal, 'ether'));
  }).timeout(timeoutDuration);

  it('FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 11: Fuzz test of StandardToken allowance with invalid arguments', async function() {
    var fuzzGenOne;

    // TEST CASE 11 - Pre-Fuzz Test #1
    let acctOneBal = await truToken.balanceOf.call(acctOne);
    assert.equal(web3.fromWei(acctOneBal, 'ether'),
      100,
      '\n      ' +
      'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 11: Pre-Fuzz Test #1\n      ' +
      'TEST DESCRIPTION: Account One has wrong balance\n      ' +
      'EXPECTED RESULT: 100 TRU; \n      ' +
      'ACTUAL RESULT: ' + web3.fromWei(acctOneBal, 'ether'));

    await truToken.approve(acctTwo, tenTru, { from: acctOne });

    // TEST CASE 11 - Pre-Fuzz Test #2
    let acctTwoAllowance = await truToken.allowance.call(acctOne, acctTwo);
    assert.equal(web3.fromWei(acctTwoAllowance, 'ether'),
      10,
      '\n      ' +
      'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 11: Pre-Fuzz Test #2\n      ' +
      'TEST DESCRIPTION: Account Two has incorrect allowance\n      ' +
      'EXPECTED RESULT: 10 TRU\n      ' +
      'ACTUAL RESULT: ' + web3.fromWei(acctTwoAllowance, 'ether'));

    for (var i = loopStart; i < loopEnd; i++) {
      fuzzer.seed(i);
      fuzzGenOne = fuzzer.mutate.string(fuzzStrOne);
      let pass = i - loopStart + 1;

      // TEST CASE 11 - Test #1
      await expectFuzzFail(truToken.approve(acctTwo, fuzzGenOne, { from: acctOne }));
      acctTwoAllowance = await truToken.allowance.call(acctOne, acctTwo);
      assert.equal(web3.fromWei(acctTwoAllowance, 'ether'),
        10,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 11: Pass #' + pass + ', Test #1\n      ' +
        'TEST DESCRIPTION: Account Two has incorrect allowance\n      ' +
        'EXPECTED RESULT: 10 TRU\n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(acctTwoAllowance, 'ether'));

      // TEST CASE 11 - Test #2
      await expectFuzzFail(truToken.approve(fuzzGenOne, tenTru, { from: acctOne }));
      acctTwoAllowance = await truToken.allowance.call(acctOne, acctTwo);
      assert.equal(web3.fromWei(acctTwoAllowance, 'ether'),
        10,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 11: Pass #' + pass + ', Test #2\n      ' +
        'TEST DESCRIPTION: Account Two has incorrect allowance\n      ' +
        'EXPECTED RESULT: 10 TRU\n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(acctTwoAllowance, 'ether'));

      // TEST CASE 11 - Test #3
      await expectFuzzFail(truToken.approve(acctTwo, tenTru, { from: fuzzGenOne }));
      acctTwoAllowance = await truToken.allowance.call(acctOne, acctTwo);
      assert.equal(web3.fromWei(acctTwoAllowance, 'ether'),
        10,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 11: Pass #' + pass + ', Test #3\n      ' +
        'TEST DESCRIPTION: Account Two has incorrect allowance\n      ' +
        'EXPECTED RESULT: 10 TRU\n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(acctTwoAllowance, 'ether'));

      // TEST CASE 11 - Test #4
      await expectFuzzFail(truToken.approve(fuzzGenOne, tenTru, { from: fuzzGenOne }));
      acctTwoAllowance = await truToken.allowance.call(acctOne, acctTwo);
      assert.equal(web3.fromWei(acctTwoAllowance, 'ether'),
        10,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 11: Pass #' + pass + ', Test #4\n      ' +
        'TEST DESCRIPTION: Account Two has incorrect allowance\n      ' +
        'EXPECTED RESULT: 10 TRU\n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(acctTwoAllowance, 'ether'));

      // TEST CASE 11 - Test #5
      await expectFuzzFail(truToken.approve(acctTwo, fuzzGenOne, { from: fuzzGenOne }));
      acctTwoAllowance = await truToken.allowance.call(acctOne, acctTwo);
      assert.equal(web3.fromWei(acctTwoAllowance, 'ether'),
        10,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 11: Pass #' + pass + ', Test #5\n      ' +
        'TEST DESCRIPTION: Account Two has incorrect allowance\n      ' +
        'EXPECTED RESULT: 10 TRU\n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(acctTwoAllowance, 'ether'));

      // TEST CASE 11 - Test #6
      await expectFuzzFail(truToken.approve(fuzzGenOne, fuzzGenOne, { from: acctOne }));
      acctTwoAllowance = await truToken.allowance.call(acctOne, acctTwo);
      assert.equal(web3.fromWei(acctTwoAllowance, 'ether'),
        10,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 11: Pass #' + pass + ', Test #6\n      ' +
        'TEST DESCRIPTION: Account Two has incorrect allowance\n      ' +
        'EXPECTED RESULT: 10 TRU\n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(acctTwoAllowance, 'ether'));

      // TEST CASE 11 - Test #7
      await expectFuzzFail(truToken.approve(fuzzGenOne, fuzzGenOne, { from: fuzzGenOne }));
      acctTwoAllowance = await truToken.allowance.call(acctOne, acctTwo);
      assert.equal(web3.fromWei(acctTwoAllowance, 'ether'),
        10,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 11: Pass #' + pass + ', Test #7\n      ' +
        'TEST DESCRIPTION: Account Two has incorrect allowance\n      ' +
        'EXPECTED RESULT: 10 TRU\n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(acctTwoAllowance, 'ether'));
    }

    // TEST CASE 11 - Post-Fuzz Test #1
    acctOneBal = await truToken.balanceOf.call(acctOne);
    assert.equal(web3.fromWei(acctOneBal, 'ether'),
      100,
      '\n      ' +
      'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 11: Post-Fuzz Test #1\n      ' +
      'TEST DESCRIPTION: Account One has wrong balance\n      ' +
      'EXPECTED RESULT: 100 TRU; \n      ' +
      'ACTUAL RESULT: ' + web3.fromWei(acctOneBal, 'ether'));

    // TEST CASE 11 - Post-Fuzz Test #2
    acctTwoAllowance = await truToken.allowance.call(acctOne, acctTwo);
    assert.equal(web3.fromWei(acctTwoAllowance, 'ether'),
      10,
      '\n      ' +
      'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 11: Post-Fuzz Test #2\n      ' +
      'TEST DESCRIPTION: Account Two has incorrect allowance\n      ' +
      'EXPECTED RESULT: 10 TRU\n      ' +
      'ACTUAL RESULT: ' + web3.fromWei(acctTwoAllowance, 'ether'));
  }).timeout(timeoutDuration);

  it('FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 12: Fuzz test of StandardToken increaseApproval with invalid arguments', async function() {
    var fuzzGenOne;

    // TEST CASE 12 - Pre-Fuzz Test #1
    let acctOneBal = await truToken.balanceOf.call(acctOne);

    assert.equal(web3.fromWei(acctOneBal, 'ether'),
      100,
      '\n      ' +
      'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 12: Pre-Fuzz Test #1\n      ' +
      'TEST DESCRIPTION: Account One has wrong balance\n      ' +
      'EXPECTED RESULT: 100 TRU; \n      ' +
      'ACTUAL RESULT: ' + web3.fromWei(acctOneBal, 'ether'));

    // TEST CASE 12 - Pre-Fuzz Test #2
    let acctTwoAllowance = await truToken.allowance.call(acctOne, acctTwo);
    assert.equal(web3.fromWei(acctTwoAllowance, 'ether'),
      10,
      '\n      ' +
      'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 12: Pre-Fuzz Test #2\n      ' +
      'TEST DESCRIPTION: Account Two has incorrect allowance\n      ' +
      'EXPECTED RESULT: 10 TRU\n      ' +
      'ACTUAL RESULT: ' + web3.fromWei(acctTwoAllowance, 'ether'));

    for (var i = loopStart; i < loopEnd; i++) {
      fuzzer.seed(i);
      let pass = i - loopStart + 1;
      fuzzGenOne = fuzzer.mutate.string(fuzzStrOne);

      // TEST CASE 12 - Test #1
      await expectFuzzFail(truToken.increaseApproval(acctTwo, 10, { from: fuzzGenOne }));
      acctTwoAllowance = await truToken.allowance.call(acctOne, acctTwo);
      assert.equal(web3.fromWei(acctTwoAllowance, 'ether'),
        10,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 12: Pass #' + pass + ', Test #1\n      ' +
        'TEST DESCRIPTION: Account Two has incorrect allowance\n      ' +
        'EXPECTED RESULT: 10 TRU\n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(acctTwoAllowance, 'ether'));

      // TEST CASE 12 - Test #2
      await expectFuzzFail(truToken.increaseApproval(fuzzGenOne, 10, { from: acctOne }));
      acctTwoAllowance = await truToken.allowance.call(acctOne, acctTwo);
      assert.equal(web3.fromWei(acctTwoAllowance, 'ether'),
        10,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 12: Pass #' + pass + ', Test #2\n      ' +
        'TEST DESCRIPTION: Account Two has incorrect allowance\n      ' +
        'EXPECTED RESULT: 10 TRU\n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(acctTwoAllowance, 'ether'));

      // TEST CASE 12 - Test #3
      await expectFuzzFail(truToken.increaseApproval(acctTwo, fuzzGenOne, { from: acctOne }));
      acctTwoAllowance = await truToken.allowance.call(acctOne, acctTwo);
      assert.equal(web3.fromWei(acctTwoAllowance, 'ether'),
        10,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 12: Pass #' + pass + ', Test #3\n      ' +
        'TEST DESCRIPTION: Account Two has incorrect allowance\n      ' +
        'EXPECTED RESULT: 10 TRU\n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(acctTwoAllowance, 'ether'));

      // TEST CASE 12 - Test #4
      await expectFuzzFail(truToken.increaseApproval(fuzzGenOne, fuzzGenOne, { from: acctOne }));
      acctTwoAllowance = await truToken.allowance.call(acctOne, acctTwo);
      assert.equal(web3.fromWei(acctTwoAllowance, 'ether'),
        10,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 12: Pass #' + pass + ', Test #4\n      ' +
        'TEST DESCRIPTION: Account Two has incorrect allowance\n      ' +
        'EXPECTED RESULT: 10 TRU\n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(acctTwoAllowance, 'ether'));

      // TEST CASE 12 - Test #5
      await expectFuzzFail(truToken.increaseApproval(fuzzGenOne, fuzzGenOne, { from: fuzzGenOne }));
      acctTwoAllowance = await truToken.allowance.call(acctOne, acctTwo);
      assert.equal(web3.fromWei(acctTwoAllowance, 'ether'),
        10,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 12: Pass #' + pass + ', Test #5\n      ' +
        'TEST DESCRIPTION: Account Two has incorrect allowance\n      ' +
        'EXPECTED RESULT: 10 TRU\n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(acctTwoAllowance, 'ether'));
    }

    // TEST CASE 12 - Post-Fuzz Test #1
    acctOneBal = await truToken.balanceOf.call(acctOne);
    assert.equal(web3.fromWei(acctOneBal, 'ether'),
      100,
      '\n      ' +
      'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 12: Post-Fuzz Test #1\n      ' +
      'TEST DESCRIPTION: Account One has wrong balance\n      ' +
      'EXPECTED RESULT: 100 TRU; \n      ' +
      'ACTUAL RESULT: ' + web3.fromWei(acctOneBal, 'ether'));

    // TEST CASE 12 - Post-Fuzz Test #2
    acctTwoAllowance = await truToken.allowance.call(acctOne, acctTwo);
    assert.equal(web3.fromWei(acctTwoAllowance, 'ether'),
      10,
      '\n      ' +
      'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 12: Post-Fuzz Test #2\n      ' +
      'TEST DESCRIPTION: Account Two has incorrect allowance\n      ' +
      'EXPECTED RESULT: 10 TRU\n      ' +
      'ACTUAL RESULT: ' + web3.fromWei(acctTwoAllowance, 'ether'));
  }).timeout(timeoutDuration);

  it('FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 13: Fuzz test of StandardToken decreaseApproval with invalid arguments', async function() {
    var fuzzGenOne;

    // TEST CASE 13 - Pre-Fuzz Test #1
    let acctOneBal = await truToken.balanceOf.call(acctOne);
    assert.equal(web3.fromWei(acctOneBal, 'ether'),
      100,
      '\n      ' +
      'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 13: Pre-Fuzz Test #1\n      ' +
      'TEST DESCRIPTION: Account One has wrong balance\n      ' +
      'EXPECTED RESULT: 100 TRU; \n      ' +
      'ACTUAL RESULT: ' + web3.fromWei(acctOneBal, 'ether'));

    // TEST CASE 13 - Pre-Fuzz Test #2
    let acctTwoAllowance = await truToken.allowance.call(acctOne, acctTwo);
    assert.equal(web3.fromWei(acctTwoAllowance, 'ether'),
      10,
      '\n      ' +
      'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 13: Pre-Fuzz Test #2\n      ' +
      'TEST DESCRIPTION: Account Two has incorrect allowance\n      ' +
      'EXPECTED RESULT: 10 TRU\n      ' +
      'ACTUAL RESULT: ' + web3.fromWei(acctTwoAllowance, 'ether'));

    for (var i = loopStart; i < loopEnd; i++) {
      fuzzer.seed(i);
      let pass = i - loopStart + 1;
      fuzzGenOne = fuzzer.mutate.string(fuzzStrOne);

      // TEST CASE 13 - Test #1
      await expectFuzzFail(truToken.decreaseApproval(acctTwo, 10, { from: fuzzGenOne }));
      acctTwoAllowance = await truToken.allowance.call(acctOne, acctTwo);
      assert.equal(web3.fromWei(acctTwoAllowance, 'ether'),
        10,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 13: Pass #' + pass + ', Test #1\n      ' +
        'TEST DESCRIPTION: Account Two has incorrect allowance\n      ' +
        'EXPECTED RESULT: 10 TRU\n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(acctTwoAllowance, 'ether'));

      // TEST CASE 13 - Test #2
      await expectFuzzFail(truToken.decreaseApproval(fuzzGenOne, 10, { from: acctOne }));
      acctTwoAllowance = await truToken.allowance.call(acctOne, acctTwo);
      assert.equal(web3.fromWei(acctTwoAllowance, 'ether'),
        10,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 13: Pass #' + pass + ', Test #2\n      ' +
        'TEST DESCRIPTION: Account Two has incorrect allowance\n      ' +
        'EXPECTED RESULT: 10 TRU\n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(acctTwoAllowance, 'ether'));

      // TEST CASE 13 - Test #3
      await expectFuzzFail(truToken.decreaseApproval(acctTwo, fuzzGenOne, { from: acctOne }));
      acctTwoAllowance = await truToken.allowance.call(acctOne, acctTwo);
      assert.equal(web3.fromWei(acctTwoAllowance, 'ether'),
        10,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 13: Pass #' + pass + ', Test #3\n      ' +
        'TEST DESCRIPTION: Account Two has incorrect allowance\n      ' +
        'EXPECTED RESULT: 10 TRU\n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(acctTwoAllowance, 'ether'));

      // TEST CASE 13 - Test #4
      await expectFuzzFail(truToken.decreaseApproval(fuzzGenOne, fuzzGenOne, { from: acctOne }));
      acctTwoAllowance = await truToken.allowance.call(acctOne, acctTwo);
      assert.equal(web3.fromWei(acctTwoAllowance, 'ether'),
        10,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 13: Pass #' + pass + ', Test #4\n      ' +
        'TEST DESCRIPTION: Account Two has incorrect allowance\n      ' +
        'EXPECTED RESULT: 10 TRU\n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(acctTwoAllowance, 'ether'));

      // TEST CASE 13 - Test #5
      await expectFuzzFail(truToken.decreaseApproval(fuzzGenOne, fuzzGenOne, { from: fuzzGenOne }));
      acctTwoAllowance = await truToken.allowance.call(acctOne, acctTwo);
      assert.equal(web3.fromWei(acctTwoAllowance, 'ether'),
        10,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 13: Pass #' + pass + ', Test #5\n      ' +
        'TEST DESCRIPTION: Account Two has incorrect allowance\n      ' +
        'EXPECTED RESULT: 10 TRU\n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(acctTwoAllowance, 'ether'));
    }

    // TEST CASE 13 - Post-Fuzz Test #1
    acctOneBal = await truToken.balanceOf.call(acctOne);
    assert.equal(web3.fromWei(acctOneBal, 'ether'),
      100,
      '\n      ' +
      'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 13: Post-Fuzz Test #1\n      ' +
      'TEST DESCRIPTION: Account One has wrong balance\n      ' +
      'EXPECTED RESULT: 100 TRU; \n      ' +
      'ACTUAL RESULT: ' + web3.fromWei(acctOneBal, 'ether'));

    // TEST CASE 13 - Post-Fuzz Test #2
    acctTwoAllowance = await truToken.allowance.call(acctOne, acctTwo);
    assert.equal(web3.fromWei(acctTwoAllowance, 'ether'),
      10,
      '\n      ' +
      'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 13: Post-Fuzz Test #2\n      ' +
      'TEST DESCRIPTION: Account Two has incorrect allowance\n      ' +
      'EXPECTED RESULT: 10 TRU\n      ' +
      'ACTUAL RESULT: ' + web3.fromWei(acctTwoAllowance, 'ether'));
  }).timeout(timeoutDuration);

  it('FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 14: Fuzz test of transferFrom of StandardToken with invalid arguments', async function() {
    var fuzzGenOne;

    await truToken.setReleaseAgent(acctOne, { from: acctOne });
    await truToken.releaseTokenTransfer();

    // TEST CASE 14 - Pre-Fuzz Test #1a
    let acctOneBal = await truToken.balanceOf.call(acctOne);
    assert.equal(web3.fromWei(acctOneBal, 'ether'),
      100,
      '\n      ' +
      'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 14: Pre-Fuzz Test #1a\n      ' +
      'TEST DESCRIPTION: Account One has wrong balance\n      ' +
      'EXPECTED RESULT: 100 TRU; \n      ' +
      'ACTUAL RESULT: ' + web3.fromWei(acctOneBal, 'ether'));

    // TEST CASE 14 - Pre-Fuzz Test #1b
    let acctTwoBal = await truToken.balanceOf.call(acctTwo, { from: acctTwo });
    assert.equal(web3.fromWei(acctTwoBal, 'ether'),
      0,
      '\n      ' +
      'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 14: Pre-Fuzz Test #1b\n      ' +
      'TEST DESCRIPTION: Account Two has wrong balance\n      ' +
      'EXPECTED RESULT: 0 TRU; \n      ' +
      'ACTUAL RESULT: ' + web3.fromWei(acctTwoBal, 'ether'));

    // TEST CASE 14 - Pre-Fuzz Test #1c
    let acctTwoAllowance = await truToken.allowance.call(acctOne, acctTwo);
    assert.equal(web3.fromWei(acctTwoAllowance, 'ether'),
      10,
      '\n      ' +
      'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 14: Pre-Fuzz Test #1c\n      ' +
      'TEST DESCRIPTION: Account Two has incorrect allowance\n      ' +
      'EXPECTED RESULT: 10 TRU\n      ' +
      'ACTUAL RESULT: ' + web3.fromWei(acctTwoAllowance, 'ether'));

    // TEST CASE 14 - Pre-Fuzz Test #1d
    let releasedStatus = await truToken.released.call();
    assert.isTrue(releasedStatus,
      '\n      ' +
      'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 14: Pre-Fuzz Test #1d\n      ' +
      'TEST DESCRIPTION: Token in incorrect release status\n      ' +
      'EXPECTED RESULT: true\n      ' +
      'ACTUAL RESULT: ' + releasedStatus);


    for (var i = loopStart; i < loopEnd; i++) {
      fuzzer.seed(i);
      let pass = i - loopStart + 1;
      fuzzGenOne = fuzzer.mutate.string(fuzzStrOne);

      // TEST CASE 14 - Test #1
      await expectFuzzFail(truToken.transferFrom(fuzzGenOne, acctTwo, oneTru, { from: acctTwo }));
      acctOneBal = await truToken.balanceOf.call(acctOne);
      assert.equal(web3.fromWei(acctOneBal, 'ether'),
        100,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 14: Pass #' + pass + ', Test #1a\n      ' +
        'TEST DESCRIPTION: Account One has wrong balance\n      ' +
        'EXPECTED RESULT: 100 TRU; \n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(acctOneBal, 'ether'));

      acctTwoBal = await truToken.balanceOf.call(acctTwo, { from: acctTwo });
      assert.equal(web3.fromWei(acctTwoBal, 'ether'),
        0,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 14: Pass #' + pass + ', Test #1b\n      ' +
        'TEST DESCRIPTION: Account Two has wrong balance\n      ' +
        'EXPECTED RESULT: 0 TRU; \n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(acctTwoBal, 'ether'));
      acctTwoAllowance = await truToken.allowance.call(acctOne, acctTwo);
      assert.equal(web3.fromWei(acctTwoAllowance, 'ether'),
        10,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 14: Pass #' + pass + ', Test #1c\n      ' +
        'TEST DESCRIPTION: Account Two has incorrect allowance\n      ' +
        'EXPECTED RESULT: 10 TRU\n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(acctTwoAllowance, 'ether'));
      releasedStatus = await truToken.released.call();
      assert.isTrue(releasedStatus,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 14: Pass #' + pass + ', Test #1d\n      ' +
        'TEST DESCRIPTION: Token in incorrect release status\n      ' +
        'EXPECTED RESULT: true\n      ' +
        'ACTUAL RESULT: ' + releasedStatus);

      // TEST CASE 14 - Test #2
      await expectFuzzFail(truToken.transferFrom(acctOne, fuzzGenOne, oneTru, { from: acctTwo }));
      acctOneBal = await truToken.balanceOf.call(acctOne);
      assert.equal(web3.fromWei(acctOneBal, 'ether'),
        100,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 14: Pass #' + pass + ', Test #2a\n      ' +
        'TEST DESCRIPTION: Account One has wrong balance\n      ' +
        'EXPECTED RESULT: 100 TRU; \n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(acctOneBal, 'ether'));

      acctTwoBal = await truToken.balanceOf.call(acctTwo, { from: acctTwo });
      assert.equal(web3.fromWei(acctTwoBal, 'ether'),
        0,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 14: Pass #' + pass + ', Test #2b\n      ' +
        'TEST DESCRIPTION: Account Two has wrong balance\n      ' +
        'EXPECTED RESULT: 0 TRU; \n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(acctTwoBal, 'ether'));
      acctTwoAllowance = await truToken.allowance.call(acctOne, acctTwo);
      assert.equal(web3.fromWei(acctTwoAllowance, 'ether'),
        10,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 14: Pass #' + pass + ', Test #2c\n      ' +
        'TEST DESCRIPTION: Account Two has incorrect allowance\n      ' +
        'EXPECTED RESULT: 10 TRU\n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(acctTwoAllowance, 'ether'));
      releasedStatus = await truToken.released.call();
      assert.isTrue(releasedStatus,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 14: Pass #' + pass + ', Test #2d\n      ' +
        'TEST DESCRIPTION: Token in incorrect release status\n      ' +
        'EXPECTED RESULT: true\n      ' +
        'ACTUAL RESULT: ' + releasedStatus);

      // TEST CASE 14 - Test #3
      await expectFuzzFail(truToken.transferFrom(acctOne, acctTwo, fuzzGenOne, { from: acctTwo }));
      acctOneBal = await truToken.balanceOf.call(acctOne);
      assert.equal(web3.fromWei(acctOneBal, 'ether'),
        100,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 14: Pass #' + pass + ', Test #3a\n      ' +
        'TEST DESCRIPTION: Account One has wrong balance\n      ' +
        'EXPECTED RESULT: 100 TRU; \n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(acctOneBal, 'ether'));

      acctTwoBal = await truToken.balanceOf.call(acctTwo, { from: acctTwo });
      assert.equal(web3.fromWei(acctTwoBal, 'ether'),
        0,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 14: Pass #' + pass + ', Test #3b\n      ' +
        'TEST DESCRIPTION: Account Two has wrong balance\n      ' +
        'EXPECTED RESULT: 0 TRU; \n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(acctTwoBal, 'ether'));
      acctTwoAllowance = await truToken.allowance.call(acctOne, acctTwo);
      assert.equal(web3.fromWei(acctTwoAllowance, 'ether'),
        10,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 14: Pass #' + pass + ', Test #3c\n      ' +
        'TEST DESCRIPTION: Account Two has incorrect allowance\n      ' +
        'EXPECTED RESULT: 10 TRU\n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(acctTwoAllowance, 'ether'));
      releasedStatus = await truToken.released.call();
      assert.isTrue(releasedStatus,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 14: Pass #' + pass + ', Test #3d\n      ' +
        'TEST DESCRIPTION: Token in incorrect release status\n      ' +
        'EXPECTED RESULT: true\n      ' +
        'ACTUAL RESULT: ' + releasedStatus);

      // TEST CASE 14 - Test #4
      await expectFuzzFail(truToken.transferFrom(acctOne, acctTwo, oneTru, { from: fuzzGenOne }));
      acctOneBal = await truToken.balanceOf.call(acctOne);
      assert.equal(web3.fromWei(acctOneBal, 'ether'),
        100,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 14: Pass #' + pass + ', Test #4a\n      ' +
        'TEST DESCRIPTION: Account One has wrong balance\n      ' +
        'EXPECTED RESULT: 100 TRU; \n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(acctOneBal, 'ether'));

      acctTwoBal = await truToken.balanceOf.call(acctTwo, { from: acctTwo });
      assert.equal(web3.fromWei(acctTwoBal, 'ether'),
        0,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 14: Pass #' + pass + ', Test #4b\n      ' +
        'TEST DESCRIPTION: Account Two has wrong balance\n      ' +
        'EXPECTED RESULT: 0 TRU; \n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(acctTwoBal, 'ether'));
      acctTwoAllowance = await truToken.allowance.call(acctOne, acctTwo);
      assert.equal(web3.fromWei(acctTwoAllowance, 'ether'),
        10,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 14: Pass #' + pass + ', Test #4c\n      ' +
        'TEST DESCRIPTION: Account Two has incorrect allowance\n      ' +
        'EXPECTED RESULT: 10 TRU\n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(acctTwoAllowance, 'ether'));
      releasedStatus = await truToken.released.call();
      assert.isTrue(releasedStatus,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 14: Pass #' + pass + ', Test #4d\n      ' +
        'TEST DESCRIPTION: Token in incorrect release status\n      ' +
        'EXPECTED RESULT: true\n      ' +
        'ACTUAL RESULT: ' + releasedStatus);

      // TEST CASE 14 - Test #5
      await expectFuzzFail(truToken.transferFrom(fuzzGenOne, fuzzGenOne, oneTru, { from: acctTwo }));
      acctOneBal = await truToken.balanceOf.call(acctOne);
      assert.equal(web3.fromWei(acctOneBal, 'ether'),
        100,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 14: Pass #' + pass + ', Test #5a\n      ' +
        'TEST DESCRIPTION: Account One has wrong balance\n      ' +
        'EXPECTED RESULT: 100 TRU; \n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(acctOneBal, 'ether'));

      acctTwoBal = await truToken.balanceOf.call(acctTwo, { from: acctTwo });
      assert.equal(web3.fromWei(acctTwoBal, 'ether'),
        0,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 14: Pass #' + pass + ', Test #5b\n      ' +
        'TEST DESCRIPTION: Account Two has wrong balance\n      ' +
        'EXPECTED RESULT: 0 TRU; \n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(acctTwoBal, 'ether'));
      acctTwoAllowance = await truToken.allowance.call(acctOne, acctTwo);
      assert.equal(web3.fromWei(acctTwoAllowance, 'ether'),
        10,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 14: Pass #' + pass + ', Test #5c\n      ' +
        'TEST DESCRIPTION: Account Two has incorrect allowance\n      ' +
        'EXPECTED RESULT: 10 TRU\n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(acctTwoAllowance, 'ether'));
      releasedStatus = await truToken.released.call();
      assert.isTrue(releasedStatus,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 14: Pass #' + pass + ', Test #5d\n      ' +
        'TEST DESCRIPTION: Token in incorrect release status\n      ' +
        'EXPECTED RESULT: true\n      ' +
        'ACTUAL RESULT: ' + releasedStatus);

      // TEST CASE 14 - Test #6
      await expectFuzzFail(truToken.transferFrom(acctOne, fuzzGenOne, fuzzGenOne, { from: acctTwo }));
      acctOneBal = await truToken.balanceOf.call(acctOne);
      assert.equal(web3.fromWei(acctOneBal, 'ether'),
        100,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 14: Pass #' + pass + ', Test #6a\n      ' +
        'TEST DESCRIPTION: Account One has wrong balance\n      ' +
        'EXPECTED RESULT: 100 TRU; \n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(acctOneBal, 'ether'));

      acctTwoBal = await truToken.balanceOf.call(acctTwo, { from: acctTwo });
      assert.equal(web3.fromWei(acctTwoBal, 'ether'),
        0,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 14: Pass #' + pass + ', Test #6b\n      ' +
        'TEST DESCRIPTION: Account Two has wrong balance\n      ' +
        'EXPECTED RESULT: 0 TRU; \n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(acctTwoBal, 'ether'));
      acctTwoAllowance = await truToken.allowance.call(acctOne, acctTwo);
      assert.equal(web3.fromWei(acctTwoAllowance, 'ether'),
        10,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 14: Pass #' + pass + ', Test #6c\n      ' +
        'TEST DESCRIPTION: Account Two has incorrect allowance\n      ' +
        'EXPECTED RESULT: 10 TRU\n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(acctTwoAllowance, 'ether'));
      releasedStatus = await truToken.released.call();
      assert.isTrue(releasedStatus,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 14: Pass #' + pass + ', Test #6d\n      ' +
        'TEST DESCRIPTION: Token in incorrect release status\n      ' +
        'EXPECTED RESULT: true\n      ' +
        'ACTUAL RESULT: ' + releasedStatus);

      // TEST CASE 14 - Test #7
      await expectFuzzFail(truToken.transferFrom(acctOne, acctTwo, fuzzGenOne, { from: fuzzGenOne }));
      acctOneBal = await truToken.balanceOf.call(acctOne);
      assert.equal(web3.fromWei(acctOneBal, 'ether'),
        100,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 14: Pass #' + pass + ', Test #7a\n      ' +
        'TEST DESCRIPTION: Account One has wrong balance\n      ' +
        'EXPECTED RESULT: 100 TRU; \n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(acctOneBal, 'ether'));

      acctTwoBal = await truToken.balanceOf.call(acctTwo, { from: acctTwo });
      assert.equal(web3.fromWei(acctTwoBal, 'ether'),
        0,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 14: Pass #' + pass + ', Test #7b\n      ' +
        'TEST DESCRIPTION: Account Two has wrong balance\n      ' +
        'EXPECTED RESULT: 0 TRU; \n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(acctTwoBal, 'ether'));
      acctTwoAllowance = await truToken.allowance.call(acctOne, acctTwo);
      assert.equal(web3.fromWei(acctTwoAllowance, 'ether'),
        10,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 14: Pass #' + pass + ', Test #7c\n      ' +
        'TEST DESCRIPTION: Account Two has incorrect allowance\n      ' +
        'EXPECTED RESULT: 10 TRU\n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(acctTwoAllowance, 'ether'));
      releasedStatus = await truToken.released.call();
      assert.isTrue(releasedStatus,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 14: Pass #' + pass + ', Test #7d\n      ' +
        'TEST DESCRIPTION: Token in incorrect release status\n      ' +
        'EXPECTED RESULT: true\n      ' +
        'ACTUAL RESULT: ' + releasedStatus);

      // TEST CASE 14 - Test #8
      await expectFuzzFail(truToken.transferFrom(fuzzGenOne, acctTwo, fuzzGenOne, { from: acctTwo }));
      acctOneBal = await truToken.balanceOf.call(acctOne);
      assert.equal(web3.fromWei(acctOneBal, 'ether'),
        100,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 14: Pass #' + pass + ', Test #8a\n      ' +
        'TEST DESCRIPTION: Account One has wrong balance\n      ' +
        'EXPECTED RESULT: 100 TRU; \n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(acctOneBal, 'ether'));

      acctTwoBal = await truToken.balanceOf.call(acctTwo, { from: acctTwo });
      assert.equal(web3.fromWei(acctTwoBal, 'ether'),
        0,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 14: Pass #' + pass + ', Test #8b\n      ' +
        'TEST DESCRIPTION: Account Two has wrong balance\n      ' +
        'EXPECTED RESULT: 0 TRU; \n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(acctTwoBal, 'ether'));
      acctTwoAllowance = await truToken.allowance.call(acctOne, acctTwo);
      assert.equal(web3.fromWei(acctTwoAllowance, 'ether'),
        10,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 14: Pass #' + pass + ', Test #8c\n      ' +
        'TEST DESCRIPTION: Account Two has incorrect allowance\n      ' +
        'EXPECTED RESULT: 10 TRU\n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(acctTwoAllowance, 'ether'));
      releasedStatus = await truToken.released.call();
      assert.isTrue(releasedStatus,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 14: Pass #' + pass + ', Test #8d\n      ' +
        'TEST DESCRIPTION: Token in incorrect release status\n      ' +
        'EXPECTED RESULT: true\n      ' +
        'ACTUAL RESULT: ' + releasedStatus);

      // TEST CASE 14 - Test #9
      await expectFuzzFail(truToken.transferFrom(fuzzGenOne, acctTwo, oneTru, { from: fuzzGenOne }));
      acctOneBal = await truToken.balanceOf.call(acctOne);
      assert.equal(web3.fromWei(acctOneBal, 'ether'),
        100,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 14: Pass #' + pass + ', Test #9a\n      ' +
        'TEST DESCRIPTION: Account One has wrong balance\n      ' +
        'EXPECTED RESULT: 100 TRU; \n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(acctOneBal, 'ether'));

      acctTwoBal = await truToken.balanceOf.call(acctTwo, { from: acctTwo });
      assert.equal(web3.fromWei(acctTwoBal, 'ether'),
        0,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 14: Pass #' + pass + ', Test #9b\n      ' +
        'TEST DESCRIPTION: Account Two has wrong balance\n      ' +
        'EXPECTED RESULT: 0 TRU; \n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(acctTwoBal, 'ether'));
      acctTwoAllowance = await truToken.allowance.call(acctOne, acctTwo);
      assert.equal(web3.fromWei(acctTwoAllowance, 'ether'),
        10,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 14: Pass #' + pass + ', Test #9c\n      ' +
        'TEST DESCRIPTION: Account Two has incorrect allowance\n      ' +
        'EXPECTED RESULT: 10 TRU\n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(acctTwoAllowance, 'ether'));
      releasedStatus = await truToken.released.call();
      assert.isTrue(releasedStatus,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 14: Pass #' + pass + ', Test #9d\n      ' +
        'TEST DESCRIPTION: Token in incorrect release status\n      ' +
        'EXPECTED RESULT: true\n      ' +
        'ACTUAL RESULT: ' + releasedStatus);

      // TEST CASE 14 - Test #10
      await expectFuzzFail(truToken.transferFrom(acctOne, fuzzGenOne, oneTru, { from: fuzzGenOne }));
      acctOneBal = await truToken.balanceOf.call(acctOne);
      assert.equal(web3.fromWei(acctOneBal, 'ether'),
        100,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 14: Pass #' + pass + ', Test #10a\n      ' +
        'TEST DESCRIPTION: Account One has wrong balance\n      ' +
        'EXPECTED RESULT: 100 TRU; \n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(acctOneBal, 'ether'));

      acctTwoBal = await truToken.balanceOf.call(acctTwo, { from: acctTwo });
      assert.equal(web3.fromWei(acctTwoBal, 'ether'),
        0,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 14: Pass #' + pass + ', Test #10b\n      ' +
        'TEST DESCRIPTION: Account Two has wrong balance\n      ' +
        'EXPECTED RESULT: 0 TRU; \n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(acctTwoBal, 'ether'));
      acctTwoAllowance = await truToken.allowance.call(acctOne, acctTwo);
      assert.equal(web3.fromWei(acctTwoAllowance, 'ether'),
        10,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 14: Pass #' + pass + ', Test #10c\n      ' +
        'TEST DESCRIPTION: Account Two has incorrect allowance\n      ' +
        'EXPECTED RESULT: 10 TRU\n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(acctTwoAllowance, 'ether'));
      releasedStatus = await truToken.released.call();
      assert.isTrue(releasedStatus,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 14: Pass #' + pass + ', Test #10d\n      ' +
        'TEST DESCRIPTION: Token in incorrect release status\n      ' +
        'EXPECTED RESULT: true\n      ' +
        'ACTUAL RESULT: ' + releasedStatus);

      // TEST CASE 14 - Test #11
      await expectFuzzFail(truToken.transferFrom(fuzzGenOne, fuzzGenOne, oneTru, { from: fuzzGenOne }));
      acctOneBal = await truToken.balanceOf.call(acctOne);
      assert.equal(web3.fromWei(acctOneBal, 'ether'),
        100,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 14: Pass #' + pass + ', Test #11a\n      ' +
        'TEST DESCRIPTION: Account One has wrong balance\n      ' +
        'EXPECTED RESULT: 100 TRU; \n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(acctOneBal, 'ether'));

      acctTwoBal = await truToken.balanceOf.call(acctTwo, { from: acctTwo });
      assert.equal(web3.fromWei(acctTwoBal, 'ether'),
        0,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 14: Pass #' + pass + ', Test #11b\n      ' +
        'TEST DESCRIPTION: Account Two has wrong balance\n      ' +
        'EXPECTED RESULT: 0 TRU; \n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(acctTwoBal, 'ether'));
      acctTwoAllowance = await truToken.allowance.call(acctOne, acctTwo);
      assert.equal(web3.fromWei(acctTwoAllowance, 'ether'),
        10,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 14: Pass #' + pass + ', Test #11c\n      ' +
        'TEST DESCRIPTION: Account Two has incorrect allowance\n      ' +
        'EXPECTED RESULT: 10 TRU\n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(acctTwoAllowance, 'ether'));
      releasedStatus = await truToken.released.call();
      assert.isTrue(releasedStatus,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 14: Pass #' + pass + ', Test #11d\n      ' +
        'TEST DESCRIPTION: Token in incorrect release status\n      ' +
        'EXPECTED RESULT: true\n      ' +
        'ACTUAL RESULT: ' + releasedStatus);

      // TEST CASE 14 - Test #12
      await expectFuzzFail(truToken.transferFrom(acctOne, fuzzGenOne, fuzzGenOne, { from: fuzzGenOne }));
      acctOneBal = await truToken.balanceOf.call(acctOne);
      assert.equal(web3.fromWei(acctOneBal, 'ether'),
        100,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 14: Pass #' + pass + ', Test #12a\n      ' +
        'TEST DESCRIPTION: Account One has wrong balance\n      ' +
        'EXPECTED RESULT: 100 TRU; \n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(acctOneBal, 'ether'));

      acctTwoBal = await truToken.balanceOf.call(acctTwo, { from: acctTwo });
      assert.equal(web3.fromWei(acctTwoBal, 'ether'),
        0,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 14: Pass #' + pass + ', Test #12b\n      ' +
        'TEST DESCRIPTION: Account Two has wrong balance\n      ' +
        'EXPECTED RESULT: 0 TRU; \n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(acctTwoBal, 'ether'));
      acctTwoAllowance = await truToken.allowance.call(acctOne, acctTwo);
      assert.equal(web3.fromWei(acctTwoAllowance, 'ether'),
        10,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 14: Pass #' + pass + ', Test #12c\n      ' +
        'TEST DESCRIPTION: Account Two has incorrect allowance\n      ' +
        'EXPECTED RESULT: 10 TRU\n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(acctTwoAllowance, 'ether'));
      releasedStatus = await truToken.released.call();
      assert.isTrue(releasedStatus,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 14: Pass #' + pass + ', Test #12d\n      ' +
        'TEST DESCRIPTION: Token in incorrect release status\n      ' +
        'EXPECTED RESULT: true\n      ' +
        'ACTUAL RESULT: ' + releasedStatus);
    }

    // TEST CASE 14 - Post-Fuzz Test #1a
    acctOneBal = await truToken.balanceOf.call(acctOne);
    assert.equal(web3.fromWei(acctOneBal, 'ether'),
      100,
      '\n      ' +
      'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 14: Post-Fuzz Test #1a\n      ' +
      'TEST DESCRIPTION: Account One has wrong balance\n      ' +
      'EXPECTED RESULT: 100 TRU; \n      ' +
      'ACTUAL RESULT: ' + web3.fromWei(acctOneBal, 'ether'));

    // TEST CASE 14 - Post-Fuzz Test #1b
    acctTwoBal = await truToken.balanceOf.call(acctTwo, { from: acctTwo });
    assert.equal(web3.fromWei(acctTwoBal, 'ether'),
      0,
      '\n      ' +
      'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 14: Post-Fuzz Test #1b\n      ' +
      'TEST DESCRIPTION: Account Two has wrong balance\n      ' +
      'EXPECTED RESULT: 0 TRU; \n      ' +
      'ACTUAL RESULT: ' + web3.fromWei(acctTwoBal, 'ether'));

    // TEST CASE 14 - Post-Fuzz Test #1c
    acctTwoAllowance = await truToken.allowance.call(acctOne, acctTwo);
    assert.equal(web3.fromWei(acctTwoAllowance, 'ether'),
      10,
      '\n      ' +
      'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 14: Post-Fuzz Test #1c\n      ' +
      'TEST DESCRIPTION: Account Two has incorrect allowance\n      ' +
      'EXPECTED RESULT: 10 TRU\n      ' +
      'ACTUAL RESULT: ' + web3.fromWei(acctTwoAllowance, 'ether'));

    // TEST CASE 14 - Post-Fuzz Test #1d
    releasedStatus = await truToken.released.call();
    assert.isTrue(releasedStatus,
      '\n      ' +
      'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 14: Post-Fuzz Test #1d\n      ' +
      'TEST DESCRIPTION: Token in incorrect release status\n      ' +
      'EXPECTED RESULT: true\n      ' +
      'ACTUAL RESULT: ' + releasedStatus);
  }).timeout(timeoutDuration);

  it('FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 15: Fuzz test of BasicToken balanceOf with invalid arguments', async function() {
    var fuzzGenOne;

    for (var i = loopStart; i < loopEnd; i++) {
      fuzzer.seed(i);
      let pass = i - loopStart + 1;
      fuzzGenOne = fuzzer.mutate.string(fuzzStrOne);

      await expectFuzzFail(truToken.balanceOf.call(fuzzGenOne))
    }
  }).timeout(timeoutDuration);

  it('FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 16: Fuzz test of transferOwnership of Ownable with invalid arguments', async function() {
    var fuzzGenOne,
      tokenOwner = await truToken.owner.call();

    // TEST CASE 16 - Pre-Fuzz Test #1
    assert.equal(tokenOwner,
      acctOne,
      '\n      ' +
      'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 16: Pre-Fuzz Test #1\n      ' +
      'TEST DESCRIPTION: Tru Token has the wrong owner\n      ' +
      'EXPECTED RESULT: ' + acctOne + '; \n      ' +
      'ACTUAL RESULT: ' + tokenOwner);

    for (var i = loopStart; i < loopEnd; i++) {
      fuzzer.seed(i);
      let pass = i - loopStart + 1;
      fuzzGenOne = fuzzer.mutate.string(fuzzStrOne);

      // TEST CASE 16 - Test #1
      await expectFuzzFail(truToken.transferOwnership(fuzzGenOne, { from: acctOne }))
      tokenOwner = await truToken.owner.call();
      assert.equal(tokenOwner,
        acctOne,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 16: Pass #' + pass + ', Test #1\n      ' +
        'TEST DESCRIPTION: Tru Token has the wrong owner\n      ' +
        'EXPECTED RESULT: ' + acctOne + '; \n      ' +
        'ACTUAL RESULT: ' + tokenOwner);

      // TEST CASE 16 - Test #2
      await expectFuzzFail(truToken.transferOwnership(fuzzGenOne, { from: acctTwo }));
      tokenOwner = await truToken.owner.call();
      assert.equal(tokenOwner,
        acctOne,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 16: Pass #' + pass + ', Test #2\n      ' +
        'TEST DESCRIPTION: Tru Token has the wrong owner\n      ' +
        'EXPECTED RESULT: ' + acctOne + '; \n      ' +
        'ACTUAL RESULT: ' + tokenOwner);
    }

    // TEST CASE 16 - Post-Fuzz Test #1
    tokenOwner = await truToken.owner.call();
    assert.equal(tokenOwner,
      acctOne,
      '\n      ' +
      'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 16: Post-Fuzz Test #1\n      ' +
      'TEST DESCRIPTION: Tru Token has the wrong owner\n      ' +
      'EXPECTED RESULT: ' + acctOne + '; \n      ' +
      'ACTUAL RESULT: ' + tokenOwner);
  }).timeout(timeoutDuration);

  it('FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 17: Fuzz test of UpgradeableToken setUpgradeAgent with invalid arguments', async function() {
    var fuzzGenOne;
    tempToken = await TruReputationToken.new({ from: acctOne });
    await tempToken.mint(maximumTru, acctOne, { from: acctOne })
    await tempToken.setTransferAgent(acctOne, true, { from: acctOne });
    await tempToken.finishMinting(true, false, { from: acctOne });
    await tempToken.finishMinting(false, true, { from: acctOne });
    await tempToken.setReleaseAgent(acctOne, { from: acctOne });
    await tempToken.releaseTokenTransfer();

    upgradeToken = await MockMigrationTarget.new(tempToken.address);

    // TEST CASE 17 - Pre-Fuzz Test #1
    let newSupply = await upgradeToken.originalSupply.call();
    let oldSupply = await tempToken.totalSupply.call();
    assert.isTrue(newSupply.equals(oldSupply),
      '\n      ' +
      'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 17: Pre-Fuzz Test #1\n      ' +
      'TEST DESCRIPTION: Old Token and New Token supply do not match\n      ' +
      'EXPECTED RESULT: ' + web3.fromWei(oldSupply, 'ether') + '; \n      ' +
      'ACTUAL RESULT: ' + web3.fromWei(newSupply, 'ether'));

    // TEST CASE 17 - Pre-Fuzz Test #2
    let isUpgradeAgent = await upgradeToken.isUpgradeAgent.call();
    assert.isTrue(isUpgradeAgent,
      '\n      ' +
      'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 17: Pre-Fuzz Test #2\n      ' +
      'TEST DESCRIPTION: New Token is not upgradeAgent\n      ' +
      'EXPECTED RESULT: ' + web3.fromWei(oldSupply, 'ether') + '; \n      ' +
      'ACTUAL RESULT: ' + web3.fromWei(newSupply, 'ether'));

    for (var i = loopStart; i < loopEnd; i++) {
      fuzzer.seed(i);
      let pass = i - loopStart + 1;
      fuzzGenOne = fuzzer.mutate.string(fuzzStrOne);

      // TEST CASE 17 - Test #1
      await expectFuzzFail(tempToken.setUpgradeAgent(fuzzGenOne, { from: fuzzGenOne }));
      newSupply = await upgradeToken.originalSupply.call();
      oldSupply = await tempToken.totalSupply.call();
      assert.isTrue(newSupply.equals(oldSupply),
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 17: Pass #' + pass + ', Test #1a\n      ' +
        'TEST DESCRIPTION: Old Token and New Token supply do not match\n      ' +
        'EXPECTED RESULT: ' + web3.fromWei(oldSupply, 'ether') + '; \n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(newSupply, 'ether'));
      isUpgradeAgent = await upgradeToken.isUpgradeAgent.call();
      assert.isTrue(isUpgradeAgent,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 17: Pass #' + pass + ', Test #1b\n      ' +
        'TEST DESCRIPTION: New Token is not upgradeAgent\n      ' +
        'EXPECTED RESULT: ' + web3.fromWei(oldSupply, 'ether') + '; \n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(newSupply, 'ether'));

      // TEST CASE 17 - Test #2
      await expectFuzzFail(tempToken.setUpgradeAgent(fuzzGenOne, { from: acctOne }));
      newSupply = await upgradeToken.originalSupply.call();
      oldSupply = await tempToken.totalSupply.call();
      assert.isTrue(newSupply.equals(oldSupply),
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 17: Pass #' + pass + ', Test #2a\n      ' +
        'TEST DESCRIPTION: Old Token and New Token supply do not match\n      ' +
        'EXPECTED RESULT: ' + web3.fromWei(oldSupply, 'ether') + '; \n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(newSupply, 'ether'));
      isUpgradeAgent = await upgradeToken.isUpgradeAgent.call();
      assert.isTrue(isUpgradeAgent,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 17: Pass #' + pass + ', Test #2b\n      ' +
        'TEST DESCRIPTION: New Token is not upgradeAgent\n      ' +
        'EXPECTED RESULT: ' + web3.fromWei(oldSupply, 'ether') + '; \n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(newSupply, 'ether'));

      // TEST CASE 17 - Test #3
      await expectFuzzFail(tempToken.setUpgradeAgent(acctOne, { from: fuzzGenOne }));
      newSupply = await upgradeToken.originalSupply.call();
      oldSupply = await tempToken.totalSupply.call();
      assert.isTrue(newSupply.equals(oldSupply),
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 17: Pass #' + pass + ', Test #3a\n      ' +
        'TEST DESCRIPTION: Old Token and New Token supply do not match\n      ' +
        'EXPECTED RESULT: ' + web3.fromWei(oldSupply, 'ether') + '; \n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(newSupply, 'ether'));
      isUpgradeAgent = await upgradeToken.isUpgradeAgent.call();
      assert.isTrue(isUpgradeAgent,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 17: Pass #' + pass + ', Test #3b\n      ' +
        'TEST DESCRIPTION: New Token is not upgradeAgent\n      ' +
        'EXPECTED RESULT: ' + web3.fromWei(oldSupply, 'ether') + '; \n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(newSupply, 'ether'));
    }

    // TEST CASE 17 - Post-Fuzz Test #1
    newSupply = await upgradeToken.originalSupply.call();
    oldSupply = await tempToken.totalSupply.call();
    assert.isTrue(newSupply.equals(oldSupply),
      '\n      ' +
      'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 17: Post-Fuzz Test #1\n      ' +
      'TEST DESCRIPTION: Old Token and New Token supply do not match\n      ' +
      'EXPECTED RESULT: ' + web3.fromWei(oldSupply, 'ether') + '; \n      ' +
      'ACTUAL RESULT: ' + web3.fromWei(newSupply, 'ether'));

    // TEST CASE 17 - Post-Fuzz Test #2
    isUpgradeAgent = await upgradeToken.isUpgradeAgent.call();
    assert.isTrue(isUpgradeAgent,
      '\n      ' +
      'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 17: Post-Fuzz Test #2\n      ' +
      'TEST DESCRIPTION: New Token is not upgradeAgent\n      ' +
      'EXPECTED RESULT: ' + web3.fromWei(oldSupply, 'ether') + '; \n      ' +
      'ACTUAL RESULT: ' + web3.fromWei(newSupply, 'ether'));
  }).timeout(timeoutDuration);

  it('FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 18: Fuzz test of UpgradeableToken setUpgradeMaster with invalid arguments', async function() {
    var fuzzGenOne;

    // TEST CASE 18 - Pre-Fuzz Test #1
    let upgradeMaster = await tempToken.upgradeMaster.call();
    assert.equal(upgradeMaster,
      acctOne,
      '\n      ' +
      'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 18: Pre-Fuzz Test #1\n      ' +
      'TEST DESCRIPTION: Upgrade Master is not Account One\n      ' +
      'EXPECTED RESULT: ' + acctOne + '\n      ' +
      'ACTUAL RESULT: ' + upgradeMaster);

    for (var i = loopStart; i < loopEnd; i++) {
      fuzzer.seed(i);
      let pass = i - loopStart + 1;
      fuzzGenOne = fuzzer.mutate.string(fuzzStrOne);

      // TEST CASE 18 - Test #1
      await expectFuzzFail(tempToken.setUpgradeMaster(fuzzGenOne, { from: acctOne }));
      upgradeMaster = await tempToken.upgradeMaster.call();
      assert.equal(upgradeMaster,
        acctOne,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 18: Pass #' + pass + ', Test #1\n      ' +
        'TEST DESCRIPTION: Upgrade Master is not Account One\n      ' +
        'EXPECTED RESULT: ' + acctOne + '\n      ' +
        'ACTUAL RESULT: ' + upgradeMaster);

      // TEST CASE 18 - Test #2
      await expectFuzzFail(tempToken.setUpgradeMaster(acctOne, { from: fuzzGenOne }));
      upgradeMaster = await tempToken.upgradeMaster.call();
      assert.equal(upgradeMaster,
        acctOne,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 18: Pass #' + pass + ', Test #2\n      ' +
        'TEST DESCRIPTION: Upgrade Master is not Account One\n      ' +
        'EXPECTED RESULT: ' + acctOne + '\n      ' +
        'ACTUAL RESULT: ' + upgradeMaster);

      // TEST CASE 18 - Test #3
      await expectFuzzFail(tempToken.setUpgradeMaster(fuzzGenOne, { from: fuzzGenOne }));
      upgradeMaster = await tempToken.upgradeMaster.call();
      assert.equal(upgradeMaster,
        acctOne,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 18: Pass #' + pass + ', Test #3\n      ' +
        'TEST DESCRIPTION: Upgrade Master is not Account One\n      ' +
        'EXPECTED RESULT: ' + acctOne + '\n      ' +
        'ACTUAL RESULT: ' + upgradeMaster);
    }

    // TEST CASE 18 - Post-Fuzz Test #1
    upgradeMaster = await tempToken.upgradeMaster.call();
    assert.equal(upgradeMaster,
      acctOne,
      '\n      ' +
      'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 18: Post-Fuzz Test #1\n      ' +
      'TEST DESCRIPTION: Upgrade Master is not Account One\n      ' +
      'EXPECTED RESULT: ' + acctOne + '\n      ' +
      'ACTUAL RESULT: ' + upgradeMaster);
  }).timeout(timeoutDuration);

  it('FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 19: Fuzz test of UpgradeableToken upgrade with invalid arguments', async function() {
    var fuzzGenOne, upgradedTokens;

    // TEST CASE 19 - Pre-Fuzz Test #1
    upgradedTokens = await tempToken.totalUpgraded.call();
    assert.equal(upgradedTokens, 0,
      '\n      ' +
      'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 19: Pre-Fuzz Test #1\n      ' +
      'TEST DESCRIPTION: Incorrect upgraded Amount\n      ' +
      'EXPECTED RESULT: 0 TRU ; \n      ' +
      'ACTUAL RESULT: ' + web3.fromWei(upgradedTokens, 'ether') + ' TRU');

    for (var i = loopStart; i < loopEnd; i++) {
      fuzzer.seed(i);
      let pass = i - loopStart + 1;
      fuzzGenOne = fuzzer.mutate.string(fuzzStrOne);

      // TEST CASE 19 - Test #1
      await expectFuzzFail(tempToken.upgrade(fuzzGenOne, { from: acctOne }));
      upgradedTokens = await upgradeToken.totalUpgraded.call();
      assert.equal(upgradedTokens, 0,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 19: Pass #' + pass + ', Test #1\n      ' +
        'TEST DESCRIPTION: Incorrect upgraded Amount\n      ' +
        'EXPECTED RESULT: 0 TRU ; \n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(upgradedTokens, 'ether') + ' TRU');

      // TEST CASE 19 - Test #2
      await expectFuzzFail(tempToken.upgrade(maximumTru, { from: fuzzGenOne }));
      upgradedTokens = await upgradeToken.totalUpgraded.call();
      assert.equal(upgradedTokens, 0,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 19: Pass #' + pass + ', Test #2\n      ' +
        'TEST DESCRIPTION: Incorrect upgraded Amount\n      ' +
        'EXPECTED RESULT: 0 TRU ; \n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(upgradedTokens, 'ether') + ' TRU');

      // TEST CASE 19 - Test #3
      await expectFuzzFail(tempToken.upgrade(fuzzGenOne, { from: fuzzGenOne }));
      upgradedTokens = await upgradeToken.totalUpgraded.call();
      assert.equal(upgradedTokens, 0,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 19: Pass #' + pass + ', Test #3\n      ' +
        'TEST DESCRIPTION: Incorrect upgraded Amount\n      ' +
        'EXPECTED RESULT: 0 TRU ; \n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(upgradedTokens, 'ether') + ' TRU');
    }

    // TEST CASE 19 - Post-Fuzz Test #1
    upgradedTokens = await tempToken.totalUpgraded.call();
    assert.equal(upgradedTokens, 0,
      '\n      ' +
      'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 19: Post-Fuzz Test #1\n      ' +
      'TEST DESCRIPTION: Incorrect upgraded Amount\n      ' +
      'EXPECTED RESULT: 0 TRU ; \n      ' +
      'ACTUAL RESULT: ' + web3.fromWei(upgradedTokens, 'ether') + ' TRU');
  }).timeout(timeoutDuration);

  it('FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 20: Fuzz test of UpgradeableToken upgradeFrom with invalid arguments', async function() {
    var fuzzGenOne, upgradedTokens;

    // TEST CASE 20 - Pre-Fuzz Test #1
    upgradedTokens = await tempToken.totalUpgraded.call();
    assert.equal(upgradedTokens,
      0,
      '\n      ' +
      'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 20: Pre-Fuzz Test #1\n      ' +
      'TEST DESCRIPTION: Incorrect upgraded Amount\n      ' +
      'EXPECTED RESULT: 0 TRU ; \n      ' +
      'ACTUAL RESULT: ' + web3.fromWei(upgradedTokens, 'ether') + ' TRU');

    for (var i = loopStart; i < loopEnd; i++) {
      fuzzer.seed(i);
      let pass = i - loopStart + 1;
      fuzzGenOne = fuzzer.mutate.string(fuzzStrOne);

      // TEST CASE 20 - Test #1
      await expectFuzzFail(upgradeToken.upgradeFrom(acctOne, fuzzGenOne, { from: acctTwo }));
      upgradedTokens = await tempToken.totalUpgraded.call();
      assert.equal(upgradedTokens,
        0,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 20: Pass #' + pass + ', Test #1\n      ' +
        'TEST DESCRIPTION: Incorrect upgraded Amount\n      ' +
        'EXPECTED RESULT: 0 TRU ; \n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(upgradedTokens, 'ether') + ' TRU');

      // TEST CASE 20 - Test #2
      await expectFuzzFail(upgradeToken.upgradeFrom(fuzzGenOne, maximumTru, { from: acctTwo }));
      upgradedTokens = await tempToken.totalUpgraded.call();
      assert.equal(upgradedTokens,
        0,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 20: Pass #' + pass + ', Test #2\n      ' +
        'TEST DESCRIPTION: Incorrect upgraded Amount\n      ' +
        'EXPECTED RESULT: 0 TRU ; \n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(upgradedTokens, 'ether') + ' TRU');

      // TEST CASE 20 - Test #3
      await expectFuzzFail(upgradeToken.upgradeFrom(acctOne, maximumTru, { from: fuzzGenOne }));
      upgradedTokens = await tempToken.totalUpgraded.call();
      assert.equal(upgradedTokens,
        0,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 20: Pass #' + pass + ', Test #3\n      ' +
        'TEST DESCRIPTION: Incorrect upgraded Amount\n      ' +
        'EXPECTED RESULT: 0 TRU ; \n      ' +
        'ACTUAL RESULT: ' + web3.fromWei(upgradedTokens, 'ether') + ' TRU');
    }

    // TEST CASE 20 - Post-Fuzz Test #1
    upgradedTokens = await tempToken.totalUpgraded.call();
    assert.equal(upgradedTokens,
      0,
      '\n      ' +
      'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 20: Post-Fuzz Test #1\n      ' +
      'TEST DESCRIPTION: Incorrect upgraded Amount\n      ' +
      'EXPECTED RESULT: 0 TRU ; \n      ' +
      'ACTUAL RESULT: ' + web3.fromWei(upgradedTokens, 'ether') + ' TRU');
  }).timeout(timeoutDuration);

  it('FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 21: Fuzz test of Ownable transferOwnership with invalid arguments', async function() {
    var fuzzGenOne, tokenOwner;

    // TEST CASE 21 - Pre-Fuzz Test #1
    tokenOwner = await tempToken.owner.call();
    assert.equal(tokenOwner,
      acctOne,
      '\n      ' +
      'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 21: Pre-Fuzz Test #1\n      ' +
      'TEST DESCRIPTION: Incorrect Token Owner\n      ' +
      'EXPECTED RESULT: ' + acctOne + '; \n      ' +
      'ACTUAL RESULT: ' + tokenOwner);

    for (var i = loopStart; i < loopEnd; i++) {
      fuzzer.seed(i);
      let pass = i - loopStart + 1;
      fuzzGenOne = fuzzer.mutate.string(fuzzStrOne);

      // TEST CASE 21 - Test #1
      await expectFuzzFail(tempToken.transferOwnership(fuzzGenOne, { from: acctOne }))
      tokenOwner = await tempToken.owner.call();
      assert.equal(tokenOwner,
        acctOne,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 21: Pass #' + pass + ', Test #1\n      ' +
        'TEST DESCRIPTION: Incorrect Token Owner\n      ' +
        'EXPECTED RESULT: ' + acctOne + '; \n      ' +
        'ACTUAL RESULT: ' + tokenOwner);

      // TEST CASE 21 - Test #2
      await expectFuzzFail(tempToken.transferOwnership(acctOne, { from: fuzzGenOne }))
      tokenOwner = await tempToken.owner.call();
      assert.equal(tokenOwner,
        acctOne,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 21: Pass #' + pass + ', Test #2\n      ' +
        'TEST DESCRIPTION: Incorrect Token Owner\n      ' +
        'EXPECTED RESULT: ' + acctOne + '; \n      ' +
        'ACTUAL RESULT: ' + tokenOwner);
    }

    // TEST CASE 21 - Post-Fuzz Test #1
    tokenOwner = await tempToken.owner.call();
    assert.equal(tokenOwner,
      acctOne,
      '\n      ' +
      'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 21: Post-Fuzz Test #1\n      ' +
      'TEST DESCRIPTION: Incorrect Token Owner\n      ' +
      'EXPECTED RESULT: ' + acctOne + '; \n      ' +
      'ACTUAL RESULT: ' + tokenOwner);
  }).timeout(timeoutDuration);

  it('FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 22: Fuzz test performing a large volume of transfer() transactions of 1 TRU between accounts', async function() {

    for (var i = loopStart; i < loopEnd; i++) {
      let pass = i - loopStart + 1;

      if (isEven(pass) == true) {
        // TEST CASE 22 - Test #1a
        await truToken.transfer(acctOne, oneTru, { from: acctTwo })
      } else {
        // TEST CASE 22 - Test #1b
        await truToken.transfer(acctTwo, oneTru, { from: acctOne })
      }
    }
  }).timeout(timeoutDuration);

  it('FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 23: Fuzz test performing a large volume of transferFrom() transactions of 1 TRU between accounts', async function() {
    
    let tToken = await TruReputationToken.new({ from: acctOne });
    await tToken.mint(acctOne, maximumTru, { from: acctOne });
    await tToken.mint(acctTwo, maximumTru, { from: acctOne });
    await tToken.mint(acctOne, oneTru, { from: acctOne });
    await tToken.finishMinting(true, false, { from: acctOne });
    await tToken.finishMinting(false, true, { from: acctOne });
    await tToken.setReleaseAgent(acctOne, { from: acctOne });
    await tToken.releaseTokenTransfer();

    for (var i = loopStart; i < loopEnd; i++) {
      let pass = i - loopStart + 1;

      let actOneBal = await tToken.balanceOf.call(acctOne);
      let actTwoBal = await tToken.balanceOf.call(acctTwo);

      if (actOneBal.greaterThan(actTwoBal)) {
        await tToken.transfer(acctTwo, oneTru, { from: acctOne });
      } else {
        await tToken.transfer(acctOne, oneTru, { from: acctTwo });
      }
    }

  }).timeout(timeoutDuration);

  it('FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 24: Fuzz test performing a large volume of transfer() transactions of 300,000,000 TRU between accounts', async function() {
    let tToken = await TruReputationToken.new({ from: acctOne });
    await tToken.mint(acctOne, maximumTru, { from: acctOne });
    await tToken.finishMinting(true, false, { from: acctOne });
    await tToken.finishMinting(false, true, { from: acctOne });
    await tToken.setReleaseAgent(acctOne, { from: acctOne });
    await tToken.releaseTokenTransfer();

    for (var i = loopStart; i < loopEnd; i++) {
      let pass = i - loopStart + 1;

      let actOneBal = await tToken.balanceOf.call(acctOne);
      let actTwoBal = await tToken.balanceOf.call(acctTwo);

      if (actOneBal.greaterThan(actTwoBal)) {
        await tToken.transfer(acctTwo, maximumTru, { from: acctOne });
      } else {
        await tToken.transfer(acctOne, maximumTru, { from: acctTwo });
      }
    }
  }).timeout(timeoutDuration);

  it('FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 25: Fuzz test performing a large volume transferFrom() transactions of 300,000,000 TRU between accounts', async function() {

    let tToken = await TruReputationToken.new({ from: acctOne });
    await tToken.mint(acctOne, maximumTru, { from: acctOne });
    await tToken.finishMinting(true, false, { from: acctOne });
    await tToken.finishMinting(false, true, { from: acctOne });
    await tToken.setReleaseAgent(acctOne, { from: acctOne });
    await tToken.releaseTokenTransfer();

    for (var i = loopStart; i < loopEnd; i++) {
      let pass = i - loopStart + 1;

      let actOneBal = await tToken.balanceOf.call(acctOne);
      let actTwoBal = await tToken.balanceOf.call(acctTwo);

      if (actOneBal.greaterThan(actTwoBal)) {
        await tToken.approve(acctTwo, maximumTru, { from: acctOne });
        await tToken.transferFrom(acctOne, acctTwo, maximumTru, { from: acctTwo });
      } else {
        await tToken.approve(acctOne, maximumTru, { from: acctTwo });
        await tToken.transferFrom(acctTwo, acctOne, maximumTru, { from: acctOne });
      }
    }
  }).timeout(timeoutDuration);
  
  it('FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 26: Fuzz test of functions that receive no direct input', async function() {
    var fuzzGenOne, fuzzGenTwo, canUpgrade, upgradeState;
    let upgradeStateOrg = await truToken.getUpgradeState.call();

    // TEST CASE 26 - Pre-Fuzz Test #1
    let canUpgradeStatusOrg = await truToken.canUpgrade.call();
    assert.isTrue(canUpgradeStatusOrg,
      '\n      ' +
      'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 26: Pre-Fuzz Test #1\n      ' +
      'TEST DESCRIPTION: Token should be in a state where it can upgrade\n      ' +
      'EXPECTED RESULT: true\n      ' +
      'ACTUAL RESULT: ' + canUpgradeStatusOrg);

    // Fuzzing
    for (var i = loopStart; i < loopEnd; i++) {
      let pass = i - loopStart + 1;
      fuzzer.seed(i);
      fuzzGenOne = fuzzer.mutate.string(fuzzStrOne);
      fuzzGenTwo = fuzzer.mutate.string(fuzzStrTwo);

      // TEST CASE 26 - Test #1
      await expectFuzzFail(truToken.canUpgrade({ from: fuzzGenOne }))
      canUpgrade = await truToken.canUpgrade.call();
      assert.equal(canUpgrade,
        canUpgradeStatusOrg,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 26: Pass #' + pass + ', Test #1\n      ' +
        'TEST DESCRIPTION: Token upgradeable state should not have changed\n      ' +
        'EXPECTED RESULT: ' + canUpgradeStatusOrg + '\n      ' +
        'ACTUAL RESULT: ' + canUpgrade);

      // TEST CASE 26 - Test #2
      await expectFuzzFail(truToken.canUpgrade({ from: fuzzGenOne, to: fuzzGenTwo }))
      canUpgrade = await truToken.canUpgrade.call();
      assert.equal(canUpgrade,
        canUpgradeStatusOrg,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 26: Pass #' + pass + ', Test #2\n      ' +
        'TEST DESCRIPTION: Token upgradeable state should not have changed\n      ' +
        'EXPECTED RESULT: ' + canUpgradeStatusOrg + '\n      ' +
        'ACTUAL RESULT: ' + canUpgrade);

      // TEST CASE 26 - Test #3
      await expectFuzzFail(truToken.canUpgrade({ from: fuzzGenOne, value: fuzzGenTwo }))
      canUpgrade = await truToken.canUpgrade.call();
      assert.equal(canUpgrade,
        canUpgradeStatusOrg,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 26: Pass #' + pass + ', Test #3\n      ' +
        'TEST DESCRIPTION: Token upgradeable state should not have changed\n      ' +
        'EXPECTED RESULT: ' + canUpgradeStatusOrg + '\n      ' +
        'ACTUAL RESULT: ' + canUpgrade);

      // TEST CASE 26 - Test #4
      await expectFuzzFail(truToken.canUpgrade({ from: fuzzGenOne, to: fuzzGenTwo, value: fuzzGenOne }))
      canUpgrade = await truToken.canUpgrade.call();
      assert.equal(canUpgrade,
        canUpgradeStatusOrg,
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 26: Pass #' + pass + ', Test #4\n      ' +
        'TEST DESCRIPTION: Token upgradeable state should not have changed\n      ' +
        'EXPECTED RESULT: ' + canUpgradeStatusOrg + '\n      ' +
        'ACTUAL RESULT: ' + canUpgrade);

      // TEST CASE 26 - Test #5
      await expectFuzzFail(truToken.getUpgradeState({ from: fuzzGenOne }))
      upgradeState = await truToken.getUpgradeState.call();
      assert.equal(upgradeState.toFormat(0),
        upgradeStateOrg.toFormat(0),
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 26: Pass #' + pass + ', Test #5\n      ' +
        'TEST DESCRIPTION: Upgrade State of Token should not have changed\n      ' +
        'EXPECTED RESULT: ' + upgradeStateOrg.toFormat(0) + '\n      ' +
        'ACTUAL RESULT: ' + upgradeState.toFormat(0));

      // TEST CASE 26 - Test #6
      await expectFuzzFail(truToken.getUpgradeState({ from: fuzzGenOne, to: fuzzGenTwo }))
      upgradeState = await truToken.getUpgradeState.call();
      assert.equal(upgradeState.toFormat(0),
        upgradeStateOrg.toFormat(0),
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 26: Pass #' + pass + ', Test #6\n      ' +
        'TEST DESCRIPTION: Upgrade State of Token should not have changed\n      ' +
        'EXPECTED RESULT: ' + upgradeStateOrg.toFormat(0) + '\n      ' +
        'ACTUAL RESULT: ' + upgradeState.toFormat(0));

      // TEST CASE 26 - Test #7
      await expectFuzzFail(truToken.getUpgradeState({ from: fuzzGenOne, value: fuzzGenTwo }))
      upgradeState = await truToken.getUpgradeState.call();
      assert.equal(upgradeState.toFormat(0),
        upgradeStateOrg.toFormat(0),
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 26: Pass #' + pass + ', Test #7\n      ' +
        'TEST DESCRIPTION: Upgrade State of Token should not have changed\n      ' +
        'EXPECTED RESULT: ' + upgradeStateOrg.toFormat(0) + '\n      ' +
        'ACTUAL RESULT: ' + upgradeState.toFormat(0));

      // TEST CASE 26 - Test #8
      await expectFuzzFail(truToken.getUpgradeState({ from: fuzzGenOne, to: fuzzGenTwo, value: fuzzGenOne }))
      upgradeState = await truToken.getUpgradeState.call();
      assert.equal(upgradeState.toFormat(0),
        upgradeStateOrg.toFormat(0),
        '\n      ' +
        'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 26: Pass #' + pass + ', Test #8\n      ' +
        'TEST DESCRIPTION: Upgrade State of Token should not have changed\n      ' +
        'EXPECTED RESULT: ' + upgradeStateOrg.toFormat(0) + '\n      ' +
        'ACTUAL RESULT: ' + upgradeState.toFormat(0));
    }

    // TEST CASE 26 - Post-Fuzz Test #1
    canUpgrade = await truToken.canUpgrade.call();
    assert.isTrue(canUpgrade,
      '\n      ' +
      'FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 26: Pre-Fuzz Test #1\n      ' +
      'TEST DESCRIPTION: Token should be in a state where it can upgrade\n      ' +
      'EXPECTED RESULT: true\n      ' +
      'ACTUAL RESULT: ' + canUpgrade);
  }).timeout(timeoutDuration);

  it('FUZZING TESTS - TRUREPUTATIONTOKEN - TEST CASE 27: Fuzz test of structural send & sendTransaction functions', async function() {
    var fuzzGenOne, fuzzGenTwo, canUpgrade, upgradeState;

    // Fuzzing
    for (var i = loopStart; i < loopEnd; i++) {
      let pass = i - loopStart + 1;
      fuzzer.seed(i);
      fuzzGenOne = fuzzer.mutate.string(fuzzStrOne);
      fuzzGenTwo = fuzzer.mutate.string(fuzzStrTwo);

      // TEST CASE 27 - Test #1
      await expectFuzzFail(truToken.send({ from: fuzzGenOne }));

      // TEST CASE 27 - Test #2
      await expectFuzzFail(truToken.send({ to: fuzzGenOne }));

      // TEST CASE 27 - Test #3
      await expectFuzzFail(truToken.send({ value: fuzzGenOne }));

      // TEST CASE 27 - Test #4
      await expectFuzzFail(truToken.send({ from: fuzzGenOne, to: fuzzGenTwo }));

      // TEST CASE 27 - Test #5
      await expectFuzzFail(truToken.send({ from: fuzzGenOne, value: fuzzGenTwo }));

      // TEST CASE 27 - Test #6
      await expectFuzzFail(truToken.send({ value: fuzzGenOne, to: fuzzGenTwo }));

      // TEST CASE 27 - Test #7
      await expectFuzzFail(truToken.send({ from: fuzzGenOne, to: fuzzGenTwo, value: fuzzGenTwo }));

      // TEST CASE 27 - Test #8
      await expectFuzzFail(truToken.sendTransaction({ from: fuzzGenOne }));

      // TEST CASE 27 - Test #9
      await expectFuzzFail(truToken.sendTransaction({ to: fuzzGenOne }));

      // TEST CASE 27 - Test #10
      await expectFuzzFail(truToken.sendTransaction({ value: fuzzGenOne }));

      // TEST CASE 27 - Test #11
      await expectFuzzFail(truToken.sendTransaction({ from: fuzzGenOne, to: fuzzGenTwo }));

      // TEST CASE 27 - Test #12
      await expectFuzzFail(truToken.sendTransaction({ from: fuzzGenOne, value: fuzzGenTwo }));

      // TEST CASE 27 - Test #13
      await expectFuzzFail(truToken.sendTransaction({ value: fuzzGenOne, to: fuzzGenTwo }));

      // TEST CASE 27 - Test #14
      await expectFuzzFail(truToken.sendTransaction({ from: fuzzGenOne, to: fuzzGenTwo, value: fuzzGenTwo }));
    }
  }).timeout(timeoutDuration);
});