<p align="center">
  <a href="https://tru.ltd">
    <img src="https://tru.ltd/images/logos/tru-V2.jpg" alt="Tru Ltd" height="100px"/>
  </a>
</p>

# Tru Reputation Token

<p align="center">
  <a href="https://travis-ci.org/TruLtd/tru-reputation-token">
    <img src="https://travis-ci.org/TruLtd/tru-reputation-token.svg?branch=master" alt="Build Status"/>
  </a>
  <a href="https://coveralls.io/github/TruLtd/tru-reputation-token?branch=master">
    <img src="https://coveralls.io/repos/github/TruLtd/tru-reputation-token/badge.svg?branch=master" alt="Coverage Status"/>
  </a>
  <a href="https://opensource.org/licenses/Apache-2.0">
    <img src="https://img.shields.io/badge/License-Apache%202.0-blue.svg" alt="License"/>
  </a>
  <a href='http://tru-reputation-token.readthedocs.io/en/latest/?badge=latest'>
    <img src='https://readthedocs.org/projects/tru-reputation-token/badge/?version=latest' alt='Documentation Status' />
  </a>
</p>

Public repository for source code of the **Tru Reputation Token** ERC-20 token, and associated Smart Contracts related to minting or creation of TRU tokens (Pre-Sale, Crowdsale, etc).

Table of Contents
=================

  * **[Instance Details](#Instance-Details)** Details of any public instances of the Contracts in this Project
  * **[Project Structure](#Project-Structure)** Details the folder structure of this Project, what is in each folder, and important files
  * **[Audits](#Audits)** Details the contents and methodoloy of the `./audits` folder
  * **[Testing and Code Coverage](#Testing-and-Code-Coverage)** Details of the Testing Suite included in **Tru Reputation Token**
  * **[Tru DevNet Information](#Tru-DevNet-Information)** Details of the purpose of the `./tru-devnet` folder, and how to leverage it.
  * **[NPM Run Scripts](#NPM-Run-Scripts)** Details all `npm run` scripts defined in the **Tru Reputation Token**
  * **[License](#License)** Details of the License covering the **Tru Reputation Token**
  * **[Contact Information](#Contact-Information)** Details of the Contact Information and Community Portals for *Tru Ltd*, the **Tru Reputation Protocol** and **Tru Reputation Token**
  * **[Legal Notices](#Legal-Notices)** Legal Notices for this **Tru Reputation Token**

## Instance Details

The following instances of the **TruReputationToken**, **TruPreSale** or **TruCrowdSale** Smart Contracts are deployed in the following networks.

### Rinkeby Testnet Instances

| **Contract** | **Address** | **EtherScan Verified?** |
| ---- | --- | --- |
| **TruReputationToken** | [0x3cc6363e5c791f804811e883b0af73cfba1b841d](https://rinkeby.etherscan.io/address/0x3cc6363e5c791f804811e883b0af73cfba1b841d) | **Yes** |
| **TruPreSale** | [0x9a921ee90d0404c8f3f2eb974c8b3a415da142d5](https://rinkeby.etherscan.io/address/0x9a921ee90d0404c8f3f2eb974c8b3a415da142d5) | **Yes** |

## Project Structure

This *Tru Reputation Token Repository* is structured as below:

* `/audits` Contains all Audits of the Solidity Source code. More Information can be found in **[Audits](#Audits)**
* `/audits/oyente` Contains all **[Oyente Audits](https://github.com/melonproject/oyente)** for **Tru Reputation Token**
* `/contracts` Contains all Tru Reputation Token Smart Contracts
* `/contracts/supporting` Contains all supporting Solidity Libraries & Smart Contracts - including modified **[TokenMarket Ltd](https://github.com/TokenMarketNet/ico/)** Contracts & **[Open Zeppelin](https://github.com/OpenZeppelin/zeppelin-solidity/)** Contracts leveraged by **Tru Reputation Token**.
* `/contracts/test-helpers` Smart Contracts used solely during testing to ensure as full coverage as technically possible for **Tru Reputation Token**.
* `/contracts/TruCrowdSale.sol` Smart Contract for the **Tru Reputation Token** CrowdSale
* `/contracts/TruPreSale.sol` Smart Contract for the **Tru Reputation Token** Pre-Sale
* `/contracts/TruReputationToken.sol` Smart Contract for the **Tru Reputation Token**
* `/contracts/TruSale.sol` Base Smart Contract for all Sales for the **Tru Reputation Token**
* `./docs` Contains all source files for Documentation for **Tru Reputation Token** used by Github Pages.
* `/migrations` Contains **[Truffle Framework](https://github.com/trufflesuite/truffle)** Migration configuration files
* `/scripts` Contains helper scripts for the Tru Reputation Token
* `./src` Contains the flattened contracts and ABIs for the Tru Reputation Token (e.g. contain all sub-contracts)- used for EtherScan.io validation and external Static Analysis.
* `/test` Contains all Unit Tests for all Tru Reputation Token Smart Contracts
* `/test/helpers` Contains functions and modules used to help in the Mocha/Chai Test Suite
* `/tru-devnet` Contains configuration files for Geth Test Network for the Tru Reputation Token
* `/.babelrc` Configuration file for Babel
* `/.gitignore` Git Ignore configuration file
* `/.jsintrc` Configuration file for JSHint
* `/.solcover.js` Configuration file for solidity-coverage
* `/.solhint.json` Configuration file for Solhint Linter
* `/.soliumignore` Configuration file for Solium Linter for files to ignore
* `/.soliumrc.json` Configuration file for Solium Linter
* `/.travis.yml` Configuration file for Travis CI
* `/LICENSE` Apache 2.0 License for this project
* `/package.json` Contains NPM package configuration
* `/README.md` This file
* `/truffle.js` Contains **[Truffle Framework](https://github.com/trufflesuite/truffle)** configuration for **Tru Reputation Token**

## Audits

The `/audits` folder contains all audits of the Solidity Source Code for Tru Reputation Token- whether that is generated by tools such as **[Oyente Audits](https://github.com/melonproject/oyente)** (contained in the `/audits/oyente` folder), Penetration Testing or Manual Code Reviews.

## Testing and Code Coverage

The Tru Reputation Token Project has a complete Unit Testing Suite and publicly visible Code Coverage Reports. These reports are generated using [solidity-coverage](https://github.com/sc-forks/solidity-coverage) and can be accessed on the [Tru Reputation Token Coveralls Page](https://coveralls.io/github/TruLtd/tru-reputation-token).

All Testing and Coverage test cases are documented in the [Tru Reputation Token Documentation](https://trultd.readthedocs.io/tru-reputation-token).

## Tru DevNet Information

For your convenience, a [Geth](https://github.com/ethereum/go-ethereum/wiki/geth) genesis.json has been included in this Project, along with a `./scripts/devnet.sh` script (and associated NPM Run Scripts) to allow a test Geth Network to demonstrate and test the Tru Reputation Token, in addition to the TestRPC configurations used for Basic Unit Testing.

## NPM Run Scripts

The following Scripts have been added to the package.json to ease the usage of this project:

| Command | Description | Associated Script |
| --- | --- | --- |
| `compile` | Executes `truffle compile` to compile the Solidity source code | N/A |
| `coverage` | Generates the Coverage reports leveraging the **TestNet TestRPC Network** | `coverage.sh` |
| `clean` | Cleans the compiled Solidity code from the `./build` | N/A |
| `test` | Executes the Test Suite against the **TestNet TestRPC Network** | `testnet.sh` |
| `console-testnet` | Runs the `truffle console` command against the **TestNet TestRPC Network** | `testnet.sh` |
| `migrate-testnet` | Runs the `truffle migrate` command to compile and import the Contracts into the **TestNet TestRPC Network** | `testnet.sh` |
| `restart-testnet` | Restarts & Resets the **TestNet TestRPC Network** | `testnet.sh` |
| `start-testnet` | Starts the **TestNet TestRPC Network** | `testnet.sh` |
| `stop-testnet` | Stops the **TestNet TestRPC Network** | `testnet.sh` |
| `test-testnet` | Executes the Test Suite against the **TestNet TestRPC Network** | `testnet.sh` |
| `flatten` | Generates flattened Smart Contracts in `src` for all Tru Reputation Token Smart Contracts | `flattensrc.sh` |
| `flattentrt` | Generates flattened `TruReputationToken.sol` Smart Contract in `src` | `flattensrc.sh` |
| `flattentps` | Generates flattened `TruPreSale.sol` Smart Contract in `src` | `flattensrc.sh` |
| `flattentcs` | Generates flattened `TruCrowdSale.sol` Smart Contract in `src` | `flattensrc.sh` |


## License

The contents of this Repository are licensed under the Apache 2.0 License. The [License can be read here](LICENSE)

## Acknowledgments

### TokenMarket

All TokenMarket Smart Contracts, libraries and supporting functionality used within this work are licensed under the [Apache 2.0 License](https://github.com/TokenMarketNet/ico/blob/master/LICENSE.txt). The following items are covered by these terms:

- `contracts/supporting/Haltable.sol`
- `contracts/supporting/UpgradeableToken.sol`
- `contracts/supporting/ReleasableToken.sol`
- `contracts/supporting/UpgradeableToken.sol`
- `contracts/supporting/UpgradeAgent.sol`

The original unmodified source files are under copyright of *TokenMarket Ltd* and can be obtained in the [TokenMarket ICO Github Repository](https://github.com/TokenMarketNet/ico)

### Open Zeppelin

All Open Zeppelin Smart Contracts, libraries and supporting functionality used within this work are licensed under the [MIT License](https://github.com/OpenZeppelin/zeppelin-solidity/blob/master/LICENSE). The following items are covered by these terms:


- `contracts/supporting/BasicToken.sol`
- `contracts/supporting/ERC20.sol`
- `contracts/supporting/ERC20Basic.sol`
- `contracts/supporting/StandardToken.sol`
- `contracts/supporting/SafeMath.sol`
- `contracts/supporting/TruMintableToken.sol`
- `contracts/supporting/Ownable.sol`
- `test/helpers/EVMThrow.js`
- `test/helpers/expectThrow.js`
- `test/helpers/increaseTime.js`
- `test/helpers/latestTime.js`

The original unmodified source files are under copyright of *Smart Contract Solutions, Inc.* and can be obtained in the [Open Zeppelin zeppelin-solidity Github Repository](https://github.com/OpenZeppelin/zeppelin-solidity)


## Contribution Guidelines

Whilst this project has been specifically crafted for Tru Ltd's needs, we encourage everyone to report any bugs found via
our [GitHub Issues Page](https://github.com/TruLtd/tru-reputation-token/issues).

Please feel free to fork and modify the code as per the [Apache 2.0 License](https://github.com/TruLtd/tru-reputation-token/blob/master/LICENSE). Happy coding.

## Contact Information

Feel free to contact us directly using the following channels:

[Tru Reputation Protocol Sub-Reddit](https://reddit.com/r/truprotocol)

[Tru Reputation Protocol Telegram Channel](https://t.me/truprotocol)

[Tru Reputation Protocol Group Chat](https://t.me/truchat)

[Tru Reputation Protocol Slack Community](https://tru.ltd/slack)

[Tru Ltd Website](https://tru.ltd)

## Legal Notice

**Tru Ltd is registered in England and Wales, No. 09659526**

**© 2017 - Tru Ltd**