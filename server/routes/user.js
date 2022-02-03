const express = require("express");
const router = express.Router();
const { user } = require("../src/api");

router.post("/login", user.login);
router.post("/logout", user.logout);
router.post("/register", user.register);

router.post("/updateUserDetails", user.updateUserDetails); // Guest user registers

// for logged in user
router.get("/userDetails", user.getUserDetails);
router.post("/userOrder", user.getUserOrder);
router.post("/updateUserData", user.updateUserData);

module.exports = router;