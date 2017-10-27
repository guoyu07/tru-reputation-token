var TruReputationToken = artifacts.require("TruReputationToken");

module.exports = function(deployer) {
  deployer.deploy(TruReputationToken);
};