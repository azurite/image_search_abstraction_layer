var Bing = require("node-bing-api")({ accKey: process.env.ACCKEY || require("../secret/acckey.js")() });

var mongodb = require("mongodb");
var MongoClient = mongodb.MongoClient;
var defaultMongoUrl = "mongodb://localhost:27017/imagesearch";

var url = require("url");
var qs = require("querystring");

module.exports = function image_search(req, res) {
  var searchQuery = qs.parse( url.parse(req.url).query );

  var options = {
    top: searchQuery.top || 20,
    skip: searchQuery.offset || 0
  };

  Bing.images(searchQuery.query, options, (error, response, body) => {
    if(error) {
      res.json({
        message: "There was an error with the Bing search API. Please try again later",
        error: error
      });
    }
    else {
      var payload = body.d.results.map((item) => {
        return {
          imageUrl: item.MediaUrl || "",
          title: item.Title || "",
          thumbnail: item.Thumbnail.MediaUrl || "",
          pageUrl: item.SourceUrl || ""
        };
      });
      res.json(payload);
    }
  });
  //mongodb update here
  MongoClient.connect(process.env.MONGOLAB_URI || defaultMongoUrl, (err, db) => {
    if(err) {
      console.log(err);
      return;
    }
    db.collection("history", (err, collection) => {
      if(err) {
        console.log(err);
        db.close();
        return;
      }
      var hisEntry = {
        query: searchQuery.query,
        date: Date.now()
      };
      collection.insert(hisEntry, (err, result) => {
        if(err) {
          console.log(err);
          db.close();
          return;
        }
        console.log(result);
        db.close();
      });
    });
  });
};
