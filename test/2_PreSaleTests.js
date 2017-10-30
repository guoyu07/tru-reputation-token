'use strict';

import {increaseTime, increaseTimeTo, duration} from './helpers/increaseTime'
import latestTime from './helpers/latestTime'
import EVMThrow from './helpers/EVMThrow'
import expectThrow from './helpers/expectThrow'

const TruReputationToken = artifacts.require('./TruReputationToken.sol');
const TruPreSale = artifacts.require('./TruPreSale.sol');
const BigNumber = web3.BigNumber;

contract('TruPreSale', function(accounts){

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

  let tokenSupply;

  let oneEth =  web3.toWei(1, 'ether');;
  let fiftyOneEth =  web3.toWei(51, 'ether');;
  let saleCap = web3.toWei(12000, 'ether');
  
  // Mock Pre-Sale Initialization Parameters
  let _startTime = new Date('2018-01-01T12:00:00Z').getTime();
  let _endTime = new Date('2018-01-01T13:00:00Z').getTime();
  let _msWallet = accounts[0];

  // Second Mock Pre-Sale Initialization Parameters
  let _startTimeTwo = new Date('2018-01-01T14:00:00Z').getTime();
  let _endTimeTwo = new Date('2018-01-01T15:00:00Z').getTime();
  

  // TEST CASE: Cannot deploy TruPreSale with incorrect variables
  it('TEST CASE: Cannot deploy TruPreSale with incorrect variables', async function(){
    
    truToken = await TruReputationToken.new();
    let expiredTS = 1509336360;

    await TruPreSale.new(expiredTS, _endTime, _msWallet, truToken.address).should.be.rejectedWith(EVMThrow);
    await TruPreSale.new(_startTime, expiredTS, _msWallet, truToken.address).should.be.rejectedWith(EVMThrow);
    await TruPreSale.new(_startTime, _endTime, 0x0, truToken.address).should.be.rejectedWith(EVMThrow);
    await TruPreSale.new(_startTime, _endTime, _msWallet, 0x0).should.be.rejectedWith(EVMThrow);

  });
  

  // TEST CASE: TruPreSale and TruReputationToken are deployed
  it('TEST CASE: TruPreSale and TruReputationToken are deployed', async function(){
    psInst = await TruPreSale.new(_startTime, _endTime, _msWallet, truToken.address);
    tokenSupply = await truToken.totalSupply.call();
    psAddress = psInst.address;

    assert.equal(tokenSupply, 
      0, 
      'Incorrect tokenSupply set for TruReputationToken. EXPECTED RESULT: 0; \
      \nACTUAL RESULT: ' + tokenSupply);
  });
  
  // TEST CASE: Fallback function should revert
  it('TEST CASE: Fallback function should revert', async function(){
    try {
      await web3.eth.sendTransaction({from: acctOne, to: psAddress, value: web3.toWei(1, 'ether')})
    } catch (error) {
      const invalidOpcode = error.message.search('invalid opcode') >= 0;
      const outOfGas = error.message.search('out of gas') >= 0;
      assert(
        invalidOpcode || outOfGas,
        "Expected throw, got '" + error + "' instead",
      );
    }
  });

  // TEST CASE: Pre-Sale hard variables are as expected
  it('TEST CASE: Pre-Sale hard variables are as expected', async function(){
    let preSaleRate = await psInst.presaleRate.call();
    let minimumPurchase = await psInst.minimumAmount.call();
    let cap = await psInst.cap.call();

    assert.equal(web3.fromWei(preSaleRate.toNumber(), 'ether'),
      0.0008,
      'Incorrect Pre Sale Rate for TruReputationToken. EXPECTED RESULT: 0.08 Eth to Tru; \
      \nACTUAL RESULT: ' + web3.fromWei(preSaleRate.toNumber(), 'ether') + ' Eth to Tru');

    assert.equal(web3.fromWei(minimumPurchase, 'ether'),
      50,
      'Incorrect Minimum Purchase Amount for TruReputationToken. EXPECTED RESULT: 50; \
      \nACTUAL RESULT: ' + web3.fromWei(minimumPurchase, 'ether'));
    
    assert.equal(web3.fromWei(cap, 'ether'),
      12000,
      'Incorrect Cap for TruReputationToken. EXPECTED RESULT: 12000; \
      \nACTUAL RESULT: ' + web3.fromWei(cap, 'ether'));
  });
  
  // TEST CASE: Set Release Agent for TruReputationToken
  it('TEST CASE: Set Release Agent for TruReputationToken', async function(){
    await truToken.setReleaseAgent(psAddress, {from: acctOne});
    let agent = await truToken.releaseAgent.call();

    assert.equal(agent,
      psAddress,
      'Incorrect Release Agent set for TruReputationToken. EXPECTED RESULT: ' + psAddress + '; \
      \nACTUAL RESULT: ' + agent);
  });

  // TEST CASE: Transfer TruReputationToken ownership to Pre-Sale
  it('TEST CASE: Transfer TruReputationToken ownership to Pre-Sale', async function(){
    await truToken.transferOwnership(psAddress);

    let tokenOwner = await truToken.owner.call();
    let psOwner = await psInst.owner.call();
    assert.equal(tokenOwner, 
      psAddress, 
      'Incorrect owner set for TruReputationToken. EXPECTED RESULT: ' + psAddress + '\
      \nACTUAL RESULT: ' + tokenOwner);

    assert.equal(psOwner, 
      acctOne, 
      'Incorrect owner set for TruPreSale. EXPECTED RESULT: ' + acctOne + '\
      \nACTUAL RESULT: ' + psOwner);
  });

  // TEST CASE: Can Add Purchaser to Purchaser Whitelist
  it('TEST CASE: Can Add Purchaser to Purchaser Whitelist', async function(){
    var wlWatch = psInst.UpdateWhitelist();
    await psInst.updateWhitelist(acctThree, true);
    var watchResult = wlWatch.get();
    var whiteListed = await psInst.purchaserWhiteList(acctThree);

    assert.equal(watchResult.length,
      1,
      'Incorrect Whitelist Event length for TruPreSale. EXPECTED RESULT: 1\
      \nACTUAL RESULT: ' + watchResult.length);
    
    assert.equal(watchResult[0].args._whitelistStatus,
      true,
      'Incorrect status on Whitelist entry for TruPreSale. EXPECTED RESULT: true\
      \nACTUAL RESULT: ' + watchResult[0].args._whitelistStatus);
    
    assert.equal(watchResult[0].args._purchaserAddress,
      acctThree,
      'Incorrect Whitelist entry for TruPreSale. EXPECTED RESULT: ' + acctThree + '\
      \nACTUAL RESULT: ' + watchResult[0].args._purchaserAddress);
    
    assert.equal(whiteListed,
    true,
    'Address is not on Whitelist for TruPreSale. EXPECTED RESULT: true\
      \nACTUAL RESULT: ' + whiteListed);

  });

  // TEST CASE: Can Remove Purchaser from Purchaser Whitelist
  it('TEST CASE: Can Remove Purchaser from Purchaser Whitelist', async function(){
    
    var wlWatch = psInst.UpdateWhitelist();
    await psInst.updateWhitelist(acctThree, false);
    var watchResult = wlWatch.get();
    var notWhiteListed = await psInst.purchaserWhiteList(acctThree);

    assert.equal(watchResult.length,
      1,
      'Incorrect Whitelist Event length for TruPreSale. EXPECTED RESULT: 1\
      \nACTUAL RESULT: ' + watchResult.length);

    assert.equal(watchResult[0].args._whitelistStatus,
      false,
      'Incorrect status on Whitelist entry for TruPreSale. EXPECTED RESULT: false\
      \nACTUAL RESULT: ' + watchResult[0].args._whitelistStatus);

    assert.equal(watchResult[0].args._purchaserAddress,
      acctThree,
      'Incorrect Whitelist entry for TruPreSale. EXPECTED RESULT: ' + acctThree + '\
      \nACTUAL RESULT: ' + watchResult[0].args._purchaserAddress);
  });
  
  // TEST CASE: Cannot purchase before start of Pre-Sale
 it('TEST CASE: Cannot purchase before start of Pre-Sale', async function(){

   await psInst.buy({from: acctTwo, value: oneEth}).should.be.rejectedWith(EVMThrow);

   let fundsRaised = await psInst.weiRaised.call();
   let fundsRaisedEth = web3.fromWei(fundsRaised, 'ether');

   assert.equal(fundsRaisedEth, 
   0, 
   'Incorrect Funds Raised value for TruPreSale. EXPECTED RESULT: 0 ETH\
   \nACTUAL RESULT: ' + fundsRaised + ' ETH');
 });

  // TEST CASE: Cannot purchase below minimum purchase amount if not on Whitelist
  it('TEST CASE: Cannot purchase below minimum purchase amount if not on Whitelist', async function(){
    let duringPreSale = _startTime + duration.seconds(60);
    await increaseTimeTo(duringPreSale);
    await psInst.buy({from: acctTwo, value: oneEth}).should.be.rejectedWith(EVMThrow)
    let fundsRaised = await psInst.weiRaised.call();
    let fundsRaisedEth = web3.fromWei(fundsRaised, 'ether');

    assert.equal(fundsRaisedEth, 
      0, 
      'Incorrect Funds Raised value for TruPreSale. EXPECTED RESULT: 0 Wei\
      \nACTUAL RESULT: ' + fundsRaised + ' Wei');
  });

  // TEST CASE: Can purchase below minimum purchase amount if on Whitelist
  it('TEST CASE: Can purchase below minimum purchase amount if on Whitelist', async function(){
    await psInst.updateWhitelist(acctTwo, true);

    await psInst.buy({from: acctTwo, value: oneEth})
    let fundsRaised = await psInst.weiRaised.call();

    let fundsRaisedEth = web3.fromWei(fundsRaised, 'ether');

    assert.equal(fundsRaisedEth, 
      1, 
      'Incorrect Funds Raised value for TruPreSale. EXPECTED RESULT: 1 ETH\
      \nACTUAL RESULT: ' + fundsRaisedEth + ' ETH');      

    tokenSupply = await truToken.totalSupply.call();

    assert.equal(tokenSupply, 
      1250, 
      'Incorrect Token Supply value for TruPreSale. EXPECTED RESULT: 1250 TRU\
      \nACTUAL RESULT: ' + tokenSupply);
  });

  // TEST CASE: Can halt Pre-Sale in an emergency
  it('TEST CASE: Can halt Pre-Sale in an emergency', async function(){
    await psInst.halt({from: acctOne});
    await psInst.buy({from: acctOne, value: oneEth}).should.be.rejectedWith(EVMThrow);
    let fundsRaised = await psInst.weiRaised.call();

    let fundsRaisedEth = web3.fromWei(fundsRaised, 'ether');
    let haltStatus = await psInst.halted.call();

    assert.equal(haltStatus,
    true,
    'Incorrect Halt Status for TruPreSale. EXPECTED RESULT: true\
     ACTUAL RESULT: ' + haltStatus);

    assert.equal(fundsRaisedEth, 
      1, 
      'Incorrect Funds Raised value for TruPreSale. EXPECTED RESULT: 1 ETH\
      \nACTUAL RESULT: ' + fundsRaisedEth + ' ETH');    


    tokenSupply = await truToken.totalSupply.call()

    assert.equal(tokenSupply, 
      1250, 
      'Incorrect Funds Raised value for TruPreSale. EXPECTED RESULT: 1250 TRU\
      \nACTUAL RESULT: ' + tokenSupply);

    await psInst.unhalt({from: acctOne})
    let haltStatusTwo = await psInst.halted.call();

    assert.equal(haltStatusTwo,
    false,
    'Incorrect Halt Status for TruPreSale. EXPECTED RESULT: false\
     ACTUAL RESULT: ' + haltStatus);
  });

  // TEST CASE: Tokens cannot be transferred before Pre-Sale is finalised
  it('TEST CASE: Tokens cannot be transferred before Pre-Sale is finalised', async function(){
    await truToken.transfer(acctThree, 1250, {from: acctOne}).should.be.rejectedWith(EVMThrow);
    let acctThreeBalance = await truToken.balanceOf(acctThree);

    assert.equal(acctThreeBalance.toNumber(),
    0,
    'Incorrect Balance for Account 3 for TruPreSale. EXPECTED RESULT: 0\
     ACTUAL RESULT: ' + acctThreeBalance.toNumber());
  });

  // TEST CASE: Only nominated Release Agent can make Tokens transferable
  it('TEST CASE: Only nominated Release Agent can make Tokens transferable', async function(){
    // Verify token is not in released state
    let tokensTransferable = await truToken.released.call();

    assert.equal(tokensTransferable,
    false,
    'Incorrect Released State for TruReputationToken. EXPECTED RESULT: false\
    ACTUAL RESULT: ' + tokensTransferable);

    // PreSale Owner cannot release tokens
    await truToken.releaseTokenTransfer({from: acctOne}).should.be.rejectedWith(EVMThrow);

    tokensTransferable = await truToken.released.call();

    assert.equal(tokensTransferable,
    false,
    'Incorrect Released State for TruReputationToken. EXPECTED RESULT: false\
    ACTUAL RESULT: ' + tokensTransferable);
  });

  

  // TEST CASE: Only Token Owner can mint Tokens
  it('TEST CASE: Only Token Owner can mint Tokens', async function(){
    await truToken.mint(psAddress, 20000, {from: acctOne}).should.be.rejectedWith(EVMThrow);

    tokenSupply = await truToken.totalSupply.call();

    assert.equal(tokenSupply.toNumber(),
    1250,
    'Incorrect Total Supply of Token- should not have minted. EXPECTED RESULT: 1250\
    ACTUAL RESULT: ' + tokenSupply.toNumber());
  });

  // TEST CASE: Has correct Purchaser count
  it('TEST CASE: Has correct Purchaser count', async function(){
    let noOfPurchasers = await psInst.purchaserCount.call();
    assert.equal(noOfPurchasers.toNumber(),
    1,
    'Incorrect number of purchasers. EXPECTED RESULT: 1\
    ACTUAL RESULT: ' + noOfPurchasers.toNumber());
  });

  // TEST CASE: Cannot buy more than cap
  it('TEST CASE: Cannot buy more than cap', async function(){
    let preRaisedFunds = await psInst.weiRaised.call();

    let moreThanCap = web3.toWei(13000, 'ether');

    await psInst.buy({from: acctThree, value: moreThanCap}).should.be.rejectedWith(EVMThrow);
    let postRaisedFunds = await psInst.weiRaised.call();

    assert.equal(web3.toWei(postRaisedFunds.toNumber(), 'ether'), 
      web3.toWei(preRaisedFunds.toNumber()),
      'Raised Funds is incorrect. EXPECTED RESULT: ' + web3.toWei(preRaisedFunds.toNumber()) + '; \
      ACTUAL RESULT: ' + web3.toWei(postRaisedFunds.toNumber()));
  });

  // TEST CASE: PreSale owner cannot finalise a Pre-Sale before it ends
  it('TEST CASE: PreSale owner cannot finalise a Pre-Sale before it ends', async function(){
    let isComplete = await psInst.isCompleted.call();

    assert.equal(isComplete,
      false,
      'Incorrect Pre-Sale Completion Status. EXPECTED RESULT: true; \
      ACTUAL RESULT: ' + isComplete);
    
    await psInst.finalise({from: acctOne}).should.be.rejectedWith(EVMThrow);
    
    let isCompleteTwo = await psInst.isCompleted.call();

    assert.equal(isCompleteTwo,
      isComplete,
      'Incorrect Pre-Sale Completion Status. EXPECTED RESULT: ' + isComplete + '; \
      ACTUAL RESULT: ' + isCompleteTwo);    
  });


  // TEST CASE: Cannot buy with invalid address
  it('TEST CASE: Cannot buy with invalid address', async function(){
    let acctSix = acctFive;
    acctSix = 0x0;
    try {
      await psInst.buy({from: acctSix, value: 100});
    } catch (error) {
      const invalidAddress = error.message.search('invalid address') >= 0;
      assert(
        invalidAddress,
        "Expected require, got '" + error + "' instead",
      );
    }

    await psInst.buyTruTokens(acctSix, {from: acctFive, value: 100}).should.be.rejectedWith(EVMThrow);
  });

  // TEST CASE: Cannot buy 0 amount
  it('TEST CASE: Cannot buy 0 amount', async function(){
    await psInst.buy({from: acctThree, value: 0}).should.be.rejectedWith(EVMThrow);
  });

   // TEST CASE: Can buy repeatedly from the same address
  it('TEST CASE: Can buy repeatedly from the same address', async function(){
    let oldSupply = await truToken.totalSupply.call();
    await psInst.buy({from: acctFour, value: fiftyOneEth})
    await psInst.updateWhitelist(acctFour, true);
    await psInst.buy({from: acctFour, value: oneEth})

    let estSupply = oldSupply.toNumber() + 63750 + 1250;
    tokenSupply = await truToken.totalSupply.call();
    let acctFourBal = await truToken.balanceOf(acctFour);

    assert.equal(tokenSupply.toNumber(),
     estSupply,
     'Token Supply is incorrect. EXPECTED RESULT: ' + estSupply + '; \
      ACTUALVALUE: ' + tokenSupply.toNumber());

    assert.equal(acctFourBal.toNumber(),
     65000,
     'Account 4 Balance is incorrect. EXPECTED RESULT: 65000 TRU; \
      ACTUALVALUE: ' + acctFourBal.toNumber());
  });

  // TEST CASE: Can buy up to the cap on the Pre-Sale
  it('TEST CASE: Can buy up to the cap on the Pre-Sale', async function(){
    let raisedFunds = await psInst.weiRaised.call();

    let remainingTokens = saleCap - raisedFunds;
    
    assert.equal(web3.fromWei(raisedFunds.toNumber(), 'ether'), 
      53, 
      'Raised value is not 12000. EXPECTED RESULT: 53 ETH; \
      ACTUALVALUE: ' + web3.fromWei(raisedFunds.toNumber(), 'ether'));
  
    assert.equal(web3.fromWei(remainingTokens, 'ether'),
      11947, 
      'Raised value is not 11948 ETH. EXPECTED RESULT: 11947 ETH; \
      ACTUALVALUE: ' + web3.fromWei(remainingTokens, 'ether'));

    await psInst.buy({from: acctThree, value: remainingTokens});
    raisedFunds = await psInst.weiRaised.call();
    
    let acctTwoBal = await truToken.balanceOf(acctTwo);
    let acctThreeBal = await truToken.balanceOf(acctThree);
    tokenSupply = await truToken.totalSupply.call();

    assert.equal(web3.fromWei(raisedFunds.toNumber(), 'ether'), 
      12000, 
      'Raised value is not 12000. EXPECTED RESULT: 12000 ETH; \
      ACTUALVALUE: ' + raisedFunds.toNumber());

    assert.equal(acctTwoBal.toNumber(),
    1250,
    'Incorrect Balance for Account 2 for TruPreSale. EXPECTED RESULT: 125; \
     ACTUAL RESULT: ' + acctTwoBal.toNumber());

    assert.equal(acctThreeBal.toNumber(),
    14933750,
    'Incorrect Balance for Account 3 for TruPreSale. EXPECTED RESULT: 14933750 TRU; \
     ACTUAL RESULT: ' + acctThreeBal.toNumber() + ' TRU');

    assert.equal(tokenSupply.toNumber(),
    15000000,
    'Incorrect Balance for Token supplu for TruPreSale. EXPECTED RESULT: 15000000 TRU; \
     ACTUAL RESULT: ' + tokenSupply.toNumber() + ' TRU');
  });

  // TEST CASE: Cannot buy once the cap is reached on the Pre-Sale
  it('TEST CASE: Cannot buy once the cap is reached on the Pre-Sale', async function(){
    await psInst.buy({from: acctOne, value: 1}).should.be.rejectedWith(EVMThrow);

    let raisedFunds = await psInst.weiRaised.call();
    tokenSupply = await truToken.totalSupply.call();

    assert.equal(raisedFunds.toNumber(),
      saleCap,
      'Raised does not match cap');
    
    assert.equal(tokenSupply.toNumber(),
      15000000,
      'Total Token Supply is incorrect. EXPECTED RESULT: 15000000; \
      ACTUAL RESULT: ' + tokenSupply.toNumber());
  });

  // TEST CASE: Cannot buy once Pre-Sale has ended
  it('TEST CASE: Cannot buy once Pre-Sale has ended', async function(){
    
    // Setup up second Pre-Sale and Token Instance
    let truTokenTwo = await TruReputationToken.new();
    let psInstTwo = await TruPreSale.new(_startTimeTwo, _endTimeTwo, _msWallet, truTokenTwo.address);
    let psAddressTwo = psInstTwo.address;
    await truTokenTwo.setReleaseAgent(psAddressTwo, {from: acctOne});
    await truTokenTwo.transferOwnership(psAddressTwo, {from: acctOne});
    await psInstTwo.updateWhitelist(acctFour, true);
    let duringPreSale = _startTimeTwo + duration.seconds(60);
    await increaseTimeTo(duringPreSale);
    await psInstTwo.buy({from: acctFour, value: oneEth});
    let acctFourBalance = await truTokenTwo.balanceOf(acctFour);

    assert.equal(acctFourBalance.toNumber(),
      1250,
      'Incorrect in-sale balance for account 4 ' + acctFourBalance.toNumber());
    
    let afterPreSale = _endTimeTwo + duration.seconds(60);
    await increaseTimeTo(afterPreSale);
    let hasEnded = await psInstTwo.hasEnded.call();
    assert.equal(hasEnded,
    true,
    'Incorrect hasEnded() value. EXPECTED RESULT: true; \
      ACTUAL RESULT: ' + hasEnded);
    await psInstTwo.buy({from: acctFour, value: oneEth}).should.be.rejectedWith(EVMThrow);

    let newBalance = await truTokenTwo.balanceOf(acctFour);
    assert.equal(newBalance.toNumber(), 
      1250, 
      'Incorrect Post-Sale balance for account 4. EXPECTED RESULT: 1250; \
      ACTUAL RESULT: ' + newBalance.toNumber());
  });
  
  // TEST CASE: PreSale owner can finalise the Pre-Sale
  it('TEST CASE: PreSale owner can finalise the Pre-Sale', async function(){
    await psInst.finalise({from: acctOne});
    let isComplete = await psInst.isCompleted.call();
    
    assert.equal(isComplete,
      true,
      'Incorrect Post-Sale Completion Status. EXPECTED RESULT: true; \
      ACTUAL RESULT: ' + isComplete);
    let mintingFinished = await truToken.mintingFinished.call();
    let tokenOwner = await truToken.owner.call();
    tokenSupply = await truToken.totalSupply.call();
    let tokenBalance = await truToken.balanceOf(acctOne);

    assert.equal(mintingFinished,
      true,
     'Incorrect Post-Sale Minting Finished Status. EXPECTED RESULT: true; \
      ACTUAL RESULT: ' + mintingFinished);

    assert.equal(tokenOwner,
      acctOne,
     'Incorrect Post-Sale Token Ownership. EXPECTED RESULT: '+ acctOne + '; \
      ACTUAL RESULT: ' + tokenOwner);

    assert.equal(tokenSupply.toNumber(),
      30000000,
     'Incorrect Post-Sale Token Supply size. EXPECTED RESULT: 30,000,000 TRU; \
      ACTUAL RESULT: ' + tokenSupply.toNumber() + ' TRU');
    
    assert.equal(tokenBalance,
      15000000,
     'Incorrect Post-Sale Tru Ltd Token Pool size. EXPECTED RESULT: 15,000,000 TRU; \
      ACTUAL RESULT: ' + tokenBalance + ' TRU');
    
  });

  // TEST CASE: PreSale owner cannot finalise a finalised 
  it('TEST CASE: PreSale owner cannot finalise a finalised Pre-Sale', async function(){
    let isComplete = await psInst.isCompleted.call();

    assert.equal(isComplete,
      true,
      'Incorrect Post-Sale Completion Status. EXPECTED RESULT: true; \
      ACTUAL RESULT: ' + isComplete);
    
    await psInst.finalise({from: acctOne}).should.be.rejectedWith(EVMThrow);
    
    let isCompleteTwo = await psInst.isCompleted.call();

    assert.equal(isCompleteTwo,
      isComplete,
      'Incorrect Post-Sale Completion Status. EXPECTED RESULT: ' + isComplete + '; \
      ACTUAL RESULT: ' + isCompleteTwo);    
  });

  // TEST CASE: Minted TruReputationToken can be transferred
  it('TEST CASE: Minted TruReputationToken can be transferred', async function(){
    let isReleased = await truToken.released.call();
    assert.equal(isReleased,
      true,
      'Incorrect Pre-Sale Release Status. EXPECTED RESULT: true; \
      ACTUAL RESULT: ' + isReleased);
    
    let acctThreeBal = await truToken.balanceOf(acctThree);
    let acctFiveBal = await truToken.balanceOf(acctFive);
    
    await truToken.transfer(acctFive, 10000, {from: acctThree})

    let acctThreeBalTwo = await truToken.balanceOf(acctThree);
    let acctFiveBalTwo = await truToken.balanceOf(acctFive);
    let acctThreeDiff = acctThreeBal - acctThreeBalTwo;
    let acctFiveDiff = acctFiveBalTwo - acctFiveBal;
    let estimatedAcctBal = acctThreeBal - 10000;

    assert.equal(acctFiveBalTwo,
    10000,
    'Balance of Account 5 not as expected. EXPECTED RESULT: 10000 TRU; \
      ACTUAL RESULT: ' + acctFiveBalTwo + ' TRU');

    assert.equal(acctThreeBalTwo,
    estimatedAcctBal,
    'Balance of Account 3 not as expected. EXPECTED RESULT: ' + estimatedAcctBal + ' TRU; \
      ACTUAL RESULT: ' + acctThreeBalTwo + ' TRU');

    assert.equal(acctThreeDiff,
      acctFiveDiff,
      'Tokens did not transfer. EXPECTED RESULT: ' + acctFiveDiff + '; \
      ACTUAL RESULT: ' + acctThreeDiff);    
  });

  // TEST CASE: transferFrom should only operate when approval has been given to the account
  it('TEST CASE: transferFrom should only operate when approval has been given to the account', async function() {
    // transferFrom should succeed with approval
    let approval = await truToken.approve(acctOne, 5000, {from: acctFive});
    await truToken.transferFrom(acctFive, acctThree, 5000, {from: acctOne});

    let acctThreeBal = await truToken.balanceOf(acctThree);
    let acctFiveBal = await truToken.balanceOf(acctFive);

    assert.equal(acctFiveBal,
    5000,
    'Balance of Account 5 not as expected. EXPECTED RESULT: 5000 TRU; \
      ACTUAL RESULT: ' + acctFiveBal + ' TRU');

    // transferFrom should fail without approval
    await truToken.transferFrom(acctFive, acctThree, 5000, {from: acctOne}).should.be.rejectedWith(EVMThrow);

    assert.equal(acctFiveBal,
    5000,
    'Balance of Account 5 not as expected. EXPECTED RESULT: 5000 TRU; \
      ACTUAL RESULT: ' + acctFiveBal + ' TRU');
  });

  // TEST CASE: Should fail to set Release Agent once Pre-Sale completed
  it('TEST CASE: Should fail to set Release Agent once Pre-Sale completed', async function(){
    await truToken.setReleaseAgent(psAddress, {from: acctOne}).should.be.rejectedWith(EVMThrow);
  });

})