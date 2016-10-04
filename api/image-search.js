var Bing = require("node-bing-api")({ accKey: process.env.ACCKEY || require("./secret/acckey.js")() });

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
      res.json(body);
    }
  });
  //mongodb update here
};
