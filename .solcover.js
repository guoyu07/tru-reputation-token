module.exports = {
  norpc: true,
  testCommand: 'node --max-old-space-size=4096 ../node_modules/.bin/truffle test --network coverage',
  skipFiles: ['lifecycle/Migrations.sol',
    'supporting/zeppelin/contracts/BurnableToken.sol',
    'supporting/zeppelin/math/SafeMath.sol',
    'test-helpers/MockMigrationTarget.sol',
    'test-helpers/MockUpgradeableToken.sol',
    'test-helpers/MockUpgradeAgent.sol'
  ]
}