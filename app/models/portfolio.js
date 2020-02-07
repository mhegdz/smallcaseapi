const mongoose = require("mongoose");

const portfolios = mongoose.Schema({
    portfolio: [{
        company_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        average_buy_price: { type: Number },
        shares: { type: Number }
    }],
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true,
    versionKey: false
});

const Portfolio = mongoose.model("Portfolio", portfolios);
module.exports = Portfolio;