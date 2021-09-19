const Group = require("../Schema/Group");
const Message = require("../Schema/Message");
const User = require("../Schema/User");
const Contact = require("../Schema/Contact")
const helperFunctions = require("../helper/helperFunctions");

async function addMessage(req, res) {
	let { messageName, messagesList, userId } = req.body;

	let date = new Date();
	let year = date.getFullYear();
	let month = date.getMonth();
	let day = date.getDate() + 1;

	console.log(`${day}/${month}/${year}`);
	let messageDate = `${day}/${month}/${year}`;
	let newMessage = await new Message({ messageName, messageDate, messagesList })

	await User.findByIdAndUpdate({ _id: userId }, {
		$push: {
			"messages": newMessage
		}
	})

	res.status(200).json("ani gever")
}

async function editMessage(req, res) {
	let { messageId, userId, messageName, messagesList } = req.body;
	const currentUser = await User.findById({_id:userId});
	let messageIndex = currentUser.messages.findIndex(message => message._id == messageId);
	if (messageIndex !== -1) {
		
		currentUser.messages.splice(messageIndex, 1, { ...currentUser.messages[messageIndex], messageName, messagesList })
		console.log(currentUser.messages);
		await User.findByIdAndUpdate({ _id: userId }, {
				$set: {
						messages: currentUser.messages
				}
			}) 
			res.status(200).json(currentUser.messages[messageIndex]);
	} else {
			res.status(404).json("message not found");
		}

		// we have option to change the messageID to the message index when we will build the front;
}

async function uploadExcelfile(req, res) {
	let { excelFile, profile, userId, groupName } = req.body;
	let { gender } = profile;

	if (gender && gender !== "without-gender") {
		excelFile = excelFile.filter(row => {
			gender = gender.toLowerCase();
			let currentGender = row?.gender
			currentGender = currentGender.toLowerCase();
			if (currentGender === gender) {

				return true;
			}
			return false;
			})
	}
	addGroup(userId, groupName, excelFile, res);
	
}

async function addGroup(userId, groupName, contacts, res) {
	let duplicate = {};
	let newContacts = [];
	for await (contact of contacts) {
		let phoneNumber = helperFunctions.phoneFormater(contact.phoneNumber);
		if (phoneNumber.properNumber && !duplicate[phoneNumber.phone]) {
			duplicate[phoneNumber.phone] = true;
			let newContact = await new Contact({
				phoneNumber: phoneNumber.phone,
				contactProfile: contact.contactProfile
			});
			newContacts.push(newContact);
		}
	}
	contacts = newContacts;

	const currentUser = await User.findOne({ _id: userId });
	let newGroup = await new Group({ groupName, contacts, amount: contacts.length })
	currentUser.groups.push(newGroup);
	
	await User.findByIdAndUpdate({ _id: userId }, {
		$set: {
			groups: currentUser.groups
		}
	}, { new: true }, function (err, groups) {
		if (err) {
			
		return res.status(400).json("something went worng")
		}
		return res.status(200).json(groups)
	});
}

async function editGroup(req, res) {
	let { userId, groupId, contactId, newContact, newGroupName } = req.body;

	const currentUser = await User.findOne({ _id: userId }) 
	if (currentUser) {
		let groupToEditIndex = currentUser.groups.findIndex(group => group._id == groupId);

		if (groupToEditIndex !== -1) {
			let contactToEditIndex = currentUser.groups[groupToEditIndex].contacts.findIndex(contact => contact._id == contactId);
	

				if (contactToEditIndex !== -1 && newContact) {
					currentUser.groups[groupToEditIndex].contacts[contactToEditIndex] = {...currentUser.groups[groupToEditIndex].contacts[contactToEditIndex], ...newContact};
				}
				if (newGroupName) {
					currentUser.groups[groupToEditIndex].groupName = newGroupName;
				}
			}
		await User.findByIdAndUpdate({ _id: userId }, {
			$set: {
					groups: currentUser.groups
				}
			})
	}
	res.status(200).json(currentUser.groups)
}

async function addContactToGroup(req, res) {
	let { userId, newContact, groupId } = req.body;

	const currentUser =	await User.findOne({ _id: userId });
	const groupIndex = currentUser.groups.findIndex(group => group._id == groupId);
	if (groupIndex !== -1) {
		
		currentUser.groups[groupIndex].contacts.push(new Contact(newContact));
		await User.findByIdAndUpdate({ _id: userId }, {
			$set: {
				groups: currentUser.groups
			}
		})
	}

		res.status(200).json(currentUser.groups[groupIndex])

}

async function combineGroups(req, res) {
	let { userId, groupName, groupA, groupB } = req.body;
	let contacts = groupA.contacts.concat(groupB.contacts);
	addGroup(userId, groupName, contacts, res);
}

const putHandlers = { addMessage, editMessage, uploadExcelfile, editGroup, addContactToGroup, combineGroups };

module.exports = putHandlers


