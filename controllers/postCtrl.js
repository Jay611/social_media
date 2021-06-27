const Posts = require("../models/postModel");
const Users = require("../models/userModel");

const fs = require("fs");
var path = require("path");

// Load the SDK for JavaScript
var AWS = require("aws-sdk");
// Set the Region
AWS.config.update({ region: "us-east-1" });
// Create S3 service object
s3 = new AWS.S3({ apiVersion: "2006-03-01" });

const postCtrl = {
  //create a post
  createPost: async (req, res) => {
    try {
      const file = req.files.file;
      const fileName = Date.now() + "_" + file.name;

      // call S3 to retrieve upload file to specified bucket
      var uploadParams = { Bucket: "social-jay611/post", key: "", body: "" };

      // Configure the file stream and obtain the upload parameters

      var fileStream = fs.createReadStream(path.join(file.tempFilePath));
      fileStream.on("error", function (err) {
        console.log("File Error", err);
      });
      uploadParams.Body = fileStream;
      uploadParams.Key = fileName;

      // call S3 to retrieve upload file to specified bucket
      s3.upload(uploadParams, function (err, data) {
        if (err) {
          console.log("Error", err);
        }
        if (data) {
          console.log("Upload Success", data.Location);
        }
        removeTmp(file.tempFilePath);
      });

      const newPost = new Posts({
        userId: req.user.id,
        desc: req.body.desc,
        img: fileName,
      });
      const savedPost = await newPost.save();
      res.status(200).json(savedPost);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  //update a post
  updatePost: async (req, res) => {
    try {
      const post = await Posts.findById(req.params.id);
      if (post.userId === req.user.id) {
        await post.updateOne({ $set: req.body });
        res.status(200).json({ msg: "The post has been updated" });
      } else {
        return res.status(403).json({ msg: "You can update only your post" });
      }
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  //delete a post
  deletePost: async (req, res) => {
    try {
      const post = await Posts.findById(req.params.id);
      if (post.userId === req.user.id) {
        await post.deleteOne();
        res.status(200).json({ msg: "The post has been deleted" });
      } else {
        return res.status(403).json({ msg: "You can delete only your post" });
      }
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  //like /dislike a post
  likePost: async (req, res) => {
    try {
      const post = await Posts.findById(req.params.id);
      if (!post.likes.includes(req.user.id)) {
        await post.updateOne({ $push: { likes: req.user.id } });
        res.status(200).json("The post has been liked");
      } else {
        await post.updateOne({ $pull: { likes: req.user.id } });
        res.status(200).json("The post has been disliked");
      }
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  //get a post
  getPost: async (req, res) => {
    try {
      const post = await Posts.findById(req.params.id);
      res.status(200).json(post);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  //get timeline posts
  timeline: async (req, res) => {
    try {
      const currentUser = await Users.findById(req.user.id);
      const userPosts = await Posts.find({ userId: currentUser._id });
      const friendPosts = await Promise.all(
        currentUser.followings.map((friendId) => {
          return Posts.find({ userId: friendId });
        })
      );
      res.status(200).json(userPosts.concat(...friendPosts));
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  //get user's all posts
  getUserPosts: async (req, res) => {
    try {
      const user = await Users.findOne({ username: req.params.username });
      const posts = await Posts.find({ userId: user._id });
      res.status(200).json(posts);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

const removeTmp = (path) => {
  fs.unlink(path, (err) => {
    if (err) throw err;
  });
};

module.exports = postCtrl;
