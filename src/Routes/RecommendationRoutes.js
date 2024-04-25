"use strict"

const express = require('express');
const api = express.Router();
const recommendation = require("../Controllers/Recommendation")

api.get("/funcRecommendationGenre", recommendation.funcRecommendationGenre)

module.exports = api;