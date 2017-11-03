pragma solidity ^0.4.15;

import '../TruReputationToken.sol';
import './zeppelin/math/SafeMath.sol';
import './Haltable.sol';
import './zeppelin/ownership/Ownable.sol';

/**
  * @title Tru Reputation Token Sale
  * @dev Tru Reputation Protocol pre-ICO Sale contract based on Open Zeppelin and 
  * TokenMarket. This Sale is modified to include the following features:
  * - Crowdsale time period
  * - Discount at 20%
  * @author Ian Bray
 */
contract TruSale is Ownable, Haltable {
  
  using SafeMath for uint256;
  
  // @notice Tru Reputation Token - the token being sold
  TruReputationToken public truToken;

  // @notice Start and end timestamps of Sale window
  uint256 public saleStartTime;
  uint256 public saleEndTime;

  // @notice Number of unique addresses that have purchased from this contract
  uint public purchaserCount = 0;

  // @notice Multisig Address where funds are collected
  address public multiSigWallet;

  // @notice Base Exchange of Tru Reputation Token to ETH - 1 TRU = 1000 TRU per ETH
  uint256 public baseRate = 1000;
  
  // @notice Exchange of Tru Reputation Token to ETH with Sale Bonus of 25% - 1250 TRU per ETH
  uint256 public preSaleRate = 1250;

  // @notice Exchange of Tru Reputation Token to ETH with Sale Bonus of 12.5% - 1100 TRU per ETH
  uint256 public saleRate = 1125;

  // @notice Minimum purchase amount for Sale in Ether (5 Ether) (25 x POWER(10,18))
  uint256 public minimumAmount = 1 * 10**18;

  // @notice Maximum purchase amount for Sale in Ether (30 Ether) (30 x POWER(10,18))
  uint256 public maxAmount = 30 * 10**18;

  // @notice Amount raised in this Sale in Wei
  uint256 public weiRaised;

  // @notice Cap on Sale in Wei (12,000 Ether) (12000 x POWER(10,18))
  uint256 public cap;

  // @notice Variable to mark if the Sale is complete or not
  bool public isCompleted = false;

  // @notice Variable to mark if the Sale is Pre-Sale
  bool public isPreSale = false;

  // @notice Variable to mark if the Sale is a Crowdsale
  bool public isCrowdSale = false;

  // @notice Vairable to mark number of Tokens sold
  uint256 public soldTokens = 0;

  // @notice How much ETH has been invest in this Sale by each participant address
  mapping(address => uint256) public purchasedAmount;

  // @notice How many TRU tokens have been purchased by each Investor in this Sale
  mapping(address => uint256) public tokenAmount;

  // @notice How much TRU has been minted for each purchaser in this Sale
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

  // @notice Sale End Time Changed Event
  // @param _newEnd New time the Sale ends at
  event EndChanged(uint _newEnd);

  // @notice Sale Completed Event
  event Completed();

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

    // If the Total wei is less than the minimum purchase, reject
    require(weiTotal >= minimumAmount);
    // If the Total wei is greater than the maximum stake, purchasers must be on the whitelist
    if (weiTotal > maxAmount) {
      require(purchaserWhiteList[msg.sender]); 
    }
    
    // Prevention to stop circumvention of Maximum Amount without being on the Whitelist
    if (purchasedAmount[msg.sender] != 0 && !purchaserWhiteList[msg.sender]) {
      uint256 totalPurchased = purchasedAmount[msg.sender];
      totalPurchased = totalPurchased.add(weiTotal);
      require(totalPurchased <= maxAmount);
    }

    uint256 tokenRate = baseRate;
    
    if (isPreSale) {
      tokenRate = preSaleRate;
    }
    if (isCrowdSale) {
      tokenRate = saleRate;
    }

    // Multiply Wei x Rate to get Number of Tokens to create (as a 10^18 subunit)
    noOfTokens = weiTotal.mul(tokenRate);
    
    // Add the wei to the running total
    weiRaised = weiRaised.add(weiTotal);

    // If the purchaser address has not purchased already, add them to the list
    if (purchasedAmount[msg.sender] == 0) {
      purchaserCount++;
    }
    soldTokens = soldTokens.add(noOfTokens);

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
    bool afterStart = now >= saleStartTime;
    bool beforeEnd = now <= saleEndTime;
    bool capNotHit = weiRaised.add(msg.value) <= cap;
    return afterStart && beforeEnd && capNotHit;
  }

   // @dev Function to check whether the Sale has ended
   // @returns bool Returns true if the sale has been ended or the Cap has been reached, 
   // false if it has not 
  function hasEnded() public constant returns (bool) {
    bool isCapHit = weiRaised >= cap;
    bool isExpired = now > saleEndTime;
    return isExpired || isCapHit;
  }

  // @dev Contract constructor
  // @param _startTime The Start Time of the Sale as a uint256
  // @param _endTime The End Time of the Sale as a uint256
  // @param _saleWallet The MultiSig wallet address used to hold funds for the Sale
  // @param _token The Tru Reputation Token Contract Address used to mint tokens purchases
  function TruSale(uint256 _startTime, uint256 _endTime, address _token) public {
    // _startTime must be greater than or equal to now
    require(now <= _startTime);

    // _endTime must be greater than or equal to _startTime
    require(_endTime >= _startTime);

    // _token must be valid
    require(_token != 0x0);
    
    // Set Variables
    truToken = TruReputationToken(_token);
    
    address eBoard = truToken.execBoard();
    multiSigWallet = eBoard;
    saleStartTime = _startTime;
    saleEndTime = _endTime;
  }
}