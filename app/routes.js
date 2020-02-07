var express = require('express');
var router = express.Router();

const reqValidator = require("./validator/reqValidator");

const tradeController = require("./controllers/tradeController");
const portfolioController = require("./controllers/portfolioController");

/**
 * Trade API routes
 */
router.post(
    "/trades",
    reqValidator.addTradeValidator,
    tradeController.addTrades
)

router.put(
    "/trades",
    reqValidator.updateTradeValidator,
    tradeController.updateTrade
)

router.delete(
    "/trades",
    reqValidator.removeTradeValidator,
    tradeController.removeTrade
)

/**
 * Portfolio API routes
 */
router.get(
    "/portfolio/details/:user_id",
    reqValidator.fetchPortfolioValidator,
    portfolioController.fetchPortfolio
)

router.get(
    "/portfolio/holdings/:user_id",
    reqValidator.fetchPortfolioValidator,
    portfolioController.fetchHoldings
)

router.get(
    "/portfolio/returns/:user_id",
    reqValidator.fetchPortfolioValidator,
    portfolioController.portfolioReturns
)

module.exports = router;