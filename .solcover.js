module.exports = {
  norpc: true,
  testCommand: 'node --max-old-space-size=4096 ../node_modules/.bin/truffle test --network coverage',
  skipFiles: ['lifecycle/Migrations.sol',
    'supporting/zeppelin/ownership/Ownable.sol',
    'supporting/zeppelin/contracts/BasicToken.sol',
    'supporting/zeppelin/contracts/BurnableToken.sol',
    'supporting/zeppelin/contracts/ERC20.sol',
    'supporting/zeppelin/contracts/ERC20Basic.sol',
    'supporting/zeppelin/contracts/MintableToken.sol',
    'supporting/zeppelin/contracts/StandardToken.sol',
    'supporting/zeppelin/math/SafeMath.sol'
  ]
}