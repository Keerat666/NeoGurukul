var express = require('express');
var router = express.Router();
const UserModel = require('../models/users')
var multer = require('multer')

var cloudinary = require('../controllers/cloudinary');

var users = require('../controllers/users')

var crud = require('../middlewares/crud')

router.get('/test', function(req, res) {
    res.send('User Route is Up and Running.');
});

router.get('/allUsers', function(req, res) {
    crud.getAllEntries(req, res, UserModel)
});

router.get('/UserByID', function(req, res) {
    crud.getEntryByID(req, res, UserModel)
});

router.post('/signup', function(req, res) {
    crud.createEntry(req, res, UserModel)
});

router.post('/login', function(req, res) {
    users.user_login(req, res)
});

router.get('/home', function(req, res) {
    users.home(req, res)
});

router.put('/edit', function(req, res) {
    crud.updateEntryByID(req, res, UserModel);
});

router.delete('/delete', function(req, res) {
    crud.deleteEntryByID(req, res, UserModel);
});

router.post(
    '/upload_lecture',
    multer({ dest: 'temp/', limits: { fieldSize: 8 * 1024 * 1024 } }).single(
        'audio'
    ),
    function(req, res) {
        cloudinary.upload_single_image(req, res)
    }
)
module.exports = router;