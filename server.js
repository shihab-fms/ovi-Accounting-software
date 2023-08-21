const mongoose = require('mongoose');
const dotenv = require('dotenv');

const app = require('./app');

dotenv.config({ path: './config.env' });

// {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     // useFindAndModify: false,
//   }

const DB = process.env.ATLAS_DATABASE_APPLICATION.replace(
  '<password>',
  process.env.ATLAS_DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => {
  console.log('Database connection successful');
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port: ${port}`);
});
