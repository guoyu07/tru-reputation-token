'use strict';
const BigNumber = web3.BigNumber;
const TruReputationToken = artifacts.require('./TruReputationToken.sol');
const ERC20Basic = artifacts.require('./ERC20Basic.sol');
const MockMigrationTarget = artifacts.require('./helpers/MockMigrationTarget.sol');
const MockUpgradeableToken = artifacts.require('./helpers/MockUpgradeableToken.sol');
const MockUpgradeAgent = artifacts.require('./helpers/MockUpgradeAgent.sol');
import expectThrow from './helpers/expectThrow';
import EVMThrow from './helpers/EVMThrow'

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
  let accountFive = accounts[4];
  let upgradeAmount = 50;
  let diffBalance = mintAmount - upgradeAmount;

  // TEST CASE: Token should have correct symbols and description
  it('TEST CASE: Token should have correct symbols and description', async function() {

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

  // TEST CASE: Owner should be able to assign Exec Board Account once
  it('TEST CASE: Owner should be able to assign Exec Board Account once', async function() {

    await truToken.changeBoardAddress(execAccount);
    let execBoard = await truToken.EXEC_BOARD.call();

    assert.equal(execBoard,
      execAccount,
      'Incorrect Exec Board account for TruReputationToken. EXPECTED RESULT: ' + execAccount + ';\
      \nACTUAL RESULT: ' + execBoard);
  });

  // TEST CASE: Only Exec Board account should be able to change Exec Board
  it('TEST CASE: Only Exec Board account should be able to change Exec Board', async function() {

    await truToken.changeBoardAddress(accountTwo, { from: accountOne }).should.be.rejectedWith(EVMThrow);
    let execBoard = await truToken.EXEC_BOARD.call();

    assert.equal(execBoard,
      execAccount,
      'Incorrect ExecBoard account for TruReputationToken. EXPECTED RESULT:' + execAccount + ';\
      \nACTUAL RESULT: ' + execBoard);
  });

  // TEST CASE: Only Exec Board account should be able to change Exec Board
  it('TEST CASE: Should be unable to assign an empty address as Exec Board', async function() {

    await truToken.changeBoardAddress(0x0, { from: execAccount }).should.be.rejectedWith(EVMThrow);
    let execBoard = await truToken.EXEC_BOARD.call();

    assert.equal(execBoard,
      execAccount,
      'Incorrect ExecBoard account for TruReputationToken. EXPECTED RESULT:' + execAccount + ';\
          \nACTUAL RESULT: ' + execBoard);
  });

  // TEST CASE: Only Exec Board account should be able to change Exec Board
  it('TEST CASE: Should be unable to assign an self as Exec Board', async function() {

    await truToken.changeBoardAddress(execAccount, { from: execAccount }).should.be.rejectedWith(EVMThrow);
    let execBoard = await truToken.EXEC_BOARD.call();

    assert.equal(execBoard,
      execAccount,
      'Incorrect ExecBoard account for TruReputationToken. EXPECTED RESULT:' + execAccount + ';\
              \nACTUAL RESULT: ' + execBoard);
  });

  // TEST CASE: Exec Board should be able to assign different Exec Board Account
  it('TEST CASE: Exec Board should be able to assign different Exec Board Account', async function() {

    await truToken.changeBoardAddress(execAccountTwo, { from: execAccount });
    let execBoard = await truToken.EXEC_BOARD.call();

    assert.equal(execBoard,
      execAccountTwo,
      'Incorrect Exec Board account for TruReputationToken. EXPECTED RESULT: ' + execAccountTwo + ';\
        \nACTUAL RESULT: ' + execBoard);
  });

  // TEST CASE: Token should have 0 total supply
  it('TEST CASE: Token should have 0 total supply', async function() {
    let totalSupply = await truToken.totalSupply();

    assert.equal(totalSupply,
      0,
      'Incorrect totalSupply. EXPECTED RESULT: 0;\
      \n ACTUAL RESULT: ' + totalSupply);
  });

   // TEST CASE: Only Tru Reputation Token owner can set the Release Agent
  it('TEST CASE: Only Tru Reputation Token owner can set the Release Agent', async function(){
    
    await truToken.setReleaseAgent(accounts[3], {from: accounts[3]}).should.be.rejectedWith(EVMThrow);
    let agent = await truToken.releaseAgent.call();

    assert.equal(agent, 
    0x0,
    'Incorrect Release agent set for TruReputationToken. EXPECTED RESULT: 0x0;\
    \nACTUAL RESULT: ' + agent);
  });

  // TEST CASE: Owner can set transferAgent
  it('TEST CASE: Owner can set transferAgent', async function(){
    await truToken.setTransferAgent(execAccount, true, {from: accountOne})

    let transferAgent = await truToken.transferAgents(execAccount);

    assert.equal(transferAgent,
      true,
      'Incorrect Transfer Agent Set. Expected: true. Got ' + transferAgent);
    
    await truToken.setTransferAgent(execAccountTwo, true, {from: accountTwo}).should.be.rejectedWith(EVMThrow);

    let notAgent = await truToken.transferAgents(execAccountTwo);

    assert.equal(notAgent,
      false,
      'Incorrect Transfer Agent Set. Expected: false. Got ' + notAgent);
  });

  // TEST CASE: mintingFinished should be false after construction
  it('TEST CASE: mintingFinished should be false after construction', async function() {
    let mintingFinished = await truToken.mintingFinished();

    assert.equal(mintingFinished,
      false,
      'mintingFinished has incorrect value after construction. EXPECTED RESULT: false;\
      \nACTUAL RESULT: ' + mintingFinished);
  });

  // TEST CASE: Should fail to deploy new Upgrade Token with no tokens
  it('TEST CASE: Should fail to deploy new Upgrade Token with no tokens', async function() {
    await MockMigrationTarget.new(truToken.address).should.be.rejectedWith(EVMThrow);
  });

  // TEST CASE: Should mint 100 tokens in a supplied address
  it('TEST CASE: Should mint 100 tokens in a supplied address', async function() {
    const result = await truToken.mint(accountOne, mintAmount);
    let balance = await truToken.balanceOf(accountOne);
    let supply = await truToken.totalSupply();

    assert.equal(result.logs[0].event,
      'Mint',
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
      mintAmount,
      'Balance of accounts[0] does not match minted amount. EXPECTED RESULT: ' + mintAmount + ';\
      \nACTUAL RESULT: ' + balance);

    assert.equal(supply,
      mintAmount,
      'Total supply does not match minted amount. EXPECTED RESULT: ' + mintAmount + ';\
      \nACTUAL RESULT: ' + supply);
      
  });

  // TEST CASE: Should fail to mint after calling finishedMinting
  it('TEST CASE: Should fail to mint after calling finishMinting', async function() {
    
    await truToken.finishMinting();
    let mFinished = await truToken.mintingFinished();

    assert.equal(mFinished,
      true,
      'Incorrect finishedMinting result. EXPECTED RESULT: true;\
      \nACTUAL RESULT: ' + mFinished);
    await truToken.mint(accountOne, mintAmount).should.be.rejectedWith(EVMThrow);
  });

  // TEST CASE: Token should have correct Upgrade Agent
  it('TEST CASE: Token should have correct Upgrade Agent', async function() {
    let uAgent = await truToken.upgradeMaster.call();

    assert.equal(uAgent,
      accountOne,
      'Constructor has incorrect Upgrade Agent specified. EXPECTED RESULT: ' + accountOne + ';\
      \nACTUAL RESULT: ' + uAgent);
  });

  // TEST CASE: Should deploy new Upgrade Token
  it('TEST CASE: Should deploy new Upgrade Token', async function() {
    tokenMigration = await MockMigrationTarget.new(truToken.address)
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

  // TEST CASE: Should fail to set empty UpgradeMaster
  it('TEST CASE: Should fail to set empty UpgradeMaster', async function() {
    
    await truToken.setUpgradeMaster(0x0).should.be.rejectedWith(EVMThrow);
    let upgradeMaster = await truToken.upgradeMaster.call();

    assert.equal(upgradeMaster,
      accountOne,
      'Is not upgradeMaster. EXPECTED RESULT: ' + accountOne + ';\
        \nACTUAL RESULT: ' + upgradeMaster);
  });

  // TEST CASE: Should fail to set UpgradeMaster if not already master
  it('TEST CASE: Should fail to set UpgradeMaster if not already master', async function() {
    
    await truToken.setUpgradeMaster(accountTwo, { from: accountTwo }).should.be.rejectedWith(EVMThrow);
    let upgradeMaster = await truToken.upgradeMaster.call();

    assert.equal(upgradeMaster,
      accountOne,
      'Is not upgradeMaster. EXPECTED RESULT: ' + accountOne + ';\
        \nACTUAL RESULT: ' + upgradeMaster);
  });

  // TEST CASE: Should set UpgradeMaster if already master
  it('TEST CASE: Should set UpgradeMaster if already master', async function() {
    await truToken.setUpgradeMaster(accountOne, { from: accountOne })
    let upgradeMaster = await truToken.upgradeMaster.call();

    assert.equal(upgradeMaster,
      accountOne,
      'Is not upgradeMaster. EXPECTED RESULT: ' + accountOne + ';\
    \nACTUAL RESULT: ' + upgradeMaster);
  });

  // TEST CASE: Token should be able to set the upgrade
  it('TEST CASE: Token should be able to set the upgrade', async function() {
    let uAgent = await truToken.getUpgradeState.call();

    assert.equal(uAgent.toString(),
      '2',
      'Incorrect result. EXPECTED RESULT: 2;\
      \nACTUAL RESULT: ' + uAgent.toString());
  });

  // TEST CASE: Token should not upgrade without an upgrade agent set
  it('TEST CASE: Token should not upgrade without an upgrade agent set', async function() {
    
    await truToken.upgrade(150, { from: accountOne }).should.be.rejectedWith(EVMThrow);
    let uAgent = await truToken.getUpgradeState.call();
    assert.equal(uAgent.toString(),
      '2',
      'Incorrect result. EXPECTED RESULT: 2;\
      \nACTUAL RESULT: ' + uAgent.toString());
  });

  // TEST CASE: Should not set an upgrade agent with empty address
  it('TEST CASE: Should not set an upgrade agent with empty address', async function() {
    
    await truToken.setUpgradeAgent(0x0, { from: accountOne }).should.be.rejectedWith(EVMThrow);
    let readyState = await truToken.getUpgradeState.call();
    assert.equal(readyState.toString(),
      '2',
      'Incorrect result. EXPECTED RESULT: 2;\
    \nACTUAL RESULT: ' + readyState.toString());
  });

  // TEST CASE: Should not set an upgrade agent with a Token that is not allowed to upgrade
  it('TEST CASE: Should not set an upgrade agent with a Token that is not allowed to upgrade', async function() {
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


  // TEST CASE: Should set an upgrade agent that is not an upgrade agent
  it('TEST CASE: Should set an upgrade agent that is not an upgrade agent', async function() {
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
  // TEST CASE: Should set an upgrade agent
  it('TEST CASE: Should set an upgrade agent', async function() {
    await truToken.setUpgradeAgent(tokenMigration.address, { from: accountOne })
    let readyState = await truToken.getUpgradeState.call();

    assert.equal(readyState.toString(),
      '3',
      'Incorrect result. EXPECTED RESULT: 3;\
      \nACTUAL RESULT: ' + readyState.toString());
  });

  // TEST CASE: Only Token own can set upgrade
  it('TEST CASE: Only Token owner can set upgrade', async function() {

    await truToken.setUpgradeAgent(tokenMigration.address, { from: accountTwo }).should.be.rejectedWith(EVMThrow);
    let agent = await truToken.upgradeAgent.call();

    assert.equal(agent,
      tokenMigration.address,
      'Incorrect Upgrade Agent Token Owner. EXPECTED RESULT: ' + tokenMigration.address + ';\
      \nACTUAL RESULT: ' + agent);
  });

  // TEST CASE: Token should not upgrade with an empty upgrade amount
  it('TEST CASE: Token should not upgrade with an empty upgrade amount', async function() {
    
    await truToken.upgrade(0, { from: accountOne }).should.be.rejectedWith(EVMThrow);
    let upgradeState = await truToken.getUpgradeState.call();
    assert.equal(upgradeState.toString(),
      '3',
      'Wrong Upgrade State. EXPECTED RESULT: 3;\
    \nACTUAL RESULT: ' + upgradeState.toString());
  });

  // TEST CASE: Token should not upgrade from an account without tokens
  it('TEST CASE: Token should not upgrade from an account without tokens', async function() {
    
    await truToken.upgrade(upgradeAmount, { from: accounts[3] }).should.be.rejectedWith(EVMThrow);

    let upgradeState = await truToken.getUpgradeState.call();
    assert.equal(upgradeState.toString(),
      '3',
      'Wrong Upgrade State. EXPECTED RESULT: 3;\
    \nACTUAL RESULT: ' + upgradeState.toString());
  });

  // TEST CASE: Token should not upgrade with an amount greater than the supply
  it('TEST CASE: Token should not upgrade with an amount greater than the supply', async function() {
    
    await truToken.upgrade(150, { from: accountOne }).should.be.rejectedWith(EVMThrow);

    let upgradeState = await truToken.getUpgradeState.call();
    assert.equal(upgradeState.toString(),
      '3',
      'Wrong Upgrade State. EXPECTED RESULT: 3;\
    \nACTUAL RESULT: ' + upgradeState.toString());
  });

  // TEST CASE: Should upgrade the token
  it('TEST CASE: Should upgrade the token', async function() {

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

  // TEST CASE: Should only upgrade the specified amount of tokens
  it('TEST CASE: Should not allow an upgrade in parallel to another', async function() {
    
    await truToken.upgrade(upgradeAmount).should.be.rejectedWith(EVMThrow);

    let supply = await truToken.totalSupply.call();

    assert.equal(supply,
      diffBalance,
      'supply does not match upgradeAmount. EXPECTED RESULT: ' + diffBalance + ';\
      \nACTUAL RESULT: ' + supply);
  });

  // TEST CASE: Upgrade Agent should not be changed after the upgrade has started
  it('TEST CASE: Upgrade Agent should not be changed after the upgrade has started', async function() {
    
    await truToken.setUpgradeAgent(truToken.address, { from: accountOne }).should.be.rejectedWith(EVMThrow);
    
    let owner = await truToken.upgradeAgent.call();
    assert.equal(owner,
      tokenMigration.address,
      'owner address does not match tokenMigration.address. EXPECTED RESULT: ' + tokenMigration.address + ';\
      \nACTUAL RESULT: ' + owner);
  });

  // TEST CASE: MockMigrationTarget should revert on attempt to transfer to it
  it('TEST CASE: MockMigrationTarget should revert on attempt to transfer to it', async function() {

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
});