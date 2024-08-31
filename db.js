const { MongoClient } = require('mongodb');

let dbConnection;

module.exports = {
    connectToDb: (cb) => {
        MongoClient.connect('mongodb://localhost:27017/')
            .then((client) => {
                dbConnection = client.db(); // Connect to the database
                return cb(); // No error, so just call cb without arguments
            })
            .catch((err) => {
                console.log(err); // Log the error
                return cb(err); // Pass the error to the callback
            });
    },
    getDb: () => dbConnection 
};
