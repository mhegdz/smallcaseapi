const responseHelper = require("../helpers/responseHelper");

/**
 * This function is to validate the request body of the add trade API
 * Mandatory fields are - companyId, number_of_securities
 * number_of_securities should always be a positive integer
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const addTradeValidator = function (req, res, next) {
    try {
        let data = req.body;
        if (!data) {
            return responseHelper.validationError(res, "body", "Request body is mandatory");
        } else if (!data.company_id) {
            return responseHelper.validationError(res, "companyId", "Company ID is mandatory")
        } else if (!data.number_of_securities) {
            return responseHelper.validationError(res, "number_of_securities", "Number of securities is mandatory")
        } else if (typeof (data.number_of_securities) != "number") {
            return responseHelper.validationError(res, "number_of_securities", "Number of securities should be an Integer")
        } else if (data.number_of_securities <= 0) {
            return responseHelper.validationError(res, "number_of_securities", "Value of Number of securities should be greater than 0")
        } else if (!data.user_id) {
            /**
             * TODO - remove the validation once the authentication component is added
             */
            return responseHelper.validationError(res, "userId", "User ID is mandatory");
        } else {
            next();
        }
    } catch (error) {
        return responseHelper.serverError(res, error);
    }
}

/**
 * This function is to validate request body of the update trade API
 * Mandatory fields are - companyId, number_of_securities, transactionId
 * number_of_securities should always be a positive integer
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const updateTradeValidator = function (req, res, next) {
    try {
        let data = req.body;
        if (!data) {
            return responseHelper.validationError(res, "body", "Request body is mandatory");
        } else if (!data.transaction_id) {
            return responseHelper.validationError(res, "transactionId", "Transaction ID is mandatory")
        } else if (!data.company_id) {
            return responseHelper.validationError(res, "companyId", "Company ID is mandatory")
        } else if (!data.number_of_securities) {
            return responseHelper.validationError(res, "number_of_securities", "Number of securities is mandatory")
        } else if (typeof (data.number_of_securities) != "number") {
            return responseHelper.validationError(res, "number_of_securities", "Number of securities should be an Integer")
        } else if (data.number_of_securities <= 0) {
            return responseHelper.validationError(res, "number_of_securities", "Value of Number of securities should be greater than 0")
        } else if (!data.user_id) {
            /**
             * TODO - remove the validation once the authentication component is added
             */
            return responseHelper.validationError(res, "userId", "User ID is mandatory");
        } else {
            next();
        }
    } catch (error) {
        return responseHelper.serverError(req, error);
    }
}

/**
 * This function is to validate request body of the delete trade API
 * Mandatory field is - transaction ID
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const removeTradeValidator = function (req, res, next) {
    try {
        let data = req.body;
        if (!data) {
            return responseHelper.validationError(res, "body", "Request body is mandatory");
        } else if (!data.transaction_id) {
            return responseHelper.validationError(res, "transactionId", "Transaction ID is mandatory")
        } else if (!data.user_id) {
            /**
             * TODO - remove the validation once the authentication component is added
             */
            return responseHelper.validationError(res, "userId", "User ID is mandatory");
        } else {
            next();
        }
    } catch (error) {
        return responseHelper.serverError(req, error);
    }
}

/**
 * This function is to validate request body of the portfolio fetch APIs
 * portfolio details and fetch portfolio aggregated data
 * Mandatory field is - userId
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const fetchPortfolioValidator = function (req, res, next) {
    try {
        let data = req.params;
        if (!data) {
            return responseHelper.validationError(res, "body", "Request body is mandatory");
        } else if (!data.user_id) {
            /**
            * TODO - remove the validation once the authentication component is added
            */
            return responseHelper.validationError(res, "userId", "User ID is mandatory")
        } else {
            next()
        }
    } catch (error) {
        return responseHelper.serverError(req, error);
    }
}

module.exports = {
    addTradeValidator,
    updateTradeValidator,
    removeTradeValidator,
    fetchPortfolioValidator
}