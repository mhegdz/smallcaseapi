const success = function (res, message, data) {
    try {
        res.status(200).send({
            error: false,
            status: 200,
            message: message,
            data: data
        });
    } catch (error) {
        throw error;
    }
}

const serverError = function (res, error) {
    try {
        res.status(500).send({
            error: true,
            status: 500,
            data: null,
            message: `Something went wrong, Please try later\n${error}`
        })
    } catch (error) {
        throw error;
    }
}

const validationError = function (res, key, message) {
    try {
        res.status(400).send({
            error: true,
            status: 400,
            data: null,
            message: `message:${message}\npath:${key}`
        })
    } catch (error) {
        throw error;
    }
}

const notFoundError = function (res, message) {
    try {
        res.status(404).send({
            error: true,
            status: 404,
            data: null,
            message: message
        });
    } catch (error) {
        throw error;
    }
}

const unauthorized = function (res) {
    try {
        res.status(401).send({
            error: true,
            status: 401,
            data: null,
            message: "Unauthorized, Please login to continue"
        });
    } catch (error) {
        throw error
    }
}

module.exports = {
    success,
    serverError,
    validationError,
    notFoundError,
    unauthorized
}