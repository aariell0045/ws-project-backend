const bcrypt = require("bcrypt");
const User = require("../Schema/User");

async function registerHandler(req, res) {
	let {
		userName,
		password,
		validPhones,
		messagesStatus,
		groups = [],
		messages = [],
		history = [],
		savedDates = {},
	} = req.body;
	try {
		userName = userName.trim();
		userName = userName.toLowerCase();
		const usersCollection = await User.find();

		for (let user of usersCollection) {
			if (user.userName === userName) {
				return res.status(400).json("username is alredy token");
			} else {
				continue;
			}
		}

		const saltRounds = 10;

		if (password) {
			bcrypt.genSalt(saltRounds, function (err, salt) {
				bcrypt.hash(password, salt, async function (err, hash) {
					let user = await new User({
						userName,
						password: hash,
						validPhones: validPhones,
						messagesStatus: messagesStatus || 0,
						groups,
						messages,
						history,
						savedDates,
					});
					await user.save();

					// Store hash in your password DB.
				});
			});
		} else {
			return res.status(400).json("didnt found password");
		}

		res.status(200).json("success");
	} catch (err) {
		console.log(err);
	}
}

async function loginHandler(req, res) {
	let { userName, password } = req.body;
	try {
		userName = userName.trim();
		userName = userName.toLowerCase();

		let user = await User.findOne({ userName });
		let hash = user.password;

		bcrypt.compare(password, hash, function (error, result) {
			if (result) {
				return res.status(200).json({ result, userId: user._id });
			} else {
				return res.status(200).send({ result: "username or password is incorrect", userId: null });
			}
		});
	} catch (err) {
		console.log(err);
	}
}

const postHandlers = {
	registerHandler,
	loginHandler,
};

module.exports = postHandlers;
