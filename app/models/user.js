const bcrypt = require("bcrypt-nodejs");
const mongoose = require("mongoose");

const users = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    contact: String,
    address: String,
    zip_code: Number,
    deleted: { type: Boolean, default: false }
}, {
    timestamps: true,
    versionKey: false
}
);

/**
 * Password hash middleware.
 */
users.pre("save", function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    // @ts-ignore
    this.password = this.createPassword(this.password);
    next();
});

/**
 * Helper method for validating user's password.
 */
users.methods.comparePassword = function (password) {
    const M = `${S}[comparePassword]`;
    try {
        return bcrypt.compareSync(password, this.password);
    } catch (error) {
        throw error;
    }
};

users.methods.createPassword = (password) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
};

const User = mongoose.model("User", users);
module.exports = User;