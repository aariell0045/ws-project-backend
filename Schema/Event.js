const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventSchema = new Schema({
  eventName: { type: String },
  eventColor: { type: String },
  eventContent: { type: String },
});

const Event = mongoose.model("events", eventSchema);

module.exports = Event;
