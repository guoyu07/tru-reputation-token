.. ------------------------------------------------------------------------------------------------
.. REQUIREMENTS
.. ------------------------------------------------------------------------------------------------

.. _requirements:

Project Requirements
=====================



:Author: Ian Bray
:Revision Date: 26/11/2017

The following sections break down the requirements for the `Tru Reputation Token`_ and any 
associated Sale Smart Contracts, supporting libraries, security or testing requirements

.. ------------------------------------------------------------------------------------------------

.. _requirements-token:

Token Requirements
----------------------------------------


.. ------------------------------------------------------------------------------------------------

.. _requirements-token-trt:

Tru Reputation Token Requirements
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

When designing the **Tru Reputation Token** the following requirements were specified:

+-----------------+-------------------------------------------------------------------------------+
| **Requirement** | **Requirement Description**                                                   |
+-----------------+-------------------------------------------------------------------------------+
| `TRTREQ 001`_   | Token must be ERC-20 compliant                                                |
+-----------------+-------------------------------------------------------------------------------+
| `TRTREQ 002`_   | Token must support up to 10^18 decimal places                                 |
+-----------------+-------------------------------------------------------------------------------+
| `TRTREQ 003`_   | Token must be named Tru Reputation Token                                      |
+-----------------+-------------------------------------------------------------------------------+
| `TRTREQ 004`_   | Token must use TRU as its symbol                                              |
+-----------------+-------------------------------------------------------------------------------+
| `TRTREQ 005`_   | Token must only be minted during Sale events                                  |
+-----------------+-------------------------------------------------------------------------------+
| `TRTREQ 006`_   | Token must have an address for the Executive Board                            |
+-----------------+-------------------------------------------------------------------------------+
| `TRTREQ 007`_   | Only the Executive Board should be able to change the Executive Board address |
+-----------------+-------------------------------------------------------------------------------+
| `TRTREQ 008`_   | Token must be able to be upgraded in the future                               |
+-----------------+-------------------------------------------------------------------------------+
| `TRTREQ 009`_   | Token upgrades should only occur through consensus                            |
+-----------------+-------------------------------------------------------------------------------+
| `TRTREQ 010`_   | Token upgrades should only be able to be set by Smart Contract owner          |
+-----------------+-------------------------------------------------------------------------------+
| `TRTREQ 011`_   | Tokens should not be able to be transferred until all Sales are completed     |
+-----------------+-------------------------------------------------------------------------------+
| `TRTREQ 012`_   | All Smart Contract code must be fully unit tested                             |
+-----------------+-------------------------------------------------------------------------------+
| `TRTREQ 013`_   | All Smart Contract code must be fully fuzz tested                             |
+-----------------+-------------------------------------------------------------------------------+
| `TRTREQ 014`_   | All Smart Contract code must be security audited                              |
+-----------------+-------------------------------------------------------------------------------+

.. ------------------------------------------------------------------------------------------------

.. _requirements-trt-req001:

TRTREQ 001
'''''''''''''''''''''

Requirement:
    Token must be ERC-20 compliant

Description: 
    To maintain optimal compatibility, security, functionality and in line with Best Practice the 
    **Tru Reputation Token** must be 
    `ERC-20 Compliant <https://theethereum.wiki/w/index.php/ERC20_Token_Standard>`_.

Implementation Notes: 
     Leveraged `Zeppelin Solidity`_ to ensure ERC-20 compliance by using a sub-class of the ERC20
     Smart Contract.

**Requirement Met?** Yes

.. ------------------------------------------------------------------------------------------------

.. _requirements-trt-req002:

TRTREQ 002
'''''''''''''''''''''

Requirement:
    Token must support up to 10^18 decimal places

Description: 
    To ensure future compatibility and in line with having an entirely fixed token supply, the 
    **Tru Reputation Token** must support 10^18 decimal places to allow the highest level of 
    granular fractionality for the Token. This is to ensure the precise reward & cost models of 
    the **Tru Reputation Protocol** are met.

Implementation Notes: 
    Leveraged `Zeppelin Solidity`_ to ensure ERC-20 compliance and set the *decimals* constant 
    variable to **18**.

**Requirement Met?** Yes

.. ------------------------------------------------------------------------------------------------

.. _requirements-trt-req003:

TRTREQ 003
'''''''''''''''''''''

Requirement:
    Token must be named Tru Reputation Token

Description: 
    To ensure the appropriate identification of the **Tru Reputation Token** it must be named as 
    such in the Smart Contract and be publicly visible.

Implementation Notes: 
    Leveraged `Zeppelin Solidity`_ to ensure ERC-20 compliance and set the *name* constant 
    variable to **Tru Reputation Token**.

**Requirement Met?** Yes

.. ------------------------------------------------------------------------------------------------

.. _requirements-trt-req004:

TRTREQ 004
'''''''''''''''''''''

Requirement:
    Token must use TRU as its symbol

Description:
    To ensure the appropriate identification of the **Tru Reputation Token** it must be have its 
    token symbol set to **TRU**.

Implementation Notes: 
    Leveraged `Zeppelin Solidity`_ to ensure ERC-20 compliance and set the *symbol* constant 
    variable to **TRU**.

**Requirement Met?** Yes

.. ------------------------------------------------------------------------------------------------

.. _requirements-trt-req005:

TRTREQ 005
'''''''''''''''''''''

Requirement:
    Token must only be minted during Sale events

Description:
    To prevent oversupply, the **Tru Reputation Token** should only be able to be minted during a 
    Crowdsale event and once complete, no further tokens should be able to be minted.

Implementation Notes: 
    Leveraged a customised version of the `Zeppelin Solidity`_  **MintableToken** the base 
    token has the capability to both be minted and to be able to be finalise that minting process 
    fully and finally. In conjunction with the TruSale Smart Contract and customizations made to 
    the **MintableToken** to set these finalisation criteria.

**Requirement Met?** Yes

.. ------------------------------------------------------------------------------------------------

.. _requirements-trt-req006:

TRTREQ 006
'''''''''''''''''''''

Requirement: 
    Token must have an address for the Executive Board

Description:
    As per the `Tru Reputation Protocol Whitepaper`_ the `Tru Reputation Protocol`_ will be 
    governed, steered and maintained by an Advisory Board. Motions passed by the Advisory Board 
    will need to be enacted by the Tru Ltd Executive Board and for that purpose a multi-signature 
    wallet will be created to enact those changes. The address of this wallet needs to be set upon 
    construction of the Smart Contract.

Implementation Notes: 
    Implemented using the *execBoard* address variable, the 
    :ref:`tru-reputation-token-only-exec-board` modifier, 
    :ref:`tru-reputation-token-board-address-changed` event, and the 
    :ref:`tru-reputation-token-change-board-address` function 
    that can only be executed by the existing Executive Board address. This implemenetation 
    addresses this requirement and `TRTREQ 007`_.

**Requirement Met?** Yes

.. ------------------------------------------------------------------------------------------------

.. _requirements-trt-req007:

TRTREQ 007
'''''''''''''''''''''

Requirement: 
    Only the Executive Board should be able to change the Executive Board address

Description:
    In conjunection with `TRTREQ 006`_ only the current Executive Board Address should be able 
    to change the Executive Board Address to a different value and there should be a full audit
    trail of any changes made.

Implementation Notes: 
    Implemented along with `TRTREQ 006`_ by the *onlyExecBoard* modifier, 
    :ref:`tru-reputation-token-board-address-changed` event, and the 
    :ref:`tru-reputation-token-change-board-address` function.

**Requirement Met?** Yes

.. ------------------------------------------------------------------------------------------------

.. _requirements-trt-req008:

TRTREQ 008
'''''''''''''''''''''

Requirement:
    Token must be able to be upgraded in the future

Description:
    To allow the **Tru Reputation Protocol** to deliver new functionality and fix any potential 
    issues, the **Tru Reputation Token** needs to have a mechanism to allow the Token to be upgraded 
    over time.

Implementation Notes: 
    By leveraging an updated version of the **UpgradeableToken** (**TruUpgradeableToken**) and 
    **UpgradeAgent** Smart Contracts by `Token Market`_, the 
    **Tru Reputation Token** can be upgraded in the future.

**Requirement Met?** Yes

.. ------------------------------------------------------------------------------------------------

.. _requirements-trt-req009:

TRTREQ 009
'''''''''''''''''''''

Requirement: 
    Token upgrades should only occur through consensus

Description:
    In line with the guiding principles of cryptocurrency, contract law & customs, any Token upgrade
    should require consensus of Token holders to adopt any upgrade to the Token.

Implementation Notes:
    By leveraging an updated version of the **UpgradeableToken** (**TruUpgradeableToken**) and 
    **UpgradeAgent** Smart Contracts by `Token Market`_, the 
    **Tru Reputation Token** is upgraded by the Token holder when they can opt in to any potential 
    upgrade.

**Requirement Met?** Yes

.. ------------------------------------------------------------------------------------------------

.. _requirements-trt-req010:

TRTREQ 010
'''''''''''''''''''''

Requirement:
    Token upgrades should only be able to be set by Smart Contract owner

Description:
    To protect **Tru Reputation Token** from malicious third-parties, only the owner of the Token 
    Smart Contract should be able to provide any upgrade to the Smart Contract.

Implementation Notes: 
    By leveraging an updated version of the **ReleaseableToken** Smart Contract by `Token Market`_, 
    the **Tru Reputation Token** has to be set to a released state explicitly before the Token can be 
    exchanged or transferred between wallets beyond the initial address that purchased the tokens. By 
    adding this event in the closing logic of the last Sale event, the capability to transfer 
    **Tru Reputation Token** can be set at a time after that event.

**Requirement Met?** Yes

.. ------------------------------------------------------------------------------------------------

.. _requirements-trt-req011:

TRTREQ 011
'''''''''''''''''''''

Requirement:
    Tokens should not be able to be transferred until all Sales are completed

Description:
    To prevent Pre-Launch transfer of Tokens the **Tru Reputation Token** needs to be non-transferable
    until any and all Sale events have concluded.

Implementation Notes: 
    By leveraging an updated version of the **ReleaseableToken** Smart Contract by `Token Market`_, 
    the **Tru Reputation Token** has to be set to a released state explicitly before the Token can be 
    exchanged or transferred between wallets beyond the initial address that purchased the tokens. By 
    adding this event in the closing logic of the last Sale event, the capability to transfer 
    **Tru Reputation Token** can be set at a time after that event.

**Requirement Met?** Yes

.. ------------------------------------------------------------------------------------------------

.. _requirements-trt-req012:

TRTREQ 012
'''''''''''''''''''''

Requirement:
    All Smart Contract code must be fully unit tested

Description: 
    All  **Tru Reputation Token** Smart Contract functionality should be testable and verifable through 
    unit tests.

Implementation Notes: 
    Leveraging Truffle, Mocha Unit Tests have been created for the **Tru Reputation Token** Smart 
    Contracts and supporting Smart Contracts. This Tesing Suite will be updated as code changes to 
    ensure 100% coverage of lines, statements, functions & branches in the testing suite.

**Requirement Met?** Yes and ongoing

.. ------------------------------------------------------------------------------------------------

.. _requirements-trt-req013:

TRTREQ 013
'''''''''''''''''''''

Requirement:
    All Smart Contract code must be fully fuzz tested

Description: 
    In keeping with good security practice, all **Tru Reputation Token** Smart Contract code must 
    be fully fuzz tested where fuzzing would be applicable to prevent exploits in the Smart Contract.

Implementation Notes: 
    Leveraging Truffle, and a Fuzzing Library for Javascript additional tests have been been created for 
    the **Tru Reputation Token** Smart Contracts and supporting Smart Contracts. These tests stress
    each function and check for exploits and failures to ensure the security and robustness of the
    Smart Contracts. These tests are within the Mocha Test Suite and will be updated as code changes 
    to ensure 100% coverage of lines, statements, functions & branches in the testing suite.

**Requirement Met?** Yes and ongoing

.. ------------------------------------------------------------------------------------------------

.. _requirements-trt-req014:

TRTREQ 014
'''''''''''''''''''''

Requirement:
    All Smart Contract code must be fully security audited

Description:
    Leveraging tools such as Oyente, all **Tru Reputation Token** Smart Contract code must 
    be subjected to Static Analysis and security audit.

Implementation Notes:
    Oyente auditing has been implemented for all **Tru Reputation Token** Smart Contracts.

**Requirement Met?** Yes and ongoing


.. ------------------------------------------------------------------------------------------------

.. _requirements-sale-requirements:

Sale Requirements
----------------------------------------

.. ------------------------------------------------------------------------------------------------

.. _requirements-common-sale-requirements:

Common Sale Requirements
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

When designing the Pre-Sale and CrowdSale Smart Contracts for the **Tru Reputation Token**
the following common requirements were specified:

+-----------------+-------------------------------------------------------------------------------+
| **Requirement** | **Requirement Description**                                                   |
+-----------------+-------------------------------------------------------------------------------+
| `SALREQ 001`_   | Each sale must have a maximum cap of Tokens to be sold                        |
+-----------------+-------------------------------------------------------------------------------+
| `SALREQ 002`_   | Each sale should have a Start and End time                                    |
+-----------------+-------------------------------------------------------------------------------+
| `SALREQ 003`_   | No purchases should be able to be made before Sale Start                      |
+-----------------+-------------------------------------------------------------------------------+
| `SALREQ 004`_   | No purchases should be able to be made after Sale End                         |
+-----------------+-------------------------------------------------------------------------------+
| `SALREQ 005`_   | Each sale must end if cap is hit                                              |
+-----------------+-------------------------------------------------------------------------------+
| `SALREQ 006`_   | Each sale must end if end time has passed                                     |
+-----------------+-------------------------------------------------------------------------------+
| `SALREQ 007`_   | Each sale must have a distinct Eth to Tru purchase rate                       |
+-----------------+-------------------------------------------------------------------------------+
| `SALREQ 008`_   | Each sale must track the amount of tokens sold                                |
+-----------------+-------------------------------------------------------------------------------+
| `SALREQ 009`_   | Each sale must track the amount of ETH raised                                 |
+-----------------+-------------------------------------------------------------------------------+
| `SALREQ 010`_   | Each sale must track the number of purchasers                                 |
+-----------------+-------------------------------------------------------------------------------+
| `SALREQ 011`_   | Each sale must pay all funds raised to a dedicated wallet                     |
+-----------------+-------------------------------------------------------------------------------+
| `SALREQ 012`_   | The end time of a Sale should be able to be changed                           |
+-----------------+-------------------------------------------------------------------------------+
| `SALREQ 013`_   | Each sale must have a AML/KYC Whitelist                                       |
+-----------------+-------------------------------------------------------------------------------+
| `SALREQ 014`_   | Each sale must have maximum buy limit for non-WhiteListed accounts            |
+-----------------+-------------------------------------------------------------------------------+
| `SALREQ 015`_   | Each sale must have a minimum buy limit for all buyers                        |
+-----------------+-------------------------------------------------------------------------------+
| `SALREQ 016`_   | Each sale must be able to be halted in an emergency                           |
+-----------------+-------------------------------------------------------------------------------+
| `SALREQ 017`_   | Each sale must mint tokens at the time of purchase                            |
+-----------------+-------------------------------------------------------------------------------+
| `SALREQ 018`_   | Each sale must mint appropriate amount of tokens for Tru Ltd when a           |
|                 | purchase occurs                                                               |
+-----------------+-------------------------------------------------------------------------------+
| `SALREQ 019`_   | All buy activity on sales must be audited                                     |
+-----------------+-------------------------------------------------------------------------------+
| `SALREQ 020`_   | All updates to the Whitelist must be audited                                  |
+-----------------+-------------------------------------------------------------------------------+
| `SALREQ 021`_   | Must be able to remove an address from the WhiteList                          |
+-----------------+-------------------------------------------------------------------------------+
| `SALREQ 022`_   | All updates to the Sale End Time must be audited                              |
+-----------------+-------------------------------------------------------------------------------+
| `SALREQ 023`_   | Post Sale rate should be set to 1,000 TRU per ETH                             |
+-----------------+-------------------------------------------------------------------------------+
| `SALREQ 024`_   | No more than 125,000,000 TRU should be minted during the Sales                |
+-----------------+-------------------------------------------------------------------------------+

.. ------------------------------------------------------------------------------------------------

.. _requirements-sal-req001:

SALREQ 001
'''''''''''''''''''''

Requirement:
    Each sale must have a maximum cap of Tokens to be sold

Description:
    Each sale that occurs for **Tru Reputation Tokens** must have a maximum cap for that sale. In
    addition, there needs to be a global maximum cap for all Sales. If a previous Sale fails to
    raise to its cap, the remainder of the cap should carry forward to the next Sale.

Implementation Notes:
    Implemented using the *cap* variable and logic in the Constructor of child Smart Contracts.


**Requirement Met?**  Yes

.. ------------------------------------------------------------------------------------------------

.. _requirements-sal-req002:

SALREQ 002
'''''''''''''''''''''

Requirement:
    Each sale should have a Start and End time

Description:
    Each sale that occurs for **Tru Reputation Tokens** must have a fixed Start Time and fixed
    End Time.

Implementation Notes:
    Implemented using *saleStartTime* and *saleEndTime* variables, the ref:`tru-sale-has-ended` 
    constant function, and requiring the *saleStartTime* and *saleEndTime* variables in the 
    constructor (:ref:`tru-sale-constructor`).

**Requirement Met?** Yes

.. ------------------------------------------------------------------------------------------------

.. _requirements-sal-req003:

SALREQ 003
'''''''''''''''''''''

Requirement:
    No purchases should be able to be made before Sale Start

Description:
    No one should be able to purchase from a sale before a sale of **Tru Reputation Tokens** 
    occurs.

Implementation Notes:
    Implemented using logic in the :ref:`tru-sale-buy` function to check that the Sale has started.

**Requirement Met?** Yes

.. ------------------------------------------------------------------------------------------------

.. _requirements-sal-req004:

SALREQ 004
'''''''''''''''''''''

Requirement:
    No purchases should be able to be made after Sale End

Description:
    Once the end time for the sale of **Tru Reputation Tokens**  completes, no one should be
    able to purchase any further tokens from the sale.

Implementation Notes:
    Implemented using logic in the :ref:`tru-sale-buy` function and :ref:`tru-sale-has-ended` constant 
    function.

**Requirement Met?** Yes

.. ------------------------------------------------------------------------------------------------

.. _requirements-sal-req005:

SALREQ 005
'''''''''''''''''''''

Requirement:
    Each sale must end if cap is hit

Description:
    Once the cap for the sale of **Tru Reputation Tokens** is reached, the sale should be 
    considered completed and no one should be able to purchase any further tokens from the sale.

Implementation Notes:
    Implemented using the *cap* variable, and logic in the :ref:`tru-sale-has-ended` constant 
    function.

**Requirement Met?** Yes

.. ------------------------------------------------------------------------------------------------

.. _requirements-sal-req006:

SALREQ 006
'''''''''''''''''''''

Requirement:
    Each sale must end if end time has passed

Description:
    Once the end time for the sale of **Tru Reputation Tokens** is reached, the sale should be 
    considered completed and no one should be able to purchase any further tokens from the sale.

Implementation Notes:
    Implemented using logic in the :ref:`tru-sale-has-ended` constant function.

**Requirement Met?** Yes

.. ------------------------------------------------------------------------------------------------

.. _requirements-sal-req007:

SALREQ 007
'''''''''''''''''''''

Requirement:
    Each sale must have a distinct Eth to Tru purchase rate

Description:
    Each sale of **Tru Reputation Tokens** must have its clear purchase rate of Tru per Ether to 
    reflect the bonus applied for each Sale round. The post sale price should also be publicly 
    visible within the sale Smart Contract.

Implementation Notes:
    Implemented using the *BASE_RATE*, *PRESALE_RATE*, *SALE_RATE*, *isPreSale* and *isCrowdSale* 
    variables, and logic in the :ref:`tru-sale-buy-tokens` function.

**Requirement Met?** Yes

.. ------------------------------------------------------------------------------------------------

.. _requirements-sal-req008:

SALREQ 008
'''''''''''''''''''''

Requirement:
    Each sale must track the amount of tokens sold

Description:
    Each sale of **Tru Reputation Tokens** must track the total number of **Tru Reputation Tokens** 
    sold during that Sale through a publicly visible variable.

Implementation Notes:
    Implemented using the *tokenAmount* mapping and *soldTokens* variable.

**Requirement Met?** Yes

.. ------------------------------------------------------------------------------------------------

.. _requirements-sal-req009:

SALREQ 009
'''''''''''''''''''''

Requirement:
    Each sale must track the amount of ETH raised

Description:
    Each sale of **Tru Reputation Tokens** must track the total number of **ETH** raised 
    during that Sale through a publicly visible variable.

Implementation Notes:
    Implemented using the *purchasedAmount* mapping.

**Requirement Met?** Yes

.. ------------------------------------------------------------------------------------------------

.. _requirements-sal-req010:

SALREQ 010
'''''''''''''''''''''

Requirement:
    Each sale must track the number of purchasers

Description:
    Each sale of **Tru Reputation Tokens** must track the total number of purchasers within that 
    Sale. In addition, each purchaser and the amount purchased needs to be visible through a 
    mapping to validate each purchase and provide an audit trail.

Implementation Notes:
    Implemented using the *purchaserCount* variable.

**Requirement Met?** Yes

.. ------------------------------------------------------------------------------------------------

.. _requirements-sal-req011:

SALREQ 011
'''''''''''''''''''''

Requirement:
    Each sale must pay all funds raised to a dedicated wallet

Description:
    Each sale of **Tru Reputation Tokens** must collect all raised funds in a dedicated wallet 
    separate from the address that created the Smart Contract.

Implementation Notes:
    Implemented using the *multiSigWallet* address variable and requiring this be set on
    construction to act as the receiving wallet for all funds raised during the sale.

**Requirement Met?** Yes

.. ------------------------------------------------------------------------------------------------

.. _requirements-sal-req012:

SALREQ 012
'''''''''''''''''''''

Requirement:
    The end time of a Sale should be able to be changed

Description:
    The end time of each sale of **Tru Reputation Tokens** must be able to be changed in the event 
    of an emergency by the Smart Contract owner (for example: closing a sale early, or extending 
    the window due to an issue with the Ethereum network). This should only be able to be performed 
    by the owner of the Sale Smart Contract.

Implementation Notes:
    Implemented using the :ref:`tru-sale-change-end-time` function and leveraging the 
    :ref:`ownable-only-owner` modifier.

**Requirement Met?** Yes

.. ------------------------------------------------------------------------------------------------

.. _requirements-sal-req013:

SALREQ 013
'''''''''''''''''''''

Requirement:
    Each sale must have a AML/KYC Whitelist

Description:
    Each sale of **Tru Reputation Tokens** must have a Whitelist of addresses connected to 
    individuals and entities that have been validated off-chain in line with Anti-Money Laundering 
    and Know Your Customer legislation & practice. Only the owner of the Sale Smart Contract
    should be able to amend this Whitelist.

Implementation Notes:
    Implemented using the *purchaserWhiteList* mapping, the :ref:`tru-sale-update-whitelist` 
    function and leveraging the :ref:`ownable-only-owner` modifier.

**Requirement Met?** Yes

.. ------------------------------------------------------------------------------------------------

.. _requirements-sal-req014:

SALREQ 014
'''''''''''''''''''''

Requirement:
    Each sale must have maximum buy limit for non-WhiteListed accounts

Description:
    Each sale of **Tru Reputation Tokens** must have a cumulative maximum amount of tokens a given 
    address can purchase if they are not on the AML/KYC Whitelist. This limit should be set to
    20 ETH.

Implementation Notes:
    Implemented using the *MAX_AMOUNT* variable and logic in the :ref:`tru-sale-buy-tokens` function.

**Requirement Met?** Yes

.. ------------------------------------------------------------------------------------------------

.. _requirements-sal-req015:

SALREQ 015
'''''''''''''''''''''

Requirement:
    Each sale must have a minimum buy limit for all buyers

Description:
    Each sale of **Tru Reputation Tokens** must have a minimum amount of tokens a given address 
    can purchase to participate in a sale. This minimum limit must be set to 1 ETH.

Implementation Notes:
    Implemented using the *MIN_AMOUNT* variable and logic in the :ref:`tru-sale-buy-tokens` function.

**Requirement Met?** Yes

.. ------------------------------------------------------------------------------------------------

.. _requirements-sal-req016:

SALREQ 016
'''''''''''''''''''''

Requirement:
    Each sale must be able to be halted in an emergency

Description:
    Each sale of **Tru Reputation Tokens** must have the capability to be halted by the Sale 
    Smart Contract owner in an emergency event that should stop the Sale. It should also have 
    the capability to be unhalted. This should only be able to be performed by the owner
    of the Sale Smart Contract.

Implementation Notes:
    Leveraged a modified version of the the **Haltable** by `Token Market`_.

**Requirement Met?** Yes

.. ------------------------------------------------------------------------------------------------

.. _requirements-sal-req017:

SALREQ 017
'''''''''''''''''''''

Requirement:
    Each sale must mint tokens at the time of purchase

Description:
    To prevent oversupply of tokens, each sale of **Tru Reputation Tokens** must mint tokens only 
    at the time of purchase. This will remove the need to 'burn' tokens, and ensure stability of 
    supply.

Implementation Notes:
    Implemented a modified version of **MintableToken** (**TruMintableToken**) by 
    `Zeppelin Solidity`_ and implemented logic in the :ref:`tru-sale-buy-tokens` function.

**Requirement Met?** Yes

.. ------------------------------------------------------------------------------------------------

.. _requirements-sal-req018:

SALREQ 018
'''''''''''''''''''''

Requirement:
    Each sale must mint appropriate amount of tokens for Tru Ltd when a purchase occurs

Description:
    As per `SALREQ 018`_, to prevent oversupply of tokens each sale of **Tru Reputation Tokens** 
    must mint an additional token for each token purchased and assign that to Tru Ltd's wallet
    to comply with the 50% sale of token supply as per the `Tru Reputation Protocol Whitepaper`_.

Implementation Notes:
    Implemented a modified version of **MintableToken** (**TruMintableToken**) by 
    `Zeppelin Solidity`_ and implemented logic in the :ref:`tru-crowdsale-completion` function to 
    mint  the same number of tokens bought in a sale to match the number sold in that Sale rather 
    than  mint them at the moment of purchase.
    
**Requirement Met?** Yes

.. ------------------------------------------------------------------------------------------------

.. _requirements-sal-req019:

SALREQ 019
'''''''''''''''''''''

Requirement:
    All buy activity on sales must be audited

Description:
    Each sale of **Tru Reputation Tokens** must audit and track each time an address buys tokens,
    and include the purchaser address, the recipient address, the amount paid and the number of
    tokens purchased.

Implementation Notes:
    Implemented using the :ref:`tru-sale-token-purchased` event that is fired each time a purchase 
    is successful. Event includes the address of the purchaser, the destination address (fixed to be 
    the same in this implementation, but potentially could be different in another), the total amount 
    spent and the total amount of tokens bought.

**Requirement Met?** Yes

.. ------------------------------------------------------------------------------------------------

.. _requirements-sal-req020:

SALREQ 020
'''''''''''''''''''''

Requirement:
    All updates to the Whitelist must be audited

Description:
    Each sale of **Tru Reputation Tokens** must audit and track each time the AML/KYC Whitelist
    is updated and include the Whitelisted address and its status on the Whitelist.

Implementation Notes:
    Implemented using the :ref:`tru-sale-whitelist-updated` event that is fired each time a 
    Whitelist entry is added or updated. The event includes the address and their status on the 
    Whitelist (true for enabled, false for disabled).

**Requirement Met?** Yes

.. ------------------------------------------------------------------------------------------------

.. _requirements-sal-req021:

SALREQ 021
'''''''''''''''''''''

Requirement:
    Must be able to remove an address from the WhiteList

Description:
    Each sale of **Tru Reputation Tokens** must offer the capability to remove or disable an
    address currently on the Whitelist. This should only be able to be performed by the owner
    of the Sale Smart Contract.

Implementation Notes:
    Implemented via the *purchaserWhiteList* mapping of a bool variable to an address. When that
    variable is set to *true* they are active and enabled on the Whitelist. When it is sent to
    *false* they are disabled and in effect 'removed' from the Whitelist. This status is checked
    by the :ref:`tru-sale-validate-purchase` function rather than purely checking they have an 
    entry on the Whitelist.

**Requirement Met?** Yes

.. ------------------------------------------------------------------------------------------------

.. _requirements-sal-req022:

SALREQ 022
'''''''''''''''''''''

Requirement:
    All updates to the Sale End Time must be audited

Description:
    Each sale of **Tru Reputation Tokens** must audit and track each time the End Time for the
    sale is changed.

Implementation Notes:
    Implemented using the :ref:`tru-sale-end-changed` event that is fired each time the *saleEndTime* 
    variable is altered from its initial value. The event includes the both the old and the new end 
    time.


**Requirement Met?** Yes

.. ------------------------------------------------------------------------------------------------

.. _requirements-sal-req023:

SALREQ 023
'''''''''''''''''''''

Requirement:
    Post Sale rate should be set to 1,000 TRU per ETH

Description:
    Each sale of **Tru Reputation Tokens** must have a publicly visible variable showing the Base
    Exchange Rate of 1,000 TRU per ETH

Implementation Notes:
    Implemented using the *BASE_RATE* variable.


**Requirement Met?** Yes

.. ------------------------------------------------------------------------------------------------

.. _requirements-sal-req024:

SALREQ 024
'''''''''''''''''''''

Requirement:
    No more than 125,000,000 TRU should be minted during the Sales

Description:
    The combined total of all Sales should not mint more than 125,000,000 **Tru Reputation Tokens**.
    Of this no more than 62,500,000 TRU should be sold with the remainder being minted for 
    distribution by Tru Ltd as per the `Tru Reputation Protocol Whitepaper`_.

Implementation Notes:
    Implemented using the ETH cap and buy rates ensuring that only 62,500,000
    **Tru Reputation Tokens** can be sold, and that only a further 62,500,000 
    **Tru Reputation Tokens** can be minted to the sale wallet.


**Requirement Met?** Yes

.. ------------------------------------------------------------------------------------------------

.. _requirements-pre-sale-requirements:

Pre-Sale Requirements
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

When designing the Pre-Sale Smart Contract for the **Tru Reputation Token** the following common 
requirements were specified:

+-----------------+-------------------------------------------------------------------------------+
| **Requirement** | **Requirement Description**                                                   |
+-----------------+-------------------------------------------------------------------------------+
| `PSREQ 001`_    | Cap for Pre-Sale must be fixed at 5,000 ETH                                   |
+-----------------+-------------------------------------------------------------------------------+
| `PSREQ 002`_    | Sale Rate for Pre-Sale must be 1,250 TRU per ETH                              |
+-----------------+-------------------------------------------------------------------------------+

.. ------------------------------------------------------------------------------------------------

.. _requirements-ps-req001:

PSREQ 001
'''''''''''''''''''''

Requirement:
    Cap for Pre-Sale must be fixed at 5,000 ETH

Description:
    The cap for the Pre-Sale of **Tru Reputation Token** must have a fixed sale cap of 8,000 ETH

Implementation Notes:
    Implemented by setting the *PRESALE_CAP* to 8000 x 10^18, and logic within the 
    :ref:`tru-sale-validate-purchase` function.

**Requirement Met?** Yes

.. ------------------------------------------------------------------------------------------------

.. _requirements-ps-req002:

PSREQ 002
'''''''''''''''''''''

Requirement:
    Sale Rate for Pre-Sale must be 1,250 TRU per ETH

Description:
    The buy price for the Pre-Sale of **Tru Reputation Token** must be 1,250 TRU per ETH. This
    equals a 25% bonus/20% discount versus the Base Rate.

Implementation Notes:
    Implemented using logic within the :ref:`tru-sale-validate-purchase` function, and setting a 
    constant variable for the *PRESALE_RATE* to 1250.

**Requirement Met?** Yes

.. ------------------------------------------------------------------------------------------------

.. _requirements-crowdsale-requirements:

CrowdSale Requirements
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

When designing the CrowdSale Smart Contract for the **Tru Reputation Token** the following common 
requirements were specified:

+-----------------+-------------------------------------------------------------------------------+
| **Requirement** | **Requirement Description**                                                   |
+-----------------+-------------------------------------------------------------------------------+
| `CSREQ 001`_    | Cap for CrowdSale should be cumulative with any unsold Pre-Sale Cap           |
+-----------------+-------------------------------------------------------------------------------+
| `CSREQ 002`_    | Cap for CrowdSale must be fixed to 50,000 ETH                                 |
+-----------------+-------------------------------------------------------------------------------+
| `CSREQ 003`_    | Sale Rate for Pre-Sale should be 1,125 TRU per ETH                            |
+-----------------+-------------------------------------------------------------------------------+

.. ------------------------------------------------------------------------------------------------

.. _requirements-cs-req001:

CSREQ 001
'''''''''''''''''''''

Requirement:
    Cap for CrowdSale should be cumulative with any unsold Pre-Sale Cap

Description:
    The cap for the CrowdSale of **Tru Reputation Token** must include any unsold tokens from the 
    Pre-Sale (e.g. if only 4,000 ETH worth of Tru Tokens are sold during the Pre-Sale, this must be
    added to the CrowdSale cap).

Implementation Notes:
    Implemented using logic in the CrowdSale constructor to ensure that the result of the PreSale is 
    passed into the constructor and the *TOTAL_CAP*, and then removing the PreSale raised amount 
    from the *TOTAL_CAP*.

**Requirement Met?** Yes

.. ------------------------------------------------------------------------------------------------

.. _requirements-cs-req002:

CSREQ 002
'''''''''''''''''''''

Requirement:
    Cap for CrowdSale must be fixed to 80,000 ETH

Description:
    The cap for the CrowdSale of **Tru Reputation Token** must fixed at 80,000 ETH excluding any
    potential unsold cap from the Pre-Sale as per `CSREQ 001`_. For example: If the Pre-Sale sells
    all 8,000 ETH worth of Tokens, then the CrowdSale will have a cap of 80,000 ETH. However, if
    the Pre-Sale only sells 7,000 ETH than the cap for the CrowdSale should be 81,000 ETH.


Implementation Notes:
    By setting the *TOTAL_CAP* to 88000 x 10^18, and logic within the constructor for the CrowdSale
    Smart Contract to remove total raised to date from the initial 

**Requirement Met?** Yes

.. ------------------------------------------------------------------------------------------------

.. _requirements-cs-req003:
  
CSREQ 003
'''''''''''''''''''''

Requirement:
    Sale Rate for CrowdSale should be 1,125 TRU per ETH

Description:
    The buy price for the CrowdSale of **Tru Reputation Token** must be 1,125 TRU per ETH. This
    equals a 12.5% bonus/11.11...% discount versus the Base Rate.

Implementation Notes:
    Implemented using logic within the :ref:`tru-sale-validate-purchase` function, and setting a 
    constant variable for the *SALE_RATE* to 1125, this requirement.

**Requirement Met?** Yes

.. ------------------------------------------------------------------------------------------------
.. URLs used throughout this page
.. ------------------------------------------------------------------------------------------------

.. _Tru Reputation Token: https://github.com/TruLtd/tru-reputation-token
.. _Zeppelin Solidity: https://github.com/OpenZeppelin/zeppelin-solidity
.. _Tru Reputation Protocol Whitepaper: https://tru.ltd/whitepaper
.. _Tru Reputation Protocol: https://github.com/TruLtd/tru-reputation-protocol
.. _Token Market: https://github.com/TokenMarketNet/

.. ------------------------------------------------------------------------------------------------
.. END OF REQUIREMENTS
.. ------------------------------------------------------------------------------------------------