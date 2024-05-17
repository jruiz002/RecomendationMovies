"use strict"

const express = require('express');
const api = express.Router();
const actorController = require("../Controllers/actorController");

api.post("/createActor", actorController.createActor);
api.get("/getActors", actorController.getActors)

module.exports = api;