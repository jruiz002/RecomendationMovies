"use strict"
const { connectDB } = require('../../configs/neo4jConfig');
const {encryptPassword, dencryptPassword, dataObligatory} = require("../utils/validate");
const neo4j = require('neo4j-driver');


// Método para buscar una película por su title
async function findMovie(title) {
    let driver;
    try {
        driver = await connectDB();
        const session = driver.session();
  
        const result = await session.run(
            'MATCH (m:Movie {title: $title}) RETURN m',
            { title: title }
        );
  
        if (result.records.length > 0) {
            const user = result.records[0].get('m').properties;
            return user;
        } else {
            return null; // Movie no encontrado
        }
    } catch (error) {
        console.error('Usuario no encontrado', error);
        throw error;
    } finally {
      if (driver) {
        await driver.close();
      }
    }
  }

exports.updateMovie = async (req, res) =>{
    let driver;
    const idMovie = req.params.id;
    const paramas =req.body;
    const data ={
        title: paramas.title
    }

    try {
        // Parámetros requeridos
        const msg = await dataObligatory(data);
        if (msg) return res.status(400).send(msg);

        // Verificar si ya existe una película con el mismo título
        const existingMovie = await findMovie(data.title);
        if (existingMovie) {
            return res.status(400).send({ message: "El titulo de la pelicula ya existe" });
        }

        driver = await connectDB();
        const session = driver.session();
        const result = await session.run(
            'MATCH (m:Movie) WHERE id(m) = $idMovie SET m.title = $title RETURN m',
            { idMovie: neo4j.int(idMovie), title: data.title }
        );

        return res.status(200).json({ message: "Pelicula actualizada correctamente"});
        

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
    finally {
        if (driver) {
          await driver.close();
        }
    }
}
