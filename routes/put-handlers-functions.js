const Group = require("../Schema/Group");
const Message = require("../Schema/Message");
const User = require("../Schema/User");
const Contact = require("../Schema/Contact");
const Task = require("../Schema/Task");
const Event = require("../Schema/Event");
const helperFunctions = require("../helper/helperFunctions");
const { phoneFormater } = require("../helper/helperFunctions");

async function addMessage(req, res) {
  let { messageName, contentMessage, userId } = req.body;
  try {
    const newMessage = await new Message({
      messageName,
      contentMessage,
    });

    await User.findByIdAndUpdate(
      { _id: userId },
      {
        $push: {
          messages: newMessage,
        },
      }
    );

    res.status(200).json(newMessage);
  } catch (err) {
    console.log(err);
  }
}

async function editMessage(req, res) {
  let { messageId, userId, messageName, contentMessage } = req.body;
  try {
    const currentUser = await User.findById({ _id: userId });
    const messageIndex = currentUser.messages.findIndex(
      (message) => message._id == messageId
    );
    if (messageIndex !== -1) {
      currentUser.messages.splice(messageIndex, 1, {
        ...currentUser.messages[messageIndex],
        messageName,
        contentMessage,
      });
      await User.findByIdAndUpdate(
        { _id: userId },
        {
          $set: {
            messages: currentUser.messages,
          },
        }
      );
      res.status(200).json(currentUser.messages[messageIndex]);
    } else {
      res.status(404).json("message not found");
    }
  } catch (err) {
    console.log(err);
  }
}

async function uploadExcelfile(req, res) {
  let { excelFile, profile, userId, groupName, filterGender } = req.body;
  let { gender } = profile;
  try {
    if (filterGender !== "without-gender") {
      excelFile = excelFile.filter((row) => {
        filterGender = filterGender.toLowerCase();
        let currentGender = row[gender.toUpperCase().charCodeAt(0) - 65];
        currentGender = currentGender?.toLowerCase();
        if (currentGender?.trim("") === "זכר") {
          currentGender = "male";
        } else if (currentGender?.trim("") === "נקבה") {
          currentGender = "female";
        }
        if (currentGender === filterGender) {
          return true;
        }
        return false;
      });
    }

    const contacts = excelFile.map((row) => {
      let tempContact = {
        phoneNumber: "",
        contactProfile: {
          contactFirstName: "",
          contactLastName: "",
          email: "",
          birthday: "",
          age: undefined,
          description: "",
          gender: "",
        },
      };
      if (profile.firstname) {
        tempContact.contactProfile.contactFirstName =
          row[profile.firstname.toUpperCase().charCodeAt(0) - 65];
      }
      if (profile.lastname) {
        tempContact.contactProfile.contactLastName =
          row[profile.lastname.toUpperCase().charCodeAt(0) - 65];
      }
      if (profile.email) {
        tempContact.contactProfile.email =
          row[profile.email.toUpperCase().charCodeAt(0) - 65];
      }
      if (profile.gender) {
        tempContact.contactProfile.gender =
          row[profile.gender.toUpperCase().charCodeAt(0) - 65];
      }
      if (profile.age) {
        tempContact.contactProfile.age =
          row[profile.firstname.toUpperCase().charCodeAt(0) - 65];
      }
      if (profile.birthday) {
        tempContact.contactProfile.birthday =
          row[profile.birthday.toUpperCase().charCodeAt(0) - 65];
      }
      if (profile.phoneNumber) {
        tempContact.phoneNumber =
          row[profile.phoneNumber.toUpperCase().charCodeAt(0) - 65];
      }
      return tempContact;
    });
    addGroup(userId, groupName, contacts, res);
  } catch (er) {
    console.log(err);
  }
}

async function addGroup(userId, groupName, contacts, res) {
  let duplicate = {};
  let newContacts = [];
  try {
    for await (contact of contacts) {
      let phoneNumber = helperFunctions.phoneFormater(contact.phoneNumber);
      if (phoneNumber.properNumber && !duplicate[phoneNumber.phone]) {
        duplicate[phoneNumber.phone] = true;
        let newContact = await new Contact({
          phoneNumber: phoneNumber.phone,
          contactProfile: contact.contactProfile,
        });
        newContacts.push(newContact);
      }
    }
    contacts = newContacts;

    const dateObject = new Date();
    const year = dateObject.getFullYear();
    const month = dateObject.getMonth() + 1;
    const day = dateObject.getDate();
    const productionDate = `${day}/${month}/${year}`;

    const currentUser = await User.findOne({ _id: userId });
    let newGroup = await new Group({
      groupName,
      contacts,
      productionDate,
      amount: contacts.length,
    });
    currentUser.groups.push(newGroup);

    await User.findByIdAndUpdate(
      { _id: userId },
      {
        $set: {
          groups: currentUser.groups,
        },
      },
      { new: true },
      function (err, groups) {
        if (err) {
          return res.status(400).json("something went worng");
        }
        return res.status(200).json(groups);
      }
    );
  } catch (err) {
    console.log(err);
  }
}

async function editGroup(req, res) {
  let { userId, groupId, contactId, newContact, newGroupName } = req.body;
  try {
    const currentUser = await User.findOne({ _id: userId });
    if (currentUser) {
      let groupToEditIndex = currentUser.groups.findIndex(
        (group) => group._id == groupId
      );

      if (groupToEditIndex !== -1) {
        let contactToEditIndex = currentUser.groups[
          groupToEditIndex
        ].contacts.findIndex((contact) => contact._id == contactId);

        if (contactToEditIndex !== -1 && newContact) {
          const phoneNumber = phoneFormater(newContact.phoneNumber);
          newContact.phoneNumber = phoneNumber.properNumber
            ? phoneNumber.phone
            : "";

          currentUser.groups[groupToEditIndex].contacts[contactToEditIndex] = {
            ...currentUser.groups[groupToEditIndex].contacts[
              contactToEditIndex
            ],
            ...newContact,
          };
        }
        if (newGroupName) {
          currentUser.groups[groupToEditIndex].groupName = newGroupName;
        }
      }
      await User.findByIdAndUpdate(
        { _id: userId },
        {
          $set: {
            groups: currentUser.groups,
          },
        }
      );
    }
    res.status(200).json(currentUser.groups);
  } catch (err) {
    console.log(err);
  }
}

async function addContactToGroup(req, res) {
  let { userId, newContact, groupId } = req.body;
  try {
    const currentUser = await User.findOne({ _id: userId });
    const groupIndex = currentUser.groups.findIndex(
      (group) => group._id == groupId
    );
    if (groupIndex !== -1) {
      if (newContact.phoneNumber) {
        const phoneNumber = phoneFormater(newContact.phoneNumber);
        newContact.phoneNumber = phoneNumber.properNumber
          ? phoneNumber.phone
          : "";
      }
      currentUser.groups[groupIndex].contacts.push(new Contact(newContact));
      currentUser.groups[groupIndex].amount += 1;
      await User.findByIdAndUpdate(
        { _id: userId },
        {
          $set: {
            groups: currentUser.groups,
          },
        }
      );
    }

    res.status(200).json(currentUser.groups[groupIndex]);
  } catch (err) {
    console.log(err);
  }
}

async function combineGroups(req, res) {
  try {
    let { userId, groupName, groupA, groupB } = req.body;
    let contacts = groupA.contacts.concat(groupB.contacts);
    addGroup(userId, groupName, contacts, res);
  } catch (err) {
    console.log(err);
  }
}

async function addTask(req, res) {
  let { taskName, taskColor, taskContent, userId } = req.body;
  try {
    const newTask = await new Task({ taskName, taskColor, taskContent });
    await User.findByIdAndUpdate(
      { _id: userId },
      {
        $push: {
          tasks: newTask,
        },
      }
    );

    res.send(newTask);
  } catch (err) {
    console.log(err);
  }
}
async function addEvent(req, res) {
  let { eventName, eventColor, eventContent, userId } = req.body;
  try {
    const newEvent = await new Event({ eventName, eventColor, eventContent });
    await User.findByIdAndUpdate(
      { _id: userId },
      {
        $push: {
          events: newEvent,
        },
      }
    );

    res.send(newEvent);
  } catch (err) {
    console.log(err);
  }
}

async function updateMessagesStatus(req, res) {
  const { userId, incNumber, operation } = req.body;
  try {
    if (operation === "add") {
      await User.findByIdAndUpdate(
        { _id: userId },
        {
          $inc: {
            messagesStatus: +incNumber,
          },
        }
      );
    }
    if (operation === "decrease") {
      await User.findByIdAndUpdate(
        { _id: userId },
        {
          $inc: {
            messagesStatus: -+incNumber,
          },
        }
      );
    }

    res.status(200).send("updated");
  } catch (err) {
    res.status(400).send(err);
  }
}

const putHandlers = {
  addMessage,
  editMessage,
  uploadExcelfile,
  editGroup,
  addContactToGroup,
  combineGroups,
  addEvent,
  addTask,
  updateMessagesStatus,
};

module.exports = putHandlers;
