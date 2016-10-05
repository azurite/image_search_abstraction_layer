module.exports = function(app, api_type) {
  var search = require("./" + api_type + "/search.js");
  var latest = require("./" + api_type + "/latest.js");

  app.get("/api/" + api_type, search);
  app.get("/api/latest/" + api_type, latest);
};
