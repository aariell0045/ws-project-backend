const User = require("../Schema/User");

async function fetchMessages(req, res) {
	const { userId } = req.params;
	try {
		
		const currentUser = await User.findOne({ _id: userId });
		res.status(200).json(currentUser.messages)
	} catch (err) {
		res.status(404).json(err)
	}
}

async function fetchGroups(req, res) {
	const { userId } = req.params;
	try {
		const currentUser = await User.findOne({ _id: userId });
		res.status(200).json(currentUser.groups)
	} catch (err) {
		res.status(404).json(err)
	}
}

const getHandlers = { fetchMessages, fetchGroups };

module.exports = getHandlers