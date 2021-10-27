const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  taskName: { type: String },
  taskColor: { type: String },
  taskContent: { type: String },
});

const Task = mongoose.model("tasks", taskSchema);

module.exports = Task;
