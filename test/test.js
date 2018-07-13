const { expect } = require('chai');
const { getMongoBuddyModel } = require('../utils/arrToModel.util')

describe('model-generator', function() {
  it('should return a valid json matching argument', function() {
    const args = ['--p', 'username:string', '--p', 'email:email']
    const model = getMongoBuddyModel(args);
    expect(Object.keys(model).length).to.equal(2);
    expect(model['username']).to.equal('string');
    expect(model['email']).to.equal('email');
  });

  it('should throw an error if any props are missing associated type', function() {
    const args = ['--p', 'username:string', '--p', 'email:'];
    expect(
      function() { getMongoBuddyModel(args) }
    ).to.throw(Error);
  });

  it('should throw an error if any types are missing associated prop', function() {
    const args = ['--p', ':string', '--p', 'email:'];
    expect(
      function() { getMongoBuddyModel(args) }
    ).to.throw(Error);
  });
});
