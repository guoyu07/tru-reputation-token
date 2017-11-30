.. ------------------------------------------------------------------------------------------------
.. RELEASEABLETOKEN
.. ------------------------------------------------------------------------------------------------

.. _releaseable-token:

ReleaseableToken
---------------------------------------

+-----------------------+-------------------------------------------------------------------------+
| **Title:**            | TruUpgradeableToken                                                     |
+-----------------------+-------------------------------------------------------------------------+
| **Description:**      | Smart Contract derived from **ReleaseableToken** by `Token Market`_     |
|                       | with additional functionality for the **TruReputationToken**.           |
+-----------------------+-------------------------------------------------------------------------+
| **Author:**           | Ian Bray, Tru Ltd                                                       |
+-----------------------+-------------------------------------------------------------------------+
| **Solidity Version:** | ^0.4.18                                                                 |
+-----------------------+-------------------------------------------------------------------------+
| **Relative Path:**    | ./contracts/supporting/ReleaseableToken.sol                             |
+-----------------------+-------------------------------------------------------------------------+
| **License:**          | `Apache 2 License`_                                                     |
+-----------------------+-------------------------------------------------------------------------+
| **Current Version:**  | 0.0.9                                                                   |
+-----------------------+-------------------------------------------------------------------------+
| **Original Source:**  | `ReleaseableToken Source`_                                              |
+-----------------------+-------------------------------------------------------------------------+

.. ------------------------------------------------------------------------------------------------

.. _releaseable-token-imports:

1. Imports & Dependencies
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The following imports and dependencies exist for the `ReleaseableToken`_ Solidity Library:

+------------------------+------------------------------------------------------------------------+
| **Name**               | **Description**                                                        |
+------------------------+------------------------------------------------------------------------+
| :ref:`ownable`         | `Zeppelin Solidity`_ Smart Contract that provides ownership            |
|                        | capabilities to a contract.                                            |
+------------------------+------------------------------------------------------------------------+
| :ref:`std-token`       | `Zeppelin Solidity`_ Smart Contract for a Standard ERC-20 Token        |
+------------------------+------------------------------------------------------------------------+

.. ------------------------------------------------------------------------------------------------

.. _releaseable-token-variables:

2. Variables
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The following variables exist for the `ReleaseableToken`_ Smart Contract:

+--------------+----------+---------+-------------------------------------------------------------+
| **Variable** | **Type** | **Vis** | **Details**                                                 |
+--------------+----------+---------+-------------------------------------------------------------+
| releaseAgent | address  | public  | Variable containing the address of the Release Agent        |
+--------------+----------+---------+-------------------------------------------------------------+
| released     | bool     | public  | Variable for whether the token is released or not           |
|              |          |         |                                                             |
|              |          |         | **Default:** *false*                                        |
+--------------+----------+---------+-------------------------------------------------------------+

.. ------------------------------------------------------------------------------------------------

.. _releaseable-token-enums:

3. Enums
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

There are no enums for the `ReleaseableToken`_ Smart Contract.

.. ------------------------------------------------------------------------------------------------

.. _releaseable-token-events:

4. Events
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The following events exist for the `ReleaseableToken`_ Smart Contract:

+----------------------+--------------------------------------------------------------------------+
| **Name**             | **Description**                                                          |
+----------------------+--------------------------------------------------------------------------+
| `Released`_          | Event to notify when a token is released                                 |
+----------------------+--------------------------------------------------------------------------+
| `ReleaseAgentSet`_   | Event to notify when a releaseAgent is set                               |
+----------------------+--------------------------------------------------------------------------+
| `TransferAgentSet`_  | Event to notify when a Transfer Agent is set or updated                  |
+----------------------+--------------------------------------------------------------------------+

.. ------------------------------------------------------------------------------------------------

.. _releaseable-token-released:

Released
'''''''''''''''''''''

+------------------+------------------------------------------------------------------------------+
| **Event Name:**  | Released                                                                     |
+------------------+------------------------------------------------------------------------------+
| **Description:** | Event to notify when a token is released                                     |
+------------------+------------------------------------------------------------------------------+

Usage
^^^^^^^^^^^^^^^^^^^^^

The `Released`_ event has the following usage syntax:

.. code-block:: c
   :caption: **Released Usage Example**

    Released();

.. ------------------------------------------------------------------------------------------------

.. _releaseable-token-release-agent-set:

ReleaseAgentSet
'''''''''''''''''''''

+------------------+------------------------------------------------------------------------------+
| **Event Name:**  | ReleaseAgentSet                                                              |
+------------------+------------------------------------------------------------------------------+
| **Description:** | Event to notify when a releaseAgent is set                                   |
+------------------+------------------------------------------------------------------------------+

Usage
^^^^^^^^^^^^^^^^^^^^^

The `ReleaseAgentSet`_ event has the following usage syntax and arguments:

+---+---------------+----------+--------------+---------------------------------------------------+
|   | **Argument**  | **Type** | **Indexed?** | **Details**                                       |
+---+---------------+----------+--------------+---------------------------------------------------+
| 1 | _releaseAgent | address  | Yes          | Address of new *releaseAgent*                     |
+---+---------------+----------+--------------+---------------------------------------------------+

.. code-block:: c
   :caption: **ReleaseAgentSet Usage Example**

    ReleaseAgentSet(0x123456789abcdefghijklmnopqrstuvwxyz98765);

.. ------------------------------------------------------------------------------------------------

.. _releaseable-token-transfer-agent-set:

TransferAgentSet
'''''''''''''''''''''

+------------------+------------------------------------------------------------------------------+
| **Event Name:**  | TransferAgentSet                                                             |
+------------------+------------------------------------------------------------------------------+
| **Description:** | Event to notify when a Transfer Agent is set or updated                      |
+------------------+------------------------------------------------------------------------------+

Usage
^^^^^^^^^^^^^^^^^^^^^

The `TransferAgentSet`_ event has the following usage syntax and arguments:

+---+---------------+----------+--------------+---------------------------------------------------+
|   | **Argument**  | **Type** | **Indexed?** | **Details**                                       |
+---+---------------+----------+--------------+---------------------------------------------------+
| 1 | _releaseAgent | address  | Yes          | Address of new Transfer Agent                     |
+---+---------------+----------+--------------+---------------------------------------------------+
| 2 | _status       | bool     | Yes          | Whether Transfer Agent is enabled or disabled     |
+---+---------------+----------+--------------+---------------------------------------------------+

.. code-block:: c
   :caption: **TransferAgentSet Usage Example**

    TransferAgentSet(0x123456789abcdefghijklmnopqrstuvwxyz98765, true);

.. ------------------------------------------------------------------------------------------------

.. _releaseable-token-mappings:

5. Mappings
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The following mappings exist for the `ReleaseableToken`_ Smart Contract:

+----------------+--------------------+-----------------------------------------------------------+
| **Name**       |  **Mapping Type**  | **Description**                                           |
+----------------+--------------------+-----------------------------------------------------------+
| transferAgents | address => uint256 | Mapping to status of transfer agents                      |
+----------------+--------------------+-----------------------------------------------------------+

.. ------------------------------------------------------------------------------------------------

.. _releaseable-token-modifiers:

6. Modifiers
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The following modifiers exist for the `ReleaseableToken`_ Smart Contract:

+---------------------+---------------------------------------------------------------------------+
| **Name**            |  **Description**                                                          |
+---------------------+---------------------------------------------------------------------------+
| `canTransfer`_      | Modifier that checks whether token is in a transferable state             |
+---------------------+---------------------------------------------------------------------------+
| `inReleaseState`_   | Modifier that checks whether token is in a given released state           |
+---------------------+---------------------------------------------------------------------------+
| `onlyReleaseAgent`_ | Modifier that checks whether the executor is the *releaseAgent*           |
+---------------------+---------------------------------------------------------------------------+

.. ------------------------------------------------------------------------------------------------

.. _releaseable-token-can-transfer:

canTransfer
'''''''''''''''''''''

+--------------------+----------------------------------------------------------------------------+
| **Modifier Name:** | canTransfer                                                                |
+--------------------+----------------------------------------------------------------------------+
| **Description:**   | Modifier that checks whether token is in a transferable state              |
+--------------------+----------------------------------------------------------------------------+

Code
^^^^^^^^^^^^^^^^^^^^^

The code for the `canTransfer`_ modifier is as follows:

.. code-block:: c
    :caption: **canTransfer 0.0.9 Code**

    modifier canTransfer(address _sender) {
        require(released || transferAgents[_sender]);
        _;
    }

The `canTransfer`_ function performs the following:

 - Checks that the *released* variable is true and that the *_sender* argument is in the 
   *transferAgents* mapping otherwise it throws

.. ------------------------------------------------------------------------------------------------

.. _releaseable-token-in-release-state:

inReleaseState
'''''''''''''''''''''

+--------------------+----------------------------------------------------------------------------+
| **Modifier Name:** | inReleaseState                                                             |
+--------------------+----------------------------------------------------------------------------+
| **Description:**   | Modifier that checks whether token is in a given released state            |
+--------------------+----------------------------------------------------------------------------+

Code
^^^^^^^^^^^^^^^^^^^^^

The code for the `inReleaseState`_ modifier is as follows:

.. code-block:: c
    :caption: **inReleaseState 0.0.9 Code**
   
    modifier inReleaseState(bool releaseState) {
        require(releaseState == released);
        _;
    }

The `inReleaseState`_ function performs the following:

 - Checks that the supplied *releaseState* argument matches the *released* variable otherwise it 
   throws
   
.. ------------------------------------------------------------------------------------------------

.. _releaseable-token-only-release-agent:

onlyReleaseAgent
'''''''''''''''''''''

+--------------------+----------------------------------------------------------------------------+
| **Modifier Name:** | onlyReleaseAgent                                                           |
+--------------------+----------------------------------------------------------------------------+
| **Description:**   | Modifier that checks whether the executor is the *releaseAgent*            |
+--------------------+----------------------------------------------------------------------------+

Code
^^^^^^^^^^^^^^^^^^^^^

The code for the `onlyReleaseAgent`_ modifier is as follows:

.. code-block:: c
    :caption: **onlyReleaseAgent 0.0.9 Code**

    modifier onlyReleaseAgent() {
        require(msg.sender == releaseAgent);
        _;
    }

The `onlyReleaseAgent`_ function performs the following:

 - Checks that the transaction sender address matches the **releaseAgent* address otherwise it throws

.. ------------------------------------------------------------------------------------------------

.. _releaseable-token-functions:

7. Functions
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The following functions exist for the `ReleaseableToken`_ Smart Contract:

+-------------------------+-----------------------------------------------------------------------+
| **Name**                | **Description**                                                       |
+-------------------------+-----------------------------------------------------------------------+
| `setReleaseAgent`_      | Function to set the* *releaseAgent* variable                          |
+-------------------------+-----------------------------------------------------------------------+
| `setTransferAgent`_     | Function to set or update the* *transferAgents* mapping               |
+-------------------------+-----------------------------------------------------------------------+
| `releaseTokenTransfer`_ | Function to release the token                                         |
+-------------------------+-----------------------------------------------------------------------+
| `transfer`_             | Function to override :ref:`basic-token-transfer` function             |
+-------------------------+-----------------------------------------------------------------------+
| `transferFrom`_         | Function to override :ref:`std-token-transfer-from` function          |
+-------------------------+-----------------------------------------------------------------------+

.. ------------------------------------------------------------------------------------------------

.. _releaseable-token-set-release-agent:

setReleaseAgent
'''''''''''''''''''''

+--------------------------+----------------------------------------------------------------------+
| **Function Name:**       | setReleaseAgent                                                      |
+--------------------------+----------------------------------------------------------------------+
| **Description:**         | Function to set the* *releaseAgent* variable                         |
+--------------------------+----------------------------------------------------------------------+
| **Function Type:**       | N/A                                                                  |
+--------------------------+----------------------------------------------------------------------+
| **Function Visibility:** | Public                                                               |
+--------------------------+----------------------------------------------------------------------+
| **Function Modifiers:**  | :ref:`onlyOwner <ownable-only-owner>`, `inReleaseState`_             |
+--------------------------+----------------------------------------------------------------------+
| **Return Type:**         | None                                                                 |
+--------------------------+----------------------------------------------------------------------+
| **Return Details:**      | N/A                                                                  |
+--------------------------+----------------------------------------------------------------------+

Code
^^^^^^^^^^^^^^^^^^^^^

The code for the `setReleaseAgent`_ function is as follows:

.. code-block:: c
    :caption: **setReleaseAgent 0.0.9 Code**

    function setReleaseAgent(address addr) public onlyOwner inReleaseState(false) {
        ReleaseAgentSet(addr);
        // We don't do interface check here as we might want to a normal wallet address to act as a release agent
        releaseAgent = addr;
    }

The `setReleaseAgent`_ function performs the following:

 - Fires the `ReleaseAgentSet`_ event
 - Sets the *releaseAgent* variable to the *addr* argument

Usage
^^^^^^^^^^^^^^^^^^^^^

The `setReleaseAgent`_ function has the following usage syntax:

.. code-block:: c
   :caption: **setReleaseAgent Usage Example**

    setReleaseAgent(0x123456789abcdefghijklmnopqrstuvwxyz98765);

.. ------------------------------------------------------------------------------------------------

.. _releaseable-token-set-transfer-agent:

setTransferAgent
'''''''''''''''''''''

+--------------------------+----------------------------------------------------------------------+
| **Function Name:**       | setTransferAgent                                                     |
+--------------------------+----------------------------------------------------------------------+
| **Description:**         | Function to set or update the* *transferAgents* mapping              |
+--------------------------+----------------------------------------------------------------------+
| **Function Type:**       | N/A                                                                  |
+--------------------------+----------------------------------------------------------------------+
| **Function Visibility:** | Public                                                               |
+--------------------------+----------------------------------------------------------------------+
| **Function Modifiers:**  | :ref:`onlyOwner <ownable-only-owner>`, `inReleaseState`_             |
+--------------------------+----------------------------------------------------------------------+
| **Return Type:**         | None                                                                 |
+--------------------------+----------------------------------------------------------------------+
| **Return Details:**      | N/A                                                                  |
+--------------------------+----------------------------------------------------------------------+

Code
^^^^^^^^^^^^^^^^^^^^^

The code for the `setTransferAgent`_ function is as follows:

.. code-block:: c
    :caption: **setTransferAgent 0.0.9 Code**

    function setTransferAgent(address addr, bool state) public onlyOwner inReleaseState(false) {
        TransferAgentSet(addr, state);
        transferAgents[addr] = state;
    }

The `setTransferAgent`_ function performs the following:

 - Fires the `TransferAgentSet`_ event
 - Add the supplied *addr* and *state* to the *transferAgents* mapping

Usage
^^^^^^^^^^^^^^^^^^^^^

The `setTransferAgent`_ function has the following usage syntax:

.. code-block:: c
    :caption: **setTransferAgent Usage Example**

    setTransferAgent(0x123456789abcdefghijklmnopqrstuvwxyz98765, true);

.. ------------------------------------------------------------------------------------------------

.. _releaseable-token-release-token-transfer:

releaseTokenTransfer
'''''''''''''''''''''

+--------------------------+----------------------------------------------------------------------+
| **Function Name:**       | releaseTokenTransfer                                                 |
+--------------------------+----------------------------------------------------------------------+
| **Description:**         | Function to release the token                                        |
+--------------------------+----------------------------------------------------------------------+
| **Function Type:**       | N/A                                                                  |
+--------------------------+----------------------------------------------------------------------+
| **Function Visibility:** | Public                                                               |
+--------------------------+----------------------------------------------------------------------+
| **Function Modifiers:**  | `onlyReleaseAgent`_                                                  |
+--------------------------+----------------------------------------------------------------------+
| **Return Type:**         | None                                                                 |
+--------------------------+----------------------------------------------------------------------+
| **Return Details:**      | N/A                                                                  |
+--------------------------+----------------------------------------------------------------------+

Code
^^^^^^^^^^^^^^^^^^^^^

The code for the `releaseTokenTransfer`_ function is as follows:

.. code-block:: c
    :caption: **releaseTokenTransfer 0.0.9 Code**

    function releaseTokenTransfer() public onlyReleaseAgent {
        Released();
        released = true;
    }

The `releaseTokenTransfer`_ function performs the following:

 - Fires the `Released`_ event
 - Sets the *released* variable to true

Usage
^^^^^^^^^^^^^^^^^^^^^

The `releaseTokenTransfer`_ function has the following usage syntax:

.. code-block:: c
    :caption: **releaseTokenTransfer Usage Example**

    releaseTokenTransfer();

.. ------------------------------------------------------------------------------------------------

.. _releaseable-token-transfer:

transfer
'''''''''''''''''''''

+--------------------------+----------------------------------------------------------------------+
| **Function Name:**       | transfer                                                             |
+--------------------------+----------------------------------------------------------------------+
| **Description:**         | Function to override transfer function                               |
+--------------------------+----------------------------------------------------------------------+
| **Function Type:**       | N/A                                                                  |
+--------------------------+----------------------------------------------------------------------+
| **Function Visibility:** | Public                                                               |
+--------------------------+----------------------------------------------------------------------+
| **Function Modifiers:**  | `canTransfer`_                                                       |
+--------------------------+----------------------------------------------------------------------+
| **Return Type:**         | bool                                                                 |
+--------------------------+----------------------------------------------------------------------+
| **Return Details:**      | Returns whether the transfer was successful or not                   |
+--------------------------+----------------------------------------------------------------------+

Code
^^^^^^^^^^^^^^^^^^^^^

The code for the `transfer`_ function is as follows:

.. code-block:: c
    :caption: **transfer 0.0.9 Code**

    function transfer(address _to, 
                      uint _value) public canTransfer(msg.sender) returns (bool success) {
        return super.transfer(_to, _value);
    }

The `transfer`_ function performs the following:

 - calls the :ref:`basic-token-transfer` super function

Usage
^^^^^^^^^^^^^^^^^^^^^

The `transfer`_ function has the following usage syntax:

.. code-block:: c
   :caption: **transfer Usage Example**

    transfer(0x123456789abcdefghijklmnopqrstuvwxyz98765, true);

.. ------------------------------------------------------------------------------------------------

.. _releaseable-token-transfer-from:

transferFrom
'''''''''''''''''''''

+--------------------------+----------------------------------------------------------------------+
| **Function Name:**       | transferFrom                                                         |
+--------------------------+----------------------------------------------------------------------+
| **Description:**         | Function to override transferFrom function                           |
+--------------------------+----------------------------------------------------------------------+
| **Function Type:**       | N/A                                                                  |
+--------------------------+----------------------------------------------------------------------+
| **Function Visibility:** | Public                                                               |
+--------------------------+----------------------------------------------------------------------+
| **Function Modifiers:**  | `canTransfer`_                                                       |
+--------------------------+----------------------------------------------------------------------+
| **Return Type:**         | bool                                                                 |
+--------------------------+----------------------------------------------------------------------+
| **Return Details:**      | Returns whether the transferFrom was successful or not               |
+--------------------------+----------------------------------------------------------------------+

Code
^^^^^^^^^^^^^^^^^^^^^

The code for the `transferFrom`_ function is as follows:

.. code-block:: c
    :caption: **transferFrom 0.0.9 Code**

    function transferFrom(address _from, 
                          address _to, 
                          uint _value) public canTransfer(_from) returns (bool success) {
        return super.transferFrom(_from, _to, _value);
    }

The `transferFrom`_ function performs the following:

 - calls the :ref:`std-token-transfer-from` super function

Usage
^^^^^^^^^^^^^^^^^^^^^

The `transferFrom`_ function has the following usage syntax:

.. code-block:: c
   :caption: **transferFrom Usage Example**

    transferFrom(0x123456789abcdefghijklmnopqrstuvwxyz98765, 
                 0x423456789abcdefghijklmnopqrstuvwxyz12345,
                 true);

.. ------------------------------------------------------------------------------------------------

.. ------------------------------------------------------------------------------------------------
.. URLs used throughout this page
.. ------------------------------------------------------------------------------------------------

.. _Zeppelin Solidity: https://github.com/OpenZeppelin/zeppelin-solidity
.. _Token Market: https://github.com/TokenMarketNet/ico/
.. _Apache 2 License: https://raw.githubusercontent.com/TruLtd/tru-reputation-token/master/LICENSE
.. _ReleaseableToken Source: https://raw.githubusercontent.com/TokenMarketNet/ico/master/contracts/ReleasableToken.sol
.. ------------------------------------------------------------------------------------------------
.. END OF RELEASEABLETOKEN
.. ------------------------------------------------------------------------------------------------