pragma solidity 0.4.18;

/**
  * @title TruAddress
  * @dev Tru Address - Library of helper functions surrounding the Address type in Solidity
  * @author Ian Bray
 */
import "./zeppelin/math/SafeMath.sol";


library TruAddress {
    
    using SafeMath for uint256;
    using SafeMath for uint;

    // @notice Function to validate that a supplied Address is valid 
    // (that is is 20 bytes long and it is not empty or 0x0)
    function isValidAddress(address input) public pure returns (bool) {
        uint addrLength = addressLength(input);
        return ((addrLength == 20) && (input != 0x0));
    }

    // @notice Function convert a Address to a String
    function toString(address input) internal pure returns (string) {
        bytes memory byteArray = new bytes(20);
        for (uint i = 0; i < 20; i++) {
            byteArray[i] = byte(uint8(uint(input) / (2**(8*(19 - i)))));
        }
        return string(byteArray);
    }

    // @notice Function to return the length of a given Address
    function addressLength(address input) internal pure returns (uint) {
        string memory addressStr = toString(input);
        return bytes(addressStr).length;
    }
}