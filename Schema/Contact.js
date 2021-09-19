const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contactSchema = new Schema({
	phoneNumber: { type: String },

	contactProfile: {
		contactFirstName: { type: String },
		contactLastName: { type: String },
		email: { type: String },
		birthday: { type: String },
		age: { type: Number },
		description: { type: String },
		gender: { type: String },
	}
});

const Contact = mongoose.model("contacts", contactSchema);
module.exports = Contact;