.. ------------------------------------------------------------------------------------------------
.. AUDITING
.. ------------------------------------------------------------------------------------------------

.. _auditing:

Security and Code Auditing
================================================

The following section covers the Security & Code Auditing strategy and implementation for all Smart 
Contracts in the **Tru Reputation Token** project including supporting Libraries & Smart Contracts.

.. ------------------------------------------------------------------------------------------------

.. _auditing-1:

1. Strategy
---------------------------------------

The Security & Code Auditing Strategy for the **Tru Reputation Token** Project is as defined below:

- Due to the inherent financial risk of Cryptocurrency, and the evolving nature of threats and 
  exploits within Solidity and EVM, standardised automated Security Auditing must be leveraged.

- Automated Security Audits are the be generated on each commit to the Repository.

- Auditing will include, as much as practicable, a scan against known vulnerabilities, exploits, and
  insecure coding patterns.

- Manual Security Audits will be performed by an external third party at least every 3 months after
  Production Code Release.

- Audits will be reviewed alongside Testing, Fuzz Testing and Code Coverage to ensure Best Practices
  and code security before being released to a public network.

- The **Tru Reputation Token** Project will not be released without the above items being met.

.. ------------------------------------------------------------------------------------------------

.. _auditing-2:

2. Auditing Tools
---------------------------------------

Given the evolving nature of Solidity and the EVM, the tools available for performing Security 
Auditing are not as fully featured as in other code environments. However, several projects are 
generally effective when combined with full Unit Testing and Fuzz Testing as part of a multi-
layered Security Strategy including manual code reviews, manual Audits, Penetration Testing and 
bug reporting. 

The following tools are used within the **Tru Reputation Token** Project:

+--------------+----------------------------------------------------------------------------------+
| **Name**     | **Description**                                                                  |
+==============+==================================================================================+
| `EtherScan`_ | `EtherScan Verify Contract`_ provides the capability to independently verify     |
|              | that the published source of a Contract matches the instance, ensuring a match   |
|              | at a bytecode level on the Contract and providing assurance to users of it.      |
+--------------+----------------------------------------------------------------------------------+
| `CoverAlls`_ | CoverAlls is used as part of the :ref:`testing` Strategy to ensure Code Coverage |
|              | of all utilised code and produces reports detailing the level and degree of code |
|              | coverage against code execution branches.                                        |
+--------------+----------------------------------------------------------------------------------+
| `Mythril`_   | Mythril is security analysis tool for Ethereum Smart Contracts that uses concolic|
|              | analysis to detect various types of issues. It can be used to both analyse the   |
|              | code and produce a 'ethermap' of the Smart Contract.                             |
+--------------+----------------------------------------------------------------------------------+
| `Oyente`_    | Oyente is a tool for analysing Ethereum Smart Contracts and produces a report    |
|              | detailing whether well-known exploits can be achieved in the Contract scanned    |
+--------------+----------------------------------------------------------------------------------+

`Mythril`_ and `Oyente`_ Audits are automatically performed on each commit to the Repository for
each revision of the code, ensuring a continuous benchmark of Security Validation vs known exploits,
and coding patterns that are known to open vulnerabilities.

.. note:: All `Mythril`_ and `Oyente`_ Audits can be viewed on the :file:`./audits/` directory,
          with separate sub-directories for each, and separate sub-directories within them for
          each version Audited.

.. ------------------------------------------------------------------------------------------------

.. _auditing-3:

3. Public Instances
---------------------------------------

The following sub-sections list Public Instances of **Tru Reputation Token** Project Smart Contracts 
and Libraries, which version they are, whether they have been validated via 
`EtherScan Verify Contract`_ and a relevant `EtherScan`_ link.

.. ------------------------------------------------------------------------------------------------

.. _auditing-3-1:

3.1. Rinkeby TestNet Instances
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The following Contract & Library Instances exist on the `Rinkeby`_ Test Network:

.. ------------------------------------------------------------------------------------------------

+--------------------------------+----------------------------------------------------------------+
| **Name**                       | TruAddress                                                     |
+--------------------------------+----------------------------------------------------------------+
| **Source File:**               | :file:`/src/0.1.9/TruAddressFull.sol`                          |
+--------------------------------+----------------------------------------------------------------+
| **Type**                       | Library                                                        |
+--------------------------------+----------------------------------------------------------------+
| **Version**                    | 0.1.9                                                          |
+--------------------------------+----------------------------------------------------------------+
| **Address**                    | `0xe3e9e6493c568a3e66577254a0931e4da95eda45`_                  |
+--------------------------------+----------------------------------------------------------------+
| **Source EtherScan Verified?** | `Yes <TruAddress-Source-Verification_>`_                       |
+--------------------------------+----------------------------------------------------------------+

.. ------------------------------------------------------------------------------------------------

+--------------------------------+----------------------------------------------------------------+
| **Name**                       | TruReputationToken                                             |
+--------------------------------+----------------------------------------------------------------+
| **Source File:**               | :file:`/src/0.1.9/TruReputationTokenFull.sol`                  |
+--------------------------------+----------------------------------------------------------------+
| **Type**                       | Smart Contract                                                 |
+--------------------------------+----------------------------------------------------------------+
| **Version**                    | 0.1.9                                                          |
+--------------------------------+----------------------------------------------------------------+
| **Address**                    | `0x3cc6363e5c791f804811e883b0af73cfba1b841d`_                  |
+--------------------------------+----------------------------------------------------------------+
| **Source EtherScan Verified?** | `Yes <TruReputationToken-Source-Verification_>`_               |
+--------------------------------+----------------------------------------------------------------+

.. ------------------------------------------------------------------------------------------------

+--------------------------------+----------------------------------------------------------------+
| **Name**                       | TruPreSale                                                     |
+--------------------------------+----------------------------------------------------------------+
| **Source File:**               | :file:`/src/0.1.9/TruPreSaleFull.sol`                          |
+--------------------------------+----------------------------------------------------------------+
| **Type**                       | Smart Contract                                                 |
+--------------------------------+----------------------------------------------------------------+
| **Version**                    | 0.1.9                                                          |
+--------------------------------+----------------------------------------------------------------+
| **Address**                    | `0x9a921ee90d0404c8f3f2eb974c8b3a415da142d5`_                  |
+--------------------------------+----------------------------------------------------------------+
| **Source EtherScan Verified?** | `Yes <TruPreSale-Source-Verification_>`_                       |
+--------------------------------+----------------------------------------------------------------+

.. ------------------------------------------------------------------------------------------------

+--------------------------------+----------------------------------------------------------------+
| **Name**                       | TruCrowdSale                                                   |
+--------------------------------+----------------------------------------------------------------+
| **Source File:**               | :file:`/src/0.1.9/TruCrowdSaleFull.sol`                        |
+--------------------------------+----------------------------------------------------------------+
| **Type**                       | Smart Contract                                                 |
+--------------------------------+----------------------------------------------------------------+
| **Version**                    | 0.1.9                                                          |
+--------------------------------+----------------------------------------------------------------+
| **Address**                    | Not Yet Deployed                                               |
+--------------------------------+----------------------------------------------------------------+
| **Source EtherScan Verified?** | Not Yet Deployed                                               |
+--------------------------------+----------------------------------------------------------------+

.. ------------------------------------------------------------------------------------------------

.. _auditing-3-2:

3.1. MainNet Instances
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The following Contract & Library Instances exist on the Ethereum `Ethereum Main Network`_:

.. ------------------------------------------------------------------------------------------------
.. URLs used throughout this page
.. ------------------------------------------------------------------------------------------------

.. _Oyente: https://github.com/melonproject/oyente
.. _Mythril: https://github.com/b-mueller/mythril
.. _Coveralls: https://coveralls.io/
.. _solidity-coverage: https://github.com/sc-forks/solidity-coverage
.. _EtherScan: https://etherscan.io/
.. _EtherScan Verify Contract: https://etherscan.io/verifyContract
.. _Rinkeby: https://www.rinkeby.io/
.. _Ethereum Main Network: https://ethstats.net/

.. _0xe3e9e6493c568a3e66577254a0931e4da95eda45: https://rinkeby.etherscan.io/address/0xe3e9e6493c568a3e66577254a0931e4da95eda45
.. _TruAddress-Source-Verification: https://rinkeby.etherscan.io/address/0xe3e9e6493c568a3e66577254a0931e4da95eda45#code
.. _0x3cc6363e5c791f804811e883b0af73cfba1b841d: https://rinkeby.etherscan.io/address/0x3cc6363e5c791f804811e883b0af73cfba1b841d
.. _TruReputationToken-Source-Verification: https://rinkeby.etherscan.io/address/0x3cc6363e5c791f804811e883b0af73cfba1b841d#code
.. _0x9a921ee90d0404c8f3f2eb974c8b3a415da142d5: https://rinkeby.etherscan.io/address/0x9a921ee90d0404c8f3f2eb974c8b3a415da142d5
.. _TruPreSale-Source-Verification: https://rinkeby.etherscan.io/address/0x9a921ee90d0404c8f3f2eb974c8b3a415da142d5#code


.. ------------------------------------------------------------------------------------------------
.. END OF AUDITING
.. ------------------------------------------------------------------------------------------------
