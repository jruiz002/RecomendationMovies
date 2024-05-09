"use strict"

const express = require('express');
const api = express.Router();
const directorController = require("../Controllers/directorController");

api.get("/createDirector", directorController.createDirector);


module.exports = api;