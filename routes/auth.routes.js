const router = require("express").Router();

const User = require("../models/User.model");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const { isAuthenticated } = require("../middleware/jwt.middleware");

router.post("/signup", (req, res) => {
	const { name, email, password } = req.body;

	if (name === "" || email === "" || password === "") {
		res
			.status(400)
			.json({ message: "Please enter a name, email address, and password." });
	}

	const emailRegEx = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
	if (!emailRegEx.test(email)) {
		res.status(400).json({ message: "Please enter a valid email address." });
		return;
	}

	const passwordRegEx = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
	if (!passwordRegEx.test(password)) {
		res.status(400).json({
			message: `Password must include:
	  . One uppercase letter
	  . One lowercase letter
	  . More than 8 characters
	  . At least one special character`,
		});
		return;
	}

	User.findOne({ email }).then((user) => {
		if (user) {
			res.status(400).json({ message: "User already exists" });
			return;
		}

		const salt = bcrypt.genSaltSync(10);
		const hashedPassword = bcrypt.hashSync(password, salt);

		return User.create({
			name,
			email,
			password: hashedPassword,
		})
			.then((user) => {
				const { name, email, _id } = user;

				const userObj = {
					name,
					email,
					_id,
				};

				res.status(200).json({ message: "Account created" });
				console.log(userObj);
			})
			.catch((err) => {
				console.log(err);
			});
	});
});

router.post("/login", (req, res) => {
	const { email, password } = req.body;

	if (email === "" || password === "") {
		res
			.status(400)
			.json({ message: "Please enter an email address and password." });
		return;
	}

	User.findOne({ email })
		.then((user) => {
			if (!user) {
				res.status(404).json({ message: "User not found." });
				return;
			}

			const correctPassword = bcrypt.compareSync(password, user.password);

			if (correctPassword) {
				const { name, email, _id } = user;

				const payload = { name, email, _id };

				const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
					algorithm: "HS256",
					expiresIn: "30m",
				});

				res.status(200).json({ authToken: authToken });
				return;
			} else {
				res.status(400).json({ message: "Could not validate user" });
				return;
			}
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ message: "Internal server error" });
		});
});

router.get("/verify", isAuthenticated, (req, res) => {
	res.status(200).json(req.payload);
});

module.exports = router;
