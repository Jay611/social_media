const Users = require("../models/userModel");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userCtrl = {
  register: async (req, res) => {
    try {
      const { username, email, password } = req.body;

      const user = await Users.findOne({ email });
      if (user)
        return res.status(400).json({ msg: "The email already exists." });

      if (password.length < 6)
        return res
          .status(400)
          .json({ msg: "Password is at least 6 characters long." });

      // Password Encryption
      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = new Users({
        username,
        email,
        password: passwordHash,
      });

      // Save mongoDB
      await newUser.save();

      // Then create jsonwebtoken to authenticate
      const accesstoken = createAccessToken({ id: newUser._id });
      const refreshtoken = createRefreshToken({ id: newUser._id });

      res.cookie("refreshtoken", refreshtoken, {
        httpOnly: true,
        path: "/user/refresh_token",
        maxAge: 7 * 24 * 60 * 60 * 1000, //7d
      });

      res.status(200).json({ accesstoken });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await Users.findOne({ email });
      if (!user) return res.status(400).json({ msg: "User does not exist." });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ mag: "Incorrect password." });

      //If login success, create access token and refresh token
      const accesstoken = createAccessToken({ id: user._id });
      const refreshtoken = createRefreshToken({ id: user._id });

      res.cookie("refreshtoken", refreshtoken, {
        httpOnly: true,
        path: "/user/refresh_token",
        maxAge: 7 * 24 * 60 * 60 * 1000, //7d
      });

      res.status(200).json({ accesstoken });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  logout: async (req, res) => {
    try {
      res.clearCookie("refreshtoken", { path: "/user/refresh_token" });
      res.status(200).json({ msg: "Logged out" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  refreshToken: (req, res) => {
    try {
      const rf_token = req.cookies.refreshtoken;

      if (!rf_token)
        return res.status(400).json({ msg: "Please Login or Register" });

      jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err)
          return res.status(400).json({ msg: "Please Login or Register" });

        const accesstoken = createAccessToken({ id: user.id });

        res.status(200).json({ accesstoken });
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getUser: async (req, res) => {
    try {
      const userId = req.query.userId ? req.query.userId : req.user.id;
      const username = req.query.username;

      const user = username
        ? await Users.findOne({ username: username })
        : await Users.findById(userId).select("-password");

      if (!user) return res.status(400).json({ msg: "User does not exist." });

      res.status(200).json(user);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getFriends: async (req, res) => {
    try {
      const user = await Users.findById(req.params.userId);
      const friends = await Promise.all(
        user.followings.map((friendId) => {
          return Users.findById(friendId, "_id username profilePicture");
        })
      );
      res.status(200).json(friends);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateUser: async (req, res) => {
    try {
      if (req.body.password) {
        req.body.password = await bcrypt.hash(req.body.password, 10);
      }
      const user = await Users.findByIdAndUpdate(req.user.id, {
        $set: req.body,
      });
      res.status(200).json({ msg: "Account has been updated" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deleteUser: async (req, res) => {
    try {
      const user = await Users.findByIdAndDelete(req.user.id);
      res.status(200).json({ msg: "Account has been deleted" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  follow: async (req, res) => {
    try {
      if (req.body.userId !== req.user.id) {
        const user = await Users.findById(req.user.id);
        const currentUser = await Users.findById(req.body.userId);
        if (!user.followings.includes(req.body.userId)) {
          await user.updateOne({ $push: { followings: req.body.userId } });
          await currentUser.updateOne({ $push: { followers: req.user.id } });
          res.status(200).json({ msg: "user has been followed" });
        } else {
          res.status(400).json({ msg: "You already follow this user" });
        }
      } else {
        res.status(400).json({ msg: "you cannot follow yourself" });
      }
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  unfollow: async (req, res) => {
    try {
      if (req.body.userId !== req.user.id) {
        const user = await Users.findById(req.user.id);
        const currentUser = await Users.findById(req.body.userId);
        if (user.followings.includes(req.body.userId)) {
          await user.updateOne({ $pull: { followings: req.body.userId } });
          await currentUser.updateOne({ $pull: { followers: req.user.id } });
          res.status(200).json({ msg: "user has been unfollowed" });
        } else {
          res.status(400).json({ msg: "You dont follow this user" });
        }
      } else {
        res.status(400).json({ msg: "you cannot unfollow yourself" });
      }
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

const createAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "60m" });
};
const createRefreshToken = (user) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1d" });
};

module.exports = userCtrl;
