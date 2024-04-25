'use strict'

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');
const recommendationRoutes = require("../src/Routes/RecommendationRoutes")

const app = express();

//Configuraciones del servidor de express
app.use(helmet());
app.use(bodyParser.urlencoded({extended: false})); 
app.use(bodyParser.json());
app.use(cors());

// RUTAS DEL SERVIDOR
app.use("/recommendation", recommendationRoutes)


module.exports = app;