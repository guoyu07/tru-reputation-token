'use strict';

export default async promise => {
  try {
    await promise;
  } catch (error) {
    const notDeployed = error.message.search('has not been deployed to detected network') >= 0;
    assert(notDeployed,
      'Expected throw, got "' + error + '" instead');
    return;
  }
  assert.fail('Expected throw not received');
};