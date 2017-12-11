.. ------------------------------------------------------------------------------------------------
.. BASICTOKEN
.. ------------------------------------------------------------------------------------------------

.. _basic-token:

BasicToken
---------------------------------------

+-----------------------+-------------------------------------------------------------------------+
| **Title:**            | BasicToken                                                              |
+-----------------------+-------------------------------------------------------------------------+
| **Description:**      | `Zeppelin Solidity`_ Smart Contract that implements a Basic form of the |
|                       | ERC-20 standard without allowances, approvals, or transferFrom          |
+-----------------------+-------------------------------------------------------------------------+
| **Author:**           | Smart Contract Solutions, Inc.                                          |
+-----------------------+-------------------------------------------------------------------------+
| **Solidity Version:** | ^0.4.18                                                                 |
+-----------------------+-------------------------------------------------------------------------+
| **Relative Path:**    | :file:`./contracts/supporting/BasicToken.sol`                           |
+-----------------------+-------------------------------------------------------------------------+
| **License:**          | `MIT License`_                                                          |
+-----------------------+-------------------------------------------------------------------------+
| **Current Version:**  | 1.4.0                                                                   |
+-----------------------+-------------------------------------------------------------------------+
| **Original Source:**  | `BasicToken Source`_                                                    |
+-----------------------+-------------------------------------------------------------------------+

.. ------------------------------------------------------------------------------------------------

.. _basic-token-imports:

1. Imports & Dependencies
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The following imports and dependencies exist for the `BasicToken`_ Smart Contract :

+--------------------+----------------------------------------------------------------------------+
| **Name**           | **Description**                                                            |
+--------------------+----------------------------------------------------------------------------+
| :ref:`erc20-basic` | `Zeppelin Solidity`_ Smart Contract for a Basic ERC-20 Compliance          |
+--------------------+----------------------------------------------------------------------------+
| :ref:`safe-math`   | `Zeppelin Solidity`_ Library to perform mathematics safely inside Solidity |
+--------------------+----------------------------------------------------------------------------+

.. ------------------------------------------------------------------------------------------------

.. _basic-token-variables:

2. Variables
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

There are no variables for the `BasicToken`_ Smart Contract.

.. ------------------------------------------------------------------------------------------------

.. _basic-token-enums:

3. Enums
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

There are no enums for the `BasicToken`_ Smart Contract.

.. ------------------------------------------------------------------------------------------------

.. _basic-token-events:

4. Events
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

There are no events for the `BasicToken`_ Smart Contract.

.. ------------------------------------------------------------------------------------------------

.. _basic-token-mappings:

5. Mappings
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The following mappings exist for the `BasicToken`_ Smart Contract:

+----------+--------------------+-----------------------------------------------------------------+
| **Name** |  **Mapping Type**  | **Description**                                                 |
+----------+--------------------+-----------------------------------------------------------------+
| balances | address => uint256 | Mapping to track token balance of an address                    |
+----------+--------------------+-----------------------------------------------------------------+

.. ------------------------------------------------------------------------------------------------

.. _basic-token-modifiers:

6. Modifiers
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

There are no modifiers for the `BasicToken`_ Smart Contract.

.. ------------------------------------------------------------------------------------------------

.. _basic-token-functions:

7. Functions
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The following functions exist for the `BasicToken`_ Smart Contract:

+--------------+----------------------------------------------------------------------------------+
| **Name**     | **Description**                                                                  |
+--------------+----------------------------------------------------------------------------------+
| `transfer`_  | Function to transfer tokens.                                                     |
+--------------+----------------------------------------------------------------------------------+
| `balanceOf`_ | Function to get the token balance of a given address                             |
+--------------+----------------------------------------------------------------------------------+

.. ------------------------------------------------------------------------------------------------

.. _basic-token-transfer:

transfer
''''''''''''''''''''''''''''''''

+--------------------------+----------------------------------------------------------------------+
| **Function Name:**       | transfer                                                             |
+--------------------------+----------------------------------------------------------------------+
| **Description:**         | Function to transfer tokens                                          |
+--------------------------+----------------------------------------------------------------------+
| **Function Type:**       | N/A                                                                  |
+--------------------------+----------------------------------------------------------------------+
| **Function Visibility:** | Public                                                               |
+--------------------------+----------------------------------------------------------------------+
| **Function Modifiers:**  | N/A                                                                  |
+--------------------------+----------------------------------------------------------------------+
| **Return Type:**         | bool                                                                 |
+--------------------------+----------------------------------------------------------------------+
| **Return Details:**      | returns true upon successful transfer                                |
+--------------------------+----------------------------------------------------------------------+

Code
^^^^^^^^^^^^^^^^^^^^^

The code for the `transfer`_ function is as follows:

.. code-block:: c
   :caption: **transfer 1.4.0 Code**
   
    function transfer(address _to, uint256 _value) public returns (bool) {
        require(_to != address(0));
        require(_value <= balances[msg.sender]);

        // SafeMath.sub will throw if there is not enough balance.
        balances[msg.sender] = balances[msg.sender].sub(_value);
        balances[_to] = balances[_to].add(_value);
        Transfer(msg.sender, _to, _value);
        return true;
    }

The `transfer`_ function performs the following:

 - Checks the *_to* argument is a valid Ethereum address. If not, it will throw.
 - Checks that the *_value* argument is less than or equal to the *msg.sender* token balance. If 
   not, it will throw
 - Removes the *_value* from the *msg.sender* token balance. If the balance is insufficient, it 
   will throw
 - Adds the *_value* to the *_to* token balance.
 - Fires the :ref:`erc20-basic-transfer-event` event
 - Returns true

Usage
^^^^^^^^^^^^^^^^^^^^^

The `transfer`_ function has the following usage syntax and arguments:

+----+--------------+----------+------------------------------------------------------------------+
|    | **Argument** | **Type** | **Details**                                                      |
+----+--------------+----------+------------------------------------------------------------------+
| 1  | _to          | address  | Address to be transfer tokens to                                 |
+----+--------------+----------+------------------------------------------------------------------+
| 1  | _value       | uint256  | Amount of tokens to transfer                                     |
+----+--------------+----------+------------------------------------------------------------------+

.. code-block:: c
   :caption: **transfer Usage Example**

      transfer(0x123456789abcdefghijklmnopqrstuvwxyz98765, 100);

.. ------------------------------------------------------------------------------------------------

.. _basic-token-balanceOf:

balanceOf
''''''''''''''''''''''''''''''''

+--------------------------+----------------------------------------------------------------------+
| **Function Name:**       | balanceOf                                                            |
+--------------------------+----------------------------------------------------------------------+
| **Description:**         | Function to get the token balance of an address                      |
+--------------------------+----------------------------------------------------------------------+
| **Function Type:**       | View                                                                 |
+--------------------------+----------------------------------------------------------------------+
| **Function Visibility:** | Public                                                               |
+--------------------------+----------------------------------------------------------------------+
| **Function Modifiers:**  | N/A                                                                  |
+--------------------------+----------------------------------------------------------------------+
| **Return Type:**         | uint256                                                              |
+--------------------------+----------------------------------------------------------------------+
| **Return Details:**      | returns token balance of address                                     |
+--------------------------+----------------------------------------------------------------------+

Code
^^^^^^^^^^^^^^^^^^^^^

The code for the `balanceOf`_ function is as follows:

.. code-block:: c
   :caption: **balanceOf 1.4.0 Code**

    function balanceOf(address _owner) public view returns (uint256 balance) {
        return balances[_owner];
    }

The `balanceOf`_ function performs the following:

 - returns the balance of the supplied *_owner* address

Usage
^^^^^^^^^^^^^^^^^^^^^

The `balanceOf`_ function has the following usage syntax and arguments:

+----+--------------+----------+------------------------------------------------------------------+
|    | **Argument** | **Type** | **Details**                                                      |
+----+--------------+----------+------------------------------------------------------------------+
| 1  | _owner       | address  | Address check the token balance of                               |
+----+--------------+----------+------------------------------------------------------------------+

.. code-block:: c
   :caption: **balanceOf Usage Example**

    balanceOf(0x123456789abcdefghijklmnopqrstuvwxyz98765);

.. ------------------------------------------------------------------------------------------------
.. URLs used throughout this page
.. ------------------------------------------------------------------------------------------------

.. _Zeppelin Solidity: https://github.com/OpenZeppelin/zeppelin-solidity
.. _MIT License: https://raw.githubusercontent.com/OpenZeppelin/zeppelin-solidity/master/LICENSE
.. _BasicToken Source: https://raw.githubusercontent.com/OpenZeppelin/zeppelin-solidity/v1.4.0/contracts/token/BasicToken.sol

.. ------------------------------------------------------------------------------------------------
.. END OF BASICTOKEN
.. ------------------------------------------------------------------------------------------------