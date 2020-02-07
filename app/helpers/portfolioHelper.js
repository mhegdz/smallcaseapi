const portfolio = require("../models/portfolio");
const mongoose = require("mongoose");
const currentPrice = 100;
const transaction = require("../models/transaction");
const ObjectID = require('mongodb').ObjectID;

/**
 * This function gets the transaction documents wrt companyID and userID
 * Calls the functionn to calculate new average and updates the portfolio
 * @param {*} previousDoc - Transaction document before update
 * @param {*} updatedDoc - Transaction document after update
 */
const getTransactionDataAndUpdatePortfolio = async function (previousDoc, updatedDoc) {
    try {
        /**
         * Get the transactions wrt to company ID and user ID
         */
        let transactions = await transaction.find({
            company: updatedDoc.company,
            transaction_by: updatedDoc.transaction_by
        }).lean();
        await updatePortfolioDoc(updatedDoc, transactions);

        /**
         * If the company ID is also updated, update the previous company Records as well
         */

        if (previousDoc.company.toString() != updatedDoc.company.toString()) {
            let previousCompanyTransactions = await transaction.find({
                company: previousDoc.company,
                transaction_by: previousDoc.transaction_by
            })
            await updatePortfolioDoc(updatedDoc, previousCompanyTransactions);
        }
    } catch (error) {
        throw error;
    }
}

/**
 * This function is to calculate the new average and updates the portfolio accordingly
 * @param {*} updatedDoc - Updated Transaction document
 * @param {*} transactions - All transactions wrt company ID and user ID
 */
const updatePortfolioDoc = async function (updatedDoc, transactions, userId) {
    try {
        /**
          * calculate the weighted average
          */
        let totalValue = 0;
        let no_of_securities = 0;
        for (let i = 0; i < transactions.length; i++) {
            no_of_securities = no_of_securities + transactions[i].no_of_securities;
            totalValue = currentPrice * transactions[i].no_of_securities;
        }

        let average = totalValue / no_of_securities;

        /**
         * Update the portfolio
         */

        let portfolioDoc = await portfolio.findOne({
            user_id: updatedDoc.transaction_by
        }).lean();

        /**
         * Find the company data in portfolio
         */
        let docIndex = portfolioDoc.portfolio.findIndex((x) => {
            return x.company_id.toString() == updatedDoc.company.toString();
        })

        if (docIndex > -1) {
            /**
             * Update the data in portfolio
             */
            portfolioDoc.portfolio[docIndex] = {
                company_id: updatedDoc.company,
                average_buy_price: average,
                shares: no_of_securities,
                transaction_by: userId
            }
        } else {
            portfolioDoc.portfolio.push({
                company_id: updatedDoc.company,
                average_buy_price: average,
                shares: no_of_securities
            })
        }

        /**
         * Update portfolio document
         */
        await portfolio.findOneAndUpdate({
            user_id: updatedDoc.transaction_by
        }, portfolioDoc);

        return;
    } catch (error) {
        throw error;
    }
}

/**
 * This function is to create or update the portfolio document based on the transaction
 * @param {*} transactionDoc - Added new transaction
 */
const createOrUpdatePortfolio = async function (transactionDoc, body) {
    try {
        /**
        * Get the portfolio doc of the user
        */
        let portfolioDoc = await portfolio.findOne({
            user_id: transactionDoc.transaction_by
        }).lean();

        if (!portfolioDoc || portfolioDoc.portfolio.length == 0) {
            /**
             * If new entry, i.e. portfolio is not available
             */
            portfolioDoc = {
                user_id: transactionDoc.transaction_by,
                portfolio: [{
                    company_id: transactionDoc.company,
                    average_buy_price: ((body.number_of_securities * currentPrice) / body.number_of_securities),
                    shares: body.number_of_securities
                }]
            }

            await portfolio.create(portfolioDoc);
        } else {
            /**
             * Update the portfolio doc
             */
            let companyIndex = portfolioDoc.portfolio.findIndex((x) => {
                console.log(x)
                return x.company_id.toString() == transactionDoc.company.toString();
            })

            if (companyIndex == -1) {
                throw new Error("Company document is not available in portfolio")
            }
            portfolioDoc.portfolio[companyIndex].average_buy_price = ((portfolioDoc.portfolio[companyIndex].average_buy_price * (body.number_of_securities * currentPrice)) / (portfolioDoc.portfolio[companyIndex].shares + body.number_of_securities))
            portfolioDoc.portfolio[companyIndex].shares = portfolioDoc.portfolio[companyIndex].shares + body.number_of_securities;

            portfolioDoc = await portfolio.findOneAndUpdate({
                _id: portfolio._id,
                user_id: body.user_id
            }, portfolioDoc)
        }
    } catch (error) {
        throw error;
    }
}

const updatePortfolioAfterTradeDeletion = async function (companyId, userId) {
    try {
        /**
         * get all the transaction documents wrt the user and company ID
         */
        let transactionDocs = await transaction.find({
            company: companyId,
            transaction_by: new ObjectID(userId)
        }).lean();

        /**
         * Calculate the new average value
         */
        let totalValue = 0;
        let no_of_securities = 0;
        for (let i = 0; i < transactionDocs.length; i++) {
            no_of_securities = no_of_securities + transactionDocs[i].no_of_securities;
            totalValue = currentPrice * transactionDocs[i].no_of_securities;
        }
        let average = totalValue / no_of_securities;

        /**
         * Get the portfolio document for the user
         */
        let portfolioDoc = await portfolio.findOne({
            user_id: new ObjectID(userId)
        }).lean();

        let companyIndex = portfolioDoc.portfolio.findIndex((x) => {
            return x.company_id.toString() == companyId.toString()
        });

        if (companyIndex == -1) {
            throw new Error("Company document is not available in portfolio")
        } else {
            if (no_of_securities > 0) {
                /**
                 * If the number of securities is still a positive number, update the calculation in the portfolio
                 */
                portfolioDoc.portfolio[companyIndex].average_buy_price = average;
                portfolioDoc.portfolio[companyIndex].shares = no_of_securities;
            } else {
                /**
                 * If the number of securities is 0, remove the company data from portfolio
                 */
                portfolioDoc.portfolio.splice(companyIndex, 1);
            }
        }

        /**
         * Update the portfolio document in the DB
         */
        await portfolio.findOneAndUpdate({
            user_id: mongoose.Types.ObjectId(userId)
        }, portfolioDoc);
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getTransactionDataAndUpdatePortfolio,
    createOrUpdatePortfolio,
    updatePortfolioAfterTradeDeletion
}