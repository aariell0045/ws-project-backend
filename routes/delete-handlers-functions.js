const Message = require("../Schema/Message");
const User = require("../Schema/User");

async function deletemessage(req, res) {
	let { messageId, userId } = req.body;
	const currentUser = await User.findOne({ _id: userId });

	let messageIndex = currentUser.messages.findIndex((message) => message._id == messageId);
	if (messageIndex !== -1) {
		currentUser.messages.splice(messageIndex, 1);
		console.log(currentUser.messages);
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
	let { userId, groupId } = req.body;

	await User.findById({ _id: userId }, function (err, currentUser) {
		const groupIndex = currentUser.groups.findIndex((group) => group._id == groupId);
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
	let { userId, groupId, contactId } = req.body;
	const currentUser = await User.findOne({ _id: userId });
	const groupIndex = currentUser.groups.findIndex((group) => group._id == groupId);

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

const deleteHandlers = { deletemessage, removeGroup, removeContactFromGroup };

module.exports = deleteHandlers;
