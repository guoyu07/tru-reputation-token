require('babel-register');
require('babel-polyfill');

module.exports = {
  networks: {
    testnet: {
      host: 'localhost',
      port: 8546,
      network_id: '*' // Match any network id
    },
    devnet: {
      host: 'localhost',
      port: 8547,
      network_id: '1066' // Tru Reputation Token Development Network ID is 1066
    },
    ropsten: {
      host: 'localhost',
      port: 8545,
      from: 'INSERT_ADDRESS_HERE',
      network_id: 2,
      gas: 4612388
    },
    coverage: {
      host: 'localhost',
      network_id: '*',
      port: 8556
    }
  }
};