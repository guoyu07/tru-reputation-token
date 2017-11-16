'use strict';
const BigNumber = web3.BigNumber;
const TruReputationToken = artifacts.require('./TruReputationToken.sol');
const ERC20Basic = artifacts.require('./ERC20Basic.sol');
const MockMigrationTarget = artifacts.require('./helpers/MockMigrationTarget.sol');
const MockUpgradeableToken = artifacts.require('./helpers/MockUpgradeableToken.sol');
const MockUpgradeAgent = artifacts.require('./helpers/MockUpgradeAgent.sol');
import EVMThrow from './helpers/EVMThrow';
import expectThrow from './helpers/expectThrow';

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

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

  // TRUREPUTATIONTOKENTESTS TEST CASE 01: Token should have correct symbols and description
  it('TRUREPUTATIONTOKENTESTS TEST CASE 01: Token should have correct symbols and description', async function() {

    truToken = await TruReputationToken.new(accountOne);
    let name = await truToken.name.call();
    let symbol = await truToken.symbol.call();
    let decimals = await truToken.decimals.call();
    let execBoard = await truToken.execBoard.call();

    assert.equal(name,
      'Tru Reputation Token',
      'Incorrect name set for TruReputationToken. EXPECTED RESULT: Tru Reputation Token;\
      \nACTUAL RESULT: ' + name);
    assert.equal(symbol,
      'TRU',
      'Incorrect symbol set for TruReputationToken. EXPECTED RESULT: TRU;\
      \nACTUAL RESULT: ' + symbol);
    assert.equal(decimals,
      18,
      'Incorrect number of decimal places set for TruReputationToken. EXPECTED RESULT: 18;\
      \nACTUAL RESULT: ' + decimals);
    assert.equal(execBoard,
      accountOne,
      'Incorrect Exec Board account for TruReputationToken. EXPECTED RESULT:' + accountOne + ';\
      \nACTUAL RESULT: ' + execBoard);
  });

  // TRUREPUTATIONTOKENTESTS TEST CASE 02: Owner should be able to assign Exec Board Account once
  it('TRUREPUTATIONTOKENTESTS TEST CASE 02: Owner should be able to assign Exec Board Account once', async function() {

    await truToken.changeBoardAddress(execAccount);
    let execBoard = await truToken.execBoard.call();

    assert.equal(execBoard,
      execAccount,
      'Incorrect Exec Board account for TruReputationToken. EXPECTED RESULT: ' + execAccount + ';\
      \nACTUAL RESULT: ' + execBoard);
  });

  // TRUREPUTATIONTOKENTESTS TEST CASE 03: Only Exec Board account should be able to change Exec Board
  it('TRUREPUTATIONTOKENTESTS TEST CASE 03: Only Exec Board account should be able to change Exec Board', async function() {

    await truToken.changeBoardAddress(accountTwo, { from: accountOne }).should.be.rejectedWith(EVMThrow);
    let execBoard = await truToken.execBoard.call();

    assert.equal(execBoard,
      execAccount,
      'Incorrect ExecBoard account for TruReputationToken. EXPECTED RESULT:' + execAccount + ';\
      \nACTUAL RESULT: ' + execBoard);
  });

  // TRUREPUTATIONTOKENTESTS TEST CASE 04: Only Exec Board account should be able to change Exec Board
  it('TRUREPUTATIONTOKENTESTS TEST CASE 04: Should be unable to assign an empty address as Exec Board', async function() {

    await truToken.changeBoardAddress(0x0, { from: execAccount }).should.be.rejectedWith(EVMThrow);
    let execBoard = await truToken.execBoard.call();

    assert.equal(execBoard,
      execAccount,
      'Incorrect ExecBoard account for TruReputationToken. EXPECTED RESULT:' + execAccount + ';\
          \nACTUAL RESULT: ' + execBoard);
  });

  // TRUREPUTATIONTOKENTESTS TEST CASE 05: Only Exec Board account should be able to change Exec Board
  it('TRUREPUTATIONTOKENTESTS TEST CASE 05: Should be unable to assign an self as Exec Board', async function() {

    await truToken.changeBoardAddress(execAccount, { from: execAccount }).should.be.rejectedWith(EVMThrow);
    let execBoard = await truToken.execBoard.call();

    assert.equal(execBoard,
      execAccount,
      'Incorrect ExecBoard account for TruReputationToken. EXPECTED RESULT:' + execAccount + ';\
              \nACTUAL RESULT: ' + execBoard);
  });

  // TRUREPUTATIONTOKENTESTS TEST CASE 06: Exec Board should be able to assign different Exec Board Account
  it('TRUREPUTATIONTOKENTESTS TEST CASE 06: Exec Board should be able to assign different Exec Board Account', async function() {

    await truToken.changeBoardAddress(execAccountTwo, { from: execAccount });
    let execBoard = await truToken.execBoard.call();

    assert.equal(execBoard,
      execAccountTwo,
      'Incorrect Exec Board account for TruReputationToken. EXPECTED RESULT: ' + execAccountTwo + ';\
        \nACTUAL RESULT: ' + execBoard);
  });

  // TRUREPUTATIONTOKENTESTS TEST CASE 07: Token should have 0 total supply
  it('TRUREPUTATIONTOKENTESTS TEST CASE 07: Token should have 0 total supply', async function() {
    let totalSupply = await truToken.totalSupply();

    assert.equal(totalSupply,
      0,
      'Incorrect totalSupply. EXPECTED RESULT: 0;\
      \n ACTUAL RESULT: ' + totalSupply);
  });

  // TRUREPUTATIONTOKENTESTS TEST CASE 08: Only Tru Reputation Token owner can set the Release Agent
  it('TRUREPUTATIONTOKENTESTS TEST CASE 08: Only Tru Reputation Token owner can set the Release Agent', async function() {

    await truToken.setReleaseAgent(execAccountTwo, { from: execAccountTwo }).should.be.rejectedWith(EVMThrow);

    let agent = await truToken.releaseAgent.call();

    assert.equal(agent,
      0x0,
      'Incorrect Release agent set for TruReputationToken. EXPECTED RESULT: 0x0;\
    \nACTUAL RESULT: ' + agent);
  });

  // TRUREPUTATIONTOKENTESTS TEST CASE 09: Owner can set transferAgent
  it('TRUREPUTATIONTOKENTESTS TEST CASE 09: Owner can set transferAgent', async function() {
    await truToken.setTransferAgent(execAccount, true, { from: accountOne })

    let transferAgent = await truToken.transferAgents(execAccount);

    assert.equal(transferAgent,
      true,
      'Incorrect Transfer Agent Set. Expected: true. Got ' + transferAgent);

    await truToken.setTransferAgent(execAccountTwo, true, { from: accountTwo }).should.be.rejectedWith(EVMThrow);

    let notAgent = await truToken.transferAgents(execAccountTwo);

    assert.equal(notAgent,
      false,
      'Incorrect Transfer Agent Set. Expected: false. Got ' + notAgent);
  });

  // TRUREPUTATIONTOKENTESTS TEST CASE 10: mintingFinished should be false after construction
  it('TRUREPUTATIONTOKENTESTS TEST CASE 10: mintingFinished should be false after construction', async function() {
    let mintingFinished = await truToken.mintingFinished();

    assert.equal(mintingFinished,
      false,
      'mintingFinished has incorrect value after construction. EXPECTED RESULT: false;\
      \nACTUAL RESULT: ' + mintingFinished);
  });

  // TRUREPUTATIONTOKENTESTS TEST CASE 11: Should fail to deploy new Upgrade Token with no tokens
  it('TRUREPUTATIONTOKENTESTS TEST CASE 11: Should fail to deploy new Upgrade Token with no tokens', async function() {
    await MockMigrationTarget.new(truToken.address).should.be.rejectedWith(EVMThrow);
  });

  // TRUREPUTATIONTOKENTESTS TEST CASE 12: Should mint a token with 10^18 decimal places
  it('TRUREPUTATIONTOKENTESTS TEST CASE 12:  Should mint a token with 10^18 decimal places', async function() {
    let largestFract = 1 * 10 ** 17;
    let ten = 10;
    let one = 1;
    let mintAmt = largestFract + ten + one;
    const result = await truToken.mint(accountOne, mintAmt);
    let balance = await truToken.balanceOf(accountOne);
    let supply = await truToken.totalSupply();

    assert.equal(result.logs[0].event,
      'Minted',
      'Incorrect Event. EXPECTED RESULT: Mint;\
      \nACTUAL RESULT: ' + result.logs[0].event);

    assert.equal(result.logs[0].args._to.valueOf(),
      accountOne,
      'Incorrect address to send new Tokens to. EXPECTED RESULT: ' + accountOne + ';\
      \nACTUAL RESULT: ' + result.logs[0].args._to.valueOf());

    assert.equal(result.logs[0].args._amount.valueOf(),
      mintAmt,
      'Incorrect amount of new Tokens to mint. EXPECTED RESULT: ' + mintAmt + ';\
      \nACTUAL RESULT: ' + result.logs[0].args._amount.valueOf());

    assert.equal(result.logs[1].event,
      'Transfer',
      'Incorrect Event. EXPECTED RESULT: Mint; Transfer Value: ' + result.logs[1].event);

    assert.equal(result.logs[1].args.from.valueOf(),
      0x0,
      'Incorrect address for sending tokens. EXPECTED RESULT: ' + 0x0 + '\
      \nACTUAL RESULT: ' + result.logs[1].args.from.valueOf());

    assert.equal(balance,
      mintAmt,
      'Balance of accounts[0] does not match minted amount. EXPECTED RESULT: ' + mintAmt + ';\
      \nACTUAL RESULT: ' + balance);

    assert.equal(supply,
      mintAmt,
      'Total supply does not match minted amount. EXPECTED RESULT: ' + mintAmt + ';\
      \nACTUAL RESULT: ' + supply);
    currentSupply = largestFract + ten + one;
  });

  // TRUREPUTATIONTOKENTESTS TEST CASE 13: Should mint 100 tokens in a supplied address
  it('TRUREPUTATIONTOKENTESTS TEST CASE 13: Should mint 100 tokens in a supplied address', async function() {
    let largestFract = 1 * 10 ** 17;
    let ten = 10;
    let one = 1;
    currentSupply = currentSupply + mintAmount;
    const result = await truToken.mint(accountOne, mintAmount);
    let balance = await truToken.balanceOf(accountOne);
    let supply = await truToken.totalSupply();

    assert.equal(result.logs[0].event,
      'Minted',
      'Incorrect Event. EXPECTED RESULT: Mint;\
      \nACTUAL RESULT: ' + result.logs[0].event);

    assert.equal(result.logs[0].args._to.valueOf(),
      accountOne,
      'Incorrect address to send new Tokens to. EXPECTED RESULT: ' + accountOne + ';\
      \nACTUAL RESULT: ' + result.logs[0].args._to.valueOf());

    assert.equal(result.logs[0].args._amount.valueOf(),
      mintAmount,
      'Incorrect amount of new Tokens to mint. EXPECTED RESULT: ' + mintAmount + ';\
      \nACTUAL RESULT: ' + result.logs[0].args._amount.valueOf());

    assert.equal(result.logs[1].event,
      'Transfer',
      'Incorrect Event. EXPECTED RESULT: Mint; Transfer Value: ' + result.logs[1].event);

    assert.equal(result.logs[1].args.from.valueOf(),
      0x0,
      'Incorrect address for sending tokens. EXPECTED RESULT: ' + 0x0 + '\
      \nACTUAL RESULT: ' + result.logs[1].args.from.valueOf());

    assert.equal(balance,
      currentSupply,
      'Balance of accounts[0] does not match minted amount. EXPECTED RESULT: ' + currentSupply + ';\
      \nACTUAL RESULT: ' + balance);

    assert.equal(supply,
      currentSupply,
      'Total supply does not match minted amount. EXPECTED RESULT: ' + currentSupply + ';\
      \nACTUAL RESULT: ' + supply);

    await truToken.mint(accountOne, 0, { from: accountOne }).should.be.rejectedWith(EVMThrow);
    await truToken.mint(0, web3.toWei(1, 'ether'), { from: accountOne }).should.be.rejectedWith(EVMThrow);
    await truToken.mint(accountOne, web3.toWei(1, 'ether'), { from: 0x0 }).should.be.rejectedWith('invalid address');

  });

  // TRUREPUTATIONTOKENTESTS TEST CASE 14: Should fail to mint after calling finishedMinting
  it('TRUREPUTATIONTOKENTESTS TEST CASE 14: Should fail to mint after calling finishMinting', async function() {

    await truToken.finishMinting(true, true).should.be.rejectedWith(EVMThrow);
    await truToken.finishMinting(false, true).should.be.rejectedWith(EVMThrow);

    // Close the Pre Sale
    await truToken.finishMinting(true, false);

    // Close the Crowdsale and Finalise Minting
    await truToken.finishMinting(false, true);

    let mFinished = await truToken.mintingFinished();
    await truToken.setReleaseAgent(accountOne, { from: accountOne });
    await truToken.releaseTokenTransfer();

    // Should be unable to set Release Agent after Token released
    await truToken.setReleaseAgent(accountOne, { from: accountOne }).should.be.rejectedWith(EVMThrow);

    assert.isTrue(mFinished,
      'Incorrect finishedMinting result. EXPECTED RESULT: true;\
      \nACTUAL RESULT: ' + mFinished);

    await truToken.mint(accountOne, mintAmount).should.be.rejectedWith(EVMThrow);

  });

  // TRUREPUTATIONTOKENTESTS TEST CASE 15: Token should have correct Upgrade Agent
  it('TRUREPUTATIONTOKENTESTS TEST CASE 15: Token should have correct Upgrade Agent', async function() {
    let uAgent = await truToken.upgradeMaster.call();

    assert.equal(uAgent,
      accountOne,
      'Constructor has incorrect Upgrade Agent specified. EXPECTED RESULT: ' + accountOne + ';\
      \nACTUAL RESULT: ' + uAgent);
  });

  // TRUREPUTATIONTOKENTESTS TEST CASE 16: Should deploy new Upgrade Token
  it('TRUREPUTATIONTOKENTESTS TEST CASE 16: Should deploy new Upgrade Token', async function() {
    tokenMigration = await MockMigrationTarget.new(truToken.address)
    let orgTokenSupply = await tokenMigration.originalSupply.call();
    let isUpgradeAgent = await tokenMigration.isUpgradeAgent.call();

    assert.equal(orgTokenSupply,
      currentSupply,
      'New token supply does not match the original. EXPECTED RESULT: ' + currentSupply + ';\
      \nACTUAL RESULT: ' + orgTokenSupply);
    assert.isTrue(isUpgradeAgent,
      'Is not Upgrade Agent. EXPECTED RESULT: true;\
      \nACTUAL RESULT: ' + isUpgradeAgent);
  });

  // TRUREPUTATIONTOKENTESTS TEST CASE 17: Should fail to set empty UpgradeMaster
  it('TRUREPUTATIONTOKENTESTS TEST CASE 17: Should fail to set empty UpgradeMaster', async function() {

    await truToken.setUpgradeMaster(0x0).should.be.rejectedWith(EVMThrow);
    let upgradeMaster = await truToken.upgradeMaster.call();

    assert.equal(upgradeMaster,
      accountOne,
      'Is not upgradeMaster. EXPECTED RESULT: ' + accountOne + ';\
        \nACTUAL RESULT: ' + upgradeMaster);
  });

  // TRUREPUTATIONTOKENTESTS TEST CASE 18: Should fail to set UpgradeMaster if not already master
  it('TRUREPUTATIONTOKENTESTS TEST CASE 18: Should fail to set UpgradeMaster if not already master', async function() {

    await truToken.setUpgradeMaster(accountTwo, { from: accountTwo }).should.be.rejectedWith(EVMThrow);
    let upgradeMaster = await truToken.upgradeMaster.call();

    assert.equal(upgradeMaster,
      accountOne,
      'Is not upgradeMaster. EXPECTED RESULT: ' + accountOne + ';\
        \nACTUAL RESULT: ' + upgradeMaster);
  });

  // TRUREPUTATIONTOKENTESTS TEST CASE 19: Should set UpgradeMaster if already master
  it('TRUREPUTATIONTOKENTESTS TEST CASE 19: Should set UpgradeMaster if already master', async function() {
    await truToken.setUpgradeMaster(accountOne, { from: accountOne })
    let upgradeMaster = await truToken.upgradeMaster.call();

    assert.equal(upgradeMaster,
      accountOne,
      'Is not upgradeMaster. EXPECTED RESULT: ' + accountOne + ';\
    \nACTUAL RESULT: ' + upgradeMaster);
  });

  // TRUREPUTATIONTOKENTESTS TEST CASE 20: Token should be able to set the upgrade
  it('TRUREPUTATIONTOKENTESTS TEST CASE 20: Token should be able to set the upgrade', async function() {
    let uAgent = await truToken.getUpgradeState.call();

    assert.equal(uAgent.toString(),
      '2',
      'Incorrect result. EXPECTED RESULT: 2;\
      \nACTUAL RESULT: ' + uAgent.toString());
  });

  // TRUREPUTATIONTOKENTESTS TEST CASE 21: Token should not upgrade without an upgrade agent set
  it('TRUREPUTATIONTOKENTESTS TEST CASE 21: Token should not upgrade without an upgrade agent set', async function() {

    await truToken.upgrade(150, { from: accountOne }).should.be.rejectedWith(EVMThrow);
    let uAgent = await truToken.getUpgradeState.call();
    assert.equal(uAgent.toString(),
      '2',
      'Incorrect result. EXPECTED RESULT: 2;\
      \nACTUAL RESULT: ' + uAgent.toString());
  });

  // TRUREPUTATIONTOKENTESTS TEST CASE 22: Should not set an upgrade agent with empty address
  it('TRUREPUTATIONTOKENTESTS TEST CASE 22: Should not set an upgrade agent with empty address', async function() {

    await truToken.setUpgradeAgent(0x0, { from: accountOne }).should.be.rejectedWith(EVMThrow);
    let readyState = await truToken.getUpgradeState.call();
    assert.equal(readyState.toString(),
      '2',
      'Incorrect result. EXPECTED RESULT: 2;\
    \nACTUAL RESULT: ' + readyState.toString());
  });

  // TRUREPUTATIONTOKENTESTS TEST CASE 23: Should not set an upgrade agent with a Token that is not allowed to upgrade
  it('TRUREPUTATIONTOKENTESTS TEST CASE 23: Should not set an upgrade agent with a Token that is not allowed to upgrade', async function() {
    let mockToken = await MockUpgradeableToken.new(accountOne);

    let mockTokenName = await mockToken.name.call();
    let mockTokenSymbol = await mockToken.symbol.call();
    let mockTokenDecimals = await mockToken.decimals.call();

    // Verify Mock Token initialized ok
    assert.equal(mockTokenName,
      'Mock Upgradeable Token',
      'Incorrect result. EXPECTED RESULT: Mock Upgradeable Token;\
      \nACTUAL RESULT: ' + mockTokenName);
    assert.equal(mockTokenSymbol,
      'MUT',
      'Incorrect result. EXPECTED RESULT: MUT;\
      \nACTUAL RESULT: ' + mockTokenSymbol);
    assert.equal(mockTokenDecimals,
      18,
      'Incorrect result. EXPECTED RESULT: 18;\
      \nACTUAL RESULT: ' + mockTokenDecimals);

    await mockToken.setUpgradeAgent(tokenMigration.address, { from: accountOne }).should.be.rejectedWith(EVMThrow);
    let readyState = await mockToken.getUpgradeState.call();
    assert.equal(readyState.toString(),
      '1',
      'Incorrect result. EXPECTED RESULT: 1;\
   \nACTUAL RESULT: ' + readyState.toString());
  });

  // TRUREPUTATIONTOKENTESTS TEST CASE 24: Should set an upgrade agent that is not an upgrade agent
  it('TRUREPUTATIONTOKENTESTS TEST CASE 24: Should set an upgrade agent that is not an upgrade agent', async function() {
    let notMigration = await MockUpgradeAgent.new(truToken.address, { from: accountOne })
    let orgTokenSupply = await notMigration.originalSupply.call();
    let isUpgradeAgent = await notMigration.isUpgradeAgent.call();

    await truToken.setUpgradeAgent(notMigration.address, { from: accountOne }).should.be.rejectedWith(EVMThrow);

    let readyState = await truToken.getUpgradeState.call();

    assert.equal(readyState.toString(),
      '2',
      'Incorrect result. EXPECTED RESULT: 2;\
      \nACTUAL RESULT: ' + readyState.toString());
  });

  // TRUREPUTATIONTOKENTESTS TEST CASE 25: Should set an upgrade agent
  it('TRUREPUTATIONTOKENTESTS TEST CASE 25: Should set an upgrade agent', async function() {
    await truToken.setUpgradeAgent(tokenMigration.address, { from: accountOne })
    let readyState = await truToken.getUpgradeState.call();

    assert.equal(readyState.toString(),
      '3',
      'Incorrect result. EXPECTED RESULT: 3;\
      \nACTUAL RESULT: ' + readyState.toString());
  });

  // TRUREPUTATIONTOKENTESTS TEST CASE 26: Only Token own can set upgrade
  it('TRUREPUTATIONTOKENTESTS TEST CASE 26: Only Token owner can set upgrade', async function() {

    await truToken.setUpgradeAgent(tokenMigration.address, { from: accountTwo }).should.be.rejectedWith(EVMThrow);
    let agent = await truToken.upgradeAgent.call();

    assert.equal(agent,
      tokenMigration.address,
      'Incorrect Upgrade Agent Token Owner. EXPECTED RESULT: ' + tokenMigration.address + ';\
      \nACTUAL RESULT: ' + agent);
  });

  // TRUREPUTATIONTOKENTESTS TEST CASE 27: Token should not upgrade with an empty upgrade amount
  it('TRUREPUTATIONTOKENTESTS TEST CASE 27: Token should not upgrade with an empty upgrade amount', async function() {

    await truToken.upgrade(0, { from: accountOne }).should.be.rejectedWith(EVMThrow);
    let upgradeState = await truToken.getUpgradeState.call();
    assert.equal(upgradeState.toString(),
      '3',
      'Wrong Upgrade State. EXPECTED RESULT: 3;\
    \nACTUAL RESULT: ' + upgradeState.toString());
  });

  // TRUREPUTATIONTOKENTESTS TEST CASE 28: Token should not upgrade from an account without tokens
  it('TRUREPUTATIONTOKENTESTS TEST CASE 28: Token should not upgrade from an account without tokens', async function() {

    await truToken.upgrade(150, { from: accounts[3] }).should.be.rejectedWith(EVMThrow);

    let upgradeState = await truToken.getUpgradeState.call();
    assert.equal(upgradeState.toString(),
      '3',
      'Wrong Upgrade State. EXPECTED RESULT: 3;\
    \nACTUAL RESULT: ' + upgradeState.toString());
  });

  // TRUREPUTATIONTOKENTESTS TEST CASE 29: Token should not upgrade with an amount greater than the supply
  it('TRUREPUTATIONTOKENTESTS TEST CASE 29: Token should not upgrade with an amount greater than the supply', async function() {

    let totalSupply = await truToken.totalSupply.call();
    upgradeAmount = totalSupply / 2;
    diffBalance = totalSupply - upgradeAmount;
    let greaterThanSupply = totalSupply + (150 * 10 ** 18);
    await truToken.upgrade(greaterThanSupply, { from: accountOne }).should.be.rejectedWith(EVMThrow);

    let upgradeState = await truToken.getUpgradeState.call();
    assert.equal(upgradeState.toString(),
      '3',
      'Wrong Upgrade State. EXPECTED RESULT: 3;\
    \nACTUAL RESULT: ' + upgradeState.toString());
  });

  // TRUREPUTATIONTOKENTESTS TEST CASE 30: Should upgrade the token
  it('TRUREPUTATIONTOKENTESTS TEST CASE 30: Should upgrade the token', async function() {

    await truToken.upgrade(upgradeAmount, { from: accountOne })
    let tokenSupply = await truToken.totalSupply.call();
    let newTokenSupply = await tokenMigration.totalSupply.call();
    let upgradeState = await truToken.getUpgradeState.call();
    let totalUpgraded = await truToken.totalUpgraded.call();
    let tokenBalance = await truToken.balanceOf.call(accountOne);
    let newBalance = await tokenMigration.balanceOf.call(accountOne);

    assert.equal(tokenSupply,
      diffBalance,
      'Error- totalSupply does not match deducted amount. EXPECTED RESULT: ' + diffBalance + ';\
      \nACTUAL RESULT: ' + upgradeAmount);

    assert.equal(newTokenSupply,
      upgradeAmount,
      'Error- newTokenSupply does not match upgradeAmount. EXPECTED RESULT: ' + newTokenSupply + ';\
      \nACTUAL RESULT: ' + upgradeAmount);

    assert.equal(upgradeState.toString(),
      '4',
      'Wrong Upgrade State. EXPECTED RESULT: 4;\
      \nACTUAL RESULT: ' + upgradeState.toString());

    assert.equal(totalUpgraded,
      upgradeAmount,
      'totalUpgraded does not match upgradeAmount. EXPECTED RESULT: ' + upgradeAmount + ';\
      \nACTUAL RESULT: ' + totalUpgraded);

    assert(tokenBalance,
      upgradeAmount,
      'tokenBalance does not match upgradeAmount. EXPECTED RESULT: ' + upgradeAmount + ';\
      \nACTUAL RESULT: ' + tokenBalance);

    assert(newBalance,
      upgradeAmount,
      'newBalance does not match upgradeAmount. EXPECTED RESULT: ' + upgradeAmount + ';\
      \nACTUAL RESULT: ' + newBalance);

  });

  // TRUREPUTATIONTOKENTESTS TEST CASE 31: Should only upgrade the specified amount of tokens
  it('TRUREPUTATIONTOKENTESTS TEST CASE 31: Should not allow an upgrade in parallel to another', async function() {

    await truToken.upgrade(upgradeAmount).should.be.rejectedWith(EVMThrow);

    let supply = await truToken.totalSupply.call();

    assert.equal(supply,
      diffBalance,
      'supply does not match upgradeAmount. EXPECTED RESULT: ' + diffBalance + ';\
      \nACTUAL RESULT: ' + supply);
  });

  // TRUREPUTATIONTOKENTESTS TEST CASE 32: Upgrade Agent should not be changed after the upgrade has started
  it('TRUREPUTATIONTOKENTESTS TEST CASE 32: Upgrade Agent should not be changed after the upgrade has started', async function() {

    await truToken.setUpgradeAgent(truToken.address, { from: accountOne }).should.be.rejectedWith(EVMThrow);

    let owner = await truToken.upgradeAgent.call();
    assert.equal(owner,
      tokenMigration.address,
      'owner address does not match tokenMigration.address. EXPECTED RESULT: ' + tokenMigration.address + ';\
      \nACTUAL RESULT: ' + owner);
  });

  // TRUREPUTATIONTOKENTESTS TEST CASE 33: MockMigrationTarget should revert on attempt to transfer to it
  it('TRUREPUTATIONTOKENTESTS TEST CASE 33: MockMigrationTarget should revert on attempt to transfer to it', async function() {

    try {
      await web3.eth.sendTransaction({ 'value': 10, 'from': accountOne, 'to': tokenMigration.address });
    } catch (error) {
      const invalidOpcode = error.message.search('invalid opcode') >= 0;
      const outOfGas = error.message.search('out of gas') >= 0;
      assert(
        invalidOpcode || outOfGas,
        "Expected throw, got '" + error + "' instead",
      );
    }

    let migrationBalance = await truToken.balanceOf(tokenMigration.address);

    assert.equal(migrationBalance,
      0,
      'Migration Balance is not empty. EXPECTED RESULT: 0;\
        \nACTUAL RESULT: ' + migrationBalance);
  });

  it('TRUREPUTATIONTOKENTESTS TEST CASE 34: increaseApproval & decreaseApproval should increase & decrease approved allowance', async function() {
    let allowance = await truToken.allowance(accountOne, accountTwo);
    assert.equal(allowance, 0,
      'Allowance Test #1: is not 0 TRU. EXPECTED RESULT: 0;\n\
      ACTUAL RESULT: ' + allowance);
    let aOneBal = await truToken.balanceOf(accountOne)
    let aTwoBal = await truToken.balanceOf(accountTwo)


    await truToken.approve(accountTwo, web3.toWei(1, 'ether'), { from: accountOne });
    allowance = await truToken.allowance(accountOne, accountTwo);
    assert.equal(allowance, web3.toWei(1, 'ether'),
      'Allowance Test #2: is not 1 TRU. EXPECTED RESULT: 1 TRU;\n\
      ACTUAL RESULT: ' + web3.fromWei(allowance, 'ether'));

    await truToken.increaseApproval(accountTwo, web3.toWei(1, 'ether'), { from: accountOne });
    allowance = await truToken.allowance(accountOne, accountTwo);
    assert.equal(allowance, web3.toWei(2, 'ether'),
      'Allowance Test #3: is not 2 TRU. EXPECTED RESULT: 2 TRU;\n\
      ACTUAL RESULT: ' + web3.toWei(allowance, 'ether'));
    await truToken.decreaseApproval(accountTwo, web3.toWei(1, 'ether'), { from: accountOne });
    allowance = await truToken.allowance(accountOne, accountTwo);
    assert.equal(allowance, web3.toWei(1, 'ether'),
      'Allowance Test #4: is not 1 TRU. EXPECTED RESULT: 1 TRU;\n\
        ACTUAL RESULT: ' + web3.toWei(allowance, 'ether'));

    await truToken.decreaseApproval(accountTwo, web3.toWei(2, 'ether'), { from: accountOne });
    allowance = await truToken.allowance(accountOne, accountTwo);
    assert.equal(allowance, web3.toWei(0, 'ether'),
      'Allowance Test #5: is not 0 TRU. EXPECTED RESULT: 0 TRU;\n\
      ACTUAL RESULT: ' + web3.toWei(allowance, 'ether'));
  });

  it('TRUREPUTATIONTOKENTESTS TEST CASE 35: transferFrom should fail with invalid values', async function() {

    await truToken.approve(accountTwo, web3.toWei(1, 'ether'), { from: accountOne });
    await truToken.transferFrom(accountOne, 0x0, web3.toWei(1, 'ether')).should.be.rejectedWith(EVMThrow);
    await truToken.transferFrom(accountOne, accountTwo, web3.toWei(100, 'ether')).should.be.rejectedWith(EVMThrow);
    await truToken.decreaseApproval(accountTwo, web3.toWei(2, 'ether'), { from: accountOne });
  })
});