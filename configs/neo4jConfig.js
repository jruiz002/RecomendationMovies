var neo4j = require('neo4j-driver');

exports.connectDB = async ()=>{
const URI = 'neo4j+s://8263efa3.databases.neo4j.io'
  const USER = 'neo4j'
  const PASSWORD = 'oGfZUDMa0B_groM63nQUtRJqjECQEfmbIZaOnYgy1vU'
  let driver

  try {
    driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD))
    const serverInfo = await driver.getServerInfo()
    console.log('Connection established')
    return driver
  } catch(err) {
    console.log(`Connection error\n${err}\nCause: ${err.cause}`)
  }
}