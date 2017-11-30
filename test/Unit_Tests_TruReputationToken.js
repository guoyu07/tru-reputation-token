/**
 * @file        The following Tests are written for unit testing the TruReputationToken Smart Contract
 * and to provide as much automated test coverage as possible, including as full as branch coverage as
 * possible. Documentation for these tests are maintained outside of these files for sake of clarity 
 * and can be found at {@link https://trultd.readthedocs.org}
 * 
 * @author      Ian Bray, Tru Ltd
 * @copyright   2017 Tru Ltd
 */


'use strict';
import EVMThrow from './helpers/EVMThrow';
import EVMRevert from './helpers/EVMRevert';
import expectThrow from './helpers/expectThrow';
const TruReputationToken = artifacts.require('./TruReputationToken.sol');
const MockMigrationTarget = artifacts.require('./MockMigrationTarget.sol');
const MockUpgradeableToken = artifacts.require('./MockUpgradeableToken.sol');
const MockUpgradeAgent = artifacts.require('./MockUpgradeAgent.sol');
const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(web3.BigNumber))
  .should();

let timeoutDuration = 0;

contract('TruReputationToken', function(accounts) {
  let truToken;
  let tokenMigration;
  let mintAmount = web3.toWei(100, 'ether');
  let acctOne = accounts[0];
  let acctTwo = accounts[1];
  let execAcct = accounts[2];
  let execAcctTwo = accounts[3];
  let upgradeAmount;
  let diffBalance;
  let currentSupply;

  it('UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 01: TruReputationToken should have correct name, symbol and description', async function() {

    truToken = await TruReputationToken.new({from: acctOne });
    let name = await truToken.name.call();
    let symbol = await truToken.symbol.call();
    let decimals = await truToken.decimals.call();
    let execBoard = await truToken.execBoard.call();

    assert.equal(name,
      'Tru Reputation Token',
      '\n      ' +
      'UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 01: Test #1\n      ' +
      'TEST DESCRIPTION: Incorrect name set for TruReputationToken\n      ' +
      'EXPECTED RESULT: Tru Reputation Token\n      ' +
      'ACTUAL RESULT: ' + name);
    assert.equal(symbol,
      'TRU',
      '\n      ' +
      'UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 01: Test #2\n      ' +
      'TEST DESCRIPTION: Incorrect symbol set for TruReputationToken\n      ' +
      'EXPECTED RESULT: TRU\n      ' +
      'ACTUAL RESULT: ' + symbol);
    assert.equal(decimals,
      18,
      '\n      ' +
      'UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 01: Test #3\n      ' +
      'TEST DESCRIPTION: Incorrect number of decimal places set for TruReputationToken\n      ' +
      'EXPECTED RESULT: 18\n      ' +
      'ACTUAL RESULT: ' + decimals);
    assert.equal(execBoard,
      acctOne,
      '\n      ' +
      'UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 01: Test #4\n      ' +
      'TEST DESCRIPTION: Incorrect Exec Board account for TruReputationToken\n      ' +
      'EXPECTED RESULT:' + acctOne + '\n      ' +
      'ACTUAL RESULT: ' + execBoard);
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 02: Owner should be able to assign Executive Board Address once', async function() {

    await truToken.changeBoardAddress(execAcct, { from: acctOne });
    let execBoard = await truToken.execBoard.call();

    assert.equal(execBoard,
      execAcct,
      '\n      ' +
      'UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 02: Test #1\n      ' +
      'TEST DESCRIPTION: Incorrect Exec Board account for TruReputationToken\n      ' +
      'EXPECTED RESULT: ' + execAcct + '\n      ' +
      'ACTUAL RESULT: ' + execBoard);
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 03: No other account should be able to change Executive Board Address', async function() {

    await truToken.changeBoardAddress(acctTwo, { from: acctOne }).should.be.rejectedWith(EVMRevert);
    let execBoard = await truToken.execBoard.call();

    assert.equal(execBoard,
      execAcct,
      '\n      ' +
      'UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 03: Test #1\n      ' +
      'TEST DESCRIPTION: Incorrect ExecBoard account for TruReputationToken\n      ' +
      'EXPECTED RESULT:' + execAcct + '\n      ' +
      'ACTUAL RESULT: ' + execBoard);
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 04: Should be unable to assign an empty address as Exec Board', async function() {

    await truToken.changeBoardAddress(0x0, { from: execAcct }).should.be.rejectedWith(EVMRevert);
    let execBoard = await truToken.execBoard.call();

    assert.equal(execBoard,
      execAcct,
      '\n      ' +
      'UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 04: Test #1\n      ' +
      'TEST DESCRIPTION: Incorrect ExecBoard account for TruReputationToken\n      ' +
      'EXPECTED RESULT:' + execAcct + '\n      ' +
      'ACTUAL RESULT: ' + execBoard);
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 05: Should be unable to assign an self as Exec Board', async function() {

    await truToken.changeBoardAddress(execAcct, { from: execAcct }).should.be.rejectedWith(EVMRevert);
    let execBoard = await truToken.execBoard.call();

    assert.equal(execBoard,
      execAcct,
      '\n      ' +
      'UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 05: Test #1\n      ' +
      'TEST DESCRIPTION: Incorrect ExecBoard account for TruReputationToken\n      ' +
      'EXPECTED RESULT:' + execAcct + '\n      ' +
      'ACTUAL RESULT: ' + execBoard);
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 06: Exec Board should be able to assign different Exec Board Account', async function() {

    await truToken.changeBoardAddress(execAcctTwo, { from: execAcct });
    let execBoard = await truToken.execBoard.call();

    assert.equal(execBoard,
      execAcctTwo,
      '\n      ' +
      'UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 06: Test #1\n      ' +
      'TEST DESCRIPTION: Incorrect Exec Board account for TruReputationToken\n      ' +
      'EXPECTED RESULT: ' + execAcctTwo + '\n      ' +
      'ACTUAL RESULT: ' + execBoard);
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 07: TruReputationToken should have 0 total supply', async function() {
    let totalSupply = await truToken.totalSupply();

    assert.equal(totalSupply,
      0,
      '\n      ' +
      'UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 07: Test #1\n      ' +
      'TEST DESCRIPTION: Incorrect totalSupply\n      ' +
      'EXPECTED RESULT: 0\n      ' +
      'ACTUAL RESULT: ' + totalSupply);
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 08: Only TruReputationToken owner can set the Release Agent', async function() {

    await truToken.setReleaseAgent(execAcctTwo, { from: execAcctTwo }).should.be.rejectedWith(EVMRevert);

    let agent = await truToken.releaseAgent.call();

    assert.equal(agent,
      0x0,
      '\n      ' +
      'UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 08: Test #1\n      ' +
      'TEST DESCRIPTION: Incorrect Release agent set for TruReputationToken\n      ' +
      'EXPECTED RESULT: 0x0\n      ' +
      'ACTUAL RESULT: ' + agent);
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 09: Only TruReputationToken Owner can set transferAgent', async function() {
    await truToken.setTransferAgent(execAcct, true, { from: acctOne })

    let transferAgent = await truToken.transferAgents(execAcct);

    assert.isTrue(transferAgent,
      '\n      ' +
      'UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 09: Test #1\n      ' +
      'TEST DESCRIPTION: Incorrect Transfer Agent Set\n      ' +
      'EXPECTED RESULT: true\n      ' +
      'ACTUAL RESULT: ' + transferAgent);

    await truToken.setTransferAgent(execAcctTwo, true, { from: acctTwo }).should.be.rejectedWith(EVMRevert);

    let notAgent = await truToken.transferAgents(execAcctTwo);

    assert.isFalse(notAgent,
      '\n      ' +
      'UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 09: Test #2\n      ' +
      'TEST DESCRIPTION: Incorrect Transfer Agent Set\n      ' +
      'EXPECTED RESULT: false\n      ' +
      'ACTUAL RESULT: ' + notAgent);
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 10: mintingFinished should be false after construction', async function() {
    let mintingFinished = await truToken.mintingFinished();

    assert.isFalse(mintingFinished,
      '\n      ' +
      'UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 10: Test #1\n      ' +
      'TEST DESCRIPTION: mintingFinished has incorrect value after construction\n      ' +
      'EXPECTED RESULT: false\n      ' +
      'ACTUAL RESULT: ' + mintingFinished);
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 11: Should fail to deploy new Upgrade Token with no tokens', async function() {
    await MockMigrationTarget.new(truToken.address).should.be.rejectedWith(EVMRevert);
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 12: Should mint a token with 10^18 decimal places', async function() {
    let mintAmt = new BigNumber(web3.toWei(1, 'ether'));
    // Mint 1 TRU
    let result = await truToken.mint(acctOne, mintAmt);
    let supply = await truToken.totalSupply.call();
    let balance = await truToken.balanceOf.call(acctOne);

    assert.equal(result.logs[0].event,
      'Minted',
      '\n      ' +
      'UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 12: Test #1\n      ' +
      'TEST DESCRIPTION: Incorrect Event\n      ' +
      'EXPECTED RESULT: Mint\n      ' +
      'ACTUAL RESULT: ' + result.logs[0].event);

    assert.equal(result.logs[0].args._to.valueOf(),
      acctOne,
      '\n      ' +
      'UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 12: Test #2\n      ' +
      'TEST DESCRIPTION: Incorrect address to send new Tokens to\n      ' +
      'EXPECTED RESULT: ' + acctOne + '\n      ' +
      'ACTUAL RESULT: ' + result.logs[0].args._to.valueOf());

    assert.equal(result.logs[0].args._amount.valueOf(),
      mintAmt,
      '\n      ' +
      'UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 12: Test #3\n      ' +
      'TEST DESCRIPTION: Incorrect amount of new Tokens to mint\n      ' +
      'EXPECTED RESULT: ' + mintAmt + '\n      ' +
      'ACTUAL RESULT: ' + result.logs[0].args._amount.valueOf());

    assert.equal(result.logs[1].event,
      'Transfer',
      '\n      ' +
      'UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 12: Test #4\n      ' +
      'TEST DESCRIPTION: Incorrect Event\n      ' +
      'EXPECTED RESULT: Mint; \n      ' +
      'ACTUAL RESULT: ' + result.logs[1].event);

    assert.equal(result.logs[1].args.from.valueOf(),
      0x0,
      '\n      ' +
      'UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 12: Test #5\n      ' +
      'TEST DESCRIPTION: Incorrect address for sending tokens\n      ' +
      'EXPECTED RESULT: ' + 0x0 + '\n      ' +
      'ACTUAL RESULT: ' + result.logs[1].args.from.valueOf());

    assert.isTrue(mintAmt.equals(balance),
      '\n      ' +
      'UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 12: Test #6\n      ' +
      'TEST DESCRIPTION: Balance of accounts[0] does not match minted amount\n      ' +
      'EXPECTED RESULT: ' + mintAmt + '\n      ' +
      'ACTUAL RESULT: ' + balance);

    assert.isTrue(supply.equals(mintAmt),
      '\n      ' +
      'UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 12: Test #7\n      ' +
      'TEST DESCRIPTION: Total supply does not match minted amount\n      ' +
      'EXPECTED RESULT: ' + mintAmt + '\n      ' +
      'ACTUAL RESULT: ' + supply);
    currentSupply = supply;
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 13: Should mint 100 tokens to a supplied address', async function() {
    currentSupply = currentSupply.add(mintAmount);
    let result = await truToken.mint(acctOne, mintAmount);
    let balance = await truToken.balanceOf.call(acctOne);
    let supply = await truToken.totalSupply();

    assert.equal(result.logs[0].event,
      'Minted',
      '\n      ' +
      'UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 13: Test #1\n      ' +
      'TEST DESCRIPTION: Incorrect Event\n      ' +
      'EXPECTED RESULT: Mint\n      ' +
      'ACTUAL RESULT: ' + result.logs[0].event);

    assert.equal(result.logs[0].args._to.valueOf(),
      acctOne,
      '\n      ' +
      'UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 13: Test #2\n      ' +
      'TEST DESCRIPTION: Incorrect address to send new Tokens to\n      ' +
      'EXPECTED RESULT: ' + acctOne + '\n      ' +
      'ACTUAL RESULT: ' + result.logs[0].args._to.valueOf());

    assert.equal(result.logs[0].args._amount.valueOf(),
      mintAmount,
      '\n      ' +
      'UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 13: Test #3\n      ' +
      'TEST DESCRIPTION: Incorrect amount of new Tokens to mint\n      ' +
      'EXPECTED RESULT: ' + mintAmount + '\n      ' +
      'ACTUAL RESULT: ' + result.logs[0].args._amount.valueOf());

    assert.equal(result.logs[1].event,
      'Transfer',
      'UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 13: Test #4\n      ' +
      'TEST DESCRIPTION: Incorrect Event\n      ' +
      'EXPECTED RESULT: Mint\n      ' +
      'ACTUAL RESULT: ' + result.logs[1].event);

    assert.equal(result.logs[1].args.from.valueOf(),
      0x0,
      '\n      ' +
      'UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 13: Test #5\n      ' +
      'TEST DESCRIPTION: Incorrect address for sending tokens\n      ' +
      'EXPECTED RESULT: ' + 0x0 + '\n      ' +
      'ACTUAL RESULT: ' + result.logs[1].args.from.valueOf());

    assert.isTrue(balance.equals(currentSupply),
      '\n      ' +
      'UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 13: Test #6\n      ' +
      'TEST DESCRIPTION: Balance of accounts[0] does not match minted amount\n      ' +
      'EXPECTED RESULT: ' + currentSupply + '\n      ' +
      'ACTUAL RESULT: ' + balance);

    assert.isTrue(supply.equals(currentSupply),
      '\n      ' +
      'UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 13: Test #7\n      ' +
      'TEST DESCRIPTION: Total supply does not match minted amount\n      ' +
      'EXPECTED RESULT: ' + currentSupply + '\n      ' +
      'ACTUAL RESULT: ' + supply);

    await truToken.mint(acctOne, 0, { from: acctOne }).should.be.rejectedWith(EVMRevert);
    await truToken.mint(0, web3.toWei(1, 'ether'), { from: acctOne }).should.be.rejectedWith(EVMRevert);
    await truToken.mint(acctOne, web3.toWei(1, 'ether'), { from: 0x0 }).should.be.rejectedWith('invalid address');

  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 14: Should fail to mint after calling finishMinting', async function() {

    await truToken.finishMinting(true, true).should.be.rejectedWith(EVMRevert);
    await truToken.finishMinting(false, true).should.be.rejectedWith(EVMRevert);

    // Close the Pre Sale
    await truToken.finishMinting(true, false);

    // Close the Crowdsale and Finalise Minting
    await truToken.finishMinting(false, true);

    let mFinished = await truToken.mintingFinished();
    await truToken.setReleaseAgent(acctOne, { from: acctOne });
    await truToken.releaseTokenTransfer();

    // Should be unable to set Release Agent after Token released
    await truToken.setReleaseAgent(acctOne, { from: acctOne }).should.be.rejectedWith(EVMRevert);

    assert.isTrue(mFinished,
      '\n      ' +
      'UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 14: Test #1\n      ' +
      'TEST DESCRIPTION: Incorrect finishedMinting result\n      ' +
      'EXPECTED RESULT: true\n      ' +
      'ACTUAL RESULT: ' + mFinished);

    await truToken.mint(acctOne, mintAmount).should.be.rejectedWith(EVMRevert);

  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 15: Token should have correct Upgrade Agent', async function() {
    let uAgent = await truToken.upgradeMaster.call();

    assert.equal(uAgent,
      acctOne,
      '\n      ' +
      'UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 15: Test #1\n      ' +
      'TEST DESCRIPTION: Constructor has incorrect Upgrade Agent specified\n      ' +
      'EXPECTED RESULT: ' + acctOne + '\n      ' +
      'ACTUAL RESULT: ' + uAgent);
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 16: Should deploy new Upgrade Token', async function() {
    tokenMigration = await MockMigrationTarget.new(truToken.address)
    let orgTokenSupply = await tokenMigration.originalSupply.call();
    let isUpgradeAgent = await tokenMigration.isUpgradeAgent.call();

    assert.isTrue(orgTokenSupply.toNumber() == currentSupply.toNumber(),
      '\n      ' +
      'UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 16: Test #1\n      ' +
      'TEST DESCRIPTION: New token supply does not match the original\n      ' +
      'EXPECTED RESULT: ' + currentSupply + '\n      ' +
      'ACTUAL RESULT: ' + orgTokenSupply);

    assert.isTrue(isUpgradeAgent,
      '\n      ' +
      'UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 16: Test #2\n      ' +
      'TEST DESCRIPTION: Is not Upgrade Agent\n      ' +
      'EXPECTED RESULT: true\n      ' +
      'ACTUAL RESULT: ' + isUpgradeAgent);
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 17: Should fail to set empty UpgradeMaster', async function() {

    await truToken.setUpgradeMaster(0x0).should.be.rejectedWith(EVMRevert);
    let upgradeMaster = await truToken.upgradeMaster.call();

    assert.equal(upgradeMaster,
      acctOne,
      '\n      ' +
      'UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 17: Test #1\n      ' +
      'TEST DESCRIPTION: Is not upgradeMaster\n      ' +
      'EXPECTED RESULT: ' + acctOne + '\n      ' +
      'ACTUAL RESULT: ' + upgradeMaster);
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 18: Should fail to set UpgradeMaster if not already master', async function() {

    await truToken.setUpgradeMaster(acctTwo, { from: acctTwo }).should.be.rejectedWith(EVMRevert);
    let upgradeMaster = await truToken.upgradeMaster.call();

    assert.equal(upgradeMaster,
      acctOne,
      '\n      ' +
      'UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 18: Test #1\n      ' +
      'TEST DESCRIPTION: Is not upgradeMaster\n      ' +
      'EXPECTED RESULT: ' + acctOne + '\n      ' +
      'ACTUAL RESULT: ' + upgradeMaster);
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 19: Should set UpgradeMaster if already master', async function() {
    let upgradeMaster = await truToken.upgradeMaster.call();
    await truToken.setUpgradeMaster(acctOne, { from: acctOne });
    upgradeMaster = await truToken.upgradeMaster.call();

    assert.equal(upgradeMaster,
      acctOne,
      '\n      ' +
      'UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 19: Test #1\n      ' +
      'TEST DESCRIPTION: Is not upgradeMaster\n      ' +
      'EXPECTED RESULT: ' + acctOne + '\n      ' +
      'ACTUAL RESULT: ' + upgradeMaster);
    await truToken.setUpgradeMaster(acctOne, { from: execAcct }).should.be.rejectedWith(EVMRevert);
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 20: Token should be able to set the upgrade', async function() {
    let uAgent = await truToken.getUpgradeState.call();

    assert.equal(uAgent.toString(),
      '2',
      '\n      ' +
      'UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 20: Test #1\n      ' +
      'TEST DESCRIPTION: Incorrect result\n      ' +
      'EXPECTED RESULT: 2\n      ' +
      'ACTUAL RESULT: ' + uAgent.toString());
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 21: Token should not upgrade without an upgrade agent set', async function() {

    await truToken.upgrade(150, { from: acctOne }).should.be.rejectedWith(EVMRevert);
    let uAgent = await truToken.getUpgradeState.call();
    assert.equal(uAgent.toString(),
      '2',
      '\n      ' +
      'UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 21: Test #1\n      ' +
      'TEST DESCRIPTION: Incorrect result\n      ' +
      'EXPECTED RESULT: 2\n      ' +
      'ACTUAL RESULT: ' + uAgent.toString());
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 22: Should not set an upgrade agent with empty address', async function() {

    await truToken.setUpgradeAgent(0x0, { from: acctOne }).should.be.rejectedWith(EVMRevert);
    let readyState = await truToken.getUpgradeState.call();
    assert.equal(readyState.toString(),
      '2',
      '\n      ' +
      'UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 22: Test #1\n      ' +
      'TEST DESCRIPTION: Incorrect result\n      ' +
      'EXPECTED RESULT: 2\n      ' +
      'ACTUAL RESULT: ' + readyState.toString());
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 23: Should not set an upgrade agent with a Token that is not allowed to upgrade', async function() {
    let mockToken = await MockUpgradeableToken.new(execAcct, { from: acctOne });

    let mockTokenName = await mockToken.name.call();
    let mockTokenSymbol = await mockToken.symbol.call();
    let mockTokenDecimals = await mockToken.decimals.call();
    let mockTokenSupply = await mockToken.totalSupply.call();

    // Verify Mock Token initialized ok
    assert.equal(mockTokenName,
      'Mock Upgradeable Token',
      '\n      ' +
      'UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 23: Test #1\n      ' +
      'TEST DESCRIPTION: Incorrect token name\n      ' +
      'EXPECTED RESULT: Mock Upgradeable Token\n      ' +
      'ACTUAL RESULT: ' + mockTokenName);
    assert.equal(mockTokenSymbol,
      'MUT',
      '\n      ' +
      'UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 23: Test #2\n      ' +
      'TEST DESCRIPTION: Incorrect token symbol\n      ' +
      'EXPECTED RESULT: MUT\n      ' +
      'ACTUAL RESULT: ' + mockTokenSymbol);
    assert.equal(mockTokenDecimals,
      18,
      '\n      ' +
      'UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 23: Test #3\n      ' +
      'TEST DESCRIPTION: Incorrect number of decimals for token\n      ' +
      'EXPECTED RESULT: 18\n      ' +
      'ACTUAL RESULT: ' + mockTokenDecimals);
    assert.equal(mockTokenSupply,
      100,
      '\n      ' +
      'UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 23: Test #4\n      ' +
      'TEST DESCRIPTION: Incorrect totalSupply\n      ' +
      'EXPECTED RESULT: 100\n      ' +
      'ACTUAL RESULT: ' + mockTokenSupply);

    await mockToken.setUpgradeAgent(tokenMigration.address, { from: acctOne }).should.be.rejectedWith(EVMRevert);
    let readyState = await mockToken.getUpgradeState.call();
    assert.equal(readyState.toString(),
      '1',
      '\n      ' +
      'UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 23: Test #4\n      ' +
      'TEST DESCRIPTION: Incorrect result\n      ' +
      'EXPECTED RESULT: 1\n      ' +
      'ACTUAL RESULT: ' + readyState.toString());
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 24: Should set an upgrade agent that is not an upgrade agent', async function() {
    let notMigration = await MockUpgradeAgent.new(truToken.address, { from: acctOne })
    let orgTokenSupply = await notMigration.originalSupply.call();
    let isUpgradeAgent = await notMigration.isUpgradeAgent.call();

    await truToken.setUpgradeAgent(notMigration.address, { from: acctOne }).should.be.rejectedWith(EVMRevert);

    let readyState = await truToken.getUpgradeState.call();

    assert.equal(readyState.toString(),
      '2',
      '\n      ' +
      'UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 24: Test #1\n      ' +
      'TEST DESCRIPTION: Incorrect result\n      ' +
      'EXPECTED RESULT: 2\n      ' +
      'ACTUAL RESULT: ' + readyState.toString());
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 25: Should set an upgrade agent', async function() {
    await truToken.setUpgradeAgent(tokenMigration.address, { from: acctOne })
    let readyState = await truToken.getUpgradeState.call();

    assert.equal(readyState.toString(),
      '3',
      '\n      ' +
      'UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 25: Test #1\n      ' +
      'TEST DESCRIPTION: Incorrect result\n      ' +
      'EXPECTED RESULT: 3\n      ' +
      'ACTUAL RESULT: ' + readyState.toString());
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 26: Only Token owner can set upgrade', async function() {

    await truToken.setUpgradeAgent(tokenMigration.address, { from: acctTwo }).should.be.rejectedWith(EVMRevert);
    let agent = await truToken.upgradeAgent.call();

    assert.equal(agent,
      tokenMigration.address,
      '\n      ' +
      'UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 26: Test #1\n      ' +
      'TEST DESCRIPTION: Incorrect Upgrade Agent Token Owner\n      ' +
      'EXPECTED RESULT: ' + tokenMigration.address + '\n      ' +
      'ACTUAL RESULT: ' + agent);
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 27: Token should not upgrade with an empty upgrade amount', async function() {

    await truToken.upgrade(0, { from: acctOne }).should.be.rejectedWith(EVMRevert);
    let upgradeState = await truToken.getUpgradeState.call();
    assert.equal(upgradeState.toString(),
      '3',
      '\n      ' +
      'UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 27: Test #1\n      ' +
      'TEST DESCRIPTION: Incorrect Upgrade State\n      ' +
      'EXPECTED RESULT: 3\n      ' +
      'ACTUAL RESULT: ' + upgradeState.toString());
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 28: Token should not upgrade from an account without tokens', async function() {

    await truToken.upgrade(150, { from: accounts[3] }).should.be.rejectedWith(EVMRevert);

    let upgradeState = await truToken.getUpgradeState.call();
    assert.equal(upgradeState.toString(),
      '3',
      '\n      ' +
      'UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 28: Test #1\n      ' +
      'TEST DESCRIPTION: Incorrect Upgrade State\n      ' +
      'EXPECTED RESULT: 3\n      ' +
      'ACTUAL RESULT: ' + upgradeState.toString());
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 29: Token should not upgrade with an amount greater than the supply', async function() {

    let totalSupply = await truToken.totalSupply.call();
    upgradeAmount = totalSupply / 2;
    diffBalance = totalSupply - upgradeAmount;
    let greaterThanSupply = totalSupply + (150 * 10 ** 18);
    await truToken.upgrade(greaterThanSupply, { from: acctOne }).should.be.rejectedWith(EVMRevert);

    let upgradeState = await truToken.getUpgradeState.call();
    assert.equal(upgradeState.toString(),
      '3',
      '\n      ' +
      'UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 29: Test #1\n      ' +
      'TEST DESCRIPTION: Incorrect Upgrade State\n      ' +
      'EXPECTED RESULT: 3\n      ' +
      'ACTUAL RESULT: ' + upgradeState.toString());
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 30: Should upgrade the token', async function() {

    await truToken.upgrade(upgradeAmount, { from: acctOne })
    let tokenSupply = await truToken.totalSupply.call();
    let newTokenSupply = await tokenMigration.totalSupply.call();
    let upgradeState = await truToken.getUpgradeState.call();
    let totalUpgraded = await truToken.totalUpgraded.call();
    let tokenBalance = await truToken.balanceOf.call(acctOne);
    let newBalance = await tokenMigration.balanceOf.call(acctOne);

    assert.equal(tokenSupply,
      diffBalance,
      '\n      ' +
      'UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 30: Test #1\n      ' +
      'TEST DESCRIPTION: totalSupply does not match deducted amount\n      ' +
      'EXPECTED RESULT: ' + diffBalance + '\n      ' +
      'ACTUAL RESULT: ' + upgradeAmount);

    assert.equal(newTokenSupply,
      upgradeAmount,
      '\n      ' +
      'UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 30: Test #2\n      ' +
      'TEST DESCRIPTION: newTokenSupply does not match upgradeAmount\n      ' +
      'EXPECTED RESULT: ' + newTokenSupply + '\n      ' +
      'ACTUAL RESULT: ' + upgradeAmount);

    assert.equal(upgradeState.toString(),
      '4',
      '\n      ' +
      'UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 30: Test #3\n      ' +
      'TEST DESCRIPTION: Incorrect Upgrade State\n      ' +
      'EXPECTED RESULT: 4\n      ' +
      'ACTUAL RESULT: ' + upgradeState.toString());

    assert.equal(totalUpgraded,
      upgradeAmount,
      '\n      ' +
      'UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 30: Test #4\n      ' +
      'TEST DESCRIPTION: totalUpgraded does not match upgradeAmount\n      ' +
      'EXPECTED RESULT: ' + upgradeAmount + '\n      ' +
      'ACTUAL RESULT: ' + totalUpgraded);

    assert(tokenBalance,
      upgradeAmount,
      '\n      ' +
      'UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 30: Test #5\n      ' +
      'TEST DESCRIPTION: tokenBalance does not match upgradeAmount\n      ' +
      'EXPECTED RESULT: ' + upgradeAmount + '\n      ' +
      'ACTUAL RESULT: ' + tokenBalance);

    assert(newBalance,
      upgradeAmount,
      '\n      ' +
      'UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 30: Test #6\n      ' +
      'TEST DESCRIPTION: newBalance does not match upgradeAmount\n      ' +
      'EXPECTED RESULT: ' + upgradeAmount + '\n      ' +
      'ACTUAL RESULT: ' + newBalance);

  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 31: UpgradeAgent should not be changed after the upgrade has started', async function() {

    await truToken.setUpgradeAgent(truToken.address, { from: acctOne }).should.be.rejectedWith(EVMRevert);

    let owner = await truToken.upgradeAgent.call();
    assert.equal(owner,
      tokenMigration.address,
      '\n      ' +
      'UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 31: Test #1\n      ' +
      'TEST DESCRIPTION: owner address does not match tokenMigration.address\n      ' +
      'EXPECTED RESULT: ' + tokenMigration.address + '\n      ' +
      'ACTUAL RESULT: ' + owner);
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 32: MockMigrationTarget should revert on attempt to transfer to it', async function() {
    try {
      await web3.eth.sendTransaction({ value: 10, from: acctOne, to: tokenMigration.address })
    } catch (err) {
      let revert = err.message.search('revert') >= 0;
      assert(
        revert,
        '\n      ' +
        'UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 32: Test #1\n      ' +
        'TEST DESCRIPTION: Sending to token migration did not fail as expected\n      ' +
        'EXPECTED RESULT: revert\n      ' +
        'ACTUAL RESULT: ' + err
      );
    }
    let migrationBalance = await truToken.balanceOf.call(tokenMigration.address);

    assert.equal(migrationBalance.toNumber(),
      0,
      '\n      ' +
      'UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 32: Test #2\n      ' +
      'TEST DESCRIPTION: Migration Balance is not empty\n      ' +
      'EXPECTED RESULT: 0\n      ' +
      'ACTUAL RESULT: ' + migrationBalance.toNumber());
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 33: Functions increaseApproval & decreaseApproval should increase & decrease approved allowance', async function() {
    let allowance = await truToken.allowance.call(acctOne, acctTwo);
    assert.equal(allowance.toNumber(), 0,
      '\n      ' +
      'UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 33: Test #1\n      ' +
      'TEST DESCRIPTION: Allowance is not 0 TRU\n      ' +
      'EXPECTED RESULT: 0\n      ' +
      'ACTUAL RESULT: ' + allowance.toNumber());

    let aOneBal = await truToken.balanceOf.call(acctOne)
    let aTwoBal = await truToken.balanceOf.call(acctTwo)

    await truToken.approve(acctTwo, web3.toWei(1, 'ether'), { from: acctOne });
    allowance = await truToken.allowance.call(acctOne, acctTwo);
    assert.equal(allowance, web3.toWei(1, 'ether'),
      '\n      ' +
      'UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 33: Test #2\n      ' +
      'TEST DESCRIPTION: Allowance is not 1 TRU\n      ' +
      'EXPECTED RESULT: 1 TRU\n      ' +
      'ACTUAL RESULT: ' + web3.fromWei(allowance, 'ether'));

    await truToken.increaseApproval(acctTwo, web3.toWei(1, 'ether'), { from: acctOne });
    allowance = await truToken.allowance.call(acctOne, acctTwo);
    assert.equal(allowance, web3.toWei(2, 'ether'),
      '\n      ' +
      'UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 33: Test #3\n      ' +
      'TEST DESCRIPTION: Allowance is not 2 TRU\n      ' +
      'EXPECTED RESULT: 2 TRU\n      ' +
      'ACTUAL RESULT: ' + web3.toWei(allowance, 'ether'));
    await truToken.decreaseApproval(acctTwo, web3.toWei(1, 'ether'), { from: acctOne });
    allowance = await truToken.allowance.call(acctOne, acctTwo);
    assert.equal(allowance, web3.toWei(1, 'ether'),
      '\n      ' +
      'UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 33: Test #4\n      ' +
      'TEST DESCRIPTION: Allowance is not 1 TRU\n      ' +
      'EXPECTED RESULT: 1 TRU\n      ' +
      'ACTUAL RESULT: ' + web3.toWei(allowance, 'ether'));

    await truToken.decreaseApproval(acctTwo, web3.toWei(2, 'ether'), { from: acctOne });
    allowance = await truToken.allowance.call(acctOne, acctTwo);
    assert.equal(allowance, web3.toWei(0, 'ether'),
      '\n      ' +
      'UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 33: Test #5\n      ' +
      'TEST DESCRIPTION: Allowance is not 0 TRU\n      ' +
      'EXPECTED RESULT: 0 TRU\n      ' +
      'ACTUAL RESULT: ' + web3.toWei(allowance, 'ether'));
  }).timeout(timeoutDuration);

  it('UNIT TESTS - TRUREPUTATIONTOKEN - TEST CASE 34: Function transferFrom should fail with invalid values', async function() {

    await truToken.approve(acctTwo, web3.toWei(1, 'ether'), { from: acctOne });
    await truToken.transferFrom(acctOne, 0x0, web3.toWei(1, 'ether')).should.be.rejectedWith(EVMRevert);
    await truToken.transferFrom(acctOne, acctTwo, web3.toWei(100, 'ether')).should.be.rejectedWith(EVMRevert);
    await truToken.decreaseApproval(acctTwo, web3.toWei(2, 'ether'), { from: acctOne });
  }).timeout(timeoutDuration);
});