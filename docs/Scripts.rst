.. ------------------------------------------------------------------------------------------------
.. SCRIPTS
.. ------------------------------------------------------------------------------------------------

.. _scripts:

Supporting Scripts
================================================

The following scripts are used in the **Tru Reputation Token** project:

+-------------------+---------------------------------+-------------------------------------------+
| **Name**          | **Path**                        | **Description**                           |
+===================+=================================+===========================================+
| `audit.sh`_       | :file:`./scripts/audit.sh`      | Automated Security Auditing script        |
+-------------------+---------------------------------+-------------------------------------------+
| `coverage.sh`_    | :file:`./scripts/coverage.sh`   | Automated Code Coverage Testing script    |
+-------------------+---------------------------------+-------------------------------------------+
| `devnet.sh`_      | :file:`./scripts/devnet.sh`     | Script for controlling Tru-DevNet Network |
+-------------------+---------------------------------+-------------------------------------------+
| `flattensrc.sh`_  | :file:`./scripts/flattensrc.sh` | Automated flatten source generation script|
+-------------------+---------------------------------+-------------------------------------------+
| `post-commit.sh`_ | :file:`./scripts/post-commit.sh`| Script for post-commit hook git activities|
+-------------------+---------------------------------+-------------------------------------------+
| `pre-commit.sh`_  | :file:`./scripts/pre-commit.sh` | Script for pre-commit hook git activities |
+-------------------+---------------------------------+-------------------------------------------+
| `testnet.sh`_     | :file:`./scripts/testnet.sh`    | Script for controlling TestNet TestRPC    |
|                   |                                 | Network                                   |
+-------------------+---------------------------------+-------------------------------------------+

.. _scripts-audit:

audit.sh
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


**Script Path:** :file:`./scripts/audit.sh`


**Script Description:**

            Script used to automate the generation of `mythril`_ and `oyente`_ audits that
            are placed in the :file:`./audits/` directory.

.. note:: Audits are saved into sub-directories for each version of the project 
          (e.g. :file:`./audits/oyente/0.18/`) and the latest version is copied into the `current` 
          directory (e.g. :file:`./audits/oyente/current/`). These audits are performed against 
          the  flattened source for the :ref:`tru-reputation-token`, :ref:`tru-presale` 
          and :ref:`tru-crowdsale` Smart Contracts, and the :ref:`tru-address` Library.


**Script Parameters:**

+-----------------+-------------------------------------------+-----------------------------------+
| **Parameter**   |  **Detail**                               |  **Usage Example**                |
+=================+===========================================+===================================+
| **oyente**      | Used to generate `oyente`_ Audits into    | :file:`./scripts/audit.sh oyente` |
|                 | :file:`./audits/oyente/`                  |                                   |
+-----------------+-------------------------------------------+-----------------------------------+
| **mythril**     | Used to generate `mythril`_ Audits into   | :file:`./scripts/audit.sh mythril`|
|                 | :file:`./audits/mythril/`                 |                                   |
+-----------------+-------------------------------------------+-----------------------------------+
| **all**         | Used to generate both `mythril`_ and      | :file:`./scripts/audit.sh all`    |
|                 | `oyente`_ Audits into :file:`./audits`    |                                   |
+-----------------+-------------------------------------------+-----------------------------------+

.. note:: :file:`./scripts/audit.sh all` is executed before each commit to the repository ensuring 
          Security Audits for both `mythril`_ and `oyente`_ are generated for each version of the 
          project.
          
.. note:: :file:`./scripts/audit.sh all` is bound to the :file:`npm run audit` script shortcut.


.. ------------------------------------------------------------------------------------------------

.. _scripts-coverage:

coverage.sh
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

**Script Path:** :file:`./scripts/coverage.sh`


**Script Description:**

            Script used to automate execution of `solidity-coverage`_ coverage testing of the
            **Tru Reputation Token** project. Results are placed in the :file:`./coverage` directory
            as `Istanbul`_ HTML and are consumed by `Coveralls`_

**Script Parameters:**

+-----------------+-------------------------------------+-----------------------------------------+
| **Parameter**   |  **Detail**                         | **Usage Example**                       |
+=================+=====================================+=========================================+
| **start**       | Used start the Coverage TestRPC     | :file:`./scripts/coverage.sh start`     |
|                 | Network                             |                                         |
+-----------------+-------------------------------------+-----------------------------------------+
| **stop**        | Used stop the Coverage TestRPC      | :file:`./scripts/coverage.sh stop`      |
|                 | Network                             |                                         |
+-----------------+-------------------------------------+-----------------------------------------+
| **generate**    | Used perform generate Code Coverage | :file:`./scripts/coverage.sh generate`  |
|                 | Reporting                           |                                         |
+-----------------+-------------------------------------+-----------------------------------------+


.. note:: The `coverage.sh`_ script is automatically executed by Travis CI upon each commit to the 
          **Tru Reputation Token** repository.

.. note:: :file:`./scripts/coverage.sh generate` is bound to the :file:`npm run coverage` script 
          shortcut.

.. ------------------------------------------------------------------------------------------------

.. _scripts-devnet:

devnet.sh
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

**Script Path:** :file:`./scripts/coverage.sh`


**Script Description:**

            Script used to setup, maintain and start the Tru DevNet private Geth Ethereum Network.


**Script Parameters:**

+---------------+---------------------------------------+-----------------------------------------+
| **Parameter** |  **Detail**                           | **Usage Example**                       |
+===============+=======================================+=========================================+
| **start**     | Used start the Coverage Tru DevNet    | :file:`./scripts/devnet.sh start`       |
|               | Private Geth Network                  |                                         |
+---------------+---------------------------------------+-----------------------------------------+
| **stop**      | Used stop the Coverage Tru DevNet     | :file:`./scripts/devnet.sh stop`        |
|               | Private Geth Network                  |                                         |
+---------------+---------------------------------------+-----------------------------------------+
| **add**       | Used add a new address to the Tru     | :file:`./scripts/devnet.sh add`         |
|               | DevNet Private Geth Network           |                                         |
+---------------+---------------------------------------+-----------------------------------------+
| **limit**     | Used to lower the CPU priority of the | :file:`./scripts/devnet.sh limit`       |
|               | Geth instance running the Tru DevNet  |                                         |
|               | Network                               |                                         |
+---------------+---------------------------------------+-----------------------------------------+
| **restore**   | Used to restore the CPU priority of   | :file:`./scripts/devnet.sh restore`     |
|               | the Geth instance running the Tru     |                                         |
|               | DevNet Network                        |                                         |
+---------------+---------------------------------------+-----------------------------------------+
| **test**      | Used to execute all tests in          | :file:`./scripts/devnet.sh test`        |
|               | :file:`test` against the Tru DevNet   |                                         |
|               | Network                               |                                         |
+---------------+---------------------------------------+-----------------------------------------+
| **migrate**   | Used to execute                       | :file:`./scripts/devnet.sh migrate`     |
|               | :file:`truffle migrate` against the   |                                         |
|               | Tru DevNet Network                    |                                         |
+---------------+---------------------------------------+-----------------------------------------+
| **console**   | Used to execute                       | :file:`./scripts/devnet.sh console`     |
|               | :file:`truffle console` against the   |                                         |
|               | Tru DevNet Network                    |                                         |
+---------------+---------------------------------------+-----------------------------------------+

.. ------------------------------------------------------------------------------------------------

.. _scripts-flattensrc:

flattensrc.sh
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


**Script Path:** :file:`./scripts/flattensrc.sh`


**Script Description:**

            Script used to generate consolidated, flat Solidity source code for the 
            :ref:`tru-reputation-token`, :ref:`tru-presale` and :ref:`tru-crowdsale` Smart 
            Contracts, and the :ref:`tru-address` Library that includes all dependencies into
            single files for each.


**Script Parameters:**

+---------------+--------------------------------------+------------------------------------------+
| **Parameter** |  **Detail**                          | **Usage Example**                        |
+===============+======================================+==========================================+
| **flatten**   | Used to flatten all defined Smart    | :file:`./scripts/flattensrc.sh flatten`  |
|               | Contracts and Libraries              |                                          |
+---------------+--------------------------------------+------------------------------------------+
| **token**     | Used to flatten the                  | :file:`./scripts/flattensrc.sh token`    |
|               | :file:`TruReputationToken.sol`       |                                          |
|               | Smart Contract                       |                                          |
+---------------+--------------------------------------+------------------------------------------+
| **presale**   | Used to flatten the                  | :file:`./scripts/flattensrc.sh presale`  |
|               | :file:`TruPreSale.sol` Smart Contract|                                          |
+---------------+--------------------------------------+------------------------------------------+
| **crowdsale** | Used to flatten the                  | :file:`./scripts/flattensrc.sh crowdsale`|
|               | :file:`TruCrowdSale.sol` Smart       |                                          |
|               | Contract                             |                                          |
+---------------+--------------------------------------+------------------------------------------+
| **address**   | Used to flatten the                  | :file:`./scripts/flattensrc.sh address`  |
|               | :file:`TruAddress.sol` Library       |                                          |
+---------------+--------------------------------------+------------------------------------------+

.. note:: Flattened source files are saved into sub-directories for each version of the project 
          (e.g. :file:`./src/0.1.8/TruAddressFull.sol`),  and the latest version is copied into the 
          `current` directory (e.g. :file:`./src/current/TruAddressFull.sol`).


.. ------------------------------------------------------------------------------------------------

.. _scripts-post-commit:

post-commit.sh
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

**Script Path:** :file:`./scripts/post-commit.sh`


**Script Description:**

            Script executed in the post-commit trigger in git by leveraging `post-commit` in the 
            package.json. Used primarily to ensure that each version has a tag in the repository.


**Script Parameters:**

No Parameters

.. ------------------------------------------------------------------------------------------------

.. _scripts-pre-commit:

pre-commit.sh
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

**Script Path:** :file:`./scripts/pre-commit.sh`


**Script Description:**

            Script executed in the pre-commit trigger in git by leveraging `pre-commit` in the 
            package.json. Used to ensure that patch version is incremented with each commit,
            documentation version is up to date and executes :file:`./scripts/audit.sh all`


**Script Parameters:**

No Parameters

.. ------------------------------------------------------------------------------------------------

.. _scripts-testnet:

./scripts/testnet.sh
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

**Script Path:** :file:`./scripts/testnet.sh`


**Script Description:**

            Script used to setup, maintain and start the TestNet TestRPC Ethereum Network.


**Script Parameters:**

+---------------+----------------------------------------+----------------------------------------+
| **Parameter** |  **Detail**                            | **Usage Example**                      |
+===============+========================================+========================================+
| **start**     | Starts the TestNet TestRPC Network     | :file:`./scripts/testnet.sh start`     |
+---------------+----------------------------------------+----------------------------------------+
| **stop**      | Stop the TestNet TestRPC Network       | :file:`./scripts/testnet.sh stop`      |
+---------------+----------------------------------------+----------------------------------------+
| **restart**   | Restarts the TestNet TestRPC Network   | :file:`./scripts/testnet.sh restart`   |
+---------------+----------------------------------------+----------------------------------------+
| **status**    | Shows the running status of the        | :file:`./scripts/testnet.sh status`    |
|               | TestNet TestRPC Network                |                                        |
+---------------+----------------------------------------+----------------------------------------+
| **test**      | Runs full Mocha test suite against the | :file:`./scripts/testnet.sh test`      |
|               | TestNet TestRPC Network                |                                        |
+---------------+----------------------------------------+----------------------------------------+
| **fuzz**      | Runs full Mocha test suite against the | :file:`./scripts/testnet.sh fuzz`      |
|               | TestNet TestRPC Network 250 times      |                                        |
+---------------+----------------------------------------+----------------------------------------+
| **migrate**   | executes :file:`truffle migrate`       | :file:`./scripts/testnet.sh migrate`   |
|               | against the TestNet TestRPC Network    |                                        |
+---------------+----------------------------------------+----------------------------------------+
| **console**   | executes :file:`truffle console`       | :file:`./scripts/testnet.sh console`   |
|               | against the TestNet TestRPC Network    |                                        |
+---------------+----------------------------------------+----------------------------------------+
| **quicktest** | Runs full Mocha test suite against the | :file:`./scripts/testnet.sh quicktest` |
|               | TestNet TestRPC Network twice          |                                        |
+---------------+----------------------------------------+----------------------------------------+

.. ------------------------------------------------------------------------------------------------
.. URLs used throughout this page
.. ------------------------------------------------------------------------------------------------

.. _oyente: https://github.com/melonproject/oyente
.. _mythril: https://github.com/b-mueller/mythril
.. _Coveralls: https://coveralls.io/
.. _Istanbul: https://github.com/gotwarlost/istanbul
.. _solidity-coverage: https://github.com/sc-forks/solidity-coverage

.. ------------------------------------------------------------------------------------------------
.. END OF SCRIPTS
.. ------------------------------------------------------------------------------------------------
