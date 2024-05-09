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
// Función para verificar si la pelicula ya existe
async function movieExists(movieName) {
    let driver;
    try {
      driver = await connectDB();
      const session = driver.session();
  
      const result = await session.run(
        'MATCH (m:Movie {name: $movieName}) RETURN m',
        { movieName: movieName }
      );
  
     
      return result.records.length > 0;

    } catch (error) {
      console.error("Error al verificar si la pelicula existe ", error);
      throw error;
    } finally {
      if (driver) {
        await driver.close();
      }
    }
  }
//Metodo para crear una pelicula 
exports.addMovie= async(param, rs)=>{
const body = param.body
const {movieName,director,mainActor,date}=body 
let control

try{
    //Parametros a usar 
    const ms = await dataObligatory(body)
    if(ms) return rs.status(400).send(ms)
    //Validar que la pelicula no exista aun 
    const movieExists=await movieExists(movieName)
    if(movieExists){
        return rs.status(400).json({ error: "La pélicula ya existe" })
    }
    control = await connectDB();
    const sesion = control.session ()
    const results= await sesion.run(
    `CREATE (:Movie {movieName: $movieName, director: $director, mainActor: $mainActor})`,
            { movieName, director, mainActor, date}
        );


}catch{
    console.error('Error executing query:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    } finally {
        if (driver) {
          await driver.close();
        }
      }
    
}

//Funcion para eliminar una pelicula 
// Método para eliminar una película
exports.deleteMovie = async (param, rs) => {
    let control;

    try {

        control = await connectDB();

        // Verificar si la película existe
        const movieExists = await movieExists(movieName);
        if (!movieExists) {
            return rs.status(400).json({ error: "La película no existe" });
        }

        const session = control.session();
        
        // Ejecutar una consulta para eliminar la película por su nombre
        const result = await session.run(
            `MATCH (m:Movie {movieName: $movieName}) DELETE m`,
            { movieName }
        );

        return rs.status(200).json({ message: "Película eliminada correctamente" });
    } catch(error) {
        console.error('Error executing query:', error);
        return rs.status(500).json({ error: 'Error interno del servidor' });
    } finally {
        if (control) {
            await control.close();
        }
    }
}



