const router = require("express").Router();
const Post = require("../models/Post.model");
const User = require("../models/User.model");

router.get("/", (req, res) => {
	console.log(req);

	const id = req.payload._id;

	Post.find({ creator: id })
		.then((posts) => {
			console.log(posts);
			res.status(200).json({ posts: posts });
		})
		.catch((err) => {
			console.log(err);
			res.status(400).json({ message: "Could not find posts" });
		});
});

router.post("/create-post", (req, res) => {
	const { _id } = req.payload;
	const { title, description } = req.body.info;

	console.log(req);

	// console.log(_id, title, description);

	Post.create({
		creator: _id,
		title,
		description,
	})
		.then((post) => {
			res.status(200).json({ message: "Post created" });
			return User.findByIdAndUpdate(_id, { $push: { posts: post._id } });
		})
		.catch((err) => {
			res.status(400).json({ message: "Could not create post" });
		});

	// Post.create({
	// 	creator: _id,
	// 	title,
	// 	description,
	// })
	// 	.then((response) => {
	// 		res.status(200).json({ message: req.payload });
	// 	})
	// 	.catch((err) => res.status(400).json({ message: "could not create post" }));
});

router.delete("/delete/:id", (req, res) => {
	const id = req.params.id;

	console.log("this is the req header", req.headers);

	Post.findByIdAndDelete(id)
		.then(() => {
			res.send({ message: "Post deleted" });
		})
		.catch((err) => res.status(400));
});

module.exports = router;
