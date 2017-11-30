.. ------------------------------------------------------------------------------------------------
.. STANDARDTOKEN
.. ------------------------------------------------------------------------------------------------


.. _std-token:

StandardToken
---------------------------------------


+-----------------------+-------------------------------------------------------------------------+
| **Title:**            | StandardToken                                                           |
+-----------------------+-------------------------------------------------------------------------+
| **Description:**      | `Zeppelin Solidity`_ Smart Contract that provides a standard ERC-20     |
|                       | compliant token.                                                        |
+-----------------------+-------------------------------------------------------------------------+
| **Author:**           | Smart Contract Solutions, Inc.                                          |
+-----------------------+-------------------------------------------------------------------------+
| **Solidity Version:** | ^0.4.18                                                                 |
+-----------------------+-------------------------------------------------------------------------+
| **Relative Path:**    | ./contracts/supporting/StandardToken.sol                                |
+-----------------------+-------------------------------------------------------------------------+
| **License:**          | `MIT License`_                                                          |
+-----------------------+-------------------------------------------------------------------------+
| **Current Version:**  | 1.4.0                                                                   |
+-----------------------+-------------------------------------------------------------------------+
| **Original Source:**  | `StandardToken Source`_                                                 |
+-----------------------+-------------------------------------------------------------------------+

.. ------------------------------------------------------------------------------------------------

.. _std-token-imports:

1. Imports & Dependencies
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The following imports and dependencies exist for the `StandardToken`_ Smart Contract:

+---------------------+---------------------------------------------------------------------------+
| **Name**            | **Description**                                                           |
+---------------------+---------------------------------------------------------------------------+
| :ref:`basic-token`  | `Zeppelin Solidity`_ Smart Contract that implements a Basic form of the   |
|                     | ERC-20 standard without allowances, approvals, or transferFrom            |
+---------------------+---------------------------------------------------------------------------+
| :ref:`erc-20`       | `Zeppelin Solidity`_ Smart Contract that provides the interface required  |
|                     | to implement an ERC20 compliant token.                                    |
+---------------------+---------------------------------------------------------------------------+

.. ------------------------------------------------------------------------------------------------

.. _std-token-variables:

2. Variables
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

There are no variables for the `StandardToken`_ Smart Contract.

.. ------------------------------------------------------------------------------------------------

.. _std-token-enums:

3. Enums
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

There are no enums for the `StandardToken`_ Smart Contract.

.. ------------------------------------------------------------------------------------------------

.. _std-token-events:

4. Events
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

TThere are no events for the `StandardToken`_ Smart Contract.

.. ------------------------------------------------------------------------------------------------

.. _std-token-mappings:

5. Mappings
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The following mappings exist for the `StandardToken`_ Smart Contract:


+----------+-----------------------------------------+--------------------------------------------+
| **Name** |  **Mapping Type**                       | **Description**                            |
+----------+-----------------------------------------+--------------------------------------------+
| allowed  | address => mapping( address => uint256) | Mapping to allowance authorisation         |
+----------+-----------------------------------------+--------------------------------------------+

.. ------------------------------------------------------------------------------------------------

.. _std-token-modifiers:

6. Modifiers
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

There are no modifiers for the `StandardToken`_ Smart Contract.

.. ------------------------------------------------------------------------------------------------

.. _std-token-functions:

7. Functions
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The following functions exist for the `StandardToken`_ Smart Contract:

+---------------------+---------------------------------------------------------------------------+
| **Name**            | **Description**                                                           |
+---------------------+---------------------------------------------------------------------------+
| `transferFrom`_     | Function transfer tokens from an address to another invoked by an         |
|                     | authorised spender address                                                |
+---------------------+---------------------------------------------------------------------------+
| `approve`_          | Function to approve a particular allowance to be transferred by that      | 
|                     | spender address on the target address                                     |
+---------------------+---------------------------------------------------------------------------+
| `allowance`_        | Function to get the approved allowance for a transfer of tokens from an   |
|                     | address by a spender address                                              |
+---------------------+---------------------------------------------------------------------------+
| `increaseApproval`_ | Function to allow increase approved allowance for a spender on a given    |
|                     | address                                                                   |
+---------------------+---------------------------------------------------------------------------+
| `decreaseApproval`_ | Function to allow decrease approved allowance for a spender on a given    |
|                     | address                                                                   |
+---------------------+---------------------------------------------------------------------------+

.. ------------------------------------------------------------------------------------------------

.. _std-token-transfer-from:

transferFrom
''''''''''''''''''''''''''''''''

+--------------------------+----------------------------------------------------------------------+
| **Function Name:**       | transferFrom                                                         |
+--------------------------+----------------------------------------------------------------------+
| **Description:**         | Function transfer tokens from an address to another invoked by an    |
|                          | authorised spender address                                           |
+--------------------------+----------------------------------------------------------------------+
| **Function Type:**       | N/A                                                                  |
+--------------------------+----------------------------------------------------------------------+
| **Function Visibility:** | Public                                                               |
+--------------------------+----------------------------------------------------------------------+
| **Function Modifiers:**  | N/A                                                                  |
+--------------------------+----------------------------------------------------------------------+
| **Return Type:**         | bool                                                                 |
+--------------------------+----------------------------------------------------------------------+
| **Return Details:**      | returns where the transfer was successful or not                     |
+--------------------------+----------------------------------------------------------------------+

Code
^^^^^^^^^^^^^^^^^^^^^

The code for the `transferFrom`_ function is as follows:

.. code-block:: c  
    :caption: **transferFrom 1.4.0 Code**

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool) {
        require(_to != address(0));
        require(_value <= balances[_from]);
        require(_value <= allowed[_from][msg.sender]);

        balances[_from] = balances[_from].sub(_value);
        balances[_to] = balances[_to].add(_value);
        allowed[_from][msg.sender] = allowed[_from][msg.sender].sub(_value);
        Transfer(_from, _to, _value);
        return true;
    }

The `transferFrom`_ function performs the following:

 - Checks the *_to* argument is a valid Ethereum address. If not, it will throw.
 - Checks that the *_value* argument is less than or equal to the *_from* token balance. If not, 
   it will throw    
 - Checks that *_value* argument is less than or equal to the *allowed* balance for the *msg.sender*.
   If not it will throw.
 - Removes the *_value* from the *_from* token balance. If the balance is insufficient, it will 
   throw
 - Adds the *_value* to the *_to* token balance.
 - Removes the *_value* from the allowance for this spender on this address.
 - Fires the :ref:`erc20-basic-transfer-event` event
 - Returns true


Usage
^^^^^^^^^^^^^^^^^^^^^

The `transferFrom`_ function has the following usage syntax and arguments:

+---+--------------+----------+-------------------------------------------------------------------+
|   | **Argument** | **Type** | **Details**                                                       |
+---+--------------+----------+-------------------------------------------------------------------+
| 1 | _from        | address  | Address transfer tokens from                                      |
+---+--------------+----------+-------------------------------------------------------------------+
| 2 | _to          | address  | Address transfer tokens to                                        |
+---+--------------+----------+-------------------------------------------------------------------+
| 3 | _value       | uint256  | Number of tokens to transfer                                      |
+---+--------------+----------+-------------------------------------------------------------------+

.. code-block:: c
    :caption: **transferFrom Usage Example**

    transferFrom(0x123456789abcdefghijklmnopqrstuvwxyz98765,
                 0x543456789abcdefghijklmnopqrstuvwxyz12234,
                 100);

.. ------------------------------------------------------------------------------------------------

.. _std-token-approve:

approve
''''''''''''''''''''''''''''''''

+--------------------------+----------------------------------------------------------------------+
| **Function Name:**       | approve                                                              |
+--------------------------+----------------------------------------------------------------------+
| **Description:**         | Function to approve a particular allowance to be transferred by that |
|                          | spender address on the target address                                |
+--------------------------+----------------------------------------------------------------------+
| **Function Type:**       | N/A                                                                  |
+--------------------------+----------------------------------------------------------------------+
| **Function Visibility:** | Public                                                               |
+--------------------------+----------------------------------------------------------------------+
| **Function Modifiers:**  | N/A                                                                  |
+--------------------------+----------------------------------------------------------------------+
| **Return Type:**         | bool                                                                 |
+--------------------------+----------------------------------------------------------------------+
| **Return Details:**      | Returns where the approval was successful or not                     |
+--------------------------+----------------------------------------------------------------------+

Code
^^^^^^^^^^^^^^^^^^^^^

The code for the `approve`_ function is as follows:

.. code-block:: c  
    :caption: **approve 1.4.0 Code**

    function approve(address _spender, uint256 _value) public returns (bool) {
        allowed[msg.sender][_spender] = _value;
        Approval(msg.sender, _spender, _value);
        return true;
    }

The `approve`_ function performs the following:

 - Sets the allowance for the *_spender* on the *msg.sender* address to the *_value*
 - Fires the :ref:`erc-20-approval` event
 - Returns true

Usage
^^^^^^^^^^^^^^^^^^^^^

The `approve`_ function has the following usage syntax and arguments:

+---+--------------+----------+-------------------------------------------------------------------+
|   | **Argument** | **Type** | **Details**                                                       |
+---+--------------+----------+-------------------------------------------------------------------+
| 1 | _spender     | address  | Address to grant approval to                                      |
+---+--------------+----------+-------------------------------------------------------------------+
| 2 | _to          | address  | Allowance ot grant spender                                        |
+---+--------------+----------+-------------------------------------------------------------------+

.. code-block:: c
   :caption: **approve Usage Example**

    approve(0x123456789abcdefghijklmnopqrstuvwxyz98765,100);

.. ------------------------------------------------------------------------------------------------

.. _std-token-allowance:

allowance
''''''''''''''''''''''''''''''''

+--------------------------+----------------------------------------------------------------------+
| **Function Name:**       | allowance                                                            |
+--------------------------+----------------------------------------------------------------------+
| **Description:**         | Function to approve a particular allowance to be transferred by that |
|                          | spender address on the target address                                |
+--------------------------+----------------------------------------------------------------------+
| **Function Type:**       | View                                                                 |
+--------------------------+----------------------------------------------------------------------+
| **Function Visibility:** | Public                                                               |
+--------------------------+----------------------------------------------------------------------+
| **Function Modifiers:**  | N/A                                                                  |
+--------------------------+----------------------------------------------------------------------+
| **Return Type:**         | uint256                                                              |
+--------------------------+----------------------------------------------------------------------+
| **Return Details:**      | Returns the Current balance of approved tokens an address can        |
|                          | transfer                                                             |
+--------------------------+----------------------------------------------------------------------+

Code
^^^^^^^^^^^^^^^^^^^^^

The code for the `allowance`_ function is as follows:

.. code-block:: c
    :caption: **allowance 1.4.0 Code**

    function allowance(address _owner, address _spender) public view returns (uint256) {
        return allowed[_owner][_spender];
    }

The `allowance`_ function performs the following:

 - Returns true

Usage
^^^^^^^^^^^^^^^^^^^^^

The `allowance`_ function has the following usage syntax and arguments:

+---+--------------+----------+-------------------------------------------------------------------+
|   | **Argument** | **Type** | **Details**                                                       |
+---+--------------+----------+-------------------------------------------------------------------+
| 1 | _owner       | address  | Address subject to allowance                                      |
+---+--------------+----------+-------------------------------------------------------------------+
| 2 | _spender     | address  | Address granted an allowance                                      |
+---+--------------+----------+-------------------------------------------------------------------+

.. code-block:: c
   :caption: **allowance Usage Example**

    allowance(0x123456789abcdefghijklmnopqrstuvwxyz98765,
              0x543456789abcdefghijklmnopqrstuvwxyz12234);

.. ------------------------------------------------------------------------------------------------

.. _std-token-increase-approval:

increaseApproval
''''''''''''''''''''''''''''''''

+--------------------------+----------------------------------------------------------------------+
| **Function Name:**       | increaseApproval                                                     |
+--------------------------+----------------------------------------------------------------------+
| **Description:**         | Function to increase the existing approved allowance of a spender    |
|                          | address on the target address                                        |
+--------------------------+----------------------------------------------------------------------+
| **Function Type:**       | N/A                                                                  |
+--------------------------+----------------------------------------------------------------------+
| **Function Visibility:** | Public                                                               |
+--------------------------+----------------------------------------------------------------------+
| **Function Modifiers:**  | N/A                                                                  |
+--------------------------+----------------------------------------------------------------------+
| **Return Type:**         | bool                                                                 |
+--------------------------+----------------------------------------------------------------------+
| **Return Details:**      | Current balance of approved tokens an address can transfer           |
+--------------------------+----------------------------------------------------------------------+

Code
^^^^^^^^^^^^^^^^^^^^^

The code for the `increaseApproval`_ function is as follows:

.. code-block:: c
    :caption: **increaseApproval 1.4.0 Code**

    function increaseApproval(address _spender, uint _addedValue) public returns (bool) {
        allowed[msg.sender][_spender] = allowed[msg.sender][_spender].add(_addedValue);
        Approval(msg.sender, _spender, allowed[msg.sender][_spender]);
        return true;
    }

The `increaseApproval`_ function performs the following:

 - Adds the *_addedValue* argument to the current allowance
 - Fires the :ref:`erc-20-approval` event
 - Returns true

Usage
^^^^^^^^^^^^^^^^^^^^^

The `increaseApproval`_ function has the following usage syntax and arguments:

+---+--------------+----------+-------------------------------------------------------------------+
|   | **Argument** | **Type** | **Details**                                                       |
+---+--------------+----------+-------------------------------------------------------------------+
| 1 | _spender     | address  | Address to increase the allowance for                             |
+---+--------------+----------+-------------------------------------------------------------------+
| 2 | _addedValue  | address  | Amount to add to the allowance                                    |
+---+--------------+----------+-------------------------------------------------------------------+

.. code-block:: c
   :caption: **increaseApproval Usage Example**

    increaseApproval(0x123456789abcdefghijklmnopqrstuvwxyz98765,
                    100);

.. ------------------------------------------------------------------------------------------------

.. _std-token-decrease-approval:

decreaseApproval
''''''''''''''''''''''''''''''''

+--------------------------+----------------------------------------------------------------------+
| **Function Name:**       | decreaseApproval                                                     |
+--------------------------+----------------------------------------------------------------------+
| **Description:**         | Function to increase the existing approved allowance of a spender    |
|                          | address on the target address                                        |
+--------------------------+----------------------------------------------------------------------+
| **Function Type:**       | N/A                                                                  |
+--------------------------+----------------------------------------------------------------------+
| **Function Visibility:** | Public                                                               |
+--------------------------+----------------------------------------------------------------------+
| **Function Modifiers:**  | N/A                                                                  |
+--------------------------+----------------------------------------------------------------------+
| **Return Type:**         | bool                                                                 |
+--------------------------+----------------------------------------------------------------------+
| **Return Details:**      | Current balance of approved tokens an address can transfer           |
+--------------------------+----------------------------------------------------------------------+

Code
^^^^^^^^^^^^^^^^^^^^^

The code for the `increaseApproval`_ function is as follows:

.. code-block:: c
    :caption: **decreaseApproval 1.4.0 Code**

    function decreaseApproval(address _spender, uint _subtractedValue) public returns (bool) {
        uint oldValue = allowed[msg.sender][_spender];
        if (_subtractedValue > oldValue) {
            allowed[msg.sender][_spender] = 0;
        } else {
            allowed[msg.sender][_spender] = oldValue.sub(_subtractedValue);
        }
        Approval(msg.sender, _spender, allowed[msg.sender][_spender]);
        return true;
    }

The `decreaseApproval`_ function performs the following:

 - Calculates the current approved allowance
 - If the current value is less than the *_subtractedValue* argument, the allowance is set to zero
 - Otherwise it removes the *_subtractedValue* argument from the allowance
 - Fires the :ref:`erc-20-approval` event
 - Returns true

Usage
^^^^^^^^^^^^^^^^^^^^^

The `decreaseApproval`_ function has the following usage syntax and arguments:

+---+------------------+----------+---------------------------------------------------------------+
|   | **Argument**     | **Type** | **Details**                                                   |
+---+------------------+----------+---------------------------------------------------------------+
| 1 | _spender         | address  | Address to decrease the allowance for                         |
+---+------------------+----------+---------------------------------------------------------------+
| 2 | _subtractedValue | address  | Amount to remove from the allowance                           |
+---+------------------+----------+---------------------------------------------------------------+

.. code-block:: c
   :caption: **decreaseApproval Usage Example**

    decreaseApproval(0x123456789abcdefghijklmnopqrstuvwxyz98765,
                    100);

.. ------------------------------------------------------------------------------------------------
.. URLs used throughout this page
.. ------------------------------------------------------------------------------------------------

.. _Zeppelin Solidity: https://github.com/OpenZeppelin/zeppelin-solidity
.. _MIT License: https://raw.githubusercontent.com/OpenZeppelin/zeppelin-solidity/master/LICENSE
.. _StandardToken Source: https://raw.githubusercontent.com/OpenZeppelin/zeppelin-solidity/v1.4.0/contracts/token/StandardToken.sol

.. ------------------------------------------------------------------------------------------------
.. END OF ERC20BASIC
.. ------------------------------------------------------------------------------------------------