.. ------------------------------------------------------------------------------------------------
.. TRUADDRESS
.. ------------------------------------------------------------------------------------------------

.. _tru-address:

TruAddress
---------------------------------------

+-----------------------+-------------------------------------------------------------------------+
| **Title:**            | TruAddress                                                              |
+-----------------------+-------------------------------------------------------------------------+
| **Description:**      | Library of helper functions surrounding the Solidity Address type       |
+-----------------------+-------------------------------------------------------------------------+
| **Author:**           | Ian Bray, Tru Ltd                                                       |
+-----------------------+-------------------------------------------------------------------------+
| **Solidity Version:** | ^0.4.18                                                                 |
+-----------------------+-------------------------------------------------------------------------+
| **Relative Path:**    | ./contracts/supporting/TruAddress.sol                                   |
+-----------------------+-------------------------------------------------------------------------+
| **License:**          | `Apache 2 License`_                                                     |
+-----------------------+-------------------------------------------------------------------------+
| **Current Version:**  | 0.0.9                                                                   |
+-----------------------+-------------------------------------------------------------------------+

.. ------------------------------------------------------------------------------------------------

.. _tru-address-imports:

1. Imports & Dependencies
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The following imports and dependencies exist for the `TruAddress`_ Solidity Library:

+------------------+------------------------------------------------------------------------------+
| **Name**         | **Description**                                                              |
+------------------+------------------------------------------------------------------------------+
| :ref:`safe-math` | `Zeppelin Solidity`_ Library to perform mathematics safely inside Solidity   |
+------------------+------------------------------------------------------------------------------+

.. ------------------------------------------------------------------------------------------------

.. _tru-address-variables:

2. Variables
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

There are no variables for the `TruAddress`_ Solidity Library.

.. ------------------------------------------------------------------------------------------------

.. _tru-address-enums:

3. Enums
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

There are no enums for the `TruAddress`_ Solidity Library.

.. ------------------------------------------------------------------------------------------------

.. _tru-address-events:

4. Events
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

There are no events for the `TruAddress`_ Solidity Library.

.. ------------------------------------------------------------------------------------------------

.. _tru-address-mappings:

5. Mappings
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

There are no mappings for the `TruAddress`_ Solidity Library.

.. ------------------------------------------------------------------------------------------------

.. _tru-address-modifiers:

6. Modifiers
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

There are no modifiers for the `TruAddress`_ Solidity Library.

.. ------------------------------------------------------------------------------------------------

.. _tru-address-functions:

7. Functions
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The following functions exist for the `TruAddress`_ Solidity Library:

+-------------------------+-----------------------------------------------------------------------+
| **Name**                |  **Description**                                                      |
+-------------------------+-----------------------------------------------------------------------+
| `isValidAddress`_       | Function to validate a supplied ethereum address                      |
+-------------------------+-----------------------------------------------------------------------+
| `toString`_             | Function to convert an Address to a String                            |
+-------------------------+-----------------------------------------------------------------------+
| `addressLength`_        | Function to return the length of a given Address                      |
+-------------------------+-----------------------------------------------------------------------+

.. ------------------------------------------------------------------------------------------------

.. _tru-address-is-valid-address:

isValidAddress
'''''''''''''''''''''

+--------------------------+-----------------------------------------------------------------------+
| **Function Name:**       | isValidAddress                                                        |
+--------------------------+-----------------------------------------------------------------------+
| **Description:**         | Function to validate a supplied address is the correct length & format|
+--------------------------+-----------------------------------------------------------------------+
| **Function Type:**       | Pure                                                                  |
+--------------------------+-----------------------------------------------------------------------+
| **Function Visibility:** | Public                                                                |
+--------------------------+-----------------------------------------------------------------------+
| **Function Modifiers:**  | N/A                                                                   |
+--------------------------+-----------------------------------------------------------------------+
| **Return Type:**         | Bool                                                                  |
+--------------------------+-----------------------------------------------------------------------+
| **Return Details:**      | Returns true for valid input address; false for invalid input address |
+--------------------------+-----------------------------------------------------------------------+

Code
^^^^^^^^^^^^^^^^^^^^^

The code for the `isValidAddress`_ is as follows:

.. code-block:: c
    :caption: **isValidAddress 0.0.9 Code**

    function isValidAddress(address input) public pure returns (bool) {
        uint addrLength = addressLength(input);
        return ((addrLength == 20) && (input != address(0)));
    }

The `isValidAddress`_ function performs the following:

 - Retrieves the address length
 - returns a bool check that the address is both 20 characters long and not an empty address

Usage
^^^^^^^^^^^^^^^^^^^^^

The `isValidAddress`_ function has the following usage syntax and arguments:

+---+--------------+----------+-------------------------------------------------------------------+
|   | **Argument** | **Type** | **Details**                                                       |
+---+--------------+----------+-------------------------------------------------------------------+
| 1 |  input       | address  | Address to be validated                                           |
+---+--------------+----------+-------------------------------------------------------------------+

.. code-block:: c
    :caption: **isValidAddress Usage Example**

    isValidAddress(0x123456789abcdefghijklmnopqrstuvwxyz98765);

.. ------------------------------------------------------------------------------------------------

.. _tru-address-to-string:

toString
'''''''''''''''''''''

+--------------------------+-----------------------------------------------------------------------+
| **Function Name:**       | toString                                                              |
+--------------------------+-----------------------------------------------------------------------+
| **Description:**         | Function to convert an address to a string                            |
+--------------------------+-----------------------------------------------------------------------+
| **Function Type:**       | Pure                                                                  |
+--------------------------+-----------------------------------------------------------------------+
| **Function Visibility:** | Internal                                                              |
+--------------------------+-----------------------------------------------------------------------+
| **Function Modifiers:**  | N/A                                                                   |
+--------------------------+-----------------------------------------------------------------------+
| **Return Type:**         | String                                                                |
+--------------------------+-----------------------------------------------------------------------+
| **Return Details:**      | Returns the address in string format                                  |
+--------------------------+-----------------------------------------------------------------------+

Code
^^^^^^^^^^^^^^^^^^^^^

The code for the `toString`_ is as follows:

.. code-block:: c
    :caption: **toString 0.0.9 Code**

    function toString(address input) internal pure returns (string) {
        bytes memory byteArray = new bytes(20);
        for (uint i = 0; i < 20; i++) {
            byteArray[i] = byte(uint8(uint(input) / (2**(8*(19 - i)))));
        }
        return string(byteArray);
    }

The `toString`_ function performs the following:

 - Creates a 20 byte array
 - iterates through the address and converts each byte
 - returns the byteArray as a string

Usage
^^^^^^^^^^^^^^^^^^^^^

The `toString`_ function has the following usage syntax and arguments:

+---+--------------+----------+-------------------------------------------------------------------+
|   | **Argument** | **Type** | **Details**                                                       |
+---+--------------+----------+-------------------------------------------------------------------+
| 1 |  input       | address  | Address to be converted to a string                               |
+---+--------------+----------+-------------------------------------------------------------------+

.. code-block:: c
    :caption: **toString Usage Example**

    toString(0x123456789abcdefghijklmnopqrstuvwxyz98765);

.. ------------------------------------------------------------------------------------------------

.. _tru-address-address-length:

addressLength
'''''''''''''''''''''

+--------------------------+-----------------------------------------------------------------------+
| **Function Name:**       | addressLength                                                         |
+--------------------------+-----------------------------------------------------------------------+
| **Description:**         | Function to return the length of an address                           |
+--------------------------+-----------------------------------------------------------------------+
| **Function Type:**       | Pure                                                                  |
+--------------------------+-----------------------------------------------------------------------+
| **Function Visibility:** | Internal                                                              |
+--------------------------+-----------------------------------------------------------------------+
| **Function Modifiers:**  | N/A                                                                   |
+--------------------------+-----------------------------------------------------------------------+
| **Return Type:**         | String                                                                |
+--------------------------+-----------------------------------------------------------------------+
| **Return Details:**      | Returns the length of the supplied address                            |
+--------------------------+-----------------------------------------------------------------------+

Code
^^^^^^^^^^^^^^^^^^^^^

The code for the `addressLength`_ is as follows:

.. code-block:: c
   :caption: **addressLength 0.0.9 Code**

    function addressLength(address input) internal pure returns (uint) {
        string memory addressStr = toString(input);
        return bytes(addressStr).length;
    }

The `addressLength`_ function performs the following:

 - Converts the supplied address to a string
 - returns the byte length of the string

Usage
^^^^^^^^^^^^^^^^^^^^^

The `addressLength`_ function has the following usage syntax and arguments:

+---+--------------+----------+-------------------------------------------------------------------+
|   | **Argument** | **Type** | **Details**                                                       |
+---+--------------+----------+-------------------------------------------------------------------+
| 1 |  input       | address  | Address to calculate the length of                                |
+---+--------------+----------+-------------------------------------------------------------------+

.. code-block:: c
   :caption: **addressLength Usage Example**

    addressLength(0x123456789abcdefghijklmnopqrstuvwxyz98765);

.. ------------------------------------------------------------------------------------------------
.. URLs used throughout this page
.. ------------------------------------------------------------------------------------------------

.. _Zeppelin Solidity: https://github.com/OpenZeppelin/zeppelin-solidity
.. _Apache 2 License: https://raw.githubusercontent.com/TruLtd/tru-reputation-token/master/LICENSE

.. ------------------------------------------------------------------------------------------------
.. END OF TRUADDRESS
.. ------------------------------------------------------------------------------------------------


