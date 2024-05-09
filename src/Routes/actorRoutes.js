"use strict"

const express = require('express');
const api = express.Router();
const actorController = require("../Controllers/actorController");

api.get("/createActor", actorController.createActor);


module.exports = api;