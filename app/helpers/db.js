"use strict";
const mongoose = require("mongoose")

const DBConfig = {
    url: "mongodb://admin:admin1@ds047197.mlab.com:47197/smallcase",
    timeout: 10000,
    user: "admin",
    pass: "admin1",
};


let init = async function () {
    // Url validation
    const URL = DBConfig.url;
    if (!URL) {
        throw Error(`MongoDB connection url is required, none given in DBConfig.url.`);
    }

    // Connection options
    const options = {
        user: DBConfig.user,
        pass: DBConfig.pass,
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    };
    return await establishConnection(URL, options);
}

let establishConnection = function (url, options = {}) {
    // options.server = { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } };
    // options.replicaSet = { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } };

    return new Promise((resolve, reject) => {
        mongoose.connect(url, options)
            .then(() => {
                console.info("DB connected ssuccessfully")
                return resolve(true);
            })
            .catch((error) => {
                console.error("Mongoose failed to connect to MongoDB.", error);
                return reject(false);
            });
    });
}

module.exports = {
    init,
    establishConnection
}