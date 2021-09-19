const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const groupSchema = new Schema({
	groupName: { type: String},
	contacts:[],
	amount: { type: Number },
	productionDate:{type: String},
})


const Group = mongoose.model("groups", groupSchema);
module.exports = Group;