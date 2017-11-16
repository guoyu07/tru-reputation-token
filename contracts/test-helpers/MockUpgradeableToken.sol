pragma solidity ^0.4.18;
import "../supporting/UpgradeableToken.sol";

contract MockUpgradeableToken is UpgradeableToken {

  string public constant name = "Mock Upgradeable Token";
  string public constant symbol = "MUT";
  uint256 public constant decimals = 18;

  function canUpgrade() public constant returns(bool) {
     return false;
  }

  function MockUpgradeableToken() UpgradeableToken(msg.sender) public {
  }

}