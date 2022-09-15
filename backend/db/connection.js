const mongoose = require("mongoose");

const DB = process.env.DATABASE;

mongoose
  .connect(DB)
  .then(() => console.log("DataBase Is Connected Successfully"))
  .catch((error) => console.log("Database Not Connected " + error.message));
