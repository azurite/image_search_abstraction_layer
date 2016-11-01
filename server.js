var logger = require("connect-logger");
var errorhandler = require("errorhandler");
var favicon = require("serve-favicon");
var _static = require("serve-static");
var mapApiToRoutes = require("./api/map-api-routes.js");
var serveDefault = require("./api/serve-default.js");

var http = require("http");
var path = require("path");

var express = require("express");
var app = express();

if(app.get("env") === "development") {
  app.use(logger());
  app.use(errorhandler());
}

app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
app.use(_static(path.join(__dirname, "public")));

var apiList = ["imagesearch"];

apiList.forEach((item) => {
  mapApiToRoutes(app, item);
});

app.use(serveDefault());

http.createServer(app).listen(process.env.PORT || 8080);
