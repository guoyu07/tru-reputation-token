/**
 * @file        The following Tests are written for unit testing the TruCrowdSale Smart Contract
 * and to provide as much automated test coverage as possible, including as full as branch coverage as
 * possible. Documentation for these tests are maintained outside of these files for sake of clarity 
 * and can be found at {@link https://trultd.readthedocs.org}
 * 
 * @author      Ian Bray, Tru Ltd
 * @copyright   2017 Tru Ltd
 */

'use strict';

import { increaseTime, increaseTimeTo, duration } from './helpers/increaseTime';
import EVMRevert from './helpers/EVMRevert';
import EVMInvalidAddress from './helpers/EVMInvalidAddress';
import expectThrow from './helpers/expectThrow';
const TruReputationToken = artifacts.require('./TruReputationToken.sol');
const TruPreSale = artifacts.require('./TruPreSale.sol');
const TruCrowdSale = artifacts.require('./TruCrowdSale.sol');
const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

let timeoutDuration = 0;
contract('TruCrowdSale', function(accounts) {

  let currentTime = web3.eth.getBlock('latest').timestamp;
  let truToken;
  let preInst;
  let sInst;
  let psAddress;
  let sAddress;
  let acctOne = accounts[0];
  let acctTwo = accounts[1];
  let acctThree = accounts[2];
  let acctFour = accounts[3];
  let acctFive = accounts[4];
  let acctSix = accounts[5];
  let acctSeven = accounts[6];
  let acctEight = accounts[7];
  let execAcct = accounts[9];
  let acctOneBal;
  let acctTwoBal;
  let tokenSupply;
  let sRate;
  let estSold;
  let soldEth;
  let halfEth = web3.toWei(0.5, 'ether');
  let oneEth = web3.toWei(1, 'ether');
  let tenEth = web3.toWei(10, 'ether');
  let twentyThreeEth = web3.toWei(24, 'ether');
  let fiftyOneEth = web3.toWei(51, 'ether');
  let fiftyTwoEth = new BigNumber(web3.toWei(52, 'ether'));
  let psEthCap = 8000;
  let pSaleCap = web3.toWei(psEthCap, 'ether');
  let sEthCap = 80000;
  let saleCap = new BigNumber(web3.toWei(sEthCap, 'ether'));
  let minPurchase = oneEth;
  let maxEthPurchase = 20;
  let belowCapNumber = maxEthPurchase - 1;
  let maxPurchase = web3.toWei(maxEthPurchase, 'ether');
  let belowCapEth = web3.toWei(belowCapNumber, 'ether');
  let unsoldCSCap = 82000;
  let truAmt = 6000;
  let psRate = 1250;
  let csRate = 1125;
  let maxTokens = new BigNumber(web3.toWei(200000000, 'ether'));
  let allSaleTokens = new BigNumber(web3.toWei(100000000, 'ether'));
  let preSaleTokenCount = new BigNumber(web3.toWei(10000000, 'ether'));
  let psPostSaleTokenCount = preSaleTokenCount.mul(2);
  let saleTokenCount = new BigNumber(web3.toWei(90000000, 'ether'));
  let psStartTime;
  let psEndTime;
  let sStartTime;
  let sEndTime;
  let oneDayTS = 86400;
  let oneMonthTS = 2592000;

  it('UNIT TESTS - TRUCROWDSALE - TEST CASE 01: Cannot deploy TruCrowdSale with incorrect variables', async function() {
    currentTime = web3.eth.getBlock('latest').timestamp;
    sStartTime = currentTime + oneDayTS;
    sEndTime = sStartTime + oneMonthTS;
    let tempToken = await TruReputationToken.new({ from: acctOne });

    let expiredStart = currentTime - oneDayTS;

    // Should fail to create CrowdSale with expired startTime
    await TruCrowdSale.new(expiredStart, sEndTime, tempToken.address, execAcct, pSaleCap, 0).should.be.rejectedWith(EVMRevert);

    // Should fail to create CrowdSale with endTime before startTime
    await TruCrowdSale.new(psEndTime, sStartTime, tempToken.address, execAcct, pSaleCap, 0).should.be.rejectedWith(EVMRevert);

    // Should fail to create CrowdSale with invalid Tru Token
    await TruCrowdSale.new(sStartTime, sEndTime, 0x0, execAcct, pSaleCap, 0).should.be.rejectedWith(EVMRevert);

    // Should fail to create CrowdSale with invalid Sale Wallet
    await TruCrowdSale.new(sStartTime, sEndTime, tempToken.address, 0x0, pSaleCap, 0).should.be.rejectedWith(EVMRevert);

    // Should fail to create CrowdSale with invalid Current Supply
    await TruCrowdSale.new(sStartTime, sEndTime, 0x0, execAcct, -1, 0).should.be.rejectedWith(EVMRevert);

    // Should fail to create CrowdSale with invalid Current Raise
    await TruCrowdSale.new(sStartTime, sEndTime, 0x0, execAcct, 0, -1).should.be.rejectedWith(EVMRevert);

    // Should fail to create CrowdSale with incorrect Owner
    await TruCrowdSale.new(sStartTime, sEndTime, tempToken.address, execAcct, 0, 0, {from: acctTwo }).should.be.rejectedWith(EVMRevert);
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUCROWDSALE - TEST CASE 02: TruPreSale and TruReputationToken are deployed', async function() {
    currentTime = web3.eth.getBlock('latest').timestamp;
    psStartTime = currentTime + oneDayTS;
    psEndTime = psStartTime + oneMonthTS;
    sStartTime = psEndTime + oneDayTS;
    sEndTime = sStartTime + oneMonthTS;
    truToken = await TruReputationToken.new({ from: acctOne });
    await truToken.changeBoardAddress(execAcct, { from: acctOne });
    preInst = await TruPreSale.new(psStartTime, psEndTime, truToken.address, execAcct, { from: acctOne });
    psAddress = preInst.address;
    assert.isNotNull(preInst,
      '\n      ' +
      'UNIT TESTS - TRUCROWDSALE - TEST CASE 02: Test #1\n      ' +
      'TEST DESCRIPTION: TruPreSale not initialized\n      ' +
      'EXPECTED RESULT: not null\n      ' +
      'ACTUAL RESULT: is null');

    tokenSupply = await truToken.totalSupply.call();
    assert.equal(tokenSupply,
      0,
      '\n      ' +
      'UNIT TESTS - TRUCROWDSALE - TEST CASE 02: Test #2\n      ' +
      'TEST DESCRIPTION: Incorrect tokenSupply set for TruReputationToken\n      ' +
      'EXPECTED RESULT: 0\n      ' +
      'ACTUAL RESULT: ' + tokenSupply);
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUCROWDSALE - TEST CASE 03: Simulate completed PreSale and transition to CrowdSale', async function() {
    await truToken.setReleaseAgent(psAddress, { from: acctOne });
    await truToken.transferOwnership(psAddress);
    let tokenOwner = await truToken.owner.call();

    assert.equal(tokenOwner,
      psAddress,
      '\n      ' +
      'UNIT TESTS - TRUCROWDSALE - TEST CASE 03: Test #1\n      ' +
      'TEST DESCRIPTION: Contract is not owner\n      ' +
      'EXPECTED RESULT: ' + psAddress + '\n      ' +
      'ACTUAL RESULT: ' + tokenOwner);

    let duringPreSale = psStartTime + oneDayTS;

    await increaseTimeTo(duringPreSale);
    await preInst.updateWhitelist(acctTwo, 1);
    await preInst.buy({ from: acctTwo, value: pSaleCap });
    let psEnded = await preInst.hasEnded.call();

    assert.isTrue(psEnded,
      '\n      ' +
      'UNIT TESTS - TRUCROWDSALE - TEST CASE 03: Test #2\n      ' +
      'TEST DESCRIPTION: TruPreSale did not end despite hitting cap\n      ' +
      'EXPECTED RESULT: true\n      ' +
      'ACTUAL RESULT: false');

    await preInst.finalise({ from: acctOne });
    let psComplete = await preInst.isCompleted.call();

    assert.isTrue(psComplete,
      '\n      ' +
      'UNIT TESTS - TRUCROWDSALE - TEST CASE 03: Test #3\n      ' +
      'TEST DESCRIPTION: TruPreSale did not finalise despite hitting cap\n      ' +
      'EXPECTED RESULT: true\n      ' +
      'ACTUAL RESULT: false');

    let tokenBal = await truToken.totalSupply.call();

    let currentRaised = await preInst.weiRaised.call();

    sInst = await TruCrowdSale.new(sStartTime, sEndTime, truToken.address, execAcct, tokenBal, currentRaised);
    sAddress = sInst.address;

    sRate = await sInst.SALERATE.call();

    assert.isTrue(sRate.equals(csRate),
      '\n      ' +
      'UNIT TESTS - TRUCROWDSALE - TEST CASE 03: Test #4\n      ' +
      'TEST DESCRIPTION: SALERATE incorrect\n      ' +
      'EXPECTED RESULT: Should be 1125 TRU per ETH\n      ' +
      'ACTUAL RESULT: Returning as ' + sRate.toFormat(0));
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUCROWDSALE - TEST CASE 04: Fallback function should revert', async function() {
    try {
      await web3.eth.sendTransaction({ from: acctOne, to: sAddress, value: web3.toWei(1, 'ether') });
      assert.fail('Expected revert not received');
    } catch (error) {
      const revert = error.message.search('revert') >= 0;
      assert(revert,
        'UNIT TESTS - TRUCROWDSALE - TEST CASE 04: Test #1\n      ' +
        'TEST DESCRIPTION: Fallback function did not revert\n      ' +
        'EXPECTED RESULT: revert\n      ' +
        'ACTUAL RESULT: ' + error);
    }
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUCROWDSALE - TEST CASE 05: CrowdSale hard variables are as expected', async function() {
    let minimumPurchase = await sInst.MINAMOUNT.call();
    let maximumPurchase = await sInst.MAXAMOUNT.call();
    let cap = await sInst.cap.call();

    assert.isTrue(sRate.equals(csRate),
      '\n      ' +
      'UNIT TESTS - TRUCROWDSALE - TEST CASE 05: Test #1\n      ' +
      'TEST DESCRIPTION: Incorrect CrowdSale Rate for TruReputationToken\n      ' +
      'EXPECTED RESULT: 1,000 TRU to ETH\n      ' +
      'ACTUAL RESULT: ' + sRate.toFormat(0) + ' TRU to ETH');

    assert.isTrue(minimumPurchase.equals(minPurchase),
      '\n      ' +
      'UNIT TESTS - TRUCROWDSALE - TEST CASE 05: Test #2\n      ' +
      'TEST DESCRIPTION: Incorrect Minimum Purchase Amount for TruReputationToken\n      ' +
      'EXPECTED RESULT: ' + web3.fromWei(minPurchase, 'ether') + ' Eth\n      ' +
      'ACTUAL RESULT: ' + web3.fromWei(minimumPurchase, 'ether'));

    assert.isTrue(maximumPurchase.equals(maxPurchase),
      '\n      ' +
      'UNIT TESTS - TRUCROWDSALE - TEST CASE 05: Test #3\n      ' +
      'TEST DESCRIPTION: Incorrect Maximum Purchase Amount for TruReputationToken\n      ' +
      'EXPECTED RESULT: ' + web3.fromWei(maxPurchase, 'ether') + ' Eth\n      ' +
      'ACTUAL RESULT: ' + web3.fromWei(maxPurchase, 'ether'));

    assert.isTrue(cap.equals(saleCap),
      '\n      ' +
      'UNIT TESTS - TRUCROWDSALE - TEST CASE 05: Test #4\n      ' +
      'TEST DESCRIPTION: Incorrect Cap for TruReputationToken\n      ' +
      'EXPECTED RESULT: ' + web3.fromWei(saleCap, 'ether') + ' ETH\n      ' +
      'ACTUAL RESULT: ' + web3.fromWei(cap, 'ether'));
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUCROWDSALE - TEST CASE 06: Transfer TruReputationToken ownership to CrowdSale', async function() {
    await truToken.setReleaseAgent(sAddress, { from: acctOne });
    await truToken.transferOwnership(sAddress);
    let tokenOwner = await truToken.owner.call();
    let tokenReleaseAgent = await truToken.releaseAgent.call();

    assert.equal(tokenOwner,
      sAddress,
      '\n      ' +
      'UNIT TESTS - TRUCROWDSALE - TEST CASE 06: Test #1\n      ' +
      'TEST DESCRIPTION: TRU Token Ownership did not transfer from TruPreSale to TruCrowdSale\n      ' +
      'EXPECTED RESULT: ' + sAddress + ';\n      ' +
      'ACTUAL RESULT: ' + tokenOwner);

    assert.equal(tokenReleaseAgent,
      sAddress,
      '\n      ' +
      'UNIT TESTS - TRUCROWDSALE - TEST CASE 06: Test #2\n      ' +
      'TEST DESCRIPTION: TRU Token Release Agent did not transfer from TruPreSale to TruCrowdSale\n      ' +
      'EXPECTED RESULT: ' + sAddress + ';\n      ' +
      'ACTUAL RESULT: ' + tokenReleaseAgent);
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUCROWDSALE - TEST CASE 07: Can Add Purchaser to CrowdSale Purchaser Whitelist', async function() {
    var wlWatch = sInst.WhiteListUpdate();
    await sInst.updateWhitelist(acctThree, 1);
    var watchResult = wlWatch.get();
    var whiteListed = await sInst.purchaserWhiteList(acctThree);

    assert.equal(watchResult.length,
      1,
      '\n      ' +
      'UNIT TESTS - TRUCROWDSALE - TEST CASE 07: Test #1\n      ' +
      'TEST DESCRIPTION: Incorrect Whitelist Event length for TruCrowdSale\n      ' +
      'EXPECTED RESULT: 1\n      ' +
      'ACTUAL RESULT: ' + watchResult.length);

    assert.isTrue(watchResult[0].args._whitelistStatus,
      '\n      ' +
      'UNIT TESTS - TRUCROWDSALE - TEST CASE 07: Test #2\n      ' +
      'TEST DESCRIPTION: Incorrect status on Whitelist entry for TruCrowdSale\n      ' +
      'EXPECTED RESULT: true\n      ' +
      'ACTUAL RESULT: ' + watchResult[0].args._whitelistStatus);

    assert.equal(watchResult[0].args._purchaserAddress,
      acctThree,
      '\n      ' +
      'UNIT TESTS - TRUCROWDSALE - TEST CASE 07: Test #3\n      ' +
      'TEST DESCRIPTION: Incorrect Whitelist entry for TruCrowdSale\n      ' +
      'EXPECTED RESULT: ' + acctThree + '\n      ' +
      'ACTUAL RESULT: ' + watchResult[0].args._purchaserAddress);

    assert.isTrue(whiteListed,
      '\n      ' +
      'UNIT TESTS - TRUCROWDSALE - TEST CASE 08: Test #4\n      ' +
      'TEST DESCRIPTION: Address is not on Whitelist for TruCrowdSale\n      ' +
      'EXPECTED RESULT: true\n      ' +
      'ACTUAL RESULT: ' + whiteListed);
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUCROWDSALE - TEST CASE 08: Can Remove Purchaser from CrowdSale Purchaser Whitelist', async function() {
    var wlWatch = sInst.WhiteListUpdate();
    await sInst.updateWhitelist(acctThree, 0);
    var watchResult = wlWatch.get();
    var notWhiteListed = await sInst.purchaserWhiteList(acctThree);

    assert.equal(watchResult.length,
      1,
      '\n      ' +
      'UNIT TESTS - TRUCROWDSALE - TEST CASE 08: Test #1\n      ' +
      'TEST DESCRIPTION: Incorrect Whitelist Event length for TruCrowdSale\n      ' +
      'EXPECTED RESULT: 1\n      ' +
      'ACTUAL RESULT: ' + watchResult.length);

    assert.isFalse(watchResult[0].args._whitelistStatus,
      '\n      ' +
      'UNIT TESTS - TRUCROWDSALE - TEST CASE 08: Test #2\n      ' +
      'TEST DESCRIPTION: Incorrect status on Whitelist entry for TruCrowdSale\n      ' +
      'EXPECTED RESULT: false\n      ' +
      'ACTUAL RESULT: ' + watchResult[0].args._whitelistStatus);

    assert.equal(watchResult[0].args._purchaserAddress,
      acctThree,
      '\n      ' +
      'UNIT TESTS - TRUCROWDSALE - TEST CASE 08: Test #3\n      ' +
      'TEST DESCRIPTION: Incorrect Whitelist entry for TruCrowdSale\n      ' +
      'EXPECTED RESULT: ' + acctThree + '\n      ' +
      'ACTUAL RESULT: ' + watchResult[0].args._purchaserAddress);
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUCROWDSALE - TEST CASE 09: Cannot purchase before start of CrowdSale', async function() {
    await sInst.buy({ from: acctTwo, value: oneEth }).should.be.rejectedWith(EVMRevert);

    let fundsRaised = await sInst.weiRaised.call();
    let fundsRaisedEth = web3.fromWei(fundsRaised, 'ether');

    assert.equal(fundsRaisedEth,
      0,
      '\n      ' +
      'UNIT TESTS - TRUCROWDSALE - TEST CASE 09: Test #1\n      ' +
      'TEST DESCRIPTION: Incorrect Funds Raised value for TruCrowdSale\n      ' +
      'EXPECTED RESULT: 0 ETH\n      ' +
      'ACTUAL RESULT: ' + fundsRaised + ' ETH');
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUCROWDSALE - TEST CASE 10: Cannot purchase below minimum purchase amount', async function() {
    await sInst.buy({ from: acctTwo, value: halfEth }).should.be.rejectedWith(EVMRevert);
    let fundsRaised = await sInst.weiRaised.call();
    let fundsRaisedEth = web3.fromWei(fundsRaised, 'ether');

    assert.isTrue(fundsRaisedEth.equals(0),
      '\n      ' +
      'UNIT TESTS - TRUCROWDSALE - TEST CASE 10: Test #1\n      ' +
      'TEST DESCRIPTION: Incorrect Funds Raised value for TruCrowdSale\n      ' +
      'EXPECTED RESULT: 0 ETH\n      ' +
      'ACTUAL RESULT: ' + web3.fromWei(fundsRaised.toNumber(), 'ether') + ' ETH');
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUCROWDSALE - TEST CASE 11: Cannot purchase above maximum purchase amount if not on CrowdSale Whitelist', async function() {
    let duringSale = sStartTime + oneDayTS;
    await increaseTimeTo(duringSale);
    currentTime = web3.eth.getBlock('latest').timestamp;
    await sInst.buy({ from: acctTwo, value: fiftyOneEth }).should.be.rejectedWith(EVMRevert);
    let fundsRaised = await sInst.weiRaised.call();
    let fundsRaisedEth = new BigNumber(web3.fromWei(fundsRaised, 'ether'));

    assert.isTrue(fundsRaisedEth.equals(0),
      '\n      ' +
      'UNIT TESTS - TRUCROWDSALE - TEST CASE 11: Test #1\n      ' +
      'TEST DESCRIPTION: Incorrect Funds Raised value for TruCrowdSale\n      ' +
      'EXPECTED RESULT: 0 ETH\n      ' +
      'ACTUAL RESULT: ' + web3.fromWei(fundsRaised.toNumber(), 'ether') + ' ETH');

    await sInst.buy({ from: acctThree, value: belowCapEth })
    await sInst.buy({ from: acctThree, value: belowCapEth }).should.be.rejectedWith(EVMRevert);

    let tokensSold = await sInst.soldTokens.call();
    let soldTokens = new BigNumber(web3.fromWei(tokensSold, 'ether'));
    estSold = sRate.mul(belowCapNumber);

    assert.equal(soldTokens.toFormat(18),
      estSold.toFormat(18),
      '\n      ' +
      'UNIT TESTS - TRUCROWDSALE - TEST CASE 11: Test #2\n      ' +
      'TEST DESCRIPTION: Incorrect purchase balance\n      ' +
      'EXPECTED RESULT : ' + estSold.toFormat(18) + ' TRU\n      ' +
      'ACTUAL RESULT: ' + web3.fromWei(tokensSold, 'ether') + ' TRU'
    );
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUCROWDSALE - TEST CASE 12: Can purchase above maximum purchase amount if on CrowdSale Whitelist', async function() {
    let newSold = sRate.mul(51);
    estSold = estSold.add(newSold);

    await sInst.updateWhitelist(acctTwo, 1);

    await sInst.buy({ from: acctTwo, value: fiftyOneEth });

    let fundsRaised = await sInst.weiRaised.call();
    let fundsRaisedEth = new BigNumber(web3.fromWei(fundsRaised.toNumber(), 'ether'));
    soldEth = belowCapNumber + 51;
    assert.isTrue(fundsRaisedEth.equals(soldEth),
      '\n      ' +
      'UNIT TESTS - TRUCROWDSALE - TEST CASE 12: Test #1\n      ' +
      'TEST DESCRIPTION: Incorrect Funds Raised value for TruCrowdSale\n      ' +
      'EXPECTED RESULT: ' + soldEth + ' ETH\n      ' +
      'ACTUAL RESULT: ' + fundsRaisedEth.toFormat(0) + ' ETH');

    tokenSupply = await truToken.totalSupply.call();
    let adjustedSupply = tokenSupply.sub(psPostSaleTokenCount);
    adjustedSupply = new BigNumber(web3.fromWei(adjustedSupply, 'ether'))

    assert.equal(adjustedSupply.toFormat(18),
      estSold.toFormat(18),
      '\n      ' +
      'UNIT TESTS - TRUCROWDSALE - TEST CASE 12: Test #2\n      ' +
      'TEST DESCRIPTION: Incorrect Token Supply value for TruCrowdSale\n      ' +
      'EXPECTED RESULT: ' + estSold.toFormat(18) + ' TRU\n      ' +
      'ACTUAL RESULT: ' + adjustedSupply.toFormat(18) + ' TRU');

  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUCROWDSALE - TEST CASE 13: Can halt CrowdSale in an emergency', async function() {
    await sInst.halt({ from: acctOne });

    await sInst.buy({ from: acctOne, value: oneEth }).should.be.rejectedWith(EVMRevert);
    let fundsRaised = await sInst.weiRaised.call();

    let fundsRaisedEth = new BigNumber(web3.fromWei(fundsRaised, 'ether'));
    let haltStatus = await sInst.halted.call();

    assert.isTrue(haltStatus,
      '\n      ' +
      'UNIT TESTS - TRUCROWDSALE - TEST CASE 13: Test #1\n      ' +
      'TEST DESCRIPTION: Incorrect Halt Status for TruCrowdSale\n      ' +
      'EXPECTED RESULT: true\n      ' +
      'ACTUAL RESULT: ' + haltStatus);

    assert.isTrue(fundsRaisedEth.equals(soldEth),
      '\n      ' +
      'UNIT TESTS - TRUCROWDSALE - TEST CASE 13: Test #2\n      ' +
      'TEST DESCRIPTION: Incorrect Funds Raised value for TruCrowdSale\n      ' +
      'EXPECTED RESULT: ' + soldEth + ' ETH\n      ' +
      'ACTUAL RESULT: ' + fundsRaisedEth + ' ETH');


    let currTokenSupply = await truToken.totalSupply.call()

    assert.isTrue(currTokenSupply.equals(tokenSupply),
      '\n      ' +
      'UNIT TESTS - TRUCROWDSALE - TEST CASE 13: Test #3\n      ' +
      'TEST DESCRIPTION: Incorrect Token Supply value for TruCrowdSale\n      ' +
      'EXPECTED RESULT: ' + web3.fromWei(tokenSupply, 'ether') + ' TRU\n      ' +
      'ACTUAL RESULT: ' + web3.fromWei(currTokenSupply, 'ether'));

    tokenSupply = currTokenSupply;

    await sInst.unhalt({ from: acctOne })
    let haltStatusTwo = await sInst.halted.call();

    assert.isFalse(haltStatusTwo,
      '\n      ' +
      'UNIT TESTS - TRUCROWDSALE - TEST CASE 13: Test #4\n      ' +
      'TEST DESCRIPTION: Incorrect Halt Status for TruCrowdSale\n      ' +
      'EXPECTED RESULT: false\n      ' +
      'ACTUAL RESULT: ' + haltStatus);
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUCROWDSALE - TEST CASE 14: Tokens cannot be transferred before CrowdSale is finalised', async function() {
    let acctThreeOrgBalance = await truToken.balanceOf.call(acctThree);

    await truToken.transfer(acctThree, psRate, { from: acctOne }).should.be.rejectedWith(EVMRevert);
    let acctThreeBalance = await truToken.balanceOf.call(acctThree);
    var actThreeBal = web3.fromWei(acctThreeBalance, 'ether')
    var actOrgThreeBal = web3.fromWei(acctThreeOrgBalance, 'ether')

    assert.isTrue(actOrgThreeBal.equals(actThreeBal),
      '\n      ' +
      'UNIT TESTS - TRUCROWDSALE - TEST CASE 14: Test #1\n      ' +
      'TEST DESCRIPTION: Incorrect Balance for Account Three for TruCrowdSale\n      ' +
      'EXPECTED RESULT: ' + acctThreeOrgBalance.toFormat(0) + '\n      ' +
      'ACTUAL RESULT: ' + acctThreeBalance.toFormat(0));
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUCROWDSALE - TEST CASE 15: Only nominated Release Agent can make Tokens transferable', async function() {
    // Verify token is not in released state
    let tokensTransferable = await truToken.released.call();

    assert.isFalse(tokensTransferable,
      '\n      ' +
      'UNIT TESTS - TRUCROWDSALE - TEST CASE 15: Test #1\n      ' +
      'TEST DESCRIPTION: Incorrect Released State for TruReputationToken\n      ' +
      'EXPECTED RESULT: false\n      ' +
      'ACTUAL RESULT: ' + tokensTransferable);

    // CrowdSale Owner cannot release tokens
    await truToken.releaseTokenTransfer({ from: acctOne }).should.be.rejectedWith(EVMRevert);

    tokensTransferable = await truToken.released.call();

    assert.isFalse(tokensTransferable,
      '\n      ' +
      'UNIT TESTS - TRUCROWDSALE - TEST CASE 15: Test #2\n      ' +
      'TEST DESCRIPTION: Incorrect Released State for TruReputationToken\n      ' +
      'EXPECTED RESULT: false\n      ' +
      'ACTUAL RESULT: ' + tokensTransferable);
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUCROWDSALE - TEST CASE 16: Only Token Owner can mint Tokens', async function() {
    await truToken.mint(sAddress, truAmt, { from: acctOne }).should.be.rejectedWith(EVMRevert);

    let newTokenSupply = await truToken.totalSupply.call();

    assert.isTrue(newTokenSupply.equals(tokenSupply),
      '\n      ' +
      'UNIT TESTS - TRUCROWDSALE - TEST CASE 16: Test #1\n      ' +
      'TEST DESCRIPTION: Incorrect Total Supply of Token- should not have minted\n      ' +
      'EXPECTED RESULT: ' + tokenSupply.toFormat(0) + ';\n      ' +
      'ACTUAL RESULT: ' + newTokenSupply.toFormat(0));
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUCROWDSALE - TEST CASE 17: CrowdSale has correct Purchaser count', async function() {
    let noOfPurchasers = await sInst.purchaserCount.call();
    assert.isTrue(noOfPurchasers.equals(2),
      '\n      ' +
      'UNIT TESTS - TRUCROWDSALE - TEST CASE 17: Test #1\n      ' +
      'TEST DESCRIPTION: Incorrect number of purchasers for CrowdSale\n      ' +
      'EXPECTED RESULT: 2\n      ' +
      'ACTUAL RESULT: ' + noOfPurchasers.toFormat(0));
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUCROWDSALE - TEST CASE 18: Cannot buy more than CrowdSale cap', async function() {
    let preRaisedFunds = await sInst.weiRaised.call();

    let moreThanCap = saleCap.add(tenEth);
    await sInst.buy({ from: acctFour, value: moreThanCap }).should.be.rejectedWith(EVMRevert);
    let postRaisedFunds = await sInst.weiRaised.call();

    assert.equal(web3.toWei(postRaisedFunds.toNumber(), 'ether'),
      web3.toWei(preRaisedFunds.toNumber()),
      '\n      ' +
      'UNIT TESTS - TRUCROWDSALE - TEST CASE 18: Test #1\n      ' +
      'TEST DESCRIPTION: Raised Funds for CrowdSale is incorrect\n      ' +
      'EXPECTED RESULT: ' + web3.toWei(preRaisedFunds.toNumber()) + '\n      ' +
      'ACTUAL RESULT: ' + web3.toWei(postRaisedFunds.toNumber()));
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUCROWDSALE - TEST CASE 19: CrowdSale owner cannot finalise a CrowdSale before it ends', async function() {
    let isComplete = await sInst.isCompleted.call();

    assert.isFalse(isComplete,
      '\n      ' +
      'UNIT TESTS - TRUCROWDSALE - TEST CASE 19: Test #1\n      ' +
      'TEST DESCRIPTION: Incorrect CrowdSale Completion Status\n      ' +
      'EXPECTED RESULT: false\n      ' +
      'ACTUAL RESULT: ' + isComplete);

    await sInst.finalise({ from: acctOne }).should.be.rejectedWith(EVMRevert);

    let isCompleteTwo = await sInst.isCompleted.call();

    assert.isFalse(isCompleteTwo,
      '\n      ' +
      'UNIT TESTS - TRUCROWDSALE - TEST CASE 19: Test #2\n      ' +
      'TEST DESCRIPTION: Incorrect CrowdSale Completion Status\n      ' +
      'EXPECTED RESULT: false\n      ' +
      'ACTUAL RESULT: ' + isCompleteTwo);
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUCROWDSALE - TEST CASE 20: Cannot buy from CrowdSale with invalid address', async function() {
    let invalidAddr = 0x0;
    await sInst.buy({ from: invalidAddr, value: oneEth }).should.be.rejectedWith(EVMInvalidAddress);
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUCROWDSALE - TEST CASE 21: Cannot buy 0 amount from CrowdSale', async function() {
    await sInst.buy({ from: acctThree, value: 0 }).should.be.rejectedWith(EVMRevert);
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUCROWDSALE - TEST CASE 22: Can buy repeatedly from the same address', async function() {
    let oldSupply = await truToken.totalSupply.call();
    oldSupply = web3.fromWei(oldSupply, 'ether');

    await sInst.updateWhitelist(acctFour, 1);
    let orgAcctFourBal = await truToken.balanceOf.call(acctFour);
    await sInst.buy({ from: acctFour, value: fiftyOneEth })
    await sInst.buy({ from: acctFour, value: oneEth })

    let truNo = fiftyTwoEth.mul(sRate);
    let shortTru = web3.fromWei(truNo, 'ether')

    let estSupply = oldSupply.add(shortTru);
    tokenSupply = await truToken.totalSupply.call();
    let acctFourBal = await truToken.balanceOf.call(acctFour);
    let estBal = orgAcctFourBal.add(shortTru);

    let adjustedSupply = new BigNumber(web3.fromWei(tokenSupply, 'ether'));
    let adjustedBal = new BigNumber(web3.fromWei(acctFourBal, 'ether'));
    assert.equal(adjustedSupply.toFormat(18),
      estSupply.toFormat(18),
      '\n      ' +
      'UNIT TESTS - TRUCROWDSALE - TEST CASE 22: Test #1\n      ' +
      'TEST DESCRIPTION: Token Supply is incorrect\n      ' +
      'EXPECTED RESULT: ' + estSupply.toFormat(0) + '\n      ' +
      'ACTUAL RESULT: ' + adjustedSupply.toFormat(0));

    assert.equal(adjustedBal.toFormat(18),
      estBal.toFormat(18),
      '\n      ' +
      'UNIT TESTS - TRUCROWDSALE - TEST CASE 22: Test #2\n      ' +
      'TEST DESCRIPTION: Account Four Balance is incorrect\n      ' +
      'EXPECTED RESULT: ' + estBal.toFormat(18) + ' TRU\n      ' +
      'ACTUAL RESULT: ' + acctFourBal.toFormat(18));
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUCROWDSALE - TEST CASE 23: Can buy up to the cap on the CrowdSale', async function() {
    let raisedFunds = await sInst.weiRaised.call();
    let raisedEth = new BigNumber(web3.fromWei(raisedFunds, 'ether'));

    tokenSupply = await truToken.totalSupply.call();
    let soldTokens = await sInst.soldTokens.call();
    let remainingCap = saleCap.sub(raisedFunds);
    let remainingTokens = saleTokenCount.sub(soldTokens);
    let estSoldTokens = new BigNumber(web3.toWei(sRate.mul(raisedEth.toNumber()), 'ether'));

    let estRemainingTokens = saleTokenCount.sub(estSoldTokens);
    estRemainingTokens = new BigNumber(web3.fromWei(estRemainingTokens, 'ether'));
    let estPurchased = new BigNumber(web3.toWei(raisedEth.toNumber(), 'ether'));

    assert.isTrue(raisedFunds.equals(estPurchased),
      '\n      ' +
      'UNIT TESTS - TRUCROWDSALE - TEST CASE 23: Test #1\n      ' +
      'TEST DESCRIPTION: Raised value is not not correct\n      ' +
      'EXPECTED RESULT: ' + web3.fromWei(estPurchased, 'ether') + ' ETH\n      ' +
      'ACTUAL RESULT: ' + web3.fromWei(raisedFunds.toNumber(), 'ether'));

    let rTruTokens = new BigNumber(web3.fromWei(remainingTokens, 'ether'));

    assert.equal(rTruTokens.toFormat(17),
      estRemainingTokens.toFormat(17),
      '\n      ' +
      'UNIT TESTS - TRUCROWDSALE - TEST CASE 23: Test #2\n      ' +
      'TEST DESCRIPTION: Remaining Tokens is not as expected\n      ' +
      'EXPECTED RESULT: ' + estRemainingTokens.toFormat(17) + ' TRU\n      ' +
      'ACTUAL RESULT: ' + rTruTokens.toFormat(17));


    await sInst.updateWhitelist(acctThree, 1);
    await sInst.buy({ from: acctThree, value: remainingCap.toNumber() });

    raisedFunds = await sInst.weiRaised.call();

    let acctTwoBal = await truToken.balanceOf.call(acctTwo);
    let acctThreeBal = await truToken.balanceOf.call(acctThree);
    tokenSupply = await truToken.totalSupply.call();
    let tPool = saleTokenCount.add(psPostSaleTokenCount);
    assert.isTrue(raisedFunds.equals(saleCap),
      '\n      ' +
      'UNIT TESTS - TRUCROWDSALE - TEST CASE 23: Test #3\n      ' +
      'TEST DESCRIPTION: Raised value is not 121,500 ETH \n      ' +
      'EXPECTED RESULT: ' + web3.fromWei(saleCap.toNumber(), 'ether') + ' ETH\n      ' +
      'ACTUAL RESULT: ' + web3.fromWei(raisedFunds.toNumber(), 'ether') + ' ETH');

    assert.isTrue(tokenSupply.equals(tPool),
      '\n      ' +
      'UNIT TESTS - TRUCROWDSALE - TEST CASE 23: Test #4\n      ' +
      'TEST DESCRIPTION: Incorrect Balance for Token supply for TruCrowdSale\n      ' +
      'EXPECTED RESULT: ' + web3.fromWei(tPool.toNumber(), 'ether') + ' TRU\n      ' +
      'ACTUAL RESULT: ' + web3.fromWei(tokenSupply.toNumber(), 'ether') + ' TRU');

  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUCROWDSALE - TEST CASE 24: Cannot buy once the cap is reached on the CrowdSale', async function() {
    await sInst.buy({ from: acctOne, value: web3.toWei(1, 'ether') }).should.be.rejectedWith(EVMRevert);

    let raisedFunds = await sInst.weiRaised.call();
    tokenSupply = await truToken.totalSupply.call();
    let soldTokens = tokenSupply.sub(psPostSaleTokenCount);

    assert.isTrue(raisedFunds.equals(saleCap),
      '\n      ' +
      'UNIT TESTS - TRUCROWDSALE - TEST CASE 24: Test #1\n      ' +
      'TEST DESCRIPTION: Raised funds does not match CrowdSale Cap\n      ' +
      'EXPECTED RESULT: ' + web3.fromWei(saleCap.toNumber(), 'ether') + ' ETH\n      ' +
      'ACTUAL RESULT: ' + web3.fromWei(raisedFunds.toNumber(), 'ether') + ' ETH');

    assert.isTrue(saleTokenCount.equals(soldTokens),
      '\n      ' +
      'UNIT TESTS - TRUCROWDSALE - TEST CASE 24: Test #2\n      ' +
      'TEST DESCRIPTION: Tokens minted for Crowdsale does not match CrowdSale Tru Token Cap\n      ' +
      'EXPECTED RESULT: ' + web3.fromWei(saleTokenCount.toNumber(), 'ether') + ' ETH\n      ' +
      'ACTUAL RESULT:' + web3.fromWei(soldTokens.toNumber(), 'ether') + ' ETH');
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUCROWDSALE - TEST CASE 25: CrowdSale owner can finalise the CrowdSale', async function() {

    // Only the Owner should be able to finalise the sale
    await sInst.finalise({ from: acctTwo }).should.be.rejectedWith(EVMRevert);
    await sInst.finalise({ from: acctOne });

    let isComplete = await sInst.isCompleted.call();
    let mintingFinished = await truToken.mintingFinished.call();
    let preSaleFinished = await truToken.preSaleComplete.call();
    let saleFinished = await truToken.saleComplete.call();
    let tokenOwner = await truToken.owner.call();
    let tokenBalance = await truToken.balanceOf.call(execAcct);
    tokenSupply = await truToken.totalSupply.call();

    // Is the Crowdsale Complete?
    assert.isTrue(isComplete,
      '\n      ' +
      'UNIT TESTS - TRUCROWDSALE - TEST CASE 25: Test #1\n      ' +
      'TEST DESCRIPTION: Incorrect Post-CrowdSale Completion Status\n      ' +
      'EXPECTED RESULT: true\n      ' +
      'ACTUAL RESULT: ' + isComplete);

    // Is the Minting Finalised on the TruReputationToken?
    assert.isTrue(mintingFinished,
      '\n      ' +
      'UNIT TESTS - TRUCROWDSALE - TEST CASE 25: Test #2\n      ' +
      'TEST DESCRIPTION: Incorrect Post-CrowdSale Minting Finished Status\n      ' +
      'EXPECTED RESULT: true\n      ' +
      'ACTUAL RESULT: ' + mintingFinished);

    // Is the PreSale Finished?
    assert.isTrue(preSaleFinished,
      '\n      ' +
      'UNIT TESTS - TRUCROWDSALE - TEST CASE 25: Test #3\n      ' +
      'TEST DESCRIPTION: Incorrect Post-CrowdSale Presale Complete Status\n      ' +
      'EXPECTED RESULT: true\n      ' +
      'ACTUAL RESULT: ' + preSaleFinished);

    // Is the CrowdSale Finished?
    assert.isTrue(saleFinished,
      '\n      ' +
      'UNIT TESTS - TRUCROWDSALE - TEST CASE 25: Test #4\n      ' +
      'TEST DESCRIPTION: Incorrect Post-CrowdSale CrowdSale Complete Status\n      ' +
      'EXPECTED RESULT: true\n      ' +
      'ACTUAL RESULT: ' + saleFinished);

    // Is Account One the owner of the TruReputationToken Contract?
    assert.equal(tokenOwner,
      acctOne,
      '\n      ' +
      'UNIT TESTS - TRUCROWDSALE - TEST CASE 25: Test #5\n      ' +
      'TEST DESCRIPTION: Incorrect Post-CrowdSale Token Ownership\n      ' +
      'EXPECTED RESULT: ' + acctOne + '\n      ' +
      'ACTUAL RESULT: ' + tokenOwner);

    // Has 300,000,000 TRU been minted during the sales?
    assert.isTrue(tokenSupply.equals(maxTokens),
      '\n      ' +
      'UNIT TESTS - TRUCROWDSALE - TEST CASE 25: Test #6\n      ' +
      'TEST DESCRIPTION: Incorrect Post-CrowdSale Token Supply size\n      ' +
      'EXPECTED RESULT: 300,000,000 TRU\n      ' +
      'ACTUAL RESULT: ' + web3.fromWei(tokenSupply.toNumber(), 'ether') + ' TRU');

    let tBal = web3.fromWei(tokenBalance.toNumber(), 'ether')
      // Has an additional 150,000,000 TRU (50% of total Pool) been minted into the Exec Account?
    assert.isTrue(tokenBalance.equals(allSaleTokens),
      '\n      ' +
      'UNIT TESTS - TRUCROWDSALE - TEST CASE 25: Test #7\n      ' +
      'TEST DESCRIPTION: Incorrect Post-CrowdSale Tru Ltd Token Pool size\n      ' +
      'EXPECTED RESULT: 150,000,000 TRU\n      ' +
      'ACTUAL RESULT: ' + web3.fromWei(tokenBalance.toNumber(), 'ether') + ' TRU');
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUCROWDSALE - TEST CASE 26: Cannot buy once CrowdSale has ended', async function() {
    currentTime = web3.eth.getBlock('latest').timestamp;
    let psStartTimeTwo = currentTime + oneDayTS;
    let psEndTimeTwo = psStartTimeTwo + oneMonthTS;
    let duringPreSale = psStartTimeTwo + oneDayTS;

    let sStartTimeTwo = psEndTimeTwo + oneDayTS;
    let sEndTimeTwo = sStartTimeTwo + oneMonthTS;

    let truTokenTwo = await TruReputationToken.new({ from: acctOne });
    let psInstTwo = await TruPreSale.new(psStartTimeTwo, psEndTimeTwo, truTokenTwo.address, execAcct, { from: acctOne });
    let psAddressTwo = psInstTwo.address;
    await truTokenTwo.setReleaseAgent(psAddressTwo, { from: acctOne });
    await truTokenTwo.transferOwnership(psAddressTwo);

    await increaseTimeTo(duringPreSale);
    await psInstTwo.updateWhitelist(acctTwo, 1, { from: acctOne });
    await psInstTwo.buy({ from: acctTwo, value: pSaleCap });
    let psEnded = await psInstTwo.hasEnded.call();
    await psInstTwo.finalise({ from: acctOne });
    let truTokenSupplyTwo = await truTokenTwo.totalSupply.call();
    let currentRaised = await psInstTwo.weiRaised.call();

    // Start Second Crowdsale
    let csInstTwo = await TruCrowdSale.new(sStartTimeTwo, sEndTimeTwo, truTokenTwo.address, execAcct, truTokenSupplyTwo, currentRaised, { from: acctOne });
    let csAddressTwo = csInstTwo.address;
    await truTokenTwo.setReleaseAgent(csAddressTwo, { from: acctOne });
    await truTokenTwo.transferOwnership(csAddressTwo);
    let afterSale = sEndTimeTwo + oneDayTS;
    await increaseTimeTo(afterSale);

    await csInstTwo.buy({ from: acctFive, value: oneEth }).should.be.rejectedWith(EVMRevert);
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUCROWDSALE - TEST CASE 27: Cannot finalise a finalised CrowdSale', async function() {
    let isComplete = await sInst.isCompleted.call();
    assert.isTrue(isComplete,
      '\n      ' +
      'UNIT TESTS - TRUCROWDSALE - TEST CASE 27: Test #1\n      ' +
      'TEST DESCRIPTION: Incorrect Post-Sale Completion Status\n      ' +
      'EXPECTED RESULT: true\n      ' +
      'ACTUAL RESULT: ' + isComplete);

    await sInst.finalise({ from: acctOne }).should.be.rejectedWith(EVMRevert);
    let isCompleteTwo = await sInst.isCompleted.call();
    assert.equal(isCompleteTwo,
      isComplete,
      '\n      ' +
      'UNIT TESTS - TRUCROWDSALE - TEST CASE 27: Test #2\n      ' +
      'TEST DESCRIPTION: Incorrect Post-Sale Completion Status\n      ' +
      'EXPECTED RESULT: ' + isComplete + '\n      ' +
      'ACTUAL RESULT: ' + isCompleteTwo);
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUCROWDSALE - TEST CASE 28: Minted TruReputationToken can be transferred', async function() {
    let isReleased = await truToken.released.call();
    assert.isTrue(isReleased,
      '\n      ' +
      'UNIT TESTS - TRUCROWDSALE - TEST CASE 28: Test #1\n      ' +
      'TEST DESCRIPTION: Incorrect Post-CrowdSale Release Status\n      ' +
      'EXPECTED RESULT: false\n      ' +
      'ACTUAL RESULT: ' + isReleased);

    let acctThreeBal = await truToken.balanceOf.call(acctThree);
    let acctFiveBal = await truToken.balanceOf.call(acctFive);

    await truToken.transfer(acctFive, truAmt, { from: acctThree })

    let acctThreeBalTwo = await truToken.balanceOf.call(acctThree);
    let acctFiveBalTwo = await truToken.balanceOf.call(acctFive);
    let threeExpBal = acctThreeBal.sub(truAmt);
    let fiveExpBal = acctFiveBal.add(truAmt);

    assert.equal(acctThreeBalTwo.toNumber(),
      threeExpBal.toNumber(),
      '\n      ' +
      'UNIT TESTS - TRUCROWDSALE - TEST CASE 28: Test #2\n      ' +
      'TEST DESCRIPTION: Balance of Account Three not as expected\n      ' +
      'EXPECTED RESULT: ' + web3.fromWei(threeExpBal.toNumber(), 'ether') + ' TRU\n      ' +
      'ACTUAL RESULT: ' + web3.fromWei(acctThreeBalTwo.toNumber(), 'ether') + ' TRU');


    assert.equal(acctFiveBalTwo.toNumber(),
      fiveExpBal.toNumber(),
      '\n      ' +
      'UNIT TESTS - TRUCROWDSALE - TEST CASE 28: Test #3\n      ' +
      'TEST DESCRIPTION: Balance of Account Five not as expected\n      ' +
      'EXPECTED RESULT: ' + web3.fromWei(fiveExpBal.toNumber(), 'ether') + ' TRU\n      ' +
      'ACTUAL RESULT: ' + web3.fromWei(acctFiveBalTwo.toNumber(), 'ether') + ' TRU');

    // Simulate TransferFrom
    acctOneBal = await truToken.balanceOf.call(acctOne);
    let acctTwoBal = await truToken.balanceOf.call(acctTwo);

    await truToken.approve(acctThree, truAmt, { from: acctTwo });
    await truToken.transferFrom(acctTwo, acctOne, truAmt, { from: acctThree })

    let estOneBal = acctOneBal.add(truAmt);
    let newAcctOneBal = await truToken.balanceOf.call(acctOne);
    let estTwoBal = acctTwoBal.sub(truAmt);
    let newAcctTwoBal = await truToken.balanceOf.call(acctTwo);

    assert.isTrue(newAcctOneBal.equals(estOneBal),
      '\n      ' +
      'UNIT TESTS - TRUCROWDSALE - TEST CASE 28: Test #4\n      ' +
      'TEST DESCRIPTION: Balance of Account One is incorrect \n      ' +
      'EXPECTED RESULT: ' + web3.fromWei(estOneBal.toNumber(), 'ether') + ' TRU\n      ' +
      'ACTUAL RESULT: ' + web3.fromWei(newAcctOneBal.toNumber(), 'ether') + ' TRU');

    assert.isTrue(newAcctTwoBal.equals(estTwoBal),
      '\n      ' +
      'UNIT TESTS - TRUCROWDSALE - TEST CASE 28: Test #5\n      ' +
      'TEST DESCRIPTION: Balance of Account Two not as expected\n      ' +
      'EXPECTED RESULT: ' + web3.fromWei(estTwoBal.toNumber(), 'ether') + ' TRU\n      ' +
      'ACTUAL RESULT: ' + web3.fromWei(newAcctTwoBal.toNumber(), 'ether') + ' TRU');

    await truToken.releaseTokenTransfer().should.be.rejectedWith(EVMRevert);
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUCROWDSALE - TEST CASE 29: CrowdSale has higher cap if PreSale did not hit cap', async function() {
    currentTime = web3.eth.getBlock('latest').timestamp;
    let psStartTimeThree = currentTime + oneDayTS;
    let psEndTimeThree = psStartTimeThree + oneMonthTS;
    let duringPreSale = psStartTimeThree + oneDayTS;

    let sStartTimeThree = psEndTimeThree + oneMonthTS;
    let sEndTimeThree = sStartTimeThree + oneMonthTS;

    let truTokenThree = await TruReputationToken.new();
    let psInstThree = await TruPreSale.new(psStartTimeThree, psEndTimeThree, truTokenThree.address, execAcct, { from: acctOne });
    let psAddressThree = psInstThree.address;
    await truTokenThree.setReleaseAgent(psAddressThree, { from: acctOne });
    await truTokenThree.transferOwnership(psAddressThree);

    await increaseTimeTo(duringPreSale);
    await psInstThree.updateWhitelist(acctThree, 1, { from: acctOne });
    await psInstThree.buy({ from: acctThree, value: web3.toWei(truAmt, 'ether') });
    let afterEnd = psEndTimeThree + oneDayTS;
    await increaseTimeTo(afterEnd);
    let psEnded = await psInstThree.hasEnded.call();
    await psInstThree.finalise({ from: acctOne });
    let truTokenSupplyThree = await truTokenThree.totalSupply.call();
    let currentRaised = await psInstThree.weiRaised.call();

    // Start Second Crowdsale
    let csInstThree = await TruCrowdSale.new(sStartTimeThree, sEndTimeThree, truTokenThree.address, execAcct, truTokenSupplyThree, currentRaised, { from: acctOne });
    let csAddressThree = csInstThree.address;
    let threeCap = await csInstThree.cap.call();

    // Cap for CrowdSale should be 82,000 ETH not 80,000 ETH (88,000 ETH minus 6,000 ETH raised during PreSale)
    assert.isTrue(threeCap.equals(web3.toWei(unsoldCSCap, 'ether')),
      '\n      ' +
      'UNIT TESTS - TRUCROWDSALE - TEST CASE 29: Test #1\n      ' +
      'TEST DESCRIPTION: Cap is not as expected\n      ' +
      'EXPECTED RESULT: 122,000 ETH\n      ' +
      'ACTUAL RESULT: ' + web3.fromWei(threeCap, 'ether') + ' ETH');
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUCROWDSALE - TEST CASE 30: Can change CrowdSale end time to further into the future', async function(){
    currentTime = web3.eth.getBlock('latest').timestamp;
    let startTime = currentTime + oneDayTS;
    let endTimeOne = currentTime + oneMonthTS;

    // Create Token
    let tempToken = await TruReputationToken.new({from: acctOne });
    
    // Create CrowdSale
    let cSale = await TruCrowdSale.new(startTime, endTimeOne, tempToken.address, execAcct, 0, 0, {from: acctOne });
    let csEndTime = await cSale.saleEndTime.call();

    assert.isTrue(csEndTime.equals(endTimeOne),
      '\n      ' +
      'UNIT TESTS - TRUCROWDSALE - TEST CASE 30: Test #1\n      ' +
      'TEST DESCRIPTION: Incorrect initial CrowdSale End Time. \n      ' +
      'EXPECTED RESULT: ' + endTimeOne + '\n      ' +
      'ACTUAL RESULT: ' + csEndTime.toFormat(0));
    
    
    let endTimeTwo = endTimeOne + oneDayTS;
    let etWatch = cSale.EndChanged();
    // Set new end time
    await cSale.changeEndTime(endTimeTwo);
    let watchResult = etWatch.get();
    let newCsEndTime = await cSale.saleEndTime.call();

    assert.isTrue(newCsEndTime.equals(endTimeTwo),
      '\n      ' +
      'UNIT TESTS - TRUCROWDSALE - TEST CASE 30: Test #2\n      ' +
      'TEST DESCRIPTION: Incorrect new CrowdSale End Time. \n      ' +
      'EXPECTED RESULT: ' + endTimeTwo + '\n      ' +
      'ACTUAL RESULT: ' + newCsEndTime.toFormat(0));
    
    assert.equal(watchResult.length,
      1,
      '\n      ' +
      'UNIT TESTS - TRUCROWDSALE - TEST CASE 30: Test #3\n      ' +
      'TEST DESCRIPTION: Incorrect EndChanged Event length for TruCrowdSale\n      ' +
      'EXPECTED RESULT: 1\n      ' +
      'ACTUAL RESULT: ' + watchResult.length);

    assert.isTrue(watchResult[0].args._newEnd.equals(endTimeTwo),
      '\n      ' +
      'UNIT TESTS - TRUCROWDSALE - TEST CASE 30: Test #4\n      ' +
      'TEST DESCRIPTION: Incorrect End Time argument on EndChanged Event. \n      ' +
      'EXPECTED RESULT: ' + endTimeTwo + '\n      ' +
      'ACTUAL RESULT: ' + watchResult[0].args._newEnd.toFormat(0));
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUCROWDSALE - TEST CASE 31: Cannot change CrowdSale end time to less than start time', async function(){
    currentTime = web3.eth.getBlock('latest').timestamp;
    let startTime = currentTime + oneDayTS;
    let endTimeOne = currentTime + oneMonthTS;

    // Create Token
    let tempToken = await TruReputationToken.new({from: acctOne });
    
    // Create CrowdSale
    let cSale = await TruCrowdSale.new(startTime, endTimeOne, tempToken.address, execAcct, 0, 0, {from: acctOne });
    let csEndTime = await cSale.saleEndTime.call();

    assert.isTrue(csEndTime.equals(endTimeOne),
      '\n      ' +
      'UNIT TESTS - TRUCROWDSALE - TEST CASE 31: Test #1\n      ' +
      'TEST DESCRIPTION: Incorrect initial CrowdSale End Time. \n      ' +
      'EXPECTED RESULT: ' + endTimeOne + '\n      ' +
      'ACTUAL RESULT: ' + csEndTime.toFormat(0));
    
    let endTimeTwo = startTime - oneDayTS;
    let etWatch = cSale.EndChanged();
    // Set new end time
    await cSale.changeEndTime(endTimeTwo, {from: acctOne }).should.be.rejectedWith(EVMRevert);
    let watchResult = etWatch.get();
    let newCsEndTime = await cSale.saleEndTime.call();

    assert.isTrue(newCsEndTime.equals(endTimeOne),
      '\n      ' +
      'UNIT TESTS - TRUCROWDSALE - TEST CASE 31: Test #2\n      ' +
      'TEST DESCRIPTION: Incorrect initial CrowdSale End Time. \n      ' +
      'EXPECTED RESULT: ' + endTimeOne + '\n      ' +
      'ACTUAL RESULT: ' + newCsEndTime.toFormat(0));

    assert.equal(watchResult.length,
      0,
      '\n      ' +
      'UNIT TESTS - TRUCROWDSALE - TEST CASE 31: Test #3\n      ' +
      'TEST DESCRIPTION: Incorrect EndChanged Event length for TruCrowdSale\n      ' +
      'EXPECTED RESULT: 0\n      ' +
      'ACTUAL RESULT: ' + watchResult.length);

  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUCROWDSALE - TEST CASE 32: Can change CrowdSale end time to less than current end time', async function(){
    currentTime = web3.eth.getBlock('latest').timestamp;
    let startTime = currentTime + oneDayTS;
    let endTimeOne = currentTime + oneMonthTS;

    // Create Token
    let tempToken = await TruReputationToken.new({from: acctOne });
    
    // Create CrowdSale
    let cSale = await TruCrowdSale.new(startTime, endTimeOne, tempToken.address, execAcct, 0, 0, {from: acctOne });
    let csEndTime = await cSale.saleEndTime.call();

    assert.isTrue(csEndTime.equals(endTimeOne),
      '\n      ' +
      'UNIT TESTS - TRUCROWDSALE - TEST CASE 32: Test #1\n      ' +
      'TEST DESCRIPTION: Incorrect initial CrowdSale End Time. \n      ' +
      'EXPECTED RESULT: ' + endTimeOne + '\n      ' +
      'ACTUAL RESULT: ' + csEndTime.toFormat(0));

    
    let endTimeTwo = endTimeOne - oneDayTS;
    let etWatch = cSale.EndChanged();
    // Set new end time
    await cSale.changeEndTime(endTimeTwo);
    let watchResult = etWatch.get();
    let newCsEndTime = await cSale.saleEndTime.call();

    assert.isTrue(newCsEndTime.equals(endTimeTwo),
      '\n      ' +
      'UNIT TESTS - TRUCROWDSALE - TEST CASE 32: Test #2\n      ' +
      'TEST DESCRIPTION: Incorrect new CrowdSale End Time. \n      ' +
      'EXPECTED RESULT: ' + endTimeTwo + '\n      ' +
      'ACTUAL RESULT: ' + newCsEndTime.toFormat(0));
    
    assert.equal(watchResult.length,
      1,
      '\n      ' +
      'UNIT TESTS - TRUCROWDSALE - TEST CASE 32: Test #3\n      ' +
      'TEST DESCRIPTION: Incorrect EndChanged Event length for TruCrowdSale\n      ' +
      'EXPECTED RESULT: 1\n      ' +
      'ACTUAL RESULT: ' + watchResult.length);

    assert.isTrue(watchResult[0].args._newEnd.equals(endTimeTwo),
      '\n      ' +
      'UNIT TESTS - TRUCROWDSALE - TEST CASE 32: Test #4\n      ' +
      'TEST DESCRIPTION: Incorrect End Time argument on EndChanged Event. \n      ' +
      'EXPECTED RESULT: ' + endTimeTwo + '\n      ' +
      'ACTUAL RESULT: ' + watchResult[0].args._newEnd.toFormat(0));

  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUCROWDSALE - TEST CASE 33: Can change CrowdSale end time to less than current time & end sale', async function(){
    currentTime = web3.eth.getBlock('latest').timestamp;
    let startTime = currentTime + oneDayTS;
    let endTimeOne = currentTime + oneMonthTS;

    // Create Token
    let tempToken = await TruReputationToken.new({from: acctOne });
    
    // Create CrowdSale
    let cSale = await TruCrowdSale.new(startTime, endTimeOne, tempToken.address, execAcct, 0, 0, {from: acctOne });
    let csEndTime = await cSale.saleEndTime.call();

    assert.isTrue(csEndTime.equals(endTimeOne),
      '\n      ' +
      'UNIT TESTS - TRUCROWDSALE - TEST CASE 33: Test #1\n      ' +
      'TEST DESCRIPTION: Incorrect initial CrowdSale End Time. \n      ' +
      'EXPECTED RESULT: ' + endTimeOne + '\n      ' +
      'ACTUAL RESULT: ' + csEndTime.toFormat(0));

    let endTimeTwo = startTime + oneDayTS;
    let duringSale = endTimeTwo + (oneDayTS + oneDayTS);

    await increaseTimeTo(duringSale);
    
    let etWatch = cSale.EndChanged();
    // Set new end time
    await cSale.changeEndTime(endTimeTwo);
    let watchResult = etWatch.get();
    let newCsEndTime = await cSale.saleEndTime.call();
    let csEndStatus = await cSale.hasEnded.call();

    assert.isTrue(newCsEndTime.equals(endTimeTwo),
      '\n      ' +
      'UNIT TESTS - TRUCROWDSALE - TEST CASE 33: Test #2\n      ' +
      'TEST DESCRIPTION: Incorrect new CrowdSale End Time. \n      ' +
      'EXPECTED RESULT: ' + endTimeTwo + '\n      ' +
      'ACTUAL RESULT: ' + newCsEndTime.toFormat(0));
    
    assert.equal(watchResult.length,
      1,
      '\n      ' +
      'UNIT TESTS - TRUCROWDSALE - TEST CASE 33: Test #3\n      ' +
      'TEST DESCRIPTION: Incorrect EndChanged Event length for TruCrowdSale\n      ' +
      'EXPECTED RESULT: 1\n      ' +
      'ACTUAL RESULT: ' + watchResult.length);

    assert.isTrue(watchResult[0].args._newEnd.equals(endTimeTwo),
      '\n      ' +
      'UNIT TESTS - TRUCROWDSALE - TEST CASE 33: Test #4\n      ' +
      'TEST DESCRIPTION: Incorrect End Time argument on EndChanged Event. \n      ' +
      'EXPECTED RESULT: ' + endTimeTwo + '\n      ' +
      'ACTUAL RESULT: ' + watchResult[0].args._newEnd.toFormat(0));
    
    assert.isTrue(csEndStatus,
      '\n      ' +
      'UNIT TESTS - TRUCROWDSALE - TEST CASE 33: Test #5\n      ' +
      'TEST DESCRIPTION: Incorrect CrowdSale hasEnded Status for TruCrowdSale\n      ' +
      'EXPECTED RESULT: true\n' +
      'ACTUAL RESULT: ' + csEndStatus);

  }).timeout(timeoutDuration);
  
  it('UNIT TESTS - TRUCROWDSALE - TEST CASE 34: Only Crowdsale Owner can change CrowdSale end time', async function(){
    currentTime = web3.eth.getBlock('latest').timestamp;
    let startTime = currentTime + oneDayTS;
    let endTimeOne = currentTime + oneMonthTS;

    // Create Token
    let tempToken = await TruReputationToken.new({from: acctOne });
    
    // Create CrowdSale
    let cSale = await TruCrowdSale.new(startTime, endTimeOne, tempToken.address, execAcct, 0, 0, {from: acctOne });
    let csEndTime = await cSale.saleEndTime.call();

    assert.isTrue(csEndTime.equals(endTimeOne),
      '\n      ' +
      'UNIT TESTS - TRUCROWDSALE - TEST CASE 34: Test #1\n      ' +
      'TEST DESCRIPTION: Incorrect initial CrowdSale End Time. \n      ' +
      'EXPECTED RESULT: ' + endTimeOne + '\n      ' +
      'ACTUAL RESULT: ' + csEndTime.toFormat(0));
    
    
    let endTimeTwo = endTimeOne + oneDayTS;
    let etWatch = cSale.EndChanged();
    // Set new end time
    await cSale.changeEndTime(endTimeTwo, {from: acctFive}).should.be.rejectedWith(EVMRevert);
    let watchResult = etWatch.get();
    let newCsEndTime = await cSale.saleEndTime.call();

    assert.isTrue(newCsEndTime.equals(endTimeOne),
      '\n      ' +
      'UNIT TESTS - TRUCROWDSALE - TEST CASE 34: Test #2\n      ' +
      'TEST DESCRIPTION: Incorrect new CrowdSale End Time. \n      ' +
      'EXPECTED RESULT: ' + endTimeTwo + '\n      ' +
      'ACTUAL RESULT: ' + newCsEndTime.toFormat(0));
    
    assert.equal(watchResult.length,
      0,
      '\n      ' +
      'UNIT TESTS - TRUCROWDSALE - TEST CASE 34: Test #3\n      ' +
      'TEST DESCRIPTION: Incorrect EndChanged Event length for TruCrowdSale\n      ' +
      'EXPECTED RESULT: 0\n      ' +
      'ACTUAL RESULT: ' + watchResult.length);
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUCROWDSALE - TEST CASE 35: Cannot create Crowdsale with end time before start time', async function(){
    currentTime = web3.eth.getBlock('latest').timestamp;
    let startTime = currentTime + oneMonthTS;
    let endTime = currentTime + oneDayTS;

    // Create Token
    let tempToken = await TruReputationToken.new({from: acctOne });
    
    await TruCrowdSale.new(startTime, endTime, tempToken.address, execAcct, 0, 0).should.be.rejectedWith(EVMRevert);

  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUCROWDSALE - TEST CASE 36: Cannot create Crowdsale with invalid Token Address', async function(){
    let invalidTokenAddr = "0x0000000000000000000000000000000000000000";
    currentTime = web3.eth.getBlock('latest').timestamp;
    let startTime = currentTime + oneDayTS;
    let endTime = currentTime + oneMonthTS;

    // Create Token
    let tempToken = await TruReputationToken.new({from: acctOne });
    
    await TruCrowdSale.new(startTime, endTime, invalidTokenAddr, execAcct, 0, 0).should.be.rejectedWith(EVMRevert);
    await TruCrowdSale.new(startTime, endTime, 0x0000000000000000000000000000000000000000, execAcct, 0, 0).should.be.rejectedWith(EVMRevert);
    await TruCrowdSale.new(startTime, endTime, 0x0, execAcct, 0, 0).should.be.rejectedWith(EVMRevert);

  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUCROWDSALE - TEST CASE 37: Cannot create Crowdsale with invalid Sale Wallet Address', async function(){
    let invalidWalletAdr = "0x0000000000000000000000000000000000000000";
    currentTime = web3.eth.getBlock('latest').timestamp;
    let startTime = currentTime + oneDayTS;
    let endTime = currentTime + oneMonthTS;

    // Create Token
    let tempToken = await TruReputationToken.new({from: acctOne });
    
    await TruCrowdSale.new(startTime, endTime, tempToken.address, invalidWalletAdr, 0, 0).should.be.rejectedWith(EVMRevert);
    await TruCrowdSale.new(startTime, endTime, tempToken.address, 0x0000000000000000000000000000000000000000, 0, 0).should.be.rejectedWith(EVMRevert);
    await TruCrowdSale.new(startTime, endTime, tempToken.address, 0x0, 0, 0).should.be.rejectedWith(EVMRevert);
  }).timeout(timeoutDuration);

});