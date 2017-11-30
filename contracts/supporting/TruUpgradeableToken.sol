/**
 * This smart contract code is Copyright 2017 TokenMarket Ltd. For more information see https://tokenmarket.net
 *
 * Licensed under the Apache License, version 2.0: https://github.com/TokenMarketNet/ico/blob/master/LICENSE.txt
 *
 * Updated by Tru Ltd November 2017 to comply with Solidity 0.4.18 syntax and Best Practices
 */

pragma solidity ^0.4.18;


/**
 * A token upgrade mechanism where users can opt-in amount of tokens to the next smart contract revision.
 *
 * First envisioned by Golem and Lunyr projects.
 */

import "./SafeMath.sol";
import "./StandardToken.sol";
import "./TruAddress.sol";
import "./UpgradeAgent.sol";


contract TruUpgradeableToken is StandardToken {

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
     * - NotAllowed: The child contract has not reached a condition where the upgrade can begin
     * - WaitingForAgent: Token allows upgrade, but we don't have a new agent yet
     * - ReadyToUpgrade: The agent is set, but not a single token has been upgraded yet
     * - Upgrading: Upgrade agent is set and the balance holders can upgrade their tokens
     *
    */
    enum UpgradeState {Unknown, NotAllowed, WaitingForAgent, ReadyToUpgrade, Upgrading}

    /**
     * 
    */
    event Upgrade(address indexed _from, address indexed _to, uint256 _value);

    /**
     * New upgrade agent available.
    */
    event UpgradeAgentSet(address agent);

    event NewUpgradedAmount(uint256 originalBalance, uint256 newBalance);
    
    // @notice Modifier to only allow the Upgrade Master to execute the function
    modifier onlyUpgradeMaster() {
        require(msg.sender == upgradeMaster);
        _;
    }

    /**
     * Constructor
    */
    function TruUpgradeableToken(address _upgradeMaster) public {
        require(TruAddress.isValidAddress(_upgradeMaster) == true);
        upgradeMaster = _upgradeMaster;
    }

    /**
     * Allow the token holder to upgrade some of their tokens to a new contract.
    */
    function upgrade(uint256 _value) public {
        UpgradeState state = getUpgradeState();
        require((state == UpgradeState.ReadyToUpgrade) || (state == UpgradeState.Upgrading));
        require(_value > 0);
        require(balances[msg.sender] >= _value);

        uint256 upgradedAmount = totalUpgraded.add(_value);

        uint256 senderBalance = balances[msg.sender];
        uint256 newSenderBalance = senderBalance.sub(_value);      
        uint256 newTotalSupply = totalSupply.sub(_value);
        balances[msg.sender] = newSenderBalance;
        totalSupply = newTotalSupply;        
        NewUpgradedAmount(totalUpgraded, newTotalSupply);
        totalUpgraded = upgradedAmount;
        // Upgrade agent reissues the tokens
        upgradeAgent.upgradeFrom(msg.sender, _value);
        Upgrade(msg.sender, upgradeAgent, _value);
    }

    /**
     * Set an upgrade agent that handles
    */
    function setUpgradeAgent(address _agent) public onlyUpgradeMaster {
        require(TruAddress.isValidAddress(_agent) == true);
        require(canUpgrade());
        require(getUpgradeState() != UpgradeState.Upgrading);

        UpgradeAgent newUAgent = UpgradeAgent(_agent);

        require(newUAgent.isUpgradeAgent());
        require(newUAgent.originalSupply() == totalSupply);

        UpgradeAgentSet(upgradeAgent);

        upgradeAgent = newUAgent;
    }

    /**
     * Get the state of the token upgrade.
    */
    function getUpgradeState() public constant returns(UpgradeState) {
        if (!canUpgrade())
            return UpgradeState.NotAllowed;
        else if (TruAddress.isValidAddress(upgradeAgent) == false)
            return UpgradeState.WaitingForAgent;
        else if (totalUpgraded == 0)
            return UpgradeState.ReadyToUpgrade;
        else 
            return UpgradeState.Upgrading;
    }

    /**
     * Change the upgrade master.
     *
     * This allows us to set a new owner for the upgrade mechanism.
    */
    function setUpgradeMaster(address _master) public onlyUpgradeMaster {
        require(TruAddress.isValidAddress(_master) == true);
        upgradeMaster = _master;
    }

    /**
     * Child contract can enable to provide the condition when the upgrade can begun.
    */
    function canUpgrade() public constant returns(bool) {
        return true;
    }
}
