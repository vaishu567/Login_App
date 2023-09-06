const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connect = require("./database/connection");
const router = require("./router/route");
const dotenv = require("dotenv").config();

const app = express();

// middlewares//
app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));
app.disable("x-powered-by"); //less hackers know about this stack

const port = 8080 || process.env.PORT;

/** HTTP GET Request*/
app.get("/", (req, res) => {
  res.status(201).json("Home GET Request");
});

/**api routes */
app.use("/api", router);
/** start server only when we have the valid connection */
connect()
  .then(() => {
    try {
      app.listen(port, () => {
        console.log(`Starting server on http://localhost:${port}`);
      });
    } catch (error) {
      console.log("Connection error");
    }
  })
  .catch((error) => {
    console.log("Invalid database connection!");
  });
