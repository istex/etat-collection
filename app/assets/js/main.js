'use strict';

const angular = require('angular'),
      request = require('request-promise');

angular
  .module('app', [])
  .controller('appController', ["$scope",appController]);

function appController($scope) {
  $scope.$watch('app.url', function(newValue,oldValue,scope){
    $scope.error = "";
    if(!newValue || (newValue && (newValue.indexOf('api.istex.fr') < 0))){
      $scope.error = 'Il ne s\'agit pas d\'un lien istex';
      throw new Error('Il ne s\'agit pas d\'un lien istex');
    }
    let options = {
      url: newValue,
      headers: {
        'User-Agent': 'IE13:istex-data-collection'
      }
    };
    request.get(options)
    .then(function (body) {

    })
    .catch(function (err) {
      $scope.error = 'Impossible de telecharger le résultat de l\'api';
      throw new Error('Impossible de telecharger le résultat de l\'api', err);
    });
  });
}