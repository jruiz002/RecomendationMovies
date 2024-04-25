'use strict'

const app = require("./configs/app");
const port = 3000;
const neo4j = require("./configs/neo4jConfig")

//Levantamos la conexión a la base de datos.
neo4j.connectDB()

//Levantamos el servidor en el puerto 3000.
app.listen(port, ()=>{
    console.log(`Express | Server running on port ${port}`);

})