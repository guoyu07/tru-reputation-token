module.exports = {
  norpc: true,
  testCommand: 'truffle test --network coverage',
  skipFiles: ['lifecycle/Migrations.sol', // Solely created for Truffle to Migrate contracts into EVM
    'supporting/SafeMath.sol', // Can be added to tests but will only ever achieve 75% Branch coverage as some of the asserts cannot take alt path
    'test-helpers/MockMigrationTarget.sol', // Solely created for coverage testing; will never be used in active deployment
    'test-helpers/MockSale.sol', // Solely created for coverage testing; will never be used in active deployment
    'test-helpers/MockSupportToken.sol', // Solely created for coverage testing; will never be used in active deployment
    'test-helpers/MockUpgradeableToken.sol', // Solely created for coverage testing; will never be used in active deployment
    'test-helpers/MockUpgradeAgent.sol', // Solely created for coverage testing; will never be used in active deployment
    'test-helpers/MockFailUpgradeAgent.sol', // Solely created for coverage testing; will never be used in active deployment
    'test-helpers/MockFailUpgradeableToken.sol', // Solely created for coverage testing; will never be used in active deployment
    '*Full.sol'
  ]
}