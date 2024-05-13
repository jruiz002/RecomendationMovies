"use strict"

const express = require('express');
const api = express.Router();
const movieController = require("../Controllers/movieController")

api.put("/updateMovie/:id", movieController.updateMovie);
api.post("/addMovie",movieController.addMovie )



module.exports = api;