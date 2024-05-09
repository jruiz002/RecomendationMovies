"use strict"
const { connectDB } = require('../../configs/neo4jConfig');
const {dataObligatory} = require("../utils/validate");


//Funcion para crear un actor
exports.createActor = async (req, res) =>{
    const body = req.body;
    const { birth_date, name, nationality } = body;
    let driver
    try {

        // Parámetros requeridos
        const msg = await dataObligatory(body);
        if (msg) return res.status(400).send(msg);

        driver = await connectDB();
        const session = driver.session();   
        const result = await session.run(
            `CREATE (:Actor {birth_date: $birth_date, name: $name, nationality: $nationality})`,
            { birth_date, name, nationality}
        );

        return res.status(200).json({ message: "Actor registrado correctamente"});

    } catch(error){
        console.error('Error executing query:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    } finally {
        if (driver) {
          await driver.close();
        }
      }
}
