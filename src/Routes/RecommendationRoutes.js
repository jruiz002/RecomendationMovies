"use strict"

const express = require('express');
const api = express.Router();
const recommendation = require("../Controllers/Recommendation")

api.post("/funcRecommendationGenre", recommendation.funcRecommendationGenre)
api.post("/funcRecommendationActor", recommendation.funcRecommendationActor)
api.post("/funcRecommendationDirector", recommendation.funcRecommendationDirector)

module.exports = api;