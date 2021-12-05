const Message = require("../Schema/Message");
const User = require("../Schema/User");

async function deletemessage(req, res) {
	const { messageId, userId } = req.body;
	const currentUser = await User.findOne({ _id: userId });

	let messageIndex = currentUser.messages.findIndex((message) => message._id == messageId);
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
	const findCurrentUserAndRemoveGroup = (err, currentUser) => {
		try {
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
		} catch (error) {
			console.log(error);
		}
	};
	try {
		await User.findById({ _id: userId }, (error, currentUser) => findCurrentUserAndRemoveGroup(error, currentUser));
	} catch (err) {
		console.log(err);
	}
}

async function removeContactFromGroup(req, res) {
	const { userId, groupId, contactId } = req.body;
	try {
		const currentUser = await User.findOne({ _id: userId });
		const groupIndex = currentUser.groups.findIndex((group) => group._id == groupId);

		const contactIndex = currentUser.groups[groupIndex].contacts.findIndex((contact) => contact._id == contactId);
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
	} catch (err) {
		console.log(err);
	}
}

async function removeTask(req, res) {
	const { userId, taskId } = req.body;
	try {
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
	} catch (err) {
		console.log(err);
	}
}
async function removeEvent(req, res) {
	const { userId, eventId, key } = req.body;
	try {
		const user = await User.findById({ _id: userId });
		const savedDate = user.savedDates.get(key);
		if (!savedDate) {
			return res.end();
		}
		if (savedDate.events.length === 1) {
			user.savedDates.delete(key);
		} else {
			const eventIndex = savedDate.events.findIndex((event) => eventId == event._id);

			savedDate.events.splice(eventIndex, 1);
			user.savedDates.set(key, {
				events: savedDate.events,
			});
		}

		await User.findByIdAndUpdate(
			{ _id: userId },
			{
				$set: {
					savedDates: user.savedDates,
				},
			}
		);
		await user.save();

		res.end();
	} catch (err) {
		console.log(err);
	}
}

const deleteHandlers = {
	deletemessage,
	removeGroup,
	removeContactFromGroup,
	removeEvent,
	removeTask,
};

module.exports = deleteHandlers;
