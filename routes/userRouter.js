const router = require("express").Router();
const userCtrl = require("../controllers/userCtrl");
const auth = require("../middleware/auth");

router.post("/register", userCtrl.register);

router.post("/login", userCtrl.login);

router.get("/logout", userCtrl.logout);

router.get("/refresh_token", userCtrl.refreshToken);

router.get("/info", auth, userCtrl.getUser);

router.get("/friends/:userId", auth, userCtrl.getFriends);

router.put("/update", auth, userCtrl.updateUser);

router.delete("/delete", auth, userCtrl.deleteUser);

router.put("/follow", auth, userCtrl.follow);

router.put("/unfollow", auth, userCtrl.unfollow);

module.exports = router;
