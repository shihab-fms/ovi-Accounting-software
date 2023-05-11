const dotenv = require("dotenv");
const mongoose = require("mongoose");

const app = require("./app");

dotenv.config({ path: "./config.env" });

const DB = process.env.ATLAS_DATABASE_APPLICATION.replace(
  "<password>",
  process.env.ATLAS_DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => {
  console.log("Database Connection successful");
});

const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
  console.log(`App running on port: ${port}`);
});
