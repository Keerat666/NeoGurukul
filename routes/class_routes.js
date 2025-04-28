var express = require('express');
var router = express.Router();
const Model = require('../models/classMapping')

var crud = require('../middlewares/crud')

router.get('/test', function(req, res) {
    res.send('Class Route is Up and Running.');
});

router.get('/all', function(req, res) {
    crud.getAllEntries(req, res, Model)
});

router.get('/ByID', function(req, res) {
    crud.getEntryByID(req, res, Model)
});

router.post('/create', function(req, res) {
    crud.createEntry(req, res, Model)
});

router.put('/edit', function(req, res) {
    crud.updateEntryByID(req, res, Model);
});

router.delete('/delete', function(req, res) {
    crud.deleteEntryByID(req, res, Model);
});

module.exports = router;