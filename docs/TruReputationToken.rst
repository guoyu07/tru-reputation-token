.. ------------------------------------------------------------------------------------------------
.. TRUREPUTATIONTOKEN
.. ------------------------------------------------------------------------------------------------

.. _tru-reputation-token:

TruReputationToken
===================================

+-----------------------+-------------------------------------------------------------------------+
| **Title:**            | TruReputationToken                                                      |
+-----------------------+-------------------------------------------------------------------------+
| **Description:**      | Smart Contract for the Tru Reputation Token                             |
+-----------------------+-------------------------------------------------------------------------+
| **Author:**           | Ian Bray, Tru Ltd                                                       |
+-----------------------+-------------------------------------------------------------------------+
| **Solidity Version:** | ^0.4.18                                                                 |
+-----------------------+-------------------------------------------------------------------------+
| **Relative Path:**    | ./contracts/TruReputationToken.sol                                      |
+-----------------------+-------------------------------------------------------------------------+
| **License:**          | `Apache 2 License`_                                                     |
+-----------------------+-------------------------------------------------------------------------+
| **Current Version:**  | 0.0.9                                                                   |
+-----------------------+-------------------------------------------------------------------------+


.. ------------------------------------------------------------------------------------------------

.. _tru-reptuation-token-imports:

1. Imports & Dependencies
---------------------------------------

The following imports and dependencies exist for the `TruReputationToken`_ Smart Contract:

+------------------------------+------------------------------------------------------------------+
| **Name**                     | **Description**                                                  |
+------------------------------+------------------------------------------------------------------+
| :ref:`safe-math`             | `Zeppelin Solidity`_ Library to perform mathematics safely       |
|                              | inside Solidity                                                  |
+------------------------------+------------------------------------------------------------------+
| :ref:`tru-address`           | Library of helper functions surrounding the Solidity Address type|
+------------------------------+------------------------------------------------------------------+
| :ref:`tru-mintable-token`    | Smart Contract derived from **MintableToken** by                 |
|                              | `Zeppelin Solidity`_ with additional functionality.              |
+------------------------------+------------------------------------------------------------------+
| :ref:`tru-upgradeable-token` | Smart Contract derived from **UpgradeableToken** by              |
|                              | `Token Market`_ with additional functionality.                   |
+------------------------------+------------------------------------------------------------------+

.. ------------------------------------------------------------------------------------------------

.. _tru-reptuation-token-variables:

2. Variables
---------------------------------------

The following variables exist for the `TruReputationToken`_ Smart Contract:

+-----------------+----------+---------+----------------------------------------------------------+
| **Variable**    | **Type** | **Vis** | **Details**                                              |
+-----------------+----------+---------+----------------------------------------------------------+
| **decimals**    | uint8    | public  | Constant variable for number of decimals token supports  |
|                 |          |         |                                                          |
|                 |          |         | **Default:** *18*                                        |
+-----------------+----------+---------+----------------------------------------------------------+
| **name**        | string   | public  | Constant variable for public name of the token           |
|                 |          |         |                                                          |
|                 |          |         | **Default** *Tru Reputation Token*                       |
+-----------------+----------+---------+----------------------------------------------------------+
| **symbol**      | string   | public  | Constant variable for public symbol of the token         |
|                 |          |         |                                                          |
|                 |          |         | **Default:** *TRU*                                       |
+-----------------+----------+---------+----------------------------------------------------------+
| **execBoard**   | address  | public  | Variable containing address of the Tru Ltd Executive     |
|                 |          |         | Board                                                    |
|                 |          |         |                                                          |
|                 |          |         | **Default:** *0x0*                                       |
+-----------------+----------+---------+----------------------------------------------------------+

.. ------------------------------------------------------------------------------------------------

.. _tru-reptuation-token-enums:

3. Enums
---------------------------------------

There are no enums for the `TruReputationToken`_ Smart Contract.

.. ------------------------------------------------------------------------------------------------

.. _tru-reputation-token-events:

4. Events
---------------------------------------

The following events exist for the `TruReputationToken`_ Solidity Library:

+--------------------------------+----------------------------------------------------------------+
| **Name**                       | **Description**                                                |
+--------------------------------+----------------------------------------------------------------+
| `ChangedExecBoardAddress`_     | Event to notify when the *execBoard* address changes           |
+--------------------------------+----------------------------------------------------------------+

.. ------------------------------------------------------------------------------------------------

.. _tru-reputation-token-changed-exec-board:

ChangedExecBoardAddress
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

+------------------+------------------------------------------------------------------------------+
| **Event Name:**  | ChangedExecBoardAddress                                                      |
+------------------+------------------------------------------------------------------------------+
| **Description:** | Event to notify when the *execBoard* address changes                         |
+------------------+------------------------------------------------------------------------------+

Usage
'''''''''''''''''''''

The `ChangedExecBoardAddress`_ event has the following usage syntax and arguments:

+---+--------------+----------+--------------+----------------------------------------------------+
|   | **Argument** | **Type** | **Indexed?** | **Details**                                        |
+---+--------------+----------+--------------+----------------------------------------------------+
| 1 | oldAddress   | address  | Yes          | Source wallet that the older tokens are sent from  |
+---+--------------+----------+--------------+----------------------------------------------------+
| 2 | newAddress   | address  | Yes          | Address of the destination for upgraded tokens     |
|   |              |          |              | which is hardcoded to the *upgradeAgent* who sends |
|   |              |          |              | them back to the originating address               |
+---+--------------+----------+--------------+----------------------------------------------------+


.. code-block:: c
   :caption: **ChangedExecBoardAddress Usage Example**

    ChangedExecBoardAddress(0x123456789abcdefghijklmnopqrstuvwxyz98765,
                            0x123456789abcdefghijklmnopqrstuvwxyz01234);

.. ------------------------------------------------------------------------------------------------

.. _tru-reputation-token-mappings:

5. Mappings
---------------------------------------

There are no mappings for the `TruReputationToken`_ Smart Contract.

.. ------------------------------------------------------------------------------------------------

.. _tru-upgradeable-token-modifiers:

6. Modifiers
---------------------------------------

The following modifiers exist for the `TruReputationToken`_ Smart Contract:

+----------------------+--------------------------------------------------------------------------+
| **Name**             |  **Description**                                                         |
+----------------------+--------------------------------------------------------------------------+
| `onlyExecBoard`_     | Modifier to check the Executive Board is executing this call             |
+----------------------+--------------------------------------------------------------------------+

.. ------------------------------------------------------------------------------------------------

.. _tru-reputation-token-only-exec-board:

onlyExecBoard
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

+--------------------+----------------------------------------------------------------------------+
| **Modifier Name:** | onlyExecBoard                                                              |
+--------------------+----------------------------------------------------------------------------+
| **Description:**   | Modifier to check the Executive Board is executing this call               |
+--------------------+----------------------------------------------------------------------------+

Code
'''''''''''''''''''''

The code for the `onlyExecBoard`_ modifier is as follows:

.. code-block:: c
    :caption: **onlyExecBoard 0.0.9 Code**

    modifier onlyExecBoard() {
        require(msg.sender == execBoard);
        _;
    }

The `onlyExecBoard`_ function performs the following:

 - Checks that the *msg.sender* matches the *execBoard* variable

.. ------------------------------------------------------------------------------------------------

.. _tru-reputation-token-functions:

7. Functions
---------------------------------------

The following functions exist for the `TruReputationToken`_ Smart Contract:

+-----------------------------------+-------------------------------------------------------------+
| **Name**                          | **Description**                                             |
+-----------------------------------+-------------------------------------------------------------+
| `TruReputationToken Constructor`_ | Constructor for the `TruReputationToken`_ Smart Contract    |
+-----------------------------------+-------------------------------------------------------------+
| `changeBoardAddress`_             | Function to change the *execBoard* variable                 |
+-----------------------------------+-------------------------------------------------------------+
| `canUpgrade`_                     | Override of :ref:`tru-upgradeable-token-can-upgrade`        |
|                                   | function                                                    |
+-----------------------------------+-------------------------------------------------------------+
| `setUpgradeMaster`_               | Override of :ref:`tru-upgradeable-token-set-upgrade-master` |
|                                   | function                                                    |
+-----------------------------------+-------------------------------------------------------------+

.. ------------------------------------------------------------------------------------------------

.. _tru-reputation-token-constructor:

TruReputationToken Constructor
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

+--------------------------+----------------------------------------------------------------------+
| **Function Name:**       | TruReputationToken                                                   |
+--------------------------+----------------------------------------------------------------------+
| **Description:**         | Constructor for the `TruReputationToken`_ Smart Contract             |
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
'''''''''''''''''''''

The code for the `TruReputationToken Constructor`_ function is as follows:

.. code-block:: c
    :caption: **TruReputationToken Constructor 0.0.9 Code**
   
    function TruReputationToken() public TruUpgradeableToken(msg.sender) {
        execBoard = msg.sender;
        ChangedExecBoardAddress(0x0, msg.sender);
    }

The `TruReputationToken Constructor`_ function performs the following:

 - Executes the TruUpgradeableToken constructor as part of its construction.
 - Sets the initial *execBoard* variable to *msg.sender*
 - Fires the `ChangedExecBoardAddress`_ event

Usage
'''''''''''''''''''''

The `TruReputationToken Constructor`_ function has the following usage syntax and arguments:

+---+-----------------+----------+----------------------------------------------------------------+
|   | **Argument**    | **Type** | **Details**                                                    |
+---+-----------------+----------+----------------------------------------------------------------+
| 1 |  _upgradeMaster | address  | Address to be set as the Upgrade Master                        |
+---+-----------------+----------+----------------------------------------------------------------+

.. code-block:: c
   :caption: **TruReputationToken Constructor Usage Example**

    TruReputationToken(0x123456789abcdefghijklmnopqrstuvwxyz98765);

.. ------------------------------------------------------------------------------------------------

.. _tru-reputation-token-change-board-address:

changeBoardAddress
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

+--------------------------+----------------------------------------------------------------------+
| **Function Name:**       | changeBoardAddress                                                   |
+--------------------------+----------------------------------------------------------------------+
| **Description:**         | Function to change the *execBoard* variable                          |
+--------------------------+----------------------------------------------------------------------+
| **Function Type:**       | N/A                                                                  |
+--------------------------+----------------------------------------------------------------------+
| **Function Visibility:** | Public                                                               |
+--------------------------+----------------------------------------------------------------------+
| **Function Modifiers:**  | `onlyExecBoard`_                                                     |
+--------------------------+----------------------------------------------------------------------+
| **Return Type:**         | None                                                                 |
+--------------------------+----------------------------------------------------------------------+
| **Return Details:**      | N/A                                                                  |
+--------------------------+----------------------------------------------------------------------+

Code
'''''''''''''''''''''

The code for the `changeBoardAddress`_ function is as follows:

.. code-block:: c
    :caption: **changeBoardAddress 0.0.9 Code**
   
    function changeBoardAddress(address _newAddress) public onlyExecBoard {
        require(TruAddress.isValidAddress(_newAddress) == true);
        require(_newAddress != execBoard);
        address oldAddress = execBoard;
        execBoard = _newAddress;
        ChangedExecBoardAddress(oldAddress, _newAddress);
    }

The `changeBoardAddress`_ function performs the following:

 - Checks the *_newAddress* argument is a valid Ethereum Address. If not, it will throw
 - Checks the *_newAddress* argument is not the same as the current *execBoard* variable. If it is,
   it will throw;
 - Sets the *execBoard* variable to the *_newAddress* argument.
 - Fires the `ChangedExecBoardAddress`_ event

Usage
'''''''''''''''''''''

The `changeBoardAddress`_ function has the following usage syntax and arguments:

+---+--------------+----------+-------------------------------------------------------------------+
|   | **Argument** | **Type** | **Details**                                                       |
+---+--------------+----------+-------------------------------------------------------------------+
| 1 | _newAddress  | address  | Address to be set as the new Executive Board Address              |
+---+--------------+----------+-------------------------------------------------------------------+

.. code-block:: c
   :caption: **changeBoardAddress Usage Example**

    changeBoardAddress(0x123456789abcdefghijklmnopqrstuvwxyz98765);

.. ------------------------------------------------------------------------------------------------

.. _tru-reputation-token-can-upgrade:

canUpgrade
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

+--------------------------+----------------------------------------------------------------------+
| **Function Name:**       | canUpgrade                                                           |
+--------------------------+----------------------------------------------------------------------+
| **Description:**         | Override of :ref:`tru-upgradeable-token-can-upgrade` function        |
+--------------------------+----------------------------------------------------------------------+
| **Function Type:**       | Constant                                                             |
+--------------------------+----------------------------------------------------------------------+
| **Function Visibility:** | Public                                                               |
+--------------------------+----------------------------------------------------------------------+
| **Function Modifiers:**  | None                                                                 |
+--------------------------+----------------------------------------------------------------------+
| **Return Type:**         | bool                                                                 |
+--------------------------+----------------------------------------------------------------------+
| **Return Details:**      | Returns true if the token is in an upgradeable state                 |
+--------------------------+----------------------------------------------------------------------+

Code
'''''''''''''''''''''

The code for the `canUpgrade`_ override function is as follows:

.. code-block:: c
    :caption: **canUpgrade 0.0.9 Code**
   
    function canUpgrade() public constant returns(bool) {
        return released && super.canUpgrade();
    }

The `canUpgrade`_ function performs the following:

 - If the *released* variable and super.canUpgrade() are true, returns true; otherwise returns false

Usage
'''''''''''''''''''''

The `canUpgrade`_ function has the following usage syntax:

.. code-block:: c
   :caption: **canUpgrade Usage Example**

    canUpgrade();

.. ------------------------------------------------------------------------------------------------

.. _tru-reputation-token-set-upgrade-master:

setUpgradeMaster
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

+--------------------------+----------------------------------------------------------------------+
| **Function Name:**       | setUpgradeMaster                                                     |
+--------------------------+----------------------------------------------------------------------+
| **Description:**         | Override of :ref:`tru-upgradeable-token-set-upgrade-master` function |
+--------------------------+----------------------------------------------------------------------+
| **Function Type:**       | N/A                                                                  |
+--------------------------+----------------------------------------------------------------------+
| **Function Visibility:** | Public                                                               |
+--------------------------+----------------------------------------------------------------------+
| **Function Modifiers:**  | :ref:`ownable-only-owner`                                            |
+--------------------------+----------------------------------------------------------------------+
| **Return Type:**         | bool                                                                 |
+--------------------------+----------------------------------------------------------------------+
| **Return Details:**      | Returns true if the token is in an upgradeable state                 |
+--------------------------+----------------------------------------------------------------------+

Code
'''''''''''''''''''''

The code for the `setUpgradeMaster`_ override function is as follows:

.. code-block:: c
   :caption: **setUpgradeMaster 0.0.9 Code**

    function setUpgradeMaster(address master) public onlyOwner {
        super.setUpgradeMaster(master);
    }

The `setUpgradeMaster`_ function performs the following:

 - Executes the :ref:`tru-upgradeable-token-set-upgrade-master` function with the 
   :ref:`ownable-only-owner` modifier.

Usage
'''''''''''''''''''''

The `setUpgradeMaster`_ function has the following usage syntax:

.. code-block:: c
   :caption: **setUpgradeMaster Usage Example**

    setUpgradeMaster(0x123456789abcdefghijklmnopqrstuvwxyz98765);

.. ------------------------------------------------------------------------------------------------
.. URLs used throughout this page
.. ------------------------------------------------------------------------------------------------

.. _Zeppelin Solidity: https://github.com/OpenZeppelin/zeppelin-solidity
.. _Apache 2 License: https://raw.githubusercontent.com/TruLtd/tru-reputation-token/master/LICENSE
.. _Token Market: https://github.com/TokenMarketNet/ico/

.. ------------------------------------------------------------------------------------------------
.. END OF TRUREPUTATIONTOKEN
.. ------------------------------------------------------------------------------------------------