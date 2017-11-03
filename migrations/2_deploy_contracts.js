var TruReputationToken = artifacts.require("./TruReputationToken.sol");

module.exports = function(deployer) {
  deployer.deploy(TruReputationToken);
};