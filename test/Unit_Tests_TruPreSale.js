/**
 * @file        The following Tests are written for unit testing the TruPreSale Smart Contract
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

contract('TruPreSale', function(accounts) {

  let currentTime = web3.eth.getBlock('latest').timestamp;
  let truToken;
  let psInst;
  let psAddress;
  let acctOne = accounts[0];
  let acctTwo = accounts[1];
  let acctThree = accounts[2];
  let acctFour = accounts[3];
  let acctFive = accounts[4];
  let execAcct = accounts[9];
  let acctTwoBal;
  let pSaleRate;
  let tokenSupply;
  let psCap;
  let psMaxPurchase;
  let psMinPurchase;
  let soldEth;
  let halfEth = web3.toWei(0.5, 'ether');
  let oneEth = web3.toWei(1, 'ether');
  let twentyThreeEth = web3.toWei(23, 'ether');
  let fiftyOneEth = web3.toWei(51, 'ether');
  let twentySixEth = web3.toWei(26, 'ether');
  let maxEthPurchase = 20;
  let minPurchase = oneEth;
  let belowCapNumber = maxEthPurchase - 2;
  let maxPurchase = web3.toWei(maxEthPurchase, 'ether');
  let belowCapEth = web3.toWei(belowCapNumber, 'ether');
  let psEthCap = 8000;
  let pSaleCap = new BigNumber(web3.toWei(psEthCap, 'ether'));
  let truAmt = 10000;
  let psRate = 1250;
  let preSaleTokenCount = new BigNumber(web3.toWei(10000000, 'ether'));
  let totalTokens = new BigNumber(web3.toWei(20000000, 'ether'));
  let psStartTime;
  let psEndTime;
  let estSold;
  let overPSCap = web3.toWei(13000, 'ether');
  let oneDayTS = 86400;
  let oneMonthTS = 2592000;

  it('UNIT TESTS - TRUPRESALE - TEST CASE 01: Cannot deploy TruPreSale with incorrect variables', async function() {
    currentTime = web3.eth.getBlock('latest').timestamp;
    psStartTime = currentTime + oneDayTS;
    psEndTime = psStartTime + oneMonthTS;

    truToken = await TruReputationToken.new({ from: acctOne });

    await truToken.changeBoardAddress(execAcct, { from: acctOne });

    let expiredStart = currentTime - oneDayTS;

    // Should fail to create Pre-Sale with expired psStartTime
    await TruPreSale.new(expiredStart, psEndTime, truToken.address, execAcct).should.be.rejectedWith(EVMRevert);

    // Should fail to create Pre-Sale with psEndTime before psStartTime
    await TruPreSale.new(psEndTime, psStartTime, truToken.address, execAcct).should.be.rejectedWith(EVMRevert);

    // Should fail to create Pre-Sale with invalid Tru Token
    await TruPreSale.new(psStartTime, psEndTime, 0x0, execAcct).should.be.rejectedWith(EVMRevert);

    // Should fail to create Pre-Sale with invalid Sale Wallet
    await TruPreSale.new(psStartTime, psEndTime, truToken.address, 0x0).should.be.rejectedWith(EVMRevert);

    // Should fail to create Pre-Sale with incorrect Owner
    await TruPreSale.new(psStartTime, psEndTime, truToken.address, execAcct, {from: acctTwo}).should.be.rejectedWith(EVMRevert);

  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUPRESALE - TEST CASE 02: TruPreSale and TruReputationToken are deployed', async function() {
    currentTime = web3.eth.getBlock('latest').timestamp;
    psStartTime = currentTime + oneDayTS;
    psEndTime = psStartTime + oneMonthTS;
    psInst = await TruPreSale.new(psStartTime, psEndTime, truToken.address, execAcct);
    tokenSupply = await truToken.totalSupply.call();
    psAddress = psInst.address;
    pSaleRate = await psInst.PRESALERATE.call();

    // Token Supply should be 0
    assert.isTrue(tokenSupply.equals(0),
      '\n      ' +
      'UNIT TESTS - TRUPRESALE - TEST CASE 02: Test #1\n      ' +
      'TEST DESCRIPTION: Incorrect tokenSupply set for TruReputationToken\n      ' +
      'EXPECTED RESULT: 0\n      ' +
      'ACTUAL RESULT: ' + tokenSupply.toFormat(0));

    // PreSale TRU to ETH rate should be 1250 TRU per ETH
    assert.isTrue(pSaleRate.equals(psRate),
      '\n      ' +
      'UNIT TESTS - TRUPRESALE - TEST CASE 02: Test #2\n      ' +
      'TEST DESCRIPTION: pSaleRate incorrect\n      ' +
      'EXPECTED RESULT: Should be 1250 TRU per ETH. \n      ' +
      'ACTUAL RESULT: ' + pSaleRate.toFormat(0));
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUPRESALE - TEST CASE 03: Fallback function should revert', async function() {
    // Should fail to send to Ether to PreSale
    try {
      await web3.eth.sendTransaction({ from: acctOne, to: psAddress, value: web3.toWei(1, 'ether') });
      assert.fail('Expected revert not received');
    } catch (error) {
      const revert = error.message.search('revert') >= 0;
      assert(revert,
        'UNIT TESTS - TRUPRESALE - TEST CASE 03: Test #1\n      ' +
        'TEST DESCRIPTION: Fallback function did not revert\n      ' +
        'EXPECTED RESULT: revert\n      ' +
        'ACTUAL RESULT: ' + error);
    }
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUPRESALE - TEST CASE 04: Pre-Sale hard variables are as expected', async function() {
    psMinPurchase = await psInst.MINAMOUNT.call();
    psMaxPurchase = await psInst.MAXAMOUNT.call();
    psCap = await psInst.cap.call();

    // Minimum Purchase on PreSale should be 1 ETH
    assert.equal(web3.fromWei(psMinPurchase, 'ether'),
      1,
      '\n      ' +
      'UNIT TESTS - TRUPRESALE - TEST CASE 04: Test #1\n      ' +
      'TEST DESCRIPTION: Incorrect Minimum Purchase Amount for TruReputationToken\n      ' +
      'EXPECTED RESULT: 1\n      ' +
      'ACTUAL RESULT: ' + web3.fromWei(psMinPurchase, 'ether'));

    // Maximum Non-Whitelist Purchase on PreSale should be the same as maxEthPurchase
    assert.equal(web3.fromWei(psMaxPurchase, 'ether'),
      maxEthPurchase,
      '\n      ' +
      'UNIT TESTS - TRUPRESALE - TEST CASE 04: Test #2\n      ' +
      'TEST DESCRIPTION: Incorrect Maximum Purchase Amount for TruReputationToken\n      ' +
      'EXPECTED RESULT: 25\n      ' +
      'ACTUAL RESULT: ' + web3.fromWei(psMaxPurchase, 'ether'));

    // Cap on PreSale should equal psEthCap
    assert.equal(web3.fromWei(psCap, 'ether'),
      psEthCap,
      '\n      ' +
      'UNIT TESTS - TRUPRESALE - TEST CASE 04: Test #3\n      ' +
      'TEST DESCRIPTION: Incorrect Cap for TruReputationToken\n      ' +
      'EXPECTED RESULT: 8000\n      ' +
      'ACTUAL RESULT: ' + web3.fromWei(psCap, 'ether'));
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUPRESALE - TEST CASE 05: Set Release Agent for TruReputationToken', async function() {
    await truToken.setReleaseAgent(psAddress, { from: acctOne });
    let agent = await truToken.releaseAgent.call({ from: acctOne });

    // The PreSale should be the Release Agent on the TruReputationToken
    assert.equal(agent,
      psAddress,
      '\n      ' +
      'UNIT TESTS - TRUPRESALE - TEST CASE 05: Test #1\n      ' +
      'TEST DESCRIPTION: Incorrect Release Agent set for TruReputationToken\n      ' +
      'EXPECTED RESULT: ' + psAddress + '\n      ' +
      'ACTUAL RESULT: ' + agent);
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUPRESALE - TEST CASE 06: Transfer TruReputationToken ownership to Pre-Sale', async function() {
    await truToken.transferOwnership(0x0, { from: acctOne }).should.be.rejectedWith(EVMRevert);

    await truToken.transferOwnership(psAddress, { from: acctOne });

    let tokenOwner = await truToken.owner.call({ from: acctOne });
    let psOwner = await psInst.owner.call({ from: acctOne });

    // The PreSale should own the TruReputationToken
    assert.equal(tokenOwner,
      psAddress,
      '\n      ' +
      'UNIT TESTS - TRUPRESALE - TEST CASE 06: Test #1\n      ' +
      'TEST DESCRIPTION: Incorrect owner set for TruReputationToken\n      ' +
      'EXPECTED RESULT: ' + psAddress + '\n      ' +
      'ACTUAL RESULT: ' + tokenOwner);

    // Account One should own the PreSale
    assert.equal(psOwner,
      acctOne,
      '\n      ' +
      'UNIT TESTS - TRUPRESALE - TEST CASE 06: Test #2\n      ' +
      'TEST DESCRIPTION: Incorrect owner set for TruPreSale\n      ' +
      'EXPECTED RESULT: ' + acctOne + '\n      ' +
      'ACTUAL RESULT: ' + psOwner);
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUPRESALE - TEST CASE 07: Can Add Purchaser to Purchaser Whitelist', async function() {
    let wlWatch = psInst.WhiteListUpdate();
    await psInst.updateWhitelist(acctThree, 1, { from: acctOne });
    let watchResult = await wlWatch.get();
    let whiteListed = await psInst.purchaserWhiteList(acctThree, { from: acctOne });

    // A WhiteListUpdate Event should have been fired
    assert.equal(watchResult.length,
      1,
      '\n      ' +
      'UNIT TESTS - TRUPRESALE - TEST CASE 07: Test #1\n      ' +
      'TEST DESCRIPTION: Incorrect Whitelist Event length for TruPreSale\n      ' +
      'EXPECTED RESULT: 1\n      ' +
      'ACTUAL RESULT: ' + watchResult.length);

    // The White List Status for account Three should equal 'true' (Active on WhiteList)
    assert.isTrue(watchResult[0].args._whitelistStatus,
      '\n      ' +
      'UNIT TESTS - TRUPRESALE - TEST CASE 07: Test #2\n      ' +
      'TEST DESCRIPTION: Incorrect status on Whitelist entry for TruPreSale. \n      ' +
      'EXPECTED RESULT: true\n      ' +
      'ACTUAL RESULT: ' + watchResult[0].args._whitelistStatus);

    // The White List Purchaser Address should be Account Three
    assert.equal(watchResult[0].args._purchaserAddress,
      acctThree,
      '\n      ' +
      'UNIT TESTS - TRUPRESALE - TEST CASE 07: Test #3\n      ' +
      'TEST DESCRIPTION: Incorrect Whitelist entry for TruPreSale\n      ' +
      'EXPECTED RESULT: ' + acctThree + '\n      ' +
      'ACTUAL RESULT: ' + watchResult[0].args._purchaserAddress);

    // A query to the Contract should show Account Three is Active on the Whitelist
    assert.isTrue(whiteListed,
      '\n      ' +
      'UNIT TESTS - TRUPRESALE - TEST CASE 07: Test #4\n      ' +
      'TEST DESCRIPTION: Address is not on Whitelist for TruPreSale\n      ' +
      'EXPECTED RESULT: true\n      ' +
      'ACTUAL RESULT: ' + whiteListed);

  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUPRESALE - TEST CASE 08: Can Remove Purchaser from Purchaser Whitelist', async function() {

    let wlWatch = psInst.WhiteListUpdate();
    await psInst.updateWhitelist(acctThree, 0);
    let watchResult = wlWatch.get();
    let notWhiteListed = await psInst.purchaserWhiteList(acctThree);

    // A WhiteListUpdate Event should have been fired
    assert.equal(watchResult.length,
      1,
      '\n      ' +
      'UNIT TESTS - TRUPRESALE - TEST CASE 08: Test #1\n      ' +
      'TEST DESCRIPTION: Incorrect Whitelist Event length for TruPreSale\n      ' +
      'EXPECTED RESULT: 1\n      ' +
      'ACTUAL RESULT: ' + watchResult.length);

    // The White List Status for account Three should equal 'false' (Inactive on WhiteList)
    assert.isFalse(watchResult[0].args._whitelistStatus,
      '\n      ' +
      'UNIT TESTS - TRUPRESALE - TEST CASE 08: Test #2\n      ' +
      'TEST DESCRIPTION: Incorrect status on Whitelist entry for TruPreSale\n      ' +
      'EXPECTED RESULT: false\n      ' +
      'ACTUAL RESULT: ' + watchResult[0].args._whitelistStatus);

    // The White List Purchaser Address should be Account Three
    assert.equal(watchResult[0].args._purchaserAddress,
      acctThree,
      '\n      ' +
      'UNIT TESTS - TRUPRESALE - TEST CASE 08: Test #3\n      ' +
      'TEST DESCRIPTION: Incorrect Whitelist entry for TruPreSale\n      ' +
      'EXPECTED RESULT: ' + acctThree + '\n      ' +
      'ACTUAL RESULT: ' + watchResult[0].args._purchaserAddress);
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUPRESALE - TEST CASE 09: Cannot purchase before start of Pre-Sale', async function() {

    // Should fail when attempting to buy from the PreSale before it has started
    await psInst.buy({ from: acctTwo, value: oneEth }).should.be.rejectedWith(EVMRevert);

    let fundsRaised = await psInst.weiRaised.call();
    let fundsRaisedEth = web3.fromWei(fundsRaised, 'ether');

    // PreSale should have 0 Wei raised
    assert.equal(fundsRaisedEth,
      0,
      '\n      ' +
      'UNIT TESTS - TRUPRESALE - TEST CASE 09: Test #1\n      ' +
      'TEST DESCRIPTION: Incorrect Funds Raised value for TruPreSale\n      ' +
      'EXPECTED RESULT: 0 ETH\n      ' +
      'ACTUAL RESULT: ' + fundsRaised + ' ETH');
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUPRESALE - TEST CASE 10: Cannot purchase below minimum purchase amount', async function() {
    // Fast Forward Time to during PreSale
    let duringPreSale = psStartTime + oneDayTS;
    await increaseTimeTo(duringPreSale);

    // Should fail to allow Account Two to purchase below the minimum Purchase Amount of 1 ETH
    await psInst.buy({ from: acctTwo, value: halfEth }).should.be.rejectedWith(EVMRevert);

    // Should fail to allow Account One to purchase below the minimum Purchase Amount of 1 ETH
    await psInst.buy({ from: acctOne, value: halfEth }).should.be.rejectedWith(EVMRevert);

    let fundsRaised = await psInst.weiRaised.call();
    let fundsRaisedEth = web3.fromWei(fundsRaised, 'ether');

    // PreSale should have 0 Wei raised
    assert.equal(fundsRaisedEth,
      0,
      '\n      ' +
      'UNIT TESTS - TRUPRESALE - TEST CASE 10: Test #1\n      ' +
      'TEST DESCRIPTION: Incorrect Funds Raised value for TruPreSale\n      ' +
      'EXPECTED RESULT: 0 Wei\n      ' +
      'ACTUAL RESULT: ' + fundsRaised + ' Wei');
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUPRESALE - TEST CASE 11: Cannot purchase above maximum purchase amount if not on Whitelist', async function() {

    // Should fail to buy 26 ETH for Account Two as it is above maximum purchase for Non-Whitelisted Accounts
    await psInst.buy({ from: acctTwo, value: twentySixEth }).should.be.rejectedWith(EVMRevert);
    let fundsRaised = await psInst.weiRaised.call();
    let fundsRaisedEth = new BigNumber(web3.fromWei(fundsRaised, 'ether'));

    // PreSale should have 0 Wei raised
    assert.isTrue(fundsRaisedEth.equals(0),
      '\n      ' +
      'UNIT TESTS - TRUPRESALE - TEST CASE 11: Test #1\n      ' +
      'TEST DESCRIPTION: Incorrect Funds Raised value for TruPreSale. \n      ' +
      'EXPECTED RESULT: 0 Wei\n      ' +
      'ACTUAL RESULT: ' + fundsRaised + ' Wei');

    // Should succeed for Account Three to buy a cumulative below maximum purchase for Non-Whitelisted Accounts
    await psInst.buy({ from: acctThree, value: belowCapEth });
    soldEth = belowCapNumber
    await psInst.buy({ from: acctThree, value: oneEth });
    soldEth = soldEth + 1;

    // Should fail for Account Three to buy another 24 ETH as the culmulative total should be over 25 ETH
    await psInst.buy({ from: acctThree, value: maxPurchase }).should.be.rejectedWith(EVMRevert);

    let tokensSold = await psInst.soldTokens.call();
    let soldTokens = new BigNumber(web3.fromWei(tokensSold, 'ether'));
    estSold = pSaleRate.mul(soldEth);

    // Sold Tokens should equal to soldEth * 1250 ETH (30,000 TRU)
    assert.isTrue(soldTokens.equals(estSold),
      '\n      ' +
      'UNIT TESTS - TRUPRESALE - TEST CASE 11: Test #2\n      ' +
      'TEST DESCRIPTION: Incorrect purchase balance. \n      ' +
      'EXPECTED RESULT : ' + estSold.toFormat(0) + ' ETH\n      ' +
      'ACTUAL RESULT: ' + soldTokens + ' ETH'
    );

    // Raised Amount should equal soldEth
    fundsRaised = await psInst.weiRaised.call();
    fundsRaisedEth = new BigNumber(web3.fromWei(fundsRaised, 'ether'));

    assert.isTrue(soldTokens.equals(estSold),
      '\n      ' +
      'UNIT TESTS - TRUPRESALE - TEST CASE 11: Test #3\n      ' +
      'TEST DESCRIPTION: Incorrect purchase balance. \n      ' +
      'EXPECTED RESULT : ' + estSold.toFormat(0) + ' ETH\n      ' +
      'ACTUAL RESULT: ' + soldTokens + ' ETH'
    );
    assert.isTrue(fundsRaisedEth.equals(soldEth),
      '\n      ' +
      'UNIT TESTS - TRUPRESALE - TEST CASE 11: Test #4\n      ' +
      'TEST DESCRIPTION: Incorrect Funds Raised value for TruPreSale\n      ' +
      'EXPECTED RESULT: ' + soldEth + ' ETH\n      ' +
      'ACTUAL RESULT: ' + fundsRaised.toFormat(0) + ' ETH');
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUPRESALE - TEST CASE 12: Can purchase above maximum purchase amount if on Whitelist', async function() {

    // Add Account Two to WhiteList
    await psInst.updateWhitelist(acctTwo, 1);

    // Should allow Account Two to purchase 51 ETH (above non-Whitelist maximum purchase)
    await psInst.buy({ from: acctTwo, value: fiftyOneEth })
    soldEth = soldEth + 51;
    estSold = pSaleRate.mul(soldEth);
    let fundsRaised = await psInst.weiRaised.call();


    let fundsRaisedEth = new BigNumber(web3.fromWei(fundsRaised.toNumber(), 'ether'));

    // Funds Raised to date should equal to soldEth
    assert.isTrue(fundsRaisedEth.equals(soldEth),
      '\n      ' +
      'UNIT TESTS - TRUPRESALE - TEST CASE 12: Test #1\n      ' +
      'TEST DESCRIPTION: Incorrect Funds Raised value for TruPreSale. \n      ' +
      'EXPECTED RESULT: ' + soldEth + ' ETH\n      ' +
      'ACTUAL RESULT: ' + fundsRaisedEth.toFormat(0) + ' ETH');

    tokenSupply = await truToken.totalSupply.call();
    let adjustedSupply = new BigNumber(web3.fromWei(tokenSupply, 'ether'));

    // Minted Tokens should equal to 75 * 1250 - 93,750 TRU
    assert.isTrue(adjustedSupply.equals(estSold),
      '\n      ' +
      'UNIT TESTS - TRUPRESALE - TEST CASE 12: Test #2\n      ' +
      'TEST DESCRIPTION: Incorrect Token Supply value for TruPreSale. \n      ' +
      'EXPECTED RESULT: ' + estSold.toFormat(0) + ' TRU\n      ' +
      'ACTUAL RESULT: ' + adjustedSupply.toFormat(0) + ' TRU');
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUPRESALE - TEST CASE 13: Can halt Pre-Sale in an emergency', async function() {
    await psInst.halt({ from: acctOne });

    // Should fail to buy from PreSale whilst it is halted
    await psInst.buy({ from: acctOne, value: oneEth }).should.be.rejectedWith(EVMRevert);
    let fundsRaised = await psInst.weiRaised.call();

    let fundsRaisedEth = new BigNumber(web3.fromWei(fundsRaised, 'ether'));
    let haltStatus = await psInst.halted.call();

    // PreSale should be halted
    assert.isTrue(haltStatus,
      '\n      ' +
      'UNIT TESTS - TRUPRESALE - TEST CASE 13: Test #1\n      ' +
      'TEST DESCRIPTION: Incorrect Halt Status for TruPreSale\n      ' +
      'EXPECTED RESULT: true\n      ' +
      'ACTUAL RESULT: ' + haltStatus);

    // Funds Raised to date should equal to 75 ETH
    assert.isTrue(fundsRaisedEth.equals(soldEth),
      '\n      ' +
      'UNIT TESTS - TRUPRESALE - TEST CASE 13: Test #2\n      ' +
      'TEST DESCRIPTION: Incorrect Funds Raised value for TruPreSale\n      ' +
      'EXPECTED RESULT: ' + soldEth + ' ETH\n      ' +
      'ACTUAL RESULT: ' + fundsRaisedEth.toFormat(0) + ' ETH');


    tokenSupply = await truToken.totalSupply.call()
    let normalisedSupply = new BigNumber(web3.fromWei(tokenSupply.toNumber(), 'ether'));
    assert.isTrue(normalisedSupply.equals(estSold),
      '\n      ' +
      'UNIT TESTS - TRUPRESALE - TEST CASE 13: Test #3\n      ' +
      'TEST DESCRIPTION: Incorrect Tokens Sold value for TruPreSale\n      ' +
      'EXPECTED RESULT: ' + estSold.toFormat(0) + ' TRU;\n      ' +
      'ACTUAL RESULT: ' + normalisedSupply.toFormat(0));

    await psInst.unhalt({ from: acctOne })

    // Repeated attempts to unhalt should fail
    await psInst.unhalt({ from: acctOne }).should.be.rejectedWith(EVMRevert);
    let haltStatusTwo = await psInst.halted.call();

    // PreSale should not be halted
    assert.isFalse(haltStatusTwo,
      '\n      ' +
      'UNIT TESTS - TRUPRESALE - TEST CASE 13: Test #4\n      ' +
      'TEST DESCRIPTION: Incorrect Halt Status for TruPreSale\n      ' +
      'EXPECTED RESULT: false\n      ' +
      'ACTUAL RESULT: ' + haltStatus);
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUPRESALE - TEST CASE 14: Tokens cannot be transferred before Pre-Sale is finalised', async function() {

    let acctThreeOrgBalance = await truToken.balanceOf.call(acctThree);
    let transferAmount = web3.toWei(pSaleRate, 'ether')
    await truToken.transfer(acctThree, transferAmount, { from: acctOne }).should.be.rejectedWith(EVMRevert);
    await truToken.transfer(0x0, transferAmount, { from: acctOne }).should.be.rejectedWith(EVMRevert);
    let acctThreeBalance = await truToken.balanceOf.call(acctThree);

    // Account Three Balance should
    assert.isTrue(acctThreeOrgBalance.toNumber() == acctThreeBalance.toNumber(),
      '\n      ' +
      'UNIT TESTS - TRUPRESALE - TEST CASE 14: Test #1\n      ' +
      'TEST DESCRIPTION: Incorrect Balance for Account 3 for TruPreSale\n      ' +
      'EXPECTED RESULT: ' + web3.fromWei(acctThreeOrgBalance, 'ether') + ' TRU\n      ' +
      'ACTUAL RESULT: ' + web3.fromWei(acctThreeBalance, 'ether') + ' TRU');
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUPRESALE - TEST CASE 15: Only nominated Release Agent can make Tokens transferable', async function() {
    // Verify token is not in released state
    let tokensTransferable = await truToken.released.call();

    assert.isFalse(tokensTransferable,
      '\n      ' +
      'UNIT TESTS - TRUPRESALE - TEST CASE 15: Test #1\n      ' +
      'TEST DESCRIPTION: Incorrect Released State for TruReputationToken\n      ' +
      'EXPECTED RESULT: false\n      ' +
      'ACTUAL RESULT: ' + tokensTransferable);

    // PreSale Owner cannot release tokens
    await truToken.releaseTokenTransfer({ from: acctOne }).should.be.rejectedWith(EVMRevert);

    tokensTransferable = await truToken.released.call();

    assert.isFalse(tokensTransferable,
      '\n      ' +
      'UNIT TESTS - TRUPRESALE - TEST CASE 15: Test #2\n      ' +
      'TEST DESCRIPTION: Incorrect Released State for TruReputationToken\n      ' +
      'EXPECTED RESULT: false\n      ' +
      'ACTUAL RESULT: ' + tokensTransferable);

    await truToken.setTransferAgent(acctOne, true, { from: acctOne }).should.be.rejectedWith(EVMRevert);
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUPRESALE - TEST CASE 16: Only Token Owner can mint Tokens', async function() {
    let originalSupply = await truToken.totalSupply.call();
    await truToken.mint(psAddress, overPSCap, { from: acctOne }).should.be.rejectedWith(EVMRevert);

    tokenSupply = await truToken.totalSupply.call();

    assert.isTrue(tokenSupply.equals(originalSupply),
      '\n      ' +
      'UNIT TESTS - TRUPRESALE - TEST CASE 16: Test #1\n      ' +
      'TEST DESCRIPTION: Incorrect Total Supply of Token- should not have minted\n      ' +
      'EXPECTED RESULT:' + web3.fromWei(originalSupply.toNumber(), 'ether') + ' TRU\n      ' +
      'ACTUAL RESULT: ' + web3.fromWei(tokenSupply.toNumber(), 'ether') + ' TRU');
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUPRESALE - TEST CASE 17: Has correct Purchaser count', async function() {
    let noOfPurchasers = await psInst.purchaserCount.call();
    assert.equal(noOfPurchasers.toNumber(),
      2,
      '\n      ' +
      'UNIT TESTS - TRUPRESALE - TEST CASE 17: Test #1\n      ' +
      'TEST DESCRIPTION: Incorrect number of purchasers for Pre-Sale\n      ' +
      'EXPECTED RESULT: 2\n      ' +
      'ACTUAL RESULT: ' + noOfPurchasers.toNumber());
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUPRESALE - TEST CASE 18: Cannot buy more than cap', async function() {
    let preRaisedFunds = await psInst.weiRaised.call();

    await psInst.buy({ from: acctThree, value: overPSCap }).should.be.rejectedWith(EVMRevert);
    let postRaisedFunds = await psInst.weiRaised.call();

    assert.equal(web3.toWei(postRaisedFunds.toNumber(), 'ether'),
      web3.toWei(preRaisedFunds.toNumber()),
      '\n      ' +
      'UNIT TESTS - TRUPRESALE - TEST CASE 18: Test #1\n      ' +
      'TEST DESCRIPTION: Raised Funds for Pre-Sale is incorrect\n      ' +
      'EXPECTED RESULT: ' + web3.toWei(preRaisedFunds.toNumber(), 'ether') + '\n      ' +
      'ACTUAL RESULT: ' + web3.toWei(postRaisedFunds.toNumber(), 'ether'));
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUPRESALE - TEST CASE 19: Pre-Sale owner cannot finalise a Pre-Sale before it ends', async function() {
    let isComplete = await psInst.isCompleted.call();

    assert.isFalse(isComplete,
      '\n      ' +
      'UNIT TESTS - TRUPRESALE - TEST CASE 19: Test #1\n      ' +
      'TEST DESCRIPTION: Incorrect Pre-Sale Completion Status\n      ' +
      'EXPECTED RESULT: false\n      ' +
      'ACTUAL RESULT: ' + isComplete);

    await psInst.finalise({ from: acctOne }).should.be.rejectedWith(EVMRevert);

    let isCompleteTwo = await psInst.isCompleted.call();

    assert.isFalse(isCompleteTwo,
      '\n      ' +
      'UNIT TESTS - TRUPRESALE - TEST CASE 19: Test #2\n      ' +
      'TEST DESCRIPTION: Incorrect Pre-Sale Completion Status\n      ' +
      'EXPECTED RESULT: false\n      ' +
      'ACTUAL RESULT: ' + isCompleteTwo);
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUPRESALE - TEST CASE 20: Cannot buy with invalid address', async function() {
    await psInst.buy({ from: 0x0, value: oneEth }).should.be.rejectedWith(EVMInvalidAddress);
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUPRESALE - TEST CASE 21: Cannot buy 0 amount', async function() {
    await psInst.buy({ from: acctThree, value: 0 }).should.be.rejectedWith(EVMRevert);
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUPRESALE - TEST CASE 22: Can buy repeatedly from the same address', async function() {
    let oldSupply = await truToken.totalSupply.call();
    await psInst.updateWhitelist(acctFour, 1);
    let acctFourBal = await truToken.balanceOf.call(acctFour);
    await psInst.buy({ from: acctFour, value: fiftyOneEth })
    await psInst.buy({ from: acctFour, value: web3.toWei(1, 'ether') })

    let estSupply = oldSupply.add(fiftyOneEth * pSaleRate);
    estSupply = estSupply.add((web3.toWei(1, 'ether') * pSaleRate));
    tokenSupply = await truToken.totalSupply.call();
    acctFourBal = await truToken.balanceOf.call(acctFour);
    let purchasedTru = 52 * pSaleRate;

    let acctBalance = new BigNumber(web3.toWei(purchasedTru, 'ether'));
    assert.equal(tokenSupply.toNumber(),
      estSupply,
      '\n      ' +
      'UNIT TESTS - TRUPRESALE - TEST CASE 22: Test #1\n      ' +
      'TEST DESCRIPTION: Token Supply is incorrect. \n      ' +
      'EXPECTED RESULT: ' + estSupply + ' TRU\n      ' +
      'ACTUAL RESULT: ' + web3.fromWei(tokenSupply.toNumber(), 'ether') + ' TRU');

    assert.isTrue(acctFourBal.toNumber() == acctBalance.toNumber(),
      '\n      ' +
      'UNIT TESTS - TRUPRESALE - TEST CASE 22: Test #2\n      ' +
      'TEST DESCRIPTION: Account 4 Balance is incorrect. \n      ' +
      'EXPECTED RESULT: ' + web3.fromWei(acctBalance.toNumber(), 'ether') + ' TRU\n      ' +
      'ACTUAL RESULT: ' + web3.fromWei(acctFourBal.toNumber(), 'ether') + ' TRU');
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUPRESALE - TEST CASE 23: Can buy up to the cap on the Pre-Sale', async function() {
    let raisedFunds = await psInst.weiRaised.call();
    let raisedEth = new BigNumber(web3.fromWei(raisedFunds, 'ether'));

    let soldTokens = await psInst.soldTokens.call();
    let remainingCap = pSaleCap.sub(raisedFunds);
    let remainingTokens = preSaleTokenCount.sub(soldTokens);
    let estSoldTokens = new BigNumber(web3.toWei(pSaleRate.mul(raisedEth.toNumber()), 'ether'));

    let estRemainingTokens = preSaleTokenCount.sub(estSoldTokens);
    estRemainingTokens = new BigNumber(web3.fromWei(estRemainingTokens, 'ether'));

    let estValue = web3.toWei(raisedEth.toNumber(), 'ether');

    assert.isTrue(raisedFunds.equals(estValue),
      '\n      ' +
      'UNIT TESTS - TRUPRESALE - TEST CASE 23: Test #1\n      ' +
      'TEST DESCRIPTION: Raised value is not 132 ETH. \n      ' +
      'EXPECTED RESULT: 132 ETH\n      ' +
      'ACTUAL RESULT: ' + web3.fromWei(raisedFunds.toNumber(), 'ether'));

    let rTruTokens = new BigNumber(web3.fromWei(remainingTokens, 'ether'));

    assert.isTrue(rTruTokens.equals(estRemainingTokens),
      '\n      ' +
      'UNIT TESTS - TRUPRESALE - TEST CASE 23: Test #2\n      ' +
      'TEST DESCRIPTION: Remaining Tokens is not as expected. \n      ' +
      'EXPECTED RESULT: ' + estRemainingTokens.toFormat(0) + ' TRU\n      ' +
      'ACTUAL RESULT: ' + rTruTokens.toFormat(0) + ' TRU');

    await psInst.updateWhitelist(acctThree, 1);

    await psInst.buy({ from: acctThree, value: remainingCap.toNumber() });
    raisedFunds = await psInst.weiRaised.call();

    let acctTwoBal = await truToken.balanceOf.call(acctTwo);
    let acctThreeBal = await truToken.balanceOf.call(acctThree);
    tokenSupply = await truToken.totalSupply.call();

    assert.isTrue(raisedFunds.equals(pSaleCap),
      '\n      ' +
      'UNIT TESTS - TRUPRESALE - TEST CASE 23: Test #3\n      ' +
      'TEST DESCRIPTION: Raised value is not 12500. \n      ' +
      'EXPECTED RESULT: 12500 ETH\n      ' +
      'ACTUAL RESULT: ' + web3.fromWei(raisedFunds.toNumber(), 'ether') + ' ETH');

    assert.isTrue(tokenSupply.equals(preSaleTokenCount),
      '\n      ' +
      'UNIT TESTS - TRUPRESALE - TEST CASE 23: Test #4\n      ' +
      'TEST DESCRIPTION: Incorrect Balance for Token supply for TruPreSale. \n      ' +
      'EXPECTED RESULT: 10000000 TRU\n      ' +
      'ACTUAL RESULT: ' + web3.fromWei(tokenSupply.toNumber(), 'ether') + ' TRU');
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUPRESALE - TEST CASE 24: Cannot buy once the cap is reached on the Pre-Sale', async function() {
    await psInst.buy({ from: acctOne, value: psRate }).should.be.rejectedWith(EVMRevert);

    let raisedFunds = await psInst.weiRaised.call();
    tokenSupply = await truToken.totalSupply.call();
    raisedFunds = web3.fromWei(raisedFunds, 'ether');
    let adjustedCap = web3.fromWei(pSaleCap, 'ether');
    let adjustedSupply = web3.fromWei(tokenSupply, 'ether');

    assert.isTrue(raisedFunds.equals(adjustedCap),
      '\n      ' +
      'UNIT TESTS - TRUPRESALE - TEST CASE 24: Test #1\n      ' +
      'TEST DESCRIPTION: Raised does not match cap.\n      ' +
      'EXPECTED RESULT: ' + adjustedCap.toFormat(0) + ' ETH\n      ' +
      'ACTUAL RESULT: ' + raisedFunds.toFormat(0) + 'ETH');

    assert.isTrue(adjustedSupply.equals(web3.fromWei(preSaleTokenCount, 'ether')),
      '\n      ' +
      'UNIT TESTS - TRUPRESALE - TEST CASE 24: Test #2\n      ' +
      'TEST DESCRIPTION: Total Token Supply is incorrect.\n      ' +
      'EXPECTED RESULT: 10000000 TRU\n      ' +
      'ACTUAL RESULT: ' + adjustedSupply.toFormat(0) + ' TRU');
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUPRESALE - TEST CASE 25: Cannot buy once Pre-Sale has ended', async function() {
    currentTime = web3.eth.getBlock('latest').timestamp
    let psStartTimeTwo = currentTime + oneDayTS;
    let psEndTimeTwo = psStartTimeTwo + oneMonthTS;
    // Setup up second Pre-Sale and Token Instance
    let truTokenTwo = await TruReputationToken.new({ from: acctOne });
    await truTokenTwo.changeBoardAddress(execAcct, { from: acctOne });
    let psInstTwo = await TruPreSale.new(psStartTimeTwo, psEndTimeTwo, truTokenTwo.address, execAcct, { from: acctOne });
    let psAddressTwo = psInstTwo.address;
    await truTokenTwo.setReleaseAgent(acctFive, { from: acctOne });
    await truTokenTwo.transferOwnership(psAddressTwo, { from: acctOne });
    await psInstTwo.updateWhitelist(acctFour, 1);
    let duringPreSale = psStartTimeTwo + oneDayTS;
    await increaseTimeTo(duringPreSale);
    await psInstTwo.buy({ from: acctFour, value: oneEth });
    let acctFourBalance = await truTokenTwo.balanceOf.call(acctFour);
    let adjustBalance = web3.fromWei(acctFourBalance, 'ether');

    assert.isTrue(adjustBalance.equals(psRate),
      '\n      ' +
      'UNIT TESTS - TRUPRESALE - TEST CASE 25: Test #1\n      ' +
      'TEST DESCRIPTION: Incorrect in-sale balance for account 4. \n      ' +
      'EXPECTED RESULT 1250 \n      ' +
      'ACTUAL RESULT: ' + acctFourBalance.toFormat(18));

    let afterPreSale = psEndTimeTwo + oneDayTS;
    await increaseTimeTo(afterPreSale);
    let hasEnded = await psInstTwo.hasEnded.call();
    currentTime = web3.eth.getBlock('latest').timestamp;
    assert.isTrue(hasEnded,
      '\n      ' +
      'UNIT TESTS - TRUPRESALE - TEST CASE 25: Test #2\n      ' +
      'TEST DESCRIPTION: Incorrect hasEnded() value. \n      ' +
      'EXPECTED RESULT: true\n      ' +
      'ACTUAL RESULT: ' + hasEnded);

    await psInstTwo.buy({ from: acctFour, value: oneEth }).should.be.rejectedWith(EVMRevert);

    let newBalance = await truTokenTwo.balanceOf.call(acctFour);
    let adjustNewBalance = web3.fromWei(newBalance, 'ether');

    assert.isTrue(adjustNewBalance.equals(psRate),
      '\n      ' +
      'UNIT TESTS - TRUPRESALE - TEST CASE 25: Test #3\n      ' +
      'TEST DESCRIPTION: Incorrect Post-Sale balance for account 4. \n      ' +
      'EXPECTED RESULT: 1250 TRU\n      ' +
      'ACTUAL RESULT: ' + adjustNewBalance.toFormat(18));
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUPRESALE - TEST CASE 26: Pre-Sale owner can finalise the Pre-Sale', async function() {
    await psInst.finalise({ from: acctOne });

    let isComplete = await psInst.isCompleted.call();
    let mintingFinished = await truToken.mintingFinished.call();
    let preSaleFinished = await truToken.preSaleComplete.call();
    let tokenOwner = await truToken.owner.call();
    let tokenBalance = await truToken.balanceOf.call(execAcct);
    tokenSupply = await truToken.totalSupply.call();

    assert.isTrue(isComplete,
      '\n      ' +
      'UNIT TESTS - TRUPRESALE - TEST CASE 26: Test #1\n      ' +
      'TEST DESCRIPTION: Incorrect Post-Sale Completion Status. \n      ' +
      'EXPECTED RESULT: true\n      ' +
      'ACTUAL RESULT: ' + isComplete);

    assert.isFalse(mintingFinished,
      '\n      ' +
      'UNIT TESTS - TRUPRESALE - TEST CASE 26: Test #2\n      ' +
      'TEST DESCRIPTION: Incorrect Post-Sale Minting Finished Status. \n      ' +
      'EXPECTED RESULT: false\n      ' +
      'ACTUAL RESULT: ' + mintingFinished);

    assert.isTrue(preSaleFinished,
      '\n      ' +
      'UNIT TESTS - TRUPRESALE - TEST CASE 26: Test #3\n      ' +
      'TEST DESCRIPTION: Incorrect Post-Sale Presale Complete Status. \n      ' +
      'EXPECTED RESULT: true\n      ' +
      'ACTUAL RESULT: ' + preSaleFinished);

    assert.equal(tokenOwner,
      acctOne,
      '\n      ' +
      'UNIT TESTS - TRUPRESALE - TEST CASE 26: Test #4\n      ' +
      'TEST DESCRIPTION: Incorrect Post-Sale Token Ownership. \n      ' +
      'EXPECTED RESULT: ' + acctOne + '\n      ' +
      'ACTUAL RESULT: ' + tokenOwner);

    assert.isTrue(tokenSupply.equals(totalTokens),
      '\n      ' +
      'UNIT TESTS - TRUPRESALE - TEST CASE 26: Test #5\n      ' +
      'TEST DESCRIPTION: Incorrect Post-Sale Token Supply size. \n      ' +
      'EXPECTED RESULT: 30,000,000 TRU\n      ' +
      'ACTUAL RESULT: ' + web3.fromWei(tokenSupply.toNumber(), 'ether') + ' TRU');

    assert.isTrue(tokenBalance.equals(preSaleTokenCount),
      '\n      ' +
      'UNIT TESTS - TRUPRESALE - TEST CASE 26: Test #6\n      ' +
      'TEST DESCRIPTION: Incorrect Post-Sale Tru Ltd Token Pool size\n      ' +
      'EXPECTED RESULT: 15,000,000 TRU\n      ' +
      'ACTUAL RESULT: ' + web3.fromWei(tokenBalance.toNumber(), 'ether') + ' TRU');

  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUPRESALE - TEST CASE 27: Cannot finalise a finalised Pre-Sale', async function() {
    let isComplete = await psInst.isCompleted.call();

    assert.isTrue(isComplete,
      '\n      ' +
      'UNIT TESTS - TRUPRESALE - TEST CASE 27: Test #1\n      ' +
      'TEST DESCRIPTION: Incorrect Post-Sale Completion Status. \n      ' +
      'EXPECTED RESULT: true\n      ' +
      'ACTUAL RESULT: ' + isComplete);

    await psInst.finalise({ from: acctOne }).should.be.rejectedWith(EVMRevert);

    let isCompleteTwo = await psInst.isCompleted.call();

    assert.equal(isCompleteTwo,
      isComplete,
      '\n      ' +
      'UNIT TESTS - TRUPRESALE - TEST CASE 27: Test #2\n      ' +
      'TEST DESCRIPTION: Incorrect Post-Sale Completion Status. \n      ' +
      'EXPECTED RESULT: ' + isComplete + '\n      ' +
      'ACTUAL RESULT: ' + isCompleteTwo);
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUPRESALE - TEST CASE 28: Minted TruReputationToken cannot be transferred yet', async function() {
    let isReleased = await truToken.released.call();
    assert.isFalse(isReleased,
      '\n      ' +
      'UNIT TESTS - TRUPRESALE - TEST CASE 28: Test #1\n      ' +
      'TEST DESCRIPTION: Incorrect Pre-Sale Release Status. \n      ' +
      'EXPECTED RESULT: false\n      ' +
      'ACTUAL RESULT: ' + isReleased);

    let acctThreeBal = await truToken.balanceOf.call(acctThree);
    let acctFiveBal = await truToken.balanceOf.call(acctFive);

    await truToken.transfer(acctFive, truAmt, { from: acctThree }).should.be.rejectedWith(EVMRevert);

    let acctThreeBalTwo = await truToken.balanceOf.call(acctThree);
    let acctFiveBalTwo = await truToken.balanceOf.call(acctFive);

    assert.equal(acctThreeBalTwo.toNumber(),
      acctThreeBal.toNumber(),
      '\n      ' +
      'UNIT TESTS - TRUPRESALE - TEST CASE 28: Test #2\n      ' +
      'TEST DESCRIPTION: Balance of Account 3 not as expected. \n      ' +
      'EXPECTED RESULT: ' + acctThreeBal.toNumber() + ' TRU\n      ' +
      'ACTUAL RESULT: ' + acctThreeBalTwo.toNumber() + ' TRU');

    assert.equal(acctFiveBalTwo.toNumber(),
      acctFiveBal.toNumber(),
      '\n      ' +
      'UNIT TESTS - TRUPRESALE - TEST CASE 28: Test #3\n      ' +
      'TEST DESCRIPTION: Balance of Account 5 not as expected. \n      ' +
      'EXPECTED RESULT: ' + acctFiveBal.toNumber() + ' TRU\n      ' +
      'ACTUAL RESULT: ' + acctFiveBalTwo.toNumber() + ' TRU');
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUPRESALE - TEST CASE 29: Can change Pre-Sale end time to further into the future', async function(){
    currentTime = web3.eth.getBlock('latest').timestamp;
    let startTime = currentTime + oneDayTS;
    let endTimeOne = startTime + oneMonthTS;
    // Setup up Pre-Sale and Token Instance
    let tempToken = await TruReputationToken.new({ from: acctOne });
    let tempPsInst = await TruPreSale.new(startTime, endTimeOne, tempToken.address, execAcct, { from: acctOne });
    let psEndTime = await tempPsInst.saleEndTime.call();

    // Check the End Time of the Pre-Sale is correct
    assert.isTrue(psEndTime.equals(endTimeOne),
      '\n      ' +
      'UNIT TESTS - TRUPRESALE - TEST CASE 29: Test #1\n      ' +
      'TEST DESCRIPTION: Incorrect initial Pre-Sale End Time. \n      ' +
      'EXPECTED RESULT: ' + endTimeOne + '\n      ' +
      'ACTUAL RESULT: ' + psEndTime.toFormat(0));


    let endTimeTwo = endTimeOne + oneDayTS;
    let etWatch = tempPsInst.EndChanged();
    await tempPsInst.changeEndTime(endTimeTwo);
    let watchResult = etWatch.get();
    let newPsEndTime = await tempPsInst.saleEndTime.call();
    
    // Check the End Time of the Pre-Sale has updated
    assert.isTrue(newPsEndTime.equals(endTimeTwo),
      '\n      ' +
      'UNIT TESTS - TRUPRESALE - TEST CASE 29: Test #2\n      ' +
      'TEST DESCRIPTION: Incorrect new Pre-Sale End Time. \n      ' +
      'EXPECTED RESULT: ' + endTimeTwo + '\n      ' +
      'ACTUAL RESULT: ' + newPsEndTime.toFormat(0));
    
    assert.equal(watchResult.length,
      1,
      '\n      ' +
      'UNIT TESTS - TRUPRESALE - TEST CASE 29: Test #3\n      ' +
      'TEST DESCRIPTION: Incorrect EndChanged Event length for TruPreSale\n      ' +
      'EXPECTED RESULT: 1\n      ' +
      'ACTUAL RESULT: ' + watchResult.length);

    assert.isTrue(watchResult[0].args._newEnd.equals(endTimeTwo),
      '\n      ' +
      'UNIT TESTS - TRUPRESALE - TEST CASE 29: Test #4\n      ' +
      'TEST DESCRIPTION: Incorrect End Time argument on EndChanged Event. \n      ' +
      'EXPECTED RESULT: ' + endTimeTwo + '\n      ' +
      'ACTUAL RESULT: ' + watchResult[0].args._newEnd.toFormat(0));
    
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUPRESALE - TEST CASE 30: Cannot change Pre-Sale end time to less than start time', async function(){
    currentTime = web3.eth.getBlock('latest').timestamp
    let startTime = currentTime + oneDayTS;
    let endTimeOne = startTime + oneMonthTS;
    // Setup up Pre-Sale and Token Instance
    let tempToken = await TruReputationToken.new({ from: acctOne });
    let tempPsInst = await TruPreSale.new(startTime, endTimeOne, tempToken.address, execAcct, { from: acctOne });
    let tempPsAddr = tempPsInst.address;
    let psEndTime = await tempPsInst.saleEndTime.call();

    // Check the End Time of the Pre-Sale is correct
    assert.isTrue(psEndTime.equals(endTimeOne),
      '\n      ' +
      'UNIT TESTS - TRUPRESALE - TEST CASE 30: Test #1\n      ' +
      'TEST DESCRIPTION: Incorrect initial Pre-Sale End Time. \n      ' +
      'EXPECTED RESULT: ' + endTimeOne + '\n      ' +
      'ACTUAL RESULT: ' + psEndTime.toFormat(0));


    let endTimeTwo = startTime - oneDayTS;
    let etWatch = tempPsInst.EndChanged();
    await tempPsInst.changeEndTime(endTimeTwo).should.be.rejectedWith(EVMRevert);
    let watchResult = etWatch.get();
    let newPsEndTime = await tempPsInst.saleEndTime.call();
    // Check the End Time of the Pre-Sale has updated
    assert.isTrue(newPsEndTime.equals(endTimeOne),
      '\n      ' +
      'UNIT TESTS - TRUPRESALE - TEST CASE 30: Test #2\n      ' +
      'TEST DESCRIPTION: Incorrect Pre-Sale End Time. \n      ' +
      'EXPECTED RESULT: ' + endTimeTwo + '\n      ' +
      'ACTUAL RESULT: ' + newPsEndTime.toFormat(0));
    
    assert.equal(watchResult.length,
      0,
      '\n      ' +
      'UNIT TESTS - TRUPRESALE - TEST CASE 30: Test #3\n      ' +
      'TEST DESCRIPTION: Incorrect EndChanged Event length for TruPreSale\n      ' +
      'EXPECTED RESULT: 0\n      ' +
      'ACTUAL RESULT: ' + watchResult.length);

  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUPRESALE - TEST CASE 31: Can change Pre-Sale end time to less than current end time', async function(){
    currentTime = web3.eth.getBlock('latest').timestamp
    let startTime = currentTime + oneDayTS;
    let endTimeOne = startTime + oneMonthTS;
    // Setup up Pre-Sale and Token Instance
    let tempToken = await TruReputationToken.new({ from: acctOne });
    let tempPsInst = await TruPreSale.new(startTime, endTimeOne, tempToken.address, execAcct, { from: acctOne });
    let tempPsAddr = tempPsInst.address;
    let psEndTime = await tempPsInst.saleEndTime.call();

    // Check the End Time of the Pre-Sale is correct
    assert.isTrue(psEndTime.equals(endTimeOne),
      '\n      ' +
      'UNIT TESTS - TRUPRESALE - TEST CASE 31: Test #1\n      ' +
      'TEST DESCRIPTION: Incorrect initial Pre-Sale End Time. \n      ' +
      'EXPECTED RESULT: ' + endTimeOne + '\n      ' +
      'ACTUAL RESULT: ' + psEndTime.toFormat(0));

    let endTimeTwo = endTimeOne - oneDayTS;
    let etWatch = tempPsInst.EndChanged();
    await tempPsInst.changeEndTime(endTimeTwo)
    let watchResult = etWatch.get();
    let newPsEndTime = await tempPsInst.saleEndTime.call();

    // Check the End Time of the Pre-Sale has updated
    assert.isTrue(newPsEndTime.equals(endTimeTwo),
      '\n      ' +
      'UNIT TESTS - TRUPRESALE - TEST CASE 31: Test #2\n      ' +
      'TEST DESCRIPTION: Incorrect new Pre-Sale End Time. \n      ' +
      'EXPECTED RESULT: ' + endTimeTwo + '\n      ' +
      'ACTUAL RESULT: ' + newPsEndTime.toFormat(0));

    assert.isTrue((newPsEndTime < psEndTime),
      '\n      ' +
      'UNIT TESTS - TRUPRESALE - TEST CASE 31: Test #3\n      ' +
      'TEST DESCRIPTION: New Pre-Sale End Time is not earlier than initial End Time. \n      ' +
      'EXPECTED RESULT: true\n      ' +
      'ACTUAL RESULT: false');
    
    assert.equal(watchResult.length,
      1,
      '\n      ' +
      'UNIT TESTS - TRUPRESALE - TEST CASE 31: Test #4\n      ' +
      'TEST DESCRIPTION: Incorrect EndChanged Event length for TruPreSale\n      ' +
      'EXPECTED RESULT: 1\n      ' +
      'ACTUAL RESULT: ' + watchResult.length);

    assert.isTrue(watchResult[0].args._newEnd.equals(endTimeTwo),
      '\n      ' +
      'UNIT TESTS - TRUPRESALE - TEST CASE 31: Test #5\n      ' +
      'TEST DESCRIPTION: Incorrect End Time argument on EndChanged Event. \n      ' +
      'EXPECTED RESULT: ' + endTimeTwo + '\n      ' +
      'ACTUAL RESULT: ' + watchResult[0].args._newEnd.toFormat(0));
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUPRESALE - TEST CASE 32: Can change Pre-Sale end time to less than current time & end sale', async function(){
    currentTime = web3.eth.getBlock('latest').timestamp
    let startTime = currentTime + oneDayTS;
    let endTimeOne = startTime + oneMonthTS;
    // Setup up Pre-Sale and Token Instance
    let tempToken = await TruReputationToken.new({ from: acctOne });
    let tempPsInst = await TruPreSale.new(startTime, endTimeOne, tempToken.address, execAcct, { from: acctOne });
    let tempPsAddr = tempPsInst.address;
    let psEndTime = await tempPsInst.saleEndTime.call();

    // Check the End Time of the Pre-Sale is correct
    assert.isTrue(psEndTime.equals(endTimeOne),
      '\n      ' +
      'UNIT TESTS - TRUPRESALE - TEST CASE 32: Test #1\n      ' +
      'TEST DESCRIPTION: Incorrect initial Pre-Sale End Time. \n      ' +
      'EXPECTED RESULT: ' + endTimeOne + '\n      ' +
      'ACTUAL RESULT: ' + psEndTime.toFormat(0));

    let endTimeTwo = startTime + oneDayTS;
    let duringSale = endTimeTwo + (oneDayTS + oneDayTS);
    
    await increaseTimeTo(duringSale);
    let etWatch = tempPsInst.EndChanged();
    await tempPsInst.changeEndTime(endTimeTwo);
    let watchResult = etWatch.get();
    let newPsEndTime = await tempPsInst.saleEndTime.call();
    let psEndStatus = await tempPsInst.hasEnded.call();
    
    assert.isTrue(newPsEndTime.equals(endTimeTwo),
      '\n      ' +
      'UNIT TESTS - TRUPRESALE - TEST CASE 32: Test #2\n      ' +
      'TEST DESCRIPTION: Incorrect new Pre-Sale End Time. \n      ' +
      'EXPECTED RESULT: ' + endTimeTwo + '\n      ' +
      'ACTUAL RESULT: ' + newPsEndTime.toFormat(0));

     assert.equal(watchResult.length,
      1,
      '\n      ' +
      'UNIT TESTS - TRUPRESALE - TEST CASE 32: Test #3\n      ' +
      'TEST DESCRIPTION: Incorrect EndChanged Event length for TruPreSale\n      ' +
      'EXPECTED RESULT: 1\n      ' +
      'ACTUAL RESULT: ' + watchResult.length);

    assert.isTrue(watchResult[0].args._newEnd.equals(endTimeTwo),
      '\n      ' +
      'UNIT TESTS - TRUPRESALE - TEST CASE 32: Test #4\n      ' +
      'TEST DESCRIPTION: Incorrect End Time argument on EndChanged Event. \n      ' +
      'EXPECTED RESULT: ' + endTimeTwo + '\n      ' +
      'ACTUAL RESULT: ' + watchResult[0].args._newEnd.toFormat(0));

    assert.isTrue(psEndStatus,
    '\n      ' +
    'UNIT TESTS - TRUPRESALE - TEST CASE 32: Test #5\n      ' +
    'TEST DESCRIPTION: Incorrect Pre-Sale hasEnded Status for TruPreSale\n      ' +
    'EXPECTED RESULT: true\n' +
    'ACTUAL RESULT: ' + psEndStatus);
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUPRESALE - TEST CASE 33: Only Pre-Sale Owner can change Pre-Sale end time', async function(){
    currentTime = web3.eth.getBlock('latest').timestamp
    let startTime = currentTime + oneDayTS;
    let endTimeOne = startTime + oneMonthTS;
    // Setup up Pre-Sale and Token Instance
    let tempToken = await TruReputationToken.new({ from: acctOne });
    let tempPsInst = await TruPreSale.new(startTime, endTimeOne, tempToken.address, execAcct, { from: acctOne });
    let tempPsAddr = tempPsInst.address;
    let psEndTime = await tempPsInst.saleEndTime.call();

    // Check the End Time of the Pre-Sale is correct
    assert.isTrue(psEndTime.equals(endTimeOne),
      '\n      ' +
      'UNIT TESTS - TRUPRESALE - TEST CASE 33: Test #1\n      ' +
      'TEST DESCRIPTION: Incorrect initial Pre-Sale End Time. \n      ' +
      'EXPECTED RESULT: ' + endTimeOne + '\n      ' +
      'ACTUAL RESULT: ' + psEndTime.toFormat(0));

    let endTimeTwo = endTimeOne + oneDayTS;    

    let etWatch = tempPsInst.EndChanged();
    await tempPsInst.changeEndTime(endTimeTwo, {from: acctTwo}).should.be.rejectedWith(EVMRevert);
    let watchResult = etWatch.get();
    let newPsEndTime = await tempPsInst.saleEndTime.call();

     assert.isTrue(newPsEndTime.equals(endTimeOne),
      '\n      ' +
      'UNIT TESTS - TRUPRESALE - TEST CASE 33: Test #2\n      ' +
      'TEST DESCRIPTION: Incorrect new Pre-Sale End Time. \n      ' +
      'EXPECTED RESULT: ' + endTimeTwo + '\n      ' +
      'ACTUAL RESULT: ' + newPsEndTime.toFormat(0));
    
    assert.equal(watchResult.length,
      0,
      '\n      ' +
      'UNIT TESTS - TRUPRESALE - TEST CASE 33: Test #3\n      ' +
      'TEST DESCRIPTION: Incorrect EndChanged Event length for TruPreSale\n      ' +
      'EXPECTED RESULT: 1\n      ' +
      'ACTUAL RESULT: ' + watchResult.length);

  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUPRESALE - TEST CASE 34: Cannot create Pre-Sale with end time before start time', async function(){
    currentTime = web3.eth.getBlock('latest').timestamp
    let startTime = currentTime + oneMonthTS;
    let endTime = currentTime + oneDayTS;

    let tempToken = await TruReputationToken.new({from: acctOne});
    let tempTokenAddr = tempToken.address;
    await TruPreSale.new(startTime, endTime, tempTokenAddr, execAcct).should.be.rejectedWith(EVMRevert);
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUPRESALE - TEST CASE 35: Cannot create Pre-Sale with invalid Token Address', async function(){
    let invalidTokenAddr = "0x0000000000000000000000000000000000000000";
    currentTime = web3.eth.getBlock('latest').timestamp
    let startTime = currentTime + oneDayTS;
    let endTime = startTime + oneMonthTS;

    await TruPreSale.new(startTime, endTime, invalidTokenAddr, execAcct).should.be.rejectedWith(EVMRevert);
    await TruPreSale.new(startTime, endTime, 0x000000000000000000000000000000000000000, execAcct).should.be.rejectedWith(EVMRevert);
    await TruPreSale.new(startTime, endTime, 0x0, execAcct).should.be.rejectedWith(EVMRevert);

  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUPRESALE - TEST CASE 36: Cannot create Pre-Sale with invalid Sale Wallet Address', async function(){
    let invalidWalletAddr = "0x0000000000000000000000000000000000000000";
    currentTime = web3.eth.getBlock('latest').timestamp
    let startTime = currentTime + oneDayTS;
    let endTime = startTime + oneMonthTS;

    let tempToken = await TruReputationToken.new({from: acctOne});
    let tempTokenAddr = tempToken.address;

    await TruPreSale.new(startTime, endTime, tempTokenAddr, invalidWalletAddr).should.be.rejectedWith(EVMRevert);
    await TruPreSale.new(startTime, endTime, tempTokenAddr, 0x000000000000000000000000000000000000000).should.be.rejectedWith(EVMRevert);
    await TruPreSale.new(startTime, endTime, tempTokenAddr, 0x0).should.be.rejectedWith(EVMRevert);
  }).timeout(timeoutDuration);
});