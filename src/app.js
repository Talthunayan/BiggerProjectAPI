// Dependancies
const express = require("express");

// Initialize app
const app = express();

// Message
app.get("/", (req, res) => {
  console.log("HELLO");
  res.json({ message: "Hello World" });
});

// Start server
app.listen(8000, () => {
  console.log("The application is running on localhost:8000");
});
