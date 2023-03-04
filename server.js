// Import the Express app and dotenv module
const app = require("./app");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config({ path: ".env" });

// Set the port number to listen on
const PORT = process.env.PORT;

app.set("view engine", "ejs");

// Start listening on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
