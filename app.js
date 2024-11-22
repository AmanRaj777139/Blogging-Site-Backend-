require('dotenv').config();
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');

const Blog = require('./models/blog')
const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");
mongoose
  .connect(process.env.MONGO_URL)
  .then((e) => console.log("Mongodb COnnected!!"));

const { checkForAuthenticationCookie } = require("./middlewares/authentication");

const app = express(); 
const PORT = process.env.PORT || 8000;
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie('token'));

//To show the image of the public folder to the webpage
app.use(express.static(path.resolve("./public")))
app.get("/", async(req, res) => {
  const allBlogs = await Blog.find({});
  res.render("home",{
    user: req.user,
    blogs: allBlogs,
  });
});

app.use("/user", userRoute);
app.use("/blog", blogRoute);
app.listen(PORT);
