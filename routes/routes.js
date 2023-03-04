/**
 This module defines the routes for the WhatsApp Bot API.
 @module routes/routes
*/
const express = require("express");
const WhatsAppBotController = require("../controllers/controller");

// Create an instance of the Express router
const router = express.Router();

// Define the route for the WhatsApp Bot API and map it to the WhatsAppBotController
router.get("/", WhatsAppBotController);

// Export the router for use in the main app
module.exports = router;
