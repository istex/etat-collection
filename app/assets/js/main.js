'use strict';
// work with https://api.istex.fr/document/?q=language:fre&facet=publicationDate[perYear]&size=0
const angular = require('angular'),
      request = require('request'),
      path = require('path'),
      mkdirp = require('mkdirp'),
      sha1 = require('sha1'),
      csv = require('json-2-csv'),
      csvw = require('csvwriter'),
      c3 = require('c3'),
      fs = require('fs');

const tmpPath = path.resolve(__dirname , '../../tmp');

const paramsCsv = {
  delimiter: ';',
  arrayDelimiter: ',', 
  crlf : true, 
  decimalSeparator : '.', 
  quote : '"', 
  doublequote: true, 
  nullString : '',
  quoteMode : 0, 
  utfBom: true,
  maxDepth : -1, 
  zero : true
}

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
          jsonPath = tmpPath + '/' + idReq + '.json',
          csvPath =tmpPath + '/' + idReq + '.csv',
          result = fs.createWriteStream(jsonPath);

      //CheckProxy
      let r = $scope.proxy ? request.defaults({'proxy':'http://proxyout.inist.fr:8080'}) : request.defaults({proxy : false,tunnel: false});
      // Request JSON
      r.get(options)
      .on('response', (response)=> {
        console.log(response.statusCode) // 200
        console.log(response.headers['content-type']) // 'image/png'
      })
      .on('error', (err)=> {
        $scope.error = 'Impossible de telecharger le résultat de l\'api';
        throw new Error(err);
        return;
      })
      .pipe(result);

      // Convert2CSV

      result.on('finish', ()=>{
        creatCSV(result.path, (csv,obj)=>{
          fs.writeFile(csvPath,csv,(err)=>{
            console.log("obj : ", obj);
            var chart = c3.generate({
              data: {
                json: obj,
                type: 'line',
                keys: {
                  x: 'keyAsString',
                  value: ['docCount']
                }             
              },
              axis: {
                x: {
                  min : 1800,
                  max: 2010  
                }
              }
            });
          })
        });
      })
    }
  });
}

function creatCSV(path,cb){
  let obj = require(path);
  obj = (obj && (!obj.aggregations)) ? obj.hits : obj.aggregations[Object.keys(obj.aggregations)[0]].buckets;
  csvw(obj,paramsCsv,(err,csv)=>{
    cb(csv,obj)
  });
}