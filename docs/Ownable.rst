.. ------------------------------------------------------------------------------------------------
.. OWNABLE
.. ------------------------------------------------------------------------------------------------

.. _ownable:

Ownable
---------------------------------------

+-----------------------+-------------------------------------------------------------------------+
| **Title:**            | Ownable                                                                 |
+-----------------------+-------------------------------------------------------------------------+
| **Description:**      | `Zeppelin Solidity`_ Smart Contract that provides ownership capabilities|
|                       | to a contract.                                                          |
+-----------------------+-------------------------------------------------------------------------+
| **Author:**           | Smart Contract Solutions, Inc.                                          |
+-----------------------+-------------------------------------------------------------------------+
| **Solidity Version:** | ^0.4.18                                                                 |
+-----------------------+-------------------------------------------------------------------------+
| **Relative Path:**    | ./contracts/supporting/Ownable.sol                                      |
+-----------------------+-------------------------------------------------------------------------+
| **License:**          | `MIT License`_                                                          |
+-----------------------+-------------------------------------------------------------------------+
| **Current Version:**  | 1.4.0                                                                   |
+-----------------------+-------------------------------------------------------------------------+
| **Original Source:**  | `Ownable Source`_                                                       |
+-----------------------+-------------------------------------------------------------------------+

.. ------------------------------------------------------------------------------------------------

.. _ownable-imports:

1. Imports & Dependencies
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

There are no imports and dependencies for the `Ownable`_ Smart Contract.

.. ------------------------------------------------------------------------------------------------

.. _ownable-variables:

2. Variables
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The following variables exist for the `Ownable`_ Smart Contract:

+--------------+----------+---------+-------------------------------------------------------------+
| **Variable** | **Type** | **Vis** | **Details**                                                 |
+--------------+----------+---------+-------------------------------------------------------------+
| owner        | address  | public  | Variable containing the address of the contract owner       |
+--------------+----------+---------+-------------------------------------------------------------+

.. ------------------------------------------------------------------------------------------------

.. _ownable-enums:

3. Enums
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

There are no enums for the `Ownable`_ Smart Contract.

.. ------------------------------------------------------------------------------------------------

.. _ownable-events:

4. Events
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The following events exist for the `Ownable`_ Smart Contract:

+-------------------------+-----------------------------------------------------------------------+
| **Name**                | **Description**                                                       |
+-------------------------+-----------------------------------------------------------------------+
| `OwnershipTransferred`_ | Event to track change of ownership                                    |
+-------------------------+-----------------------------------------------------------------------+

.. ------------------------------------------------------------------------------------------------

.. _ownable-ownership-transferred:

OwnershipTransferred
'''''''''''''''''''''

+------------------+------------------------------------------------------------------------------+
| **Event Name:**  | OwnershipTransferred                                                         |
+------------------+------------------------------------------------------------------------------+
| **Description:** | Event to track change of ownership                                           |
+------------------+------------------------------------------------------------------------------+

Usage
^^^^^^^^^^^^^^^^^^^^^

The `OwnershipTransferred`_ event has the following usage syntax and arguments:

+---+---------------+----------+--------------+---------------------------------------------------+
|   | **Argument**  | **Type** | **Indexed?** | **Details**                                       |
+---+---------------+----------+--------------+---------------------------------------------------+
| 1 | previousOwner | address  | Yes          | Address of the previous owner                     |
+---+---------------+----------+--------------+---------------------------------------------------+
| 2 | newOwner      | address  | Yes          | Address of the new owner                          |
+---+---------------+----------+--------------+---------------------------------------------------+

.. code-block:: c
    :caption: **OwnershipTransferred Usage Example**

    OwnershipTransferred(0x123456789abcdefghijklmnopqrstuvwxyz98765,
                         0x123456789abcdefghijklmnopqrstuvwxyz54321);

.. ------------------------------------------------------------------------------------------------

.. _ownable-mappings:

5. Mappings
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The are no mappings for the `Ownable`_ Smart Contract.

.. ------------------------------------------------------------------------------------------------

.. _ownable-modifiers:

6. Modifiers
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The following modifiers exist for the `Ownable`_ Smart Contract:

+--------------------+----------------------------------------------------------------------------+
| **Name**           |  **Description**                                                           |
+--------------------+----------------------------------------------------------------------------+
| `onlyOwner`_       | Modifier that requires the contract owner is the sender of the transaction |
+--------------------+----------------------------------------------------------------------------+

.. ------------------------------------------------------------------------------------------------

.. _ownable-only-owner:

onlyOwner
'''''''''''''''''''''

+--------------------+----------------------------------------------------------------------------+
| **Modifier Name:** | onlyOwner                                                                  |
+--------------------+----------------------------------------------------------------------------+
| **Description:**   | Modifier that requires the contract owner is the sender of the transaction |
+--------------------+----------------------------------------------------------------------------+

Code
^^^^^^^^^^^^^^^^^^^^^

The code for the `onlyOwner`_ modifier is as follows:

.. code-block:: c
    :caption: **onlyOwner 1.4.0 Code**
   
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

The `onlyOwner`_ function performs the following:

 - Checks that the transaction sender address is the same as the *owner* address variable otherwise 
   it throws

.. ------------------------------------------------------------------------------------------------

.. _ownable-functions:

7. Functions
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The following functions exist for the `Ownable`_ Smart Contract:

+------------------------+------------------------------------------------------------------------+
| **Name**               | **Description**                                                        |
+------------------------+------------------------------------------------------------------------+
| `Ownable Constructor`_ | Constructor Function for Ownable Contract                              |
+------------------------+------------------------------------------------------------------------+
| `transferOwnership`_   | Function transfer the contract ownership                               |
+------------------------+------------------------------------------------------------------------+

.. ------------------------------------------------------------------------------------------------

.. _ownable-constructor:

Ownable Constructor
'''''''''''''''''''''

+--------------------------+----------------------------------------------------------------------+
| **Function Name:**       | Ownable                                                              |
+--------------------------+----------------------------------------------------------------------+
| **Description:**         | Constructor for the `Ownable`_ Smart Contract                        |
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

The code for the `Ownable Constructor`_ function is as follows:

.. code-block:: c
    :caption: **Ownable Constructor 1.4.0 Code**
   
    function Ownable() public {
        owner = msg.sender;
    }

The `Ownable Constructor`_ function performs the following:

 - Sets the *owner* variable *msg.sender*

Usage
^^^^^^^^^^^^^^^^^^^^^

The `Ownable Constructor`_ function has the following usage syntax:

.. code-block:: c
   :caption: **Ownable Constructor Usage Example**

    Ownable();

.. ------------------------------------------------------------------------------------------------

.. _ownable-transfer-ownership:

transferOwnership
'''''''''''''''''''''

+--------------------------+----------------------------------------------------------------------+
| **Function Name:**       | transferOwnership                                                    |
+--------------------------+----------------------------------------------------------------------+
| **Description:**         | Function transfer the contract ownership                             |
+--------------------------+----------------------------------------------------------------------+
| **Function Type:**       | N/A                                                                  |
+--------------------------+----------------------------------------------------------------------+
| **Function Visibility:** | Public                                                               |
+--------------------------+----------------------------------------------------------------------+
| **Function Modifiers:**  | `onlyOwner`_                                                         |
+--------------------------+----------------------------------------------------------------------+
| **Return Type:**         | None                                                                 |
+--------------------------+----------------------------------------------------------------------+
| **Return Details:**      | N/A                                                                  |
+--------------------------+----------------------------------------------------------------------+

Code
^^^^^^^^^^^^^^^^^^^^^

The code for the `transferOwnership`_ function is as follows:

.. code-block:: c
    :caption: **transferOwnership 1.4.0 Code**
   
    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0));
        OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

The `transferOwnership`_ function performs the following:

 - Validates that the supplied *newOwner* argument is a valid Ethereum address. If it is not,
   it will throw.
 - Fires the `OwnershipTransferred`_ event.
 - sets the *owner* to the *newOwner* argument value.

Usage
^^^^^^^^^^^^^^^^^^^^^

The `transferOwnership`_ function has the following usage syntax:

.. code-block:: c
   :caption: **transferOwnership Usage Example**

    transferOwnership(0x123456789abcdefghijklmnopqrstuvwxyz98765);


.. ------------------------------------------------------------------------------------------------
.. URLs used throughout this page
.. ------------------------------------------------------------------------------------------------

.. _Zeppelin Solidity: https://github.com/OpenZeppelin/zeppelin-solidity
.. _MIT License: https://raw.githubusercontent.com/OpenZeppelin/zeppelin-solidity/master/LICENSE
.. _Ownable Source: https://raw.githubusercontent.com/OpenZeppelin/zeppelin-solidity/v1.4.0/contracts/ownership/Ownable.sol


.. ------------------------------------------------------------------------------------------------
.. END OF HALTABLE
.. ------------------------------------------------------------------------------------------------