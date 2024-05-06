"use strict"
const { connectDB } = require('../../configs/neo4jConfig');
const {encryptPassword, dencryptPassword} = require("../utils/validate");

// Función para verificar si el nombre de usuario ya existe
async function usernameExists(username) {
    let driver;
    try {
      driver = await connectDB();
      const session = driver.session();
  
      const result = await session.run(
        `MATCH (u:User {username: $username}) RETURN u`,
        { username }
      );
  
      // Si se encontró un usuario con el mismo nombre de usuario, devuelve true
      return result.records.length > 0;

    } catch (error) {
      console.error("Error al verificar si el nombre de usuario existe:", error);
      throw error;
    } finally {
      if (driver) {
        await driver.close();
      }
    }
  }

//Registrar un usuario
exports.register = async (req, res) =>{
    const body = req.body;
    const { age, country, email, username, password } = body;
    let driver
    try {
        // Verificar si el nombre de usuario ya existe
        const userExists = await usernameExists(username);
        
        if (userExists) {
            // Si el nombre de usuario ya existe, devuelve un error
            return res.status(400).json({ error: "El nombre de usuario ya está en uso." });
          }

        driver = await connectDB();
        const session = driver.session(); 
        const password1 = await encryptPassword(password.body)   
        const result = await session.run(
            `CREATE (:User {age: $age, country: $country, email: $email, username: $username, password: $password1})`,
            { age, country, email, username, password1}
        );

        const genres = body.genres;

        //Obtener lista de generos y crear las relaciones
        for (let i = 0; i < genres.length; i++) {
            const genre = genres[i];
            
            const result = await session.run(
            `MATCH (u:User {username: $username}), (g:Genre {name: $genre}) 
            CREATE (u)-[:LIKES]->(g)`, {username, genre}
            );
        }

        return res.status(200).json({ message: "Usuario registrado correctamente"});


    } catch(error){
        console.error('Error executing query:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    } finally {
        if (driver) {
          await driver.close();
        }
      }
}