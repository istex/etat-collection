'use strict';

const angular = require('angular'),
      request = require('request'),
      fs = require('fs');

angular
  .module('app', [])
  .controller('appController', ["$scope",appController]);

var r = request.defaults({'proxy':'http://proxyout.inist.fr:8080'})

function appController($scope) {
  $scope.$watch('app.url', function(newValue,oldValue,scope){
    if (newValue !== oldValue){
      $scope.error = "";
      if(!newValue) return;
      if((newValue && (newValue.indexOf('api.istex.fr') < 0))){
        $scope.error = 'Il ne s\'agit pas d\'un lien istex';
        return //throw new Error('Il ne s\'agit pas d\'un lien istex');
      }
      let options = {
        url: newValue,
        headers: {
          'User-Agent': 'ezpaarse'
        }
      };
      console.log(options)
      let result = fs.createWriteStream('test.json');
      r
      .get(options)
      .on('error', function(err) {
        console.log(err)
        $scope.error = 'Impossible de telecharger le résultat de l\'api';
        return
      })
      .pipe(result);
    }
  });
}