pragma solidity ^0.4.15;

import './TruReputationToken.sol';
import './supporting/TruSale.sol';
import './supporting/zeppelin/math/SafeMath.sol';
/**
  * @title Tru Reputation Token Crowdsale
  * @dev Tru Reputation Protocol ICO Crowdsale contract based on Open Zeppelin and 
  * TokenMarket. This CrowdSale is modified to include the following features:
  * - Crowdsale time period
  * - Discount at 10%
  * - Completion function can be called by owner to close minting, and enable transferring Tokens
  * @author Ian Bray
*/

contract TruCrowdSale is TruSale {
  
  using SafeMath for uint256;
  
  // @notice Cap on CrowdSale in Wei (Ξ120,000) (120000 x POWER(10,18))
  uint256 public saleCap = 120000 * 10**18;
  uint256 private existingSupply;
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
    poolTokens = poolTokens.sub(existingSupply);

    // Issue poolTokens to multisig wallet
    truToken.mint(multiSigWallet, poolTokens);
    truToken.finishMinting(true, true);
    truToken.transferOwnership(msg.sender);
    truToken.releaseTokenTransfer();
  }

   
  // @dev Contract constructor
  // @param _startTime The Start Time of the Sale as a uint256
  // @param _endTime The End Time of the Sale as a uint256
  // @param _saleWallet The MultiSig wallet address used to hold funds for the CrowdSale
  // @param _token The Tru Reputation Token Contract Address used to mint tokens purchases
  function TruCrowdSale(uint256 _startTime, uint256 _endTime, address _token, uint256 _currentSupply) public TruSale(_startTime, _endTime, _token) {
      
    isPreSale = false;
    isCrowdSale = true;
    cap = saleCap;
    existingSupply = _currentSupply;
  }
}