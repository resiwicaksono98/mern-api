const express = require('express')

const app = express()

app.use(() => {
    console.log('Hello server');
    console.log('Hello Lagii');
})

app.listen(4000)