pragma solidity ^0.4.18;

/**
  * @title Tru Reputation Token
  * @dev Tru Reputation Protocol ERC20 compliant Token
  * @author Ian Bray
*/


import "./supporting/TruAddress.sol";
import "./supporting/TruMintableToken.sol";
import "./supporting/UpgradeableToken.sol";
import "./supporting/zeppelin/math/SafeMath.sol";


contract TruReputationToken is TruMintableToken, UpgradeableToken {
    using SafeMath for uint256;
    using SafeMath for uint;

    // @notice number of decimals for the Token - 18
    uint8 public constant decimals = 18;

    // @notice name of the Token - Tru Reputation Token
    string public constant name = "Tru Reputation Token";

    // @notice Symbol of the Token - TRU
    string public constant symbol = "TRU";

    // @notice Address of the TruAdvisoryBoard Contract
    address public execBoard = 0x0;

    event ChangedExecBoardAddress(address oldAddress, address newAddress, address executor);

    // @notice Modifier to only allow the Tru Advisory Board MultiSig Wallet to execute the function
    modifier onlyExecBoard() {
        require(msg.sender == execBoard);
        _;
    }

    // Constructor for Token
    function TruReputationToken() public UpgradeableToken(msg.sender) {
        execBoard = msg.sender;
        ChangedExecBoardAddress(0x0, msg.sender, msg.sender);
    }

    // @notice Function to change the address of the TruAdvisoryBoard Contract
    // @dev Created to allow upgrades to the TruAdvisoryBoard Contract
    // @dev Can only be executed by the Current TruAdvisoryBoard Contract
    function changeBoardAddress(address _newAddress) public onlyExecBoard {
        require(TruAddress.isValidAddress(_newAddress) == true);
        address oldAddress = execBoard;
        require(_newAddress != oldAddress);
        execBoard = _newAddress;
        ChangedExecBoardAddress(oldAddress, _newAddress, msg.sender);
    }

    function canUpgrade() public constant returns(bool) {
        return released && super.canUpgrade();
    }
}