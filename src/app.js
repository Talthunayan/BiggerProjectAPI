// Dependancies
const express = require("express");
const cors = require("cors");
const path = require("path");
const passport = require("passport");

// Initialize app
const app = express();

// Importing routes
const roomRoutes = require("./routes/rooms");
const userRoutes = require("./routes/users");

// Passport Strategies
const { localStrategy, jwtStrategy } = require("./middleware/passport");

// Importing database
const db = require("./db/models");

// Middleware
app.use(cors());
app.use(express.json());

// Passport Setup
app.use(passport.initialize());
passport.use(localStrategy);
passport.use(jwtStrategy);

// Using routes
app.use("/rooms", roomRoutes);
app.use(userRoutes);

// Media
app.use("/media", express.static(path.join(__dirname, "src/media")));

// Handling Errors
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    message: err.message || "Internal Server Error",
  });
});

// Message
app.get("/", (req, res) => {
  console.log("HELLO");
  res.json({ message: "Hello World" });
});

// Start server
const run = async () => {
  try {
    await db.sequelize.sync({ force: false });
    console.log("Server connected to database successfully.");

    app.listen(8000, () => {
      console.log("Server up and running on port 8000.");
      console.log("You can connect using http://localhost:8000");
    });
  } catch (error) {
    console.log("Failed to connect to database:", error);
  }
};
app.use((req, res, next) => {
  res.status(404).json({ message: "Path not found" });
});
run();
