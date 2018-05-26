const MongoClient = require("mongodb").MongoClient;
module.exports = () => {
  return new Promise((resolve, reject) => {
    MongoClient.connect("mongodb://local:27017/", function(err, db) {
      if (err) reject(err);
      resolve(db);
    });
  });
};
