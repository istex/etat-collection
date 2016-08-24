'use strict';

const angular = require('angular'),
      request = require('request'),
      path = require('path'),
      mkdirp = require('mkdirp'),
      sha1 = require('sha1'),
      csv = require('json-2-csv'),
      fs = require('fs');

const tmpPath = path.resolve(__dirname , '../../tmp');

const optionsCsv = {
    delimiter : {
        wrap  : '"', // Double Quote (") character
        field : ',', // Comma field delimiter
        array : ';', // Semicolon array value delimiter
        eol   : '\n' // Newline delimiter
    },
    prependHeader    : true,
    sortHeader       : false,
    trimHeaderValues : true,
    trimFieldValues  :  true
};

angular
  .module('app', [])
  .controller('appController', ["$scope",appController]);

function appController($scope) {
  $scope.proxy = true; //Default proxy ON
  $scope.$watch('app.url', (newValue,oldValue,scope)=>{
    if (newValue !== oldValue){
      $scope.error = '';
      $scope.bodyClass = '';
      if(!newValue) return;
      if((newValue && (newValue.indexOf('api.istex.fr') < 0))){
        $scope.error = 'Il ne s\'agit pas d\'un lien istex';
        $scope.bodyClass = 'badUrl';
        return;
      }
      mkdirp(tmpPath, (err)=>{
        if (err) {
          $scope.error = 'Impossible de créer le dossier temp!';
          throw new Error(err);
        }
      });
      let options = {
        url: newValue,
        headers: {
          'User-Agent': 'istex-data-collection'
        }
      };
      let idReq = sha1(newValue.split('api.istex.fr')[1]),
          result = fs.createWriteStream(tmpPath + '/' + idReq + '.json'),
          csvPath =tmpPath + '/' + idReq + '.csv';

      //CheckProxy
      let r = $scope.proxy ? request.defaults({'proxy':'http://proxyout.inist.fr:8080'}) : request.defaults({proxy : false,tunnel: false});
      // Request JSON
      r.get(options)
      .on('response', (response)=> {
        console.log(response.statusCode) // 200
        console.log(response.headers['content-type']) // 'image/png'
      })
      .on('error', (err)=> {
        console.log(err)
        $scope.error = 'Impossible de telecharger le résultat de l\'api';
        throw new Error(err);
        return;
      })
      .pipe(result);

      // Convert2CSV

      result.on('finish', ()=>{
        creatCSV(result.path, (csv)=>{
          console.log(csv)
          fs.writeFile(csvPath,csv,(err)=>{

          })
        });
      })
    }
  });
}

function creatCSV(path,cb){
  let obj = require(path);
  if(obj && (!obj.aggregations)){
    csv.json2csv(obj.hits,(err,csv)=>{
      cb(csv)
    }, optionsCsv);
  }
}