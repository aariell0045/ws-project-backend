const User = require("../Schema/User");

async function fetchMessages(req, res) {
  const { userId } = req.params;
  try {
    const currentUser = await User.findOne({ _id: userId });
    res.status(200).send(currentUser.messages);
  } catch (err) {
    res.status(404).send(err);
  }
}

async function fetchGroups(req, res) {
  const { userId } = req.params;
  try {
    const currentUser = await User.findOne({ _id: userId });
    res.status(200).send(currentUser.groups);
  } catch (err) {
    res.status(404).send(err);
  }
}

async function fetchHistory(req, res) {
  const { userId } = req.params;
  try {
    const currentUser = await User.findOne({ _id: userId });
    res.status(200).send(currentUser.history);
  } catch (err) {
    res.status(400).send(err);
  }
}

async function fetchEvents(req, res) {
  const { userId } = req.params;
  try {
    const currentUser = await User.findOne({ _id: userId });
    const newMap = currentUser.savedDates.entries();
    let events = {};
    for (let arr of newMap) {
      events[arr[0]] = arr[1];
    }

    res.status(200).send(events);
  } catch (err) {
    res.status(400).send(err);
  }
}
async function fetchTasks(req, res) {
  const { userId } = req.params;
  try {
    const currentUser = await User.findOne({ _id: userId });
    res.status(200).send(currentUser.tasks);
  } catch (err) {
    res.status(400).send(err);
  }
}

async function fetchMessagesStatus(req, res) {
  const { userId } = req.params;
  try {
    const currentUser = await User.findOne({ _id: userId });
    res.status(200).send(JSON.stringify(currentUser.messagesStatus));
  } catch (err) {
    res.status(400).send(err);
  }
}

const getHandlers = {
  fetchMessages,
  fetchGroups,
  fetchHistory,
  fetchEvents,
  fetchTasks,
  fetchMessagesStatus,
};

module.exports = getHandlers;
