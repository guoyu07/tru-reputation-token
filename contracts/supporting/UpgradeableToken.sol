/**
 * This smart contract code is Copyright 2017 TokenMarket Ltd. For more information see https://tokenmarket.net
 *
 * Licensed under the Apache License, version 2.0: https://github.com/TokenMarketNet/ico/blob/master/LICENSE.txt
 *
 * Updated by Tru Ltd October 2017 to comply with Solidity 0.4.15 syntax and Best Practices
 */

pragma solidity ^0.4.15;

import "./zeppelin/contracts/ERC20.sol";
import './zeppelin/contracts/StandardToken.sol';
import './zeppelin/math/SafeMath.sol';
import "./UpgradeAgent.sol";


/**
 * A token upgrade mechanism where users can opt-in amount of tokens to the next smart contract revision.
 *
 * First envisioned by Golem and Lunyr projects.
 */
contract UpgradeableToken is StandardToken {

  using SafeMath for uint256;
  using SafeMath for uint;

  /** Contract / person who can set the upgrade path. This can be the same as team multisig wallet, as what it is with its default value. */
  address public upgradeMaster;

  /** The next contract where the tokens will be migrated. */
  UpgradeAgent public upgradeAgent;

  /** How many tokens we have upgraded by now. */
  uint256 public totalUpgraded;

  /**
   * Upgrade states.
   *
   * - NotAllowed: The child contract has not reached a condition where the upgrade can bgun
   * - WaitingForAgent: Token allows upgrade, but we don't have a new agent yet
   * - ReadyToUpgrade: The agent is set, but not a single token has been upgraded yet
   * - Upgrading: Upgrade agent is set and the balance holders can upgrade their tokens
   *
   */
  enum UpgradeState {Unknown, NotAllowed, WaitingForAgent, ReadyToUpgrade, Upgrading}

  /**
   * Somebody has upgraded some of his tokens.
   */
  event Upgrade(address indexed _from, address indexed _to, uint256 _value);

  /**
   * New upgrade agent available.
   */
  event UpgradeAgentSet(address agent);



  event NewUpgradedAmount(uint256 originalBalance, uint256 newBalance);
  /**
   * Do not allow construction without upgrade master set.
   */
  function UpgradeableToken(address _upgradeMaster) public {
    upgradeMaster = _upgradeMaster;
  }

  /**
   * Allow the token holder to upgrade some of their tokens to a new contract.
   */
  function upgrade(uint256 value) public {

      UpgradeState state = getUpgradeState();
      // Require the Upgrade State is either .ReadyToUpgrade or .Upgrading
      require((state == UpgradeState.ReadyToUpgrade) || (state == UpgradeState.Upgrading));
      
      // Validate input value.
      require(value > 0);

      uint256 senderBalance = balances[msg.sender];
      require(senderBalance > 0);
      uint256 newSenderBalance = senderBalance.sub(value);
      assert(newSenderBalance < senderBalance);

      balances[msg.sender] = newSenderBalance;

      // Take tokens out from circulation
      uint256 newTotalSupply = totalSupply.sub(value);
      assert(newTotalSupply < totalSupply);
      totalSupply = newTotalSupply;

      uint256 upgradedAmount = totalUpgraded.add(value);
      assert(upgradedAmount == value);
      NewUpgradedAmount(totalUpgraded, newTotalSupply);
      totalUpgraded = upgradedAmount;

      // Upgrade agent reissues the tokens
      upgradeAgent.upgradeFrom(msg.sender, value);
      Upgrade(msg.sender, upgradeAgent, value);
  }

  /**
   * Set an upgrade agent that handles
   */
  function setUpgradeAgent(address agent) external {

      require(canUpgrade());

      require(agent != 0x0);
      // Only a master can designate the next agent
      require(msg.sender == upgradeMaster);
      
      // Upgrade has already begun for an agent
      require(getUpgradeState() != UpgradeState.Upgrading);

      upgradeAgent = UpgradeAgent(agent);

      // Bad interface
      require(upgradeAgent.isUpgradeAgent());

      // Make sure that token supplies match in source and target
      require(upgradeAgent.originalSupply() == totalSupply);

      UpgradeAgentSet(upgradeAgent);
  }

  /**
   * Get the state of the token upgrade.
   */
  function getUpgradeState() public constant returns(UpgradeState) {
    if(!canUpgrade()) return UpgradeState.NotAllowed;
    else if(address(upgradeAgent) == 0x00) return UpgradeState.WaitingForAgent;
    else if(totalUpgraded == 0) return UpgradeState.ReadyToUpgrade;
    else return UpgradeState.Upgrading;
  }

  /**
   * Change the upgrade master.
   *
   * This allows us to set a new owner for the upgrade mechanism.
   */
  function setUpgradeMaster(address master) public {
      require(master != 0x0);
      require(msg.sender == upgradeMaster);
      upgradeMaster = master;
  }

  /**
   * Child contract can enable to provide the condition when the upgrade can begun.
   */
  function canUpgrade() public constant returns(bool) {
     return true;
  }

}
