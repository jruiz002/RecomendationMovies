"use strict"

const express = require('express');
const api = express.Router();
const movieController = require("../Controllers/movieController")

//api.get("/searchMovie", movieController.searchMovie);
api.put("/updateMovie/:id", movieController.updateMovie);



module.exports = api;