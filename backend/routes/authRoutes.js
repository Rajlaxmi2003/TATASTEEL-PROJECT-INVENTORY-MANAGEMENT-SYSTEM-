const express = require("express");

const router = express.Router();

const authController =
require("../controllers/authController");

router.post(
  "/register",
  authController.register
);

router.post(
  "/login",
  authController.login
);

router.post(
  "/logout",
  authController.logout
);

router.get(
  "/logged-users",
  authController.getLoggedEmployees
);

router.post(
  "/change-password",
  authController.changePassword
);

module.exports = router;