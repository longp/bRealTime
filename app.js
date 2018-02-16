require("dotenv").config();
const express = require("express");
const request = require('request');
const rp = require('request-promise');
const app = express();
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3000;
const path = require('path');

// MIDDLEWARE
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



// Add headers for X origin
app.use((req, res, next) => {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});


app.get('/', (req,res) => {
	console.log(req);
	res.send('suh dude');
})

app.get("*", (req,res) => {
	res.send('<h1 style="color:#67c8db">' + process.env.NODE_ENV + ' bRealTime Test Api </h1>');
})

const server = app.listen(PORT, () => {
	console.log(process.env.NODE_ENV)
    console.log("listening on ", PORT);
});
// server.timeout = 600000
