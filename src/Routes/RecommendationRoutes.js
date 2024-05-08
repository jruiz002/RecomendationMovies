"use strict"

const express = require('express');
const api = express.Router();
const recommendation = require("../Controllers/Recommendation")

api.get("/funcRecommendationGenre", recommendation.funcRecommendationGenre)
api.get("/funcRecommendationActor", recommendation.funcRecommendationActor)

module.exports = api;