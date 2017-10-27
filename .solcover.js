module.exports = {
  norpc: true,
  testCommand: 'node --max-old-space-size=4096 truffle test --network=coverage',
  skipFiles: ['lifecycle/Migrations.sol']
}