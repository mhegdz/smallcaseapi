const responseHelper = require("../helpers/responseHelper");
const Company = require("../models/company");
const Transaction = require("../models/transaction");
const portfolio = require("../models/portfolio")
const ObjectID = require('mongodb').ObjectID;

const currentPrice = 100;

/**
 * This API is to fetch the portfolio data with all the transactions
 * request param - user_id
 * @param {*} req 
 * @param {*} res 
 */
const fetchPortfolio = async function (req, res) {
    try {
        const { params } = req;

        /**
         * Get the portfolio doc
         */
        let portfolioDoc = await portfolio.findOne({
            user_id: new ObjectID(params.user_id)
        }).lean()

        /**
         * For all companies, get the transactions, company name as ticker symbol
         */
        if (portfolioDoc && portfolioDoc.portfolio.length) {
            for (let i = 0; i < portfolioDoc.portfolio.length; i++) {
                let companyDoc = await Company.findOne({
                    _id: portfolioDoc.portfolio[i].company_id
                }, { name: 1 })

                portfolioDoc.portfolio[i].ticker_symbol = companyDoc.name
                portfolioDoc.portfolio[i].transactions = await Transaction.find({
                    company: companyDoc._id,
                    transaction_by: new ObjectID(params.user_id)
                }, { _id: 0, createdAt: 0, updatedAt: 0 })
                delete portfolioDoc.portfolio[i]._id
            }
        }

        return responseHelper.success(res, "Portfolio details", portfolioDoc)
    } catch (error) {
        return responseHelper.serverError(res, error);
    }
}

/**
 * This API is to get the aggregate view of all the securities in the portfolio with its final quantity and average buy price
 * request param - user_id
 * @param {*} req 
 * @param {*} res 
 */
const fetchHoldings = async function (req, res) {
    try {
        const { params } = req;

        /**
         * fetching portfolio doc
         */

        let portfolioDoc = await portfolio.findOne({
            user_id: new ObjectID(params.user_id)
        }).lean()

        /**
         * Attach company name for all portfolio objects
         */
        if (portfolioDoc && portfolioDoc.portfolio.length) {
            for (let i = 0; i < portfolioDoc.portfolio.length; i++) {
                let company = await Company.findOne({
                    _id: portfolioDoc.portfolio[i].company_id
                }, { name: 1 })
                portfolioDoc.portfolio[i].ticker_symbol = company.name;
                delete portfolioDoc.portfolio[i]._id;
            }
        }

        return responseHelper.success(res, "Portfolio Holdings", portfolioDoc)
    } catch (error) {
        return responseHelper.serverError(res, error)
    }
}


/**
 * This is the API to get the cumulative returns of the portfolio
 * Request Param - user_id
 * @param {*} req 
 * @param {*} res 
 */
const portfolioReturns = async function (req, res) {
    try {
        /**
         * formula is
         * SUM((current-average)*shares)
         */

        const { params } = req;

        /**
         * Fetching the portfolio doc
         */
        let portfolioDoc = await portfolio.findOne({
            user_id: new ObjectID(params.user_id)
        }).lean()

        let returns = 0;

        if (portfolioDoc && portfolioDoc.portfolio.length) {
            for (let i = 0; i < portfolioDoc.portfolio.length; i++) {
                returns = returns + ((currentPrice - portfolioDoc.portfolio[i].average_buy_price) * portfolioDoc.portfolio[i].shares)
            }
        }

        if (returns < 0) {
            returns = `(${Math.abs(returns)})`
        }
        return responseHelper.success(res, "Cumulative Portfolio returns", `$${returns}`)
    } catch (error) {
        return responseHelper.serverError(res, error)
    }
}

module.exports = {
    fetchPortfolio,
    fetchHoldings,
    portfolioReturns
}