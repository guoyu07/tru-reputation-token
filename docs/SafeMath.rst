.. ------------------------------------------------------------------------------------------------
.. SAFEMATH
.. ------------------------------------------------------------------------------------------------

.. _safe-math:

SafeMath
---------------------------------------

+-----------------------+-------------------------------------------------------------------------+
| **Title:**            | SafeMath                                                                |
+-----------------------+-------------------------------------------------------------------------+
| **Description:**      | `Zeppelin Solidity`_ Library for Math operations with safety checks     |
|                       | throws on error.                                                        |
+-----------------------+-------------------------------------------------------------------------+
| **Author:**           | Smart Contract Solutions, Inc.                                          |
+-----------------------+-------------------------------------------------------------------------+
| **Solidity Version:** | ^0.4.18                                                                 |
+-----------------------+-------------------------------------------------------------------------+
| **Relative Path:**    | ./contracts/supporting/SafeMath.sol                                     |
+-----------------------+-------------------------------------------------------------------------+
| **License:**          | `MIT License`_                                                          |
+-----------------------+-------------------------------------------------------------------------+
| **Current Version:**  | 1.4.0                                                                   |
+-----------------------+-------------------------------------------------------------------------+
| **Original Source:**  | `SafeMath Source`_                                                      |
+-----------------------+-------------------------------------------------------------------------+

No modifications have been made to this Solidity Library from the original source.

.. ------------------------------------------------------------------------------------------------

.. _safe-math-imports:

1. Imports & Dependencies
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

There are no imports and dependencies exist for the `SafeMath`_ Solidity Library.

.. ------------------------------------------------------------------------------------------------

.. _safe-math-variables:

2. Variables
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

There are no variables for the `SafeMath`_ Solidity Library.

.. ------------------------------------------------------------------------------------------------

.. _safe-math-enums:

3. Enums
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

There are no enums for the `SafeMath`_ Solidity Library.

.. ------------------------------------------------------------------------------------------------

.. _safe-math-events:

4. Events
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

There are no events for the `SafeMath`_ Solidity Library.

.. ------------------------------------------------------------------------------------------------

.. _safe-math-mappings:

5. Mappings
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

There are no mappings for the `SafeMath`_ Solidity Library.

.. ------------------------------------------------------------------------------------------------

.. _safe-math-modifiers:

6. Modifiers
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

There are no modifiers for the `SafeMath`_ Solidity Library.

.. ------------------------------------------------------------------------------------------------

.. _safe-math-functions:

7. Functions
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The following functions exist for the `SafeMath`_ Smart Contract:

+----------+--------------------------------------------------------------------------------------+
| **Name** | **Description**                                                                      |
+----------+--------------------------------------------------------------------------------------+
| `mul`_   | Function to safely multiply two numbers                                              |
+----------+--------------------------------------------------------------------------------------+
| `div`_   | Function to safely divide one number from another                                    |
+----------+--------------------------------------------------------------------------------------+
| `sub`_   | Function to safely subtract one number from another                                  |
+----------+--------------------------------------------------------------------------------------+
| `add`_   | Function to safely add two numbers                                                   |
+----------+--------------------------------------------------------------------------------------+

.. ------------------------------------------------------------------------------------------------

.. _safe-math-mul:

mul
'''''''''''''''''''''

+--------------------------+----------------------------------------------------------------------+
| **Function Name:**       | mul                                                                  |
+--------------------------+----------------------------------------------------------------------+
| **Description:**         | Function to safely multiply two numbers                              |
+--------------------------+----------------------------------------------------------------------+
| **Function Type:**       | Pure                                                                 |
+--------------------------+----------------------------------------------------------------------+
| **Function Visibility:** | Internal                                                             |
+--------------------------+----------------------------------------------------------------------+
| **Function Modifiers:**  | None                                                                 |
+--------------------------+----------------------------------------------------------------------+
| **Return Type:**         | uin256                                                               |
+--------------------------+----------------------------------------------------------------------+
| **Return Details:**      | Returns the result of the multiplication                             |
+--------------------------+----------------------------------------------------------------------+

Code
^^^^^^^^^^^^^^^^^^^^^

The code for the `mul`_ function is as follows:

.. code-block:: c
    :caption: **mul 1.4.0 Code**

    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a == 0) {
            return 0;
        }
        uint256 c = a * b;
        assert(c / a == b);
        return c;
    }

The `mul`_ function performs the following:

 - if the *a* argument is zero, if it is returns zero
 - Multiply *a* argument by *b* argument
 - Checks that the result divided by *a* argument equals the *b* argument. If not, it will throw
 - Return the result

Usage
^^^^^^^^^^^^^^^^^^^^^

The `mul`_ function has the following usage syntax:

.. code-block:: c
    :caption: **mul Usage Example**

    mul(2,2);

.. ------------------------------------------------------------------------------------------------

.. _safe-math-div:

div
'''''''''''''''''''''

+--------------------------+----------------------------------------------------------------------+
| **Function Name:**       | div                                                                  |
+--------------------------+----------------------------------------------------------------------+
| **Description:**         | Function to safely divide one number from another                    |
+--------------------------+----------------------------------------------------------------------+
| **Function Type:**       | Pure                                                                 |
+--------------------------+----------------------------------------------------------------------+
| **Function Visibility:** | Internal                                                             |
+--------------------------+----------------------------------------------------------------------+
| **Function Modifiers:**  | None                                                                 |
+--------------------------+----------------------------------------------------------------------+
| **Return Type:**         | uin256                                                               |
+--------------------------+----------------------------------------------------------------------+
| **Return Details:**      | Returns the result of the division                                   |
+--------------------------+----------------------------------------------------------------------+

Code
^^^^^^^^^^^^^^^^^^^^^

The code for the `div`_ function is as follows:

.. code-block:: c
    :caption: **div 1.4.0 Code**

    function div(uint256 a, uint256 b) internal pure returns (uint256) {

        uint256 c = a / b;

        return c;
    }

The `div`_ function performs the following:

 - Divide *a* argument by *b* argument
 - Return the result

Usage
^^^^^^^^^^^^^^^^^^^^^

The `div`_ function has the following usage syntax:

.. code-block:: c
    :caption: **div Usage Example**

    div(2,2);

.. ------------------------------------------------------------------------------------------------

.. _safe-math-sub:

sub
'''''''''''''''''''''

+--------------------------+----------------------------------------------------------------------+
| **Function Name:**       | sub                                                                  |
+--------------------------+----------------------------------------------------------------------+
| **Description:**         | Function to safely subtract one number from another                  |
+--------------------------+----------------------------------------------------------------------+
| **Function Type:**       | Pure                                                                 |
+--------------------------+----------------------------------------------------------------------+
| **Function Visibility:** | Internal                                                             |
+--------------------------+----------------------------------------------------------------------+
| **Function Modifiers:**  | None                                                                 |
+--------------------------+----------------------------------------------------------------------+
| **Return Type:**         | uin256                                                               |
+--------------------------+----------------------------------------------------------------------+
| **Return Details:**      | Returns the result of the subtraction                                |
+--------------------------+----------------------------------------------------------------------+

Code
^^^^^^^^^^^^^^^^^^^^^

The code for the `sub`_ function is as follows:

.. code-block:: c
    :caption: **sub 1.4.0 Code**

    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        assert(b <= a);
        return a - b;
    }

The `sub`_ function performs the following:

 - Checks the *b* argument is equal to or less than the *a* argument. If not, it will throw
 - Calculate and result the *a* argument minus the *b* argument

Usage
^^^^^^^^^^^^^^^^^^^^^

The `sub`_ function has the following usage syntax:

.. code-block:: c
    :caption: **sub Usage Example**

    sub(2,1);

.. ------------------------------------------------------------------------------------------------

.. _safe-math-add:

add
'''''''''''''''''''''

+--------------------------+----------------------------------------------------------------------+
| **Function Name:**       | add                                                                  |
+--------------------------+----------------------------------------------------------------------+
| **Description:**         | Function to safely add two numbers                                   |
+--------------------------+----------------------------------------------------------------------+
| **Function Type:**       | Pure                                                                 |
+--------------------------+----------------------------------------------------------------------+
| **Function Visibility:** | Internal                                                             |
+--------------------------+----------------------------------------------------------------------+
| **Function Modifiers:**  | None                                                                 |
+--------------------------+----------------------------------------------------------------------+
| **Return Type:**         | uin256                                                               |
+--------------------------+----------------------------------------------------------------------+
| **Return Details:**      | Returns the result of the addition                                   |
+--------------------------+----------------------------------------------------------------------+

Code
^^^^^^^^^^^^^^^^^^^^^

The code for the `add`_ function is as follows:

.. code-block:: c
    :caption: **add 1.4.0 Code**

    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        assert(c >= a);
        return c;
    }

The `add`_ function performs the following:

 - Adds *a* argument to *b* argument
 - Checks that the result is greater than the *a* argument. If not, it will throw.
 - Returns the result

Usage
^^^^^^^^^^^^^^^^^^^^^

The `add`_ function has the following usage syntax:

.. code-block:: c
   :caption: **add Usage Example**

    add(2,2);


.. ------------------------------------------------------------------------------------------------
.. URLs used throughout this page
.. ------------------------------------------------------------------------------------------------

.. _Zeppelin Solidity: https://github.com/OpenZeppelin/zeppelin-solidity
.. _MIT License: https://raw.githubusercontent.com/OpenZeppelin/zeppelin-solidity/master/LICENSE
.. _SafeMath Source: https://raw.githubusercontent.com/OpenZeppelin/zeppelin-solidity/v1.4.0/contracts/math/SafeMath.sol

.. ------------------------------------------------------------------------------------------------
.. END OF SAFEMATH
.. ------------------------------------------------------------------------------------------------


