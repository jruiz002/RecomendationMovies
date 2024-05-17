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
exports.movieExists= async(title)=> {
    let driver;
    try {
        driver = await connectDB();
        const session = driver.session();
        const result = await session.run(
            'MATCH (m:Movie {title: $title}) RETURN m',
            { title: title }
        );
        return result.records.length > 0;
    } catch (error) {
        console.error("Error al verificar si la película existe ", error);
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
const {title,release_year ,duration_minutes,rating}=body 
let control

try{
    //Parametros a usar 
    const ms = await dataObligatory(body)
    if(ms) return rs.status(400).send(ms)
    //Validar que la pelicula no exista aun 
    const movieExists=await this.movieExists(title)
    if(movieExists){
        return rs.status(400).json({ error: "La pelicula ya existe" })
    }
    control = await connectDB();
    const sesion = control.session ()
    const result= await sesion.run(
    `CREATE (:Movie {title: $title, release_year: $release_year, duration_minutes: $duration_minutes, rating: $rating} )`,
            { title, release_year, duration_minutes, rating}
        );
    return rs.status(200).send({message: "Pelicula creada exitosamente"})

}catch{
    console.error('Error executing query:', error);
        return rs.status(500).json({ error: 'Error interno del servidor' });
    } finally {
        if (control) {
          await control.close();
        }
      }
    
}

exports.getMovies = async (req, res) => {
    let driver
    try {
        driver = await connectDB();
        const session = driver.session();
        const result = await session.run(
            `MATCH (n:Movie) RETURN n`,
        );
        // Se crea la lista de movies
        let movies = []

        result.records.forEach(record => {
            const movie = record.get('n');
            movies.push(movie.properties)
        });

        return res.status(200).send({movies})

    } catch (error) {

    } finally {
        if (driver) {
            await driver.close();
        }
    }
}

