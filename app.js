const express = require('express')

//inti app & middleware
const app = express()

app.listen(3000, () => {
    console.log('app listening on port 3000')
})

//routes
app.get('/User', (req, res) => {
    res.json({mssg: "Welcome to the api"})
})