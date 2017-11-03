/*'use strict';

import { increaseTime, increaseTimeTo, duration } from './helpers/increaseTime'
import latestTime from './helpers/latestTime';
import EVMThrow from './helpers/EVMThrow';
import expectThrow from './helpers/expectThrow';

const TruReputationToken = artifacts.require('./TruReputationToken.sol');
const TruSale = artifacts.require('./TruSale.sol');
const TruPreSale = artifacts.require('./TruPreSale.sol');
const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

contract('TruPreSale', function(accounts) {

  let truToken;
  let psInst;
  let psAddress;

  let acctOne = accounts[0];
  let acctTwo = accounts[1];
  let acctThree = accounts[2];
  let acctFour = accounts[3];
  let acctFive = accounts[4];

  let acctOneBal;
  let acctTwoBal;
  let pSaleRate;
  let tokenSupply;
  let psCap;
  let psMaxPurchase;
  let psMinPurchase;

  let halfEth = web3.toWei(0.5, 'ether');
  let oneEth = web3.toWei(1, 'ether');
  let twoEth = web3.toWei(2, 'ether');
  let fiftyOneEth = web3.toWei(51, 'ether');
  let preSaleCap = new BigNumber(web3.toWei(12000, 'ether'));

  let preSaleTokenCount = new BigNumber(web3.toWei(15000000, 'ether'));
  let saleTokenCount = new BigNumber(web3.toWei(135000000, 'ether'));

  // Mock Pre-Sale Initialization Parameters
  let psStartTime;
  let psEndTime;
  let _msWallet = accounts[0];

  console.log('PreSales Test: ', web3.eth.getBlock('latest').timestamp);
  // PRESALETESTS TEST CASE 01: Cannot deploy TruPreSale with incorrect variables
  it('PRESALETESTS TEST CASE 01: Cannot deploy TruPreSale with incorrect variables', async function() {
    console.log('PreSale Init Timestamp: ', web3.eth.getBlock('latest').timestamp);
    psStartTime = web3.eth.getBlock('latest').timestamp + 6000000;
    console.log('PreSale psStartTime: ', psStartTime);
    psEndTime = psStartTime + 6000000;

    truToken = await TruReputationToken.new({ from: acctOne });

    let expiredTS = 1509336360;

    // Should fail to create Pre-Sale with expired psStartTime
    await TruPreSale.new(expiredTS, psEndTime, truToken.address).should.be.rejectedWith(EVMThrow);

    // Should fail to create Pre-Sale with psEndTime before psStartTime
    await TruPreSale.new(psEndTime, psStartTime, truToken.address).should.be.rejectedWith(EVMThrow);

    // Should fail to create Pre-Sale with invalid Tru Token
    await TruPreSale.new(psStartTime, psEndTime, 0x0).should.be.rejectedWith(EVMThrow);

  });


  // PRESALETESTS TEST CASE 02: TruPreSale and TruReputationToken are deployed
  it('PRESALETESTS TEST CASE 02: TruPreSale and TruReputationToken are deployed', async function() {
    psInst = await TruPreSale.new(psStartTime, psEndTime, truToken.address);
    tokenSupply = await truToken.totalSupply.call();
    psAddress = psInst.address;
    pSaleRate = await psInst.preSaleRate.call();

    assert.isTrue(tokenSupply.equals(0),
      'Incorrect tokenSupply set for TruReputationToken. EXPECTED RESULT: 0; \
      ACTUAL RESULT: ' + tokenSupply.toFormat(0));

    assert.isTrue(pSaleRate.equals(1250),
      'pSaleRate incorrect. Should be 1250 TRU per ETH. \
      Returning as ' + pSaleRate.toFormat(0));
  });


  // PRESALETESTS TEST CASE 03: Fallback function should revert
  it('PRESALETESTS TEST CASE 03: Fallback function should revert', async function() {
    try {
      await web3.eth.sendTransaction({ from: acctOne, to: psAddress, value: web3.toWei(1, 'ether') })
    } catch (error) {
      const invalidOpcode = error.message.search('invalid opcode') >= 0;
      const outOfGas = error.message.search('out of gas') >= 0;
      assert(
        invalidOpcode || outOfGas,
        "Expected throw, got '" + error + "' instead",
      );
    }
  });

  // PRESALETESTS TEST CASE 04: Pre-Sale hard variables are as expected
  it('PRESALETESTS TEST CASE 04: Pre-Sale hard variables are as expected', async function() {
    psMinPurchase = await psInst.minimumAmount.call();
    psMaxPurchase = await psInst.maxAmount.call();
    psCap = await psInst.cap.call();

    assert.equal(web3.fromWei(psMinPurchase, 'ether'),
      1,
      'Incorrect Minimum Purchase Amount for TruReputationToken. EXPECTED RESULT: 1; \
      ACTUAL RESULT: ' + web3.fromWei(psMinPurchase, 'ether'));

    assert.equal(web3.fromWei(psMaxPurchase, 'ether'),
      30,
      'Incorrect Maximum Purchase Amount for TruReputationToken. EXPECTED RESULT: 30; \
      ACTUAL RESULT: ' + web3.fromWei(psMaxPurchase, 'ether'));

    assert.equal(web3.fromWei(psCap, 'ether'),
      12000,
      'Incorrect Cap for TruReputationToken. EXPECTED RESULT: 12500; \
      ACTUAL RESULT: ' + web3.fromWei(psCap, 'ether'));
  });

  // PRESALETESTS TEST CASE 05: Set Release Agent for TruReputationToken
  it('PRESALETESTS TEST CASE 05: Set Release Agent for TruReputationToken', async function() {
    await truToken.setReleaseAgent(psAddress, { from: acctOne });
    let agent = await truToken.releaseAgent.call();

    assert.equal(agent,
      psAddress,
      'Incorrect Release Agent set for TruReputationToken. EXPECTED RESULT: ' + psAddress + '; \
      ACTUAL RESULT: ' + agent);
  });

  // PRESALETESTS TEST CASE 06: Transfer TruReputationToken ownership to Pre-Sale
  it('PRESALETESTS TEST CASE 06: Transfer TruReputationToken ownership to Pre-Sale', async function() {
    await truToken.transferOwnership(psAddress);

    let tokenOwner = await truToken.owner.call();
    let psOwner = await psInst.owner.call();
    assert.equal(tokenOwner,
      psAddress,
      'Incorrect owner set for TruReputationToken. EXPECTED RESULT: ' + psAddress + '\
      ACTUAL RESULT: ' + tokenOwner);

    assert.equal(psOwner,
      acctOne,
      'Incorrect owner set for TruPreSale. EXPECTED RESULT: ' + acctOne + '\
      ACTUAL RESULT: ' + psOwner);
  });

  // PRESALETESTS TEST CASE 07: Can Add Purchaser to Purchaser Whitelist
  it('PRESALETESTS TEST CASE 07: Can Add Purchaser to Purchaser Whitelist', async function() {
    var wlWatch = psInst.UpdateWhitelist();
    await psInst.updateWhitelist(acctThree, true);
    var watchResult = wlWatch.get();
    var whiteListed = await psInst.purchaserWhiteList(acctThree);

    assert.equal(watchResult.length,
      1,
      'Incorrect Whitelist Event length for TruPreSale. EXPECTED RESULT: 1\
      ACTUAL RESULT: ' + watchResult.length);

    assert.equal(watchResult[0].args._whitelistStatus,
      true,
      'Incorrect status on Whitelist entry for TruPreSale. EXPECTED RESULT: true\
      ACTUAL RESULT: ' + watchResult[0].args._whitelistStatus);

    assert.equal(watchResult[0].args._purchaserAddress,
      acctThree,
      'Incorrect Whitelist entry for TruPreSale. EXPECTED RESULT: ' + acctThree + '\
      ACTUAL RESULT: ' + watchResult[0].args._purchaserAddress);

    assert.equal(whiteListed,
      true,
      'Address is not on Whitelist for TruPreSale. EXPECTED RESULT: true\
      ACTUAL RESULT: ' + whiteListed);

  });

  // PRESALETESTS TEST CASE 08: Can Remove Purchaser from Purchaser Whitelist
  it('PRESALETESTS TEST CASE 08: Can Remove Purchaser from Purchaser Whitelist', async function() {

    var wlWatch = psInst.UpdateWhitelist();
    await psInst.updateWhitelist(acctThree, false);
    var watchResult = wlWatch.get();
    var notWhiteListed = await psInst.purchaserWhiteList(acctThree);

    assert.equal(watchResult.length,
      1,
      'Incorrect Whitelist Event length for TruPreSale. EXPECTED RESULT: 1\
      ACTUAL RESULT: ' + watchResult.length);

    assert.equal(watchResult[0].args._whitelistStatus,
      false,
      'Incorrect status on Whitelist entry for TruPreSale. EXPECTED RESULT: false\
      ACTUAL RESULT: ' + watchResult[0].args._whitelistStatus);

    assert.equal(watchResult[0].args._purchaserAddress,
      acctThree,
      'Incorrect Whitelist entry for TruPreSale. EXPECTED RESULT: ' + acctThree + '\
      ACTUAL RESULT: ' + watchResult[0].args._purchaserAddress);
  });

  // PRESALETESTS TEST CASE 09: Cannot purchase before start of Pre-Sale
  it('PRESALETESTS TEST CASE 09: Cannot purchase before start of Pre-Sale', async function() {

    await psInst.buy({ from: acctTwo, value: oneEth }).should.be.rejectedWith(EVMThrow);

    let fundsRaised = await psInst.weiRaised.call();
    let fundsRaisedEth = web3.fromWei(fundsRaised, 'ether');

    assert.equal(fundsRaisedEth,
      0,
      'Incorrect Funds Raised value for TruPreSale. EXPECTED RESULT: 0 ETH\
   ACTUAL RESULT: ' + fundsRaised + ' ETH');
  });

  // PRESALETESTS TEST CASE 10: Cannot purchase below minimum purchase amount
  it('PRESALETESTS TEST CASE 10: Cannot purchase below minimum purchase amount', async function() {
    await psInst.buy({ from: acctTwo, value: halfEth }).should.be.rejectedWith(EVMThrow)
    let fundsRaised = await psInst.weiRaised.call();
    let fundsRaisedEth = web3.fromWei(fundsRaised, 'ether');

    assert.equal(fundsRaisedEth,
      0,
      'Incorrect Funds Raised value for TruPreSale. EXPECTED RESULT: 0 Wei\
      ACTUAL RESULT: ' + fundsRaised + ' Wei');
  });

  // PRESALETESTS TEST CASE 11: Cannot purchase above maximum purchase amount if not on Whitelist
  it('PRESALETESTS TEST CASE 11: Cannot purchase above maximum purchase amount if not on Whitelist', async function() {
    let duringPreSale = psStartTime + 3000000;
    await increaseTimeTo(duringPreSale);
    await psInst.buy({ from: acctTwo, value: fiftyOneEth }).should.be.rejectedWith(EVMThrow)
    let fundsRaised = await psInst.weiRaised.call();
    let fundsRaisedEth = new BigNumber(web3.fromWei(fundsRaised, 'ether'));

    assert.isTrue(fundsRaisedEth.equals(0),
      'Incorrect Funds Raised value for TruPreSale. \n\
      EXPECTED RESULT: 0 Wei\n\
      ACTUAL RESULT: ' + fundsRaised + ' Wei');

    await psInst.buy({ from: acctThree, value: web3.toWei(29, 'ether') })
    await psInst.buy({ from: acctThree, value: web3.toWei(29, 'ether') }).should.be.rejectedWith(EVMThrow)

    let tokensSold = await psInst.soldTokens.call();
    let soldTokens = new BigNumber(web3.fromWei(tokensSold, 'ether'));
    let estSold = pSaleRate.mul(29);

    assert.isTrue(soldTokens.equals(estSold),
      'Incorrect purchase balance. \n\
      EXPECTED RESULT : ' + estSold.toFormat(0) + ' ETH; \n\
      ACTUAL RESULT: ' + soldTokens + ' ETH'
    );
  });

  // PRESALETESTS TEST CASE 12: Can purchase above maximum purchase amount if on Whitelist
  it('PRESALETESTS TEST CASE 12: Can purchase above maximum purchase amount if on Whitelist', async function() {
    await psInst.updateWhitelist(acctTwo, true);

    await psInst.buy({ from: acctTwo, value: fiftyOneEth })
    let fundsRaised = await psInst.weiRaised.call();

    let fundsRaisedEth = new BigNumber(web3.fromWei(fundsRaised.toNumber(), 'ether'));

    assert.isTrue(fundsRaisedEth.equals(80),
      'Incorrect Funds Raised value for TruPreSale. \n\
      EXPECTED RESULT: 80 ETH\n\
      ACTUAL RESULT: ' + fundsRaisedEth.toFormat(0) + ' ETH');

    tokenSupply = await truToken.totalSupply.call();
    let estSold = pSaleRate.mul(29);
    let newSold = pSaleRate.mul(51);
    estSold = estSold.add(newSold)
    let adjustedSupply = new BigNumber(web3.fromWei(tokenSupply, 'ether'));

    assert.isTrue(adjustedSupply.equals(estSold),
      'Incorrect Token Supply value for TruPreSale. \n\
      EXPECTED RESULT: ' + estSold.toFormat(0) + ' TRU; \n\
      ACTUAL RESULT: ' + adjustedSupply.toFormat(0) + ' TRU');
  });

  // PRESALETESTS TEST CASE 13: Can halt Pre-Sale in an emergency
  it('PRESALETESTS TEST CASE 13: Can halt Pre-Sale in an emergency', async function() {
    await psInst.halt({ from: acctOne });
    await psInst.buy({ from: acctOne, value: oneEth }).should.be.rejectedWith(EVMThrow);
    let fundsRaised = await psInst.weiRaised.call();

    let fundsRaisedEth = web3.fromWei(fundsRaised, 'ether');
    let haltStatus = await psInst.halted.call();
    let estSold = new BigNumber(29 * pSaleRate);
    let newSold = new BigNumber(51 * pSaleRate);
    estSold = estSold.add(newSold)

    assert.equal(haltStatus,
      true,
      'Incorrect Halt Status for TruPreSale. EXPECTED RESULT: true\
     ACTUAL RESULT: ' + haltStatus);

    assert.equal(fundsRaisedEth,
      80,
      'Incorrect Funds Raised value for TruPreSale. EXPECTED RESULT: 80 ETH\
      ACTUAL RESULT: ' + fundsRaisedEth + ' ETH');


    tokenSupply = await truToken.totalSupply.call()
    let normalisedSupply = new BigNumber(web3.fromWei(tokenSupply.toNumber(), 'ether'));
    assert.isTrue(normalisedSupply.equals(estSold),
      'Incorrect Funds Raised value for TruPreSale. EXPECTED RESULT: ' + estSold.toFormat(0) + ' TRU;\
      ACTUAL RESULT: ' + normalisedSupply.toFormat(0));

    await psInst.unhalt({ from: acctOne })
    let haltStatusTwo = await psInst.halted.call();

    assert.equal(haltStatusTwo,
      false,
      'Incorrect Halt Status for TruPreSale. EXPECTED RESULT: false\
     ACTUAL RESULT: ' + haltStatus);
  });

  // PRESALETESTS TEST CASE 14: Tokens cannot be transferred before Pre-Sale is finalised
  it('PRESALETESTS TEST CASE 14: Tokens cannot be transferred before Pre-Sale is finalised', async function() {

    let acctThreeOrgBalance = await truToken.balanceOf(acctThree);
    let transferAmount = web3.toWei(pSaleRate, 'ether')
    await truToken.transfer(acctThree, transferAmount, { from: acctOne }).should.be.rejectedWith(EVMThrow);
    let acctThreeBalance = await truToken.balanceOf(acctThree);

    assert.isTrue(acctThreeBalance.equals(acctThreeOrgBalance),
      'Incorrect Balance for Account 3 for TruPreSale. \
      EXPECTED RESULT: ' + web3.fromWei(acctThreeOrgBalance, 'ether') + ' TRU; \
      ACTUAL RESULT: ' + web3.fromWei(acctThreeBalance, 'ether') + ' TRU');
  });

  // PRESALETESTS TEST CASE 15: Only nominated Release Agent can make Tokens transferable
  it('PRESALETESTS TEST CASE 15: Only nominated Release Agent can make Tokens transferable', async function() {
    // Verify token is not in released state
    let tokensTransferable = await truToken.released.call();

    assert.equal(tokensTransferable,
      false,
      'Incorrect Released State for TruReputationToken. EXPECTED RESULT: false\
    ACTUAL RESULT: ' + tokensTransferable);

    // PreSale Owner cannot release tokens
    await truToken.releaseTokenTransfer({ from: acctOne }).should.be.rejectedWith(EVMThrow);

    tokensTransferable = await truToken.released.call();

    assert.equal(tokensTransferable,
      false,
      'Incorrect Released State for TruReputationToken. EXPECTED RESULT: false\
    ACTUAL RESULT: ' + tokensTransferable);
  });

  // PRESALETESTS TEST CASE 16: Only Token Owner can mint Tokens
  it('PRESALETESTS TEST CASE 16: Only Token Owner can mint Tokens', async function() {
    let originalSupply = await truToken.totalSupply.call();
    await truToken.mint(psAddress, 20000, { from: acctOne }).should.be.rejectedWith(EVMThrow);

    tokenSupply = await truToken.totalSupply.call();

    assert.isTrue(tokenSupply.equals(originalSupply),
      'Incorrect Total Supply of Token- should not have minted. \
      EXPECTED RESULT:' + web3.fromWei(originalSupply.toNumber(), 'ether') + ' TRU;\
      ACTUAL RESULT: ' + web3.fromWei(tokenSupply.toNumber(), 'ether') + ' TRU');
  });

  // PRESALETESTS TEST CASE 17: Has correct Purchaser count
  it('PRESALETESTS TEST CASE 17: Has correct Purchaser count', async function() {
    let noOfPurchasers = await psInst.purchaserCount.call();
    assert.equal(noOfPurchasers.toNumber(),
      2,
      'Incorrect number of purchasers for Pre-Sale. \
      EXPECTED RESULT: 2\
    ACTUAL RESULT: ' + noOfPurchasers.toNumber());
  });

  // PRESALETESTS TEST CASE 18: Cannot buy more than cap
  it('PRESALETESTS TEST CASE 18: Cannot buy more than cap', async function() {
    let preRaisedFunds = await psInst.weiRaised.call();

    let moreThanCap = web3.toWei(13000, 'ether');

    await psInst.buy({ from: acctThree, value: moreThanCap }).should.be.rejectedWith(EVMThrow);
    let postRaisedFunds = await psInst.weiRaised.call();

    assert.equal(web3.toWei(postRaisedFunds.toNumber(), 'ether'),
      web3.toWei(preRaisedFunds.toNumber()),
      'Raised Funds for Pre-Sale is incorrect. \
      EXPECTED RESULT: ' + web3.toWei(preRaisedFunds.toNumber(), 'ether') + '; \
      ACTUAL RESULT: ' + web3.toWei(postRaisedFunds.toNumber(), 'ether'));
  });

  // PRESALETESTS TEST CASE 19: PreSale owner cannot finalise a Pre-Sale before it ends
  it('PRESALETESTS TEST CASE 19: PreSale owner cannot finalise a Pre-Sale before it ends', async function() {
    let isComplete = await psInst.isCompleted.call();

    assert.isFalse(isComplete,
      'Incorrect Pre-Sale Completion Status. EXPECTED RESULT: false; \
      ACTUAL RESULT: ' + isComplete);

    await psInst.finalise({ from: acctOne }).should.be.rejectedWith(EVMThrow);

    let isCompleteTwo = await psInst.isCompleted.call();

    assert.isFalse(isCompleteTwo,
      'Incorrect Pre-Sale Completion Status. EXPECTED RESULT: false; \
          ACTUAL RESULT: ' + isCompleteTwo);
  });

  // PRESALETESTS TEST CASE 20: Cannot buy with invalid address
  it('PRESALETESTS TEST CASE 20: Cannot buy with invalid address', async function() {
    let invalidAddr = acctFive;
    invalidAddr = 0x0;
    try {
      await psInst.buy({ from: invalidAddr, value: oneEth });
    } catch (error) {
      const invalidAddress = error.message.search('invalid address') >= 0;
      assert(
        invalidAddress,
        "Expected require, got '" + error + "' instead",
      );
    }

    await psInst.buyTruTokens(invalidAddr, { from: acctFive, value: oneEth }).should.be.rejectedWith(EVMThrow);
  });

  // PRESALETESTS TEST CASE 21: Cannot buy 0 amount
  it('PRESALETESTS TEST CASE 21: Cannot buy 0 amount', async function() {
    await psInst.buy({ from: acctThree, value: 0 }).should.be.rejectedWith(EVMThrow);
  });

  // PRESALETESTS TEST CASE 22: Can buy repeatedly from the same address
  it('PRESALETESTS TEST CASE 22: Can buy repeatedly from the same address', async function() {
    let oldSupply = await truToken.totalSupply.call();
    await psInst.updateWhitelist(acctFour, true);
    let acctFourBal = await truToken.balanceOf(acctFour);
    await psInst.buy({ from: acctFour, value: fiftyOneEth })
    await psInst.buy({ from: acctFour, value: web3.toWei(1, 'ether') })

    let estSupply = oldSupply.add(fiftyOneEth * pSaleRate);
    estSupply = estSupply.add((web3.toWei(1, 'ether') * pSaleRate));
    tokenSupply = await truToken.totalSupply.call();
    acctFourBal = await truToken.balanceOf(acctFour);
    let purchasedTru = 52 * pSaleRate;
    let acctBalance = new BigNumber(web3.toWei(purchasedTru, 'ether'));

    assert.equal(tokenSupply.toNumber(),
      estSupply,
      'Token Supply is incorrect. \
      EXPECTED RESULT: ' + estSupply + ' TRU; \
      ACTUAL RESULT: ' + web3.fromWei(tokenSupply.toNumber(), 'ether') + ' TRU');

    assert.isTrue(acctFourBal.equals(acctBalance),
      'Account 4 Balance is incorrect. \
      EXPECTED RESULT: ' + web3.fromWei(acctBalance.toNumber(), 'ether') + ' TRU; \
      ACTUAL RESULT: ' + web3.fromWei(acctFourBal.toNumber(), 'ether') + ' TRU');
  });

  // PRESALETESTS TEST CASE 23: Can buy up to the cap on the Pre-Sale
  it('PRESALETESTS TEST CASE 23: Can buy up to the cap on the Pre-Sale', async function() {
    let raisedFunds = await psInst.weiRaised.call();
    let raisedEth = new BigNumber(web3.fromWei(raisedFunds, 'ether'));

    let soldTokens = await psInst.soldTokens.call();
    let remainingCap = preSaleCap.sub(raisedFunds);
    let remainingTokens = preSaleTokenCount.sub(soldTokens);
    let estSoldTokens = new BigNumber(web3.toWei(pSaleRate.mul(raisedEth.toNumber()), 'ether'));

    let estRemainingTokens = preSaleTokenCount.sub(estSoldTokens);
    estRemainingTokens = new BigNumber(web3.fromWei(estRemainingTokens, 'ether'));

    let estValue = web3.toWei(raisedEth.toNumber(), 'ether');

    assert.isTrue(raisedFunds.equals(estValue),
      'Raised value is not 132 ETH. \n\
      EXPECTED RESULT: 132 ETH; \n\
      ACTUAL RESULT: ' + web3.fromWei(raisedFunds.toNumber(), 'ether'));

    let rTruTokens = new BigNumber(web3.fromWei(remainingTokens, 'ether'));

    assert.isTrue(rTruTokens.equals(estRemainingTokens),
      'Remaining Tokens is not as expected. \n\
      EXPECTED RESULT: ' + estRemainingTokens.toFormat(0) + ' TRU; \n\
      ACTUAL RESULT: ' + rTruTokens.toFormat(0) + ' TRU');

    await psInst.updateWhitelist(acctThree, true);

    await psInst.buy({ from: acctThree, value: remainingCap.toNumber() });
    raisedFunds = await psInst.weiRaised.call();

    let acctTwoBal = await truToken.balanceOf(acctTwo);
    let acctThreeBal = await truToken.balanceOf(acctThree);
    tokenSupply = await truToken.totalSupply.call();

    assert.isTrue(raisedFunds.equals(preSaleCap),
      'Raised value is not 12500. \n\
      EXPECTED RESULT: 12500 ETH; \n\
      ACTUAL RESULT: ' + web3.fromWei(raisedFunds.toNumber(), 'ether') + ' ETH');

    assert.isTrue(tokenSupply.equals(preSaleTokenCount),
      'Incorrect Balance for Token supply for TruPreSale. \n\
      EXPECTED RESULT: 15000000 TRU; \
      ACTUAL RESULT: ' + web3.fromWei(tokenSupply.toNumber(), 'ether') + ' TRU');
  });

  // PRESALETESTS TEST CASE 24: Cannot buy once the cap is reached on the Pre-Sale
  it('PRESALETESTS TEST CASE 24: Cannot buy once the cap is reached on the Pre-Sale', async function() {
    await psInst.buy({ from: acctOne, value: 1 }).should.be.rejectedWith(EVMThrow);

    let raisedFunds = await psInst.weiRaised.call();
    tokenSupply = await truToken.totalSupply.call();
    raisedFunds = web3.fromWei(raisedFunds, 'ether');
    let adjustedCap = web3.fromWei(preSaleCap, 'ether');
    let adjustedSupply = web3.fromWei(tokenSupply, 'ether');

    assert.isTrue(raisedFunds.equals(adjustedCap),
      'Raised does not match cap. \
      EXPECTED RESULT: ' + adjustedCap.toFormat(0) + ' ETH; \
      ACTUAL RESULT: ' + raisedFunds.toFormat(0) + 'ETH');

    assert.isTrue(adjustedSupply.equals(web3.fromWei(preSaleTokenCount, 'ether')),
      'Total Token Supply is incorrect. \
      EXPECTED RESULT: 15000000 TRU; \
      ACTUAL RESULT: ' + adjustedSupply.toFormat(0) + ' TRU');
  });

  // PRESALETESTS TEST CASE 25: Cannot buy once Pre-Sale has ended
  it('PRESALETESTS TEST CASE 25: Cannot buy once Pre-Sale has ended', async function() {
    let psStartTimeTwo = web3.eth.getBlock('pending').timestamp + 6000000;
    let psEndTimeTwo = psStartTimeTwo + 6000000;
    // Setup up second Pre-Sale and Token Instance
    let truTokenTwo = await TruReputationToken.new();
    let psInstTwo = await TruPreSale.new(psStartTimeTwo, psEndTimeTwo, truTokenTwo.address);
    let psAddressTwo = psInstTwo.address;
    await truTokenTwo.setReleaseAgent(acctFive, { from: acctOne });
    await truTokenTwo.transferOwnership(psAddressTwo, { from: acctOne });
    await psInstTwo.updateWhitelist(acctFour, true);
    let duringPreSale = psStartTimeTwo + 3000000;
    await increaseTimeTo(duringPreSale);
    await psInstTwo.buy({ from: acctFour, value: oneEth });
    let acctFourBalance = await truTokenTwo.balanceOf(acctFour);
    let adjustBalance = web3.fromWei(acctFourBalance, 'ether');

    assert.isTrue(adjustBalance.equals(1250),
      'Incorrect in-sale balance for account 4. \n\
      EXPECTED RESULT 1250 \n\
      ACTUAL RESULT: ' + acctFourBalance.toFormat(18));

    let afterPreSale = psEndTimeTwo + 3000000;
    await increaseTimeTo(afterPreSale);
    let hasEnded = await psInstTwo.hasEnded.call();

    assert.equal(hasEnded,
      true,
      'Incorrect hasEnded() value. \n\
      EXPECTED RESULT: true; \n\
      ACTUAL RESULT: ' + hasEnded);
    await psInstTwo.buy({ from: acctFour, value: oneEth }).should.be.rejectedWith(EVMThrow);

    let newBalance = await truTokenTwo.balanceOf(acctFour);
    let adjustNewBalance = web3.fromWei(newBalance, 'ether');

    assert.isTrue(adjustNewBalance.equals(1250),
      'Incorrect Post-Sale balance for account 4. \n\
      EXPECTED RESULT: 1250 TRU; \n\
      ACTUAL RESULT: ' + adjustNewBalance.toFormat(18));
  });

  // PRESALETESTS TEST CASE 26: PreSale owner can finalise the Pre-Sale
  it('PRESALETESTS TEST CASE 26: PreSale owner can finalise the Pre-Sale', async function() {
    await psInst.finalise({ from: acctOne });

    let totalTokens = new BigNumber(web3.toWei(30000000, 'ether'));
    let psTokens = new BigNumber(web3.toWei(15000000, 'ether'));
    let isComplete = await psInst.isCompleted.call();
    let mintingFinished = await truToken.mintingFinished.call();
    let preSaleFinished = await truToken.preSaleComplete.call();
    let tokenOwner = await truToken.owner.call();
    let tokenBalance = await truToken.balanceOf(acctOne);
    tokenSupply = await truToken.totalSupply.call();

    assert.isTrue(isComplete,
      'Incorrect Post-Sale Completion Status. \n\
      EXPECTED RESULT: true; \n\
      ACTUAL RESULT: ' + isComplete);

    assert.isFalse(mintingFinished,
      'Incorrect Post-Sale Minting Finished Status. \n\
      EXPECTED RESULT: false; \n\
      ACTUAL RESULT: ' + mintingFinished);

    assert.isTrue(preSaleFinished,
      'Incorrect Post-Sale Presale Complete Status. \n\
      EXPECTED RESULT: true; \n\
      ACTUAL RESULT: ' + preSaleFinished);

    assert.equal(tokenOwner,
      acctOne,
      'Incorrect Post-Sale Token Ownership. \n\
      EXPECTED RESULT: ' + acctOne + '; \n\
      ACTUAL RESULT: ' + tokenOwner);

    assert.isTrue(tokenSupply.equals(totalTokens),
      'Incorrect Post-Sale Token Supply size. \n\
      EXPECTED RESULT: 30,000,000 TRU; \n\
      ACTUAL RESULT: ' + web3.fromWei(tokenSupply.toNumber(), 'ether') + ' TRU');

    assert.isTrue(tokenBalance.equals(psTokens),
      'Incorrect Post-Sale Tru Ltd Token Pool size.\n\
      EXPECTED RESULT: 15,000,000 TRU; \n\
      ACTUAL RESULT: ' + web3.fromWei(tokenBalance.toNumber(), 'ether') + ' TRU');

  });

  // PRESALETESTS TEST CASE 27: Cannot finalise a finalised Pre-Sale
  it('PRESALETESTS TEST CASE 27: Cannot finalise a finalised Pre-Sale', async function() {
    let isComplete = await psInst.isCompleted.call();

    assert.isTrue(isComplete,
      'Incorrect Post-Sale Completion Status. \n\
      EXPECTED RESULT: true; \n\
      ACTUAL RESULT: ' + isComplete);

    await psInst.finalise({ from: acctOne }).should.be.rejectedWith(EVMThrow);

    let isCompleteTwo = await psInst.isCompleted.call();

    assert.equal(isCompleteTwo,
      isComplete,
      'Incorrect Post-Sale Completion Status. \n\
      EXPECTED RESULT: ' + isComplete + '; \n\
      ACTUAL RESULT: ' + isCompleteTwo);
  });

  // PRESALETESTS TEST CASE 28: Minted TruReputationToken cannot be transferred yet
  it('PRESALETESTS TEST CASE 28: Minted TruReputationToken cannot be transferred yet', async function() {
    let isReleased = await truToken.released.call();
    assert.isFalse(isReleased,
      'Incorrect Pre-Sale Release Status. \n\
      EXPECTED RESULT: false; \n\
      ACTUAL RESULT: ' + isReleased);

    let acctThreeBal = await truToken.balanceOf(acctThree);
    let acctFiveBal = await truToken.balanceOf(acctFive);

    await truToken.transfer(acctFive, 10000, { from: acctThree }).should.be.rejectedWith(EVMThrow);

    let acctThreeBalTwo = await truToken.balanceOf(acctThree);
    let acctFiveBalTwo = await truToken.balanceOf(acctFive);

    assert.equal(acctThreeBalTwo.toNumber(),
      acctThreeBal.toNumber(),
      'Balance of Account 3 not as expected. \n\
      EXPECTED RESULT: ' + acctThreeBal.toNumber() + ' TRU; \n\
      ACTUAL RESULT: ' + acctThreeBalTwo.toNumber() + ' TRU');

    assert.equal(acctFiveBalTwo.toNumber(),
      acctFiveBal.toNumber(),
      'Balance of Account 5 not as expected. \n\
      EXPECTED RESULT: ' + acctFiveBal.toNumber() + ' TRU; \n\
      ACTUAL RESULT: ' + acctFiveBalTwo.toNumber() + ' TRU');
  });

});*/