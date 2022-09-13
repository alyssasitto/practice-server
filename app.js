const express = require("express");
const app = express();

require("dotenv/config");
require("./db/index");

const configMiddleware = require("./config/index");
configMiddleware(app);

const { isAuthenticated } = require("./middleware/jwt.middleware");

const postRoutes = require("./routes/posts.routes");
app.use("/post", isAuthenticated, postRoutes);

const authRoutes = require("./routes/auth.routes");
app.use("/", authRoutes);

module.exports = app;
