var express = require('express');
var router = express.Router();
var sys = require('sys')
var fs = require('fs');
var async = require('async');
var request = require('request');

router.use(function(req, res, next){
  console.log('Prediction API');
  next();
})

router.get('/', function(req, res, next) {

  // if(req.query.day && req.query.month && req.query.year && req.query.hours && req.query.minutes){
    var calls = [];

    var tempJSON = JSON.parse(fs.readFileSync('./speedMap.json', 'utf8'));
    // for(var i = 0; i<tempJSON.length; i++){
    //   tempJSON[i].road_saturation = splitArray[i];
    // }

    var completed = [];
    var i = 0;

    var getVal = function(src,des,index){
      request({
          url: 'http://107.167.178.220:8000/queries.json', //URL to hit
          method: 'POST',
          //Lets post the following key/values as form
          json: {features: [2014, 9, 1, 3, 0, src, des]}
      }, function(error, response, body){
          if(error) {
              endFunction(false);
          } else {
              i = i+1;
              tempJSON[index].road_saturation = response.body.label;
              mainController();
          }
      });
    }

    var mainController = function(){
      if(i == tempJSON.length-1){
        endFunction(true);
      }else{
        split = tempJSON[i].link_id.split('-');
        src = split[0];
        console.log(tempJSON[i].index);
        des = split[1];
        getVal(parseInt(src), parseInt(des), parseInt(tempJSON[i].index));
      }
    }



    // for(var i = 0; i<tempJSON.length - 1 ; i++){
    //     calls.push(function(callback) {
    //       var getPrediction = function(src, des, index){
    //         request({
    //             url: 'http://107.167.178.220:8000/queries.json', //URL to hit
    //             method: 'POST',
    //             //Lets post the following key/values as form
    //             json: {features: [2015, 9, 1, 23, 58, src, des]}
    //         }, function(error, response, body){
    //             if(error) {
    //                 callback(error);
    //             } else {
    //               for(var j=0; j<tempJSON.length - 1; j++){
    //                 if(tempJSON[j].index == index){
    //                   tempJSON[j].road_saturation = response.body.label;
    //                   callback(null, i);
    //                 }
    //               }
    //             }
    //         });
    //       }
    //       split = tempJSON[i].link_id.split('-');
    //       src = split[0];
    //       //console.log(src);
    //       des = split[1];
    //       getPrediction(src, des, tempJSON[i].index);
    //     }
    // )};

    var endFunction = function(success){
        /* this code will run after all calls finished the job or
           when any of the calls passes an error */
        if (!success){
          res.status(404);
          res.json({status: 'error', data: 'error'});
        }
        res.status(200);
        res.json({status: 'success', nodes: tempJSON});
    };

    mainController();
      // res.status(200);
      // res.json({status: 'success', nodes: tempJSON});
  // }else{
  //   res.status(404);
  //   res.json({status: 'error', data: 'error'});
  // }
});

//2,11,2014,19,0,4651,4631, 30

module.exports = router;
