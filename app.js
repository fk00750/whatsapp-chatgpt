/**
 This is the main application file that creates an Express application and sets up the routes.
 @module app
 @requires express
 @requires ./routes/routes
 */
const express = require("express");
const morgan = require("morgan");

// Import the router object that contains all the routes
const router = require("./routes/routes");

// Create a new Express application
const app = express();

// logs the https request
app.use(morgan("dev"));

// Mount the router middleware on the app to use the routes
app.use("/", router);

// Export the app so it can be used in other modules
module.exports = app;