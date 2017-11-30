Acknowledgments
==================

`Tru Ltd`_ would like the make the following acknowledgments:

Open Zepplin
-------------

The `Tru Reputation Token`_ Project makes extensive use and has been inspired by the 
`Zeppelin Solidity`_ by `Open Zeppelin`_. Specifically the following Smart Contracts and Libraries 
are used by the `Tru Reputation Token`_:

+-----------------------+---------------+
|   **Name**            | **Modified?** |
+-----------------------+---------------+
| **BasicToken.sol**    |      No       |
+-----------------------+---------------+
| **ERC20.sol**         |      No       |
+-----------------------+---------------+
| **ERC20Basic.sol**    |      No       |
+-----------------------+---------------+
| **MintableToken.sol** |      Yes      |
+-----------------------+---------------+
| **Ownable.sol**       |      No       |
+-----------------------+---------------+
| **SafeMath.sol**      |      No       |
+-----------------------+---------------+
| **StandardToken.sol** |      No       |
+-----------------------+---------------+

To ensure security, and as part of good community practice, the coverage testing in this 
Repository covers all non-trivial libraries consumed from the `Zeppelin Solidity`_ framework, 
and will feedback any issues encountered with the framework during any and all testing.

All Open Zeppelin Smart Contracts, libraries and supporting functionality used within this work 
are licensed under the 
`MIT License <https://github.com/OpenZeppelin/zeppelin-solidity/blob/master/LICENSE>`_. 

TokenMarket
-------------

All TokenMarket Smart Contracts, libraries and supporting functionality used within this work are 
licensed under the 
`Apache 2.0 License <https://github.com/TokenMarketNet/ico/blob/master/LICENSE.txt>`_. The 
following items are covered by these terms:


+--------------------------+---------------+
|   **Name**               | **Modified?** |
+--------------------------+---------------+
| **Haltable.sol**         |      Yes      |
+--------------------------+---------------+
| **ReleasableToken.sol**  |      Yes      |
+--------------------------+---------------+
| **UpgradeableToken.sol** |      Yes      |
+--------------------------+---------------+
| **UpgradeAgent.sol**     |      Yes      |
+--------------------------+---------------+

The original unmodified source files are under copyright of **TokenMarket Ltd** and can be 
obtained in the `TokenMarket ICO Github Repository <https://github.com/TokenMarketNet/ico>`_

.. ------------------------------------------------------------------------------------------------
.. URLs used throughout this page
.. ------------------------------------------------------------------------------------------------

.. _Tru Ltd: https://tru.ltd
.. _Tru Reputation Token: https://github.com/TruLtd/tru-reputation-token
.. _Zeppelin Solidity: https://github.com/OpenZeppelin/zeppelin-solidity
.. _Open Zeppelin: https://openzeppelin.org/