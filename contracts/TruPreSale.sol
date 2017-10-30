pragma solidity ^0.4.15;

import './TruReputationToken.sol';
import './supporting/zeppelin/math/SafeMath.sol';
import './supporting/Haltable.sol';
import './supporting/zeppelin/ownership/Ownable.sol';

/**
  * @title Tru Reputation Token Presale
  * @dev Tru Reputation Protocol pre-ICO Pre-Sale contract based on Open Zeppelin and 
  * TokenMarket. This pre-sale is modified to include the following features:
  * - Crowdsale time period
  * - Discount at 20%
  * - Completion function can be called by owner to close miniting, transfer 
  * token ownership away from pre-sale and back to the owner.
  * @author Ian Bray
 */
contract TruPreSale is Ownable, Haltable {
  
  using SafeMath for uint256;
  
  // @notice Tru Reputation Token - the token being sold
  TruReputationToken public truToken;

  // @notice Start and end timestamps of pre-sale window
  uint256 public preSaleStartTime;
  uint256 public preSaleEndTime;

  // @notice Number of unique addresses that have purchased from this contract
  uint public purchaserCount = 0;

  // @notice Multisig Address where funds are collected
  address public multiSigWallet;

  // @notice Base Exchange of Tru Reputation Token to Wei (1 x POWER(10,15))
  uint256 public baseRate = 1 * 10**15;

  // @notice Exchange of Tru Reputation Token to Wei with Presale Discount of 20% (8 x POWER(10,14))
  uint256 public presaleRate = 8 * 10**14;

  // @notice Minimum purchase amount for Pre Sale in Ether (50 Ether) (50 x POWER(10,18))
  uint256 public minimumAmount = 50 * 10**18;

   // @notice Amount raised in this Presale in Wei
   uint256 public weiRaised;

   // @notice Cap on Pre-Sale in Wei (12,000 Ether) (12000 x POWER(10,18))
   uint256 public cap = 12000 * 10**18;

   // @notice Variable to mark if the Pre-Sale is complete or not
   bool public isCompleted = false;

   // @notice How much ETH has been invest in this Pre-Sale by each participant address
   mapping(address => uint256) public purchasedAmount;

   // @notice How many TRU tokens have been purchased by each Investor in this Pre-Sale
   mapping(address => uint256) public tokenAmount;

   // @notice How much TRU has been minted for each purchaser in this Pre-Sale
   mapping (address => bool) public purchaserWhiteList;

   // @notice Token Purchase logging event
   // @param _purchaser Investor who paid for the tokens
   // @param _recipient Recipient who received the tokens
   // @param _weiValue Amount invested in wei used in the purchase
   // @param _tokenAmount Amount of tokens given in exchange
  event TokenPurchased(address indexed _purchaser, address indexed _recipient, uint256 _weiValue, uint256 _tokenAmount);

  // @notice Whitelist purchaser event
  // @param _purchaserAddress Address added to Whitelist
  // @param _whitelistStatus Status on Whitelist
  event UpdateWhitelist(address _purchaserAddress, bool _whitelistStatus);

  // @notice Pre-Sale End Time Changed Event
  // @param _newEnd New time the Pre-Sale ends at
  event EndChanged(uint _newEnd);

  // @notice Pre-Sale Completed Event
  event Completed();

   
  // @dev Constract constructor
  // @param _startTime The Start Time of the Sale as a uint256
  // @param _endTime The End Time of the Sale as a uint256
  // @param _saleWallet The MultiSig wallet address used to hold funds for the Pre-Sale
  // @param _token The Tru Reputation Token Contract Address used to mint tokens purchases
  function TruPreSale(uint256 _startTime, uint256 _endTime, address _saleWallet, address _token) {
    // _startTime must be greater than or equal to now
    require(now <= _startTime);

    // _endTime must be greater than or equal to _startTime
    require(_endTime >= _startTime);

    // _saleWallet must be valid
    require(_saleWallet != 0x0);

    // _token must be valid
    require(_token != 0x0);

    // Set Variables
    truToken = TruReputationToken(_token);
    multiSigWallet = _saleWallet;
    preSaleStartTime = _startTime;
    preSaleEndTime = _endTime;
  }

  // @dev Fallback function to prevent accepting ether
  /*function() {
    revert();
  }*/

  // @dev Default buy function
  function buy() public payable {
    buyTruTokens(msg.sender);
  }

  
  // @dev Haltable purchase function. Performs all pre-checks before processing investment
  // @param _purchaser Wallet Address of the Investor
  function buyTruTokens(address _purchaser) stopInEmergency payable {
    
    // _purchaser must be valid
    require(_purchaser != 0x0);
    
    // Value must be greater than 0
    require(msg.value != 0);
    
    // Check that the Sale is still open and the Cap has not been reached
    require(checkSaleValid());

    buyTokens(_purchaser);
  }

   // @dev 
  function buyTokens(address _purchaser) internal {
    uint256 weiTotal = msg.value;
    uint256 noOfTokens = 0;

    // If the Total wei is less than the minimum stake, purchasers must be on the whitelist
    if (weiTotal < minimumAmount) {
      require(purchaserWhiteList[msg.sender]); 
    }

    noOfTokens = weiTotal.div(presaleRate);

    // Add the wei to the running total
    weiRaised = weiRaised.add(weiTotal);

    // If the purchaser address has not purchased already, add them to the list
    if (purchasedAmount[msg.sender] == 0) purchaserCount++;

    // Add the purchased amount in Wei to the purchaser in the purchasedAmount hashTable
    purchasedAmount[msg.sender] = purchasedAmount[msg.sender].add(msg.value);

    // Add the purchased amount of TRU to the purchaser in the tokenAmount hashTable
    tokenAmount[msg.sender] = tokenAmount[msg.sender].add(noOfTokens);

    // Mint the Tokens to the Investor
    truToken.mint(_purchaser, noOfTokens);
    TokenPurchased(msg.sender, _purchaser, weiTotal, noOfTokens);

    // Forward ethere to the Fund Collection MultiSig Wallet
    forwardFunds();
  }
   
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
    truToken.finishMinting();
    truToken.transferOwnership(msg.sender);
    truToken.releaseTokenTransfer();
  }

   // @dev Function to forward all raised funds to the Multisig Wallet used to disperse funds
  function forwardFunds() internal {
    multiSigWallet.transfer(msg.value);
  }

   // @dev Function to add or disable an purchaser from KYC Whitelist
  function updateWhitelist(address _purchaser, bool _status) onlyOwner {
    purchaserWhiteList[_purchaser] = _status;
    UpdateWhitelist(_purchaser, _status);
  }

   // @dev Function to validate that the Investment is occuring within the Sale window and before the Cap is reached
   // @returns bool Returns true if the Investment meets the criteria, false if it does not 
  function checkSaleValid() internal constant returns (bool) {
    bool afterStart = now >= preSaleStartTime;
    bool beforeEnd = now <= preSaleEndTime;
    bool capNotHit = weiRaised.add(msg.value) <= cap;
    return afterStart && beforeEnd && capNotHit;
  }

   // @dev Function to check whether the Sale has ended
   // @returns bool Returns true if the sale has been ended or the Cap has been reached, 
   // false if it has not 
  function hasEnded() public constant returns (bool) {
    bool isCapHit = weiRaised >= cap;
    bool isExpired = now > preSaleEndTime;
    return isExpired || isCapHit;
  }

}