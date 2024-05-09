"use strict"
const { connectDB } = require('../../configs/neo4jConfig');
const {dataObligatory} = require("../utils/validate");


  // Función para buscar un genero ya existente 
async function findGenrerByName(name) {
    let driver;
    try {
        driver = await connectDB();
        const session = driver.session();
  
        const result = await session.run(
            'MATCH (u:Genre {name: $name}) RETURN u',
            { name: name }
        );
  
        if (result.records.length > 0) {
            const genre = result.records[0].get('u').properties;
            return genre;
        } else {
            return null; // Usuario no encontrado
        }
    } catch (error) {
        console.error('Genero no encontrado', error);
        throw error;
    } finally {
      if (driver) {
        await driver.close();
      }
    }
  }


//Crear un Genero
exports.createGenre = async (req, res) =>{
    const body = req.body;
    const { description, name, popularity } = body;
    let driver
    try {

        // Parámetros requeridos
        const msg = await dataObligatory(body);
        if (msg) return res.status(400).send(msg);

        // Verificar si el nombre del genero ya existe
        const genreExists = await findGenrerByName(name);
        
        if (genreExists) {
            // Si el nombre del genero ya existe, devuelve un error
            return res.status(400).json({ error: "El genero ya está creado." });
          }

        driver = await connectDB();
        const session = driver.session(); 
        const result = await session.run(
            `CREATE (:Genre {description: $description, name: $name, popularity: $popularity})`,
            { description, name, popularity}
        );


        return res.status(200).json({ message: "Genero registrado correctamente"});


    } catch(error){
        console.error('Error executing query:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    } finally {
        if (driver) {
          await driver.close();
        }
      }
}
