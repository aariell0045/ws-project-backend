const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
	messageName: { type: String },
	contentMessage: [],
});

const Message = mongoose.model("messages", messageSchema);
module.exports = Message;