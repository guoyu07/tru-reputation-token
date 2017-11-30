.. ------------------------------------------------------------------------------------------------
.. TRUMINTABLETOKEN
.. ------------------------------------------------------------------------------------------------

.. _tru-mintable-token:

TruMintableToken
---------------------------------------

+-----------------------+-------------------------------------------------------------------------+
| **Title:**            | TruMintableToken                                                        |
+-----------------------+-------------------------------------------------------------------------+
| **Description:**      | Smart Contract derived from `MintableToken`_ by `Zeppelin Solidity`_    |
|                       | with additional functionality for the **TruReputationToken**.           |
+-----------------------+-------------------------------------------------------------------------+
| **Author:**           | Ian Bray, Tru Ltd; derived from `MintableToken`_                        |
+-----------------------+-------------------------------------------------------------------------+
| **Solidity Version:** | ^0.4.18                                                                 |
+-----------------------+-------------------------------------------------------------------------+
| **Relative Path:**    | ./contracts/supporting/TruMintableToken.sol                             |
+-----------------------+-------------------------------------------------------------------------+
| **License:**          | `Apache 2 License`_                                                     |
+-----------------------+-------------------------------------------------------------------------+
| **Current Version:**  | 0.0.9                                                                   |
+-----------------------+-------------------------------------------------------------------------+
| **Original Source:**  | `MintableToken`_                                                        |
+-----------------------+-------------------------------------------------------------------------+

.. ------------------------------------------------------------------------------------------------

.. _tru-mintable-token-imports:

1. Imports & Dependencies
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The following imports and dependencies exist for the `TruMintableToken`_ Smart Contract:

+--------------------------+----------------------------------------------------------------------+
| **Name**                 | **Description**                                                      |
+--------------------------+----------------------------------------------------------------------+
| :ref:`safe-math`         | `Zeppelin Solidity`_ Library to perform mathematics safely inside    |
|                          | Solidity                                                             |
+--------------------------+----------------------------------------------------------------------+
| :ref:`tru-address`       | Solidity Library of helper functions surrounding the Address type in |
|                          | Solidity.                                                            |
+--------------------------+----------------------------------------------------------------------+
| :ref:`releaseable-token` | `Token Market`_ Contract that allows control over when a Token can be|
|                          | released.                                                            |
+--------------------------+----------------------------------------------------------------------+

.. ------------------------------------------------------------------------------------------------

.. _tru-mintable-token-variables:

2. Variables
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The following variables exist for the `TruMintableToken`_ Smart Contract:

+-----------------+----------+---------+----------------------------------------------------------+
| **Variable**    | **Type** | **Vis** | **Details**                                              |
+-----------------+----------+---------+----------------------------------------------------------+
| mintingFinished | bool     | public  | Variable to mark if minting is finished for this token   |
|                 |          |         |                                                          |
|                 |          |         | **Default**: *false*                                     |
+-----------------+----------+---------+----------------------------------------------------------+
| preSaleComplete | bool     | public  | Variable to mark if the Pre-Sale is complete for this    |
|                 |          |         |                                                          |
|                 |          |         | **Default**: *false*                                     |
+-----------------+----------+---------+----------------------------------------------------------+
| saleComplete    | bool     | public  | Variable to mark if the CrowdSale is complete for this   |
|                 |          |         |                                                          |
|                 |          |         | **Default**: *false*                                     |
+-----------------+----------+---------+----------------------------------------------------------+

.. ------------------------------------------------------------------------------------------------

.. _tru-mintable-token-enums:

3. Enums
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

There are no enums for the `TruMintableToken`_ Smart Contract.

.. ------------------------------------------------------------------------------------------------

.. _tru-mintable-token-events:

4. Events
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The following events for the `TruMintableToken`_ Smart Contract:

+--------------------+----------------------------------------------------------------------------+
| **Name**           |  **Description**                                                           |
+--------------------+----------------------------------------------------------------------------+
| `Minted`_          | Event to track when tokens are minted                                      |
+--------------------+----------------------------------------------------------------------------+
| `MintFinished`_    | Event to notify when minting is finalised and finished                     |
+--------------------+----------------------------------------------------------------------------+
| `PreSaleComplete`_ | Event to notify when a Pre-Sale is complete                                |
+--------------------+----------------------------------------------------------------------------+
| `SaleComplete`_    | Event to notify when a CrowdSale is complete                               |
+--------------------+----------------------------------------------------------------------------+

.. ------------------------------------------------------------------------------------------------

.. _tru-mintable-token-minted:

Minted
'''''''''''''''''''''

+------------------+------------------------------------------------------------------------------+
| **Event Name:**  | Minted                                                                       |
+------------------+------------------------------------------------------------------------------+
| **Description:** | Event to track when tokens are minted                                        |
+------------------+------------------------------------------------------------------------------+

Usage
^^^^^^^^^^^^^^^^^^^^^

The `Minted`_ event has the following usage syntax and arguments:

+---+--------------+----------+--------------+----------------------------------------------------+
|   | **Argument** | **Type** | **Indexed?** | **Details**                                        |
+---+--------------+----------+--------------+----------------------------------------------------+
| 1 |  _to         | address  | Yes          | Address tokens have been minted to                 |
+---+--------------+----------+--------------+----------------------------------------------------+
| 2 |  _amount     | uint256  | No           | Amount of tokens minted                            |
+---+--------------+----------+--------------+----------------------------------------------------+

.. code-block:: c
    :caption: **Minted Usage Example**

    Minted(0x123456789abcdefghijklmnopqrstuvwxyz98765, 100);

.. ------------------------------------------------------------------------------------------------

.. _tru-mintable-token-mint-finished:

MintFinished
'''''''''''''''''''''

+------------------+------------------------------------------------------------------------------+
| **Event Name:**  | MintFinished                                                                 |
+------------------+------------------------------------------------------------------------------+
| **Description:** | Event to notify when minting is finalised and finished                       |
+------------------+------------------------------------------------------------------------------+

Usage
^^^^^^^^^^^^^^^^^^^^^

The `MintFinished`_ event has no arguments.

.. code-block:: c
    :caption: **MintFinished Usage Example**

    MintFinished();

.. ------------------------------------------------------------------------------------------------

.. _tru-mintable-token-pre-sale-complete:

PreSaleComplete
'''''''''''''''''''''

+------------------+------------------------------------------------------------------------------+
| **Event Name:**  | PreSaleComplete                                                              |
+------------------+------------------------------------------------------------------------------+
| **Description:** | EEvent to notify when a Pre-Sale is complete                                 |
+------------------+------------------------------------------------------------------------------+

Usage
^^^^^^^^^^^^^^^^^^^^^

The `PreSaleComplete`_ event has no arguments.

.. code-block:: c
    :caption: **PreSaleComplete Usage Example**

    PreSaleComplete();

.. ------------------------------------------------------------------------------------------------

.. _tru-mintable-token-sale-complete:

SaleComplete
'''''''''''''''''''''

+------------------+-------------------------------------------------------------------------------+
| **Event Name:**  | SaleComplete                                                                  |
+------------------+-------------------------------------------------------------------------------+
| **Description:** | Event to notify when a CrowdSale is complete                                  |
+------------------+-------------------------------------------------------------------------------+

Usage
^^^^^^^^^^^^^^^^^^^^^

The `SaleComplete`_ event has no arguments.

.. code-block:: c
    :caption: **SaleComplete Usage Example**

    SaleComplete();

.. ------------------------------------------------------------------------------------------------

.. _tru-mintable-token-mappings:

5. Mappings
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

There are no mappings for the `TruMintableToken`_ Smart Contract.

.. ------------------------------------------------------------------------------------------------

.. _tru-mintable-token-modifiers:

6. Modifiers
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The following modifiers exist for the `TruMintableToken`_ Smart Contract:

+------------+------------------------------------------------------------------------------------+
| **Name**   |  **Description**                                                                   |
+------------+------------------------------------------------------------------------------------+
| `canMint`_ | Modifier to check the Token can mint                                               |
+------------+------------------------------------------------------------------------------------+

.. ------------------------------------------------------------------------------------------------

.. _tru-mintable-token-can-mint:

canMint
'''''''''''''''''''''

+--------------------+----------------------------------------------------------------------------+
| **Modifier Name:** | canMint                                                                    |
+--------------------+----------------------------------------------------------------------------+
| **Description:**   | Modifier to check if minting has finished for this token or not            |
+--------------------+----------------------------------------------------------------------------+

Code
^^^^^^^^^^^^^^^^^^^^^

The code for the `canMint`_ modifier is as follows:

.. code-block:: c
    :caption: **canMint 0.0.9 Code**
   
    modifier canMint() {
        require(!mintingFinished);
        _;
    }

The `canMint`_ function performs the following:

 - Checks that the *mintingFinished* variable is false otherwise it throws 

.. ------------------------------------------------------------------------------------------------

.. _tru-mintable-token-functions:

7. Functions
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The following functions exist for the `TruMintableToken`_ Smart Contract:

+------------------+------------------------------------------------------------------------------+
| **Name**         | **Description**                                                              |
+------------------+------------------------------------------------------------------------------+
| `mint`_          | Function to mint tokens                                                      |
+------------------+------------------------------------------------------------------------------+
| `finishMinting`_ | Function to stop minting new tokens.                                         |
+------------------+------------------------------------------------------------------------------+

.. ------------------------------------------------------------------------------------------------

.. _tru-mintable-token-mint:

mint
'''''''''''''''''''''

+--------------------------+----------------------------------------------------------------------+
| **Function Name:**       | mint                                                                 |
+--------------------------+----------------------------------------------------------------------+
| **Description:**         | Function to mint tokens                                              |
+--------------------------+----------------------------------------------------------------------+
| **Function Type:**       | Pure                                                                 |
+--------------------------+----------------------------------------------------------------------+
| **Function Visibility:** | Public                                                               |
+--------------------------+----------------------------------------------------------------------+
| **Function Modifiers:**  | :ref:`onlyOwner <ownable-only-owner>`, `canMint`_                    |
+--------------------------+----------------------------------------------------------------------+
| **Return Type:**         | Bool                                                                 |
+--------------------------+----------------------------------------------------------------------+
| **Return Details:**      | Returns whether mint completed successfully                          |
+--------------------------+----------------------------------------------------------------------+

Code
^^^^^^^^^^^^^^^^^^^^^

The code for the `mint`_ function is as follows:

.. code-block:: c
    :caption: **mint 0.0.9 Code**

    function mint(address _to, uint256 _amount) public onlyOwner canMint returns (bool) {
        require(_amount > 0);
        require(TruAddress.isValidAddress(_to) == true);
    
        totalSupply = totalSupply.add(_amount);
        balances[_to] = balances[_to].add(_amount);
        Minted(_to, _amount);
        Transfer(0x0, _to, _amount);
        return true;
    }

The `mint`_ function performs the following:

 - Checks the supplied `_amount` is greater than 0
 - Checks the supplied `_to` address is valid
 - Adds the newly minted amount to the totalSupply of tokens
 - Transfers the newly minted tokens to the recipient
 - Fires the `Minted`_ event
 - Fires the :ref:`erc20-basic-transfer-event` event
 - returns true

Usage
^^^^^^^^^^^^^^^^^^^^^

The `mint`_ function has the following usage syntax and arguments:

+----+--------------------+--------------------+--------------------------------------------------+
|    | **Argument**       | **Type**           | **Details**                                      |
+----+--------------------+--------------------+--------------------------------------------------+
| 1  |  _to               | address            | Address to mint tokens to                        |
+----+--------------------+-----------------------------------------------------------------------+
| 2  |  _amount           | uint256            | Amount of tokens to mint                         |
+----+--------------------+-----------------------------------------------------------------------+

.. code-block:: c
    :caption: **mint Usage Example**

    mint(0x123456789abcdefghijklmnopqrstuvwxyz98765);

.. ------------------------------------------------------------------------------------------------

.. _tru-mintable-token-finish-minting:

finishMinting
'''''''''''''''''''''

+--------------------------+----------------------------------------------------------------------+
| **Function Name:**       | finishMinting                                                        |
+--------------------------+----------------------------------------------------------------------+
| **Description:**         | Function to mint tokens                                              |
+--------------------------+----------------------------------------------------------------------+
| **Function Type:**       | Pure                                                                 |
+--------------------------+----------------------------------------------------------------------+
| **Function Visibility:** | Public                                                               |
+--------------------------+----------------------------------------------------------------------+
| **Function Modifiers:**  | :ref:`onlyOwner <ownable-only-owner>`, `canMint`_                    |
+--------------------------+----------------------------------------------------------------------+
| **Return Type:**         | Bool                                                                 |
+--------------------------+----------------------------------------------------------------------+
| **Return Details:**      | Returns whether mint completed successfully                          |
+--------------------------+----------------------------------------------------------------------+

Code
^^^^^^^^^^^^^^^^^^^^^

The code for the `finishMinting`_ function is as follows:

.. code-block:: c
    :caption: **finishMinting 0.0.9 Code**

    function finishMinting(bool _presale, bool _sale) public onlyOwner returns (bool) {
        require(_sale != _presale);

        if (_presale == true) {
            preSaleComplete = true;
            PreSaleComplete();
            return true;
        }

        require(preSaleComplete == true);
        saleComplete = true;
        SaleComplete();
        mintingFinished = true;
        MintFinished();
        return true;
    }

The `finishMinting`_ function performs the following:

 - Ensures that the *_presale* and *_sale* argument do not match (one must be true, the other false)
 - If _presale argument is true, change the *preSaleComplete* variable to true, fire the 
   `PreSaleComplete` event and return true
 - If _sale argument is true, change the *saleComplete* variable to true, fire the `SaleComplete` 
   event, set the *mintingFinished* variable to true, fire the `MintFinished` event and return true

Usage
^^^^^^^^^^^^^^^^^^^^^

The `finishMinting`_ function has the following usage syntax and arguments:

+----+--------------+----------+------------------------------------------------------------------+
|    | **Argument** | **Type** | **Details**                                                      |
+----+--------------+----------+------------------------------------------------------------------+
| 1  |  _presale    | bool     | Whether this call is from the Pre-Sale or not                    |
+----+--------------+----------+------------------------------------------------------------------+
| 2  |  _sale       | bool     | Whether this call is from the CrowdSale or not                   |
+----+--------------+----------+------------------------------------------------------------------+

.. code-block:: c
    :caption: **finishMinting Usage Example**

    finishMinting(true, false);

.. ------------------------------------------------------------------------------------------------
.. URLs used throughout this page
.. ------------------------------------------------------------------------------------------------

.. _Zeppelin Solidity: https://github.com/OpenZeppelin/zeppelin-solidity
.. _MIT License: https://raw.githubusercontent.com/OpenZeppelin/zeppelin-solidity/master/LICENSE
.. _Apache 2 License: https://raw.githubusercontent.com/TruLtd/tru-reputation-token/master/LICENSE
.. _Token Market: https://github.com/TokenMarketNet/ico/
.. _MintableToken: https://raw.githubusercontent.com/OpenZeppelin/zeppelin-solidity/v1.4.0/contracts/token/MintableToken.sol