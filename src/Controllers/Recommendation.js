"use strict"
const { connectDB } = require('../../configs/neo4jConfig');

// Función que recomienda películas a través de los géneros que le gustan a un usuario.
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


exports.funcRecommendationActor = async (req, res) => {
  const { username } = req.body;
  let driver;
  try {
    driver = await connectDB();
    const session = driver.session();

    // Se obtienen todas las peliculas que el usuario a visto
    const resultMovies = await session.run(
      `MATCH (usuario:User {username: $username})-[:WATCHED]->(pelicula:Movie)
      RETURN pelicula`,
      { username }
    );

    // Se crea la lista de actores que actuan en las películas que el ha visto
    let actors = []
    
    for (const record of resultMovies.records) {
      const movie = record.get('pelicula');
      const nameMovie = movie.properties.title;
      const resultActors = await session.run(
        `MATCH (actor:Actor)-[:ACTED_IN]->(pelicula:Movie {title: $nameMovie}) RETURN actor`,
        { nameMovie }
      );
      for (const actorRecord of resultActors.records) {
        const actor = actorRecord.get("actor");
        actors.push(actor.properties.name);
      }
    }

    // Se crea la lista de pelicula a recomendar por actor
    let movies = []

    for (const actor of actors){
      const resultMovies_Actors = await session.run(
        `MATCH (actor:Actor {name: $actor})-[:ACTED_IN]->(pelicula:Movie) RETURN pelicula`,
        { actor }
      )

      resultMovies_Actors.records.forEach(record => {
        const movie = record.get('pelicula');
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

    return res.status(200).send({peliculasUnicas})
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  } finally {
    if (driver) {
      await driver.close();
    }
  }
}

exports.funcRecommendationDirector = async (req, res) => {
  const { username } = req.body;
  let driver;
  try {
    driver = await connectDB();
    const session = driver.session();

    // Se obtienen todas las peliculas que el usuario a visto
    const resultMovies = await session.run(
      `MATCH (usuario:User {username: $username})-[:WATCHED]->(pelicula:Movie) RETURN pelicula`,
      { username }
    );

    // Se crea la lista de directores que dirigen las películas que el ha visto
    let directors = []
    
    for (const record of resultMovies.records) {
      const movie = record.get('pelicula');
      const nameMovie = movie.properties.title;
      const resultDirectors = await session.run(
        `MATCH (director:Director)-[:DIRECTED]->(pelicula:Movie {title: $nameMovie}) RETURN director`,
        { nameMovie }
      );
      for (const directorRecord of resultDirectors.records) {
        const director = directorRecord.get("director");
        directors.push(director.properties.name);
      }
    }

    // Se crea la lista de pelicula a recomendar por director
    let movies = []

    for (const director of directors){
      const resultMovies_Directors = await session.run(
        `MATCH (director:Director {name: $director})-[:DIRECTED]->(pelicula:Movie) RETURN pelicula`,
        { director }
      )

      resultMovies_Directors.records.forEach(record => {
        const movie = record.get('pelicula');
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

    return res.status(200).send({peliculasUnicas})
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  } finally {
    if (driver) {
      await driver.close();
    }
  }
}

exports.relationMovieGenre = async (req, res) => {
  let driver;
  try {
    const { title, genre } = req.body;
    driver = await connectDB();
    const session = driver.session();
    const result = await session.run(
      `MATCH (g:Genre {name: $genre}), (m:Movie {title: $title}) 
       MERGE (m)-[:HAS_GENRE]->(g)`, 
      { title, genre }
    );

    return res.status(200).send({ message: "Relación creada." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  } finally {
    if (driver) {
      await driver.close();
    }
  }
}

exports.relationMovieActor = async (req, res) => {
  let driver;
  try {
    const { title, actor } = req.body;
    driver = await connectDB();
    const session = driver.session();
    const result = await session.run(
      `MATCH (a:Actor {name: $actor}), (m:Movie {title: $title}) 
       MERGE (a)-[:ACTED_IN]->(m)`,  
      { title, actor }
    );

    return res.status(200).send({ message: "Relación creada." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  } finally {
    if (driver) {
      await driver.close();
    }
  }
}

exports.relationMovieDirector = async (req, res) => {
  let driver;
  try {
    const { title, director } = req.body;
    driver = await connectDB();
    const session = driver.session();
    const result = await session.run(
      `MATCH (d:Director {name: $director}), (m:Movie {title: $title}) 
       MERGE (d)-[:DIRECTED]->(m)`, 
      { title, director }
    );

    return res.status(200).send({ message: "Relación creada." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  } finally {
    if (driver) {
      await driver.close();
    }
  }
}