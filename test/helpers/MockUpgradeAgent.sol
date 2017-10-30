pragma solidity ^0.4.15;

import '../../contracts/supporting/zeppelin/math/SafeMath.sol';
import '../../contracts/supporting/TruMintableToken.sol';
import "../../contracts/supporting/UpgradeableToken.sol";


/**
 * A sample token that is used as a migration testing target.
 *
 * This is not an actual token, but just a stub used in testing.
 */
contract MockUpgradeAgent is StandardToken, UpgradeAgent {

  using SafeMath for uint;

  UpgradeableToken public oldToken;

  uint public originalSupply;

  function isUpgradeAgent() public constant returns (bool) {
    return false;
  }

  function MockUpgradeAgent(UpgradeableToken _oldToken) public {
    oldToken = _oldToken;
    originalSupply = oldToken.totalSupply();
    require(originalSupply != 0);
  }

  function upgradeFrom(address _from, uint256 _value) public {

    // Mint new tokens to the migrator
    totalSupply = totalSupply.add(_value);
    balances[_from] = balances[_from].add(_value);
    Transfer(0, _from, _value);

  }

  function() public payable {
    revert();
  }

}