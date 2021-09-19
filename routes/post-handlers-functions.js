const bcrypt = require("bcrypt");
const User = require("../Schema/User");


async function registerHandler(req, res) {
	let {
		userName,
		password,
		messagesStatus = 0,
		groups = [],
		messages = [],
		history = [] } = req.body;
	
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
				let user = await new User({ userName, password: hash, messagesStatus, groups, messages, history });
				await user.save()
				
				// Store hash in your password DB.
			});
			
		});
	} else {
		return res.status(400).json("didnt found password");
	}
	
	res.status(200).json("success");
	
}
	
async function loginHandler(req, res) {
	let { userName, password } = req.body;

	userNmae = userName.trim();
	userName = userName.toLowerCase(); 
	
	let user = await User.findOne({ userName });
	if (user) {
		let hash =  user.password;
		
		bcrypt.compare(password, hash, function (error, result) {
			if (error) {
				return res.status(400).json("password is incorrect")
			} else {
				return res.status(200).json(result);
			}
		})
			
	} else {
		return res.status(400).json("username is incorrect");
	}
	
}


const postHandlers = {
	registerHandler,
	loginHandler,
	
}

module.exports = postHandlers