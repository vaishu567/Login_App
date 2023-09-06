const mongoose = require("mongoose");

const { MongoMemoryServer } = require("mongodb-memory-server");

// MongoDB In-Memory Server. This package spins up an actual/real MongoDB server programmatically
//  from within nodejs, for testing or mocking during development. By default it holds the data in memory.
async function connect() {
  const mongod = await MongoMemoryServer.create();
  const getUri = mongod.getUri();

  mongoose.set("strictQuery", true);
  // const db = await mongoose.connect(getUri);
  const db = await mongoose.connect(process.env.CONNECTION_STRING);
  console.log("DB connection established:");
  return db;
}

module.exports = connect;
