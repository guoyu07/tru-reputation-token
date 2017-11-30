.. ------------------------------------------------------------------------------------------------
.. TRUSALE
.. ------------------------------------------------------------------------------------------------

.. _tru-sale:

TruSale
===================================

The `TruSale`_ Smart Contract acts a parent class for the :ref:`tru-presale` and 
:ref:`tru-crowdsale` contracts and contains all logic common to both.

+-----------------------+-------------------------------------------------------------------------+
| **Title:**            | TruSale                                                                 |
+-----------------------+-------------------------------------------------------------------------+
| **Description:**      | Parent Smart Contract for all :ref:`tru-reputation-token` Token Sales   |
+-----------------------+-------------------------------------------------------------------------+
| **Author:**           | Ian Bray, Tru Ltd                                                       |
+-----------------------+-------------------------------------------------------------------------+
| **Solidity Version:** | ^0.4.18                                                                 |
+-----------------------+-------------------------------------------------------------------------+
| **Relative Path:**    | ./contracts/TruSale.sol                                                 |
+-----------------------+-------------------------------------------------------------------------+
| **License:**          | `Apache 2 License`_                                                     |
+-----------------------+-------------------------------------------------------------------------+
| **Current Version:**  | 0.0.9                                                                   |
+-----------------------+-------------------------------------------------------------------------+

.. ------------------------------------------------------------------------------------------------

.. _tru-sale-imports:

1. Imports & Dependencies
---------------------------------------

The following imports and dependencies exist for the `TruSale`_ Smart Contract:

+-----------------------------+-------------------------------------------------------------------+
| **Name**                    | **Description**                                                   |
+-----------------------------+-------------------------------------------------------------------+
| :ref:`haltable`             | Modified `Token Market`_ Smart Contract that provides a capability|
|                             | to halt a contract.                                               |
+-----------------------------+-------------------------------------------------------------------+
| :ref:`ownable`              | `Zeppelin Solidity`_ Smart Contract that provides ownership       | 
|                             | capabilities to a contract.                                       |
+-----------------------------+-------------------------------------------------------------------+
| :ref:`safe-math`            | `Zeppelin Solidity`_ Library to perform mathematics safely inside |
|                             | Solidity                                                          |
+-----------------------------+-------------------------------------------------------------------+
| :ref:`tru-address`          | Library of helper functions surrounding the Solidity Address type |
+-----------------------------+-------------------------------------------------------------------+
| :ref:`tru-reputation-token` | Smart Contract for the Tru Reputation Token                       |
+-----------------------------+-------------------------------------------------------------------+

.. ------------------------------------------------------------------------------------------------

.. _tru-sale-variables:

2. Variables
---------------------------------------

The following variables exist for the `TruSale`_ Smart Contract:

+----------------+--------------------+---------+-------------------------------------------------+
| **Variable**   | **Type**           | **Vis** | **Details**                                     |
+----------------+--------------------+---------+-------------------------------------------------+
| truToken       | TruReputationToken | public  | Variable for the token being sold in Sale       |
+----------------+--------------------+---------+-------------------------------------------------+
| saleStartTime  | uint256            | public  | Start timestamp of the Sale                     |
+----------------+--------------------+---------+-------------------------------------------------+
| saleEndTime    | uint256            | public  | End timestamp of the Sale                       |
+----------------+--------------------+---------+-------------------------------------------------+
| purchaserCount | uint               | public  | Number of sale purchasers so far                |
|                |                    |         |                                                 |
|                |                    |         | **Default:** *0*                                |
+----------------+--------------------+---------+-------------------------------------------------+
| multiSigWallet | address            | public  | Sale wallet address                             |
+----------------+--------------------+---------+-------------------------------------------------+
| BASERATE       | uint256            | public  | Constant variable of post sale TRU to ETH rate  |
|                |                    |         |                                                 |
|                |                    |         | **Default:** *1000*                             |
+----------------+--------------------+---------+-------------------------------------------------+
| PRESALERATE    | uint256            | public  | Constant variable of Pre-Sale TRU to ETH rate   |
|                |                    |         |                                                 |
|                |                    |         | **Default:** *1250* - 25% Bonus                 |
+----------------+--------------------+---------+-------------------------------------------------+
| SALERATE       | uint256            | public  | Constant variable of CrowdSale TRU to ETH rate  |
|                |                    |         |                                                 |
|                |                    |         | **Default:** *1125* - 12.5% Bonus               |
+----------------+--------------------+---------+-------------------------------------------------+
| MINAMOUNT      | uint256            | public  | Minimum Amount of ETH for an address to         |
|                |                    |         | participate in Sale                             |
|                |                    |         |                                                 |
|                |                    |         | **Default:** *1 * 10^18*                        |
+----------------+--------------------+---------+-------------------------------------------------+
| MAXAMOUNT      | uint256            | public  | Maximum ETH buy Amount for a non-Whitelist      |
|                |                    |         | address                                         |
|                |                    |         |                                                 |
|                |                    |         | **Default:** *20 * 10^18*                       |
+----------------+--------------------+---------+-------------------------------------------------+
| weiRaised      | uint256            | public  | Amount raised during Sale in Wei                |
+----------------+--------------------+---------+-------------------------------------------------+
| cap            | uint256            | public  | Cap of the Sale- value set during construction  |
+----------------+--------------------+---------+-------------------------------------------------+
| isCompleted    | bool               | public  | Whether the Sale is complete                    |
+----------------+--------------------+---------+-------------------------------------------------+
| isPreSale      | bool               | public  | Whether the Sale is a Pre-Sale                  |
+----------------+--------------------+---------+-------------------------------------------------+
| isCrowdSale    | bool               | public  | Whether the Sale is a CrowdSale                 |
+----------------+--------------------+---------+-------------------------------------------------+
| soldTokens     | uint256            | public  | Amount of TRU during Sale                       |
+----------------+--------------------+---------+-------------------------------------------------+

.. ------------------------------------------------------------------------------------------------

.. _tru-sale-enums:

3. Enums
---------------------------------------

There are no enums for the `TruSale`_ Smart Contract.

.. ------------------------------------------------------------------------------------------------

.. _tru-sale-events:

4. Events
---------------------------------------

The following events exist for the `TruSale`_ Smart Contract:

+--------------------+----------------------------------------------------------------------------+
| **Name**           | **Description**                                                            |
+--------------------+----------------------------------------------------------------------------+
| `TokenPurchased`_  | Event to notify when a token purchase occurs                               |
+--------------------+----------------------------------------------------------------------------+
| `WhiteListUpdate`_ | Event to notify when the *purchaseWhiteList* is updated                    |
+--------------------+----------------------------------------------------------------------------+
| `EndChanged`_      | Event to notify when the *saleEndTime* changes                             |
+--------------------+----------------------------------------------------------------------------+
| `Completed`_       | Event to notify when the Sale completes                                    |
+--------------------+----------------------------------------------------------------------------+

.. ------------------------------------------------------------------------------------------------

.. _tru-sale-token-purchased:

TokenPurchased
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

+------------------+------------------------------------------------------------------------------+
| **Event Name:**  | TokenPurchased                                                               |
+------------------+------------------------------------------------------------------------------+
| **Description:** | EEvent to notify when a token purchase occurs                                |
+------------------+------------------------------------------------------------------------------+

Usage
'''''''''''''''''''''

The `TokenPurchased`_ event has the following usage syntax and arguments:

+---+--------------+----------+--------------+----------------------------------------------------+
|   | **Argument** | **Type** | **Indexed?** | **Details**                                        |
+---+--------------+----------+--------------+----------------------------------------------------+
| 1 | _purchaser   | address  | Yes          | Address being updated on the Whitelist             |
+---+--------------+----------+--------------+----------------------------------------------------+
| 2 | _recipient   | address  | No           | Status of the address on the Whitelist             |
+---+--------------+----------+--------------+----------------------------------------------------+
| 3 | _weiValue    | uint256  | No           | Amount of ETH spent (in Wei)                       |
+---+--------------+----------+--------------+----------------------------------------------------+
| 4 | _tokenAmount | uint256  | No           | Amount of tokens purchased (in smallest decimal)   |
+---+--------------+----------+--------------+----------------------------------------------------+


.. code-block:: c
   :caption: **TokenPurchased Usage Example**

    TokenPurchased(0x123456789abcdefghijklmnopqrstuvwxyz98765,
                   0x123456789abcdefghijklmnopqrstuvwxyz98765,
                   1000000000000000000,
                   1250000000000000000000);

.. ------------------------------------------------------------------------------------------------

.. _tru-sale-whitelist-update:

WhiteListUpdate
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

+------------------+------------------------------------------------------------------------------+
| **Event Name:**  | WhiteListUpdate                                                              |
+------------------+------------------------------------------------------------------------------+
| **Description:** | Event to notify when the *purchaseWhiteList* is updated                      |
+------------------+------------------------------------------------------------------------------+

Usage
'''''''''''''''''''''

The `WhiteListUpdate`_ event has the following usage syntax and arguments:

+---+-------------------+----------+--------------+-----------------------------------------------+
|   | **Argument**      | **Type** | **Indexed?** | **Details**                                   |
+---+-------------------+----------+--------------+-----------------------------------------------+
| 1 | _purchaserAddress | address  | Yes          | Address being updated on the Whitelist        |
+---+-------------------+----------+--------------+-----------------------------------------------+
| 2 | _whitelistStatus  | address  | No           | Status of the address on the Whitelist        |
+---+-------------------+----------+--------------+-----------------------------------------------+


.. code-block:: c
   :caption: **WhiteListUpdate Usage Example**

    WhiteListUpdate(0x123456789abcdefghijklmnopqrstuvwxyz98765,
                    true);

.. ------------------------------------------------------------------------------------------------

.. _tru-sale-end-changed:

EndChanged
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

+------------------+------------------------------------------------------------------------------+
| **Event Name:**  | EndChanged                                                                   |
+------------------+------------------------------------------------------------------------------+
| **Description:** | Event to notify when the *purchaseWhiteList* is updated                      |
+------------------+------------------------------------------------------------------------------+

Usage
'''''''''''''''''''''

The `EndChanged`_ event has the following usage syntax and arguments:

+---+--------------+----------+--------------+----------------------------------------------------+
|   | **Argument** | **Type** | **Indexed?** | **Details**                                        |
+---+--------------+----------+--------------+----------------------------------------------------+
| 1 | _oldEnd      | uint256  | No           | Previous *saleEndTime* timestamp                   |
+---+--------------+----------+--------------+----------------------------------------------------+
| 2 | _newEnd      | uint256  | No           | Updated *saleEndTime* timestamp                    |
+---+--------------+----------+--------------+----------------------------------------------------+


.. code-block:: c
   :caption: **EndChanged Usage Example**

    EndChanged(1511930475, 1512016874);

.. ------------------------------------------------------------------------------------------------

.. _tru-sale-completed:

Completed
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

+------------------+------------------------------------------------------------------------------+
| **Event Name:**  | Completed                                                                    |
+------------------+------------------------------------------------------------------------------+
| **Description:** | Event to notify when the Sale completes                                      |
+------------------+------------------------------------------------------------------------------+

Usage
'''''''''''''''''''''

The `Completed`_ event has the following usage syntax:

.. code-block:: c
   :caption: **Completed Usage Example**

    Completed();

.. ------------------------------------------------------------------------------------------------

.. _tru-sale-mappings:

5. Mappings
---------------------------------------

The following mappings exist for the `TruSale`_ Smart Contract:

+--------------------+--------------------+-------------------------------------------------------+
| **Name**           |  **Mapping Type**  | **Description**                                       |
+--------------------+--------------------+-------------------------------------------------------+
| purchasedAmount    | address => uint256 | Mapping of purchased amount in ETH to buying address  |
+--------------------+--------------------+-------------------------------------------------------+
| tokenAmount        | address => uint256 | Mapping of purchased amount of TRU to buying address  |
+--------------------+--------------------+-------------------------------------------------------+
| purchaserWhiteList | address => bool    | Mapping of Whitelisted address to their Whitelist     |
|                    |                    | status                                                |
+--------------------+--------------------+-------------------------------------------------------+

.. ------------------------------------------------------------------------------------------------

.. _tru-sale-modifiers:

6. Modifiers
---------------------------------------

The following modifiers exist for the `TruSale`_ Smart Contract:

+-------------------+-----------------------------------------------------------------------------+
| **Name**          |  **Description**                                                            |
+-------------------+-----------------------------------------------------------------------------+
| `onlyTokenOwner`_ | Modifier to check if transaction sender is the owner of the Token contract  |
+-------------------+-----------------------------------------------------------------------------+

.. ------------------------------------------------------------------------------------------------

.. _tru-sale-only-token-owner:

onlyTokenOwner
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

+--------------------+----------------------------------------------------------------------------+
| **Modifier Name:** | onlyTokenOwner                                                             |
+--------------------+----------------------------------------------------------------------------+
| **Description:**   | Modifier to check if transaction sender is the owner of the Token contract |
+--------------------+----------------------------------------------------------------------------+

Code
'''''''''''''''''''''''''''''''''''''''

The code for the `onlyTokenOwner`_ modifier is as follows:

.. code-block:: c
   :caption: **onlyTokenOwner 0.0.9 Code**

    modifier onlyTokenOwner(address _tokenOwner) {
        require(msg.sender == _tokenOwner);
        _;
    }

The `onlyTokenOwner`_ function performs the following:

 - Checks that the *msg.sender* matches the supplied *_tokenOwner* variable. If not, it will throw.

.. ------------------------------------------------------------------------------------------------

.. _tru-sale-functions:

7. Functions
---------------------------------------

The following functions exist for the `TruSale`_ Smart Contract:

+------------------------+------------------------------------------------------------------------+
| **Name**               | **Description**                                                        |
+------------------------+------------------------------------------------------------------------+
| `TruSale Constructor`_ | Constructor for the `TruSale`_ Smart Contract                          |
+------------------------+------------------------------------------------------------------------+
| `updateWhitelist`_     | Function to add or disable a purchaser from AML Whitelist              |
+------------------------+------------------------------------------------------------------------+
| `changeEndTime`_       | Function to change the end time of the Sale                            |
+------------------------+------------------------------------------------------------------------+
| `hasEnded`_            | Function to check whether the Sale has ended                           |
+------------------------+------------------------------------------------------------------------+
| `checkSaleValid`_      | Internal function to validate that the Sale is valid                   |
+------------------------+------------------------------------------------------------------------+
| `validatePurchase`_    | Internal function to validate the purchase of TRU Tokens               |
+------------------------+------------------------------------------------------------------------+
| `forwardFunds`_        | Internal function to forward all raised funds to the Sale Wallet       |
+------------------------+------------------------------------------------------------------------+
| `createSale`_          | Internal function used to encapsulate more complex constructor logic   |
+------------------------+------------------------------------------------------------------------+
| `buyTokens`_           | Private function execute purchase of TRU Tokens                        |
+------------------------+------------------------------------------------------------------------+

.. ------------------------------------------------------------------------------------------------

.. _tru-sale-constructor:

TruSale Constructor
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

+--------------------------+----------------------------------------------------------------------+
| **Function Name:**       | TruSale                                                              |
+--------------------------+----------------------------------------------------------------------+
| **Description:**         | Constructor for the `TruSale`_ Smart Contract                        |
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

The code for the `TruSale Constructor`_ function is as follows:

.. code-block:: c
    :caption: **TruSale Constructor 0.0.9 Code**

    function TruSale(uint256 _startTime, 
                     uint256 _endTime, 
                     address _token, 
                     address _saleWallet) public {

        require(TruAddress.isValidAddress(_token) == true);

        TruReputationToken tToken = TruReputationToken(_token);
        address tokenOwner = tToken.owner();

        createSale(_startTime, _endTime, _token, _saleWallet, tokenOwner);
    }

The `TruSale Constructor`_ function performs the following:

 - Checks the *_token* argument is a valid Ethereum address.
 - Gets the owner of the *_token* TruReputationToken object
 - Executes the `createSale`_ function with the *tokenOwner* variable as an argument.

Usage
''''''''''''''''''''''''''''''''

The `TruSale Constructor`_ function has the following usage syntax and arguments:

+---+--------------+----------+-------------------------------------------------------------------+
|   | **Argument** | **Type** | **Details**                                                       |
+---+--------------+----------+-------------------------------------------------------------------+
| 1 |  _startTime  | uint256  | Sale start timestamp                                              |
+---+--------------+----------+-------------------------------------------------------------------+
| 2 |  _endTime    | uint256  | Sale end timestamp                                                |
+---+--------------+----------+-------------------------------------------------------------------+
| 3 | _token       | address  | Address of TruReputationToken Contract                            |
+---+--------------+----------+-------------------------------------------------------------------+
| 4 | _saleWallet  | address  | Address of sale wallet                                            |
+---+--------------+----------+-------------------------------------------------------------------+

.. code-block:: c
   :caption: **TruSale Constructor Usage Example**

    TruSale(1511930475, 
            1512016874, 
            0x123456789abcdefghijklmnopqrstuvwxyz98765, 
            0x987654321abcdefghijklmnopqrstuvwxyz12345);

.. ------------------------------------------------------------------------------------------------

.. _tru-sale-update-whitelist:

updateWhitelist
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

+--------------------------+----------------------------------------------------------------------+
| **Function Name:**       | updateWhitelist                                                      |
+--------------------------+----------------------------------------------------------------------+
| **Description:**         | Function to add or disable a purchaser from AML Whitelist            |
+--------------------------+----------------------------------------------------------------------+
| **Function Type:**       | N/A                                                                  |
+--------------------------+----------------------------------------------------------------------+
| **Function Visibility:** | Public                                                               |
+--------------------------+----------------------------------------------------------------------+
| **Function Modifiers:**  | :ref:`ownable-only-owner`                                            |
+--------------------------+----------------------------------------------------------------------+
| **Return Type:**         | None                                                                 |
+--------------------------+----------------------------------------------------------------------+
| **Return Details:**      | N/A                                                                  |
+--------------------------+----------------------------------------------------------------------+

Code
''''''''''''''''''''''''''''''''

The code for the `updateWhitelist`_ function is as follows:

.. code-block:: c
    :caption: **updateWhitelist 0.0.9 Code**

    function updateWhitelist(address _purchaser, uint _status) public onlyOwner {
        require(TruAddress.isValidAddress(_purchaser) == true);
        bool boolStatus = false;
        if (_status == 0) {
            boolStatus = false;
        } else if (_status == 1) {
            boolStatus = true;
        } else {
            revert();
        }

        WhiteListUpdate(_purchaser, boolStatus);
        purchaserWhiteList[_purchaser] = boolStatus;
    }


.. note:: The `updateWhitelist`_ function uses uint for the *status* argument because fuzz testing 
         found that bool arguments on public functions in Solidity could be interpreted as true 
         when supplied with a random string. 
         
         In the interest of type safety and defensive development this was set to uint with **0** 
         being **false** and **1** being **true**, all other values are ignored. 
         
         **Be very careful using bool on public functions in Solidity.**

The `updateWhitelist`_ function performs the following:

 - Validates the *_purchaser* argument is a valid Ethereum address.
 - Checks the *_status* argument is either 0 or 1. If 0, sets *boolStatus* to false, if 1, sets 
   *boolStatus* to true. If else, it will throw.
 - Fires the `WhiteListUpdate`_ event
 - Sets the *_purchaser* to the *boolStatus* on the *purchaseWhiteList*

Usage
''''''''''''''''''''''''''''''''

The `updateWhitelist`_ function has the following usage syntax and arguments:

+---+--------------+------------------------------------------------------------------------------+
|   | **Argument** | **Type** | **Details**                                                       |
+---+--------------+------------------------------------------------------------------------------+
| 1 |  _purchaser  | uint256  | Address of the purchaser to add or update on the Whitelist        |
+---+--------------+------------------------------------------------------------------------------+
| 2 |  _status     | uint     | Status on the Whitelist- 0 for disabled, 1 for enabled            |
+---+--------------+------------------------------------------------------------------------------+

.. code-block:: c
   :caption: **updateWhitelist Usage Example**

    updateWhitelist(0x987654321abcdefghijklmnopqrstuvwxyz12345, 1);

.. ------------------------------------------------------------------------------------------------

.. _tru-sale-change-end-time:

changeEndTime
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

+--------------------------+----------------------------------------------------------------------+
| **Function Name:**       | changeEndTime                                                        |
+--------------------------+----------------------------------------------------------------------+
| **Description:**         | Function to change the end time of the Sale                          |
+--------------------------+----------------------------------------------------------------------+
| **Function Type:**       | N/A                                                                  |
+--------------------------+----------------------------------------------------------------------+
| **Function Visibility:** | Public                                                               |
+--------------------------+----------------------------------------------------------------------+
| **Function Modifiers:**  | :ref:`ownable-only-owner`                                            |
+--------------------------+----------------------------------------------------------------------+
| **Return Type:**         | None                                                                 |
+--------------------------+----------------------------------------------------------------------+
| **Return Details:**      | N/A                                                                  |
+--------------------------+----------------------------------------------------------------------+

Code
''''''''''''''''''''''''''''''''

The code for the `changeEndTime`_ function is as follows:

.. code-block:: c
    :caption: **changeEndTime 0.0.9 Code**
   
    function changeEndTime(uint256 _endTime) public onlyOwner {
        
        // _endTime must be greater than or equal to saleStartTime
        require(_endTime >= saleStartTime);
        
        // Fire Event for time Change
        EndChanged(saleEndTime, _endTime);

        // Change the Sale End Time
        saleEndTime = _endTime;
    }


.. note:: The `changeEndTime`_ function has been included to allow a Sale's end time to be altered
          after the start. This is addressed in :ref:`requirements-sal-req012` and behaves in the
          following way:

          **1.** If the End Time is moved before the current block timestamp, it will automatically 
          close the Sale fully and finally.

          **2.** If the End Time is moved beyond the current end time, it will extend the time 
          remaining in the Sale. This is useful if issues with the network are encountered and 
          should only be used will full communication to purchasers prior to the change.

The `changeEndTime`_ function performs the following:

 - Checks the *_endTime* argument is equal to or greater than the *saleStartTime* variable. If not, 
   it will throw.
 - Fire the `EndChanged` event.
 - Set the *saleEndTime* variable to the *_endTime* argument.

Usage
''''''''''''''''''''''''''''''''

The `changeEndTime`_ function has the following usage syntax and arguments:

+---+--------------+------------------------------------------------------------------------------+
|   | **Argument** | **Type** | **Details**                                                       |
+---+--------------+------------------------------------------------------------------------------+
| 1 |  _endTime    | uint256  | New end timestamp for Sale                                        |
+---+--------------+------------------------------------------------------------------------------+

.. code-block:: c
   :caption: **changeEndTime Usage Example**

    changeEndTime(1511930475);

.. ------------------------------------------------------------------------------------------------

.. _tru-sale-has-ended:

hasEnded
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

+--------------------------+----------------------------------------------------------------------+
| **Function Name:**       | hasEnded                                                             |
+--------------------------+----------------------------------------------------------------------+
| **Description:**         | Function to check whether the Sale has ended                         |
+--------------------------+----------------------------------------------------------------------+
| **Function Type:**       | Constant                                                             |
+--------------------------+----------------------------------------------------------------------+
| **Function Visibility:** | Public                                                               |
+--------------------------+----------------------------------------------------------------------+
| **Function Modifiers:**  | N/A                                                                  |
+--------------------------+----------------------------------------------------------------------+
| **Return Type:**         | bool                                                                 |
+--------------------------+----------------------------------------------------------------------+
| **Return Details:**      | Returns true if the Sale has ended; false if it has not              |
+--------------------------+----------------------------------------------------------------------+

Code
''''''''''''''''''''''''''''''''

The code for the `hasEnded`_ function is as follows:

.. code-block:: c
   :caption: **hasEnded 0.0.9 Code**

    function hasEnded() public constant returns (bool) {
        bool isCapHit = weiRaised >= cap;
        bool isExpired = now > saleEndTime;
        return isExpired || isCapHit;
    }

The `hasEnded`_ function performs the following:

 - Checks that the *weiRaised* variable is less than the *cap* variable.
 - Checks that the current block timestamp is less than the *saleEndTime* timestamp
 - If either of the previous checks are true, the Sale has ended. Otherwise the Sale
   has not ended.

Usage
''''''''''''''''''''''''''''''''

The `hasEnded`_ function has the following usage syntax:

.. code-block:: c
   :caption: **hasEnded Usage Example**

    hasEnded();

.. ------------------------------------------------------------------------------------------------

.. _tru-sale-check-salid-valid:

checkSaleValid
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

+--------------------------+----------------------------------------------------------------------+
| **Function Name:**       | checkSaleValid                                                       |
+--------------------------+----------------------------------------------------------------------+
| **Description:**         | Internal function to validate that the Sale is valid                 |
+--------------------------+----------------------------------------------------------------------+
| **Function Type:**       | Constant                                                             |
+--------------------------+----------------------------------------------------------------------+
| **Function Visibility:** | Internal                                                             |
+--------------------------+----------------------------------------------------------------------+
| **Function Modifiers:**  | N/A                                                                  |
+--------------------------+----------------------------------------------------------------------+
| **Return Type:**         | bool                                                                 |
+--------------------------+----------------------------------------------------------------------+
| **Return Details:**      | Returns true if the Sale is still open; false if it is not           |
+--------------------------+----------------------------------------------------------------------+

Code
''''''''''''''''''''''''''''''''

The code for the `checkSaleValid`_ function is as follows:

.. code-block:: c
   :caption: **checkSaleValid 0.0.9 Code**

    function checkSaleValid() internal constant returns (bool) {
        bool afterStart = now >= saleStartTime;
        bool beforeEnd = now <= saleEndTime;
        bool capNotHit = weiRaised.add(msg.value) <= cap;
        return afterStart && beforeEnd && capNotHit;
    }

The `checkSaleValid`_ function performs the following:

 - Checks the Sale has started. If it has not, will return false.
 - Checks the Sale has not ended. If it has, will return false.
 - Checks the cap has not been hit, if it has, will return false.

Usage
''''''''''''''''''''''''''''''''

The `checkSaleValid`_ function has the following usage syntax:

.. code-block:: c
   :caption: **checkSaleValid Usage Example**

    checkSaleValid();

.. ------------------------------------------------------------------------------------------------

.. _tru-sale-validate-purchase:

validatePurchase
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

+--------------------------+----------------------------------------------------------------------+
| **Function Name:**       | validatePurchase                                                     |
+--------------------------+----------------------------------------------------------------------+
| **Description:**         | Internal function to validate the purchase of TRU Tokens             |
+--------------------------+----------------------------------------------------------------------+
| **Function Type:**       | N/A                                                                  |
+--------------------------+----------------------------------------------------------------------+
| **Function Visibility:** | Internal                                                             |
+--------------------------+----------------------------------------------------------------------+
| **Function Modifiers:**  | :ref:`haltable-stop-in-emergency`                                    |
+--------------------------+----------------------------------------------------------------------+
| **Return Type:**         | N/A                                                                  |
+--------------------------+----------------------------------------------------------------------+
| **Return Details:**      | N/A                                                                  |
+--------------------------+----------------------------------------------------------------------+

Code
''''''''''''''''''''''''''''''''

The code for the `validatePurchase`_ function is as follows:

.. code-block:: c
   
    function validatePurchase(address _purchaser) internal stopInEmergency {
    
        // _purchaser must be valid
        require(TruAddress.isValidAddress(_purchaser) == true);
    
        // Value must be greater than 0
        require(msg.value > 0);

        buyTokens(_purchaser);
    }

.. note:: The `validatePurchase`_ function acts as the both a pre-validation step for a purchase,
    and a point at which the Sale can be halted as per the :ref:`haltable` Smart Contract.

The `validatePurchase`_ function performs the following:

 - Validates that the *_purchaser* argument is a valid Ethereum Address.
 - Validates that the *msg.value* is greater than 0
 - Executes the *buyTokens* function.

Usage
''''''''''''''''''''''''''''''''

The `validatePurchase`_ function has the following usage syntax:

.. code-block:: c
   :caption: **validatePurchase Usage Example**

    validatePurchase(0x987654321abcdefghijklmnopqrstuvwxyz12345);

.. ------------------------------------------------------------------------------------------------

.. _tru-sale-forward-funds:

forwardFunds
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

+--------------------------+----------------------------------------------------------------------+
| **Function Name:**       | forwardFunds                                                         |
+--------------------------+----------------------------------------------------------------------+
| **Description:**         | Internal function to forward all raised funds to the Sale Wallet     |
+--------------------------+----------------------------------------------------------------------+
| **Function Type:**       | N/A                                                                  |
+--------------------------+----------------------------------------------------------------------+
| **Function Visibility:** | Internal                                                             |
+--------------------------+----------------------------------------------------------------------+
| **Function Modifiers:**  | N/A                                                                  |
+--------------------------+----------------------------------------------------------------------+
| **Return Type:**         | N/A                                                                  |
+--------------------------+----------------------------------------------------------------------+
| **Return Details:**      | N/A                                                                  |
+--------------------------+----------------------------------------------------------------------+

Code
''''''''''''''''''''''''''''''''

The code for the `forwardFunds`_ function is as follows:

.. code-block:: c
   
    function forwardFunds() internal {
        multiSigWallet.transfer(msg.value);
    }

The `forwardFunds`_ function performs the following:

 - Transfers any new funds away from the `TruSale`_ Smart Contract, to the Sale Wallet reflected
   in the *multiSigWallet* variable.

Usage
''''''''''''''''''''''''''''''''

The `forwardFunds`_ function has the following usage syntax:

.. code-block:: c
   :caption: **forwardFunds Usage Example**

    forwardFunds();

.. ------------------------------------------------------------------------------------------------

.. _tru-sale-create-sale:

createSale
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

+--------------------------+----------------------------------------------------------------------+
| **Function Name:**       | createSale                                                           |
+--------------------------+----------------------------------------------------------------------+
| **Description:**         | Internal function used to encapsulate more complex constructor logic |
+--------------------------+----------------------------------------------------------------------+
| **Function Type:**       | N/A                                                                  |
+--------------------------+----------------------------------------------------------------------+
| **Function Visibility:** | Internal                                                             |
+--------------------------+----------------------------------------------------------------------+
| **Function Modifiers:**  | `onlyTokenOwner`_                                                    |
+--------------------------+----------------------------------------------------------------------+
| **Return Type:**         | N/A                                                                  |
+--------------------------+----------------------------------------------------------------------+
| **Return Details:**      | N/A                                                                  |
+--------------------------+----------------------------------------------------------------------+

Code
''''''''''''''''''''''''''''''''

The code for the `createSale`_ function is as follows:

.. code-block:: c
   :caption: **createSale 0.0.9 Code**

    function createSale(
        uint256 _startTime, 
        uint256 _endTime, 
        address _token, 
        address _saleWallet, 
        address _tokenOwner) 
    internal onlyTokenOwner(_tokenOwner) {
        // _startTime must be greater than or equal to now
        require(now <= _startTime);

        // _endTime must be greater than or equal to _startTime
        require(_endTime >= _startTime);
    
        // _salletWallet must be valid
        require(TruAddress.isValidAddress(_saleWallet) == true);

        truToken = TruReputationToken(_token);
        multiSigWallet = _saleWallet;
        saleStartTime = _startTime;
        saleEndTime = _endTime;
    }

.. note:: The `createSale`_ argument uses the `onlyTokenOwner`_ modifier to ensure that no 
    instance of the `TruSale`_ can be created for :ref:`tru-reputation-token` unless they
    are the owner of that contract. If that modifier is passed, the rest of the logic is
    processed to construct the `TruSale`_ instance.

The `createSale`_ function performs the following:

 - Ensures the *_startTime* timestamp argument is greater than the latest block timestamp.
 - Ensures the *_endTime* timestamp argument is greater than the *_startTime* timestamp argument.
 - Ensures the *_saleWallet* argument is a valid Ethereum Address.
 - Sets the truToken variable to the instance of TruReputationToken from the _token argument.
 - Sets the *multiSigWallet* variable to the *_saleWallet* argument.
 - Sets the *saleStartTime* variable to the *_startTime* argument.
 - Sets the *saleEndTime* variable to the *_endTime* argument.

Usage
''''''''''''''''''''''''''''''''

The `createSale`_ function has the following usage syntax:

.. code-block:: c
   :caption: **createSale Usage Example**

    createSale(1511930475, 
               1512016874, 
               0x123456789abcdefghijklmnopqrstuvwxyz98765,,
               0x465328375xyzacefgijklmnopqrstuvwxyz66712,
               0xa57htuju9abcdefghijehtitthtjiohjtoi02447);

.. ------------------------------------------------------------------------------------------------

.. _tru-sale-buy-tokens:

buyTokens
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

+--------------------------+----------------------------------------------------------------------+
| **Function Name:**       | buyTokens                                                            |
+--------------------------+----------------------------------------------------------------------+
| **Description:**         | Private function execute purchase of TRU Tokens                      |
+--------------------------+----------------------------------------------------------------------+
| **Function Type:**       | N/A                                                                  |
+--------------------------+----------------------------------------------------------------------+
| **Function Visibility:** | Private                                                              |
+--------------------------+----------------------------------------------------------------------+
| **Function Modifiers:**  | N/A                                                                  |
+--------------------------+----------------------------------------------------------------------+
| **Return Type:**         | N/A                                                                  |
+--------------------------+----------------------------------------------------------------------+
| **Return Details:**      | N/A                                                                  |
+--------------------------+----------------------------------------------------------------------+

Code
''''''''''''''''''''''''''''''''

The code for the `buyTokens`_ function is as follows:

.. code-block:: c
   :caption: **buyTokens 0.0.9 Code**

    function buyTokens(address _purchaser) private {
        uint256 weiTotal = msg.value;

        // If the Total wei is less than the minimum purchase, reject
        require(weiTotal >= MINAMOUNT);

        // If the Total wei is greater than the maximum stake, purchasers must be on the whitelist
        if (weiTotal > MAXAMOUNT) {
            require(purchaserWhiteList[msg.sender]); 
        }
    
        // Prevention to stop circumvention of Maximum Amount without being on the Whitelist
        if (purchasedAmount[msg.sender] != 0 && !purchaserWhiteList[msg.sender]) {
            uint256 totalPurchased = purchasedAmount[msg.sender];
            totalPurchased = totalPurchased.add(weiTotal);
            require(totalPurchased < MAXAMOUNT);
        }

        uint256 tokenRate = BASERATE;
    
        if (isPreSale) {
            tokenRate = PRESALERATE;
        }
        if (isCrowdSale) {
            tokenRate = SALERATE;
        }

        // Multiply Wei x Rate to get Number of Tokens to create (as a 10^18 subunit)
        uint256 noOfTokens = weiTotal.mul(tokenRate);
    
        // Add the wei to the running total
        weiRaised = weiRaised.add(weiTotal);

        // If the purchaser address has not purchased already, add them to the list
        if (purchasedAmount[msg.sender] == 0) {
            purchaserCount++;
        }
        soldTokens = soldTokens.add(noOfTokens);

        purchasedAmount[msg.sender] = purchasedAmount[msg.sender].add(msg.value);
        tokenAmount[msg.sender] = tokenAmount[msg.sender].add(noOfTokens);

        // Mint the Tokens to the Purchaser
        truToken.mint(_purchaser, noOfTokens);
        TokenPurchased(msg.sender,
        _purchaser,
        weiTotal,
        noOfTokens);
        forwardFunds();
    }

The `buyTokens`_ function performs the following:

 - Checks that the sent amount (*msg.value*) is equal to or greater than the *MINAMOUNT* variable. 
   If it is not, it will throw.
 - Checks if the sent amount (*msg.value*) is greater than the *MAXAMOUNT* variable. If it is, it
   will perform a further check to see if the sender is on the Whitelist- if they are, it will
   proceed, if not it will throw. If the amount is less than or equal to the *MAXAMOUNT* variable,
   it will proceed.
 - Checks that the cumulative total of this purchase, and any prior purchases do not exceed the 
   *MAXAMOUNT* variable if the purchaser is not on the Whitelist. If it is, it will throw.
 - Sets the Sale Rate to the default of the *BASERATE* variable.
 - If the *isPreSale* variable is true sets the Sale Rate to *PRESALERATE* variable.
 - If the *isCrowdSale* variable is true sets the Sale Rate to *SALERATE* variable.
 - Calculates the number of tokens purchased.
 - Increments the *purchaserCount* variable if this is the first purchase from this address.
 - Adds the calculated token count to the *soldTokens* variable.
 - Adds the *msg.value* to the *purchasedAmount* mapping for the purchaser.
 - Adds the token amount to the *tokenAmount* mapping for the purchaser.
 - Mints the token amount to the purchaser's address.
 - Fires the `TokenPurchased`_ event.
 - Executes the `forwardFunds`_ function.


Usage
''''''''''''''''''''''''''''''''

The `buyTokens`_ function has the following usage syntax:

.. code-block:: c
   :caption: **buyTokens Usage Example**

    buyTokens(0xa57htuju9abcdefghijehtitthtjiohjtoi02447);

.. ------------------------------------------------------------------------------------------------
.. URLs used throughout this page
.. ------------------------------------------------------------------------------------------------

.. _Zeppelin Solidity: https://github.com/OpenZeppelin/zeppelin-solidity
.. _Token Market: https://github.com/TokenMarketNet/ico/
.. _Apache 2 License: https://raw.githubusercontent.com/TruLtd/tru-reputation-token/master/LICENSE

.. ------------------------------------------------------------------------------------------------
.. END OF TRUSALE
.. ------------------------------------------------------------------------------------------------