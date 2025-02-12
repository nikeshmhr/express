"use strict";

var express = require("../");

var app = express();

app.get("/", function (req, res) {
  console.log("req header", req.header("host"));
  res.send("Hello world");
});

/* istanbul ignore next */
app.listen(3000, function () {
  console.log("Express started on port 3000");
});
