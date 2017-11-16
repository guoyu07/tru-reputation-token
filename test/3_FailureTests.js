/**
 * The following Tests are written to cover edge cases and for fuzz testing all Contract functions as part of good security 
 * and development practice to detect unhandled exceptions, bugs and security holes in any or all contracts or 
 * libraries used by the Tru Reputation Token.
 * These tests can take a very long time to perform as they use large data sets and loops to effectively test the functionality.
 */

'use strict';
const BigNumber = web3.BigNumber;
const TruReputationToken = artifacts.require('./TruReputationToken.sol');
const TruPreSale = artifacts.require('./TruPreSale.sol');
const TruCrowdSale = artifacts.require('./TruCrowdSale.sol');
const ERC20Basic = artifacts.require('./ERC20Basic.sol');
const MockMigrationTarget = artifacts.require('./MockMigrationTarget.sol');
const MockUpgradeableToken = artifacts.require('./MockUpgradeableToken.sol');
const MockUpgradeAgent = artifacts.require('./MockUpgradeAgent.sol');
import EVMThrow from './helpers/EVMThrow';
import expectThrow from './helpers/expectThrow';

function isEven(num) {
  var divisible = num % 2;
  if (divisible == 1) {
    return false;
  } else {
    return true;
  }
}

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

var fuzzer = require("fuzzer");

var awaitFuzzPromise = async function(prom) {
  try {
    await prom;
  } catch (error) {
    const invalidAddress = error.message.search('invalid address') >= 0;
    const notBase2 = error.message.search('not a base 2 number') >= 0;
    const notBase8 = error.message.search('not a base 8 number') >= 0;
    const notBase16 = error.message.search('not a base 16 number') >= 0;
    const bigNaN = error.message.search('not a number') >= 0;
    const invalidOpcode = error.message.search('invalid opcode') >= 0;
    const invalidNoArgs = error.message.search('Invalid number of arguments') >= 0;
    assert(invalidAddress || invalidOpcode || notBase2 || notBase8 || notBase16 || bigNaN || invalidNoArgs,
      'Expected throw, got "' + error + '" instead');
  }
}

let fuzzStrOne = '0xPerfectlyWastedStringOne';
let fuzzStrTwo = "0xFuzzyStringThatShouldAlwaysFailTwo";
let fuzzStrThree = "0xANonsenseStringForFuzzingThree";
let hundredTru = web3.toWei(100, 'ether');
let maximumTru = web3.toWei(300000000, 'ether');
let loopStart = 1000;
let loopEnd = 1002;

contract('TruReputationToken', function(accounts) {
  var truToken;
  let tokenMigration;
  let mintAmount = 100 * 10 ** 18;
  let accountOne = accounts[0];
  let accountTwo = accounts[1];
  let execAccount = accounts[2];
  let execAccountTwo = accounts[3];
  let accountFive = accounts[4];
  let upgradeAmount;
  let diffBalance;
  let currentSupply;
  var tempToken;
  var upgradeToken;

  let tenTru = web3.toWei(10, 'ether');
  let oneTru = web3.toWei(1, 'ether');
  fuzzer.seed(0);

  it('FAILURETESTS TEST CASE 01: should fail on fuzz test on TruReputationToken Constructor with invalid executor address', async function() {
    var fuzzStr = accountTwo;
    var fuzzStr = '0xPerfectlyWastedString';
    var fuzzGen;
    for (var i = loopStart; i < loopEnd; i++) {
      fuzzer.seed(i);
      fuzzGen = fuzzer.mutate.string(fuzzStr);
      await awaitFuzzPromise(TruReputationToken.new({ from: fuzzGen }));
    }
  });

  it('FAILURETESTS TEST CASE 02: should fail on fuzz test of TruReputationToken changeBoardAddress with invalid arguments', async function() {
    truToken = await TruReputationToken.new({ from: accountOne });
    let tokenSymbol = await truToken.symbol.call();
    assert.equal(tokenSymbol,
      'TRU',
      'FAILURETESTS TEST CASE 02: Token Symbol should be TRU. \n\
    ACTUAL RESULT: ' + tokenSymbol);

    var fuzzStr = '0xPerfectlyWastedString';

    var fuzzGen;
    for (var i = loopStart; i < loopEnd; i++) {
      fuzzer.seed(i);
      fuzzGen = fuzzer.mutate.string(fuzzStr);
      var pass = i - loopStart + 1;

      if (fuzzGen != accountOne && fuzzGen != accountTwo) {
        await awaitFuzzPromise(truToken.changeBoardAddress(accountTwo, { from: fuzzGen }));

        let boardAddress = await truToken.execBoard.call();
        assert.equal(boardAddress,
          accountOne,
          'FAILURETESTS TEST CASE 02: Board Address should be \n\
          ' + accountOne + ' after fuzzing changeBoardAddress test #1, pass #' + pass + '. \n\
          ACTUAL RESULT: ' + boardAddress + '. \n\
          FUZZ GEN: ' + fuzzGen);
        await awaitFuzzPromise(truToken.changeBoardAddress(fuzzGen, { from: accountOne }));

        boardAddress = await truToken.execBoard.call();
        assert.equal(boardAddress,
          accountOne,
          'FAILURETESTS TEST CASE 02: Board Address should be \n\
          ' + accountOne + ' after fuzzing changeBoardAddress test #2, pass #' + pass + '. \n\
          ACTUAL RESULT: ' + boardAddress + '. \n\
          FUZZ GEN: ' + fuzzGen);

        await awaitFuzzPromise(truToken.changeBoardAddress(fuzzGen, { from: fuzzGen }));

        boardAddress = await truToken.execBoard.call();
        assert.equal(boardAddress,
          accountOne,
          'FAILURETESTS TEST CASE 02: Board Address should be \n\
          ' + accountOne + ' after fuzzing changeBoardAddress test #3, pass #' + pass + '. \n\
          ACTUAL RESULT: ' + boardAddress + '. \n\
          FUZZ GEN: ' + fuzzGen);
      }
    }
  });

  it('FAILURETESTS TEST CASE 03: Should fail on fuzz test of TruMintableToken mint with invalid arguments', async function() {
    var fuzzGen;
    let tokenSupply = await truToken.totalSupply.call();
    assert.equal(tokenSupply,
      0,
      'FAILURETESTS TEST CASE 03: Token supply should be zero before fuzzing mint.\n\
        ACTUAL RESULT: ' + tokenSupply);

    for (var i = loopStart; i < loopEnd; i++) {
      fuzzer.seed(i);
      var pass = i - loopStart + 1;
      fuzzGen = fuzzer.mutate.string(fuzzStrOne);

      if (fuzzGen != accountOne && fuzzGen != accountTwo) {
        await awaitFuzzPromise(truToken.mint(fuzzGen, 100, { from: accountOne }));

        tokenSupply = await truToken.totalSupply.call();
        assert.equal(tokenSupply,
          0,
          'FAILURETESTS TEST CASE 03: Token supply should be zero after fuzzing mint test #1, pass #' + pass + '.\n\
            ACTUAL RESULT: ' + tokenSupply);

        await awaitFuzzPromise(truToken.mint(100, fuzzGen, { from: accountOne }));
        tokenSupply = await truToken.totalSupply.call();
        assert.equal(tokenSupply,
          0,
          'FAILURETESTS TEST CASE 03: Token supply should be zero after fuzzing mint test #2, pass #' + pass + '.\n\
            ACTUAL RESULT: ' + tokenSupply);

        await awaitFuzzPromise(truToken.mint(100, accountOne, { from: fuzzGen }));
        tokenSupply = await truToken.totalSupply.call();
        assert.equal(tokenSupply,
          0,
          'FAILURETESTS TEST CASE 03: Token supply should be zero after fuzzing mint test #3, pass #' + pass + '.\n\
            ACTUAL RESULT: ' + tokenSupply);

        await awaitFuzzPromise(truToken.mint(fuzzGen, fuzzGen, { from: fuzzGen }));
        tokenSupply = await truToken.totalSupply.call();
        assert.equal(tokenSupply,
          0,
          'FAILURETESTS TEST CASE 03: Token supply should be zero after fuzzing mint test #4, pass #' + pass + '.\n\
            ACTUAL RESULT: ' + tokenSupply);
      }
    }
  });

  it('FAILURETESTS TEST CASE 04: Should fail on fuzz test of TruMintableToken finishMinting with invalid arguments', async function() {
    var fuzzBoolOne = "fuzzBoolOne";
    var fuzzBoolTwo = "fuzzBoolTrue";
    var fuzzGenOne, fuzzGenTwo, fuzzGenThree;
    for (var i = loopStart; i < loopEnd; i++) {
      fuzzer.seed(i);
      var pass = i - loopStart + 1;
      fuzzGenOne = fuzzer.mutate.string(fuzzStrOne);
      fuzzGenTwo = fuzzer.mutate.string(fuzzBoolOne);
      fuzzGenThree = fuzzer.mutate.string(fuzzBoolTwo);

      if (fuzzGenOne.length != 42) {
        await awaitFuzzPromise(truToken.finishMinting(fuzzGenTwo, fuzzGenThree, { from: fuzzGenOne }));
        let mintingStatus = await truToken.mintingFinished.call();
        let pSaleFinished = await truToken.preSaleComplete.call();
        let saleFinished = await truToken.saleComplete.call();
        assert.isFalse(pSaleFinished,
          'FAILURETESTS TEST CASE 04: Pre Sale should not be finished after finishedMinting test #1, pass #' + pass + '.\n\
          ACTUAL RESULT: ' + pSaleFinished);
        assert.isFalse(saleFinished,
          'FAILURETESTS TEST CASE 04: CrowdSale should not be finished after finishedMinting test #1, pass #' + pass + '.\n\
          ACTUAL RESULT: ' + saleFinished);
        assert.isFalse(mintingStatus,
          'FAILURETESTS TEST CASE 04: Minting should not be finished after finishedMinting test #1, pass #' + pass + '.\n\
          ACTUAL RESULT: ' + mintingStatus);

        await awaitFuzzPromise(truToken.finishMinting(true, fuzzGenThree, { from: fuzzGenOne }))
        mintingStatus = await truToken.mintingFinished.call();
        pSaleFinished = await truToken.preSaleComplete.call();
        saleFinished = await truToken.saleComplete.call();
        assert.isFalse(pSaleFinished,
          'FAILURETESTS TEST CASE 04: Pre Sale should not be finished after finishedMinting test #2, pass #' + pass + '.\n\
          ACTUAL RESULT: ' + pSaleFinished);
        assert.isFalse(saleFinished,
          'FAILURETESTS TEST CASE 04: CrowdSale should not be finished after finishedMinting test #2, pass #' + pass + '.\n\
          ACTUAL RESULT: ' + saleFinished);
        assert.isFalse(mintingStatus,
          'FAILURETESTS TEST CASE 04: Minting should not be finished after finishedMinting test #2, pass #' + pass + '.\n\
            ACTUAL RESULT: ' + mintingStatus);

        await awaitFuzzPromise(truToken.finishMinting(true, false, { from: fuzzGenOne }))
        mintingStatus = await truToken.mintingFinished.call();
        pSaleFinished = await truToken.preSaleComplete.call();
        saleFinished = await truToken.saleComplete.call();
        assert.isFalse(pSaleFinished,
          'FAILURETESTS TEST CASE 04: Pre Sale should not be finished after finishedMinting test #3, pass #' + pass + '.\n\
          ACTUAL RESULT: ' + pSaleFinished);
        assert.isFalse(saleFinished,
          'FAILURETESTS TEST CASE 04: CrowdSale should not be finished after finishedMinting test #3, pass #' + pass + '.\n\
          ACTUAL RESULT: ' + saleFinished);
        assert.isFalse(mintingStatus,
          'FAILURETESTS TEST CASE 04: Minting should not be finished after finishedMinting test #3, pass #' + pass + '.\n\
            ACTUAL RESULT: ' + mintingStatus);

        await awaitFuzzPromise(truToken.finishMinting(false, true, { from: fuzzGenOne }))
        mintingStatus = await truToken.mintingFinished.call();
        pSaleFinished = await truToken.preSaleComplete.call();
        saleFinished = await truToken.saleComplete.call();
        assert.isFalse(pSaleFinished,
          'FAILURETESTS TEST CASE 04: Pre Sale should not be finished after finishedMinting test #4, pass #' + pass + '.\n\
              ACTUAL RESULT: ' + pSaleFinished);
        assert.isFalse(saleFinished,
          'FAILURETESTS TEST CASE 04: CrowdSale should not be finished after finishedMinting test #4, pass #' + pass + '.\n\
              ACTUAL RESULT: ' + saleFinished);
        assert.isFalse(mintingStatus,
          'FAILURETESTS TEST CASE 04: Minting should not be finished after finishedMinting test #4, pass #' + pass + '.\n\
                ACTUAL RESULT: ' + mintingStatus);

        await awaitFuzzPromise(truToken.finishMinting(true, true, { from: fuzzGenOne }))
        mintingStatus = await truToken.mintingFinished.call();
        pSaleFinished = await truToken.preSaleComplete.call();
        saleFinished = await truToken.saleComplete.call();
        assert.isFalse(pSaleFinished,
          'FAILURETESTS TEST CASE 04: Pre Sale should not be finished after finishedMinting test #5, pass #' + pass + '.\n\
                      ACTUAL RESULT: ' + pSaleFinished);
        assert.isFalse(saleFinished,
          'FAILURETESTS TEST CASE 04: CrowdSale should not be finished after finishedMinting test #5, pass #' + pass + '.\n\
                      ACTUAL RESULT: ' + saleFinished);
        assert.isFalse(mintingStatus,
          'FAILURETESTS TEST CASE 04: Minting should not be finished after finishedMinting test #5, pass #' + pass + '.\n\
                        ACTUAL RESULT: ' + mintingStatus);

        await awaitFuzzPromise(truToken.finishMinting(fuzzGenTwo, true, { from: fuzzGenOne }))
        mintingStatus = await truToken.mintingFinished.call();
        pSaleFinished = await truToken.preSaleComplete.call();
        saleFinished = await truToken.saleComplete.call();
        assert.isFalse(pSaleFinished,
          'FAILURETESTS TEST CASE 04: Pre Sale should not be finished after finishedMinting test #6, pass #' + pass + '.\n\
          ACTUAL RESULT: ' + pSaleFinished);
        assert.isFalse(saleFinished,
          'FAILURETESTS TEST CASE 04: CrowdSale should not be finished after finishedMinting test #6, pass #' + pass + '.\n\
          ACTUAL RESULT: ' + saleFinished);
        assert.isFalse(mintingStatus,
          'FAILURETESTS TEST CASE 04: Minting should not be finished after finishedMinting test #6, pass #' + pass + '.\n\
            ACTUAL RESULT: ' + mintingStatus);

        await awaitFuzzPromise(truToken.finishMinting(fuzzGenTwo, fuzzGenThree, { from: accountOne }));
        mintingStatus = await truToken.mintingFinished.call();
        pSaleFinished = await truToken.preSaleComplete.call();
        saleFinished = await truToken.saleComplete.call();
        assert.isFalse(pSaleFinished,
          'FAILURETESTS TEST CASE 04: Pre Sale should not be finished after finishedMinting test #7, pass #' + pass + '.\n\
          ACTUAL RESULT: ' + pSaleFinished);
        assert.isFalse(saleFinished,
          'FAILURETESTS TEST CASE 04: CrowdSale should not be finished after finishedMinting test #7, pass #' + pass + '.\n\
          ACTUAL RESULT: ' + saleFinished);
        assert.isFalse(mintingStatus,
          'FAILURETESTS TEST CASE 04: Minting should not be finished after finishedMinting test #7, pass #' + pass + '.\n\
                ACTUAL RESULT: ' + mintingStatus);

        await awaitFuzzPromise(truToken.finishMinting(true, fuzzGenThree, { from: accountOne }));
        mintingStatus = await truToken.mintingFinished.call();
        pSaleFinished = await truToken.preSaleComplete.call();
        saleFinished = await truToken.saleComplete.call();
        assert.isFalse(pSaleFinished,
          'FAILURETESTS TEST CASE 04: Pre Sale should not be finished after finishedMinting test #8, pass #' + pass + '.\n\
          ACTUAL RESULT: ' + pSaleFinished);
        assert.isFalse(saleFinished,
          'FAILURETESTS TEST CASE 04: CrowdSale should not be finished after finishedMinting test #8, pass #' + pass + '.\n\
          ACTUAL RESULT: ' + saleFinished);
        assert.isFalse(mintingStatus,
          'FAILURETESTS TEST CASE 04: Minting should not be finished after finishedMinting test #8, pass #' + pass + '.\n\
                ACTUAL RESULT: ' + mintingStatus);

        await awaitFuzzPromise(truToken.finishMinting(fuzzGenTwo, true, { from: accountOne }));
        mintingStatus = await truToken.mintingFinished.call();
        pSaleFinished = await truToken.preSaleComplete.call();
        saleFinished = await truToken.saleComplete.call();
        assert.isFalse(pSaleFinished,
          'FAILURETESTS TEST CASE 04: Pre Sale should not be finished after finishedMinting test #9, pass #' + pass + '.\n\
                  ACTUAL RESULT: ' + pSaleFinished);
        assert.isFalse(saleFinished,
          'FAILURETESTS TEST CASE 04: CrowdSale should not be finished after finishedMinting test #9, pass #' + pass + '.\n\
                  ACTUAL RESULT: ' + saleFinished);
        assert.isFalse(mintingStatus,
          'FAILURETESTS TEST CASE 04: Minting should not be finished after finishedMinting test #9, pass #' + pass + '.\n\
                        ACTUAL RESULT: ' + mintingStatus);
      }
    }
  });

  it('FAILURETESTS TEST CASE 05: Should fail on fuzz test of ReleasableToken to setTransferAgent with invalid arguments', async function() {
    var fuzzBoolOne = "true";
    var fuzzGenOne, fuzzGenTwo, fuzzGenThree;
    for (var i = loopStart; i < loopEnd; i++) {
      fuzzer.seed(i);
      var pass = i - loopStart + 1;
      fuzzGenOne = fuzzer.mutate.string(fuzzStrOne);
      fuzzGenTwo = fuzzer.mutate.string(fuzzStrTwo);
      fuzzGenThree = fuzzer.mutate.string(fuzzBoolOne);
      if (fuzzGenOne.length != 42 && fuzzGenTwo.length != 42 && fuzzGenThree.length != 42) {
        await awaitFuzzPromise(truToken.setTransferAgent(fuzzGenTwo, fuzzGenThree, { from: fuzzGenOne }));

        await awaitFuzzPromise(truToken.setTransferAgent(fuzzGenTwo, fuzzGenThree, { from: accountOne }));

        await awaitFuzzPromise(truToken.setTransferAgent(accountOne, fuzzStrThree, { from: fuzzGenOne }));
      }
    }
  });

  it('FAILURETESTS TEST CASE 06: Should fail on fuzz test of ReleasableToken to setReleaseAgent with invalid arguments', async function() {
    var fuzzBoolOne = "true";
    var fuzzGenOne, fuzzGenTwo, fuzzGenThree;
    let rAgent = await truToken.releaseAgent.call();
    assert.equal(rAgent,
      0x0,
      'FAILURETESTS TEST CASE 06: Release Agent should be 0x0.\n\
      ACTUAL RESULT: ' + rAgent);

    for (var i = loopStart; i < loopEnd; i++) {
      var pass = i - loopStart + 1;
      fuzzer.seed(i);
      fuzzGenOne = fuzzer.mutate.string(fuzzStrOne);
      fuzzGenTwo = fuzzer.mutate.string(fuzzStrTwo);
      fuzzGenThree = fuzzer.mutate.string(fuzzBoolOne);

      if (fuzzGenOne.length != 42 && fuzzGenTwo.length != 42 && fuzzGenThree.length != 42) {

        await awaitFuzzPromise(truToken.setReleaseAgent(fuzzGenTwo, { from: fuzzGenOne }));
        rAgent = await truToken.releaseAgent.call();
        assert.equal(rAgent,
          0x0,
          'FAILURETESTS TEST CASE 06: Release Agent should be 0x0 setReleaseAgent test #1, pass #' + pass + '.\n\
          ACTUAL RESULT: ' + rAgent);

        await awaitFuzzPromise(truToken.setReleaseAgent(fuzzGenTwo, { from: accountOne }));
        rAgent = await truToken.releaseAgent.call();
        assert.equal(rAgent,
          0x0,
          'FAILURETESTS TEST CASE 06: Release Agent should be 0x0 setReleaseAgent test #2, pass #' + pass + '.\n\
          ACTUAL RESULT: ' + rAgent);

        await awaitFuzzPromise(truToken.setReleaseAgent(accountOne, { from: fuzzGenOne }));
        rAgent = await truToken.releaseAgent.call();
        assert.equal(rAgent,
          0x0,
          'FAILURETESTS TEST CASE 06: Release Agent should be 0x0 setReleaseAgent test #3, pass #' + pass + '.\n\
          ACTUAL RESULT: ' + rAgent);

      }
    }
  });

  it('FAILURETESTS TEST CASE 07: Should fail on fuzz test of ReleasableToken releaseTokenTransfer with invalid arguments', async function() {
    var fuzzGenOne;
    for (var i = loopStart; i < loopEnd; i++) {
      var pass = i - loopStart + 1;
      fuzzer.seed(i);
      fuzzGenOne = fuzzer.mutate.string(fuzzStrOne);
      if (fuzzGenOne.length != 42) {

        await awaitFuzzPromise(truToken.releaseTokenTransfer({ from: fuzzGenOne }));

      }
    }
  });

  it('FAILURETESTS TEST CASE 08: Should fail on fuzz test of ReleasableToken transfer with invalid arguments', async function() {

    var fuzzGenOne, fuzzGenTwo;
    // Create minted pool
    await truToken.mint(accountOne, hundredTru, { from: accountOne });
    let acctOneBalance = await truToken.balanceOf(accountOne);
    assert.equal(web3.fromWei(acctOneBalance, 'ether'), 100,
      'FAILURETESTS TEST CASE 08: Account One has wrong balance.\n\
    EXPECTED RESULT: 100 TRU; \n\
    ACTUAL RESULT: ' + web3.fromWei(acctOneBalance, 'ether'));

    // Finish minitng
    await truToken.setTransferAgent(accountOne, true, { from: accountOne });
    await truToken.finishMinting(true, false, { from: accountOne });
    await truToken.finishMinting(false, true, { from: accountOne });
    let mintingStatus = await truToken.mintingFinished.call();
    assert.isTrue(mintingStatus, 'FAILURETESTS TEST CASE 08: Minting should be finished.\n\
    ACTUAL RESULT: ' + mintingStatus);

    for (var i = loopStart; i < loopEnd; i++) {
      var pass = i - loopStart + 1;
      fuzzer.seed(i);
      fuzzGenOne = fuzzer.mutate.string(fuzzStrOne);
      fuzzGenTwo = fuzzer.mutate.string(fuzzStrTwo);
      if (fuzzGenOne.length != 42 && fuzzGenTwo.length != 42) {
        await awaitFuzzPromise(truToken.transfer(fuzzGenTwo, hundredTru, { from: fuzzGenOne }));
        acctOneBalance = await truToken.balanceOf(accountOne);
        assert.equal(web3.fromWei(acctOneBalance, 'ether'), 100,
          'FAILURETESTS TEST CASE 08: Account One has wrong balance after test #1, pass #' + pass + '.\n\
        EXPECTED RESULT: 100 TRU; \n\
        ACTUAL RESULT: ' + web3.fromWei(acctOneBalance, 'ether'));

        await awaitFuzzPromise(truToken.transfer(accountTwo, hundredTru, { from: fuzzGenOne }));
        acctOneBalance = await truToken.balanceOf(accountOne);
        assert.equal(web3.fromWei(acctOneBalance, 'ether'), 100,
          'FAILURETESTS TEST CASE 08: Account One has wrong balance after test #2, pass #' + pass + '.\n\
        EXPECTED RESULT: 100 TRU; \n\
        ACTUAL RESULT: ' + web3.fromWei(acctOneBalance, 'ether'));

        await awaitFuzzPromise(truToken.transfer(fuzzGenTwo, hundredTru, { from: accountOne }));
        acctOneBalance = await truToken.balanceOf(accountOne);
        assert.equal(web3.fromWei(acctOneBalance, 'ether'), 100,
          'FAILURETESTS TEST CASE 08: Account One has wrong balance after test #3, pass #' + pass + '.\n\
        EXPECTED RESULT: 100 TRU; \n\
        ACTUAL RESULT: ' + web3.fromWei(acctOneBalance, 'ether'));
      }
    }
  });

  it('FAILURETESTS TEST CASE 09: Should fail on fuzz test of ReleasableToken transferFrom with invalid arguments', async function() {
    var fuzzGenOne, fuzzGenTwo;
    let acctOneBalance = await truToken.balanceOf(accountOne);
    assert.equal(web3.fromWei(acctOneBalance, 'ether'), 100,
      'FAILURETESTS TEST CASE 09: Account One has wrong balance.\n\
    EXPECTED RESULT: 100 TRU; \n\
    ACTUAL RESULT: ' + web3.fromWei(acctOneBalance, 'ether'));

    for (var i = loopStart; i < loopEnd; i++) {
      var pass = i - loopStart + 1;
      fuzzer.seed(i);
      fuzzGenOne = fuzzer.mutate.string(fuzzStrOne);
      fuzzGenTwo = fuzzer.mutate.string(fuzzStrTwo);

      await awaitFuzzPromise(truToken.transferFrom(fuzzGenTwo, hundredTru, { from: fuzzGenOne }));
      acctOneBalance = await truToken.balanceOf(accountOne);
      assert.equal(web3.fromWei(acctOneBalance, 'ether'), 100,
        'FAILURETESTS TEST CASE 09: Account One has wrong balance after test #1, pass #' + pass + '.\n\
      EXPECTED RESULT: 100 TRU; \n\
      ACTUAL RESULT: ' + web3.fromWei(acctOneBalance, 'ether'));

      await awaitFuzzPromise(truToken.transferFrom(accountTwo, hundredTru, { from: fuzzGenOne }));
      acctOneBalance = await truToken.balanceOf(accountOne);
      assert.equal(web3.fromWei(acctOneBalance, 'ether'), 100,
        'FAILURETESTS TEST CASE 09: Account One has wrong balance after test #2, pass #' + pass + '.\n\
      EXPECTED RESULT: 100 TRU; \n\
      ACTUAL RESULT: ' + web3.fromWei(acctOneBalance, 'ether'));

      await awaitFuzzPromise(truToken.transferFrom(accountTwo, fuzzGenOne, { from: accountOne }));
      acctOneBalance = await truToken.balanceOf(accountOne);
      assert.equal(web3.fromWei(acctOneBalance, 'ether'), 100,
        'FAILURETESTS TEST CASE 09: Account One has wrong balance after test #3, pass #' + pass + '.\n\
      EXPECTED RESULT: 100 TRU; \n\
      ACTUAL RESULT: ' + web3.fromWei(acctOneBalance, 'ether'));

      await awaitFuzzPromise(truToken.transferFrom(fuzzGenOne, fuzzGenOne, { from: accountOne }));
      acctOneBalance = await truToken.balanceOf(accountOne);
      assert.equal(web3.fromWei(acctOneBalance, 'ether'), 100,
        'FAILURETESTS TEST CASE 09: Account One has wrong balance after test #4, pass #' + pass + '.\n\
      EXPECTED RESULT: 100 TRU; \n\
      ACTUAL RESULT: ' + web3.fromWei(acctOneBalance, 'ether'));

      await awaitFuzzPromise(truToken.transferFrom(accountTwo, fuzzGenOne, { from: fuzzGenOne }));
      acctOneBalance = await truToken.balanceOf(accountOne);
      assert.equal(web3.fromWei(acctOneBalance, 'ether'), 100,
        'FAILURETESTS TEST CASE 09: Account One has wrong balance after test #5, pass #' + pass + '.\n\
      EXPECTED RESULT: 100 TRU; \n\
      ACTUAL RESULT: ' + web3.fromWei(acctOneBalance, 'ether'));

      await awaitFuzzPromise(truToken.transferFrom(fuzzGenOne, fuzzGenTwo, { from: fuzzGenOne }));
      acctOneBalance = await truToken.balanceOf(accountOne);
      assert.equal(web3.fromWei(acctOneBalance, 'ether'), 100,
        'FAILURETESTS TEST CASE 09: Account One has wrong balance after test #6, pass #' + pass + '.\n\
      EXPECTED RESULT: 100 TRU; \n\
      ACTUAL RESULT: ' + web3.fromWei(acctOneBalance, 'ether'));
    }
  });

  it('FAILURETESTS TEST CASE 10: Should fail on fuzz test of StandardToken approve with invalid arguments', async function() {
    var fuzzGenOne;
    let acctOneBalance = await truToken.balanceOf(accountOne);
    assert.equal(web3.fromWei(acctOneBalance, 'ether'), 100,
      'FAILURETESTS TEST CASE 10: Account One has wrong balance.\n\
    EXPECTED RESULT: 100 TRU; \n\
    ACTUAL RESULT: ' + web3.fromWei(acctOneBalance, 'ether'));

    for (var i = loopStart; i < loopEnd; i++) {
      fuzzer.seed(i);
      var pass = i - loopStart + 1;
      fuzzGenOne = fuzzer.mutate.string(fuzzStrOne);

      await awaitFuzzPromise(truToken.approve(fuzzGenOne, hundredTru, { from: accountOne }));
      acctOneBalance = await truToken.balanceOf(accountOne);
      assert.equal(web3.fromWei(acctOneBalance, 'ether'), 100,
        'FAILURETESTS TEST CASE 10: Account One has wrong balance after test #1, pass #' + pass + '.\n\
      EXPECTED RESULT: 100 TRU; \n\
      ACTUAL RESULT: ' + web3.fromWei(acctOneBalance, 'ether'));

      await awaitFuzzPromise(truToken.approve(accountTwo, hundredTru, { from: fuzzGenOne }));
      acctOneBalance = await truToken.balanceOf(accountOne);
      assert.equal(web3.fromWei(acctOneBalance, 'ether'), 100,
        'FAILURETESTS TEST CASE 10: Account One has wrong balance after test #2, pass #' + pass + '.\n\
      EXPECTED RESULT: 100 TRU; \n\
      ACTUAL RESULT: ' + web3.fromWei(acctOneBalance, 'ether'));

      await awaitFuzzPromise(truToken.approve(accountTwo, fuzzGenOne, { from: accountOne }));
      acctOneBalance = await truToken.balanceOf(accountOne);
      assert.equal(web3.fromWei(acctOneBalance, 'ether'), 100,
        'FAILURETESTS TEST CASE 10: Account One has wrong balance after test #3, pass #' + pass + '.\n\
      EXPECTED RESULT: 100 TRU; \n\
      ACTUAL RESULT: ' + web3.fromWei(acctOneBalance, 'ether'));

      await awaitFuzzPromise(truToken.approve(fuzzGenOne, fuzzGenOne, { from: accountOne }));
      acctOneBalance = await truToken.balanceOf(accountOne);
      assert.equal(web3.fromWei(acctOneBalance, 'ether'), 100,
        'FAILURETESTS TEST CASE 10: Account One has wrong balance after test #4, pass #' + pass + '.\n\
      EXPECTED RESULT: 100 TRU; \n\
      ACTUAL RESULT: ' + web3.fromWei(acctOneBalance, 'ether'));

      await awaitFuzzPromise(truToken.approve(accountTwo, fuzzGenOne, { from: fuzzGenOne }));
      acctOneBalance = await truToken.balanceOf(accountOne);
      assert.equal(web3.fromWei(acctOneBalance, 'ether'), 100,
        'FAILURETESTS TEST CASE 10: Account One has wrong balance after test #5, pass #' + pass + '.\n\
      EXPECTED RESULT: 100 TRU; \n\
      ACTUAL RESULT: ' + web3.fromWei(acctOneBalance, 'ether'));

      await awaitFuzzPromise(truToken.approve(fuzzGenOne, fuzzGenOne, { from: fuzzGenOne }));
      acctOneBalance = await truToken.balanceOf(accountOne);
      assert.equal(web3.fromWei(acctOneBalance, 'ether'), 100,
        'FAILURETESTS TEST CASE 10: Account One has wrong balance after test #6, pass #' + pass + '.\n\
      EXPECTED RESULT: 100 TRU; \n\
      ACTUAL RESULT: ' + web3.fromWei(acctOneBalance, 'ether'));
    }
  });

  it('FAILURETESTS TEST CASE 11: Should fail on fuzz test of StandardToken allowance with invalid arguments', async function() {
    var fuzzGenOne;
    let acctOneBalance = await truToken.balanceOf(accountOne);
    assert.equal(web3.fromWei(acctOneBalance, 'ether'),
      100,
      'FAILURETESTS TEST CASE 11: Account One has wrong balance.\n\
    EXPECTED RESULT: 100 TRU; \n\
    ACTUAL RESULT: ' + web3.fromWei(acctOneBalance, 'ether'));
    await truToken.approve(accountTwo, tenTru, { from: accountOne });
    let acctTwoAllowance = await truToken.allowance(accountOne, accountTwo);
    assert.equal(web3.fromWei(acctTwoAllowance, 'ether'),
      10,
      'FUZZTEST TEST CASE 11: Account Two has incorrect allowance.\n\
    EXPECTED RESULT: 10 TRU\n\
    ACTUAL RESULT: ' + web3.fromWei(acctTwoAllowance, 'ether'));

    for (var i = loopStart; i < loopEnd; i++) {
      fuzzer.seed(i);
      fuzzGenOne = fuzzer.mutate.string(fuzzStrOne);
      var pass = i - loopStart + 1;

      await awaitFuzzPromise(truToken.approve(accountTwo, fuzzGenOne, { from: accountOne }));
      acctTwoAllowance = await truToken.allowance(accountOne, accountTwo);
      assert.equal(web3.fromWei(acctTwoAllowance, 'ether'),
        10,
        'FUZZTEST TEST CASE 11: Account Two has incorrect allowance after test #1, pass #' + pass + '.\n\
      EXPECTED RESULT: 10 TRU\n\
      ACTUAL RESULT: ' + web3.fromWei(acctTwoAllowance, 'ether'));


      await awaitFuzzPromise(truToken.approve(fuzzGenOne, tenTru, { from: accountOne }));
      acctTwoAllowance = await truToken.allowance(accountOne, accountTwo);
      assert.equal(web3.fromWei(acctTwoAllowance, 'ether'),
        10,
        'FUZZTEST TEST CASE 11: Account Two has incorrect allowance after test #2, pass #' + pass + '.\n\
      EXPECTED RESULT: 10 TRU\n\
      ACTUAL RESULT: ' + web3.fromWei(acctTwoAllowance, 'ether'));

      await awaitFuzzPromise(truToken.approve(accountTwo, tenTru, { from: fuzzGenOne }));
      acctTwoAllowance = await truToken.allowance(accountOne, accountTwo);
      assert.equal(web3.fromWei(acctTwoAllowance, 'ether'),
        10,
        'FUZZTEST TEST CASE 11: Account Two has incorrect allowance after test #3, pass #' + pass + '.\n\
      EXPECTED RESULT: 10 TRU\n\
      ACTUAL RESULT: ' + web3.fromWei(acctTwoAllowance, 'ether'));

      await awaitFuzzPromise(truToken.approve(fuzzGenOne, tenTru, { from: fuzzGenOne }));
      acctTwoAllowance = await truToken.allowance(accountOne, accountTwo);
      assert.equal(web3.fromWei(acctTwoAllowance, 'ether'),
        10,
        'FUZZTEST TEST CASE 11: Account Two has incorrect allowance after test #4, pass #' + pass + '.\n\
      EXPECTED RESULT: 10 TRU\n\
      ACTUAL RESULT: ' + web3.fromWei(acctTwoAllowance, 'ether'));

      await awaitFuzzPromise(truToken.approve(accountTwo, fuzzGenOne, { from: fuzzGenOne }));
      acctTwoAllowance = await truToken.allowance(accountOne, accountTwo);
      assert.equal(web3.fromWei(acctTwoAllowance, 'ether'),
        10,
        'FUZZTEST TEST CASE 11: Account Two has incorrect allowance after test #5, pass #' + pass + '.\n\
      EXPECTED RESULT: 10 TRU\n\
      ACTUAL RESULT: ' + web3.fromWei(acctTwoAllowance, 'ether'));

      await awaitFuzzPromise(truToken.approve(fuzzGenOne, fuzzGenOne, { from: accountOne }));
      acctTwoAllowance = await truToken.allowance(accountOne, accountTwo);
      assert.equal(web3.fromWei(acctTwoAllowance, 'ether'),
        10,
        'FUZZTEST TEST CASE 11: Account Two has incorrect allowance after test #5, pass #' + pass + '.\n\
      EXPECTED RESULT: 10 TRU\n\
      ACTUAL RESULT: ' + web3.fromWei(acctTwoAllowance, 'ether'));

      await awaitFuzzPromise(truToken.approve(fuzzGenOne, fuzzGenOne, { from: fuzzGenOne }));
      acctTwoAllowance = await truToken.allowance(accountOne, accountTwo);
      assert.equal(web3.fromWei(acctTwoAllowance, 'ether'),
        10,
        'FUZZTEST TEST CASE 11: Account Two has incorrect allowance after test #6, pass #' + pass + '.\n\
      EXPECTED RESULT: 10 TRU\n\
      ACTUAL RESULT: ' + web3.fromWei(acctTwoAllowance, 'ether'));
    }

    acctTwoAllowance = await truToken.allowance(accountOne, accountTwo);
    assert.equal(web3.fromWei(acctTwoAllowance, 'ether'),
      10,
      'FUZZTEST TEST CASE 11: Account Two has incorrect allowance after final pass.\n\
    EXPECTED RESULT: 10 TRU\n\
    ACTUAL RESULT: ' + web3.fromWei(acctTwoAllowance, 'ether'));
  });

  it('FAILURETESTS TEST CASE 12: Should fail on fuzz test of StandardToken increaseApproval with invalid arguments', async function() {
    var fuzzGenOne;
    let acctOneBalance = await truToken.balanceOf(accountOne);
    let acctTwoAllowance = await truToken.allowance(accountOne, accountTwo);
    assert.equal(web3.fromWei(acctOneBalance, 'ether'),
      100,
      'FAILURETESTS TEST CASE 12: Account One has wrong balance.\n\
    EXPECTED RESULT: 100 TRU; \n\
    ACTUAL RESULT: ' + web3.fromWei(acctOneBalance, 'ether'));
    assert.equal(web3.fromWei(acctTwoAllowance, 'ether'),
      10,
      'FUZZTEST TEST CASE 12: Account Two has incorrect allowance.\n\
    EXPECTED RESULT: 10 TRU\n\
    ACTUAL RESULT: ' + web3.fromWei(acctTwoAllowance, 'ether'));

    for (var i = loopStart; i < loopEnd; i++) {
      fuzzer.seed(i);
      var pass = i - loopStart + 1;
      fuzzGenOne = fuzzer.mutate.string(fuzzStrOne);

      await awaitFuzzPromise(truToken.increaseApproval(accountTwo, 10, { from: fuzzGenOne }));
      acctTwoAllowance = await truToken.allowance(accountOne, accountTwo);
      assert.equal(web3.fromWei(acctTwoAllowance, 'ether'),
        10,
        'FUZZTEST TEST CASE 12: Account Two has incorrect allowance after test #1, pass #' + pass + '.\n\
      EXPECTED RESULT: 10 TRU\n\
      ACTUAL RESULT: ' + web3.fromWei(acctTwoAllowance, 'ether'));

      await awaitFuzzPromise(truToken.increaseApproval(fuzzGenOne, 10, { from: accountOne }));
      acctTwoAllowance = await truToken.allowance(accountOne, accountTwo);
      assert.equal(web3.fromWei(acctTwoAllowance, 'ether'),
        10,
        'FUZZTEST TEST CASE 12: Account Two has incorrect allowance after test #2, pass #' + pass + '.\n\
      EXPECTED RESULT: 10 TRU\n\
      ACTUAL RESULT: ' + web3.fromWei(acctTwoAllowance, 'ether'));

      await awaitFuzzPromise(truToken.increaseApproval(accountTwo, fuzzGenOne, { from: accountOne }));
      acctTwoAllowance = await truToken.allowance(accountOne, accountTwo);
      assert.equal(web3.fromWei(acctTwoAllowance, 'ether'),
        10,
        'FUZZTEST TEST CASE 12: Account Two has incorrect allowance after test #3, pass #' + pass + '.\n\
      EXPECTED RESULT: 10 TRU\n\
      ACTUAL RESULT: ' + web3.fromWei(acctTwoAllowance, 'ether'));

      await awaitFuzzPromise(truToken.increaseApproval(fuzzGenOne, fuzzGenOne, { from: accountOne }));
      acctTwoAllowance = await truToken.allowance(accountOne, accountTwo);
      assert.equal(web3.fromWei(acctTwoAllowance, 'ether'),
        10,
        'FUZZTEST TEST CASE 12: Account Two has incorrect allowance after test #4, pass #' + pass + '.\n\
      EXPECTED RESULT: 10 TRU\n\
      ACTUAL RESULT: ' + web3.fromWei(acctTwoAllowance, 'ether'));

      await awaitFuzzPromise(truToken.increaseApproval(fuzzGenOne, fuzzGenOne, { from: fuzzGenOne }));
      acctTwoAllowance = await truToken.allowance(accountOne, accountTwo);
      assert.equal(web3.fromWei(acctTwoAllowance, 'ether'),
        10,
        'FUZZTEST TEST CASE 12: Account Two has incorrect allowance after test #5, pass #' + pass + '.\n\
      EXPECTED RESULT: 10 TRU\n\
      ACTUAL RESULT: ' + web3.fromWei(acctTwoAllowance, 'ether'));
    }
  });

  it('FAILURETESTS TEST CASE 13: Should fail on fuzz test of StandardToken decreaseApproval with invalid arguments', async function() {
    var fuzzGenOne;
    let acctOneBalance = await truToken.balanceOf(accountOne);
    let acctTwoAllowance = await truToken.allowance(accountOne, accountTwo);
    assert.equal(web3.fromWei(acctOneBalance, 'ether'),
      100,
      'FAILURETESTS TEST CASE 13: Account One has wrong balance.\n\
    EXPECTED RESULT: 100 TRU; \n\
    ACTUAL RESULT: ' + web3.fromWei(acctOneBalance, 'ether'));
    assert.equal(web3.fromWei(acctTwoAllowance, 'ether'),
      10,
      'FUZZTEST TEST CASE 13: Account Two has incorrect allowance.\n\
    EXPECTED RESULT: 10 TRU\n\
    ACTUAL RESULT: ' + web3.fromWei(acctTwoAllowance, 'ether'));

    for (var i = loopStart; i < loopEnd; i++) {
      fuzzer.seed(i);
      var pass = i - loopStart + 1;
      fuzzGenOne = fuzzer.mutate.string(fuzzStrOne);

      await awaitFuzzPromise(truToken.decreaseApproval(accountTwo, 10, { from: fuzzGenOne }));
      acctTwoAllowance = await truToken.allowance(accountOne, accountTwo);
      assert.equal(web3.fromWei(acctTwoAllowance, 'ether'),
        10,
        'FUZZTEST TEST CASE 13: Account Two has incorrect allowance after test #1, pass #' + pass + '.\n\
      EXPECTED RESULT: 10 TRU\n\
      ACTUAL RESULT: ' + web3.fromWei(acctTwoAllowance, 'ether'));

      await awaitFuzzPromise(truToken.decreaseApproval(fuzzGenOne, 10, { from: accountOne }));
      acctTwoAllowance = await truToken.allowance(accountOne, accountTwo);
      assert.equal(web3.fromWei(acctTwoAllowance, 'ether'),
        10,
        'FUZZTEST TEST CASE 13: Account Two has incorrect allowance after test #2, pass #' + pass + '.\n\
      EXPECTED RESULT: 10 TRU\n\
      ACTUAL RESULT: ' + web3.fromWei(acctTwoAllowance, 'ether'));

      await awaitFuzzPromise(truToken.decreaseApproval(accountTwo, fuzzGenOne, { from: accountOne }));
      acctTwoAllowance = await truToken.allowance(accountOne, accountTwo);
      assert.equal(web3.fromWei(acctTwoAllowance, 'ether'),
        10,
        'FUZZTEST TEST CASE 13: Account Two has incorrect allowance after test #3, pass #' + pass + '.\n\
      EXPECTED RESULT: 10 TRU\n\
      ACTUAL RESULT: ' + web3.fromWei(acctTwoAllowance, 'ether'));

      await awaitFuzzPromise(truToken.decreaseApproval(fuzzGenOne, fuzzGenOne, { from: accountOne }));
      acctTwoAllowance = await truToken.allowance(accountOne, accountTwo);
      assert.equal(web3.fromWei(acctTwoAllowance, 'ether'),
        10,
        'FUZZTEST TEST CASE 13: Account Two has incorrect allowance after test #4, pass #' + pass + '.\n\
      EXPECTED RESULT: 10 TRU\n\
      ACTUAL RESULT: ' + web3.fromWei(acctTwoAllowance, 'ether'));

      await awaitFuzzPromise(truToken.decreaseApproval(fuzzGenOne, fuzzGenOne, { from: fuzzGenOne }));
      acctTwoAllowance = await truToken.allowance(accountOne, accountTwo);
      assert.equal(web3.fromWei(acctTwoAllowance, 'ether'),
        10,
        'FUZZTEST TEST CASE 13: Account Two has incorrect allowance after test #5, pass #' + pass + '.\n\
      EXPECTED RESULT: 10 TRU\n\
      ACTUAL RESULT: ' + web3.fromWei(acctTwoAllowance, 'ether'));
    }
  });

  it('FAILURETESTS TEST CASE 14: Should fail on transferFrom of StandardToken with invalid arguments', async function() {
    var fuzzGenOne;
    let acctOneBalance = await truToken.balanceOf(accountOne);
    await truToken.setReleaseAgent(accountOne, { from: accountOne });
    await truToken.releaseTokenTransfer();

    assert.equal(web3.fromWei(acctOneBalance, 'ether'),
      100,
      'FAILURETESTS TEST CASE 14: Account One has wrong balance.\n\
    EXPECTED RESULT: 100 TRU; \n\
    ACTUAL RESULT: ' + web3.fromWei(acctOneBalance, 'ether'));

    var acctTwoBal = await truToken.balanceOf(accountTwo, { from: accountTwo });
    assert.equal(web3.fromWei(acctTwoBal, 'ether'),
      0,
      'FAILURETESTS TEST CASE 14: Account Two has wrong balance.\n\
    EXPECTED RESULT: 0 TRU; \n\
    ACTUAL RESULT: ' + web3.fromWei(acctTwoBal, 'ether'));

    let acctTwoAllowance = await truToken.allowance(accountOne, accountTwo);
    assert.equal(web3.fromWei(acctTwoAllowance, 'ether'),
      10,
      'FUZZTEST TEST CASE 14: Account Two has incorrect allowance.\n\
    EXPECTED RESULT: 10 TRU\n\
    ACTUAL RESULT: ' + web3.fromWei(acctTwoAllowance, 'ether'));

    let releasedStatus = await truToken.released.call();
    assert.isTrue(releasedStatus,
      'FUZZTEST TEST CASE 14: Token in incorrect release status.\n\
      ACTUAL RESULT: ' + releasedStatus);

    for (var i = loopStart; i < loopEnd; i++) {
      fuzzer.seed(i);
      var pass = i - loopStart + 1;
      fuzzGenOne = fuzzer.mutate.string(fuzzStrOne);

      await awaitFuzzPromise(truToken.transferFrom(fuzzGenOne, accountTwo, oneTru, { from: accountTwo }));

      await awaitFuzzPromise(truToken.transferFrom(accountOne, fuzzGenOne, oneTru, { from: accountTwo }));

      await awaitFuzzPromise(truToken.transferFrom(accountOne, accountTwo, fuzzGenOne, { from: accountTwo }));

      await awaitFuzzPromise(truToken.transferFrom(accountOne, accountTwo, oneTru, { from: fuzzGenOne }));

      await awaitFuzzPromise(truToken.transferFrom(fuzzGenOne, fuzzGenOne, oneTru, { from: accountTwo }));

      await awaitFuzzPromise(truToken.transferFrom(accountOne, fuzzGenOne, fuzzGenOne, { from: accountTwo }));

      await awaitFuzzPromise(truToken.transferFrom(accountOne, accountTwo, fuzzGenOne, { from: fuzzGenOne }));

      await awaitFuzzPromise(truToken.transferFrom(fuzzGenOne, accountTwo, fuzzGenOne, { from: accountTwo }));

      await awaitFuzzPromise(truToken.transferFrom(fuzzGenOne, accountTwo, oneTru, { from: fuzzGenOne }));

      await awaitFuzzPromise(truToken.transferFrom(accountOne, fuzzGenOne, oneTru, { from: fuzzGenOne }));

      await awaitFuzzPromise(truToken.transferFrom(fuzzGenOne, fuzzGenOne, oneTru, { from: fuzzGenOne }));

      await awaitFuzzPromise(truToken.transferFrom(accountOne, fuzzGenOne, fuzzGenOne, { from: fuzzGenOne }));
    }
  });

  it('FAILURETESTS TEST CASE 15: Should fail on fuzz test of BasicToken balanceOf with invalid arguments', async function() {
    var fuzzGenOne;

    for (var i = loopStart; i < loopEnd; i++) {
      fuzzer.seed(i);
      var pass = i - loopStart + 1;
      fuzzGenOne = fuzzer.mutate.string(fuzzStrOne);

      await awaitFuzzPromise(truToken.balanceOf(fuzzGenOne))
    }
  });

  it('FAILURETESTS TEST CASE 16: Should fail on transferOwnership of Ownable with invalid arguments', async function() {
    var fuzzGenOne;

    for (var i = loopStart; i < loopEnd; i++) {
      fuzzer.seed(i);
      var pass = i - loopStart + 1;
      fuzzGenOne = fuzzer.mutate.string(fuzzStrOne);

      await awaitFuzzPromise(truToken.transferOwnership(fuzzGenOne, { from: accountOne }))
      let tokenOwner = await truToken.owner.call();

      assert.equal(tokenOwner, accountOne,
        'FAILURETESTS TEST CASE 16: Tru Token has the wrong owner after test #1, pass #' + pass + '.\n\
      EXPECTED RESULT: ' + accountOne + '; \n\
      ACTUAL RESULT: ' + tokenOwner);

      await awaitFuzzPromise(truToken.transferOwnership(fuzzGenOne, { from: accountTwo }));
      tokenOwner = await truToken.owner.call();

      assert.equal(tokenOwner, accountOne,
        'FAILURETESTS TEST CASE 16: Tru Token has the wrong owner after test #2, pass #' + pass + '.\n\
      EXPECTED RESULT: ' + accountOne + '; \n\
      ACTUAL RESULT: ' + tokenOwner);
    }
  });

  it('FAILURETESTS TEST CASE 17: Should fail on fuzz test of UpgradeableToken setUpgradeAgent with invalid arguments', async function() {
    var fuzzGenOne;
    tempToken = await TruReputationToken.new({ from: accountOne });
    await tempToken.mint(maximumTru, accountOne, { from: accountOne })
    await tempToken.setTransferAgent(accountOne, true, { from: accountOne });
    await tempToken.finishMinting(true, false, { from: accountOne });
    await tempToken.finishMinting(false, true, { from: accountOne });
    await tempToken.setReleaseAgent(accountOne, { from: accountOne });
    await tempToken.releaseTokenTransfer();

    upgradeToken = await MockMigrationTarget.new(tempToken.address);
    let newSupply = await upgradeToken.originalSupply.call();
    let oldSupply = await tempToken.totalSupply.call();
    let newOwner = await upgradeToken.owner.call();

    assert.isTrue(newSupply.equals(oldSupply),
      'FAILURETESTS TEST CASE 17: Old Token and New Token supply do not match.\n\
    EXPECTED RESULT: ' + web3.fromWei(oldSupply, 'ether') + '; \n\
    ACTUAL RESULT: ' + web3.fromWei(newSupply, 'ether'));

    let isUpgradeAgent = await upgradeToken.isUpgradeAgent.call();
    assert.isTrue(isUpgradeAgent,
      'FAILURETESTS TEST CASE 17: New Token is not upgradeAgent.\n\
    EXPECTED RESULT: ' + web3.fromWei(oldSupply, 'ether') + '; \n\
    ACTUAL RESULT: ' + web3.fromWei(newSupply, 'ether'));

    for (var i = loopStart; i < loopEnd; i++) {
      fuzzer.seed(i);
      var pass = i - loopStart + 1;
      fuzzGenOne = fuzzer.mutate.string(fuzzStrOne);

      await awaitFuzzPromise(tempToken.setUpgradeAgent(fuzzGenOne, { from: fuzzGenOne }))

      await awaitFuzzPromise(tempToken.setUpgradeAgent(fuzzGenOne, { from: accountOne }))

      await awaitFuzzPromise(tempToken.setUpgradeAgent(accountOne, { from: fuzzGenOne }))
    }
  });

  it('FAILURETESTS TEST CASE 18: Should fail on fuzz test of UpgradeableToken setUpgradeMaster with invalid arguments', async function() {
    var fuzzGenOne;
    for (var i = loopStart; i < loopEnd; i++) {
      fuzzer.seed(i);
      var pass = i - loopStart + 1;
      fuzzGenOne = fuzzer.mutate.string(fuzzStrOne);

      await awaitFuzzPromise(tempToken.setUpgradeMaster(fuzzGenOne, { from: accountOne }));

      await awaitFuzzPromise(tempToken.setUpgradeMaster(accountOne, { from: fuzzGenOne }));

      await awaitFuzzPromise(tempToken.setUpgradeMaster(fuzzGenOne, { from: fuzzGenOne }));
    }
    let upgradeMaster = await tempToken.upgradeMaster.call();
    assert.equal(upgradeMaster, accountOne, 'Upgrade master is not account one');
  });

  it('FAILURETESTS TEST CASE 19: Should fail on fuzz test of UpgradeableToken upgrade with invalid arguments', async function() {
    var fuzzGenOne, upgradedTokens;
    for (var i = loopStart; i < loopEnd; i++) {
      fuzzer.seed(i);
      var pass = i - loopStart + 1;
      fuzzGenOne = fuzzer.mutate.string(fuzzStrOne);
      await awaitFuzzPromise(tempToken.upgrade(fuzzGenOne, { from: accountOne }));
      upgradedTokens = await upgradeToken.totalUpgraded.call();
      assert.equal(upgradedTokens, 0,
        'FAILURETESTS TEST CASE 19: Incorrect upgraded Amount after test #1, on pass #' + pass + '.\n\
        EXPECTED RESULT: 0 TRU ; \n\
        ACTUAL RESULT: ' + web3.fromWei(upgradedTokens, 'ether') + ' TRU');

      await awaitFuzzPromise(tempToken.upgrade(maximumTru, { from: fuzzGenOne }));
      upgradedTokens = await upgradeToken.totalUpgraded.call();
      assert.equal(upgradedTokens, 0,
        'FAILURETESTS TEST CASE 19: Incorrect upgraded Amount after test #2, on pass #' + pass + '.\n\
        EXPECTED RESULT: 0 TRU ; \n\
        ACTUAL RESULT: ' + web3.fromWei(upgradedTokens, 'ether') + ' TRU');

      await awaitFuzzPromise(tempToken.upgrade(fuzzGenOne, { from: fuzzGenOne }));
      upgradedTokens = await upgradeToken.totalUpgraded.call();
      assert.equal(upgradedTokens, 0,
        'FAILURETESTS TEST CASE 19: Incorrect upgraded Amount after test #3, on pass #' + pass + '.\n\
          EXPECTED RESULT: 0 TRU ; \n\
          ACTUAL RESULT: ' + web3.fromWei(upgradedTokens, 'ether') + ' TRU');
    }
    upgradedTokens = await tempToken.totalUpgraded.call();

    assert.equal(upgradedTokens, 0,
      'FAILURETESTS TEST CASE 19: Incorrect upgraded Amount post-tests.\n\
      EXPECTED RESULT: 0 TRU ; \n\
      ACTUAL RESULT: ' + web3.fromWei(upgradedTokens, 'ether') + ' TRU');
  });

  it('FAILURETESTS TEST CASE 20: Should fail on fuzz test of UpgradeableToken upgradeFrom with invalid arguments', async function() {
    var fuzzGenOne, upgradedTokens;
    for (var i = loopStart; i < loopEnd; i++) {
      fuzzer.seed(i);
      var pass = i - loopStart + 1;
      fuzzGenOne = fuzzer.mutate.string(fuzzStrOne);
      await awaitFuzzPromise(upgradeToken.upgradeFrom(accountOne, fuzzGenOne, { from: accountTwo }));
      upgradedTokens = await tempToken.totalUpgraded.call();
      assert.equal(upgradedTokens, 0,
        'FAILURETESTS TEST CASE 20: Incorrect upgraded Amount after test #1, on pass #' + pass + '.\n\
        EXPECTED RESULT: 0 TRU ; \n\
        ACTUAL RESULT: ' + web3.fromWei(upgradedTokens, 'ether') + ' TRU');

      await awaitFuzzPromise(upgradeToken.upgradeFrom(fuzzGenOne, maximumTru, { from: accountTwo }));
      upgradedTokens = await tempToken.totalUpgraded.call();
      assert.equal(upgradedTokens, 0,
        'FAILURETESTS TEST CASE 20: Incorrect upgraded Amount after test #2, on pass #' + pass + '.\n\
        EXPECTED RESULT: 0 TRU ; \n\
        ACTUAL RESULT: ' + web3.fromWei(upgradedTokens, 'ether') + ' TRU');

      await awaitFuzzPromise(upgradeToken.upgradeFrom(accountOne, maximumTru, { from: fuzzGenOne }));
      upgradedTokens = await tempToken.totalUpgraded.call();
      assert.equal(upgradedTokens, 0,
        'FAILURETESTS TEST CASE 20: Incorrect upgraded Amount after test #3, on pass #' + pass + '.\n\
          EXPECTED RESULT: 0 TRU ; \n\
          ACTUAL RESULT: ' + web3.fromWei(upgradedTokens, 'ether') + ' TRU');
    }
    upgradedTokens = await tempToken.totalUpgraded.call();

    assert.equal(upgradedTokens, 0,
      'FAILURETESTS TEST CASE 20: Incorrect upgraded Amount post-tests.\n\
      EXPECTED RESULT: 0 TRU ; \n\
      ACTUAL RESULT: ' + web3.fromWei(upgradedTokens, 'ether') + ' TRU');
  });

  it('FAILURETESTS TEST CASE 21: Should fail on fuzz of Ownable transferOwnership with invalid arguments', async function() {
    var fuzzGenOne, tokenOwner;
    for (var i = loopStart; i < loopEnd; i++) {
      fuzzer.seed(i);
      var pass = i - loopStart + 1;
      fuzzGenOne = fuzzer.mutate.string(fuzzStrOne);

      await awaitFuzzPromise(tempToken.transferOwnership(fuzzGenOne, { from: accountOne }))
      tokenOwner = await tempToken.owner.call();
      assert.equal(tokenOwner,
        accountOne,
        'FAILURETESTS TEST CASE 21: Incorrect Token Owner after test #1, on pass #' + pass + '.\n\
        EXPECTED RESULT: ' + accountOne + '; \n\
        ACTUAL RESULT: ' + tokenOwner);

      await awaitFuzzPromise(tempToken.transferOwnership(accountOne, { from: fuzzGenOne }))
      tokenOwner = await tempToken.owner.call();
      assert.equal(tokenOwner,
        accountOne,
        'FAILURETESTS TEST CASE 21: Incorrect Token Owner after test #2, on pass #' + pass + '.\n\
        EXPECTED RESULT: ' + accountOne + '; \n\
        ACTUAL RESULT: ' + tokenOwner);
    }
  });

  it('FAILURETESTS TEST CASE 22: Should not fail performing 1,000 transfer() transactions of 1 TRU between accounts', async function() {

    for (var i = loopStart; i < loopEnd; i++) {
      var pass = i - loopStart + 1;
      if (isEven(pass)) {
        // Transfer from Account two to one
        await truToken.transfer(accountOne, oneTru, { from: accountTwo })
      } else {
        // Transfer from Account one to two
        await truToken.transfer(accountTwo, oneTru, { from: accountOne })
      }
    }
  });

  it('FAILURETESTS TEST CASE 23: Should not fail performing 1,000 transferFrom() transactions of 1 TRU between accounts', async function() {
    for (var i = loopStart; i < loopEnd; i++) {
      var pass = i - loopStart + 1;
      if (isEven(pass)) {
        // Transfer from Account two to one by Account One
        await truToken.approve(accountOne, oneTru, { from: accountTwo });
        await truToken.transferFrom(accountTwo, accountOne, oneTru, { from: accountOne })
      } else {
        // Transfer from Account one to two by Account Two
        await truToken.approve(accountTwo, oneTru, { from: accountOne });
        await truToken.transferFrom(accountOne, accountTwo, oneTru, { from: accountTwo })
      }
    }
  });

  it('FAILURETESTS TEST CASE 24: Should not fail performing 1,000 transfer() transactions of 300,000,000 TRU between accounts', async function() {
    // Reinitialize Temp Token
    tempToken = await TruReputationToken.new({ from: accountOne });
    await tempToken.mint(accountOne, maximumTru, { from: accountOne });
    await tempToken.finishMinting(true, false, { from: accountOne });
    await tempToken.finishMinting(false, true, { from: accountOne });
    await tempToken.setReleaseAgent(accountOne, { from: accountOne });
    await tempToken.releaseTokenTransfer();

    for (var i = loopStart; i < loopEnd; i++) {
      var pass = i - loopStart + 1;
      if (isEven(pass)) {
        // Transfer from Account two to one
        await tempToken.transfer(accountOne, maximumTru, { from: accountTwo })
      } else {
        // Transfer from Account one to two
        await tempToken.transfer(accountTwo, maximumTru, { from: accountOne })
      }
    }
  });

  it('FAILURETESTS TEST CASE 25: Should not fail performing 1,000 transferFrom() transactions of 300,000,000 TRU between accounts', async function() {

    for (var i = loopStart; i < loopEnd; i++) {
      var pass = i - loopStart + 1;
      if (isEven(pass)) {
        // Transfer from Account two to one by Account One
        await tempToken.approve(accountOne, maximumTru, { from: accountTwo });
        await tempToken.transferFrom(accountTwo, accountOne, maximumTru, { from: accountOne })
      } else {
        // Transfer from Account one to two by Account Two
        await tempToken.approve(accountTwo, maximumTru, { from: accountOne });
        await tempToken.transferFrom(accountOne, accountTwo, maximumTru, { from: accountTwo })
      }
    }
  });

  it('FAILURETESTS TEST CASE 26: Should fail to perform upgrade on token with different original supply', async function() {

  });
});

contract('TruPreSale', function(accounts) {

  let tenTru = web3.toWei(10, 'ether');
  let oneTru = web3.toWei(1, 'ether');
  let truToken;
  let psStartTime;
  let psEndTime;
  let _msWallet = accounts[0];
  let preSale;
  let accountOne = accounts[0];
  let accountTwo = accounts[1];
  let execAccount = accounts[2];
  let execAccountTwo = accounts[3];
  let accountFive = accounts[4];

  fuzzer.seed(0);
  it('FAILURETESTS TEST CASE xx: should fail on fuzz test on TruPreSale Constructor with invalid parameters', async function() {
    var fuzzGenOne, fuzzGenTwo;
    let currentTime = web3.eth.getBlock('latest').timestamp;
    // Setup Tru Token
    truToken = await TruReputationToken.new({ from: accountOne });

    // Fuzzing
    for (var i = loopStart; i < loopEnd; i++) {
      var pass = i - loopStart + 1;
      fuzzGenOne = fuzzer.mutate.string(fuzzStrOne);
      fuzzGenTwo = fuzzer.mutate.string(fuzzStrTwo);
      let validStart = currentTime + 6000000;
      let validExpiry = validStart + 6000000;

      await awaitFuzzPromise(TruPreSale.new(fuzzGenOne, validExpiry, truToken.address, { from: accountOne }))
      await awaitFuzzPromise(TruPreSale.new(validStart, fuzzGenTwo, truToken.address, { from: accountOne }))
      await awaitFuzzPromise(TruPreSale.new(validStart, validExpiry, fuzzGenOne, { from: accountOne }))
      await awaitFuzzPromise(TruPreSale.new(validStart, validExpiry, truToken.address, { from: fuzzGenOne }))
      await awaitFuzzPromise(TruPreSale.new(fuzzGenOne, fuzzGenTwo, truToken.address, { from: accountOne }))
      await awaitFuzzPromise(TruPreSale.new(fuzzGenOne, validExpiry, fuzzGenTwo, { from: accountOne }))
      await awaitFuzzPromise(TruPreSale.new(fuzzGenOne, validExpiry, truToken.address, { from: fuzzGenOne }))
      await awaitFuzzPromise(TruPreSale.new(validStart, fuzzGenOne, truToken.address, { from: fuzzGenOne }))
      await awaitFuzzPromise(TruPreSale.new(validStart, validExpiry, fuzzGenOne, { from: fuzzGenTwo }))
      await awaitFuzzPromise(TruPreSale.new(fuzzGenOne, validExpiry, fuzzGenOne, { from: fuzzGenTwo }))
      await awaitFuzzPromise(TruPreSale.new(validStart, fuzzGenOne, fuzzGenOne, { from: fuzzGenTwo }))
      await awaitFuzzPromise(TruPreSale.new(fuzzGenOne, fuzzGenTwo, truToken.address, { from: fuzzGenTwo }))
      await awaitFuzzPromise(TruPreSale.new(fuzzGenOne, fuzzGenTwo, fuzzGenOne, { from: accountOne }))
      await awaitFuzzPromise(TruPreSale.new(fuzzGenOne, fuzzGenTwo, fuzzGenOne, { from: fuzzGenTwo }))
    }
  });

  // UpdateWhiteList

  // BuyTruTokens

  // buy

  //
});

/*contract('TruCrowdSale', function(accounts) {

});*/