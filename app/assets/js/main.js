'use strict';

const angular = require('angular'),
      request = require('request'),
      //progress = require('progress-stream'),
      fs = require('fs');

angular
  .module('app', [])
  .controller('appController', ["$scope",appController]);

var r = request.defaults({'proxy':'http://proxyout.inist.fr:8080'});

function appController($scope) {
  $scope.$watch('app.url', function(newValue,oldValue,scope){
    if (newValue !== oldValue){
      console.log("test")
      $scope.error = '';
      $scope.bodyClass = '';
      if(!newValue) return;
      if((newValue && (newValue.indexOf('api.istex.fr') < 0))){
        $scope.error = 'Il ne s\'agit pas d\'un lien istex';
        $scope.bodyClass = 'badUrl';
        return;
      }
      let options = {
        url: newValue,
        headers: {
          'User-Agent': 'istex-data-collection'
        }
      };
      let result = fs.createWriteStream('test.json');
      r.get(options)
      .on('response', function(response) {
        console.log(response.statusCode) // 200
        console.log(response.headers['content-type']) // 'image/png'
      })
      .on('error', function(err) {
        console.log(err)
        $scope.error = 'Impossible de telecharger le résultat de l\'api';
        return;
      })
      .pipe(result);
    }
  });
}