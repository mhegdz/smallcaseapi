const responseHelper = require("../helpers/responseHelper");
const Company = require("../models/company");
const Transaction = require("../models/transaction");
const mongoose = require("mongoose");
const portfolioHelper = require("../helpers/portfolioHelper");
const ObjectID = require('mongodb').ObjectID;
const currentPrice = 100;

/**
 * This API accepts the trade data
 * Adds new transaction data wrt user
 * Creates or updates the portfolio accordingly
 * @param {*} req 
 * @param {*} res 
 */
const addTrades = async function (req, res) {
    try {
        let { body } = req;
        /**
         * request body
         * company id
         * number of securities
         * userId
         */

        /**
         * Validating company ID coming from request
         */

        let company = await Company.findOne({
            _id: new ObjectID(body.company_id)
        })
        if (!company) {
            return responseHelper.notFoundError(res, "Company with Passed ID doesnot exist")
        }

        /**
         * Adding a new transaction data in transaction collection
         */
        let transaction = await Transaction.create({
            company: company._id,
            no_of_securities: body.number_of_securities,
            transaction_type: "Buy",
            value_of_security: currentPrice,
            transaction_by: new ObjectID(body.user_id)
        });

        /**
         * Create or update the portfolio document
         */

        await portfolioHelper.createOrUpdatePortfolio(transaction, body)

        /**
         * Success response
         */
        return responseHelper.success(res, "Trade added successfully", transaction);
    } catch (error) {
        responseHelper.serverError(res, error)
    }
}

/**
 * This API updates the transaction data
 * @param {*} req 
 * @param {*} res 
 */
const updateTrade = async function (req, res) {
    try {
        /**
         * Request body
         * trasaction ID
         * company ID
         * number of securities
         * userId
         */

        const { body } = req;

        /**
         * Fetch the transaction document
         */
        let transactionDoc = await Transaction.findOne({
            _id: mongoose.Types.ObjectId(body.transaction_id)
        }).lean();

        if (!transactionDoc) {
            return responseHelper.notFoundError(res, "Transaction with passed ID doesnot exist")
        }

        /**
         * Fetch the company document
         */
        let company = await Company.findOne({
            _id: mongoose.Types.ObjectId(body.company_id)
        }).lean();

        if (!company) {
            return responseHelper.notFoundError(res, "Company with Passed ID doesnot exist")
        }

        /**
         * Update the transaction fields
         */
        transactionDoc.company = (transactionDoc.company.toString() != company._id.toString()) ? company._id : transactionDoc.company;
        transactionDoc.no_of_securities = (transactionDoc.no_of_securities != body.number_of_securities) ? body.number_of_securities : transactionDoc.no_of_securities;

        /**
         * Update the transaction document in DB
         */
        let updatedTransaction = await Transaction.findOneAndUpdate({
            _id: mongoose.Types.ObjectId(body.transaction_id)
        }, transactionDoc, { new: true });

        /**
         * Update the portfolio
         */
        await portfolioHelper.getTransactionDataAndUpdatePortfolio(transactionDoc, updatedTransaction, body.user_id);

        return responseHelper.success(res, "Transaction updated successfully", updatedTransaction);
    } catch (error) {
        responseHelper.serverError(res, error)
    }
}

const removeTrade = async function (req, res) {
    try {
        const { body } = req;

        /**
         * Delete the transaction from transaction collection
         */
        let deletedTransaction = await Transaction.findOneAndRemove({
            _id: new ObjectID(body.transaction_id)
        });

        /**
         * If no return data, i.e. there is no trade with the ID passed
         */
        if (!deletedTransaction) {
            return responseHelper.notFoundError(res, "Transaction with passed ID is not found")
        }

        /**
         * Update the portfolio document wrt deleted trade
         */
        await portfolioHelper.updatePortfolioAfterTradeDeletion(deletedTransaction.company, body.user_id)
        return responseHelper.success(res, "Trade removed successfully", body.transaction_id);
    } catch (error) {
        return responseHelper.serverError(res, error)
    }
}


module.exports = {
    addTrades,
    updateTrade,
    removeTrade
}