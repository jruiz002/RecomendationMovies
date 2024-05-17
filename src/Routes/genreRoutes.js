"use strict"

const express = require('express');
const api = express.Router();
const genreController = require("../Controllers/genreController");

api.post("/createGenre", genreController.createGenre);
api.get("/getGenres", genreController.getGenres)

module.exports = api;