const { expect } = require('chai');
const { getMongoBuddyModel } = require('../utils/arrToModel.util')

describe('MongoBuddy Model Generator', function() {
  it('should return a valid json that matches property arguments', function() {
    // 1. ARRANGE
    const args = ['--p', 'username:string', '--p', 'email:email']

    // 2. ACT
    const model = getMongoBuddyModel(args);

    // 3. ASSERT
    expect(Object.keys(model).length).to.equal(2);
    expect(model['username']).to.equal('string');
    expect(model['email']).to.equal('email');
  })
});
