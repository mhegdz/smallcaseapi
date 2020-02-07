const mongoose = require("mongoose");

const transactions = new mongoose.Schema({
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "company"
    },
    no_of_securities: { type: Number },
    transaction_type: { type: String },
    value_of_security: { type: Number, default: 100 },
    transaction_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }
}, {
    timestamps: true,
    versionKey: false
});

const Transaction = mongoose.model("Transaction", transactions);

module.exports = Transaction;