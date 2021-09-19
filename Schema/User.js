const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
	userName: { type: String },
	password: { type: String },
	messagesStatus: { type: Number },
	groups: [],
	messages: [],
	history: [],
});

const User = mongoose.model("users", userSchema);
module.exports = User;