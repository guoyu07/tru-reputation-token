module.exports = {
  networks: {
    test: {
      host: "localhost",
      port: 8546,
      network_id: "*" // Match any network id
    },
    development: {
      host: "localhost",
      port: 8547,
      network_id: "1066" // Tru Reputation Token Development Network ID is 1066
    },
    ropsten: {
      host: "localhost",
      port: 8545,
      from: "INSERT_ADDRESS_HERE",
      network_id: 2,
      gas: 4612388
    },
    kovan: {
      host: "localhost",
      port: 8545,
      from: "INSERT_ADDRESS_HERE",
      network_id: 3,
      gas: 4612388
    },
    rinkeby: {
      host: "localhost",
      port: 8545,
      from: "INSERT_ADDRESS_HERE",
      network_id: 4,
      gas: 4612388
    }
  }
};
