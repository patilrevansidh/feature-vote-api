var express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser')
    app = express()


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(require('./controlers'))

app.listen(3001,()=>console.log("server started"))