pragma solidity ^0.4.18;

/**
 * @title Basic token
 * @dev Basic version of StandardToken, with no allowances.
 * @dev Based off of Open-Zeppelin's Basic Token (https://github.com/OpenZeppelin/zeppelin-solidity/blob/master/contracts/token/BasicToken.sol)
 * @dev Updated by Tru Ltd November 2017 to comply with Solidity 0.4.18 syntax and Best Practices
 */
import "./ERC20Basic.sol";
import "../math/SafeMath.sol";
import "../../TruAddress.sol";


contract BasicToken is ERC20Basic {
    using SafeMath for uint256;

    mapping(address => uint256) public balances;

    /**
     * @dev transfer token for a specified address
     * @param _to The address to transfer to.
     * @param _value The amount to be transferred.
    */
    function transfer(address _to, uint256 _value) public returns (bool) {
        require(TruAddress.isValidAddress(_to) == true);

        // SafeMath.sub will throw if there is not enough balance.
        balances[msg.sender] = balances[msg.sender].sub(_value);
        balances[_to] = balances[_to].add(_value);
        Transfer(msg.sender, _to, _value);
        return true;
    }

    /**
     * @dev Gets the balance of the specified address.
     * @param _owner The address to query the the balance of.
     * @return An uint256 representing the amount owned by the passed address.
    */
    function balanceOf(address _owner) public constant returns (uint256 balance) {
        return balances[_owner];
    }
}
