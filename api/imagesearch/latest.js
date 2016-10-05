var url = require("url");
var qs = require("querystring");

var mongodb = require("mongodb");
var MongoClient = mongodb.MongoClient;

var defaultMongoUrl = "mongodb://localhost:27017/imagesearch";

function verifyLimit(lim) {
  if(!lim) {
    return 10; //default limit
  }
  var limNum = Number(lim);
  if(isNaN(limNum)) {
    return 10; //default limit
  }
  return (limNum > 50) ? 50 : limNum;
}

module.exports = function latest(req, res) {
  var opts = qs.parse( url.parse(req.url).query );
  opts.limit = verifyLimit(opts.limit);

  MongoClient.connect(process.env.MONGOLAB_URI || defaultMongoUrl, (err, db) => {
    if(err) {
      res.json({
        message: "Sorry there was an error with our database",
        error: err
      });
      return;
    }
    db.collection("history", (err, collection) => {
      if(err) {
        res.json({
          message: "Sorry there was an error with our database",
          error: err
        });
        db.close();
        return;
      }
      collection.find({}, { _id: 0 }).sort({ date: -1 }).limit(opts.limit).toArray((err, docs) => {
        if(err) {
          res.json({
            message: "Sorry there was an error with our database",
            error: err
          });
          db.close();
          return;
        }
        res.json(docs);
        db.close();
      });
    });
  });
};
