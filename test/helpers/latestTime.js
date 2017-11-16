// Returns the time of the last mined block in seconds
'use strict';

export default function latestTime() {
  return web3.eth.getBlock('latest').timestamp;
}