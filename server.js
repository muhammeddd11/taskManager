//define variables and reuire modules
const dotenv = require('dotenv');
const app = require('./app');
const mongoose = require('mongoose');

// grante access to config file 
dotenv.config({ path: "./config.env" })
// define all variables that are depending on config.env file because now we have access to it 

const port = process.env.APP_PORT || 3000
const connection_string = process.env.DB_CONNECTION.replace('<PASSWORD>', process.env.DB_PASSWORD)

// establish the connection with the database

mongoose.connect(connection_string).then(() => {
    console.log("Connection has been established");
});
app.listen(port, () => {
    console.log(`App listing on port ${port}`)
})
