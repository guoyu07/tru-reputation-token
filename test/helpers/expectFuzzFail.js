'use strict';

export default async promise => {
  try {
    await promise;
  } catch (error) {

    const revert = error.message.search('revert') >= 0;
    const invalidAddress = error.message.search('invalid address') >= 0;
    const notBase2 = error.message.search('not a base 2 number') >= 0;
    const notBase8 = error.message.search('not a base 8 number') >= 0;
    const notBase16 = error.message.search('not a base 16 number') >= 0;
    const bigNaN = error.message.search('not a number') >= 0;
    const invalidOpcode = error.message.search('invalid opcode') >= 0;
    const invalidNoArgs = error.message.search('Invalid number of arguments') >= 0;
    assert(invalidAddress || invalidOpcode || notBase2 || notBase8 || notBase16 || bigNaN || invalidNoArgs || revert,
      'Expected throw, got "' + error + '" instead');
    return;
  }
  assert.fail('Expected throw not received');
};