require('babel-register');
require('babel-polyfill');

module.exports = {
  mocha: {
    enableTimeouts: false,
    useColors: true
  },
  networks: {
    testnet: {
      host: 'localhost',
      port: 8546,
      network_id: '*', // Match any network id
      gasPrice: 20e9,
      gas: 0xfffffff,
      before_timeout: 3600000,
      test_timeout: 3600000
    },
    devnet: {
      host: 'tru-devnet',
      gas: 4712388,
      port: 8547,
      network_id: '1066', // Tru Reputation Token Development Network ID is 1066
      before_timeout: 3600000,
      test_timeout: 3600000
    },
    ganache: {
      host: 'localhost',
      gas: 4712388, // Default MainNet Gas Limit
      port: 8548, // Tru Reputation Token Test Ganache Port Number is 8548
      network_id: '1067', // Tru Reputation Token Test Ganache Network ID is 1067
      before_timeout: 3600000,
      test_timeout: 3600000
    },
    rinkeby: {
      host: 'localhost',
      port: 8545,
      from: 'INSERT_ADDRESS_HERE',
      gas: 4712388, // Default MainNet Gas Limit
      network_id: 2,
      gas: 4612388,
      before_timeout: 3600000,
      test_timeout: 3600000
    },
    coverage: {
      host: 'localhost',
      network_id: '*',
      port: 8556,
      gasPrice: 20e9,
      gas: 0xfffffff,
      before_timeout: 3600000,
      test_timeout: 3600000
    }
  }
};