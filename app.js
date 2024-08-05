// define the variables and require modules
const taskRouter = require("./routes/taskRouter");
const express = require('express');
const app = express();

// body parser to be able to access the request and respone body

app.use(express.json());

//middleware to set the time to request

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString;
    next();
})

// define the routes 

app.use('/api/v1/tasks', taskRouter)

// handel all undefined routes 
app.all('*', (req, res, next) => {

    res.status(404).json({
        status: "Fail",
        message: "We can not find your route"
    })
})

module.exports = app