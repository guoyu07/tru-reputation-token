.. ------------------------------------------------------------------------------------------------
.. TRUPRESALE
.. ------------------------------------------------------------------------------------------------

.. _tru-presale:

TruPreSale
===================================

The `TruPreSale`_ Smart Contract acts a child class to the :ref:`tru-sale` and is used for the
main CrowdSale of the :ref:`tru-reputation-token`.

+-----------------------+-------------------------------------------------------------------------+
| **Title:**            | TruPreSale                                                              |
+-----------------------+-------------------------------------------------------------------------+
| **Description:**      | Smart Contract for the Pre-Sale of the :ref:`tru-reputation-token`.     |
+-----------------------+-------------------------------------------------------------------------+
| **Author:**           | Ian Bray, Tru Ltd                                                       |
+-----------------------+-------------------------------------------------------------------------+
| **Solidity Version:** | ^0.4.18                                                                 |
+-----------------------+-------------------------------------------------------------------------+
| **Relative Path:**    | ./contracts/TruPreSale.sol                                              |
+-----------------------+-------------------------------------------------------------------------+
| **License:**          | `Apache 2 License`_                                                     |
+-----------------------+-------------------------------------------------------------------------+
| **Current Version:**  | 0.0.9                                                                   |
+-----------------------+-------------------------------------------------------------------------+

.. ------------------------------------------------------------------------------------------------

.. _tru-presale-imports:

1. Imports & Dependencies
---------------------------------------

The following imports and dependencies exist for the `TruPreSale`_ Smart Contract:

+-----------------------------+-------------------------------------------------------------------+
| **Name**                    | **Description**                                                   |
+-----------------------------+-------------------------------------------------------------------+
| :ref:`tru-sale`             | Parent Smart Contract for all :ref:`tru-reputation-token` Token   |
|                             | Sales                                                             |
+-----------------------------+-------------------------------------------------------------------+
| :ref:`tru-reputation-token` | Smart Contract for the Tru Reputation Token                       |
+-----------------------------+-------------------------------------------------------------------+
| :ref:`safe-math`            | `Zeppelin Solidity`_ Library to perform mathematics safely inside |
|                             | Solidity                                                          |
+-----------------------------+-------------------------------------------------------------------+

.. ------------------------------------------------------------------------------------------------

.. _tru-presale-variables:

2. Variables
---------------------------------------

The following variables exist for the `TruPreSale`_ Smart Contract:

+----------------+----------+---------+-----------------------------------------------------------+
| **Variable**   | **Type** | **Vis** | **Details**                                               |
+----------------+----------+---------+-----------------------------------------------------------+
| PRESALECAP     | uint256  | public  | Variable for the Pre-Sale cap                             |
|                |          |         |                                                           |
|                |          |         | **Default:** *8000 * 10^18*                               |
+----------------+----------+---------+-----------------------------------------------------------+

.. ------------------------------------------------------------------------------------------------

.. _tru-presale-enums:

3. Enums
---------------------------------------

There are no enums for the `TruPreSale`_ Smart Contract.

.. ------------------------------------------------------------------------------------------------

.. _tru-presale-events:

4. Events
---------------------------------------

There are no events for the `TruPreSale`_ Smart Contract.

.. ------------------------------------------------------------------------------------------------

.. _tru-presale-mappings:

5. Mappings
---------------------------------------

There are no mappings for the `TruPreSale`_ Smart Contract.

.. ------------------------------------------------------------------------------------------------

.. _tru-presale-modifiers:

6. Modifiers
---------------------------------------

There are no modifiers for the `TruPreSale`_ Smart Contract.

.. ------------------------------------------------------------------------------------------------

.. _tru-presale-functions:

7. Functions
---------------------------------------

The following functions exist for the `TruPreSale`_ Smart Contract:

+-----------------------------+-------------------------------------------------------------------+
| **Name**                    | **Description**                                                   |
+-----------------------------+-------------------------------------------------------------------+
| `TruPreSale Constructor`_   | Constructor for the `TruPreSale`_ Smart Contract                  |
+-----------------------------+-------------------------------------------------------------------+
| `finalise`_                 | Function to finalise Pre-Sale.                                    |
+-----------------------------+-------------------------------------------------------------------+
| `completion`_               | Internal function to complete Pre-Sale.                           |
+-----------------------------+-------------------------------------------------------------------+

.. ------------------------------------------------------------------------------------------------

.. _tru-sale-constructor:

TruPreSale Constructor
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

+--------------------------+----------------------------------------------------------------------+
| **Function Name:**       | TruPreSale                                                           |
+--------------------------+----------------------------------------------------------------------+
| **Description:**         | Constructor for the `TruPreSale`_ Smart Contract                     |
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
''''''''''''''''''''''''''''''''

The code for the `TruPreSale Constructor`_ function is as follows:

.. code-block:: c
    :caption: **TruPreSale Constructor 0.0.9 Code**

    unction TruPreSale(
        uint256 _startTime, 
        uint256 _endTime, 
        address _token,
        address _saleWallet) public TruSale(_startTime, _endTime, _token, _saleWallet) 
    {
            isPreSale = true;
            isCrowdSale = false;
            cap = PRESALECAP;
    }

The `TruPreSale Constructor`_ function performs the following:

 - Executes the super :ref:`tru-sale-constructor` function.
 - Sets the *isPreSale* variable to **true**.
 - Sets the *isCrowdSale* variable to **false**.
 - Set the *cap* variable to equal the *PRESALECAP* variable value.

Usage
''''''''''''''''''''''''''''''''

The `TruPreSale Constructor`_ function has the following usage syntax and arguments:

+---+----------------+----------+-----------------------------------------------------------------+
|   | **Argument**   | **Type** | **Details**                                                     |
+---+----------------+----------+-----------------------------------------------------------------+
| 1 |  _startTime    | uint256  | Sale start timestamp                                            |
+---+----------------+----------+-----------------------------------------------------------------+
| 2 |  _endTime      | uint256  | Sale end timestamp                                              |
+---+----------------+----------+-----------------------------------------------------------------+
| 3 | _token         | address  | Address of TruReputationToken Contract                          |
+---+----------------+----------+-----------------------------------------------------------------+
| 4 | _saleWallet    | address  | Address of `TruPreSale`_ wallet                                 |
+---+----------------+----------+-----------------------------------------------------------------+

.. code-block:: c
   :caption: **TruPreSale Constructor Usage Example**

    TruPreSale(1511930475, 
                 1512016874, 
                 0x123456789abcdefghijklmnopqrstuvwxyz98765, 
                 0x987654321abcdefghijklmnopqrstuvwxyz12345);

.. ------------------------------------------------------------------------------------------------

.. _tru-presale-finalise:

finalise
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

+--------------------------+----------------------------------------------------------------------+
| **Function Name:**       | finalise                                                             |
+--------------------------+----------------------------------------------------------------------+
| **Description:**         | Function to finalise Pre-Sale.                                       |
+--------------------------+----------------------------------------------------------------------+
| **Function Type:**       | N/A                                                                  |
+--------------------------+----------------------------------------------------------------------+
| **Function Visibility:** | Public                                                               |
+--------------------------+----------------------------------------------------------------------+
| **Function Modifiers:**  | ref:`ownable-only-owner`                                             |
+--------------------------+----------------------------------------------------------------------+
| **Return Type:**         | None                                                                 |
+--------------------------+----------------------------------------------------------------------+
| **Return Details:**      | N/A                                                                  |
+--------------------------+----------------------------------------------------------------------+

Code
''''''''''''''''''''''''''''''''

The code for the `finalise`_ function is as follows:

.. code-block:: c
    :caption: **finalise 0.0.9 Code**

    function finalise() public onlyOwner {
        require(!isCompleted);
        require(hasEnded());

        completion();
        Completed();

        isCompleted = true;
    }

The `finalise`_ function performs the following:

 - Checks that the *isCompleted* variable is set to false. If not, it will throw.
 - Checks the :ref:`tru-sale-has-ended` function returns true. If not, it will throw.
 - Executes the `completion`_ function.
 - Fires the :ref:`tru-sale-completed` event.
 - Sets *isCompleted* variable to true.

Usage
''''''''''''''''''''''''''''''''

The `finalise`_ function has the following usage syntax:

.. code-block:: c
    :caption: **finalise Usage Example**

    finalise();

.. ------------------------------------------------------------------------------------------------

.. _tru-sale-completion:

completion
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

+--------------------------+----------------------------------------------------------------------+
| **Function Name:**       | completion                                                           |
+--------------------------+----------------------------------------------------------------------+
| **Description:**         | Internal function to complete Pre-Sale.                              |
+--------------------------+----------------------------------------------------------------------+
| **Function Type:**       | N/A                                                                  |
+--------------------------+----------------------------------------------------------------------+
| **Function Visibility:** | Internal                                                             |
+--------------------------+----------------------------------------------------------------------+
| **Function Modifiers:**  | N/A                                                                  |
+--------------------------+----------------------------------------------------------------------+
| **Return Type:**         | None                                                                 |
+--------------------------+----------------------------------------------------------------------+
| **Return Details:**      | N/A                                                                  |
+--------------------------+----------------------------------------------------------------------+

Code
''''''''''''''''''''''''''''''''

The code for the `completion`_ function is as follows:

.. code-block:: c
    :caption: **completion 0.0.9 Code**

    function completion() internal {
     
        // Double sold pool to allocate to Tru Resource Pools
        uint256 poolTokens = truToken.totalSupply();

        // Issue poolTokens to multisig wallet
        truToken.mint(multiSigWallet, poolTokens);
        truToken.finishMinting(true, false);
        truToken.transferOwnership(msg.sender);
    }

The `completion`_ function performs the following:


 - Calculates the number of tokens sold in this Pre-Sale and mints the same amount again into 
   the *multiSigWallet* Sale wallet for use by Tru Ltd as per the `Tru Reputation Protocol Whitepaper`_.
 - Executes the :ref:`tru-mintable-token-finish-minting` function to end Pre-Sale minting and
   await CrowdSale minting
 - Transfers ownership of the :ref:`tru-reputation-token` back to the executing account now the 
   Pre-Sale is complete. 

Usage
''''''''''''''''''''''''''''''''

The `completion`_ function has the following usage syntax:

.. code-block:: c
    :caption: **completion Usage Example**

    completion();

.. ------------------------------------------------------------------------------------------------
.. URLs used throughout this page
.. ------------------------------------------------------------------------------------------------

.. _Zeppelin Solidity: https://github.com/OpenZeppelin/zeppelin-solidity
.. _Tru Reputation Protocol Whitepaper: https://tru.ltd/whitepaper
.. _Apache 2 License: https://raw.githubusercontent.com/TruLtd/tru-reputation-token/master/LICENSE

.. ------------------------------------------------------------------------------------------------
.. END OF TRUPRESALE
.. ------------------------------------------------------------------------------------------------