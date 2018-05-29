
const express = require('express')

const app = express()

var PORT = process.env.PORT || 3002;

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

  require("./routes/html_routes.js")(app);

 

app.listen(PORT, () => console.log('Example app listening on '+ PORT))