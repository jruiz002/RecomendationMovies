"use strict"

const express = require('express');
const api = express.Router();
const genreController = require("../Controllers/genreController");

api.get("/createGenre", genreController.createGenre);


module.exports = api;