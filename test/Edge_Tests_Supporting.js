/**
 * @file        The following Tests are written to cover edge cases and Supporting Smart Contracts and
 * Libraries used within the TruReputationToken project to achieve as much automated test coverage as possible.
 * Documentation for these tests are maintained outside of these files for sake of clarity and can be found at
 * {@link https://trultd.readthedocs.org}
 * 
 * @author      Ian Bray, Tru Ltd
 * @copyright   2017 Tru Ltd
 */

'use strict';
const BigNumber = web3.BigNumber;
const MockSupportToken = artifacts.require('./MockSupportToken.sol');
const MockSale = artifacts.require('./MockSale.sol');
const MockFailUpgradeAgent = artifacts.require('./MockFailUpgradeAgent.sol');
const MockUpgradeableToken = artifacts.require('./MockUpgradeableToken.sol');
const TruReputationToken = artifacts.require('./TruReputationToken.sol');
const MockFailUpgradeableToken = artifacts.require('./MockFailUpgradeableToken.sol');
import { increaseTime, increaseTimeTo, duration } from './helpers/increaseTime';
import isEven from './helpers/isEven';
import EVMRevert from './helpers/EVMRevert';
import expectThrow from './helpers/expectThrow';

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

contract('MockSupportToken', function(accounts) {

  let mockToken;
  let acctOne = accounts[0];
  let acctTwo = accounts[1];
  let execAcct = accounts[9];
  
  it('EDGE TESTS - TEST CASE 01: Should test all SafeMath functions', async function() {
    mockToken = await MockSupportToken.new();
    let number = await mockToken.testMath.call();
    assert.equal(number,
      1,
      '\n      ' +
      'EDGE TESTS - MOCKSUPPORTTOKEN - TEST CASE 01: Test #1\n      ' +
      'TEST DESCRIPTION: Number not equal to one\n      ' +
      'EXPECTED RESULT: 1\n      ' +
      'ACTUAL RESULT: ' + number);
  }).timeout(timeoutDuration);

  it('EDGE TESTS - TEST CASE 02: Should test transferFrom edge case', async function() {
    await mockToken.testTransfer(acctTwo).should.be.rejectedWith(EVMRevert);
  }).timeout(timeoutDuration);

});

contract('MockSale', function(accounts) {
  let truToken, mockSale;
  let acctOne = accounts[0];
  let execAcct = accounts[1];

  it('EDGE TESTS - TEST CASE 03: Should test all edge cases for TruSale', async function() {
    truToken = await TruReputationToken.new({ from: acctOne });
    await truToken.changeBoardAddress(execAcct, { from: acctOne });
    let currentTime = web3.eth.getBlock('latest').timestamp;
    let saleStart = currentTime + 6000000;
    let saleEnd = saleStart + 6000000;
    let duringSale = saleStart + 3600;

    mockSale = await MockSale.new(saleStart, saleEnd, truToken.address, execAcct, { from: acctOne });
    await truToken.setReleaseAgent(mockSale.address, { from: acctOne });
    await truToken.transferOwnership(mockSale.address, { from: acctOne });

    await mockSale.mockWhiteList().should.be.rejectedWith(EVMRevert);
    await increaseTimeTo(duringSale);
    await mockSale.mockBuy().should.be.rejectedWith(EVMRevert);
  }).timeout(timeoutDuration);
});

contract('MockUpgradeableToken', function(accounts) {
  let mockToken;
  let mAgent;
  let acctOne = accounts[0];
  let execAcct = accounts[1];

  it('EDGE TESTS - TEST CASE 04: Should fail to set Migration Agent with', async function() {
    mockToken = await MockUpgradeableToken.new(acctOne, { from: acctOne });
    await mockToken.changeCanUpgrade(true, { from: acctOne });

    let mockTokenName = await mockToken.name.call();
    let mockTokenSymbol = await mockToken.symbol.call();
    let mockTokenDecimals = await mockToken.decimals.call();
    let mockTokenSupply = await mockToken.totalSupply.call();
    let canUpgrade = await mockToken.canUpgrade.call();
    let upgradeMaster = await mockToken.upgradeMaster.call();
    let upgradeState = await mockToken.getUpgradeState.call();

    // Verify Mock Token initialized ok
    assert.equal(mockTokenName,
      'Mock Upgradeable Token',
      '\n      ' +
      'EDGE TESTS - MOCKUPGRADEABLETOKEN - TEST CASE 01: Test #1\n      ' +
      'TEST DESCRIPTION: Incorrect token name\n      ' +
      'EXPECTED RESULT: Mock Upgradeable Token\n      ' +
      'ACTUAL RESULT: ' + mockTokenName);
    assert.equal(mockTokenSymbol,
      'MUT',
      '\n      ' +
      'EDGE TESTS - MOCKUPGRADEABLETOKEN - TEST CASE 01: Test #2\n      ' +
      'TEST DESCRIPTION: Incorrect token symbol\n      ' +
      'EXPECTED RESULT: MUT\n      ' +
      'ACTUAL RESULT: ' + mockTokenSymbol);
    assert.equal(mockTokenDecimals,
      18,
      '\n      ' +
      'EDGE TESTS - MOCKUPGRADEABLETOKEN - TEST CASE 01: Test #3\n      ' +
      'TEST DESCRIPTION: Incorrect number of decimals for token\n      ' +
      'EXPECTED RESULT: 18\n      ' +
      'ACTUAL RESULT: ' + mockTokenDecimals);
    assert.equal(mockTokenSupply,
      100,
      '\n      ' +
      'EDGE TESTS - MOCKUPGRADEABLETOKEN - TEST CASE 01: Test #4\n      ' +
      'TEST DESCRIPTION: Incorrect totalSupply\n      ' +
      'EXPECTED RESULT: 100\n      ' +
      'ACTUAL RESULT: ' + mockTokenSupply);
    assert.isTrue(canUpgrade,
      '\n      ' +
      'EDGE TESTS - MOCKUPGRADEABLETOKEN - TEST CASE 01: Test #5\n      ' +
      'TEST DESCRIPTION: Incorrect canUpgrade state\n      ' +
      'EXPECTED RESULT: true\n      ' +
      'ACTUAL RESULT: ' + canUpgrade);
    assert.equal(upgradeMaster,
      acctOne,
      '\n      ' +
      'EDGE TESTS - MOCKUPGRADEABLETOKEN - TEST CASE 01: Test #5\n      ' +
      'TEST DESCRIPTION: Incorrect Upgrade Master\n      ' +
      'EXPECTED RESULT: ' + acctOne + '\n      ' +
      'ACTUAL RESULT: ' + upgradeMaster);
    assert.equal(upgradeState.toString(),
      '2',
      '\n      ' +
      'EDGE TESTS - MOCKUPGRADEABLETOKEN - TEST CASE 01: Test #6\n      ' +
      'TEST DESCRIPTION: Incorrect Upgrade State\n      ' +
      'EXPECTED RESULT: 2\n      ' +
      'ACTUAL RESULT: ' + upgradeState.toString());

    mAgent = await MockFailUpgradeAgent.new(mockToken.address, { from: acctOne });
    let isUAgent = await mAgent.isUpgradeAgent.call();
    assert.isTrue(isUAgent,
      '\n      ' +
      'EDGE TESTS - MOCKUPGRADEABLETOKEN - TEST CASE 01: Test #7\n      ' +
      'TEST DESCRIPTION: MockFailUpgradeAgent not Upgrade Agent\n      ' +
      'EXPECTED RESULT: true\n      ' +
      'ACTUAL RESULT: ' + isUAgent);

    await mAgent.changeSupply.call();

    await mockToken.setUpgradeAgent(mAgent.address, { from: acctOne }).should.be.rejectedWith(EVMRevert);
  }).timeout(timeoutDuration);
});

contract('MockFailUpgradeableToken', function(accounts){

  it('EDGE TESTS - TEST CASE 05: Should fail with invalid upgradeMaster Address in constructor', async function(){

    await MockFailUpgradeableToken.new().should.be.rejectedWith(EVMRevert);
    
  })
})