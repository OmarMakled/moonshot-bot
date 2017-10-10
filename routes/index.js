var express = require('express');
var router = express.Router();
const model = require('../models/bot')

router.get('/', function(req, res, next) {
    model.getCount(function(count){
        res.render('index', {count: count})
    })
});

router.get('/bots/', function(req, res, next) {
    model.getBots(function(bots){
        res.render('bots', {bots: bots})
    })
});

module.exports = router;
