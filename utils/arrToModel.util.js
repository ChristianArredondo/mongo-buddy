/**
 * Converts array of cli command arguments to JSON model file
 * @param {string []} args
 * @example
 * 
 * INPUT
 * ['--p', 'name:string', '--p', 'email:email']
 * 
 * OUTPUT JSON FILE
 * { "name": "string", "email": "email" }
 */
function getMongoBuddyModel(args) {
  const model = {}, errors = [];
  if (!args.length) {
    errors.push('You must supply at least one property-type pair!');
  } else if (args.length % 2 !== 0) {
    errors.push('You must supply a property:type pair for each argument! (i.e. "name:string").');
  } else {
    for (let i = 0; i < args.length; i += 2) {
      let [prop, type, ...extras] = args[i+1].split(':');
      if (prop && !type) {
        errors.push(`Property "${prop}" has no associated type (i.e. "${prop}:string").`);
      } else if (type && !prop) {
        errors.push(`Type "${type}" has no matching property name (i.e. "foo:${type}").`);
      } else if ((extras || []).length) {
        errors.push(`Property "${prop}" has multiple associated types: "${[type, ...extras].join(':')}". Properties may only have one associated type (i.e. "${prop}:${type}").`)
      }
      model[prop] = type;
    }
  }
  if (errors.length) {
    throw new Error(['\n', ...errors].join('\n'));
  }
  return model;
}

module.exports = { getMongoBuddyModel }