const express = require("express");
const app = express();
const connectDB = require("./config/db");
const libraryRoutes = require("./routes/library.routes");

app.use(express.json());
app.use("/library", libraryRoutes);

connectDB();

app.listen(8080, () => {
  console.log("Server running on port 8080");
});
