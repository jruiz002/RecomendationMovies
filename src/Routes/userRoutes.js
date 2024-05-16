"use strict"

const express = require('express');
const api = express.Router();
const userController = require("../Controllers/userController");

api.post("/register", userController.register);
api.post("/login", userController.login);
api.post("/funcWatched", userController.funcWatched);


module.exports = api;