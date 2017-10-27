pragma solidity ^0.4.15;
import '../supporting/UpgradeableToken.sol';

contract TestEmptyUpgradeToken is UpgradeableToken {

  string public constant name = "Test Empty Upgrade Token";
  string public constant symbol = "ETY";
  uint256 public constant decimals = 18;

  function canUpgrade() public constant returns(bool) {
     return false;
  }

  function TestEmptyUpgradeToken() UpgradeableToken(msg.sender) public {
  }

}