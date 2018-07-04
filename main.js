const { mongodb } = require('./lib/mongodb');

mongodb.connect('mongodb://localhost:27017', 'mongo-cli');