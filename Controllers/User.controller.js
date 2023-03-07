const express = require("express");
const route = express.Router();
const { userValidate } = require("../helpers/validation");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require("../helpers/jwt_service");
const client = require("../helpers/connections_redis");
const User = require("../models/User.model");
const createError = require("http-errors");
module.exports = {
  register: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const { error } = userValidate(req.body);
      if (error) {
        throw createError(error.details[0].message);
      }
      const isExist = await User.findOne({ email: email });
      if (isExist) {
        throw createError.Conflict(`${email} already exists in system`);
      }
      // const savedUser = await User.create({ email: email, password: password });

      const user = new User({ email, password });
      const savedUser = await user.save();

      return res.json({
        status: "okay",
        element: savedUser,
      });
    } catch (error) {
      next(error);
    }
  },
  refreshToken: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        throw createError.BadRequest();
      }
      const payload = await verifyRefreshToken(refreshToken);
      const { userId } = payload;
      const accessToken = await signAccessToken(userId);
      const newRefreshToken = await signRefreshToken(userId);

      res.json({
        accessToken,
        newRefreshToken,
      });
    } catch (error) {
      next(error);
    }
  },

  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const { error } = userValidate(req.body);
      if (error) {
        throw createError(error.details[0].message);
      }
      const user = await User.findOne({ email });
      if (!user) {
        throw createError.NotFound("user not registed");
      }
      const isValid = await user.isCheckPassword(password);
      if (!isValid) {
        throw createError.Unauthorized();
      }
      const accessToken = await signAccessToken(user._id);
      const refreshToken = await signRefreshToken(user._id);
      res.json({
        accessToken,
        refreshToken,
      });
    } catch (error) {
      next(error);
    }
  },
  logout: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        throw createError.BadRequest();
      }
      const { userId } = await verifyRefreshToken(refreshToken);
      client.del(userId.toString(), (err, reply) => {
        if (err) {
          throw createError.InternalServerError();
        }
        res.json({
          message: "Logout successfully",
        });
      });
    } catch (error) {
      next(error);
    }
  },
  getLists: (req, res, next) => {
    const listUsers = [
      {
        email: "abc@gmail.com",
      },
      {
        email: "def@gmail.com",
      },
    ];
    res.json({
      listUsers,
    });
  },
};
