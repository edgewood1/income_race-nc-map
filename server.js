
const express = require('express')

const app = express()

// app.use(express.static('public'))

app.use('/static', express.static(path.join(__dirname, 'public')))
// app.get('/', (req, res) => res.send('Hello World!'))

app.listen(3001, () => console.log('Example app listening on port 3001!'))