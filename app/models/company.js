let mongoose = require("mongoose");

let companies = new mongoose.Schema({
    id: Number,
    name: String,
    current_security_value: Number
}, {
    timestamps: true,
    versionKey: false
});


module.exports = mongoose.model("Company", companies);
