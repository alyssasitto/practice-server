const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const postSchema = new Schema({
	creator: { type: Schema.Types.ObjectId, ref: "User" },
	title: { type: String, required: true },
	description: { type: String, required: true },
});

module.exports = model("Post", postSchema);
