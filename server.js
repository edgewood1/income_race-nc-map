
const express = require('express')

const app = express()

const path = require("path");

var bodyParser = require("body-parser");
// Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));


// app.use(express.static('public'))

app.use(express.static("./public"));

// app.get('/', (req, res) => res.send('Hello World!'))

  // index route loads view.html
  app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/index.html"));
  });

  app.get("/index", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/index.html"));
  });

app.listen(3001, () => console.log('Example app listening on port 3001!'))