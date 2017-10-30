<a href="https://tru.ltd"><img src="https://tru.ltd/images/logos/tru-V2.jpg" alt="Tru Ltd" height="150px"/></a>

# Tru Reputation Token

[![Coverage Status](https://coveralls.io/repos/github/TruLtd/tru-reputation-token/badge.svg?branch=master)](https://coveralls.io/github/TruLtd/tru-reputation-token?branch=master)
[![Build Status](https://travis-ci.org/TruLtd/tru-reputation-token.svg?branch=master)](https://travis-ci.org/TruLtd/tru-reputation-token)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

Public repository for source code of the Tru Reputation Token ERC-20 token, and associated Smart Contracts related to minting or creation of TRU tokens (Pre-Sale, Crowdsale, etc).

Table of Contents
=================

  * **[Project Structure](#Project-Structure)** Details the folder structure of this Project, what is in each folder, and important files
  * **[Audits](#Audits)** Details the contents and methodoloy of the `./audits` folder |
  * **[Testing](#Testing)** Details the Testing Suite included in this Project |

## Project Structure

This Tru Reputation Token Repository is structured as below:

  * `/audits` Contains all Audits of the Solidity Source code. More Information can be found in **[Audits](#Audits)**
    * `/oyente` Contains all **[Oyente Audits](https://github.com/melonproject/oyente)** for the *Tru Reputation Token Project*
  * `/contracts` Contains all Tru Reputation Token Smart Contracts
    * `/supporting` Contains all supporting Solidity Libraries & Smart Contracts - including modified **[TokenMarket Ltd](https://github.com/TokenMarketNet/ico/)** Contracts.
      * `/zeppelin` Contains **[Open Zeppelin](https://github.com/OpenZeppelin/zeppelin-solidity/)** supporting libraries leveraged by the Tru Reputation Token
        * `/contracts` Contains **[Open Zeppelin](https://github.com/OpenZeppelin/zeppelin-solidity/)** Solidity Smart Contracts & Libraries
        * `/math` Contains **[Open Zeppelin](https://github.com/OpenZeppelin/zeppelin-solidity/)** Solidity Math/SafeMath Libraries
        * `/ownership` Contains **[Open Zeppelin](https://github.com/OpenZeppelin/zeppelin-solidity/)** Solidity Ownership Libraries & Smart Contracts
      * `/TruPreSale.sol` Smart Contract for the Tru Reputation Token Pre-Sale
      * `/TruReputationToken.sol` Smart Contract for the Tru Reputation Token
  * `/migrations` Contains **[Truffle Framework Migration](https://github.com/trufflesuite/truffle)** configuration files
  * `/scripts` Contains helper scripts for the Tru Reputation Token
  * `/test` Contains all Unit Tests for all Tru Reputation Token Smart Contracts
    * `/helpers` Contains functions and modules used to help in the Mocha/Chai Test Suite
  * `/tru-devnet` Contains configuration files for Geth Test Network for the Tru Reputation Token
  * `/.babelrc` Configuration file for Babel
  * `/.solcover.js` Configuration file for solidity-coverage
  * `/LICENSE` Apache 2.0 License for this project
  * `/package.json` Contains NPM package configuration
  * `/README.md` This file
  * `/truffle.js` Contains **[Truffle Framework Migration](https://github.com/trufflesuite/truffle)** configuration

## Audits

The `/audits` folder contains all audits of the Solidity Source Code for Tru Reputation Token- whether that is generated by tools such as **[Oyente Audits](https://github.com/melonproject/oyente)** (contained in the `/audits/oyente` folder), Penetration Testing or Manual Code Reviews.

## Testing & Code Coverage

The Tru Reputation Token Project has a complete Unit Testing Suite and publicly visible Code Coverage Reports. These reports are generated using [solidity-coverage](https://github.com/sc-forks/solidity-coverage) and can be accessed on the [Tru Reputation Token Coveralls Page](https://coveralls.io/github/TruLtd/tru-reputation-token).

## License

The contents of this Repository are licensed under the Apache 2.0 License. The [License can be read here](LICENSE)

## Contact Information

Feel free to contact us directly using the following channels:

[Tru Reputation Protocol Sub-Reddit](https://reddit.com/r/truprotocol)

[Tru Reputation Protocol Telegram Channel](https://t.me/truprotocol)

[Tru Reputation Protocol Group Chat](https://t.me/truchat)

[Tru Reputation Protocol Slack Community](https://tru.ltd/slack)

[Tru Ltd Website](https://tru.ltd)

## Legal Notices

**Tru Ltd** is registered in England and Wales, No. 09659526

**© 2017 - Tru Ltd**