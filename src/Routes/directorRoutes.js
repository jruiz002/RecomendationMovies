"use strict"

const express = require('express');
const api = express.Router();
const directorController = require("../Controllers/directorController");

api.post("/createDirector", directorController.createDirector);
api.get("/getDirector", directorController.getDirector)


module.exports = api;