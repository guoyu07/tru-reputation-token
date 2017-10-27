'use strict';
const BigNumber = web3.BigNumber;
const TruReputationToken = artifacts.require('./TruReputationToken.sol');
const ERC20Basic = artifacts.require('./ERC20Basic.sol');
const TestMigrationTarget = artifacts.require('./TestMigrationTarget.sol');
const TestEmptyUpgradeToken = artifacts.require('./TestEmptyUpgradeToken.sol');
const TestNotUpgradeAgent = artifacts.require('./TestNotUpgradeAgent.sol');
import expectThrow from './helpers/expectThrow';
require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

contract('TruReputationToken', function(accounts) {
  var truToken;
  let tokenMigration;
  let mintAmount = 100;
  let accountOne = accounts[0];
  let accountTwo = accounts[1];
  let execAccount = accounts[2];
  let execAccountTwo = accounts[3];
  let upgradeAmount = 50;
  let diffBalance = mintAmount - upgradeAmount;

  // TRU REPUTATION TOKEN - TEST CASE: Token should have correct symbols and description
  it('TRU REPUTATION TOKEN - TEST CASE: Token should have correct symbols and description', async function() {

    truToken = await TruReputationToken.new(accountOne);
    let name = await truToken.name.call();
    let symbol = await truToken.symbol.call();
    let decimals = await truToken.decimals.call();
    let execBoard = await truToken.EXEC_BOARD.call();

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

  // TRU REPUTATION TOKEN - TEST CASE: Owner should be able to assign Exec Board Account once
  it('TRU REPUTATION TOKEN - TEST CASE: Owner should be able to assign Exec Board Account once', async function() {

    await truToken.changeBoardAddress(execAccount);
    let execBoard = await truToken.EXEC_BOARD.call();

    assert.equal(execBoard,
      execAccount,
      'Incorrect Exec Board account for TruReputationToken. EXPECTED RESULT: ' + execAccount + ';\
      \nACTUAL RESULT: ' + execBoard);
  });

  // TRU REPUTATION TOKEN - TEST CASE: Only Exec Board account should be able to change Exec Board
  it('TRU REPUTATION TOKEN - TEST CASE: Only Exec Board account should be able to change Exec Board', async function() {

    try {
      await truToken.changeBoardAddress(accountTwo, { from: accountOne });
    } catch (error) {
      const opErr = error.message.search('invalid opcode') >= 0;
      assert(
        opErr,
        'Expected require, got ' + error + ' instead');
    }
    let execBoard = await truToken.EXEC_BOARD.call();

    assert.equal(execBoard,
      execAccount,
      'Incorrect ExecBoard account for TruReputationToken. EXPECTED RESULT:' + execAccount + ';\
      \nACTUAL RESULT: ' + execBoard);
  });

  // TRU REPUTATION TOKEN - TEST CASE: Only Exec Board account should be able to change Exec Board
  it('TRU REPUTATION TOKEN - TEST CASE: Should be unable to assign an empty address as Exec Board', async function() {

    try {
      await truToken.changeBoardAddress(0x0, { from: execAccount });
    } catch (error) {
      const opErr = error.message.search('invalid opcode') >= 0;
      assert(
        opErr,
        'Expected require, got ' + error + ' instead');
    }
    let execBoard = await truToken.EXEC_BOARD.call();

    assert.equal(execBoard,
      execAccount,
      'Incorrect ExecBoard account for TruReputationToken. EXPECTED RESULT:' + execAccount + ';\
          \nACTUAL RESULT: ' + execBoard);
  });

  // TRU REPUTATION TOKEN - TEST CASE: Only Exec Board account should be able to change Exec Board
  it('TRU REPUTATION TOKEN - TEST CASE: Should be unable to assign an self as Exec Board', async function() {

    try {
      await truToken.changeBoardAddress(execAccount, { from: execAccount });
    } catch (error) {
      const opErr = error.message.search('invalid opcode') >= 0;
      assert(
        opErr,
        'Expected require, got ' + error + ' instead');
    }
    let execBoard = await truToken.EXEC_BOARD.call();

    assert.equal(execBoard,
      execAccount,
      'Incorrect ExecBoard account for TruReputationToken. EXPECTED RESULT:' + execAccount + ';\
              \nACTUAL RESULT: ' + execBoard);
  });

  // TRU REPUTATION TOKEN - TEST CASE: Exec Board should be able to assign different Exec Board Account
  it('TRU REPUTATION TOKEN - TEST CASE: Exec Board should be able to assign different Exec Board Account', async function() {

    await truToken.changeBoardAddress(execAccountTwo, { from: execAccount });
    let execBoard = await truToken.EXEC_BOARD.call();

    assert.equal(execBoard,
      execAccountTwo,
      'Incorrect Exec Board account for TruReputationToken. EXPECTED RESULT: ' + execAccountTwo + ';\
        \nACTUAL RESULT: ' + execBoard);
  });

  // TRU REPUTATION TOKEN - TEST CASE: Token should have 0 total supply
  it('TRU REPUTATION TOKEN - TEST CASE: Token should have 0 total supply', async function() {
    let totalSupply = await truToken.totalSupply();

    assert.equal(totalSupply,
      0,
      'Incorrect totalSupply. EXPECTED RESULT: 0;\
      \n ACTUAL RESULT: ' + totalSupply);
  });

  // TRU REPUTATION TOKEN - TEST CASE: mintingFinished should be false after construction
  it('TRU REPUTATION TOKEN - TEST CASE: mintingFinished should be false after construction', async function() {
    let mintingFinished = await truToken.mintingFinished();

    assert.equal(mintingFinished,
      false,
      'mintingFinished has incorrect value after construction. EXPECTED RESULT: false;\
      \nACTUAL RESULT: ' + mintingFinished);
  });

  // TRU REPUTATION TOKEN - TEST CASE: Should fail to deploy new Upgrade Token with no tokens
  it('TRU REPUTATION TOKEN - TEST CASE: Should fail to deploy new Upgrade Token with no tokens', async function() {
    try {
      await TestMigrationTarget.new(truToken.address)
    } catch (error) {
      const opErr = error.message.search('invalid opcode') >= 0;
      assert(
        opErr,
        'Expected require, got ' + error + ' instead ',
      )
    }
  });

  // TRU REPUTATION TOKEN - TEST CASE: Should mint 100 tokens in a supplied address
  it('TRU REPUTATION TOKEN - TEST CASE: Should mint 100 tokens in a supplied address', async function() {
    const result = await truToken.mint(accountOne, mintAmount);
    let balance = await truToken.balanceOf(accountOne);
    let supply = await truToken.totalSupply();

    assert.equal(result.logs[0].event,
      'Mint',
      'Incorrect Event. EXPECTED RESULT: Mint;\
      \nACTUAL RESULT: ' + result.logs[0].event);
    assert.equal(result.logs[0].args.to.valueOf(),
      accountOne,
      'Incorrect address to send new Tokens to. EXPECTED RESULT: ' + accountOne + ';\
      \nACTUAL RESULT: ' + result.logs[0].args.to.valueOf());
    assert.equal(result.logs[0].args.amount.valueOf(),
      mintAmount,
      'Incorrect amount of new Tokens to mint. EXPECTED RESULT: ' + mintAmount + ';\
      \nACTUAL RESULT: ' + result.logs[0].args.amount.valueOf());
    assert.equal(result.logs[1].event,
      'Transfer',
      'Incorrect Event. EXPECTED RESULT: Mint; Transfer Value: ' + result.logs[1].event);
    assert.equal(result.logs[1].args.from.valueOf(),
      0x0,
      'Incorrect address for sending tokens. EXPECTED RESULT: ' + 0x0 + '\
      \nACTUAL RESULT: ' + result.logs[1].args.from.valueOf());
    assert.equal(balance,
      mintAmount,
      'Balance of accounts[0] does not match minted amount. EXPECTED RESULT: ' + mintAmount + ';\
      \nACTUAL RESULT: ' + balance);
    assert.equal(supply,
      mintAmount,
      'Total supply does not match minted amount. EXPECTED RESULT: ' + mintAmount + ';\
      \nACTUAL RESULT: ' + supply);
  });

  // TRU REPUTATION TOKEN - TEST CASE: Should fail to mint after calling finishedMinting
  it('TRU REPUTATION TOKEN - TEST CASE: Should fail to mint after calling finishMinting', async function() {
    await truToken.finishMinting();
    let mFinished = await truToken.mintingFinished();

    assert.equal(mFinished,
      true,
      'Incorrect finishedMinting result. EXPECTED RESULT: true;\
      \nACTUAL RESULT: ' + mFinished);
  });

  // TRU REPUTATION TOKEN - TEST CASE: Token should have correct Upgrade Agent
  it('TRU REPUTATION TOKEN - TEST CASE: Token should have correct Upgrade Agent', async function() {
    let uAgent = await truToken.upgradeMaster.call();

    assert.equal(uAgent,
      accountOne,
      'Constructor has incorrect Upgrade Agent specified. EXPECTED RESULT: ' + accountOne + ';\
      \nACTUAL RESULT: ' + uAgent);
  });

  // TRU REPUTATION TOKEN - TEST CASE: Should deploy new Upgrade Token
  it('TRU REPUTATION TOKEN - TEST CASE: Should deploy new Upgrade Token', async function() {
    tokenMigration = await TestMigrationTarget.new(truToken.address)
    let orgTokenSupply = await tokenMigration.originalSupply.call();
    let isUpgradeAgent = await tokenMigration.isUpgradeAgent.call();

    assert.equal(orgTokenSupply,
      mintAmount,
      'New token supply does not match the original. EXPECTED RESULT: ' + mintAmount + ';\
      \nACTUAL RESULT: ' + orgTokenSupply);
    assert.equal(isUpgradeAgent,
      true,
      'Is not Upgrade Agent. EXPECTED RESULT: true;\
      \nACTUAL RESULT: ' + isUpgradeAgent);
  });

  // TRU REPUTATION TOKEN - TEST CASE: Should fail to set empty UpgradeMaster
  it('TRU REPUTATION TOKEN - TEST CASE: Should fail to set empty UpgradeMaster', async function() {
    try {
      await truToken.setUpgradeMaster(0x0)
    } catch (error) {
      const opErr = error.message.search('invalid opcode') >= 0;
      assert(
        opErr,
        'Expected require, got ' + error + ' instead ',
      )
    }
    let upgradeMaster = await truToken.upgradeMaster.call();

    assert.equal(upgradeMaster,
      accountOne,
      'Is not upgradeMaster. EXPECTED RESULT: ' + accountOne + ';\
        \nACTUAL RESULT: ' + upgradeMaster);
  });

  // TRU REPUTATION TOKEN - TEST CASE: Should fail to set UpgradeMaster if not already master
  it('TRU REPUTATION TOKEN - TEST CASE: Should fail to set UpgradeMaster if not already master', async function() {
    try {
      await truToken.setUpgradeMaster(accountTwo, { from: accountTwo })
    } catch (error) {
      const opErr = error.message.search('invalid opcode') >= 0;
      assert(
        opErr,
        'Expected require, got ' + error + ' instead ',
      )
    }
    let upgradeMaster = await truToken.upgradeMaster.call();

    assert.equal(upgradeMaster,
      accountOne,
      'Is not upgradeMaster. EXPECTED RESULT: ' + accountOne + ';\
        \nACTUAL RESULT: ' + upgradeMaster);
  });

  // TRU REPUTATION TOKEN - TEST CASE: Should set UpgradeMaster if already master
  it('TRU REPUTATION TOKEN - TEST CASE: Should set UpgradeMaster if already master', async function() {
    await truToken.setUpgradeMaster(accountOne, { from: accountOne })
    let upgradeMaster = await truToken.upgradeMaster.call();

    assert.equal(upgradeMaster,
      accountOne,
      'Is not upgradeMaster. EXPECTED RESULT: ' + accountOne + ';\
    \nACTUAL RESULT: ' + upgradeMaster);
  });

  // TRU REPUTATION TOKEN - TEST CASE: Token should be able to set the upgrade
  it('TRU REPUTATION TOKEN - TEST CASE: Token should be able to set the upgrade', async function() {
    let uAgent = await truToken.getUpgradeState.call();

    assert.equal(uAgent.toString(),
      '2',
      'Incorrect result. EXPECTED RESULT: 2;\
      \nACTUAL RESULT: ' + uAgent.toString());
  });

  // TRU REPUTATION TOKEN - TEST CASE: Token should not upgrade without an upgrade agent set
  it('TRU REPUTATION TOKEN - TEST CASE: Token should not upgrade without an upgrade agent set', async function() {
    try {
      await truToken.upgrade(150, { from: accountOne })
    } catch (error) {
      const opErr = error.message.search('invalid opcode') >= 0;
      assert(
        opErr,
        'Expected require, got ' + error + ' instead ',
      )
    }
    let uAgent = await truToken.getUpgradeState.call();
    assert.equal(uAgent.toString(),
      '2',
      'Incorrect result. EXPECTED RESULT: 2;\
      \nACTUAL RESULT: ' + uAgent.toString());
  });

  // TRU REPUTATION TOKEN - TEST CASE: Should not set an upgrade agent with empty address
  it('TRU REPUTATION TOKEN - TEST CASE: Should not set an upgrade agent with empty address', async function() {
    try {
      await truToken.setUpgradeAgent(0x0, { from: accountOne })

    } catch (error) {
      const opErr = error.message.search('invalid opcode') >= 0;
      assert(
        opErr,
        'Expected require, got ' + error + ' instead ',
      )
    }
    let readyState = await truToken.getUpgradeState.call();
    assert.equal(readyState.toString(),
      '2',
      'Incorrect result. EXPECTED RESULT: 2;\
    \nACTUAL RESULT: ' + readyState.toString());
  });

  // TRU REPUTATION TOKEN - TEST CASE: Should not set an upgrade agent with a Token that is not allowed to upgrade
  it('TRU REPUTATION TOKEN - TEST CASE: Should not set an upgrade agent with a Token that is not allowed to upgrade', async function() {
    let emptyToken = await TestEmptyUpgradeToken.new(accountOne);
    try {
      await emptyToken.setUpgradeAgent(tokenMigration.address, { from: accountOne })

    } catch (error) {
      const opErr = error.message.search('invalid opcode') >= 0;
      assert(
        opErr,
        'Expected require, got ' + error + ' instead ',
      )
    }
    let readyState = await emptyToken.getUpgradeState.call();
    assert.equal(readyState.toString(),
      '1',
      'Incorrect result. EXPECTED RESULT: 1;\
  \nACTUAL RESULT: ' + readyState.toString());
  });


  // TRU REPUTATION TOKEN - TEST CASE: Should set an upgrade agent that is not an upgrade agent
  it('TRU REPUTATION TOKEN - TEST CASE: Should set an upgrade agent that is not an upgrade agent', async function() {
    let notMigration = await TestNotUpgradeAgent.new(truToken.address, { from: accountOne })
    let orgTokenSupply = await notMigration.originalSupply.call();
    let isUpgradeAgent = await notMigration.isUpgradeAgent.call();
    try {
      await truToken.setUpgradeAgent(notMigration.address, { from: accountOne })
    } catch (error) {
      const opErr = error.message.search('invalid opcode') >= 0;
      assert(
        opErr,
        'Expected require, got ' + error + ' instead ',
      )
    }
    let readyState = await truToken.getUpgradeState.call();

    assert.equal(readyState.toString(),
      '2',
      'Incorrect result. EXPECTED RESULT: 2;\
      \nACTUAL RESULT: ' + readyState.toString());
  });
  // TRU REPUTATION TOKEN - TEST CASE: Should set an upgrade agent
  it('TRU REPUTATION TOKEN - TEST CASE: Should set an upgrade agent', async function() {
    await truToken.setUpgradeAgent(tokenMigration.address, { from: accountOne })
    let readyState = await truToken.getUpgradeState.call();

    assert.equal(readyState.toString(),
      '3',
      'Incorrect result. EXPECTED RESULT: 3;\
      \nACTUAL RESULT: ' + readyState.toString());
  });

  // TRU REPUTATION TOKEN - TEST CASE: Only Token own can set upgrade
  it('TRU REPUTATION TOKEN - TEST CASE: Only Token owner can set upgrade', async function() {

    try {
      await truToken.setUpgradeAgent(tokenMigration.address, { from: accountTwo })
    } catch (error) {
      const opErr = error.message.search('invalid opcode') >= 0;
      assert(
        opErr,
        'Expected require, got ' + error + ' instead',
      )
    }
    let agent = await truToken.upgradeAgent.call();

    assert.equal(agent,
      tokenMigration.address,
      'Incorrect Upgrade Agent Token Owner. EXPECTED RESULT: ' + tokenMigration.address + ';\
      \nACTUAL RESULT: ' + agent);
  });

  // TRU REPUTATION TOKEN - TEST CASE: Token should not upgrade with an empty upgrade amount
  it('TRU REPUTATION TOKEN - TEST CASE: Token should not upgrade with an empty upgrade amount', async function() {
    try {
      await truToken.upgrade(0, { from: accountOne })
    } catch (error) {
      const opErr = error.message.search('invalid opcode') >= 0;
      assert(
        opErr,
        'Expected require, got ' + error + ' instead ',
      )
    }
    let upgradeState = await truToken.getUpgradeState.call();
    assert.equal(upgradeState.toString(),
      '3',
      'Wrong Upgrade State. EXPECTED RESULT: 3;\
    \nACTUAL RESULT: ' + upgradeState.toString());
  });

  // TRU REPUTATION TOKEN - TEST CASE: Token should not upgrade from an account without tokens
  it('TRU REPUTATION TOKEN - TEST CASE: Token should not upgrade from an account without tokens', async function() {
    try {
      await truToken.upgrade(upgradeAmount, { from: accounts[3] })
    } catch (error) {
      const opErr = error.message.search('invalid opcode') >= 0;
      assert(
        opErr,
        'Expected require, got ' + error + ' instead ',
      )
    }
    let upgradeState = await truToken.getUpgradeState.call();
    assert.equal(upgradeState.toString(),
      '3',
      'Wrong Upgrade State. EXPECTED RESULT: 3;\
    \nACTUAL RESULT: ' + upgradeState.toString());
  });

  // TRU REPUTATION TOKEN - TEST CASE: Token should not upgrade with an amount greater than the supply
  it('TRU REPUTATION TOKEN - TEST CASE: Token should not upgrade with an amount greater than the supply', async function() {
    try {
      await truToken.upgrade(150, { from: accountOne })
    } catch (error) {
      const opErr = error.message.search('invalid opcode') >= 0;
      assert(
        opErr,
        'Expected require, got ' + error + ' instead ',
      )
    }
    let upgradeState = await truToken.getUpgradeState.call();
    assert.equal(upgradeState.toString(),
      '3',
      'Wrong Upgrade State. EXPECTED RESULT: 3;\
    \nACTUAL RESULT: ' + upgradeState.toString());
  });

  // TRU REPUTATION TOKEN - TEST CASE: Should upgrade the token
  it('TRU REPUTATION TOKEN - TEST CASE: Should upgrade the token', async function() {

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

  // TRU REPUTATION TOKEN - TEST CASE: Should only upgrade the specified amount of tokens
  it('TRU REPUTATION TOKEN - TEST CASE: Should not allow an upgrade in parallel to another', async function() {
    try {
      await truToken.upgrade(upgradeAmount)
    } catch (error) {
      const opErr = error.message.search('invalid opcode') >= 0;
      assert(
        opErr,
        'Expected require, got ' + error + ' instead',
      )
    }
    let supply = await truToken.totalSupply.call();

    assert.equal(supply,
      diffBalance,
      'supply does not match upgradeAmount. EXPECTED RESULT: ' + diffBalance + ';\
      \nACTUAL RESULT: ' + supply);
  });

  // TRU REPUTATION TOKEN - TEST CASE: Upgrade Agent should not be changed after the upgrade has started
  it('TRU REPUTATION TOKEN - TEST CASE: Upgrade Agent should not be changed after the upgrade has started', async function() {
    try {
      await truToken.setUpgradeAgent(truToken.address, { from: accountOne });
    } catch (error) {
      const opErr = error.message.search('invalid opcode') >= 0;
      assert(
        opErr,
        'Expected require, got ' + error + ' instead ',
      )
    }
    let owner = await truToken.upgradeAgent.call();
    assert.equal(owner,
      tokenMigration.address,
      'owner address does not match tokenMigration.address. EXPECTED RESULT: ' + tokenMigration.address + ';\
      \nACTUAL RESULT: ' + owner);
  });

  // TRU REPUTATION TOKEN - TEST CASE: TestMigrationTarget should revert on attempt to transfer to it
  it('TRU REPUTATION TOKEN - TEST CASE: TestMigrationTarget should revert on attempt to transfer to it', async function() {
    try {
      await web3.eth.sendTransaction({ 'value': 10, 'from': accountOne, 'to': tokenMigration.address });
    } catch (error) {
      const opErr = error.message.search('invalid opcode') >= 0;
      assert(
        opErr,
        'Expected require, got ' + error + ' instead ',
      )
    }

    let migrationBalance = await truToken.balanceOf(tokenMigration.address);

    assert.equal(migrationBalance,
      0,
      'Migration Balance is not empty. EXPECTED RESULT: 0;\
        \nACTUAL RESULT: ' + migrationBalance);
  });
});