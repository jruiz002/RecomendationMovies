"use strict"
const { connectDB } = require('../../configs/neo4jConfig');

exports.funcRecommendationGenre = async (req, res) => {
  const { username } = req.body;
  let driver;
  try {
    driver = await connectDB();
    const session = driver.session();

    const result = await session.run(
      `MATCH (:User {username: $username})-[:LIKES]->(g:Genre)
       RETURN g.name AS genreName`,
      { username }
    );
    // Aquí se almacenan los generos que le gustan a un usuario
    const genres = result.records.map(record => record.get('genreName'));
    // Se crea una lista donde se almacenarán las películas de un género en específico 
    const movies = []
    // Se recorren todos lo géneros que le gustan a un usuario
    for (const genre of genres) {
      const resultMovies = await session.run(
        `MATCH (genre:Genre {name: $genre})<-[:HAS_GENRE]-(movie:Movie)
         RETURN movie`,
        { genre }
      );

      resultMovies.records.forEach(record => {
        const movie = record.get('movie');
        movies.push(movie.properties)
      });
    }

    const uniqueTitles = new Set(); // Crear un conjunto para almacenar los títulos únicos
    const peliculasUnicas = [];

    for (const pelicula of movies) {
      if (!uniqueTitles.has(pelicula.title)) { // Verificar si el título ya ha sido visto
        peliculasUnicas.push(pelicula); // Agregar la película a la lista de películas únicas
        uniqueTitles.add(pelicula.title); // Agregar el título al conjunto de títulos únicos
      }
    }
    
    return res.status(200).json({ peliculasUnicas });

  } catch (error) {
    console.error('Error executing query:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  } finally {
    if (driver) {
      await driver.close();
    }
  }
};
