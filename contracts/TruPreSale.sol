pragma solidity ^0.4.15;

import './TruReputationToken.sol';
import './supporting/TruSale.sol';
import './supporting/zeppelin/math/SafeMath.sol';
/**
  * @title Tru Reputation Token Presale
  * @dev Tru Reputation Protocol pre-ICO Pre-Sale contract based on Open Zeppelin and 
  * TokenMarket. This pre-sale is modified to include the following features:
  * - Crowdsale time period
  * - Discount at 20%
  * @author Ian Bray
*/
contract TruPreSale is TruSale {
  
  using SafeMath for uint256;

  // @notice Cap on CrowdSale in Wei (Ξ12,000) (12,000 x POWER(10,18))
  uint256 public preSaleCap = 12000 * 10**18;

  // @dev Internal Function to finalise the Presale in accordance with the Pre-ICO terms
  function finalise() onlyOwner {
    require(!isCompleted);
    require(hasEnded());

    completion();
    Completed();

    isCompleted = true;
  }

  // @dev Function to complete Presale. Doubles the sold amount and transfers it to the  Multisig wallet
  function completion() internal {
     
    // Double sold pool to allocate to Tru Resource Pools
    uint256 poolTokens = truToken.totalSupply();

    // Issue poolTokens to multisig wallet
    truToken.mint(multiSigWallet, poolTokens);
    truToken.finishMinting(true, false);
    truToken.transferOwnership(msg.sender);
  }

  // @dev Contract constructor
  // @param _startTime The Start Time of the Sale as a uint256
  // @param _endTime The End Time of the Sale as a uint256
  // @param _saleWallet The MultiSig wallet address used to hold funds for the Pre-Sale
  // @param _token The Tru Reputation Token Contract Address used to mint tokens purchases
  function TruPreSale(uint256 _startTime, uint256 _endTime, address _token) public TruSale(_startTime, _endTime, _token) {
  
    isPreSale = true;
    isCrowdSale = false;
    cap = preSaleCap;
    
  }
}