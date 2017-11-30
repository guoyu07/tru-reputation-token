var TruReputationToken = artifacts.require("./TruReputationToken.sol");
var TruAddress = artifacts.require("./TruAddress.sol");
var MockUpgradeableToken = artifacts.require("./MockUpgradeableToken.sol");
var MockMigrationTarget = artifacts.require('./MockMigrationTarget.sol');
var MockSupportToken = artifacts.require('./MockSupportToken.sol');
var MockUpgradeAgent = artifacts.require('./MockUpgradeAgent.sol');
var MockFailUpgradeAgent = artifacts.require('./MockFailUpgradeAgent.sol');
var MockFailUpgradeableToken = artifacts.require("./MockFailUpgradeableToken.sol");
var MockSale = artifacts.require('./MockSale.sol');
var BasicToken = artifacts.require('./BasicToken.sol');
var TruSale = artifacts.require('./TruSale.sol');
var TruPreSale = artifacts.require('./TruPreSale.sol');
var TruCrowdSale = artifacts.require('./TruCrowdSale.sol');
module.exports = function(deployer) {
  deployer.deploy(TruAddress);
  deployer.link(TruAddress, [TruReputationToken, MockUpgradeableToken, MockMigrationTarget, MockUpgradeAgent, BasicToken, TruSale, TruPreSale, TruCrowdSale, MockFailUpgradeAgent, MockSale, MockFailUpgradeableToken]);
  deployer.deploy(TruReputationToken);
};