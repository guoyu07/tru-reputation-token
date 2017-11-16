var TruReputationToken = artifacts.require("./TruReputationToken.sol");
var TruAddress = artifacts.require("./TruAddress.sol");
var MockUpgradeableToken = artifacts.require("./MockUpgradeableToken.sol");
var MockMigrationTarget = artifacts.require('./MockMigrationTarget.sol');
var MockUpgradeAgent = artifacts.require('./MockUpgradeAgent.sol');
var BasicToken = artifacts.require('./BasicToken.sol');
module.exports = function(deployer) {
  deployer.deploy(TruAddress);
  deployer.link(TruAddress, [TruReputationToken, MockUpgradeableToken, MockMigrationTarget, MockUpgradeAgent, BasicToken]);
  deployer.deploy(TruReputationToken);
};