.. ------------------------------------------------------------------------------------------------
.. TRUUPGRADEABLETOKEN
.. ------------------------------------------------------------------------------------------------

.. _tru-upgradeable-token:

TruUpgradeableToken
---------------------------------------

+-----------------------+-------------------------------------------------------------------------+
| **Title:**            | TruUpgradeableToken                                                     |
+-----------------------+-------------------------------------------------------------------------+
| **Description:**      | Smart Contract derived from `UpgradeableToken`_ by `Token Market`_      |
|                       | with additional functionality for the **TruReputationToken**.           |
+-----------------------+-------------------------------------------------------------------------+
| **Author:**           | Ian Bray, Tru Ltd                                                       |
+-----------------------+-------------------------------------------------------------------------+
| **Solidity Version:** | ^0.4.18                                                                 |
+-----------------------+-------------------------------------------------------------------------+
| **Relative Path:**    | ./contracts/supporting/TruUpgradeableToken.sol                          |
+-----------------------+-------------------------------------------------------------------------+
| **License:**          | `Apache 2 License`_                                                     |
+-----------------------+-------------------------------------------------------------------------+
| **Current Version:**  | 0.0.9                                                                   |
+-----------------------+-------------------------------------------------------------------------+
| **Original Source:**  | `UpgradeableToken`_                                                     |
+-----------------------+-------------------------------------------------------------------------+

.. ------------------------------------------------------------------------------------------------

.. _tru-upgradeable-token-imports:

1. Imports & Dependencies
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The following imports and dependencies exist for the `TruUpgradeableToken`_ Solidity Library:

+------------------------+------------------------------------------------------------------------+
| **Name**               | **Description**                                                        |
+------------------------+------------------------------------------------------------------------+
| :ref:`safe-math`       | `Zeppelin Solidity`_ Library to perform mathematics safely inside      |
|                        | Solidity                                                               |
+------------------------+------------------------------------------------------------------------+
| :ref:`std-token`       | `Zeppelin Solidity`_ Smart Contract for a Standard ERC-20 Token        |
+------------------------+------------------------------------------------------------------------+
| `TruUpgradeableToken`_ | Library of helper functions surrounding the Solidity Address type      |
+------------------------+------------------------------------------------------------------------+
| :ref:`upgrade-agent`   | `Token Market`_ Smart Contract used to facilitate upgrading of tokens  |
+------------------------+------------------------------------------------------------------------+

.. ------------------------------------------------------------------------------------------------

.. _tru-upgradeable-token-variables:

2. Variables
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The following variables exist for the `TruUpgradeableToken`_ Smart Contract:

+----------------+--------------+---------+-------------------------------------------------------+
| **Variable**   | **Type**     | **Vis** | **Details**                                           |
+----------------+--------------+---------+-------------------------------------------------------+
| upgradeMaster  | address      | public  | Variable containing the address of the wallet         |
|                |              |         | designated as the Upgrade Master                      |
+----------------+--------------+---------+-------------------------------------------------------+
| upgradeAgent   | UpgradeAgent | public  | Variable containing the UpgradeAgent Contract Instance|
+----------------+--------------+---------+-------------------------------------------------------+
| totalUpgraded  | uint256      | public  | Variable to track the number of tokens that have been |
|                |              |         | upgraded                                              |
+----------------+--------------+---------+-------------------------------------------------------+

.. ------------------------------------------------------------------------------------------------

.. _tru-upgradeable-token-enums:

3. Enums
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The following enums exist for the `TruUpgradeableToken`_ Solidity Library:

+-----------------+-------------------------------------------------------------------------------+
| **Enum**        | **Description**                                                               |
+-----------------+-------------------------------------------------------------------------------+
| `UpgradeState`_ | Enum of the different states an UpgradeableToken can be in.                   |
+-----------------+-------------------------------------------------------------------------------+

.. ------------------------------------------------------------------------------------------------

.. _tru-upgradeable-token-upgrade-state:

UpgradeState
'''''''''''''''''''''

The following enum states exist for the `UpgradeState`_ enum:

+-----------------+-------------------------------------------------------------------------------+
| **Enum States** | **Detail**                                                                    |
+-----------------+-------------------------------------------------------------------------------+
| Unknown         | Token upgrade is in an Unknown State- fallback state not used                 |
+-----------------+-------------------------------------------------------------------------------+
| NotAllowed      | The child contract has not reached a condition where the upgrade can begin    |
+-----------------+-------------------------------------------------------------------------------+
| WaitingForAgent | Token allows upgrade, but an *upgradeAgent* has not been set                  |
+-----------------+-------------------------------------------------------------------------------+
| ReadyToUpgrade  | The *upgradeAgent* is set, but no tokens have been upgraded yet               |
+-----------------+-------------------------------------------------------------------------------+
| Upgrading       | The *upgradeAgent* is set, and balance holders can upgrade their tokens       |
+-----------------+-------------------------------------------------------------------------------+

.. ------------------------------------------------------------------------------------------------

.. _tru-upgradeable-token-events:

4. Events
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The following events exist for the `TruUpgradeableToken`_ Solidity Library:

+--------------------------------+----------------------------------------------------------------+
| **Name**                       | **Description**                                                |
+--------------------------------+----------------------------------------------------------------+
| :ref:`Upgrade <upgrade-event>` | Event to notify when a token holder upgrades their tokens      |
+--------------------------------+----------------------------------------------------------------+
| `UpgradeAgentSet`_             | Event to notify when an upgradeAgent is set                    |
+--------------------------------+----------------------------------------------------------------+
| `NewUpgradedAmount`_           | Event to notify the new total number of tokens that have been  |
|                                | upgraded                                                       |
+--------------------------------+----------------------------------------------------------------+

.. ------------------------------------------------------------------------------------------------

.. _upgrade-event:

Upgrade
'''''''''''''''''''''

+------------------+------------------------------------------------------------------------------+
| **Event Name:**  | Upgrade                                                                      |
+------------------+------------------------------------------------------------------------------+
| **Description:** | Event to notify when a token holder upgrades their tokens                    |
+------------------+------------------------------------------------------------------------------+

Usage
^^^^^^^^^^^^^^^^^^^^^

The :ref:`Upgrade <upgrade-event>` event has the following usage syntax and arguments:

+---+--------------+----------+--------------+----------------------------------------------------+
|   | **Argument** | **Type** | **Indexed?** | **Details**                                        |
+---+--------------+----------+--------------+----------------------------------------------------+
| 1 |  _from       | address  | Yes          | Source wallet that the older tokens are sent from  |
+---+--------------+----------+--------------+----------------------------------------------------+
| 2 |  _to         | address  | Yes          | Address of the destination for upgraded tokens     |
|   |              |          |              | which is hardcoded to the *upgradeAgent* who sends |
|   |              |          |              | them back to the originating address               |
+---+--------------+----------+--------------+----------------------------------------------------+
| 3 |  _value      | uint256  | No           | Number of tokens to upgrade                        |
+---+--------------+----------+--------------+----------------------------------------------------+

.. code-block:: c
    :caption: **Upgrade Usage Example**

    Upgrade(0x123456789abcdefghijklmnopqrstuvwxyz98765,
            0x123456789abcdefghijklmnopqrstuvwxyz01234, 
            100);

.. ------------------------------------------------------------------------------------------------

.. _tru-upgradeable-token-upgrade-agent-set:

UpgradeAgentSet
'''''''''''''''''''''

+------------------+------------------------------------------------------------------------------+
| **Event Name:**  | UpgradeAgentSet                                                              |
+------------------+------------------------------------------------------------------------------+
| **Description:** | Event to notify when an upgradeAgent is set                                  |
+------------------+------------------------------------------------------------------------------+

Usage
^^^^^^^^^^^^^^^^^^^^^

The `UpgradeAgentSet`_ event has the following usage syntax and arguments:

+---+--------------+----------+--------------+----------------------------------------------------+
|   | **Argument** | **Type** | **Indexed?** | **Details**                                        |
+---+--------------+----------+--------------+----------------------------------------------------+
| 1 |  agent       | address  | No           | Address of new *upgradeAgent*                      |
+---+--------------+----------+--------------+----------------------------------------------------+

.. code-block:: c
    :caption: **UpgradeAgentSet Usage Example**

    UpgradeAgentSet(0x123456789abcdefghijklmnopqrstuvwxyz98765);

.. ------------------------------------------------------------------------------------------------

.. _tru-upgradeable-token-new-upgraded-amount:

NewUpgradedAmount
'''''''''''''''''''''

+------------------+------------------------------------------------------------------------------+
| **Event Name:**  | NewUpgradedAmount                                                            |
+------------------+------------------------------------------------------------------------------+
| **Description:** | Event to notify when an upgradeAgent is set                                  |
+------------------+------------------------------------------------------------------------------+

Usage
^^^^^^^^^^^^^^^^^^^^^

The `NewUpgradedAmount`_ event has the following usage syntax and arguments:

+---+-----------------+----------+--------------+-------------------------------------------------+
|   | **Argument**    | **Type** | **Indexed?** | **Details**                                     |
+---+-----------------+----------+--------------+-------------------------------------------------+
| 1 | originalBalance | uint256  | No           | Balance of Upgrade Tokens before                |
+---+-----------------+----------+--------------+-------------------------------------------------+
| 2 | newBalance      | uint256  | No           | Balance of Upgrade Tokens after                 |
+---+-----------------+----------+--------------+-------------------------------------------------+

.. code-block:: c
    :caption: **NewUpgradedAmount Usage Example**

    NewUpgradedAmount(50, 100);

.. ------------------------------------------------------------------------------------------------

.. _tru-upgradeable-token-mappings:

5. Mappings
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

There are no mappings for the `TruUpgradeableToken`_ Smart Contract.

.. ------------------------------------------------------------------------------------------------

.. _tru-upgradeable-token-modifiers:

6. Modifiers
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The following modifiers exist for the `TruUpgradeableToken`_ Smart Contract:

+----------------------+--------------------------------------------------------------------------+
| **Name**             |  **Description**                                                         |
+----------------------+--------------------------------------------------------------------------+
| `onlyUpgradeMaster`_ | Modifier to check the Upgrade Master is executing this call              |
+----------------------+--------------------------------------------------------------------------+

.. ------------------------------------------------------------------------------------------------

.. _tru-upgradeable-token-only-upgrade-master:

onlyUpgradeMaster
'''''''''''''''''''''

+--------------------+----------------------------------------------------------------------------+
| **Modifier Name:** | onlyUpgradeMaster                                                          |
+--------------------+----------------------------------------------------------------------------+
| **Description:**   | Modifier to check the Upgrade Master is executing this call                |
+--------------------+----------------------------------------------------------------------------+

Code
^^^^^^^^^^^^^^^^^^^^^

The code for the `onlyUpgradeMaster`_ modifier is as follows:

.. code-block:: c
    :caption: **onlyUpgradeMaster 0.0.9 Code**

    modifier onlyUpgradeMaster() {
        require(msg.sender == upgradeMaster);
        _;
    }

The `onlyUpgradeMaster`_ function performs the following:

 - Checks that the *msg.sender* matches the *upgradeMaster* variable

.. ------------------------------------------------------------------------------------------------

.. _tru-upgradeable-token-functions:

7. Functions
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The following functions exist for the `TruUpgradeableToken`_ Smart Contract:

+------------------------------------+------------------------------------------------------------+
| **Name**                           | **Description**                                            |
+------------------------------------+------------------------------------------------------------+
| `TruUpgradeableToken Constructor`_ | Constructor for the `TruUpgradeableToken`_ Smart Contract  |
+------------------------------------+------------------------------------------------------------+
| :ref:`upgrade <upgrade-func>`      | Function to upgrade tokens.                                |
+------------------------------------+------------------------------------------------------------+
| `setUpgradeAgent`_                 | Function to set the *upgradeAgent* variable                |
+------------------------------------+------------------------------------------------------------+
| `getUpgradeState`_                 | Function to get the current `UpgradeState`_ for the token  |
+------------------------------------+------------------------------------------------------------+
| `setUpgradeMaster`_                | Function to change the *upgradeMaster* variable            |
+------------------------------------+------------------------------------------------------------+
| `canUpgrade`_                      | Function to get whether the token can be upgraded          |
+------------------------------------+------------------------------------------------------------+

.. ------------------------------------------------------------------------------------------------

.. _tru-upgradeable-token-constructor:

TruUpgradeableToken Constructor
''''''''''''''''''''''''''''''''

+--------------------------+----------------------------------------------------------------------+
| **Function Name:**       | TruUpgradeableToken                                                  |
+--------------------------+----------------------------------------------------------------------+
| **Description:**         | Constructor for the `TruUpgradeableToken`_ Smart Contract            |
+--------------------------+----------------------------------------------------------------------+
| **Function Type:**       | Constructor                                                          |
+--------------------------+----------------------------------------------------------------------+
| **Function Visibility:** | Public                                                               |
+--------------------------+----------------------------------------------------------------------+
| **Function Modifiers:**  | N/A                                                                  |
+--------------------------+----------------------------------------------------------------------+
| **Return Type:**         | None                                                                 |
+--------------------------+----------------------------------------------------------------------+
| **Return Details:**      | N/A                                                                  |
+--------------------------+----------------------------------------------------------------------+

Code
^^^^^^^^^^^^^^^^^^^^^

The code for the `TruUpgradeableToken Constructor`_ function is as follows:

.. code-block:: c
    :caption: **TruUpgradeableToken Constructor 0.0.9 Code**

    function TruUpgradeableToken(address _upgradeMaster) public {
        require(TruAddress.isValidAddress(_upgradeMaster) == true);
        upgradeMaster = _upgradeMaster;
    }

The `TruUpgradeableToken Constructor`_ function performs the following:

 - Checks the *_upgradeMaster* is a valid Ethereum address.
 - Sets the *upgradeMaster* variable to the *_upgradeMaster* argument value.

Usage
^^^^^^^^^^^^^^^^^^^^^

The `TruUpgradeableToken Constructor`_ function has the following usage syntax and arguments:

+----+--------------------+--------------------+--------------------------------------------------+
|    | **Argument**       | **Type**           | **Details**                                      |
+----+--------------------+--------------------+--------------------------------------------------+
| 1  |  _upgradeMaster    | address            | Address to be set as the Upgrade Master          |
+----+--------------------+-----------------------------------------------------------------------+

.. code-block:: c
   :caption: **TruUpgradeableToken Constructor Usage Example**

    TruUpgradeableToken(0x123456789abcdefghijklmnopqrstuvwxyz98765);

.. ------------------------------------------------------------------------------------------------

.. _upgrade-func:

upgrade
''''''''''''''''''''''''''''''''

+--------------------------+----------------------------------------------------------------------+
| **Function Name:**       | upgrade                                                              |
+--------------------------+----------------------------------------------------------------------+
| **Description:**         | Function to upgrade tokens                                           |
+--------------------------+----------------------------------------------------------------------+
| **Function Type:**       | N/A                                                                  |
+--------------------------+----------------------------------------------------------------------+
| **Function Visibility:** | Public                                                               |
+--------------------------+----------------------------------------------------------------------+
| **Function Modifiers:**  | N/A                                                                  |
+--------------------------+----------------------------------------------------------------------+
| **Return Type:**         | None                                                                 |
+--------------------------+----------------------------------------------------------------------+
| **Return Details:**      | N/A                                                                  |
+--------------------------+----------------------------------------------------------------------+

Code
^^^^^^^^^^^^^^^^^^^^^

The code for the :ref:`upgrade <upgrade-func>` function is as follows:

.. code-block:: c
    :caption: **upgrade 0.0.9 Code**
   
    function upgrade(uint256 value) public {
        UpgradeState state = getUpgradeState();
        require((state == UpgradeState.ReadyToUpgrade) || (state == UpgradeState.Upgrading));
        require(value > 0);
        require(balances[msg.sender] >= value);

        uint256 upgradedAmount = totalUpgraded.add(value);
        assert(upgradedAmount >= value);

        uint256 senderBalance = balances[msg.sender];
        uint256 newSenderBalance = senderBalance.sub(value);      
        uint256 newTotalSupply = totalSupply.sub(value);
        balances[msg.sender] = newSenderBalance;
        totalSupply = newTotalSupply;        
        NewUpgradedAmount(totalUpgraded, newTotalSupply);
        totalUpgraded = upgradedAmount;
        // Upgrade agent reissues the tokens
        upgradeAgent.upgradeFrom(msg.sender, value);
        Upgrade(msg.sender, upgradeAgent, value);
    }

The :ref:`upgrade <upgrade-func>` function performs the following:

 - Checks the *UpgradeState* is either ReadyToUpgrade or Upgrading
 - Checks the upgrade amount *value* is greater than zero
 - Checks that the send has a balance of greater than or equal to the upgrade *value*
 - Adds the *value* to the *totalUpgraded* variable and checks that this new value is equal to or 
   greater than the *value* to be upgraded.
 - Removes the *value* from the senders balance
 - Removes the *value* from the token's totalSupply
 - Fires the *NewUpgradedAmount* event
 - Initiates the Upgrade Agent's upgradeFrom functionality to deliver the *value* in upgraded tokens
   to the sender.
 - Fires the *Upgrade* event

Usage
^^^^^^^^^^^^^^^^^^^^^

The :ref:`upgrade <upgrade-func>` function has the following usage syntax and arguments:

+----+--------------------+--------------------+--------------------------------------------------+
|    | **Argument**       | **Type**           | **Details**                                      |
+----+--------------------+--------------------+--------------------------------------------------+
| 1  |  _value            | uint256            | Amount of tokens to be upgraded                  |
+----+--------------------+-----------------------------------------------------------------------+

.. code-block:: c
   :caption: **upgrade Usage Example**

    upgrade(100);

.. ------------------------------------------------------------------------------------------------

.. _tru-upgradeable-token-set-upgrade-agent:

setUpgradeAgent
''''''''''''''''''''''''''''''''

+--------------------------+----------------------------------------------------------------------+
| **Function Name:**       | setUpgradeAgent                                                      |
+--------------------------+----------------------------------------------------------------------+
| **Description:**         | Function to set the *upgradeAgent* variable                          |
+--------------------------+----------------------------------------------------------------------+
| **Function Type:**       | N/A                                                                  |
+--------------------------+----------------------------------------------------------------------+
| **Function Visibility:** | Public                                                               |
+--------------------------+----------------------------------------------------------------------+
| **Function Modifiers:**  | `onlyUpgradeMaster`_                                                 |
+--------------------------+----------------------------------------------------------------------+
| **Return Type:**         | None                                                                 |
+--------------------------+----------------------------------------------------------------------+
| **Return Details:**      | N/A                                                                  |
+--------------------------+----------------------------------------------------------------------+

Code
^^^^^^^^^^^^^^^^^^^^^

The code for the `setUpgradeAgent`_ function is as follows:

.. code-block:: c
    :caption: **setUpgradeAgent 0.0.9 Code**
   
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

The `setUpgradeAgent`_ function performs the following:

 - Checks the *_agent* address is valid. If not, the function will throw.
 - Checks that the token can upgrade via the `canUpgrade`_ function. If not, the function will 
   throw.
 - Checks that that *UpgradeState* is not *Upgrading* (and therefore in the middle of an upgrade).
   If not, the function will throw.
 - Checks that the specified Upgrade Agent contract is an Upgrade Agent.  If not, the function will
    throw.
 - Checks that the Upgrade Agent's original supply matches the current total supply of the token.
   If not, the function will throw.
 - Fires the `UpgradeAgentSet`_ event.
 - Sets the *upgradeAgent* variable.
 
Usage
^^^^^^^^^^^^^^^^^^^^^

The `setUpgradeAgent`_ function has the following usage syntax and arguments:

+----+--------------------+--------------------+--------------------------------------------------+
|    | **Argument**       | **Type**           | **Details**                                      |
+----+--------------------+--------------------+--------------------------------------------------+
| 1  |  _agent            | address            | Address of the new Upgrade Agent                 |
+----+--------------------+-----------------------------------------------------------------------+

.. code-block:: c
    :caption: **setUpgradeAgent Usage Example**

    setUpgradeAgent(0x123456789abcdefghijklmnopqrstuvwxyz98765);

.. ------------------------------------------------------------------------------------------------

.. _tru-upgradeable-token-get-upgrade-state:

getUpgradeState
''''''''''''''''''''''''''''''''

+--------------------------+----------------------------------------------------------------------+
| **Function Name:**       | getUpgradeState                                                      |
+--------------------------+----------------------------------------------------------------------+
| **Description:**         | Function to get the current *UpgradeState* of the token              |
+--------------------------+----------------------------------------------------------------------+
| **Function Type:**       | Constant                                                             |
+--------------------------+----------------------------------------------------------------------+
| **Function Visibility:** | Public                                                               |
+--------------------------+----------------------------------------------------------------------+
| **Function Modifiers:**  | N/A                                                                  |
+--------------------------+----------------------------------------------------------------------+
| **Return Type:**         | UpgradeState                                                         |
+--------------------------+----------------------------------------------------------------------+
| **Return Details:**      | Returns UpgradeState as a uint (0, 1, 2, 3 or 4)                     |
+--------------------------+----------------------------------------------------------------------+

Code
^^^^^^^^^^^^^^^^^^^^^

The code for the `getUpgradeState`_ function is as follows:

.. code-block:: c
    :caption: **getUpgradeState 0.0.9 Code**

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

The `getUpgradeState`_ function performs the following:

 - the `canUpgrade`_ function to see if it is true. If it is false, returns NotAllowed *UpgradeState* 
 - Checks the *upgradeAgent* address is valid and set. If it is not, returns WaitingForAgent 
   *UpgradeState* 
 - Checks that the *totalUpgraded** is zero. If it is true, return ReadyToUpgrade *UpgradeState*
 - Else return Upgrading *UpgradeState*

Usage
^^^^^^^^^^^^^^^^^^^^^

The `getUpgradeState`_ function has the following usage syntax:

.. code-block:: c
    :caption: **getUpgradeState Usage Example**

    getUpgradeState();

.. ------------------------------------------------------------------------------------------------

.. _tru-upgradeable-token-set-upgrade-master:

setUpgradeMaster
''''''''''''''''''''''''''''''''

+--------------------------+----------------------------------------------------------------------+
| **Function Name:**       | setUpgradeMaster                                                     |
+--------------------------+----------------------------------------------------------------------+
| **Description:**         | Function to change the *upgradeMaster* variable                      |
+--------------------------+----------------------------------------------------------------------+
| **Function Type:**       | N/A                                                                  |
+--------------------------+----------------------------------------------------------------------+
| **Function Visibility:** | Public                                                               |
+--------------------------+----------------------------------------------------------------------+
| **Function Modifiers:**  | `onlyUpgradeMaster`_                                                 |
+--------------------------+----------------------------------------------------------------------+
| **Return Type:**         | UpgradeState                                                         |
+--------------------------+----------------------------------------------------------------------+
| **Return Details:**      | Returns UpgradeState as a uint (0, 1, 2, 3 or 4)                     |
+--------------------------+----------------------------------------------------------------------+

Code
^^^^^^^^^^^^^^^^^^^^^

The code for the `setUpgradeMaster`_ function is as follows:

.. code-block:: c
    :caption: **setUpgradeMaster 0.0.9 Code**

    function setUpgradeMaster(address _master) public onlyUpgradeMaster {
        require(TruAddress.isValidAddress(_master) == true);
        upgradeMaster = _master;
    }

The `setUpgradeMaster`_ function performs the following:

 - Checks the *_master* argument is a valid Ethereum Address. If it is not, it will throw.
 - Sets the *upgradeMaster* variable to the *_master* argument.

Usage
^^^^^^^^^^^^^^^^^^^^^

The `setUpgradeMaster`_ function has the following usage syntax and arguments:

+----+--------------------+--------------------+--------------------------------------------------+
|    | **Argument**       | **Type**           | **Details**                                      |
+----+--------------------+--------------------+--------------------------------------------------+
| 1  |  _master           | address            | Address of the new Upgrade Master                |
+----+--------------------+-----------------------------------------------------------------------+

.. code-block:: c
    :caption: **setUpgradeAgent Usage Example**

    setUpgradeMaster(0x123456789abcdefghijklmnopqrstuvwxyz98765);

.. ------------------------------------------------------------------------------------------------

.. _tru-upgradeable-token-can-upgrade:

canUpgrade
''''''''''''''''''''''''''''''''

+--------------------------+----------------------------------------------------------------------+
| **Function Name:**       | canUpgrade                                                           |
+--------------------------+----------------------------------------------------------------------+
| **Description:**         | Function to get whether the token can be upgraded or not             |
+--------------------------+----------------------------------------------------------------------+
| **Function Type:**       | Constant                                                             |
+--------------------------+----------------------------------------------------------------------+
| **Function Visibility:** | Public                                                               |
+--------------------------+----------------------------------------------------------------------+
| **Function Modifiers:**  | N/A                                                                  |
+--------------------------+----------------------------------------------------------------------+
| **Return Type:**         | bool                                                                 |
+--------------------------+----------------------------------------------------------------------+
| **Return Details:**      | Returns true as a default; customised in child contracts to fit      |
|                          | required conditions                                                  |
+--------------------------+----------------------------------------------------------------------+

Code
^^^^^^^^^^^^^^^^^^^^^

The code for the `canUpgrade`_ function is as follows:

.. code-block:: c
    :caption: **canUpgrade 0.0.9 Code**

    function canUpgrade() public constant returns(bool) {
        return true;
    }

The `canUpgrade`_ function performs the following:

 - returns true. This functionality is overridden in child contracts to provide conditionality for
   this result.

Usage
^^^^^^^^^^^^^^^^^^^^^

The `canUpgrade`_ function has the following usage syntax:

.. code-block:: c
    :caption: **getUpgradeState Usage Example**

    canUpgrade();

.. ------------------------------------------------------------------------------------------------
.. URLs used throughout this page
.. ------------------------------------------------------------------------------------------------

.. _Zeppelin Solidity: https://github.com/OpenZeppelin/zeppelin-solidity
.. _Apache 2 License: https://raw.githubusercontent.com/TruLtd/tru-reputation-token/master/LICENSE
.. _UpgradeableToken: https://raw.githubusercontent.com/TokenMarketNet/ico/master/contracts/UpgradeableToken.sol
.. _Token Market: https://github.com/TokenMarketNet/ico/

.. ------------------------------------------------------------------------------------------------
.. END OF TRUUPGRADEABLETOKEN
.. ------------------------------------------------------------------------------------------------