"use strict"

const express = require('express');
const api = express.Router();
const userController = require("../Controllers/userController");

api.get("/register", userController.register);

module.exports = api;