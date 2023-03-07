const express = require("express");
const route = express.Router();

const { verifyAccessToken } = require("../helpers/jwt_service");

const userController = require('../Controllers/User.controller')

route.post("/register", userController.register);
route.post("/refresh-token", userController.refreshToken);
route.post("/login", userController.login);
route.delete("/logout", userController.logout);

route.get("/getlists", verifyAccessToken, userController.getLists);

module.exports = route;
