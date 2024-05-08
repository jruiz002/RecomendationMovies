"use strict"

const express = require('express');
const api = express.Router();
const movieController = require("../Controllers/movieController")

api.get("/searchMovie", movieController.searchMovie);


module.exports = api;