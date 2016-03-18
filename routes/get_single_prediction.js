var express = require('express');
var router = express.Router();
var sys = require('sys')
var fs = require('fs');
// var async = require('async');
var request = require('request');

router.use(function(req, res, next){
  console.log('Prediction API');
  next();
})

router.get('/', function(req, res, next) {

  if(req.query && req.query.day && req.query.month && req.query.year && req.query.hours && req.query.minutes && req.query.src && req.query.des){
    var day = parseInt(req.query.day);
    var month = parseInt(req.query.month);
    var year = parseInt(req.query.year);
    var hours = parseInt(req.query.hours);
    var minutes = parseInt(req.query.minutes);
    var src = parseInt(req.query.src);
    var des = parseInt(req.query.des);
    var tempJSON = JSON.parse(fs.readFileSync('./speedMapSrcDes.json', 'utf8'));
    for(var i= 0;i<tempJSON.length-1;i++){
      if(tempJSON[i].src == src && tempJSON[i].des == des){
        var src_lat = tempJSON[i].src_lat;
        var src_long = tempJSON[i].src_long;
        var des_lat = tempJSON[i].des_lat;
        var des_long = tempJSON[i].des_long;
      }
    }

    request({
        url: 'http://107.167.178.220:8000/queries.json', //URL to hit
        method: 'POST',
        //Lets post the following key/values as form
        json: {features: [day, month, year, hours, minutes, src, des]}
    }, function(error, response, body){
        if(error) {
          res.status(404);
          res.json({status: 'error', data: 'error'});
        } else {
          var label = response.body.label;
          var result = {
            src_lat: src_lat,
            src_long: src_long,
            des_lat: des_lat,
            des_long: des_long,
            label: label
          }
          res.status(200);
          res.json({status: 'success', result: result});
        }
    });
  }else{
    res.status(404);
    res.json({status: 'error', data: 'error'});
  }
});

//2,11,2014,19,0,4651,4631, 30

module.exports = router;
