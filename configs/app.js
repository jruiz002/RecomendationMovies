'use strict'

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');
const recommendationRoutes = require("../src/Routes/RecommendationRoutes");
const userRoutes = require("../src/Routes/userRoutes")
const movieRoutes = require("../src/Routes/movieRoutes")

const app = express();

//Configuraciones del servidor de express
app.use(helmet());
app.use(bodyParser.urlencoded({extended: false})); 
app.use(bodyParser.json());
app.use(cors());

// PRE-RUTAS DEL SERVIDOR
app.use("/recommendation", recommendationRoutes)
app.use("/user", userRoutes)
app.use("/movie", movieRoutes)

module.exports = app;