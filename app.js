const express = require('express');
var cors = require('cors')
const app = express();
const PORT = 8000;
var usersRouter = require('./routes/user_routes');
var classRouter = require('./routes/class_routes');
var lectureRouter = require('./routes/lecture_route');

const swStats = require('swagger-stats');
var swaggerUi = require('swagger-ui-express')
var swaggerDocument = require('./docs/swagger.json');
const path = require('path');


app.use(swStats.getMiddleware({ swaggerSpec: swaggerDocument }));
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//connecting to db
var connection = require('./middlewares/connection').then(db => {

    if (db != undefined) {
        console.log("Connection Success")
    } else {
        console.log("Connection Failed")
    }


}).catch(err => {
    console.log("connection failed due to " + err)
})

//setting up swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

console.log("Swagger running at port 8000 at /api-docs")
    //setting up route for user related API's
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/class',classRouter );
app.use('/api/v1/lecture', lectureRouter);


// // Serve static files from the React app
// app.use(express.static(path.join(__dirname, 'ui/dist')));

// // Handle other routes and return the React app
// app.get('/*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'ui/dist/index.html'));
// });

app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});

module.exports = app;