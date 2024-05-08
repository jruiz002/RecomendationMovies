"use strict"
const { connectDB } = require('../../configs/neo4jConfig');

// Método para buscar una película por su nombre
exports.searchMovie = async (movieName) => {
    let driver;
    try {
        driver = await connectDB();
        const session = driver.session();

        const result = await session.run(
            'MATCH (m:Movie {name: $movieName}) RETURN m',
            { movieName: movieName }
        );

        if (result.records.length > 0) {
            const movie = result.records[0].get('m').properties;
            return movie;
        } else {
            return res.status(400).send({ message: "Pelicula no encontrada" });
        }
    } catch (error) {
        console.error('Pelicula no encontrada', error);
        return { error: "Error al buscar película" };
    }  
    finally {
        if (driver) {
          await driver.close();
        }
    }
}