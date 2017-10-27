

pragma solidity ^0.4.15;
import './supporting/zeppelin/contracts/MintableToken.sol';
import './supporting/UpgradeableToken.sol';
import './supporting/zeppelin/contracts/BurnableToken.sol';
import './supporting/zeppelin/math/SafeMath.sol';

contract TruReputationToken is MintableToken, UpgradeableToken {
  
  string public constant name = "Tru Reputation Token";
  string public constant symbol = "TRU";
  uint256 public constant decimals = 18;
  address public EXEC_BOARD = 0x0;

  event ChangedExecBoardAddress(address oldAddress, address newAddress, address executor);

  modifier onlyExecBoard() {
    require(msg.sender == EXEC_BOARD);
    _;
  }

  function changeBoardAddress(address _newAddress) public onlyExecBoard {
    address oldAddress = EXEC_BOARD;
    require(_newAddress != 0x0); 
    require(_newAddress != oldAddress);
    EXEC_BOARD = _newAddress;
    ChangedExecBoardAddress(oldAddress, _newAddress, msg.sender);
  }

  // Supply Owner Upgrade Account at Contract Creation
  function TruReputationToken() UpgradeableToken(msg.sender) public {
    EXEC_BOARD = msg.sender;
    ChangedExecBoardAddress(0x0, msg.sender, msg.sender);
  }

}