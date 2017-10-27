/**
 * This smart contract code is Copyright 2017 TokenMarket Ltd. For more information see https://tokenmarket.net
 *
 * Licensed under the Apache License, version 2.0: https://github.com/TokenMarketNet/ico/blob/master/LICENSE.txt
 *
 * Updated by Tru Ltd October 2017 to comply with Solidity 0.4.15 syntax and Best Practices
 */

pragma solidity ^0.4.15;

import '../supporting/zeppelin/math/SafeMath.sol';
import '../supporting/zeppelin/contracts/MintableToken.sol';
import "../supporting/UpgradeableToken.sol";


/**
 * A sample token that is used as a migration testing target.
 *
 * This is not an actual token, but just a stub used in testing.
 */
contract TestMigrationTarget is StandardToken, UpgradeAgent {

  using SafeMath for uint;

  UpgradeableToken public oldToken;

  uint public originalSupply;

  event PayableHarness(address executor);

  function TestMigrationTarget(UpgradeableToken _oldToken) public {
    oldToken = _oldToken;
    originalSupply = oldToken.totalSupply();
    require(address(oldToken) != 0);
    require(originalSupply != 0);
  }

  function upgradeFrom(address _from, uint256 _value) public {

    // only upgrade from oldToken
    require(msg.sender == address(oldToken)); 

    // Mint new tokens to the migrator
    totalSupply = totalSupply.add(_value);
    balances[_from] = balances[_from].add(_value);
    Transfer(0, _from, _value);

  }

  function() public payable {
    PayableHarness(msg.sender);
    revert();
  }

}