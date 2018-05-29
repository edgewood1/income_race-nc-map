
const express = require('express')

const app = express()

const path = require("path");

// app.use(express.static('public'))

app.use(express.static("./public"));

// app.use('/static', express.static(path.join(__dirname, 'public')))
// app.get('/', (req, res) => res.send('Hello World!'))

  // index route loads view.html
  app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/index.html"));
  });

app.listen(3001, () => console.log('Example app listening on port 3001!'))