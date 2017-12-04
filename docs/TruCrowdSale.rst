.. ------------------------------------------------------------------------------------------------
.. TRUCROWDSALE
.. ------------------------------------------------------------------------------------------------

.. _tru-crowdsale:

TruCrowdSale
===================================

The `TruCrowdSale`_ Smart Contract acts a child class to the :ref:`tru-sale` and is used for the
main CrowdSale of the :ref:`tru-reputation-token`.

+-----------------------+-------------------------------------------------------------------------+
| **Title:**            | TruCrowdSale                                                            |
+-----------------------+-------------------------------------------------------------------------+
| **Description:**      | Smart Contract for the CrowdSale of the :ref:`tru-reputation-token`.    |
+-----------------------+-------------------------------------------------------------------------+
| **Author:**           | Ian Bray, Tru Ltd                                                       |
+-----------------------+-------------------------------------------------------------------------+
| **Solidity Version:** | 0.4.18                                                                  |
+-----------------------+-------------------------------------------------------------------------+
| **Relative Path:**    | ./contracts/TruCrowdSale.sol                                            |
+-----------------------+-------------------------------------------------------------------------+
| **License:**          | `Apache 2 License`_                                                     |
+-----------------------+-------------------------------------------------------------------------+
| **Current Version:**  | |version|                                                               |
+-----------------------+-------------------------------------------------------------------------+

.. ------------------------------------------------------------------------------------------------

.. _tru-crowdsale-imports:

1. Imports & Dependencies
---------------------------------------

The following imports and dependencies exist for the `TruCrowdSale`_ Smart Contract:

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

.. _tru-crowdsale-variables:

2. Variables
---------------------------------------

The following variables exist for the `TruCrowdSale`_ Smart Contract:

+----------------+----------+---------+-----------------------------------------------------------+
| **Variable**   | **Type** | **Vis** | **Details**                                               |
+----------------+----------+---------+-----------------------------------------------------------+
| TOTAL_CAP      | uint256  | public  | Variable for the Total cap for the Crowdsale & Pre-Sale   |
+----------------+----------+---------+-----------------------------------------------------------+
| existingSupply | uint256  | private | Variable containing the existing                          |
|                |          |         | :ref:`tru-reputation-token` supply.                       |
+----------------+----------+---------+-----------------------------------------------------------+

.. ------------------------------------------------------------------------------------------------

.. _tru-crowdsale-enums:

3. Enums
---------------------------------------

There are no enums for the `TruCrowdSale`_ Smart Contract.

.. ------------------------------------------------------------------------------------------------

.. _tru-crowdsale-events:

4. Events
---------------------------------------

There are no events for the `TruCrowdSale`_ Smart Contract.

.. ------------------------------------------------------------------------------------------------

.. _tru-crowdsale-mappings:

5. Mappings
---------------------------------------

There are no mappings for the `TruCrowdSale`_ Smart Contract.

.. ------------------------------------------------------------------------------------------------

.. _tru-crowdsale-modifiers:

6. Modifiers
---------------------------------------

There are no modifiers for the `TruCrowdSale`_ Smart Contract.

.. ------------------------------------------------------------------------------------------------

.. _tru-crowdsale-functions:

7. Functions
---------------------------------------

The following functions exist for the `TruCrowdSale`_ Smart Contract:

+-----------------------------+-------------------------------------------------------------------+
| **Name**                    | **Description**                                                   |
+-----------------------------+-------------------------------------------------------------------+
| `TruCrowdSale Constructor`_ | Constructor for the `TruCrowdSale`_ Smart Contract                |
+-----------------------------+-------------------------------------------------------------------+
| `finalise`_                 | Function to finalise CrowdSale.                                   |
+-----------------------------+-------------------------------------------------------------------+
| `completion`_               | Internal function to complete CrowdSale.                          |
+-----------------------------+-------------------------------------------------------------------+

.. ------------------------------------------------------------------------------------------------

.. _tru-crowdsale-constructor:

TruCrowdSale Constructor
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

+--------------------------+----------------------------------------------------------------------+
| **Function Name:**       | TruCrowdSale                                                         |
+--------------------------+----------------------------------------------------------------------+
| **Description:**         | Constructor for the `TruCrowdSale`_ Smart Contract                   |
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

The code for the `TruCrowdSale Constructor`_ function is as follows:

.. code-block:: c
    :caption: **TruCrowdSale Constructor Code**

    function TruCrowdSale(
        uint256 _startTime, 
        uint256 _endTime, 
        address _token, 
        address _saleWallet,
        uint256 _currentSupply, 
        uint256 _currentRaise) public TruSale(_startTime, _endTime, _token, _saleWallet) 
        {
            isPreSale = false;
            isCrowdSale = true;
            uint256 remainingCap = TOTAL_CAP.sub(_currentRaise);
            cap = remainingCap;
            existingSupply = _currentSupply;
    }

The `TruCrowdSale Constructor`_ function performs the following:

 - Executes the super :ref:`tru-sale-constructor` function.
 - Sets the *isPreSale* variable to **false**.
 - Sets the *isCrowdSale* variable to **true**.
 - Calculates the *cap* variable by removing the *_currentRaise* argument from the *TOTAL_CAP* 
   variable.
 - Sets *existingSupply* variable to the *_currentSupply* argument.

Usage
''''''''''''''''''''''''''''''''

The `TruCrowdSale Constructor`_ function has the following usage syntax and arguments:

+---+----------------+----------+-----------------------------------------------------------------+
|   | **Argument**   | **Type** | **Details**                                                     |
+---+----------------+----------+-----------------------------------------------------------------+
| 1 |  _startTime    | uint256  | Sale start timestamp                                            |
+---+----------------+----------+-----------------------------------------------------------------+
| 2 |  _endTime      | uint256  | Sale end timestamp                                              |
+---+----------------+----------+-----------------------------------------------------------------+
| 3 | _token         | address  | Address of TruReputationToken Contract                          |
+---+----------------+----------+-----------------------------------------------------------------+
| 4 | _saleWallet    | address  | Address of `TruCrowdSale`_ wallet                               |
+---+----------------+----------+-----------------------------------------------------------------+
| 5 | _currentSupply | uint256  | Current amount of :ref:`tru-reputation-token` tokens issued.    |
+---+----------------+----------+-----------------------------------------------------------------+
| 6 | _currentRaise  | uint256  | Current amount of ETH raised in the :ref:`tru-presale`          |
+---+----------------+----------+-----------------------------------------------------------------+

.. code-block:: c
   :caption: **TruCrowdSale Constructor Usage Example**

    TruCrowdSale(1511930475, 
                 1512016874, 
                 0x123456789abcdefghijklmnopqrstuvwxyz98765, 
                 0x987654321abcdefghijklmnopqrstuvwxyz12345,
                 8000000000000000000000,
                 10000000000000000000000000);

.. ------------------------------------------------------------------------------------------------

.. _tru-crowdsale-finalise:

finalise
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

+--------------------------+----------------------------------------------------------------------+
| **Function Name:**       | finalise                                                             |
+--------------------------+----------------------------------------------------------------------+
| **Description:**         | Function to finalise CrowdSale.                                      |
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
    :caption: **finalise Code**

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

.. _tru-crowdsale-completion:

completion
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

+--------------------------+----------------------------------------------------------------------+
| **Function Name:**       | completion                                                           |
+--------------------------+----------------------------------------------------------------------+
| **Description:**         | Internal function to complete CrowdSale.                             |
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
    :caption: **completion Code**

    function completion() internal {
     
        // Double sold pool to allocate to Tru Resource Pools
        uint256 poolTokens = truToken.totalSupply();
        poolTokens = poolTokens.sub(existingSupply);

        // Issue poolTokens to multisig wallet
        truToken.mint(multiSigWallet, poolTokens);
        truToken.finishMinting(false, true);
        truToken.transferOwnership(msg.sender);
        truToken.releaseTokenTransfer();
    }

The `completion`_ function performs the following:


 - Calculates the number of tokens sold in this CrowdSale and mints the same amount again into 
   the *multiSigWallet* Sale wallet for use by Tru Ltd as per the `Tru Reputation Protocol Whitepaper`_.
 - Executes the :ref:`tru-mintable-token-finish-minting` function to finalise all minting activity 
   for the :ref:`tru-reputation-token`
 - Transfers ownership of the :ref:`tru-reputation-token` back to the executing account now the 
   Crowdsale is complete. 
 - Executes :ref:`releaseable-token-release-token-transfer` function.

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
.. END OF TRUCROWDSALE
.. ------------------------------------------------------------------------------------------------