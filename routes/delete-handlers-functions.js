const Message = require("../Schema/Message");
const User = require("../Schema/User");

async function deletemessage(req, res) {
  const { messageId, userId } = req.body;
  const currentUser = await User.findOne({ _id: userId });

  let messageIndex = currentUser.messages.findIndex(
    (message) => message._id == messageId
  );
  if (messageIndex !== -1) {
    currentUser.messages.splice(messageIndex, 1);
    await User.findByIdAndUpdate(
      { _id: userId },
      {
        $set: {
          messages: currentUser.messages,
        },
      }
    );
  }

  res.status(200).json("deleted");
}

async function removeGroup(req, res) {
  const { userId, groupId } = req.body;

  await User.findById({ _id: userId }, function (err, currentUser) {
    const groupIndex = currentUser.groups.findIndex(
      (group) => group._id == groupId
    );
    if (groupIndex !== -1) {
      currentUser.groups.splice(groupIndex, 1);
      currentUser.save(function (err) {
        if (err) {
          res.status(400).json("Error:", err);
        } else {
          res.status(200).json(currentUser);
        }
      });
    } else {
      res.status(400).json("something worng");
    }
  });
}

async function removeContactFromGroup(req, res) {
  const { userId, groupId, contactId } = req.body;
  const currentUser = await User.findOne({ _id: userId });
  const groupIndex = currentUser.groups.findIndex(
    (group) => group._id == groupId
  );

  const contactIndex = currentUser.groups[groupIndex].contacts.findIndex(
    (contact) => contact._id == contactId
  );
  currentUser.groups[groupIndex].contacts.splice(contactIndex, 1);
  currentUser.groups[groupIndex].amount -= 1;

  await User.findByIdAndUpdate(
    { _id: userId },
    {
      $set: {
        groups: currentUser.groups,
      },
    }
  );

  res.status(200).json(currentUser);
}

async function removeTask(req, res) {
  const { userId, taskId } = req.body;
  const currentUser = await User.findById({ _id: userId });
  const taksIndex = currentUser.tasks.findIndex((task) => taskId == task._id);
  currentUser.tasks.splice(taksIndex, 1);
  await User.findByIdAndUpdate(
    { _id: userId },
    {
      $set: {
        tasks: currentUser.tasks,
      },
    }
  );
  res.send(currentUser);
}
async function removeEvent(req, res) {
  const { userId, eventId } = req.body;
  const currentUser = await User.findById({ _id: userId });
  const taksIndex = currentUser.events.findIndex(
    (event) => eventId == event._id
  );
  currentUser.events.splice(taksIndex, 1);
  await User.findByIdAndUpdate(
    { _id: userId },
    {
      $set: {
        events: currentUser.events,
      },
    }
  );

  res.send(currentUser);
}

const deleteHandlers = {
  deletemessage,
  removeGroup,
  removeContactFromGroup,
  removeEvent,
  removeTask,
};

module.exports = deleteHandlers;
