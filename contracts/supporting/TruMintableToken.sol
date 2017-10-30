pragma solidity ^0.4.15;

import './ReleasableToken.sol';

/**
  * @title TruMintableToken
  * @dev Mintable Token - forked from Open-Zeppelin Mintable Token to include TokenMarket Ltd's ReleaseableToken's functionality
  * @dev Based off of Open-Zeppelin's Mintable Token (https://github.com/OpenZeppelin/zeppelin-solidity/blob/master/contracts/token/MintableToken.sol)
  * @dev Based off of TokenMarket's ReleasableToken (https://github.com/TokenMarketNet/ico/blob/master/contracts/ReleasableToken.sol).
  * @dev Updated by Tru Ltd October 2017 to comply with Solidity 0.4.15 syntax and Best Practices
  * @author Ian Bray
 */

 contract TruMintableToken is ReleasableToken {

   event Mint(address indexed _to, uint256 _amount);

   event MintFinished();

   bool public mintingFinished = false;

   modifier canMint() {
    require(!mintingFinished);
    _;
  }

  /**
   * @dev Function to mint tokens
   * @param _to The address that will receive the minted tokens.
   * @param _amount The amount of tokens to mint.
   * @return A boolean that indicates if the operation was successful.
   */
  function mint(address _to, uint256 _amount) onlyOwner canMint public returns (bool) {
    totalSupply = totalSupply.add(_amount);
    balances[_to] = balances[_to].add(_amount);
    Mint(_to, _amount);
    Transfer(0x0, _to, _amount);
    return true;
  }

  /**
   * @dev Function to stop minting new tokens.
   * @return True if the operation was successful.
   */
  function finishMinting() onlyOwner public returns (bool) {
    mintingFinished = true;
    MintFinished();
    return true;
  }

 }