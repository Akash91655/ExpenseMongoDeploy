const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = callback => {
  MongoClient.connect('mongodb+srv://sudharshini2319:6Gg0N9GryDznbR7k@cluster1.higstlz.mongodb.net/?retryWrites=true&w=majority')
  .then(client => {
    console.log('Connected!');
    _db = client.db('expense');
    callback();
  })
  .catch(err => {
    console.log(err);
    throw err;
  });
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
