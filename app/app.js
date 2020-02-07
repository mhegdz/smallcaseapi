"use strict";

require("dotenv").config();
var bodyParser = require('body-parser')

const express = require("express");
const Db = require("./helpers/db");

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "127.0.0.1";
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.set('host', HOST);
app.set('port', Number(PORT));

var router = require('./routes');
app.use('/', router);

async function start() {
    // Initialize the db, routes
    await Db.init(process.env.NODE_ENV === "development");
    // The server start
    app.listen(process.env.PORT || 3000, "0.0.0.0", (error) => {
        if (error) {
            return signale.error(`Server start failed`, error);
        }
        console.info(`Server environment: ${process.env.NODE_ENV}`);
        console.info(`Server is up: http://${app.get('host')}:${app.get('port')}`);
    });
}
start();