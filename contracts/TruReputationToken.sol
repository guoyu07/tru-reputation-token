

pragma solidity ^0.4.15;
import './supporting/TruMintableToken.sol';
import './supporting/UpgradeableToken.sol';
import './supporting/zeppelin/contracts/BurnableToken.sol';
import './supporting/zeppelin/math/SafeMath.sol';

contract TruReputationToken is TruMintableToken, UpgradeableToken {
  using SafeMath for uint256;
  using SafeMath for uint;

  uint8 public constant decimals = 18;
  string public constant name = "Tru Reputation Token";
  string public constant symbol = "TRU";
  address public execBoard = 0x0;

  event ChangedExecBoardAddress(address oldAddress, address newAddress, address executor);

  modifier onlyExecBoard() {
    require(msg.sender == execBoard);
    _;
  }

  function changeBoardAddress(address _newAddress) public onlyExecBoard {
    address oldAddress = execBoard;
    require(_newAddress != 0x0); 
    require(_newAddress != oldAddress);
    execBoard = _newAddress;
    ChangedExecBoardAddress(oldAddress, _newAddress, msg.sender);
  }

  // Supply Owner Upgrade Account at Contract Creation
  function TruReputationToken() UpgradeableToken(msg.sender) public {
    execBoard = msg.sender;
    ChangedExecBoardAddress(0x0, msg.sender, msg.sender);
  }

}